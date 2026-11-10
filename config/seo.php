<?php

return [
    // Organization Information
    'organization' => [
        'name' => 'Marc Boreu',
        'url' => env('APP_URL', 'https://marcboreu.com'),
        'logo' => env('APP_URL', 'https://marcboreu.com') . '/images/logo.png',
        'description' => 'Full-stack developer and creative technologist',
        'email' => 'contact@marcboreu.com',
        'phone' => null,
    ],

    // Person Information
    'person' => [
        'name' => 'Marc Boreu',
        'title' => 'Full-stack Developer',
        'image' => env('APP_URL', 'https://marcboreu.com') . '/images/profile.jpg',
        'description' => 'Creative technologist passionate about building beautiful, performant web experiences',
        'social_profiles' => [
            'https://linkedin.com/in/marcboreu',
            'https://github.com/marcboreu',
            'https://twitter.com/marcboreu',
        ],
        'email' => 'contact@marcboreu.com',
    ],

    // Open Graph Fallback Image
    'og_fallback_image' => env('OG_IMAGE', env('APP_URL', 'https://marcboreu.com') . '/images/og-image.png'),
    'og_fallback_image_width' => 1200,
    'og_fallback_image_height' => 630,

    // Sitemap Configuration
    'sitemap' => [
        'pages' => [
            'home' => [
                'priority' => 1.0,
                'changefreq' => 'weekly',
            ],
            'about' => [
                'priority' => 0.8,
                'changefreq' => 'monthly',
            ],
            'projects' => [
                'priority' => 0.8,
                'changefreq' => 'weekly',
            ],
            'contact' => [
                'priority' => 0.6,
                'changefreq' => 'yearly',
            ],
        ],
    ],

    // Search Console & Verification
    'google_site_verification' => env('GOOGLE_SITE_VERIFICATION'),

    // Twitter Settings
    'twitter' => [
        'handle' => '@marcboreu',
        'creator' => '@marcboreu',
        'site' => '@marcboreu',
    ],

    // Apple Settings
    'apple' => [
        'icon_precomposed' => false,
        'mobile_web_app_capable' => true,
        'status_bar_style' => 'black-translucent',
        'title' => 'Marc Boreu',
        'theme_color' => '#000000',
    ],
];
