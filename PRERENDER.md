# Prerender en build (hosting solo PHP)

El servidor no ejecuta Node. El HTML de cada pagina se genera en build (tu Mac o CI) y PHP lo sirve en la primera carga. Despues React hidrata y la navegacion es SPA con Inertia.

## Flujo
1. `vite build` genera los assets del cliente (fija la version de Inertia).
2. `php artisan prerender:export` pide a Laravel el objeto de pagina de cada ruta e idioma, usando `APP_URL` como host (`bootstrap/prerender/pages`).
3. `vite build --ssr` genera `bootstrap/ssr/ssr.js`, que exporta `render()`.
4. `node scripts/prerender.mjs` renderiza cada pagina y escribe `bootstrap/prerender/html/*.json` (head + body).
5. En produccion, `App\Ssr\PrerenderGateway` sustituye al gateway HTTP de Inertia (`Inertia\Ssr\Gateway`) y devuelve ese HTML desde disco. Si falta el fichero o la version de assets no coincide, devuelve `null` y la pagina se renderiza en cliente.

## Activacion (una vez)
Provider en `bootstrap/providers.php` y middleware en `bootstrap/app.php` (ver README). En el `.env` de produccion: `APP_URL=https://marcboreu.com`.

## Build
```bash
APP_URL=https://marcboreu.com bash scripts/build-prerender.sh
```
Requisitos en la maquina de build: Node 22+, PHP 8.2+, Composer y un `.env` con `APP_KEY`. Sube al servidor el codigo PHP, `public/build` y `bootstrap/prerender`. No hace falta Node en el servidor.

## Comprobar
```bash
curl -s https://marcboreu.com/es | grep -o '<h1[^>]*>[^<]*'
curl -s https://marcboreu.com/en/projects | grep -o 'hreflang="[a-z-]*"'
curl -s https://marcboreu.com/es | grep -o 'rel="canonical"[^>]*'
```
Si ves el `<h1>`, los hreflang y un canonical con tu dominio (no `localhost`) sin ejecutar JS, el prerender funciona.

## Limites
- Al cambiar contenido (traducciones, articulos) hay que repetir el build y subir `bootstrap/prerender`.
- El HTML es estatico: no pongas datos de usuario ni CSRF en props compartidas de las paginas publicas.
- El 3D (WebGL) debe cargarse solo en cliente (`WhenMounted` de Inertia v3, o `React.lazy` tras montar) para no romper el render en Node.
- `Inertia\Ssr\Gateway` y `Inertia\Ssr\Response` existen en `inertia-laravel` y el propio paquete cambia el gateway por un doble en sus tests. La firma exacta de `dispatch()` y el constructor de `Response` no se han podido leer aqui: si PHP se queja al arrancar, compara con `vendor/inertiajs/inertia-laravel/src/Ssr/Gateway.php`.
- `Inertia::getVersion()` se usa en el comando de exportacion; si no existe en tu version, sustituyelo por la version que devuelve `HandleInertiaRequests::version()`.
