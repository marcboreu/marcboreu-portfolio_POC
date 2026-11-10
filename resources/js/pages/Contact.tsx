import { usePage } from "@inertiajs/react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Seo from "@/components/Seo";
import { type SharedProps, useT } from "@/lib/i18n";
import "./Contact.css";

const EMAIL = "hello@marcboreu.com";

export default function Contact() {
    const t = useT();
    const { urls } = usePage<SharedProps>().props;

    return (
        <>
            <Seo />

            <Section hero className="contact-page-section">
                <div className="contact-hero">
                    <h1>{t("contact.h1")}</h1>
                    <p className="lead">{t("contact.lead")}</p>
                </div>
            </Section>

            <Section id="contact-details" className="contact-page-section">
                <div className="contact-grid">
                    <Card className="contact-card">
                        <h2>{t("contact.h1")}</h2>
                        <p>{t("contact.description")}</p>
                        <a className="contact-card__email" href={`mailto:${EMAIL}`}>
                            {EMAIL}
                        </a>
                    </Card>

                    <Card className="contact-card">
                        <h2>{t("home.services.title")}</h2>
                        <p>{t("home.services.lead")}</p>
                        <div className="contact-actions">
                            <Button href={urls.projects} variant="secondary">
                                {t("nav.projects")}
                            </Button>
                        </div>
                    </Card>
                </div>
            </Section>

            <Section id="contact-cta" className="contact-page-section">
                <h2>{t("home.cta.title")}</h2>
                <p className="lead">{t("home.cta.lead")}</p>
                <div className="contact-actions">
                    <Button href={`mailto:${EMAIL}`}>{t("home.cta.button")}</Button>
                </div>
            </Section>
        </>
    );
}
