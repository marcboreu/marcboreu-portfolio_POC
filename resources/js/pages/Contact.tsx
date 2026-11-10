import { usePage } from "@inertiajs/react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Seo from "@/components/Seo";
import { type SharedProps, useT } from "@/lib/i18n";
import {
    ScrollTimeline,
    type TimelineEventData,
} from "@/components/ScrollTimeline";
import Timeline2 from "@/components/Timeline2";
import Timeline3, { type Timeline3Group, type Timeline3Config } from "@/components/Timeline3";
import "./Contact.css";

const EMAIL = "hello@marcboreu.com";

// Timeline3 test data - Project Development Process
const TIMELINE3_PROCESS_GROUPS: Timeline3Group[] = [
    {
        id: "discovery",
        label: "Discovery",
        phases: [
            {
                id: "requirements",
                phase: "01",
                title: "Requirements",
                description:
                    "Gather and analyze project requirements, objectives, and constraints.",
            },
            {
                id: "research",
                phase: "02",
                title: "Research",
                description:
                    "Conduct market research, competitive analysis, and user studies.",
            },
        ],
    },
    {
        id: "strategy",
        label: "Strategy",
        phases: [
            {
                id: "planning",
                phase: "03",
                title: "Planning",
                description: "Create strategic roadmap and define project milestones.",
            },
            {
                id: "scoping",
                phase: "04",
                title: "Scoping",
                description:
                    "Define scope, deliverables, and technical architecture.",
            },
        ],
    },
    {
        id: "execution",
        label: "Execution",
        phases: [
            {
                id: "design",
                phase: "05",
                title: "Design",
                description:
                    "Create design prototypes, wireframes, and interactive mockups.",
            },
            {
                id: "development",
                phase: "06",
                title: "Development",
                description: "Implement features and build the solution.",
            },
            {
                id: "testing",
                phase: "07",
                title: "Testing",
                description: "Quality assurance, bug fixes, and optimization.",
            },
        ],
    },
    {
        id: "launch",
        label: "Launch",
        phases: [
            {
                id: "deployment",
                phase: "08",
                title: "Deployment",
                description: "Deploy to production and monitor performance.",
            },
            {
                id: "maintenance",
                phase: "09",
                title: "Maintenance",
                description: "Post-launch support and continuous improvements.",
            },
        ],
    },
];

// Timeline3 test configuration - Energetic variant with custom colors
const TIMELINE3_ENERGETIC_CONFIG: Timeline3Config = {
    animations: {
        duration: 1200,
        variant: "energetic",
    },
    colors: {
        progress: "#667eea",
        line: "#667eea",
        circle: "#667eea",
        text: "#ffffff",
    },
};

// Timeline3 test configuration - Smooth variant with purple theme
const TIMELINE3_PURPLE_CONFIG: Timeline3Config = {
    animations: {
        duration: 1500,
        variant: "smooth",
    },
    colors: {
        progress: "#9333ea",
        line: "#a855f7",
        circle: "#c084fc",
        text: "#e9d5ff",
    },
    layout: {
        itemSpacing: "4rem",
        circleSize: "5.5rem",
        contentPadding: "6.5rem",
    },
};

// Timeline3 test configuration - Compact layout with orange theme
const TIMELINE3_COMPACT_CONFIG: Timeline3Config = {
    animations: {
        duration: 800,
        variant: "energetic",
    },
    colors: {
        progress: "#f97316",
        line: "#fb923c",
        circle: "#fdba74",
        text: "#fed7aa",
    },
    layout: {
        itemSpacing: "3rem",
        circleSize: "4.5rem",
        contentPadding: "5rem",
    },
};

