<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $locales = config('locales.supported');
        $xml = '<?xml version="1.0" encoding="UTF-8"?>'
            .'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';

        foreach (config('locales.routes') as $slugs) {
            foreach ($locales as $l) {
                $xml .= '<url><loc>'.url('/'.trim($l.'/'.$slugs[$l], '/')).'</loc>';
                foreach ($locales as $alt) {
                    $xml .= '<xhtml:link rel="alternate" hreflang="'.$alt.'" href="'.url('/'.trim($alt.'/'.$slugs[$alt], '/')).'"/>';
                }
                $xml .= '<xhtml:link rel="alternate" hreflang="x-default" href="'.url('/'.trim(config('locales.default').'/'.$slugs[config('locales.default')], '/')).'"/>';
                $xml .= '</url>';
            }
        }

        return response($xml.'</urlset>', 200, ['Content-Type' => 'application/xml']);
    }
}
