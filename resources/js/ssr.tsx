import { createInertiaApp } from '@inertiajs/react';
import { renderToString } from 'react-dom/server';

const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });

export async function render(page: any) {
    return createInertiaApp({
        page,
        render: renderToString,
        resolve: (name) => pages[`./pages/${name}.tsx`] as any,
        setup: ({ App, props }) => <App {...props} />,
    });
}
