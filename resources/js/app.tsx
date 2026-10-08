import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import type { ComponentType } from "react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import Layout from "@/components/Layout";

const appName = import.meta.env.VITE_APP_NAME || "Portfolio";

type PageModule = {
    default: ComponentType & {
        layout?: (page: React.ReactNode) => React.ReactNode;
    };
};

const pages = import.meta.glob<PageModule>("./pages/**/*.tsx");

createInertiaApp({
    title: (title) => `${title} - ${appName}`,

    resolve: (name) =>
        resolvePageComponent<PageModule>(`./pages/${name}.tsx`, pages).then(
            (module) => {
                module.default.layout ??= (page) => <Layout>{page}</Layout>;
                return module.default;
            },
        ),

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: "#4B5563",
    },
});
