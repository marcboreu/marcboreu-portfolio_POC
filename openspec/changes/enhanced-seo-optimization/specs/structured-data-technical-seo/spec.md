# Structured Data and Technical SEO

## Requirements

### R1: JSON-LD Schemas
The system must emit valid JSON-LD schemas for search engines.

**R1.1 - Organization schema (global)**
- Single Organization schema on all pages
- Properties: name, description, url, logo, sameAs (social profiles)
- Eligibility: Google Knowledge Panel candidate
- Validation: Pass Google Schema Validator

**R1.2 - Person schema (improved)**
- Current implementation: basic Person schema
- Enhanced: add more properties (image, sameAs, jobTitle, knows, projects)
- Scope: primary person (Marc Boreu) with developer details
- Eligibility: Rich snippet in search results

**R1.3 - BreadcrumbList schema (per page)**
- Breadcrumbs: Home > [Page Name]
- Home = home page in current locale
- Properties: position, name, item (URL)
- Example: Home (1) > Projects (2) > Details (3)

**R1.4 - WebSite schema**
- Properties: name, url, potentialAction (SearchAction)
- Enables search box integration in search results
- Single WebSite schema per locale (or global)

**R1.5 - Schema validation**
- All schemas pass Google Rich Results Test
- No schema errors or warnings
- Proper @context and @type usage

### R2: Enhanced Meta Tags
The system must include comprehensive meta tags for social sharing and technical SEO.

**R2.1 - Open Graph tags (improved)**
- Current: og:title, og:description, og:url, og:type, og:locale
- Add: og:image (with fallback), og:image:width, og:image:height, og:site_name
- Image: high-quality brand image or default
- Locale property: use config/locales.php og_locales mapping

**R2.2 - Twitter Card tags**
- Current: twitter:card (summary)
- Add: twitter:creator, twitter:site
- Card type: summary_large_image (with og:image)
- Fallback to og:image if no twitter:image

**R2.3 - Apple meta tags**
- apple-mobile-web-app-capable: yes
- apple-mobile-web-app-status-bar-style: black
- apple-mobile-web-app-title: [brand name]
- apple-touch-icon: [icon.png]

**R2.4 - Technical SEO meta tags**
- viewport: width=device-width, initial-scale=1.0
- theme-color: [brand primary color]
- color-scheme: dark (if applicable)
- robots: index, follow (or specific rules per page)
- canonical: explicit for each page

**R2.5 - Performance & Security**
- X-UA-Compatible: ie=edge
- referrer: strict-origin-when-cross-origin
- Permissions-Policy: (microphone, camera restrictions if needed)

### R3: Resource Hints
The system must include performance-oriented resource hints.

**R3.1 - DNS-prefetch**
- External domains used (fonts, CDNs, analytics)
- Example: <link rel="dns-prefetch" href="//fonts.googleapis.com">

**R3.2 - Preconnect**
- Critical external resources
- Combines DNS + connection optimization

**R3.3 - Prefetch**
- Next page likely navigation (e.g., from home to about)
- Low priority for better performance

**R3.4 - Preload**
- Critical resources for current page
- Fonts, hero images, critical CSS

### R4: Favicon and Branding
The system must provide favicon and icon assets for multi-platform appearance.

**R4.1 - Favicon package**
- favicon.ico (classic, for old browsers)
- favicon-16x16.png, favicon-32x32.png (modern)
- apple-touch-icon-180x180.png (iOS)
- android-chrome-192x192.png (Android)
- android-chrome-512x512.png (Android home screen)
- webmanifest.json (web app manifest)

**R4.2 - Meta links**
- Link rel="icon" type="image/x-icon" href="/favicon.ico"
- Link rel="apple-touch-icon" href="/apple-touch-icon.png"
- Link rel="manifest" href="/site.webmanifest"

**R4.3 - Web App Manifest**
- name, short_name
- description, icons (all variations)
- theme_color, background_color
- display: standalone (PWA-ready)
- start_url: /

### R5: Multi-Language SEO
The system must properly coordinate SEO across all locales.

**R5.1 - Hreflang (existing, verified)**
- All pages have hreflang alternate links to other locales
- Format: <link rel="alternate" hrefLang="[locale]" href="[url]">
- Includes x-default for default locale

**R5.2 - Language tags**
- HTML lang attribute per locale
- og:locale property per locale mapping (es_ES, ca_ES, en_GB)

**R5.3 - Sitemap language variants**
- Each locale has dedicated sitemap
- All sitemaps cross-referenced in sitemap.xml (index)

## Scenarios

### S1: Organization Schema on Home Page
**Given**: User visits home page in any locale  
**When**: Page renders  
**Then**:
- JSON-LD Organization schema present in <head>
- Contains: name ("Marc Boreu"), url, logo, description
- sameAs includes: LinkedIn, GitHub, Twitter URLs
- Passes Google Schema Validator

### S2: BreadcrumbList on Projects Page
**Given**: User visits /en/projects  
**When**: Page renders  
**Then**:
- BreadcrumbList schema: Home (1) > Projects (2)
- Home links to /en, Projects to /en/projects
- Position values sequential
- Google Rich Results Test shows breadcrumbs eligible

### S3: Social Media Sharing
**Given**: User shares home page on Twitter  
**When**: Twitter preview card renders  
**Then**:
- Uses twitter:card (summary_large_image)
- Displays og:image
- Shows title (og:title), description (og:description)
- Card appears with preview thumbnail

### S4: Apple Device Appearance
**Given**: iOS user adds website to home screen  
**When**: App icon appears  
**Then**:
- Uses apple-touch-icon-180x180.png
- apple-mobile-web-app-title displays correctly
- Status bar styled per apple-mobile-web-app-status-bar-style
- Works offline with cached assets

### S5: Google Search Results
**Given**: Page indexed in Google  
**When**: Appears in search results  
**Then**:
- Person schema eligibility shows developer context
- BreadcrumbList shows navigation path
- Organization schema candidates for Knowledge Panel
- Canonical URL prevents duplicates

### S6: Locale-Specific Search
**Given**: Google crawler indexes /es/proyectos  
**When**: Evaluating language version  
**Then**:
- og:locale: es_ES (correct locale variant)
- hreflang link to /ca/projectes (Catalan)
- hreflang link to /en/projects (English)
- Language signals consistent

## Out of Scope (for this spec)

- Rich snippet previews (visual design)
- Video schema (no video content)
- Article/Blog schema (no blog feature)
- E-commerce schema (not applicable)
- Local business schema (personal portfolio)
- AMP versions (focus on modern tech stack)