const TIMELINE_EVENTS: TimelineEventData[] = [
    {
        id: "2010",
        year: 2010,
        number: "01",
        title: "First Steps in Design",
        description:
            "Started learning web design with HTML, CSS, and basic JavaScript fundamentals.",
    },
    {
        id: "2012",
        year: 2012,
        number: "02",
        title: "Professional Journey Begins",
        description:
            "Landed first professional role as a junior frontend developer at a startup.",
    },
    {
        id: "2013",
        year: 2013,
        number: "03",
        title: "React Discovery",
        description:
            "Discovered React and fell in love with component-based architecture.",
    },
    {
        id: "2014",
        year: 2014,
        number: "04",
        title: "Full-Stack Development",
        description:
            "Expanded skills to backend development with Node.js and Laravel.",
    },
    {
        id: "2015",
        year: 2015,
        number: "05",
        title: "TypeScript Adoption",
        description: "Embraced TypeScript for type-safe and maintainable code.",
    },
    {
        id: "2016",
        year: 2016,
        number: "06",
        title: "Senior Developer Role",
        description:
            "Promoted to senior developer and started mentoring junior team members.",
    },
    {
        id: "2017",
        year: 2017,
        number: "07",
        title: "Design System Leadership",
        description:
            "Led the creation of a company-wide design system and component library.",
    },
    {
        id: "2018",
        year: 2018,
        number: "08",
        title: "Open Source Contributions",
        description:
            "Started contributing to open source projects and sharing knowledge on GitHub.",
    },
    {
        id: "2019",
        year: 2019,
        number: "09",
        title: "Tech Lead Position",
        description:
            "Became tech lead, architecting scalable solutions for multiple teams.",
    },
    {
        id: "2020",
        year: 2020,
        number: "10",
        title: "Remote-First Transition",
        description:
            "Adapted to remote work, improving collaboration and productivity tools.",
    },
    {
        id: "2021",
        year: 2021,
        number: "11",
        title: "Performance Optimization Expert",
        description:
            "Specialized in web performance optimization, achieving 90+ Lighthouse scores.",
    },
    {
        id: "2022",
        year: 2022,
        number: "12",
        title: "Freelance Independence",
        description:
            "Started freelancing to work on exciting projects with global clients.",
    },
    {
        id: "2023",
        year: 2023,
        number: "13",
        title: "AI & Innovation",
        description:
            "Integrated AI tools into workflow and explored cutting-edge technologies.",
    },
    {
        id: "2024",
        year: 2024,
        number: "14",
        title: "Portfolio Reinvention",
        description:
            "Created modern portfolio with smooth animations and interactive components.",
    },
    {
        id: "2025",
        year: 2025,
        number: "15",
        title: "Building the Future",
        description:
            "Focusing on innovative solutions and mentoring the next generation of developers.",
    },
];

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
{/* 
            <Section id="contact-timeline" className="contact-page-section">
                <div style={{ height: "100vh", marginBottom: "4rem" }}>
                    <ScrollTimeline
                        events={TIMELINE_EVENTS}
                        height="100vh"
                        spineColor="#667eea"
                        markerColor="#667eea"
                        stretchFactor={0.5}
                        markerSize={14}
                        responsive={true}
                    />
                </div>
            </Section> */}

            <Section id="contact-details" className="contact-page-section">
                <div className="contact-grid">
                    <Card className="contact-card">
                        <h2>{t("contact.h1")}</h2>
                        <p>{t("contact.description")}</p>
                        <a
                            className="contact-card__email"
                            href={`mailto:${EMAIL}`}
                        >
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

            <Section id="contact-timeline2" className="contact-page-section">
                <Timeline2
                    items={TIMELINE_EVENTS.map((event) => ({
                        id: event.id,
                        year: event.year.toString(),
                        title: event.title,
                        description: event.description,
                    }))}
                    eyebrow="Professional Journey"
                    title="My Timeline"
                    intro="A visual journey through my career milestones and achievements"
                />
            </Section>

            {/* Timeline3 Test Sections - Enhanced Animations Demo */}
            <Section id="timeline3-demo-energetic" className="contact-page-section">
                <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
                        Timeline3 - Energetic Animations
                    </h2>
                    <p style={{ textAlign: "center", color: "#999", marginBottom: "2rem" }}>
                        Fast, dynamic animations with improved visual polish
                    </p>
                </div>
                <Timeline3
                    groups={TIMELINE3_PROCESS_GROUPS}
                    title="Development Process"
                    config={TIMELINE3_ENERGETIC_CONFIG}
                />
            </Section>

            <Section id="timeline3-demo-purple" className="contact-page-section">
                <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
                        Timeline3 - Purple Theme
                    </h2>
                    <p style={{ textAlign: "center", color: "#999", marginBottom: "2rem" }}>
                        Custom color scheme with smooth animations
                    </p>
                </div>
                <Timeline3
                    groups={TIMELINE3_PROCESS_GROUPS}
                    title="Project Timeline"
                    config={TIMELINE3_PURPLE_CONFIG}
                />
            </Section>

            <Section id="timeline3-demo-compact" className="contact-page-section">
                <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
                        Timeline3 - Compact Layout
                    </h2>
                    <p style={{ textAlign: "center", color: "#999", marginBottom: "2rem" }}>
                        Space-efficient with quick animations and orange theme
                    </p>
                </div>
                <Timeline3
                    groups={TIMELINE3_PROCESS_GROUPS}
                    title="Quick Timeline"
                    config={TIMELINE3_COMPACT_CONFIG}
                />
            </Section>

            <Section id="timeline3-demo-default" className="contact-page-section">
                <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
                        Timeline3 - Default Configuration
                    </h2>
                    <p style={{ textAlign: "center", color: "#999", marginBottom: "2rem" }}>
                        Using built-in defaults for all settings
                    </p>
                </div>
                <Timeline3
                    groups={TIMELINE3_PROCESS_GROUPS}
                    title="Default Timeline"
                />
            </Section>

            <Section id="contact-cta" className="contact-page-section">
                <h2>{t("home.cta.title")}</h2>
                <p className="lead">{t("home.cta.lead")}</p>
                <div className="contact-actions">
                    <Button href={`mailto:${EMAIL}`}>
                        {t("home.cta.button")}
                    </Button>
                </div>
            </Section>
        </>
    );
}
