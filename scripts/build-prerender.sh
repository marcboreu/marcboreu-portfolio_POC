#!/usr/bin/env bash
set -euo pipefail

: "${APP_URL:?Define APP_URL (p. ej. https://marcboreu.com) antes de ejecutar}"

rm -f public/hot

npm ci
composer install --no-interaction --prefer-dist

npx vite build
php artisan config:clear
php artisan prerender:export
npx vite build --ssr
node scripts/prerender.mjs

echo "Listo. Sube public/build y bootstrap/prerender (ademas del codigo PHP)."
