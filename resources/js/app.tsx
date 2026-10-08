import "./bootstrap";
import "./styles/app.css";

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
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob("./pages/**/*.tsx"),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(
            <PersistentLayoutApp App={App} props={props} />,
        );
    },
    progress: {
        color: "#4B5563",
    },
});
