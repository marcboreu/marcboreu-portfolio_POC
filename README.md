# Marc Boreu Portfolio

Portfolio personal de Marc Boreu construido con Laravel, Inertia, React, TypeScript y Vite.

El proyecto tiene dos flujos claramente separados:

- Desarrollo local: Laravel sirve la aplicación en `localhost` y Vite proporciona HMR.
- Producción: Vite genera assets optimizados y el prerender genera HTML estático con el dominio real.

## Requisitos

- PHP compatible con la versión de Laravel del proyecto.
- Composer.
- Node.js 20 o superior.
- npm.
- SQLite para el entorno local, salvo que se configure otra base de datos.

## Instalación local

```bash
git clone <repository-url>
cd marcboreu-portfolio
composer install
npm install
cp .env.example .env
php artisan key:generate
mkdir -p database
touch database/database.sqlite
php artisan migrate
```

Configura `.env` local con valores similares a estos:

```env
APP_NAME="Marc Boreu Portfolio"
APP_ENV=local
APP_KEY=base64:TU_CLAVE_LOCAL
APP_DEBUG=true
APP_URL=http://localhost:8000

APP_LOCALE=es
APP_FALLBACK_LOCALE=es
APP_FAKER_LOCALE=es_ES

LOG_CHANNEL=single
LOG_LEVEL=debug

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync

INERTIA_SSR_ENABLED=false
```

No subas `.env` al repositorio. `APP_KEY` debe ser diferente entre instalaciones si no necesitas compartir datos cifrados; si ya existe una clave local, no la regeneres innecesariamente.

## Desarrollo local

Abre dos terminales.

Terminal 1, servidor Laravel:

```bash
php artisan serve
```

La aplicación estará disponible en `http://localhost:8000`.

Terminal 2, Vite con HMR:

```bash
npm run dev
```

`npm run dev` es el comando de trabajo diario. No genera un bundle final para producción.

## Prerender local

El prerender local se utiliza para comprobar que el HTML visible se genera correctamente sin depender de un servidor Node permanente.

```bash
php artisan prerender:export
npm run prerender:dev
```

`prerender:dev` fuerza:

```text
APP_ENV=local
APP_URL=http://localhost:8000
```

Si utilizas otro host o puerto:

```bash
APP_URL=http://127.0.0.1:8000 npm run prerender:dev
```

Los resultados se escriben en `bootstrap/prerender/html`.

Puedes inspeccionar una página así:

```bash
python3 - <<'PY'
import json
from pathlib import Path

file = next(Path('bootstrap/prerender/html').glob('*.json'))
data = json.loads(file.read_text())
print('path:', data['path'])
print('body:', data['body'][:1200])
PY
```

`body` debe contener HTML real de React. Si aparece `[object Object]` o está vacío, el prerender debe considerarse fallido.

## Scripts npm

| Comando | Finalidad |
|---|---|
| `npm run dev` | Servidor Vite de desarrollo con HMR. |
| `npm run build` | Bundle optimizado para producción. |
| `npm run build:ssr` | Bundle SSR de Inertia si se utiliza ese flujo. |
| `npm run preview` | Previsualización local del bundle generado. |
| `npm run prerender:dev` | Prerender usando localhost. |
| `npm run prerender:prod` | Prerender de producción usando una URL HTTPS. |

`npm run build` utiliza el modo de producción de Vite por defecto. Puede ejecutarse en local para validar el bundle, pero no inicia un servidor ni publica nada.

`npm run preview` solo sirve para revisar localmente el resultado del build. No es un servidor de producción.

## Build de producción

El build de producción se puede preparar en local o directamente en el servidor.

```bash
npm run build
npx vite build --ssr resources/js/prerender.tsx --outDir bootstrap/prerender-runtime
```

El segundo comando compila el renderizador estático usado por `prerender:prod`.

## Configuración de producción

En el servidor utiliza un `.env` separado del local:

```env
APP_NAME="Marc Boreu Portfolio"
APP_ENV=production
APP_KEY=base64:TU_CLAVE_DE_PRODUCCION
APP_DEBUG=false
APP_URL=https://marcboreu.com

APP_LOCALE=es
APP_FALLBACK_LOCALE=es
APP_FAKER_LOCALE=es_ES

LOG_CHANNEL=single
LOG_LEVEL=warning

DB_CONNECTION=sqlite
DB_DATABASE=/ruta/absoluta/a/database/database.sqlite

SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync

INERTIA_SSR_ENABLED=false
```

Recomendaciones importantes:

- No copies el `.env` local al servidor.
- Mantén estable la `APP_KEY` de producción entre despliegues.
- Usa `APP_DEBUG=false`.
- Usa una `APP_URL` HTTPS real.
- Verifica que el proceso PHP pueda leer y escribir las carpetas necesarias.
- No ejecutes `php artisan key:generate` en cada despliegue.

## Prerender de producción

Después de configurar el `.env` de producción:

