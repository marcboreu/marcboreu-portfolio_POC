# Implementation Tasks: Enhanced SEO Optimization

## 1. Configuration Setup

- [x] 1.1 Create `config/seo.php` with organization, person, image, and sitemap settings
  - Verification: File exists with all required keys
  - Dependencies: Requires values for name, URL, logo, social profiles

- [x] 1.2 Create `config/schemas.php` with schema template functions
  - Verification: File exports all schema generator functions
  - Dependencies: config/seo.php must exist

- [x] 1.3 Update `.env` with SEO configuration (APP_URL, OG_IMAGE, etc.)
  - Verification: .env has all SEO-related variables defined
  - Dependencies: None

## 2. Sitemap Generation

- [x] 2.1 Create `scripts/generate-sitemaps.mjs` script
  - Read config/locales.php for page routes
  - Read config/seo.php for priorities and frequencies
  - Generate XML sitemaps for each locale
  - Generate sitemap index (sitemap.xml)
  - Verification: Script runs without errors; outputs XML files
  - Dependencies: config/locales.php, config/seo.php

- [x] 2.2 Update `package.json` build script to call sitemap generation
  - Add post-build hook: `node scripts/generate-sitemaps.mjs`
  - Verification: `npm run build` calls script; sitemaps generated
  - Dependencies: scripts/generate-sitemaps.mjs

- [x] 2.3 Create `public/sitemap.xml` (index) with locale references
  - Verification: File references sitemap-es.xml, sitemap-ca.xml, sitemap-en.xml
  - Dependencies: 2.1, 2.2

- [x] 2.4 Create `public/sitemap-[locale].xml` for each supported locale
  - Verification: Each file contains 4 page entries with priorities and frequencies
  - Dependencies: 2.1, 2.2

- [x] 2.5 Validate sitemaps against XML schema
  - Verification: Sitemaps pass validation; no parse errors
  - Dependencies: 2.3, 2.4

## 3. Robots.txt Configuration

- [x] 3.1 Create `public/robots.txt` with crawler directives
  - Include: User-agent, Allow, Disallow, Crawl-delay, Sitemap reference
  - Verification: robots.txt serves at /robots.txt; contains all directives
  - Dependencies: 2.3 (sitemap reference)

- [x] 3.2 Add Laravel route for robots.txt (optional, if not serving static)
  - Verification: GET /robots.txt returns 200 with text/plain content-type
  - Dependencies: 3.1

- [x] 3.3 Test robots.txt in Google Search Console robots.txt tester
  - Verification: Parser correctly interprets directives
  - Dependencies: 3.1, 3.2

## 4. Enhanced Seo Component

- [x] 4.1 Refactor `resources/js/components/Seo.tsx` to include global schemas
  - Add Organization schema (from config/seo.php)
  - Add WebSite schema with SearchAction
  - Improve Person schema with additional properties
  - Verification: Component renders all schemas in <Head>
  - Dependencies: config/seo.php, config/schemas.php

- [x] 4.2 Add Open Graph image meta tags to Seo component
  - Include og:image, og:image:width, og:image:height
  - Fallback to config/seo.php og_fallback
  - Verification: Meta tags render with correct image URL and dimensions
  - Dependencies: config/seo.php

- [x] 4.3 Add Twitter Card meta tags to Seo component
  - Include twitter:creator, twitter:site, twitter:card
  - Verification: Meta tags render with Twitter properties
  - Dependencies: 4.2 (uses og:image)

- [x] 4.4 Add Apple meta tags to Seo component
  - Include apple-mobile-web-app-capable, status-bar-style, title
  - Verification: Meta tags render; iOS app-capable markers present
  - Dependencies: None

- [x] 4.5 Add resource hints to Seo component
  - DNS-prefetch for external domains (Google Fonts, CDNs)
  - Preconnect for critical services
  - Prefetch for next-page navigation
  - Verification: Link elements render in <head>
  - Dependencies: None

- [x] 4.6 Add technical SEO meta tags to Seo component
  - viewport, theme-color, color-scheme, robots, referrer
  - X-UA-Compatible, Permissions-Policy (if needed)
  - Verification: Meta tags render; match Seo.tsx type definitions
  - Dependencies: 4.1-4.5

## 5. Per-Page Schema Component

- [x] 5.1 Create `resources/js/components/SchemaPage.tsx` component
  - Accept page name and optional breadcrumbs
  - Render BreadcrumbList schema
  - Verification: Component renders BreadcrumbList JSON-LD in <Head>
  - Dependencies: config/schemas.php

- [x] 5.2 Integrate SchemaPage into Layout component
  - Add SchemaPage call with current page context
  - Pass breadcrumbs from Inertia props
  - Verification: All pages render BreadcrumbList schema
  - Dependencies: 5.1, Layout.tsx

- [x] 5.3 Update PageController to pass page context to Inertia
  - Include page name, breadcrumbs array
  - Verification: Inertia props include page and breadcrumbs
  - Dependencies: None

