<?php

namespace App\Console\Commands;

use App\Ssr\PrerenderGateway;
use Illuminate\Console\Command;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class PrerenderExport extends Command
{
    protected $signature = 'prerender:export';

    protected $description = 'Exporta el objeto de pagina de Inertia de cada ruta e idioma para el prerender';

    public function handle(): int
    {
        config(['session.driver' => 'array']);

        $appUrl = rtrim((string) config('app.url'), '/');

        if ($appUrl === '' || str_contains($appUrl, 'localhost')) {
            $this->warn("APP_URL es '{$appUrl}'. Los canonical y hreflang saldran con ese dominio. Define APP_URL de produccion.");
        }

        $kernel = app(Kernel::class);
        $root = base_path('bootstrap/prerender');
        $dir = $root.'/pages';

        File::deleteDirectory($root);
        File::ensureDirectoryExists($dir);

        $count = 0;

        foreach (config('locales.supported') as $locale) {
            foreach (config('locales.routes') as $slugs) {
                $path = PrerenderGateway::normalize($locale.'/'.$slugs[$locale]);

                $request = Request::create($appUrl.$path, 'GET', [], [], [], [
                    'HTTP_X_INERTIA' => 'true',
                    'HTTP_X_INERTIA_PRERENDER' => 'true',
                    'HTTP_X_REQUESTED_WITH' => 'XMLHttpRequest',
                    'HTTP_ACCEPT' => 'text/html, application/xhtml+xml',
                ]);

                $response = $kernel->handle($request);

                if ($response->getStatusCode() !== 200) {
                    $this->error("{$path} devolvio HTTP {$response->getStatusCode()}");

                    return self::FAILURE;
                }

                $page = json_decode($response->getContent(), true);

                if (! is_array($page)) {
                    $this->error("{$path} no devolvio un page object JSON valido");

                    return self::FAILURE;
                }

                File::put(
                    $dir.'/'.sha1($path).'.json',
                    json_encode(['path' => $path, 'page' => $page], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR)
                );

                $this->line("OK {$path}");
                $count++;
            }
        }

        $this->info("{$count} paginas exportadas");

        return self::SUCCESS;
    }
}
