// Server-side rendering entry point (Node.js)
// - Renders React components to HTML string
// - Called by Laravel during HTTP requests
// - Returns initial HTML with Inertia props for hydration
// - Uses eager component imports for Node.js execution

import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { renderToString } from "react-dom/server";

const pages = import.meta.glob("./pages/**/*.tsx", {
    eager: true,
});

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        resolve: (name) => {
            const pageModule = pages[`./pages/${name}.tsx`] as any;

            if (!pageModule) {
                throw new Error(`Inertia page not found: ${name}`);
            }

            return pageModule;
        },
        setup: ({ App, props }) => <App {...props} />,
    }),
);
