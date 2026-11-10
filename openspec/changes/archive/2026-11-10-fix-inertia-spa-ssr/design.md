# Design: Fix Inertia SPA & SSR Home Rendering

## Context

The application uses a multi-layer rendering architecture:

1. **Laravel backend** handles HTTP routing and locale negotiation
2. **Inertia** bridges Laravel and React, managing server props and page resolution
3. **React SPA** provides client-side navigation and interactivity after hydration
4. **Vite** bundles separate entry points: `app.tsx` (CSR), `ssr.tsx` (SSR), `prerender.tsx` (static)

Currently, the home page fails to render correctly because:
- The route configuration maps to `Inertia::render()` with a component name from config
- The component resolution in `app.tsx` and `ssr.tsx` may not match the expected component names
- SSR, CSR, and prerender pipelines have inconsistent initialization or component lookup
- Potential mismatch between the locale routing (which redirects `/` → `/{locale}`) and the home component resolution

## Goals / Non-Goals

**Goals:**
- Home page renders correctly on initial load (server-side HTML)
- React hydrates the home page without errors
- SPA navigation remains functional after hydration
- SSR pipeline works for the home page
- Prerendering captures the home page for SEO
- Locale routing is respected in all rendering modes
- No breaking changes to existing route structure or components

**Non-Goals:**
- Refactoring the entire routing system (keep the current locale-based structure)
- Changing the Inertia component naming convention
- Modifying the page component structure beyond what's necessary for rendering
- Moving page files or restructuring the pages directory

## Decisions

### Decision 1: Unified component resolution across rendering modes

**Choice:** Ensure `app.tsx`, `ssr.tsx`, and `prerender.tsx` all use the exact same component resolution logic, fetching pages from `./pages/**/*.tsx` using eager imports where needed.

**Rationale:** 
- SSR and CSR use different import strategies; SSR must use eager imports to inline components for server execution
- Prerender also needs eager imports to execute in Node.js
- Any mismatch between these strategies causes the "page not found" error

**Alternatives considered:**
- Separate component registries for SSR vs. CSR → adds complexity and sync burden
- Dynamic imports for SSR → not feasible in a Node.js context without eval
- Lazy-load pages on client only → breaks SSR and prerender

### Decision 2: Route-to-component mapping in Laravel config

**Choice:** Ensure `config/locales.php` maps each route key (e.g., "home") to the correct React component name (e.g., "Home") under the `components` array.

**Rationale:**
- `PageController::show()` uses `config('locales.components')[$page]` to resolve the component
- Without a correct mapping, Inertia sends the wrong component name to the client
- The config is the single source of truth for this mapping

**Alternatives considered:**
- Auto-detect component names from the route key → fragile, prone to case mismatches
- Hard-code component names in the controller → not maintainable across routes
- Use a route model → adds unnecessary indirection

### Decision 3: Separate entry points with clear boundaries

**Choice:** Maintain three distinct Vite entry points:
- `app.tsx`: Client-side rendering (CSR) via `createRoot()` and client-side hydration
- `ssr.tsx`: Server-side rendering via `createServer()` and `renderToString()`
- `prerender.tsx`: Static rendering for build-time HTML generation

Each entry point handles its specific context independently.

**Rationale:**
- Each has different requirements (async/sync, bundling, imports)
- Separate entry points avoid tangled conditional logic
- The build process compiles them separately, reducing bundle size for CSR

**Alternatives considered:**
- Single entry point with runtime detection → complicates module resolution and async boundaries
- Server-only rendering then client JavaScript injection → ignores SPA navigation needs

### Decision 4: Hydration boundary clarity

**Choice:** Mark hydration boundaries explicitly:
- Vite injects Inertia props into the HTML via `@inertiaHead` and `@inertia` Blade directives
- React attaches to the existing DOM in `app.tsx` using `hydrateRoot()` (if appropriate) or `createRoot()` with existing `#app` element
- No full re-render occurs if the DOM is already present

**Rationale:**
- Clarifies when CSR vs. SSR vs. prerender is active
- Prevents hydration mismatches by being explicit about prop passing
- Ensures SPA navigation works after hydration by keeping React's event handling attached

**Alternatives considered:**
- Force full re-render on the client → breaks hydration and causes duplicate DOM operations
- Skip hydration and always fetch props → defeats the purpose of SSR

