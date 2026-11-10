# Spec: SPA Home Rendering

## Purpose

Enable the home page to render correctly as a React component through the Inertia framework while preserving single-page application (SPA) navigation and client-side routing on subsequent navigations.

## ADDED Requirements

### Requirement: Home page renders via Inertia on initial load

The home page must be served by the Laravel application as an Inertia response that hydrates into a React component.

#### Scenario: User navigates to home in a browser
- **WHEN** a user navigates to `/` or `/{locale}` (where locale is a supported language)
- **THEN** the server responds with an HTML page containing the home component hydrated with Inertia props, including:
  - Page metadata (title, canonical URL, alternate locale links)
  - Inertia payload (component name, props, version)
  - Necessary scripts and styles for React hydration
  - Proper HTTP status (200 OK)

#### Scenario: Browser JavaScript is enabled
- **WHEN** the HTML page loads in a browser with JavaScript enabled
- **THEN** React hydrates the existing DOM without a full re-render
- **THEN** SPA navigation is active and subsequent page changes remain client-side

### Requirement: SPA routing remains functional

After the initial page hydration, the application must handle in-app navigation as a single-page application without full page reloads.

#### Scenario: User navigates between pages in the SPA
- **WHEN** a user clicks a link or navigates within the application (e.g., from home to projects)
- **THEN** the browser does NOT perform a full page reload
- **THEN** the URL updates correctly via browser history
- **THEN** the correct React page component renders
- **THEN** the page state updates appropriately

### Requirement: Locale routing is respected

The home page must respect the locale-based routing structure and preserve locale across navigations.

#### Scenario: User accesses home in a specific locale
- **WHEN** a user navigates to `/{locale}/home` (or `/` with language preference detected)
- **THEN** the page renders in the specified locale
- **THEN** locale-specific alternate links are provided for SEO (hreflang)

#### Scenario: Root path redirects to locale-specific home
- **WHEN** a user navigates to `/` without a locale prefix
- **THEN** the server redirects to `/{preferred_locale}` (302 Found or similar)
- **THEN** the home page renders after the redirect with the correct locale

### Requirement: Component exports are compatible with Inertia

The Home.tsx component must export a default React component compatible with Inertia's page resolution system.

#### Scenario: Inertia resolves and renders the Home component
- **WHEN** Inertia attempts to resolve the `Home` page component
- **THEN** the component is found in `resources/js/pages/Home.tsx`
- **THEN** the component is a valid React component that accepts Inertia props
- **THEN** the component renders without errors on the client

### Requirement: Data hydration via Inertia props

The home page receives all necessary data through Inertia props rather than client-side fetches for critical content.

#### Scenario: Page receives data on load
- **WHEN** the home page is rendered via Inertia
- **THEN** all critical page data (page name, alternates, canonical URL, SEO metadata) is included in the Inertia props
- **THEN** the component can use these props to render without additional server requests on first paint
