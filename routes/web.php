<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\SitemapController;
use App\Http\Middleware\SetLocale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$locales = config('locales.supported');

Route::get('/', function (Request $request) use ($locales) {
    $locale = $request->getPreferredLanguage($locales) ?? config('locales.default');

    return redirect("/{$locale}", 302)->header('Vary', 'Accept-Language');
});

Route::get('/sitemap.xml', SitemapController::class);

Route::get('/robots.txt', function () {
    return response(file_get_contents(public_path('robots.txt')), 200, [
        'Content-Type' => 'text/plain; charset=UTF-8',
    ]);
});

Route::middleware(SetLocale::class)->group(function () use ($locales) {
    foreach ($locales as $locale) {
        foreach (config('locales.routes') as $key => $slugs) {
            $uri = trim("{$locale}/{$slugs[$locale]}", '/');

            Route::get($uri, [PageController::class, 'show'])
                ->defaults('locale', $locale)
                ->defaults('page', $key)
                ->name("{$locale}.{$key}");
        }
    }
});
