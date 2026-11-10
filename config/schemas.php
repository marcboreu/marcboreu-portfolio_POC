<?php

/**
 * Schema Helper Functions
 * 
 * Provides template functions for generating structured JSON-LD schemas
 * Used in React components via Inertia to inject into <Head>
 */

return [
    /**
     * Generate Organization Schema
     * 
     * Returns structured data for the organization/business entity
     */
    'organization_schema' => function () {
        $seoConfig = config('seo');
        
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => $seoConfig['organization']['name'],
            'url' => $seoConfig['organization']['url'],
            'logo' => $seoConfig['organization']['logo'],
            'description' => $seoConfig['organization']['description'],
            'email' => $seoConfig['organization']['email'],
            'sameAs' => $seoConfig['person']['social_profiles'],
            'contactPoint' => [
                '@type' => 'ContactPoint',
                'email' => $seoConfig['organization']['email'],
                'contactType' => 'Customer Support',
            ],
        ];
    },

    /**
     * Generate Person Schema
     * 
     * Returns structured data for the person/professional
     */
    'person_schema' => function () {
        $seoConfig = config('seo');
        
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Person',
            'name' => $seoConfig['person']['name'],
            'title' => $seoConfig['person']['title'],
            'image' => $seoConfig['person']['image'],
            'description' => $seoConfig['person']['description'],
            'email' => $seoConfig['person']['email'],
            'url' => $seoConfig['organization']['url'],
            'sameAs' => $seoConfig['person']['social_profiles'],
            'jobTitle' => $seoConfig['person']['title'],
        ];
    },

    /**
     * Generate Website Schema
     * 
     * Returns structured data for the website with search action
     */
    'website_schema' => function () {
        $seoConfig = config('seo');
        
        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            'url' => $seoConfig['organization']['url'],
            'name' => $seoConfig['organization']['name'],
            'description' => $seoConfig['organization']['description'],
            'potentialAction' => [
                '@type' => 'SearchAction',
                'target' => [
                    '@type' => 'EntryPoint',
                    'urlTemplate' => $seoConfig['organization']['url'] . '/search?q={search_term_string}',
                ],
                'query-input' => 'required name=search_term_string',
            ],
        ];
    },

    /**
     * Generate BreadcrumbList Schema
     * 
     * Returns structured breadcrumb navigation data
     * 
     * @param array $breadcrumbs Array of ['name' => '...', 'url' => '...']
     */
    'breadcrumb_schema' => function ($breadcrumbs) {
        $items = [];
        foreach ($breadcrumbs as $index => $breadcrumb) {
            $items[] = [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'name' => $breadcrumb['name'],
                'item' => $breadcrumb['url'],
            ];
        }
        
        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => $items,
        ];
    },

    /**
     * Generate WebPage Schema
     * 
     * Returns structured data for a specific page
     * 
     * @param string $title Page title
     * @param string $description Page description
     * @param string $url Page URL
     * @param string|null $image Page image URL
     */
    'webpage_schema' => function ($title, $description, $url, $image = null) {
        $seoConfig = config('seo');
        $image = $image ?? $seoConfig['og_fallback_image'];
        
        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebPage',
            'name' => $title,
            'description' => $description,
            'url' => $url,
            'image' => $image,
            'isPartOf' => [
                '@type' => 'WebSite',
                'url' => $seoConfig['organization']['url'],
                'name' => $seoConfig['organization']['name'],
            ],
            'datePublished' => now()->toIso8601String(),
            'dateModified' => now()->toIso8601String(),
            'author' => [
                '@type' => 'Person',
                'name' => $seoConfig['person']['name'],
                'url' => $seoConfig['organization']['url'],
            ],
        ];
    },

    /**
     * Generate Article Schema
     * 
     * Returns structured data for an article/blog post
     * (Included for future extensibility)
     * 
     * @param string $headline Article headline
     * @param string $description Article description
     * @param string $url Article URL
     * @param string|null $image Article image
     */
    'article_schema' => function ($headline, $description, $url, $image = null) {
        $seoConfig = config('seo');
        $image = $image ?? $seoConfig['og_fallback_image'];
        
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Article',
            'headline' => $headline,
            'description' => $description,
            'url' => $url,
            'image' => $image,
            'author' => [
                '@type' => 'Person',
                'name' => $seoConfig['person']['name'],
                'url' => $seoConfig['organization']['url'],
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => $seoConfig['organization']['name'],
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => $seoConfig['organization']['logo'],
                ],
            ],
            'datePublished' => now()->toIso8601String(),
            'dateModified' => now()->toIso8601String(),
        ];
    },
];
