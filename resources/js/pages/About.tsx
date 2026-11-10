import { usePage } from "@inertiajs/react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Seo from "@/components/Seo";
import { type SharedProps, useT } from "@/lib/i18n";
import "./About.css";

const experienceKeys = ["capgemini", "freelance", "portaventura"] as const;
const projectKeys = ["commerceMigration", "uiLibrary", "bookingPlatform"] as const;

export default function About() {
    const t = useT();
    const { urls } = usePage<SharedProps>().props;

    return (
        <>
            <Seo />
            <Section hero className="about-page-section">
                <div className="about-profile">
                    <h1>{t("about.h1")}</h1>
                    <p className="lead">{t("about.lead")}</p>
                    <p>{t("about.description")}</p>
                    <div className="about-actions">
                        <Button href={urls.projects}>{t("nav.projects")}</Button>
                        <Button href={urls.contact} variant="secondary">{t("nav.contact")}</Button>
                    </div>
                </div>
            </Section>

            <Section id="about-experience" className="about-page-section">
                <h2>{t("home.experience.title")}</h2>
                <p className="lead">{t("home.experience.lead")}</p>
                <div className="about-grid">
                    {experienceKeys.map((key) => (
                        <Card key={key} className="about-card">
                            <h3>{t(`home.experience.items.${key}.title`)}</h3>
                            <p>{t(`home.experience.items.${key}.description`)}</p>
                        </Card>
                    ))}
                </div>
                <div className="about-actions">
                    <Button href={urls.projects} variant="secondary">{t("home.experience.cta")}</Button>
                </div>
            </Section>

            <Section id="about-projects" className="about-page-section">
                <h2>{t("home.featuredProjects.title")}</h2>
                <p className="lead">{t("home.featuredProjects.lead")}</p>
                <div className="about-grid">
                    {projectKeys.map((key) => (
                        <Card key={key} className="about-card">
                            <h3>{t(`home.featuredProjects.items.${key}.title`)}</h3>
                            <p>{t(`home.featuredProjects.items.${key}.description`)}</p>
                        </Card>
                    ))}
                </div>
            </Section>

            <Section id="about-contact" className="about-page-section">
                <h2>{t("home.cta.title")}</h2>
                <p className="lead">{t("home.cta.lead")}</p>
                <div className="about-actions">
                    <Button href={urls.contact}>{t("home.cta.button")}</Button>
                </div>
            </Section>
        </>
    );
}
