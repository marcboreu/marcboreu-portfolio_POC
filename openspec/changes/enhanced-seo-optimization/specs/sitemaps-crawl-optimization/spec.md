# Sitemaps and Crawl Optimization

## Requirements

### R1: XML Sitemap Generation
The system must generate XML sitemaps for all pages in all supported locales (es, ca, en).

**R1.1 - Sitemap structure**
- Each sitemap.xml file lists pages with: URL, last modification date, change frequency, priority
- Sitemap format: standard XML Sitemap Protocol (https://www.sitemaps.org/)
- Compression: optional GZIP (.xml.gz)

**R1.2 - Multi-language sitemaps**
- Generate separate sitemaps per locale: sitemap-es.xml, sitemap-ca.xml, sitemap-en.xml
- Each includes only pages for that locale
- URLs match router configuration in config/locales.php

**R1.3 - Sitemap index**
- Root sitemap.xml routes to individual locale sitemaps
- Index includes all locale variants
- Index updates when any locale adds/removes pages

**R1.4 - Automatic generation**
- Sitemaps regenerate on every build (`npm run build`)
- Last-Modified reflects actual page modification dates (from git history or config timestamps)
- Deployable to public/ directory

**R1.5 - Sitemap discovery**
- Sitemaps serve at: /sitemap.xml, /sitemap-es.xml, /sitemap-ca.xml, /sitemap-en.xml
- robots.txt references root sitemap

### R2: Robots.txt Configuration
The system must serve an optimized robots.txt file at `/robots.txt`.

**R2.1 - Robots directives**
- User-agent: * (all crawlers)
- Allow: / (allow crawling entire site)
- Disallow: /admin/* (if admin routes exist)
- Disallow: /api/* (API routes)
- Disallow: /storage/* (private files)

**R2.2 - Crawl rate**
- Crawl-delay: 1 (respect rate limiting)
- Request-rate: 10 requests per minute (for aggressive crawlers)

**R2.3 - Sitemap reference**
- Sitemap: https://[domain]/sitemap.xml

**R2.4 - Serve at root**
- robots.txt serves at /robots.txt via Laravel route or static file
- Returns 200 OK with text/plain content-type

### R3: Crawl Optimization
The system must optimize crawlability and search engine efficiency.

**R3.1 - Page prioritization**
- Home page (location priority 1.0)
- Important pages (about, projects) - priority 0.8
- Secondary pages (contact) - priority 0.6
- Translated pages inherit parent priority

**R3.2 - Change frequency hints**
- Home: weekly (changes frequently)
- About: monthly (stable content)
- Projects: weekly (portfolio updates)
- Contact: yearly (unlikely to change)

**R3.3 - Modification dates**
- Tracked from file modification time
- Or manually configured in metadata
- Format: YYYY-MM-DDTHH:MM:SS+00:00 (W3C standard)

## Scenarios

### S1: Initial Sitemap Generation
**Given**: Fresh build with home, about, projects, contact pages  
**When**: Running `npm run build`  
**Then**:
- sitemap.xml (index) generated with 3 locale references
- sitemap-es.xml, sitemap-ca.xml, sitemap-en.xml generated
- Each sitemap contains 4 page entries
- Total entries: 12 URLs (4 pages × 3 locales)
- robots.txt generated with sitemap reference

### S2: Sitemap URL Generation
**Given**: config/locales.php defines routes for all locales  
**When**: Generating sitemap-en.xml  
**Then**:
- Home: https://[domain]/en (priority 1.0)
- About: https://[domain]/en/about (priority 0.8)
- Projects: https://[domain]/en/projects (priority 0.8)
- Contact: https://[domain]/en/contact (priority 0.6)

### S3: Multi-locale Hreflang in Sitemaps
**Given**: Same page exists in multiple locales  
**When**: Generating sitemap  
**Then**:
- Spanish home: https://[domain]/es (default locale indicator)
- Catalan home: https://[domain]/ca
- English home: https://[domain]/en
- All referenced with correct language codes

### S4: New Page Addition
**Given**: New "Services" page added to config/locales.php  
**When**: Running `npm run build`  
**Then**:
- Sitemaps regenerate
- New page added to all 3 locale sitemaps
- sitemap.xml (index) updates modification date
- Old sitemaps superseded

### S5: Crawler Access
**Given**: Search engine crawler visits /robots.txt  
**When**: Crawler parses directives  
**Then**:
- Sees allow: / (can crawl site)
- Sees sitemap reference
- Respects crawl-delay: 1
- Follows to sitemap.xml for URL discovery

### S6: Search Engine Indexing
**Given**: Google Search Console registered  
**When**: Sitemap submitted to GSC  
**Then**:
- All 12 URLs discover-able
- Crawl budget optimized via priority hints
- Last-Modified helps with incremental crawling
- Change frequency guides revisit rate

## Out of Scope (for this spec)

- Dynamic sitemap updates (refresh on content change during runtime)
- Sitemap compression (GZIP) - can be added later
- News, Video, Image sitemaps - requires media content
- Mobile sitemap variations - not needed for current pages
- Sitemap size limits (currently < 50KB easily)
