import { usePage } from "@inertiajs/react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import DecoderText from "@/components/DecoderText";
import DisplacementSphere from "@/components/DisplacementSphere/DisplacementSphere";
import Text3d from "@/components/Text3d";
import Seo from "@/components/Seo";
import { SharedProps, useT } from "@/lib/i18n";
import "./Home.css";

const services = [
    "services.frontend",
    "services.apis",
    "services.payments",
    "services.ecommerce",
    "services.consulting",
];

const skills = [
    "React",
    "TypeScript",
    "Node.js",
    "Laravel",
    "Go",
    "Python",
    "Docker",
    "Salesforce B2C Commerce Cloud",
    "Testing",
    "Accessibility",
];

const featuredProjects = [
    {
        key: "commerceMigration",
        badges: ["React", "TypeScript", "Salesforce B2C Commerce Cloud"],
    },
    {
        key: "uiLibrary",
        badges: ["React", "TypeScript", "Styled Components"],
    },
    {
        key: "bookingPlatform",
        badges: ["React", "Redux", "TypeScript", "REST APIs"],
    },
];

export default function Home() {
    const t = useT();
    const { urls } = usePage<SharedProps>().props;

    return (
        <>
            <Seo />
            AQUI
            <Section hero>
                <div className="home-hero">
                    <div className="home-hero__content">
                        <p className="home-hero__eyebrow">Marc Boreu</p>
                        <h1 className="home-hero__title">
                            <DecoderText text={"MARC BOREU"} />
                        </h1>
                        <p className="home-hero__lead">
                            <Text3d
                                text={t("home.lead")}
                                depth={6}
                                maxTilt={4}
                            />
                        </p>
                        <div className="home-hero__actions">
                            <Button href={urls.projects}>
                                {t("nav.projects")}
                            </Button>
                            <Button href={urls.contact} variant="secondary">
                                {t("nav.contact")}
                            </Button>
                        </div>
                    </div>
                    <div className="home-hero__visual">
                        <DisplacementSphere size={520} />
                    </div>
                </div>
            </Section>
            <Section id="services">
                <h2>{t("home.services.title")}</h2>
                <p className="lead">{t("home.services.lead")}</p>

                <div className="home-grid">
                    {services.map((key) => (
                        <Card key={key} className="home-card">
                            <h3>{t(`home.services.items.${key}.title`)}</h3>
                            <p>{t(`home.services.items.${key}.description`)}</p>
                        </Card>
                    ))}
                </div>
            </Section>
            <Section id="skills">
                <h2>{t("home.skills.title")}</h2>
                <p className="lead">{t("home.skills.lead")}</p>

                <ul className="home-skills" aria-label={t("home.skills.title")}>
                    {skills.map((skill) => (
                        <li key={skill}>
                            <Badge>{skill}</Badge>
                        </li>
                    ))}
                </ul>
            </Section>
            <Section id="featured-projects">
                <h2>{t("home.featuredProjects.title")}</h2>
                <p className="lead">{t("home.featuredProjects.lead")}</p>

                <div className="home-grid">
                    {featuredProjects.map((project) => (
                        <Card key={project.key} className="home-card">
                            <h3>
                                {t(
                                    `home.featuredProjects.items.${project.key}.title`,
                                )}
                            </h3>
                            <p>
                                {t(
                                    `home.featuredProjects.items.${project.key}.description`,
                                )}
                            </p>
                            <ul className="badge-list">
                                {project.badges.map((badge) => (
                                    <li key={badge}>
                                        <Badge>{badge}</Badge>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>

                <div className="home-section-actions">
                    <Button href={urls.projects}>
                        {t("home.featuredProjects.cta")}
                    </Button>
                </div>
            </Section>
            <Section id="experience">
                <h2>{t("home.experience.title")}</h2>
                <p className="lead">{t("home.experience.lead")}</p>

                <div className="home-grid">
                    <Card className="home-card">
                        <h3>{t("home.experience.items.capgemini.title")}</h3>
                        <p>
                            {t("home.experience.items.capgemini.description")}
                        </p>
                    </Card>
                    <Card className="home-card">
                        <h3>{t("home.experience.items.freelance.title")}</h3>
                        <p>
                            {t("home.experience.items.freelance.description")}
                        </p>
                    </Card>
                    <Card className="home-card">
                        <h3>{t("home.experience.items.portaventura.title")}</h3>
                        <p>
                            {t(
                                "home.experience.items.portaventura.description",
                            )}
                        </p>
                    </Card>
                </div>

                <div className="home-section-actions">
                    <Button href={urls.projects} variant="secondary">
                        {t("home.experience.cta")}
                    </Button>
                </div>
            </Section>
            <Section id="contact-cta">
                <h2>{t("home.cta.title")}</h2>
                <p className="lead">{t("home.cta.lead")}</p>

                <div className="home-section-actions">
                    <Button href={urls.contact}>{t("home.cta.button")}</Button>
                </div>
            </Section>
        </>
    );
}
