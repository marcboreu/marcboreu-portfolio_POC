<?php

namespace App\Ssr;

use Inertia\Ssr\Gateway;
use Inertia\Ssr\Response;

class PrerenderGateway implements Gateway
{
    public function dispatch(array $page): ?Response
    {
        $file = self::fileFor((string) parse_url($page['url'] ?? '/', PHP_URL_PATH));

        if (! is_file($file)) {
            return null;
        }

        $data = json_decode((string) file_get_contents($file), true);

        if (! is_array($data) || ($data['version'] ?? null) !== ($page['version'] ?? null)) {
            return null;
        }

        return new Response(implode("\n", $data['head'] ?? []), $data['body'] ?? '');
    }

    public static function normalize(string $path): string
    {
        return '/'.trim($path, '/');
    }

    public static function fileFor(string $path): string
    {
        return base_path('bootstrap/prerender/html/'.sha1(self::normalize($path)).'.json');
    }
}
