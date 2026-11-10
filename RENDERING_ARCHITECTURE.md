# Rendering Architecture & Page Addition Guide

## Overview

This project uses a hybrid rendering architecture combining server-side rendering (SSR), client-side rendering (CSR), and static prerendering to balance performance, SEO, and user experience.

## Rendering Modes

### 1. Server-Side Rendering (SSR)

**When**: Initial HTTP request to a page URL (e.g., GET `/en/projects`)

**Process**:
1. User navigates to a URL in their browser
2. Laravel receives the HTTP request
3. Laravel determines the page component from the route parameters
4. Laravel calls the Vite SSR bundle (`resources/js/ssr.tsx`)
5. `ssr.tsx` renders the React component to an HTML string
6. The HTML string is sent to the browser in the initial response

**Advantages**:
- HTML is generated on the server with all data
- Fast first paint (browsers start rendering immediately)
- Good for SEO (search engines receive complete HTML)
- Hydration is seamless if CSR HTML matches

**Entry Point**: `resources/js/ssr.tsx`

### 2. Client-Side Rendering (CSR)

**When**: 
- Browser receives the initial HTML and JavaScript loads
- User navigates between pages within the SPA

**Process**:
1. Browser loads `app.tsx` via Vite
2. React hydrates the existing DOM with the initial HTML
3. When user clicks a link (Inertia link), XHR request is made
4. Server sends only component name and props (no HTML body)
5. React updates the component tree without full page reload

**Advantages**:
- No full page reload, smooth SPA navigation
- Component state can be preserved during navigation
- Only necessary data sent (not full HTML) for subsequent pages

**Entry Point**: `resources/js/app.tsx`

### 3. Static Prerendering

**When**: Build time (before deployment)

**Process**:
1. During the build process, a Node.js script iterates over configured pages
2. For each page, it renders the component to static HTML
3. Static files are written to `bootstrap/prerender/html/`
4. In production, these static files can be served directly by the web server

**Advantages**:
- No server rendering needed for popular pages
- Extremely fast delivery (just static file serving)
- Reduces server load
- Can be cached/served from CDN

**Entry Point**: `resources/js/prerender.tsx`

## Component Resolution

All three rendering modes use the same component resolution strategy:

```
Glob Pattern: ./pages/**/*.tsx
Lookup: pages[`./pages/${name}.tsx`]
Strategy: Eager imports
```

This ensures consistent behavior across all rendering modes.

### How It Works

1. **config/locales.php** maps page keys to component names:
   ```php
   'home' => 'Home',
   'projects' => 'Projects',
   ```

2. **routes/web.php** maps URLs to page keys:
   ```php
   Route::get('en', [PageController::class, 'show'])
       ->defaults('page', 'home')
       ->defaults('locale', 'en');
   ```

3. **PageController.php** resolves the component:
   ```php
   $componentName = config('locales.components')[$page]; // 'Home'
   return Inertia::render($componentName, $props);
   ```

4. **app.tsx, ssr.tsx, prerender.tsx** load the component:
   ```typescript
   const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
   const module = pages[`./pages/${name}.tsx`];
   ```

## Adding a New Page

Follow these steps to add a new page to the application:

### Step 1: Create the React Component

Create a new file in `resources/js/pages/YourPage.tsx`:

```tsx
import { usePage } from "@inertiajs/react";
import Seo from "@/components/Seo";
import { SharedProps, useT } from "@/lib/i18n";

export default function YourPage() {
    const t = useT();
    const { urls } = usePage<SharedProps>().props;

    return (
        <>
            <Seo title="Your Page Title" />
            {/* Your content here */}
        </>
    );
}
```

### Step 2: Add to config/locales.php

Add the page key to the `routes` and `components` arrays:

```php
'routes' => [
    // ... existing routes
    'your-page' => [
        'es' => 'su-pagina',      // Spanish URL slug
        'ca' => 'la-seva-pagina', // Catalan URL slug
        'en' => 'your-page',      // English URL slug
    ],
],
'components' => [
    // ... existing components
    'your-page' => 'YourPage', // Must match component file name exactly
],
```

### Step 3: Update Language Files (Optional)

If your page needs translatable strings, add them to `lang/*/site.php`:

```php
// lang/en/site.php
'your-page' => 'Your Page',
'your-page.title' => 'Welcome to Your Page',
```

### Step 4: Add Links in Navigation

