# Prerender en build (hosting solo PHP)

El servidor de producción ejecuta únicamente PHP. El HTML público se genera durante el build con Node y React; después se suben `public/build` y `bootstrap/prerender`.

## Flujo
1. `php artisan prerender:export` genera los page objects Laravel en `bootstrap/prerender/pages`.
2. `vite build --ssr resources/js/prerender.tsx --outDir bootstrap/prerender-runtime` genera el renderizador estático.
3. `node scripts/prerender.mjs` procesa cada page object y escribe `bootstrap/prerender/html/*.json`.
4. PHP lee `head` y `body` desde disco mediante `PrerenderGateway`.

## Comandos
```bash
npm run build
npm run build:ssr
npx vite build --ssr resources/js/prerender.tsx --outDir bootstrap/prerender-runtime
php artisan optimize:clear
php artisan prerender:export
node scripts/prerender.mjs
```

No se arranca `inertia:start-ssr` en producción y no se necesita Node en el hosting. El renderizador de prerender es independiente del servidor SSR HTTP de Inertia.

`APP_URL` debe ser `https://marcboreu.com` en el build de producción para que canonical y hreflang no apunten a localhost.