- [x] 5.4 Test BreadcrumbList schema with Google Rich Results Test
  - Verification: BreadcrumbList eligible for search results
  - Dependencies: 5.2, 5.3

## 6. Favicon and Branding Assets

- [x] 6.1 Generate favicon package (16x16, 32x32, 180x180 PNG)
  - Create from brand logo
  - Include: favicon.ico, favicon-16x16.png, favicon-32x32.png
  - Verification: Files exist in public/; correct dimensions
  - Dependencies: Brand logo source

- [x] 6.2 Generate Android chrome icons (192x192, 512x512 PNG)
  - Verification: Files exist in public/; correct dimensions
  - Dependencies: Brand logo source

- [x] 6.3 Create `public/site.webmanifest` for PWA
  - Include all icon references, theme color, display mode
  - Verification: File is valid JSON; manifest links correct
  - Dependencies: 6.1, 6.2

- [x] 6.4 Add favicon meta links to Layout component
  - Include <link> for all icon variations
  - Include <link rel="manifest"> for webmanifest
  - Verification: <link> elements render in <head>
  - Dependencies: 6.1, 6.2, 6.3

- [x] 6.5 Verify favicon display on browser tabs and bookmarks
  - Verification: Favicon appears correctly in browser UI
  - Dependencies: 6.1, 6.4

## 7. Testing and Validation

- [x] 7.1 Test sitemaps are valid XML
  - Run sitemaps through XML validator
  - Verification: No parse errors; valid Sitemap Protocol format
  - Dependencies: 2.3, 2.4

- [x] 7.2 Test JSON-LD schemas with Google Rich Results Test
  - Verify Organization schema valid
  - Verify Person schema valid
  - Verify BreadcrumbList schema valid
  - Verify WebSite schema valid
  - Verification: All schemas pass Rich Results Test; no errors
  - Dependencies: 4.1-4.6, 5.1-5.4

- [x] 7.3 Test robots.txt with Google Search Console robot tester
  - Verify directives correctly parsed
  - Verify crawl settings applied
  - Verification: GSC tester shows correct interpretation
  - Dependencies: 3.1, 3.3

- [x] 7.4 Test sitemaps in Google Search Console
  - Submit sitemap.xml to GSC
  - Verify all URLs discovered
  - Check coverage and indexing status
  - Verification: GSC shows all 12 URLs in sitemap
  - Dependencies: 2.3, 2.4, 3.1

- [x] 7.5 Test multi-language hreflang consistency
  - Verify hreflang tags in HTML
  - Verify hreflang in sitemap (if applicable)
  - Verify Language alternate coverage
  - Verification: All locales properly linked; no broken alternates
  - Dependencies: 4.1, 2.3-2.4

- [x] 7.6 Test Open Graph and Twitter Card sharing
  - Share pages on Twitter, Facebook, LinkedIn
  - Verify preview cards render correctly
  - Verification: Preview shows correct image, title, description
  - Dependencies: 4.2, 4.3

- [x] 7.7 Test Apple app-like behavior
  - Add to home screen on iOS
  - Verify icon, title, status bar styling
  - Verification: App icon appears; branding consistent
  - Dependencies: 4.4, 6.4

- [x] 7.8 Test resource hints performance
  - Run Lighthouse audit
  - Verify DNS-prefetch and preconnect improve metrics
  - Verification: Lighthouse score improves or stays same
  - Dependencies: 4.5

## 8. Documentation and Finalization

- [x] 8.1 Document SEO implementation in RENDERING_ARCHITECTURE.md
  - Add section on structured data flow
  - Document schema usage per page
  - Verification: File updated with SEO section
  - Dependencies: All tasks complete

- [x] 8.2 Create SEO_SETUP.md guide for future maintenance
  - Document how to update sitemaps when pages change
  - Document how to update schemas
  - Document how to manage favicon assets
  - Verification: Guide created and comprehensive
  - Dependencies: 8.1

- [x] 8.3 Update README.md to mention SEO features
  - Add SEO optimization highlights
  - Link to SEO_SETUP.md
  - Verification: README mentions sitemaps, schemas, robots.txt
  - Dependencies: 8.1, 8.2

- [x] 8.4 Run full build and verify all features work together
  - npm run build completes successfully
  - All sitemaps generated
  - All meta tags render
  - All schemas valid
  - Verification: Build succeeds; no errors or warnings
  - Dependencies: All previous tasks

- [x] 8.5 Final SEO audit with external tools
  - Run Lighthouse audit (SEO score)
  - Run site audit tools (screaming frog, semrush, etc.)
  - Verify crawlability and indexability
  - Verification: No critical issues; SEO score 90+
  - Dependencies: 8.4

## Workflow Follow-up

- After all tasks complete and tests pass, run `openspec status --change "enhanced-seo-optimization"` to mark complete
- Archive the change once testing passes: `openspec archive --change "enhanced-seo-optimization"`
