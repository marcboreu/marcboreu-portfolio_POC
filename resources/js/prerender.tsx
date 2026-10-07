import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });

export function renderPage(page: any): { head: string[]; body: string } {
    const pageModule = pages[`./pages/${page.component}.tsx`] as any;

    if (!pageModule) {
        throw new Error(`Página Inertia no encontrada: ${page.component}`);
    }

    const Component = pageModule.default ?? pageModule;
    const body = renderToString(createElement(Component, page.props ?? {}));

    return { head: [], body };
}
