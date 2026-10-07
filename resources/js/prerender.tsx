import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { InertiaApp } from '@inertiajs/react';

const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });

export function renderPage(page: any): { head: string[]; body: string } {
    const pageModule = pages[`./pages/${page.component}.tsx`] as any;

    if (!pageModule) {
        throw new Error(`Página Inertia no encontrada: ${page.component}`);
    }

    const Component = pageModule.default ?? pageModule;
    const app = createElement(InertiaApp, {
        initialPage: page,
        initialComponent: Component,
        resolveComponent: () => Component,
        children: createElement(Component, page.props ?? {}),
    });

    return { head: [], body: renderToString(app) };
}
