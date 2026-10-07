# Flujos de desarrollo y producción

## Desarrollo local

Terminal 1:

```bash
php artisan serve
```

Terminal 2:

```bash
npm run dev
```

Para generar el HTML prerenderizado local:

```bash
php artisan prerender:export
npm run prerender:dev
```

Este comando usa `APP_ENV=local` y `APP_URL=http://localhost:8000` por defecto.

## Build de producción

`npm run build` siempre genera un bundle optimizado de producción. Se puede ejecutar localmente para probarlo, pero no inicia ningún servidor.

Para inspeccionarlo localmente:

```bash
npm run build
npm run preview
```

`npm run preview` es solo una previsualización local; no es un servidor de producción.

## Prerender de producción

```bash
npm run build
npx vite build --ssr resources/js/prerender.tsx --outDir bootstrap/prerender-runtime
php artisan config:cache
php artisan prerender:export
APP_URL=https://marcboreu.com npm run prerender:prod
```

`prerender:prod` exige una URL HTTPS y evita generar accidentalmente enlaces absolutos con localhost.