Update the Layout or navigation components to include links to your new page:

```tsx
import { usePage } from "@inertiajs/react";

export default function Layout() {
    const { url } = usePage<SharedProps>().props;
    
    return (
        <a href={url('your-page')}>
            {t('your-page')}
        </a>
    );
}
```

## Route & Locale Resolution

### How Locale is Negotiated

1. **Root Path** (`/`):
   - Server checks `Accept-Language` header
   - Defaults to configured default locale
   - Redirects to `/{locale}` (e.g., `/es`)

2. **Locale-Specific Path** (`/{locale}/{slug}`):
   - `SetLocale` middleware sets the locale
   - `PageController` receives locale and page parameters
   - Locale is passed to React as an Inertia prop

### URL Structure

```
/                 → redirects to /{preferred-locale} (based on Accept-Language)
/{locale}         → home page in that locale
/{locale}/about   → about page in English (example)
/{locale}/proyectos → projects page in Spanish
```

## Hydration & Props

### Initial Page Load (SSR → CSR Hydration)

1. Server generates HTML with component rendered and props embedded
2. Browser receives HTML + Inertia payload
3. React hydrates the DOM with the same component and props
4. Page is immediately interactive

### SPA Navigation

1. User clicks a link (Inertia link component)
2. JavaScript makes an XHR request with new URL
3. Server returns only component name and new props (no HTML body)
4. React updates the component without full page reload

## Development Tips

### Debugging Rendering Issues

**"Page not found" error**:
- Check that component file name matches exactly (case-sensitive)
- Verify `config('locales.components')` mapping is correct
- Ensure the page component is in `resources/js/pages/` directory

**Hydration mismatch**:
- SSR and CSR must produce identical HTML for the same props
- Check for browser-specific code (localStorage, window object) that differs between server and client
- Ensure all data is passed through Inertia props, not fetched dynamically

**Locale not persisting**:
- Check that `SetLocale` middleware is applied to routes
- Verify that locale is included in generated URLs
- Check Inertia props include the current locale

### Testing Rendering Modes

**Test SSR**:
```bash
npm run dev  # Start dev server with SSR
# Navigate to http://localhost:8000/en
# Right-click → View Page Source
# Should see rendered HTML, not just JavaScript
```

**Test CSR**:
```bash
# After page loads, click links
# URL should update without full page reload
```

**Test Prerendering**:
```bash
npm run build
ls bootstrap/prerender/html/
# Should contain static HTML files
```

## Performance Considerations

1. **Use prerendering for**:
   - Home page
   - Static landing pages
   - High-traffic pages that rarely change

2. **Use SSR for**:
   - Dynamic content that varies per request
   - Pages that need up-to-date data
   - Pages with user-specific content

3. **Optimize CSR**:
   - Lazy-load components for non-critical content
   - Use React.memo for expensive components
   - Minimize bundle size with code splitting

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Page shows "not found" | Component not in glob import | Check file name and location matches `resources/js/pages/{ComponentName}.tsx` |
| Hydration mismatch warning | SSR HTML differs from CSR | Ensure all data comes from props, not client-side fetches |
| Locale wrong on page | Incorrect route mapping | Check `config/locales.routes)` maps the page correctly |
| SPA navigation fails | Inertia not configured | Verify Inertia props include component name |
| Prerender missing pages | Build script config | Check build script includes all page components |

## SEO Implementation

### Structured Data & Meta Tags

The application implements comprehensive SEO features integrated with the rendering architecture:

#### Global SEO Configuration

All SEO settings are centralized in configuration files:

- **`config/seo.php`** - Organization, person, and branding information
- **`config/schemas.php`** - Reusable schema template functions
- **`.env`** - Environment-specific SEO variables (APP_URL, OG_IMAGE, etc.)

#### Meta Tag Component

The `Seo.tsx` component manages all global SEO meta tags and schemas:

