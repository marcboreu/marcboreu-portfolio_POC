# Spec: SSR & Prerender Integration

## Purpose

Ensure server-side rendering (SSR), client-side rendering (CSR), and static prerendering work together seamlessly for SEO and performance, without conflicts or dropped functionality.

## ADDED Requirements

### Requirement: Server-side rendering handles page hydration

The application must correctly execute server-side rendering to produce initial HTML that React can hydrate on the client.

#### Scenario: SSR generates initial HTML
- **WHEN** the Laravel server receives a request for the home page
- **THEN** the SSR pipeline (`resources/js/ssr.tsx`) is invoked
- **THEN** the Inertia app renders to static HTML string on the server
- **THEN** the HTML includes all necessary data and markup for hydration
- **THEN** no runtime errors occur during server-side rendering

#### Scenario: HTML hydration does not cause double rendering
- **WHEN** the client receives and hydrates the SSR-generated HTML
- **THEN** React detects the existing DOM is valid
- **THEN** React does not discard and rebuild the entire tree (no hydration mismatch errors)
- **THEN** JavaScript attaches event handlers and interactivity to the existing DOM

### Requirement: Client-side rendering works when SSR is unavailable

The application must fall back to client-side rendering if SSR is not available or fails.

#### Scenario: CSR in development or without SSR
- **WHEN** the application runs without an active SSR server
- **THEN** `resources/js/app.tsx` initializes Inertia in CSR mode
- **THEN** the client fetches the Inertia page component and props via XHR
- **THEN** React renders the page on the client
- **THEN** the page becomes interactive

### Requirement: Static prerendering captures pages for SEO

Static HTML files must be generated for search engine crawlers to index, without breaking the dynamic SPA.

#### Scenario: Prerender generates static home page
- **WHEN** the build process runs prerendering (e.g., `npm run build`)
- **THEN** the prerender pipeline (`resources/js/prerender.tsx`) executes
- **THEN** the home page is rendered to a static HTML file (e.g., `bootstrap/prerender/html/index.html`)
- **THEN** the static HTML contains all SEO metadata (title, meta tags, hreflang links)
- **THEN** search engine crawlers can index the page content from the static file

#### Scenario: Prerendered pages coexist with dynamic SPA
- **WHEN** a user navigates via the dynamic SPA after initial load
- **THEN** the static prerendered files do not interfere with SPA navigation
- **THEN** non-prerendered pages still work via the dynamic Inertia/SSR pipeline
- **THEN** browser caching strategies respect both static and dynamic content

### Requirement: Locale routing is preserved in all rendering modes

The locale structure must work consistently across SSR, CSR, and prerendering.

#### Scenario: Home page respects locale in all modes
- **WHEN** the home page is rendered via SSR, CSR, or prerendering
- **THEN** the correct locale is applied in all modes
- **THEN** locale-specific metadata (lang attribute, hreflang links) is present
- **THEN** canonical URLs and alternate links point to the correct locale-specific paths

### Requirement: Inertia version and props are consistent

The Inertia page state must be synchronized across all rendering contexts to ensure proper hydration.

#### Scenario: Inertia version matches between server and client
- **WHEN** a page is rendered via SSR and then hydrated on the client
- **THEN** the Inertia version from the server matches the client's version
- **THEN** no "version mismatch" error occurs that would force a full page reload

#### Scenario: Props are serializable and available in all contexts
- **WHEN** Inertia props are passed from Laravel to the client
- **THEN** all props are JSON-serializable
- **THEN** props are available in the SSR context and client context identically
- **THEN** no data is lost or transformed between server and client

### Requirement: Page routing configuration is unified

The route mapping, component resolution, and page configuration must work identically across SSR, CSR, and prerendering.

#### Scenario: Uniform page resolution
- **WHEN** the home page is resolved by the route handler, SSR, CSR, or prerender pipeline
- **THEN** all three find the same Home component
- **THEN** all three use the same Inertia component name mapping (`config('locales.components')`)
- **THEN** no discrepancies exist that would cause rendering differences

### Requirement: No duplicate Inertia initialization

The Inertia application must initialize exactly once per rendering context, without race conditions or conflicts.

#### Scenario: SSR and CSR do not interfere
- **WHEN** the home page goes through SSR for the first user request
- **WHEN** the same client later navigates via CSR within the SPA
- **THEN** the two initialization paths do not conflict
- **THEN** the SPA navigation continues smoothly without re-initializing
