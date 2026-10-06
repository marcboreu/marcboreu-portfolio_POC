<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'locale' => fn () => app()->getLocale(),
            'locales' => config('locales.supported'),
            'messages' => fn () => __('site'),
            'urls' => fn () => collect(config('locales.routes'))
                ->map(fn ($slugs) => url('/'.trim(app()->getLocale().'/'.$slugs[app()->getLocale()], '/')))
                ->all(),
        ];
    }
}
