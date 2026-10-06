<?php

namespace App\Providers;

use App\Ssr\PrerenderGateway;
use Illuminate\Support\ServiceProvider;
use Inertia\Ssr\Gateway;

class PrerenderServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(Gateway::class, PrerenderGateway::class);
    }
}
