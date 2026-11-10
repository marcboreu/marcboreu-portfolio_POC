// Client-side rendering entry point
// - Hydrates initial HTML server-rendered by ssr.tsx
// - Handles SPA navigation via Inertia links
// - Uses eager component imports (matching SSR for consistency)

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import type { ComponentType } from "react";
import Layout from "@/components/Layout";

const appName = import.meta.env.VITE_APP_NAME || "Portfolio";

type PageModule = {
    default: ComponentType & {
        layout?: (page: React.ReactNode) => React.ReactNode;
    };
};

// Use eager imports to match SSR/prerender resolution strategy
const pages = import.meta.glob<PageModule>("./pages/**/*.tsx", { eager: true });

createInertiaApp({
    title: (title) => `${title} - ${appName}`,

    resolve: (name) => {
        const pageModule = pages[`./pages/${name}.tsx`] as any;

        if (!pageModule) {
            throw new Error(`Inertia page not found: ${name}`);
        }

        const module = pageModule.default as ComponentType & {
            layout?: (page: React.ReactNode) => React.ReactNode;
        };

        module.layout ??= (page) => <Layout>{page}</Layout>;
        return module;
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: "#4B5563",
    },
});
