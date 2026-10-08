import Seo from "@/components/Seo";
import { useT } from "@/lib/i18n";
import CompanyLogoMarquee from "@/components/CompanyLogoMarquee";
import ExperienceTimeline from "@/components/ExperienceTimeline";

type Subproject = {
    title: string;
    description: string;
    responsibilities: string[];
    achievements: string[];
    badges: string[];
};
type Experience = {
    company: string;
    period: string;
    role: string;
    context: string;
    responsibilities: string[];
    achievements: string[];
    badges: string[];
    subprojects: Subproject[];
};

const experiences: Experience[] = [
    {
        company: "Capgemini",
        period: "Jun 2023 — Present",
        role: "Frontend Engineer & Software Architect · Composable Commerce",
        context:
            "Barcelona, Spain · Remote · Software Consulting · Luxury eCommerce · Salesforce B2C Commerce Cloud",
        badges: [
            "React",
            "TypeScript",
            "Salesforce B2C Commerce Cloud",
            "SFRA",
            "SCAPI",
            "OCAPI",
            "Styled Components",
            "Release Management",
        ],
        responsibilities: [
            "Led the frontend implementation of a progressive migration from SiteGenesis to a composable commerce architecture in a live enterprise environment.",
            "Developed scalable solutions with React, TypeScript and modern component-driven patterns while ensuring coexistence with legacy production code.",
            "Collaborated across business and technical teams to deliver incremental releases with minimal friction.",
            "Contributed to architectural decisions, code quality, maintainability and user experience improvements.",
            "Worked with Salesforce B2C Commerce Cloud, SFRA, SCAPI and OCAPI for headless and API-first initiatives.",
            "Acted as Release Manager, coordinating DevOps practices, release cycles and deployment strategies.",
        ],
        achievements: [
            "Architected and deployed a proprietary UI library built from scratch with React, TypeScript and Styled Components across multiple international markets.",
            "Drove the incremental modernization of a complex luxury eCommerce platform from legacy SiteGenesis to Composable Commerce in a live production environment.",
            "Improved page performance and customer experience through a modern headless frontend approach.",
            "Enabled coexistence of legacy and modern codebases while reducing delivery risk.",
            "Established robust testing workflows and React Code Review standards across the team.",
        ],
        subprojects: [
            {
                title: "Luxury eCommerce Platform Migration",
                description:
                    "Progressive migration from SiteGenesis to a composable Salesforce Commerce architecture while the platform remained in production.",
                responsibilities: [
                    "Frontend implementation with React and TypeScript.",
                    "Component-driven UI development and legacy coexistence.",
                    "SCAPI and OCAPI integrations for headless and API-first capabilities.",
                    "Cross-team collaboration around architecture and incremental delivery.",
                ],
                achievements: [
                    "Supported the evolution of the platform without disrupting ongoing business operations.",
                    "Improved frontend performance, customer experience and long-term flexibility.",
                ],
                badges: [
                    "React",
                    "TypeScript",
                    "Salesforce B2C Commerce Cloud",
                    "SiteGenesis",
                    "SFRA",
                    "SCAPI",
                    "OCAPI",
                    "Headless commerce",
                ],
            },
            {
                title: "UI Library, Quality & Release Management",
                description:
                    "A cross-cutting initiative combining reusable frontend foundations, code quality and reliable delivery practices.",
                responsibilities: [
                    "Built and deployed a proprietary UI library with Styled Components.",
                    "Defined reusable development workflows and code review standards.",
                    "Coordinated release cycles, DevOps practices and deployment strategies.",
                    "Created Technical Specification Documents aligned with business requirements.",
                ],
                achievements: [
                    "Deployed the UI library across multiple international markets.",
                    "Improved consistency, maintainability and delivery confidence across the transformation.",
                ],
                badges: [
                    "React",
                    "TypeScript",
                    "Styled Components",
                    "DevOps",
                    "Release Management",
                    "TSD",
                ],
            },
        ],
    },
    {
        company: "marcboreu",
        period: "Jan 2020 — Present",
        role: "Technical Consultant & Full Stack Developer · Freelance",
        context:
            "Barcelona, Spain · Remote · B2C & B2B eCommerce · Enterprise Web Applications · CRM",
        badges: [
            "React",
            "Vue",
            "Node.js",
            "Laravel",
            "Express",
            "PHP",
            "REST APIs",
            "WordPress",
            "WooCommerce",
            "UX",
            "SEO",
        ],
        responsibilities: [
            "Offer technical expertise, business vision and economic and financial planning to professionals who need a boost for their business.",
            "Deliver end-to-end web solutions with React/Vue frontends, Node.js/Laravel/Express backends and custom REST APIs for corporate, eCommerce and SaaS clients.",
            "Design and implement WordPress and WooCommerce sites with fully customised themes, plugins and extensions.",
            "Provide interface design, UX proposals, competitive analysis and SEO improvement.",
            "Architect and develop custom APIs and database microservices with Node.js and PHP.",
        ],
        achievements: [
            "Delivered complete solutions from discovery and planning through implementation and deployment.",
            "Combined technical architecture with business and financial planning for independent digital products.",
            "Built reusable integrations and commerce capabilities across different client contexts.",
        ],
        subprojects: [
            {
                title: "B2C & B2B eCommerce Solutions",
                description:
                    "End-to-end digital solutions for corporate and commerce clients.",
                responsibilities: [
                    "Frontend development with React and Vue.",
                    "Backend services with Node.js, Laravel and Express.",
                    "Custom REST API and database integration.",
                    "UX, SEO and interface design.",
                ],
                achievements: [
                    "Delivered complete solutions adapted to different business contexts.",
                ],
                badges: [
                    "React",
                    "Vue",
                    "Node.js",
                    "Laravel",
                    "Express",
                    "REST APIs",
                    "UX",
                    "SEO",
                ],
            },
            {
                title: "WordPress & WooCommerce Platforms",
                description:
                    "Custom digital commerce platforms with tailored themes, plugins and extensions.",
                responsibilities: [
                    "Designed customised themes and plugins.",
                    "Integrated commerce features and external services.",
                    "Improved performance and search visibility.",
                ],
                achievements: [
                    "Created reusable commerce capabilities for independent and client projects.",
                ],
                badges: [
                    "WordPress",
                    "WooCommerce",
                    "PHP",
                    "SEO",
                    "Performance",
                ],
            },
        ],
    },
    {
        company: "Interficie Internet Services",
        period: "Sep 2022 — Jun 2023",
        role: "Frontend Engineer · Booking · CRM · React Arch",
        context:
            "Barcelona, Spain · Remote · Software Consulting · PortAventura World",
        badges: [
            "TypeScript",
            "React",
            "Redux",
            "PHP",
            "SQL",
            "REST APIs",
            "SCSS",
            "QA",
        ],
        responsibilities: [
            "Develop full-stack applications with TypeScript, React, Redux, PHP, SQL and REST APIs.",
            "Build frontend solutions for a customer-focused eCommerce environment focused on service management, bookings and complex integrations.",
            "Integrate key external services including Snowflake and booking systems.",
            "Design and implement reusable UI components with SCSS modules.",
            "Collaborate with server-side teams using Node.js and PHP.",
        ],
        achievements: [
            "Implemented calendars, validators and sliders without external libraries, reducing code by 15% and improving maintainability.",
            "Managed development processes as Business Analyst, Developer and QA.",
            "Contributed to a platform serving complex operations, user management and data from multiple enterprise sources.",
        ],
        subprojects: [
            {
                title: "PortAventura Booking & CRM Platform",
                description:
                    "Customer-facing booking and CRM capabilities connected to enterprise systems and external services.",
                responsibilities: [
                    "Developed React and Redux interfaces with TypeScript.",
                    "Connected frontend workflows to PHP, SQL and REST APIs.",
                    "Integrated booking systems and Snowflake data services.",
                    "Worked with backend and enterprise service teams.",
                ],
                achievements: [
                    "Supported complex booking, service-management and customer workflows.",
                ],
                badges: [
                    "TypeScript",
                    "React",
                    "Redux",
                    "PHP",
                    "SQL",
                    "REST APIs",
                    "Snowflake",
                ],
            },
            {
                title: "Reusable UI Components & Quality",
                description:
                    "A component and quality initiative focused on maintainability, scalability and lean frontend implementation.",
                responsibilities: [
                    "Built reusable components and SCSS modules.",
                    "Implemented calendars, validators and sliders without external libraries.",
                    "Prioritised code quality, maintainability and scalability.",
                    "Worked across analysis, development and QA.",
                ],
                achievements: [
                    "Reduced code by 15% while improving maintainability.",
                    "Strengthened quality control across the development process.",
                ],
                badges: [
                    "React",
                    "SCSS",
                    "Component Design",
                    "Performance",
                    "Business Analysis",
                    "QA",
                ],
            },
        ],
    },
    {
        company: "Capgemini",
        period: "May 2021 — Sep 2022",
        role: "Frontend Engineer · SFCC Developer · FinTech & Retail",
        context:
            "Barcelona, Spain · Remote · Software Consulting · Hawaiian Airlines · CaixaBank · Salesforce B2C Commerce Cloud",
        badges: [
            "JavaScript",
            "React",
            "jQuery",
            "Sass",
            "Salesforce B2C Commerce Cloud",
            "PWA",
            "Jenkins",
            "GitLab",
        ],
        responsibilities: [
            "Delivered technical solutions across FinTech, digital banking, retail and commerce environments.",
            "Utilised JavaScript, jQuery and React with extensive experience in Sass and advanced styling.",
            "Co-led the conceptual design and MVP development of a PWA implementation as a modern replacement for SFRA within Salesforce Commerce Cloud.",
            "Implemented CI/CD pipelines with Jenkins and GitLab following a branch strategy.",
            "Worked across Waterfall and Agile methodologies depending on project phase.",
            "Mentored junior developers and led a squad towards delivery milestones.",
        ],
        achievements: [
            "Obtained Salesforce Certified B2C Commerce Developer certification.",
            "Led the implementation of a new commerce solution and co-led the conceptual MVP for a Salesforce PWA.",
            "Progressed from Frontend Developer to broader technical ownership across implementations and high-performing teams.",
            "Orchestrated CI/CD pipelines with Jenkins, GitLab and GitFlow.",
        ],
        subprojects: [
            {
                title: "Salesforce Commerce Cloud & PWA",
                description:
                    "A Salesforce Commerce Cloud initiative exploring a PWA approach as a modern replacement for SFRA.",
                responsibilities: [
                    "Conceptual design and MVP development.",
                    "Frontend implementation with JavaScript, React and Sass.",
                    "Commerce solution implementation within Salesforce B2C Commerce Cloud.",
                ],
                achievements: [
                    "Co-led a conceptual PWA MVP and supported the implementation of a new commerce solution.",
                ],
                badges: [
                    "Salesforce B2C Commerce Cloud",
                    "SFRA",
                    "PWA",
                    "React",
                    "JavaScript",
                    "Sass",
                ],
            },
            {
                title: "CI/CD & Team Delivery",
                description:
                    "Continuous integration and delivery practices supporting enterprise implementations.",
                responsibilities: [
                    "Implemented Jenkins and GitLab pipelines.",
                    "Applied branch and GitFlow strategies.",
                    "Worked across Agile and Waterfall delivery models.",
                    "Mentored junior developers and supported squad milestones.",
                ],
                achievements: [
                    "Established reliable CI/CD workflows across different project methodologies.",
                ],
                badges: ["Jenkins", "GitLab", "GitFlow", "CI/CD", "Agile"],
            },
        ],
    },
    {
        company: "Marcmedia",
        period: "Nov 2020 — May 2021",
        role: "Frontend Engineer · High-Traffic Reactive eCommerce",
        context:
            "Barcelona, Spain · Remote · B2C Electronics eCommerce Marketplace",
        badges: [
            "React",
            "Redux",
            "PHP",
            "MySQL",
            "Webpack",
            "Custom hooks",
            "REST APIs",
        ],
        responsibilities: [
            "Led the technical solution for migrating content hosted in the deprecated Drupal CMS frontend to React without external libraries.",
            "Developed React custom hooks and implemented native global state management strategies.",
            "Connected the React frontend to an existing PHP/MySQL backend and configured Webpack.",
            "Integrated complex RESTful APIs supporting massive daily traffic.",
        ],
        achievements: [
            "Migrated legacy landing pages to React while prioritising custom hooks and maintainable state management.",
            "Improved application performance through bundle reduction and a consistent React-based experience.",
            "Led a team of four developers implementing a new technical proposal and documented compilation and deployment.",
        ],
        subprojects: [
            {
                title: "Drupal to React Migration",
                description:
                    "Migration of a legacy Drupal frontend to a React-based experience designed for high-traffic commerce.",
                responsibilities: [
                    "Migrated content and landing pages.",
                    "Implemented custom hooks and native state management.",
                    "Connected React to PHP/MySQL and REST APIs.",
                    "Configured Webpack build and deployment processes.",
                ],
                achievements: [
                    "Improved performance and maintainability while enabling a consistent React-based frontend.",
                ],
                badges: [
                    "React",
                    "Redux",
                    "PHP",
                    "MySQL",
                    "Webpack",
                    "REST APIs",
                ],
            },
        ],
    },
    {
        company: "Barcelona Activa",
        period: "Mar 2020 — Oct 2020",
        role: "Frontend Developer · Web Applications",
        context:
            "Barcelona, Spain · Remote · EdTech · Gastronomic B2C Marketplace",
        badges: [
            "React",
            "TypeScript",
            "Jest",
            "Enzyme",
            "SOLID",
            "JavaScript",
        ],
        responsibilities: [
            "Worked as part of a multidisciplinary team alongside the backend squad.",
            "Developed new applications based on React with TypeScript and unit testing using Jest and Enzyme.",
            "Collaborated with writers and students with a focus on code modularisation and agile principles.",
            "Developed and maintained user interfaces with a focus on UI architecture and JavaScript performance.",
        ],
        achievements: [
            "Launched a sprint-based study platform with a gated progression model.",
            "The approach resulted in a 28% increase in new students after three months.",
        ],
        subprojects: [
            {
                title: "Sprint-based Learning Platform",
                description:
                    "A study platform designed to create a faster feedback loop between student work and the next learning stage.",
                responsibilities: [
                    "Developed React and TypeScript interfaces.",
                    "Implemented the sprint progression experience.",
                    "Worked with backend and content teams.",
                    "Applied testing, modularisation and performance practices.",
                ],
                achievements: [
                    "Contributed to a 28% increase in new students after three months.",
                ],
                badges: ["React", "TypeScript", "Jest", "Enzyme", "EdTech"],
            },
        ],
    },
    {
        company: "Food Souvenir Barcelona",
        period: "Jan 2019 — May 2020",
        role: "Founder & Full Stack Developer · eCommerce",
        context: "Spain · Hybrid · Food & Gastronomy eCommerce B2C",
        badges: [
            "WordPress",
            "WooCommerce",
            "PHP",
            "SEO",
            "Performance",
            "Business planning",
        ],
        responsibilities: [
            "Responsible for web design and development, social media communications and SEO, as well as customer and partner acquisition.",
            "Founded a local gastronomic business and developed from scratch a proprietary eCommerce platform to manage online sales, services and exports.",
        ],
        achievements: [
            "Conducted a comprehensive competition analysis and developed a detailed economic viability plan.",
            "Built an eCommerce site using WordPress with a unique, fully customised theme.",
            "Achieved a 97/100 Google PageSpeed score through performance-first architecture.",
            "Integrated multiple functionalities into a single plugin to optimise efficiency and site performance.",
        ],
        subprojects: [
            {
                title: "Independent eCommerce Venture",
                description:
                    "A local gastronomic business combining product, business planning, digital presence and technical implementation.",
                responsibilities: [
                    "Defined the business and viability plan.",
                    "Designed and developed the eCommerce platform.",
                    "Managed SEO, social media and customer acquisition.",
                    "Built the customised WordPress and WooCommerce experience.",
                ],
                achievements: [
                    "Achieved a 97/100 Google PageSpeed score.",
                    "Created a unified plugin architecture to improve efficiency and site performance.",
                ],
                badges: [
                    "WordPress",
                    "WooCommerce",
                    "PHP",
                    "SEO",
                    "Performance",
                    "Business planning",
                ],
            },
        ],
    },
];

export default function Projects() {
    const t = useT();
    const labels = {
        responsibilities: t("projects.responsibilitiesLabel"),
        achievements: t("projects.achievementsLabel"),
        projects: t("projects.projectsWithinRole"),
        moreInfo: t("projects.moreInfo"),
        close: t("common.close"),
    };
    return (
        <>
            <Seo />
            <main className="projects-page">
                <section className="projects-hero section">
                    <div className="container projects-hero__inner">
                        <p className="eyebrow">{t("projects.eyebrow")}</p>
                        <h1>{t("projects.title")}</h1>
                        <p className="lead">{t("projects.intro")}</p>
                    </div>
                </section>

                <section
                    className="section experience-section"
                    aria-labelledby="experience-title"
                >
                    <div className="container">
                        <div className="section-heading">
                            <p className="eyebrow">
                                {t("projects.experienceEyebrow")}
                            </p>
                            <h2 id="experience-title">
                                {t("projects.experienceTitle")}
                            </h2>
                            <p className="lead">
                                {t("projects.experienceIntro")}
                            </p>
                        </div>
                        <ExperienceTimeline
                            experiences={experiences}
                            labels={labels}
                        />
                    </div>
                </section>
                <CompanyLogoMarquee />
            </main>
        </>
    );
}
