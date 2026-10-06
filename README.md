# marcboreu-portfolio

Portfolio personal con Laravel + Inertia + React + TypeScript, en es / ca / en, con rutas por idioma, SEO por pagina y prerender en build (el hosting solo ejecuta PHP).

Este repo contiene la capa de aplicacion (rutas i18n, SEO, componentes, sistema de diseño CSS propio, prerender). El esqueleto de Laravel se añade con los pasos de abajo.

## Puesta en marcha

```bash
git clone git@github.com:marcboreu/marcboreu-portfolio.git && cd marcboreu-portfolio

# 1. Esqueleto de Laravel sin pisar nuestros ficheros
composer create-project laravel/laravel tmp
rsync -a --ignore-existing tmp/ ./
rm -rf tmp resources/js/app.js resources/js/bootstrap.js vite.config.js resources/views/welcome.blade.php

# 2. Dependencias (sin Tailwind)
composer require inertiajs/inertia-laravel
npm remove tailwindcss @tailwindcss/vite axios
npm i @inertiajs/react react react-dom
npm i -D typescript @types/react @types/react-dom @types/node @vitejs/plugin-react
```

3. Registra el middleware de Inertia en `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->web(append: [\App\Http\Middleware\HandleInertiaRequests::class]);
})
```

4. Registra el provider del prerender en `bootstrap/providers.php`:

```php
App\Providers\PrerenderServiceProvider::class,
```

5. Desarrollo: `composer run dev` (o `php artisan serve` y `npm run dev`).

Detalles del prerender en `PRERENDER.md` y del CSS en `DESIGN_SYSTEM.md`.

## Arquitectura
- `config/locales.php`: idiomas y slugs traducidos por pagina.
- `routes/web.php`: genera `/{locale}/{slug}` para cada pagina e idioma. `/` redirige segun `Accept-Language`. Las URLs desconocidas devuelven 404.
- `lang/{es,ca,en}/site.php`: textos y metadatos SEO; solo se envia al cliente el idioma activo.
- `resources/js/components/Seo.tsx`: title, description, canonical, hreflang, Open Graph y JSON-LD.
- `GET /sitemap.xml` con alternates por idioma.
- Prerender en build: ver `PRERENDER.md`.
