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

        return Inertia::render(config('locales.components')[$page], [
            'page' => $page,
            'alternates' => $alternates,
            'canonical' => $alternates[$locale],
            'ogLocale' => config('locales.og_locales')[$locale],
        ]);
    }
}
