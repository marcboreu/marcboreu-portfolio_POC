# Proposal: Fix Inertia SPA & SSR Home Rendering

## Why

The application's home page fails to render correctly when using the Laravel + Inertia + React SPA architecture. The current setup has conflicting rendering strategies that prevent proper integration between Laravel's route handling, Inertia's server-side rendering, React's client-side SPA routing, and SEO prerendering. This breaks the user experience on the initial home page load while losing the ability to maintain a functional SPA with proper SEO support.

## What Changes

- **Unified rendering architecture** that coordinates Laravel route handling, Inertia server-side rendering, and React SPA routing
- **Home page component** properly integrated with Inertia and rendered through the correct pipeline (CSR on client, SSR on server, prerendered for SEO)
- **Correct route configuration** in Laravel that maps the home locale routes to the React Home component via Inertia
- **SSR/CSR boundary clarification** to ensure the app hydrates correctly on the client while maintaining SPA navigation
- **Prerender integration** that properly captures the home page for static SEO content without breaking dynamic SPA routing
- **Locale-aware routing** that preserves the current redirect `/` → `/{locale}` strategy while ensuring home renders on both paths

## Capabilities

### New Capabilities

- `spa-home-rendering`: Render the home page correctly using React + Inertia within the Laravel application, maintaining SPA navigation and client-side routing after initial page load
- `ssr-prerender-integration`: Coordinate server-side rendering (SSR), client-side rendering (CSR), and static prerendering for SEO while preserving all three modes without conflicts

### Modified Capabilities

(None - this is a new feature area)

## Impact

- **Affected Code**: 
  - Laravel routes (`routes/web.php`)
  - Page controller (`app/Http/Controllers/PageController.php`)
  - Locale configuration (`config/locales.php`)
  - React app entry point (`resources/js/app.tsx`)
  - SSR entry point (`resources/js/ssr.tsx`)
  - Prerender entry point (`resources/js/prerender.tsx`)
  - Home component (`resources/js/pages/Home.tsx`)
  - View template (`resources/views/app.blade.php`)

- **Affected Systems**:
  - HTTP routing and locale negotiation
  - Server-side rendering pipeline
  - Client-side hydration
  - Static prerendering for SEO
  - SPA navigation and routing

- **No breaking changes** to the public API or existing page structure; fixes internal rendering issues
