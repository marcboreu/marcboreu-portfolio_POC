<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function show(string $locale, string $page): Response
    {
        $routes = config('locales.routes')[$page];

        $alternates = [];
        foreach (config('locales.supported') as $l) {
            $alternates[$l] = url('/'.trim($l.'/'.$routes[$l], '/'));
        }

        // Generate breadcrumbs for the current page
        $breadcrumbs = $this->generateBreadcrumbs($page, $locale);

        return Inertia::render(config('locales.components')[$page], [
            'page' => $page,
            'alternates' => $alternates,
            'canonical' => $alternates[$locale],
            'ogLocale' => config('locales.og_locales')[$locale],
            'breadcrumbs' => $breadcrumbs,
        ]);
    }

    /**
     * Generate breadcrumb navigation for a page
     */
    private function generateBreadcrumbs(string $page, string $locale): array
    {
        $breadcrumbs = [];
        
        // Home is always the first breadcrumb
        $breadcrumbs[] = [
            'name' => 'Home',
            'url' => url('/'.trim($locale.'/', '/')),
        ];

        // Add current page if not home
        if ($page !== 'home') {
            $pageName = match ($page) {
                'about' => 'About',
                'projects' => 'Projects',
                'contact' => 'Contact',
                default => ucfirst($page),
            };
            
            $routes = config('locales.routes')[$page];
            $breadcrumbs[] = [
                'name' => $pageName,
                'url' => url('/'.trim($locale.'/'.$routes[$locale], '/')),
            ];
        }

        return $breadcrumbs;
    }
}