### Decision 5: Prerender execution mode

**Choice:** Prerendering runs at build time with `renderPage()` function that:
- Uses eager imports for component resolution
- Calls `createInertiaApp()` synchronously
- Returns both rendered HTML and head tags separately
- Writes static files to `bootstrap/prerender/html/`

Prerendering does not interfere with the runtime Inertia/SSR pipeline.

**Rationale:**
- Build-time prerendering generates static files that search engines can index
- Build-time execution avoids runtime overhead on every request
- Separation from runtime rendering means prerendered pages can be cached and served statically without dynamic data concerns

**Alternatives considered:**
- Runtime rendering on-demand → adds latency to every request; not true "prerendering"
- Single shared function for runtime and build-time → mixing concerns; build-time doesn't need async handling

### Decision 6: Locale preservation across rendering modes

**Choice:** 
- Pass locale as an Inertia prop from the Laravel controller
- Use that prop in React components for display and alternate links
- Do not rely on URL parameters or query strings to determine locale in client-side rendering

**Rationale:**
- Inertia props are the canonical way to pass server-determined state to the client
- Locale is determined at route time by Laravel; client should not re-negotiate it
- SPA navigation can then use the prop to construct locale-aware links

**Alternatives considered:**
- Extract locale from URL on client → fragile if URL structure changes; duplicates server logic
- Negotiate locale at each client navigation → breaks the locale negotiation guarantees

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Hydration mismatch if SSR and CSR produce different HTML** | Page flicker, loss of interactivity, console errors | Validate that both rendering paths use identical component resolution and props |
| **Prerendered pages become stale if data changes** | SEO stale content | Prerendering is for static home/landing pages; dynamic data pages fall back to SSR/CSR |
| **Component not found in eager imports** | SSR and prerender fail silently or with cryptic errors | Ensure all page components exist in `resources/js/pages/` with correct casing |
| **Config mapping missing a locale or component** | User sees 500 error or blank page | Validate config completeness in tests; sync config with actual routes |
| **Vite doesn't recompile SSR on changes during dev** | Dev server stale; SSR sees old code | Enable Vite's HMR for SSR bundle if available; document dev workflow |
| **Prerender script breaks if a page component has errors** | Entire static build fails | Wrap prerender script with error handling; fail loudly with page name and error details |
| **CSR hydration fails if JavaScript bundle doesn't load** | Page is non-interactive without JavaScript | This is a limitation; no mitigation. Ensure fallback for no-JS is acceptable (graceful degradation) |

## Migration Plan

1. **Validate current config** (no code changes yet):
   - Check `config/locales.php` for `components` mapping
   - Verify `components['home']` maps to `'Home'` (or the correct component name)

2. **Ensure component resolution is synchronized**:
   - Update `app.tsx` to use the same glob pattern as `ssr.tsx`
   - Test that both `app.tsx` and `ssr.tsx` can resolve pages with identical logic

3. **Update route mapping** (if needed):
   - Ensure the `PageController` receives the correct `page` default (e.g., `'home'` for `/`)
   - Verify the route key matches the config key

4. **Validate SSR on the dev server**:
   - Start the Vite dev server with SSR enabled
   - Test that `/en` and `/es` render the home page via SSR
   - Check browser console for hydration warnings

5. **Test SPA navigation**:
   - Load the home page
   - Click a link to another page (e.g., `/en/projects`)
   - Verify the URL updates without a full page reload

6. **Validate prerendering** (if in use):
   - Run the prerender build script
   - Check that `bootstrap/prerender/html/` contains static home pages
   - Verify the static HTML is valid and contains expected content

7. **Deploy**:
   - Merge changes to main branch
   - Run `npm run build` and `php artisan optimize` in production
   - Monitor logs for any Inertia version mismatches or component resolution errors

## Open Questions

- **Env vars for SSR/prerender**: Are there any environment-specific configurations that affect which entry point or rendering mode is active? (Deferred: can be answered during implementation if tests or dev workflow reveals a need)
- **Caching strategy for prerendered pages**: Should prerendered static files be served by a middleware or by web server configuration? (Deferred: implementation detail after prerender works)
- **Component prop validation**: Should we add TypeScript prop validation to ensure all components receive Inertia props correctly? (Deferred: can be addressed in a follow-up quality improvement)