```
resources/js/components/Seo.tsx
├── Global JSON-LD Schemas
│   ├── Organization (from config/seo.php)
│   ├── Person (creator/author)
│   └── WebSite (with SearchAction)
├── Open Graph Meta Tags
│   ├── og:title, og:description, og:image
│   ├── og:image dimensions (1200x630)
│   └── og:locale (per page)
├── Twitter Card Meta Tags
│   ├── twitter:card (summary_large_image)
│   ├── twitter:creator, twitter:site
│   └── twitter:image
├── Apple Meta Tags
│   ├── apple-mobile-web-app-capable
│   ├── apple-mobile-web-app-status-bar-style
│   └── apple-mobile-web-app-title
├── Technical SEO Meta Tags
│   ├── viewport, theme-color, color-scheme
│   ├── robots (index, follow)
│   └── referrer (strict-origin-when-cross-origin)
├── Resource Hints
│   ├── dns-prefetch (external domains)
│   ├── preconnect (critical services)
│   └── prefetch (navigation optimization)
└── Favicon Links
    ├── favicon.ico, favicon-16x16.png, favicon-32x32.png
    ├── apple-touch-icon.png
    ├── android-chrome-192x192.png, android-chrome-512x512.png
    └── site.webmanifest (PWA manifest)
```

#### Per-Page Schema Component

The `SchemaPage.tsx` component renders page-specific structured data:

```
resources/js/components/SchemaPage.tsx
├── BreadcrumbList Schema
│   ├── Hierarchical breadcrumb navigation
│   ├── SEO-friendly link structure
│   └── Aids search engine understanding of site hierarchy
└── WebPage Schema
    ├── Page-specific title, description, URL
    ├── Image, date published/modified
    └── Author and publisher information
```

#### PageController Integration

The `PageController` generates breadcrumb navigation for each page:

```php
// Generates breadcrumbs like:
// Home > About (for /en/about)
// Home > Projects (for /en/projects)
// etc.
```

### Sitemap Generation

Sitemaps are automatically generated during the build process:

**Build Process**:
```
npm run build
├── Vite builds the application
└── Post-build hook: node scripts/generate-sitemaps.mjs
    ├── Reads config/locales.php for routes
    ├── Reads config/seo.php for priorities/frequencies
    ├── Generates locale-specific sitemaps
    └── Generates sitemap index (sitemap.xml)
```

**Output Files**:
- `public/sitemap.xml` - Index file with locale references
- `public/sitemap-es.xml` - Spanish locale (4 pages)
- `public/sitemap-ca.xml` - Catalan locale (4 pages)
- `public/sitemap-en.xml` - English locale (4 pages)

**Page Priorities**:
- Home: 1.0 (weekly changes)
- About: 0.8 (monthly changes)
- Projects: 0.8 (weekly changes)
- Contact: 0.6 (yearly changes)

### Robots.txt Configuration

The `public/robots.txt` file (served via Laravel route) contains:

```
User-agent: * (all crawlers)
Allow: / (allow full crawl)
Disallow: /admin/, /api/, /storage/ (exclude sensitive paths)
Crawl-delay: 1 (respect server resources)
Request-rate: 10/m (rate limiting)
Sitemap: [domain]/sitemap.xml (crawl hints)
```

### Multi-Language SEO

The application properly handles multi-language SEO:

**Hreflang Tags**: Each page includes alternate links for all supported locales
```html
<link rel="alternate" hreflang="es" href="..." />
<link rel="alternate" hreflang="ca" href="..." />
<link rel="alternate" hreflang="en" href="..." />
<link rel="alternate" hreflang="x-default" href="..." />
```

**Locale-Specific Sitemaps**: Each locale has its own sitemap with proper routing
- Spanish (es): Home at `/`, About at `/es/sobre-mi`
- Catalan (ca): Home at `/`, About at `/ca/sobre-mi`
- English (en): Home at `/en`, About at `/en/about`

**Open Graph Locale**: `og:locale` meta tag set per page based on current locale

### Performance & SEO

Resource hints optimize performance for search engine crawling:

- **DNS-Prefetch**: Resolves DNS early for external domains
- **Preconnect**: Establishes connection to critical services before needed
- **Prefetch**: Hints browser to prefetch resources for next navigation

These reduce latency in rendering, improving Core Web Vitals metrics that affect SEO.

### Testing & Validation

All SEO features have been tested and validated:

See [SEO_TESTING_GUIDE.md](/Users/mboreuto/Desktop/marcboreu-portfolio_POC/openspec/changes/enhanced-seo-optimization/SEO_TESTING_GUIDE.md) for comprehensive testing procedures:
- XML Sitemap validation
- JSON-LD schema validation
- robots.txt compliance
- Multi-language consistency
- Open Graph/Twitter Card rendering
- Resource hint performance impact
- Core Web Vitals monitoring

