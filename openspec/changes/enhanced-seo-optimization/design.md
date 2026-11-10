# Design: Enhanced SEO Optimization

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  SEO Enhancement Layer (integrated with existing rendering)    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Meta Tags & Schemas (React Head Components)             │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • Enhanced Seo.tsx component                            │  │
│  │   - Organization schema (global)                        │  │
│  │   - Person schema (improved)                            │  │
│  │   - WebSite schema                                      │  │
│  │   - Apple/Twitter meta tags                             │  │
│  │   - Resource hints (dns-prefetch, preconnect)           │  │
│  │                                                          │  │
│  │ • New SchemaPage.tsx component                          │  │
│  │   - BreadcrumbList per page                             │  │
│  │   - Page-specific schemas                               │  │
│  │   - Structured data composition                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Static Assets & Config                                  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • /public/favicon/* (package)                           │  │
│  │ • /public/site.webmanifest                              │  │
│  │ • /public/robots.txt                                    │  │
│  │ • config/seo.php (configuration)                        │  │
│  │ • config/schemas.php (schema templates)                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Build-time Generation (npm run build)                   │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • Sitemap generation script (Node.js)                   │  │
│  │ • Reads config/locales.php                              │  │
│  │ • Outputs: /public/sitemap.xml (index)                  │  │
│  │           /public/sitemap-[locale].xml (per locale)     │  │
│  │ • Runs as part of Vite build pipeline                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Runtime Routes (Laravel)                                │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • GET /robots.txt → static file or controller response  │  │
│  │ • GET /sitemap.xml → static file                        │  │
│  │ • GET /sitemap-[locale].xml → static files              │  │
│  │ • GET /.well-known/manifest.json → webmanifest          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Design

### 1. Enhanced Seo Component

**File**: `resources/js/components/Seo.tsx` (refactored)

```
Seo.tsx
├── useGlobalSchemas()
│   ├── Organization schema (static)
│   ├── Person schema (enhanced)
│   └── WebSite schema (with SearchAction)
├── usePageMetaTags()
│   ├── OG tags (+ image, image dimensions)
│   ├── Twitter Card tags
│   └── Apple meta tags
├── useResourceHints()
│   ├── DNS-prefetch (Google Fonts, etc.)
│   ├── Preconnect (critical services)
│   └── Prefetch (next navigation)
└── render()
    └── <Head> with all meta tags
```

**Current state**: Basic implementation with Person schema  
**Enhancement**: Add Organization, WebSite, resource hints, improved meta tags

### 2. SchemaPage Component (New)

**File**: `resources/js/components/SchemaPage.tsx`

Purpose: Per-page structured data (BreadcrumbList, page-specific schemas)

```
SchemaPage.tsx
├── Props
│   ├── page: 'home' | 'about' | 'projects' | 'contact'
│   ├── breadcrumbs?: BreadcrumbItem[]
│   └── additionalSchemas?: JsonLd[]
├── useBreadcrumbList()
│   ├── Reads current page
│   ├── Builds breadcrumb chain
│   └── Includes locale-specific URLs
└── render()
    └── <script type="application/ld+json"> for each schema
```

### 3. Sitemap Generation Script

**File**: `scripts/generate-sitemaps.mjs` (new)

```
generate-sitemaps.mjs
├── readConfig()
│   └── Load config/locales.php
├── generateLocaleRoots()
│   ├── Get base URLs (from .env or config)
│   └── Build locale URLs
├── generateSitemapIndex()
│   ├── Reference all locale sitemaps
│   └── Output: public/sitemap.xml
├── generateLocaleSitemaps()
│   ├── For each locale
│   ├── For each page in config
│   ├── Calculate priority & frequency
│   ├── Get lastmod (from git or config)
│   └── Output: public/sitemap-[locale].xml
└── main()
    └── Called from package.json build script
```

### 4. Configuration Files

**File**: `config/seo.php` (new)

```php
return [
    'organization' => [
        'name' => 'Marc Boreu',
        'url' => env('APP_URL'),
        'logo' => '/images/logo.png',
        'description' => '...',
        'social' => [
            'linkedin' => 'https://linkedin.com/in/...',
            'github' => 'https://github.com/...',
            'twitter' => 'https://twitter.com/...',
        ],
    ],
    'person' => [
        'name' => 'Marc Boreu',
        'jobTitle' => 'Software Developer',
        'image' => '/images/profile.jpg',
    ],
    'images' => [
        'og_fallback' => '/images/og-default.jpg', // 1200x630
        'og_width' => 1200,
        'og_height' => 630,
    ],
    'sitemap' => [
        'priorities' => [
            'home' => 1.0,
            'about' => 0.8,
            'projects' => 0.8,
            'contact' => 0.6,
        ],
        'frequencies' => [
            'home' => 'weekly',
            'about' => 'monthly',
            'projects' => 'weekly',
            'contact' => 'yearly',
        ],
    ],
];
```

**File**: `config/schemas.php` (new)

```php
return [
    'organization' => function() { /* template */ },
    'person' => function() { /* template */ },
    'breadcrumb' => function() { /* template */ },
    'website' => function() { /* template */ },
];
```

### 5. Robots.txt

**File**: `public/robots.txt` (new) or dynamic route

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /storage/
Crawl-delay: 1
Request-rate: 10/1m
Sitemap: https://[domain]/sitemap.xml
```

