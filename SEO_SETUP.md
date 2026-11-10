# SEO Setup & Maintenance Guide

This guide explains how to maintain and update the SEO features of the Marc Boreu portfolio as the site evolves.

## Table of Contents

1. [Adding New Pages](#adding-new-pages)
2. [Updating Schemas](#updating-schemas)
3. [Managing Favicon Assets](#managing-favicon-assets)
4. [Maintaining Sitemaps](#maintaining-sitemaps)
5. [Testing After Changes](#testing-after-changes)
6. [Monitoring SEO Performance](#monitoring-seo-performance)

## Adding New Pages

When adding a new page to the portfolio:

### 1. Update Route Configuration

Edit `config/locales.php`:

```php
'routes' => [
    'home' => ['es' => '', 'ca' => '', 'en' => ''],
    'about' => ['es' => 'sobre-mi', 'ca' => 'sobre-mi', 'en' => 'about'],
    'projects' => ['es' => 'proyectos', 'ca' => 'projectes', 'en' => 'projects'],
    'contact' => ['es' => 'contacto', 'ca' => 'contacte', 'en' => 'contact'],
    'new-page' => ['es' => 'nueva-pagina', 'ca' => 'nova-pagina', 'en' => 'new-page'], // Add here
],
```

### 2. Add Page Component

Create `resources/js/pages/NewPage.tsx`:

```tsx
import Layout from "@/components/Layout";

export default function NewPage() {
    return (
        <Layout>
            {/* Your page content */}
        </Layout>
    );
}
```

### 3. Update SEO Config

Edit `config/seo.php` and add priority/frequency:

```php
'sitemap' => [
    'pages' => [
        'home' => ['priority' => 1.0, 'changefreq' => 'weekly'],
        'about' => ['priority' => 0.8, 'changefreq' => 'monthly'],
        'projects' => ['priority' => 0.8, 'changefreq' => 'weekly'],
        'contact' => ['priority' => 0.6, 'changefreq' => 'yearly'],
        'new-page' => ['priority' => 0.7, 'changefreq' => 'monthly'], // Add here
    ],
],
```

### 4. Update PageController Breadcrumbs

Edit `app/Http/Controllers/PageController.php` and add the new page to the breadcrumb logic:

```php
private function generateBreadcrumbs(string $page, string $locale): array
{
    $breadcrumbs = [];
    
    $breadcrumbs[] = [
        'name' => 'Home',
        'url' => url('/'.trim($locale.'/', '/')),
    ];

    if ($page !== 'home') {
        $pageName = match ($page) {
            'about' => 'About',
            'projects' => 'Projects',
            'contact' => 'Contact',
            'new-page' => 'New Page', // Add here
            default => ucfirst($page),
        };
        
        // ... rest of logic
    }

    return $breadcrumbs;
}
```

### 5. Rebuild Sitemaps

Run the build command to regenerate sitemaps:

```bash
npm run build
```

The sitemaps will automatically include the new page in all locale versions.

## Updating Schemas

### Global Organization/Person Schema

Edit `config/seo.php` to update organization information:

```php
'organization' => [
    'name' => 'Marc Boreu',
    'url' => env('APP_URL'),
    'logo' => env('APP_URL') . '/images/logo.png',
    'description' => 'Updated description',
    // ...
],

'person' => [
    'name' => 'Marc Boreu',
    'title' => 'Updated Title',
    'image' => env('APP_URL') . '/images/profile.jpg',
    // ...
],
```

Changes will automatically appear in the global Organization/Person JSON-LD schemas.

### Per-Page Schemas

To customize schemas for specific pages, update `SchemaPage.tsx`:

```tsx
// In resources/js/components/SchemaPage.tsx

export default function SchemaPage({ page, breadcrumbs, title, description, image }: SchemaPageProps) {
    // Add page-specific customizations here
    
    // Example: Different descriptions per page
    const customDescription = page === 'projects' 
        ? 'Check out my latest portfolio projects'
        : description;
    
    // The schema will use customDescription instead
}
```

### Adding New Schema Types

To add a new JSON-LD schema type (e.g., Article, Event):

1. Create a new component: `resources/js/components/SchemaArticle.tsx`
2. Define the schema structure matching schema.org
3. Include it in your page layout
4. Add template function to `config/schemas.php` for reusability

Example:

```tsx
// resources/js/components/SchemaArticle.tsx
import { Head } from "@inertiajs/react";

interface SchemaArticleProps {
    headline: string;
    description: string;
    image?: string;
    datePublished: string;
    dateModified?: string;
}

export default function SchemaArticle({ headline, description, image, datePublished, dateModified }: SchemaArticleProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": headline,
        "description": description,
        "image": image,
        "datePublished": datePublished,
        "dateModified": dateModified || datePublished,
        // ... add other fields
    };

    return (
        <Head>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Head>
    );
}
```

## Managing Favicon Assets

### Updating Favicon Images

When updating your brand logo or favicon:

1. **Prepare Image Assets**
   - Create high-quality PNG versions at required sizes:
     - 16x16 px → `favicon-16x16.png`
     - 32x32 px → `favicon-32x32.png`
     - 180x180 px → `apple-touch-icon.png`
     - 192x192 px → `android-chrome-192x192.png`
     - 512x512 px → `android-chrome-512x512.png`
   - ICO format → `favicon.ico` (can be generated from 32x32 PNG)

2. **Update Files**
   ```bash
   # Copy new favicon files to public/
   cp /path/to/new/favicon-16x16.png public/
   cp /path/to/new/favicon-32x32.png public/
   cp /path/to/new/apple-touch-icon.png public/
   cp /path/to/new/android-chrome-192x192.png public/
   cp /path/to/new/android-chrome-512x512.png public/
   cp /path/to/new/favicon.ico public/
   ```

3. **Update Manifest**
   - If icon dimensions change, update `public/site.webmanifest`
   - Ensure icon references match file names

4. **Clear Browser Cache**
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Or add version parameter: `favicon.ico?v=2`

### Updating Web Manifest

Edit `public/site.webmanifest` to customize PWA behavior:

```json
{
  "name": "Marc Boreu - Full-stack Developer",
  "short_name": "Marc Boreu",
  "description": "Full-stack developer and creative technologist",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff",
  "icons": [
    // Icon definitions
  ]
}
```

**Key Fields**:
- `name`: Full name (shown on home screen)
- `short_name`: Abbreviated name (for space-constrained displays)
- `display`: `standalone` (no browser UI), `fullscreen`, `minimal-ui`, `browser`
- `theme_color`: Color of browser chrome/status bar
- `background_color`: Splash screen color

## Maintaining Sitemaps

### Automatic Sitemap Generation

Sitemaps regenerate automatically on every build:

```bash
npm run build
```

The `scripts/generate-sitemaps.mjs` script:
1. Reads all routes from `config/locales.php`
2. Reads page priorities from `config/seo.php`
3. Generates locale-specific sitemaps
4. Creates sitemap index with all locales
5. Writes files to `public/`

### Manual Sitemap Regeneration

To regenerate sitemaps without a full build:

```bash
node scripts/generate-sitemaps.mjs
```

### Updating Page Priorities

Edit `config/seo.php` to adjust sitemap priorities for crawl optimization:

```php
'sitemap' => [
    'pages' => [
        'home' => ['priority' => 1.0, 'changefreq' => 'weekly'],
        'about' => ['priority' => 0.8, 'changefreq' => 'monthly'],
        'projects' => ['priority' => 0.8, 'changefreq' => 'weekly'],
        'contact' => ['priority' => 0.6, 'changefreq' => 'yearly'],
    ],
],
```

**Priority Scale**: 0.0 to 1.0 (default 0.5)
- 1.0: Most important (home page)
- 0.8: Important (main sections)
- 0.6: Secondary pages
- 0.4-0.5: Less frequently updated
- 0.2: Utility/archive pages

**Change Frequency**: Hint to search engines
- `always`: Content changes constantly
- `hourly`, `daily`, `weekly`: Regular updates
- `monthly`, `yearly`: Infrequent updates
- `never`: Never changes (archived)

### Submitting to Search Engines

After updating sitemaps, submit to search engines:

1. **Google Search Console**
   - Sign in at https://search.google.com/search-console
   - Select your property
   - Go to Sitemaps section
   - Submit: `https://yourdomain.com/sitemap.xml`

2. **Bing Webmaster Tools**
   - Sign in at https://www.bing.com/webmasters
   - Submit sitemaps
   - Monitor crawl stats

## Testing After Changes

### Validate XML Sitemaps

After adding pages or updating priorities:

```bash
# Test all sitemaps
curl -I https://yourdomain.com/sitemap.xml
curl -I https://yourdomain.com/sitemap-es.xml
curl -I https://yourdomain.com/sitemap-ca.xml
curl -I https://yourdomain.com/sitemap-en.xml

# Verify XML format
curl https://yourdomain.com/sitemap.xml | xmllint --noout -
```

### Validate JSON-LD Schemas

1. Use Google Rich Results Test: https://search.google.com/test/rich-results
2. Use Schema.org Validator: https://validator.schema.org/
3. Copy page source and paste schema JSON-LD into validator

Expected schemas:
- Organization (global)
- Person (global)
- WebSite (global)
- BreadcrumbList (per page, non-home)
- WebPage (per page)

### Check robots.txt

```bash
curl https://yourdomain.com/robots.txt

# Should show:
# User-agent: *
# Allow: /
# Disallow: /admin/, /api/, /storage/
# Crawl-delay: 1
# Sitemap: https://yourdomain.com/sitemap.xml
```

### Build Verification

```bash
# Run full build
npm run build

# Check for errors
# Verify sitemaps were generated
ls -la public/sitemap*.xml

# Start dev server and test pages
npm run dev
```

## Monitoring SEO Performance

### Google Search Console

1. Set up property: https://search.google.com/search-console
2. Monitor:
   - **Coverage**: Are all pages indexed?
   - **Indexing**: Any errors or excluded pages?
   - **Sitemaps**: Submitted? Indexed?
   - **URL Inspection**: Specific page status
   - **Rich Results**: Schemas validated?
   - **Core Web Vitals**: Performance metrics

### Lighthouse Audits

Run regular SEO audits:

```bash
# In Chrome DevTools
# 1. Open DevTools (F12)
# 2. Go to Lighthouse tab
# 3. Audit SEO
# 4. Target SEO score 90+
```

Key metrics:
- Meta descriptions (all pages)
- Links have descriptive text
- Responsive mobile design
- Fonts readable
- Crawlable structure

### Google PageSpeed Insights

Test at https://pagespeed.web.dev/:

- Enter your domain
- Get SEO, Performance, Best Practices scores
- Review suggestions
- Track improvements over time

### Monitoring Checklist

**Monthly**:
- [ ] GSC - Check indexing coverage
- [ ] GSC - Review search performance trends
- [ ] Lighthouse - Run SEO audit
- [ ] Check for crawl errors

**Quarterly**:
- [ ] PageSpeed Insights audit
- [ ] Rich Results validation
- [ ] Sitemap completeness review
- [ ] Broken link check

**After Any Changes**:
- [ ] Rebuild sitemaps: `npm run build`
- [ ] Validate new pages in GSC
- [ ] Run Lighthouse audit
- [ ] Test schema validation
- [ ] Check hreflang tags

## Troubleshooting

### Sitemaps Not Generating

**Problem**: Sitemaps missing after build

**Solution**:
1. Check build output: `npm run build 2>&1 | grep sitemap`
2. Verify `scripts/generate-sitemaps.mjs` exists
3. Check `config/locales.php` has routes defined
4. Verify `package.json` build script includes sitemap generation
5. Check `public/` directory is writable

### Pages Not Indexing

**Problem**: New pages don't appear in search results

**Solution**:
1. Rebuild sitemaps: `npm run build`
2. Submit sitemap in GSC
3. Use URL Inspection in GSC (check if page is discoverable)
4. Verify page has meta description
5. Check robots.txt isn't blocking page
6. Wait 24-48 hours for Google to crawl

### Schema Validation Errors

**Problem**: JSON-LD schemas showing errors

**Solution**:
1. Use validator at https://validator.schema.org/
2. Copy full page source including all <script> tags
3. Check for:
   - Missing required fields
   - Invalid URL formats
   - Malformed JSON
4. Fix in `Seo.tsx` or `SchemaPage.tsx`
5. Clear browser cache and test again

### Favicon Not Updating

**Problem**: Old favicon still showing in browser

**Solution**:
1. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R)
2. Clear browser cache
3. Try different browser
4. Check file uploaded to correct location
5. Add version parameter: `favicon.ico?v=2`
6. Wait 24 hours for CDN cache clear

## Resources

- **Sitemap Protocol**: https://www.sitemaps.org/
- **JSON-LD Schemas**: https://schema.org/
- **Rich Results**: https://developers.google.com/search/docs/appearance/rich-results
- **robots.txt Guide**: https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt
- **SEO Best Practices**: https://developers.google.com/search/docs
- **Google Search Console Help**: https://support.google.com/webmasters

