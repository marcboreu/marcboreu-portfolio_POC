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
                throw new Error(`Página Inertia no encontrada: ${name}`);
            }

            return pageModule;
        },
        setup: ({ App, props }) => <App {...props} />,
    }),
);
