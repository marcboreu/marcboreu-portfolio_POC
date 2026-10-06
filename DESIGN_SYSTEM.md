# Sistema de diseño

CSS propio, sin Tailwind ni librerías de UI.

## Quitar Tailwind del starter kit
```bash
npm remove tailwindcss @tailwindcss/vite
```
Elimina el plugin de Tailwind de `vite.config.ts` si el starter kit lo trae y no sobrescribas `resources/css/app.css` al copiar el esqueleto.

## Estructura
- `tokens.css`: colores (light-dark), tipografía fluida, espaciado, radios.
- `base.css`: reset y estilos de elementos.
- `layout.css`: container, section, stack, cluster, grid, header y footer.
- `components.css`: nav, idioma, btn, card.
- Capas: `reset, tokens, base, layout, components`.

## Componentes React
`Container`, `Section`, `Button` (enlace Inertia o botón), `Card` en `resources/js/components/ui`.

## Tema
Por defecto sigue `prefers-color-scheme`. Fuerza un tema con `data-theme="light|dark"` en `<html>`.