### 6. Web App Manifest

**File**: `public/site.webmanifest` (new)

```json
{
  "name": "Marc Boreu Portfolio",
  "short_name": "Marc Boreu",
  "description": "Portfolio of Marc Boreu, Software Developer",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#000000",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Integration Points

### 1. React Component Hierarchy

```
Layout.tsx
├── Seo.tsx (enhanced - global schemas)
├── SchemaPage.tsx (per-page schemas)
├── Head (from @inertiajs/react)
└── [Page Content]
```

### 2. Build Pipeline

```
vite.config.ts
├── Prerender entry point
├── Post-build hook
└── Call: node scripts/generate-sitemaps.mjs
    └── Output to public/
```

### 3. Laravel Routes

**Optional** (if not serving static files):

```php
Route::get('/robots.txt', function() {
    return response()->file(public_path('robots.txt'));
});

Route::get('/sitemap.xml', function() {
    return response()->file(public_path('sitemap.xml'));
});
```

## Data Flow

### Sitemap Generation Flow

```
1. npm run build triggers Vite
2. Vite build completes
3. Post-build hook executes: node scripts/generate-sitemaps.mjs
4. Script reads: config/locales.php + config/seo.php
5. Script generates: public/sitemap.xml, public/sitemap-[locale].xml
6. Static files served by Laravel at /sitemap.xml, /sitemap-[locale].xml
7. Search engines discover via robots.txt reference
```

### Meta Tag Flow

```
1. User requests /en/projects
2. Laravel PageController renders Inertia page
3. React hydrates on client
4. Layout wraps all pages
5. Seo.tsx renders global schemas (Organization, WebSite)
6. SchemaPage.tsx renders page-specific schemas (BreadcrumbList)
7. Inertia Head component injects all <meta>, <link>, <script> tags
8. Search engines crawl initial HTML with full metadata
```

## Performance Considerations

1. **Sitemap generation** - Runs once at build time, outputs static files
2. **JSON-LD schemas** - Included in HTML, no runtime overhead (static rendering during SSR)
3. **Resource hints** - Minimal payload, improves page load
4. **Meta tags** - Already part of Seo component, no additional rendering cost

## Security Considerations

1. **robots.txt** - Doesn't expose sensitive URLs (uses disallow patterns)
2. **Sitemap** - Public URLs only, no authentication required
3. **Schemas** - No sensitive data in structured data
4. **Manifest** - No sensitive configuration

## Backwards Compatibility

- Enhances existing Seo.tsx without breaking changes
- New components (SchemaPage) are additive
- Static files (favicon, manifest) are new
- No modifications to routing or core rendering
