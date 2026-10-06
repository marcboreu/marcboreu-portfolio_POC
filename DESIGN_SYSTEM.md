# Sistema de diseño

CSS propio, sin Tailwind ni librerias de UI. El esqueleto de Laravel trae Tailwind en `package.json`; el README indica como quitarlo.

## Estructura
- `resources/css/tokens.css`: colores (`light-dark()`), tipografia fluida, espaciado, radios.
- `resources/css/base.css`: reset y estilos de elementos.
- `resources/css/layout.css`: container, section, stack, cluster, grid, header y footer.
- `resources/css/components.css`: skip-link, nav, idioma, btn, card.
- Capas, en orden: `reset, tokens, base, layout, components`.

## Carga del CSS
El CSS se carga solo desde `@vite` en `app.blade.php` (entrada `resources/css/app.css`), asi llega como `<link>` en el HTML inicial y no depende de JavaScript.

## Componentes React
`Container`, `Section`, `Button` (enlace Inertia o boton) y `Card` en `resources/js/components/ui`.

## Tema
Por defecto sigue `prefers-color-scheme`. Fuerza un tema con `data-theme="light|dark"` en `<html>`.

## Compatibilidad
`light-dark()` requiere navegadores de 2024 o posteriores.
