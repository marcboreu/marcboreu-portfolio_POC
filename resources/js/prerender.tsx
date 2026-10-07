import { createInertiaApp } from '@inertiajs/react';
import { renderToString } from 'react-dom/server';

const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });

export async function renderPage(page: any): Promise<{ head: string[]; body: string }> {
    let rendered: string | undefined;

    await createInertiaApp({
        page,
        render: (element) => {
            rendered = renderToString(element);
            return rendered;
        },
        resolve: (name) => {
            const pageModule = pages[`./pages/${name}.tsx`] as any;

            if (!pageModule) {
                throw new Error(`Página Inertia no encontrada: ${name}`);
            }

            return pageModule;
        },
        setup: ({ App, props }) => <App {...props} />,
    });

    return { head: [], body: rendered ?? '' };
}
