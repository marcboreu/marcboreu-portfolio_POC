# marcboreu-portfolio

Laravel + Inertia (SSR) + React + TypeScript. Idiomas: es, ca, en.

## Puesta en marcha

```bash
composer global require laravel/installer
laravel new tmp --react   # starter kit React (sin auth si se elige)
# copia el contenido de tmp/ en este repo SIN sobrescribir estos ficheros
npm i && composer install
cp .env.example .env && php artisan key:generate
npm run build:ssr
php artisan inertia:start-ssr   # proceso SSR (node)
php artisan serve
```

Este repo contiene la capa de aplicación (rutas i18n, SSR, SEO, páginas). El esqueleto base de Laravel se añade con el comando anterior.

## Arquitectura
- `config/locales.php`: idiomas y slugs traducidos por página.
- `routes/web.php`: genera `/{locale}/{slug}` para cada página/idioma.
- SSR: primera carga renderizada en Node; navegación posterior SPA con Inertia.
- SEO: title, description, canonical, hreflang, Open Graph, JSON-LD, sitemap.xml.
