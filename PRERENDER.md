# Prerender en build (hosting solo PHP)

El servidor no ejecuta Node. El HTML de cada pagina se genera en build (tu Mac o CI) y PHP lo sirve en la primera carga. Despues React hidrata y la navegacion es SPA con Inertia.

## Flujo
1. `vite build` genera los assets del cliente (fija la version de Inertia).
2. `php artisan prerender:export` pide a Laravel el objeto de pagina de cada ruta e idioma (`bootstrap/prerender/pages`).
3. `vite build --ssr` genera `bootstrap/ssr/ssr.js`, que exporta `render()`.
4. `node scripts/prerender.mjs` renderiza cada pagina y escribe `bootstrap/prerender/html/*.json` (head + body).
5. En produccion, `App\Ssr\PrerenderGateway` sustituye al gateway HTTP de Inertia y devuelve ese HTML desde disco. Si falta el fichero o la version de assets no coincide, devuelve `null` y la pagina se renderiza en cliente (sin romper nada).

## Activacion (una vez)
1. Anade el provider en `bootstrap/providers.php`:
   ```php
   App\Providers\PrerenderServiceProvider::class,
   ```
2. En `.env` de produccion: `INERTIA_SSR_ENABLED=true` y `APP_URL=https://marcboreu.com`.
3. Requisito: Node 20+ y PHP 8.2+ en la maquina de build.

## Build
```bash
APP_URL=https://marcboreu.com bash scripts/build-prerender.sh
```
Sube al servidor el codigo PHP, `public/build` y `bootstrap/prerender`. No hace falta Node en el servidor.

## Comprobar
```bash
curl -s https://marcboreu.com/es | grep -o '<h1[^>]*>[^<]*'
curl -s https://marcboreu.com/en/projects | grep -o 'hreflang="[a-z-]*"'
```
Si ves el `<h1>` y los hreflang en la respuesta sin ejecutar JS, el prerender funciona.

## Limites
- Al cambiar contenido (traducciones, articulos) hay que repetir el build y subir `bootstrap/prerender`.
- El HTML es estatico: no pongas datos de usuario ni CSRF en props compartidas de las paginas publicas.
- `APP_URL` debe ser el de produccion al exportar, porque los canonical, hreflang y enlaces salen de `url()`.
- El 3D (WebGL) debe cargarse solo en cliente (`React.lazy` dentro de `useEffect`) para no romper el render en Node.
- El gateway y la clase `Response` siguen el contrato de `inertia-laravel` 2.x. Si tu version es 3.x, revisa la firma de `Gateway::dispatch`.
