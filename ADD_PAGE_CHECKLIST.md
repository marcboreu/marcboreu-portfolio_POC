# Checklist: Adding a New Page to the Application

Use this checklist when adding a new page to the portfolio application.

## Naming Convention

Page names should be:
- **Component**: PascalCase (e.g., `YourPage`, `MyProject`)
- **File**: Same as component name (e.g., `YourPage.tsx`)
- **Config key**: kebab-case (e.g., `your-page`)
- **URL slug**: kebab-case with locale translations (e.g., `es: 'su-pagina'`, `en: 'your-page'`)

## Checklist

### 1. Component File

- [ ] Create `resources/js/pages/YourPage.tsx`
- [ ] Export a default React component
- [ ] Component accepts Inertia props (via `usePage()` if needed)
- [ ] Component includes `<Seo />` for SEO metadata
- [ ] TypeScript types are correct (if using TypeScript)
- [ ] Component renders without errors in browser

### 2. Configuration (config/locales.php)

**Routes** array:
- [ ] Add entry: `'your-page' => ['es' => '...', 'ca' => '...', 'en' => '...']`
- [ ] Verify URL slugs are unique (no conflicts with other pages)
- [ ] Use appropriate slug for each locale

**Components** array:
- [ ] Add entry: `'your-page' => 'YourPage'`
- [ ] Component name **exactly matches** the file name (case-sensitive)
- [ ] Verify the mapping: `config('locales.components')['your-page']` returns `'YourPage'`

Command to verify:
```bash
php artisan tinker
config('locales.components')['your-page']
# Should output: "YourPage"
config('locales.routes')['your-page']
# Should output: array with es, ca, en keys
```

### 3. Language Files (if needed)

If the page displays user-facing text that should be translated:

- [ ] Add translations to `lang/en/site.php`
- [ ] Add translations to `lang/es/site.php`
- [ ] Add translations to `lang/ca/site.php`
- [ ] Use consistent translation key format: `'your-page.title'`, `'your-page.description'`
- [ ] Verify translations are used in the component via `useT()`

### 4. Navigation & Links

- [ ] Add link in navigation component (if appropriate)
- [ ] Use `<Link>` component from Inertia for SPA navigation
- [ ] Use `url('your-page')` helper to generate correct locale-aware URLs
- [ ] Test that links navigate without full page reload

### 5. Styling

- [ ] Component styles are scoped (CSS modules or BEM convention)
- [ ] Styles match design system and existing components
- [ ] No global style conflicts
- [ ] Responsive design verified on multiple screen sizes

### 6. Testing

- [ ] [ ] Manually test page loads at `/en/your-page`
- [ ] Test all locales: `/en`, `/es`, `/ca`
- [ ] Verify SSR generates correct HTML (View Page Source)
- [ ] Test SPA navigation: links navigate without full reload
- [ ] Test back/forward browser buttons work correctly
- [ ] Check browser console for errors (hydration, missing components, etc.)
- [ ] Verify SEO metadata is correct (title, meta tags, hreflang)

### 7. Prerendering (if applicable)

If the page should be statically prerendered:

- [ ] Add page to prerender script configuration
- [ ] Run `npm run build` to generate static files
- [ ] Verify static HTML file exists in `bootstrap/prerender/html/`
- [ ] Verify static HTML contains correct content and SEO metadata

### 8. Documentation

- [ ] Component has JSDoc comments explaining its purpose
- [ ] Complex features are documented with inline comments
- [ ] If the page has special routing or requirements, document them
- [ ] Update RENDERING_ARCHITECTURE.md if adding new rendering modes

## Verification Commands

Run these commands to verify the page is properly configured:

```bash
# Check config mappings
php artisan tinker
>>> config('locales.components')['your-page']
>>> config('locales.routes')['your-page']

# Check component file exists
ls resources/js/pages/YourPage.tsx

# Build to verify no errors
npm run build

# Test SSR compilation
npm run dev
# Navigate to http://localhost:8000/en/your-page
# Check Page Source for rendered HTML
```

## Common Issues

| Issue | Check |
|-------|-------|
| 404 Not Found | Verify config mapping and URL slugs are correct |
| Component not found | Verify component file name matches config (case-sensitive) |
| Hydration error | Check SSR and CSR produce identical HTML for the same props |
| Page doesn't show in nav | Add explicit link to navigation component |
| Locale parameter missing | Verify SetLocale middleware is applied to routes |
| Prerender failing | Check component renders without errors and doesn't need client-side data |

## Next Steps

After adding the page:
1. Run full test suite: `npm test && php artisan test`
2. Create a PR with the changes
3. Request review from team members
4. Monitor production for any rendering issues