```bash
php artisan config:clear
php artisan prerender:export
APP_URL=https://marcboreu.com npm run prerender:prod
```

El comando de producción exige una URL que empiece por `https://`. Esto evita generar accidentalmente canonical, hreflang y enlaces absolutos con `localhost`.

El resultado se escribe en:

```text
bootstrap/prerender/html
```

Estos ficheros deben formar parte del artefacto que se despliega junto con `public/build` y el código Laravel.

## Flujo completo de despliegue

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build
npx vite build --ssr resources/js/prerender.tsx --outDir bootstrap/prerender-runtime

php artisan migrate --force
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan prerender:export
APP_URL=https://marcboreu.com npm run prerender:prod
```

Si `APP_URL` ya está definido correctamente en el `.env` de producción, también puedes ejecutar:

```bash
npm run prerender:prod
```

La configuración cacheada debe generarse después de colocar el `.env` correcto. Si cambias `APP_URL` u otra variable utilizada por Laravel, limpia y regenera la caché:

```bash
php artisan config:clear
php artisan config:cache
```

## Comprobaciones antes de publicar

Comprueba que existen los artefactos:

```bash
find public/build -type f | head
find bootstrap/prerender/html -type f | wc -l
```

Comprueba que el HTML tiene contenido visible:

```bash
grep -R "<h1\|<main\|<header" bootstrap/prerender/html
```

Comprueba que producción no contiene URLs locales:

```bash
if grep -R "localhost\|127.0.0.1" bootstrap/prerender/html; then
  echo "ERROR: quedan URLs locales"
  exit 1
fi
```

Comprueba que las URLs de producción son correctas:

```bash
grep -R "https://marcboreu.com" bootstrap/prerender/html
```

## Arquitectura del prerender

1. `php artisan prerender:export` genera page objects Laravel en `bootstrap/prerender/pages`.
2. `npx vite build --ssr resources/js/prerender.tsx --outDir bootstrap/prerender-runtime` compila el renderizador React.
3. `prerender:dev` o `prerender:prod` ejecuta `scripts/prerender.mjs` sobre cada page object.
4. Cada página se guarda como JSON en `bootstrap/prerender/html` con `path`, `head`, `version` y `body`.
5. PHP sirve esos resultados sin necesitar Node en el hosting después del despliegue.

## Solución rápida de problemas

### `Página Inertia no encontrada`

Vuelve a compilar el runtime:

```bash
rm -rf bootstrap/prerender-runtime
npx vite build --ssr resources/js/prerender.tsx --outDir bootstrap/prerender-runtime
```

### `usePage must be used within the Inertia component`

Comprueba que estás usando el runtime generado desde la versión actual de `main` y vuelve a compilarlo.

### `body` es `[object Object]`

El runtime está desactualizado o se está serializando el resultado completo en lugar de `result.body`. Actualiza el repositorio y recompila `bootstrap/prerender-runtime`.

### Se generan URLs `localhost` en producción

Comprueba `APP_URL`, limpia la configuración cacheada, vuelve a exportar los page objects y ejecuta `npm run prerender:prod` con una URL HTTPS.

## SEO Optimization

The portfolio includes comprehensive SEO features to maximize search engine visibility:

### Features

- **Dynamic XML Sitemaps**: Multi-language sitemaps (es, ca, en) automatically generated on build
- **Robots.txt**: Search engine crawler directives and rate limiting
- **JSON-LD Schemas**: Organization, Person, WebSite, and BreadcrumbList structured data
- **Meta Tags**: Complete Open Graph, Twitter Card, and Apple meta tags
- **Resource Hints**: DNS-prefetch, preconnect for performance optimization
- **Favicon Package**: Multiple icon formats for browsers and PWA
- **Web App Manifest**: Progressive Web App support

### Configuration

SEO settings are managed in:
- `config/seo.php` - Organization and person information
- `config/schemas.php` - Structured data templates
- `.env` - Environment-specific variables (APP_URL, OG_IMAGE, etc.)

### Build Integration

Sitemaps are automatically generated during the build process:

```bash
npm run build
# Sitemaps generated to public/sitemap*.xml
```

### Key Files

- [RENDERING_ARCHITECTURE.md](./RENDERING_ARCHITECTURE.md) - Complete SEO integration details
- [SEO_SETUP.md](./SEO_SETUP.md) - Maintenance and configuration guide
- [SEO_TESTING_GUIDE.md](./openspec/changes/enhanced-seo-optimization/SEO_TESTING_GUIDE.md) - Validation procedures

### Maintenance

When adding new pages or updating content:

1. Update `config/locales.php` with new routes
2. Create the page component in `resources/js/pages/`
3. Add sitemap priority in `config/seo.php`
4. Run `npm run build` to regenerate sitemaps

For detailed instructions, see [SEO_SETUP.md](./SEO_SETUP.md).

## Seguridad

- No publiques `.env`.
- No compartas `APP_KEY` públicamente.
- No uses `APP_DEBUG=true` en producción.
- Revisa cualquier archivo generado antes de publicarlo.
