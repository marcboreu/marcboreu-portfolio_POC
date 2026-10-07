import { createInertiaApp } from '@inertiajs/react';
import { renderToString } from 'react-dom/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    '..',
);

const pages = await import(
    pathToFileURL(path.join(root, 'bootstrap/ssr/ssr.js')).href
);

export async function renderPage(page) {
    const app = await createInertiaApp({
        page,
        render: renderToString,
        resolve: (name) => {
            const pageModule = pages[`./pages/${name}.tsx`];

            if (!pageModule) {
                throw new Error(`Página no encontrada: ${name}`);
            }

            return pageModule;
        },
        setup: ({ App, props }) => <App {...props} />,
    });

    return app;
}