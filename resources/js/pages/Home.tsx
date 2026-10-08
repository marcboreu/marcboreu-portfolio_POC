import { usePage } from "@inertiajs/react";
import Layout from "@/components/Layout";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import { SharedProps, useT } from "@/lib/i18n";

export default function Home() {
    const t = useT();
    const { urls } = usePage<SharedProps>().props;

    return (
        <Layout>
            <Section hero>
                <h1>{t("home.h1")}</h1>
                <p className="lead">{t("home.lead")}</p>
                <div className="cluster">
                    <Button href={urls.projects}>{t("nav.projects")}</Button>
                    <Button href={urls.contact} variant="secondary">
                        {t("nav.contact")}
                    </Button>
                </div>
            </Section>
        </Layout>
    );
}
