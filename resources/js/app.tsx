

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import type { App as InertiaApp, PageProps } from "@inertiajs/core";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import Layout from "@/components/Layout";

const appName = import.meta.env.VITE_APP_NAME || "Portfolio";

function PersistentLayoutApp({ App, props }: { App: InertiaApp; props: PageProps }) {
    return (
        <Layout>
            <App {...props} />
        </Layout>
    );
}

createInertiaApp({
    resolve: async (name) => {
        const pages = import.meta.glob("./pages/**/*.tsx");
        const page = await resolvePageComponent(
            `./pages/${name}.tsx`,
            pages,
        );

        page.default.layout ??= (page) => <Layout>{page}</Layout>;

        return page;
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
