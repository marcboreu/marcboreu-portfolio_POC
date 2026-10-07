import Layout from '@/components/Layout';
import Seo from '@/components/Seo';
import { useT } from '@/lib/i18n';

type Project = {
    title: string;
    eyebrow: string;
    description: string;
    meta: string;
    stack: string;
    outcome: string;
    featured?: boolean;
};

type Experience = {
    company: string;
    period: string;
    role: string;
    context: string;
    responsibilities: string[];
    achievements: string[];
};

const projects: Project[] = [
    {
        title: 'From SiteGenesis to Composable Commerce',
        eyebrow: 'Professional work · Enterprise commerce',
        description: 'A progressive transformation of a live enterprise commerce platform towards a more flexible Salesforce-based architecture.',
        meta: 'React · TypeScript · Salesforce B2C Commerce Cloud · SFRA · SiteGenesis',
        stack: 'SCAPI · OCAPI · Headless commerce · Legacy modernization',
        outcome: 'Platform evolution without disrupting ongoing business operations.',
        featured: true,
    },
    {
        title: 'Commerce platform for a large-scale destination',
        eyebrow: 'Professional work · Full-stack commerce',
        description: 'A customised commerce platform connecting business logic, customer operations and external enterprise services.',
        meta: 'React · Redux · PHP · SQL · REST APIs',
        stack: 'Business analysis · Development · QA · Integrations',
        outcome: 'A reliable digital platform supporting complex commerce workflows.',
    },
    {
        title: 'Migrating a content platform from Drupal to React',
        eyebrow: 'Professional work · Frontend modernisation',
        description: 'A frontend modernisation initiative that moved content from a legacy Drupal platform into a lighter React-based experience.',
        meta: 'React · Redux · PHP · MySQL · Webpack',
        stack: 'Custom hooks · Performance · Technical coordination',
        outcome: 'Improved maintainability and a more focused frontend architecture.',
    },
    {
        title: 'Food Souvenir — Building an eCommerce business',
        eyebrow: 'Personal project · Founder · eCommerce',
        description: 'A personal venture built from business idea to online operation, combining product, commerce, technology and customer acquisition.',
        meta: 'WordPress · WooCommerce · SEO · Performance',
        stack: 'Business planning · Custom platform · Digital presence',
        outcome: 'A complete eCommerce initiative with a measured 97/100 Google PageSpeed score.',
    },
    {
        title: 'A multilingual portfolio with static prerendering',
        eyebrow: 'Personal project · Architecture · Laravel',
        description: 'A multilingual React portfolio designed to deliver rendered HTML through PHP-only hosting without requiring a permanent Node.js server in production.',
        meta: 'Laravel · Inertia · React · TypeScript · Vite',
        stack: 'Static prerendering · SEO · Multilingual routing',
        outcome: 'A portable architecture that keeps local development and PHP hosting production flows separate.',
    },
];

const experiences: Experience[] = [
    {
        company: 'Capgemini',
        period: 'Jun 2023 — Present',
        role: 'Frontend Engineer & Software Architect · Composable Commerce',
        context: 'Software consulting · Luxury eCommerce · Salesforce B2C Commerce Cloud',
        responsibilities: [
            'Led frontend implementation for a progressive migration from SiteGenesis to a composable commerce architecture in a live enterprise environment.',
            'Developed scalable React and TypeScript solutions using modern component-driven patterns while preserving coexistence with legacy production code.',
            'Collaborated across business and technical teams to deliver incremental releases with minimal friction.',
            'Contributed to architectural decisions, code quality, maintainability and user experience improvements across a complex commerce ecosystem.',
            'Worked with Salesforce B2C Commerce Cloud, SFRA, SCAPI and OCAPI for headless and API-first initiatives.',
            'Acted as Release Manager, coordinating DevOps practices, release cycles and deployment strategies.',
        ],
        achievements: [
            'Architected and deployed a proprietary React, TypeScript and Styled Components UI library across multiple international markets.',
            'Drove the incremental modernisation of a live commerce platform from legacy SiteGenesis towards composable architecture.',
            'Improved frontend performance and customer experience through a modern headless approach.',
            'Established reusable development workflows and React Code Review standards across the team.',
        ],
    },
    {
        company: 'marcboreu',
        period: 'Jan 2020 — Present',
        role: 'Technical Consultant & Full Stack Developer · Freelance',
        context: 'B2C & B2B eCommerce · Enterprise web applications · CRM',
        responsibilities: [
            'Delivered end-to-end web solutions with React/Vue frontends, Node.js/Laravel/Express backends and custom REST APIs.',
            'Designed and implemented WordPress and WooCommerce sites with custom themes, plugins and extensions.',
            'Provided interface design, UX proposals, competitive analysis and SEO improvement.',
            'Architected and developed custom APIs and database microservices with Node.js and PHP.',
            'Advised clients on technical direction, business vision and digital product decisions.',
        ],
        achievements: [
            'Delivered complete solutions from discovery and planning through implementation and deployment.',
            'Combined technical architecture with business and financial planning for independent digital products.',
            'Built reusable integrations and custom commerce capabilities for different client contexts.',
        ],
    },
    {
        company: 'Interficie Internet Services',
        period: 'Sep 2022 — Jun 2023',
        role: 'Frontend Engineer · Booking · CRM · React Arch',
        context: 'Software consulting · PortAventura World',
        responsibilities: [
            'Developed full-stack applications with TypeScript, React, Redux, PHP, SQL and REST APIs.',
            'Built frontend solutions for a customer-focused eCommerce environment covering service management, bookings and complex integrations.',
            'Integrated external services and APIs, connecting frontend flows with critical business processes.',
            'Designed reusable UI components and SCSS modules with a focus on maintainability and scalability.',
            'Collaborated with backend teams and enterprise services through Node.js and PHP.',
        ],
        achievements: [
            'Implemented calendars, validators and sliders without external libraries, reducing code by 15% and improving maintainability.',
            'Managed development as Business Analyst, Developer and QA, ensuring strong quality control.',
            'Contributed to a platform serving complex operations, user management and data from multiple enterprise sources.',
        ],
    },
    {
        company: 'Capgemini',
        period: 'May 2021 — Sep 2022',
        role: 'Frontend Engineer · SFCC Developer · FinTech & Retail',
        context: 'Software consulting · Hawaiian Airlines · CaixaBank · Salesforce B2C Commerce Cloud',
        responsibilities: [
            'Delivered technical solutions for enterprise projects in FinTech, digital banking and retail environments.',
            'Used JavaScript, jQuery and React with extensive experience in Sass and advanced styling.',
            'Co-led the conceptual design and MVP development of a PWA implementation as a modern replacement for SFRA within Salesforce Commerce Cloud.',
            'Implemented CI/CD pipelines with Jenkins and GitLab following a branch strategy.',
            'Worked across Waterfall and Agile delivery models depending on project phase.',
            'Mentored junior developers and supported squad delivery milestones.',
        ],
        achievements: [
            'Developed as a Scrum Developer and obtained Salesforce Certified B2C Commerce Developer certification.',
            'Led the implementation of a new commerce solution and co-led the conceptual MVP for a PWA applied to Salesforce.',
            'Progressed from Frontend Developer to broader technical ownership across implementations and development teams.',
            'Orchestrated CI/CD pipelines across Agile and Waterfall methodologies.',
        ],
    },
    {
        company: 'Marcmedia',
        period: 'Nov 2020 — May 2021',
        role: 'Frontend Engineer · High-Traffic Reactive eCommerce',
        context: 'B2C electronics eCommerce marketplace',
        responsibilities: [
            'Led the frontend migration of content from a deprecated Drupal CMS to React without external libraries.',
            'Developed React custom hooks and native global state management strategies focused on Core Web Vitals and load performance.',
            'Connected React frontend solutions to PHP/MySQL backends and configured Webpack build processes.',
            'Integrated RESTful APIs supporting high-traffic eCommerce functionality.',
        ],
        achievements: [
            'Migrated legacy landing pages to React while prioritising custom hooks and maintainable state management.',
            'Improved application performance by reducing bundle size and creating a consistent React-based experience.',
            'Coordinated a four-developer implementation team and documented the compilation and deployment process.',
        ],
    },
    {
        company: 'Barcelona Activa',
        period: 'Mar 2020 — Oct 2020',
        role: 'Frontend Developer · Web Applications',
        context: 'EdTech · Gastronomic B2C marketplace',
        responsibilities: [
            'Developed React and TypeScript web applications with unit testing using Jest and Enzyme.',
            'Worked with multidisciplinary teams alongside backend developers.',
            'Applied modularisation, SOLID principles and JavaScript performance practices.',
            'Developed and maintained user interfaces for web applications.',
        ],
        achievements: [
            'Launched a sprint-based study platform that unlocked the next learning stage after approved sprint work.',
            'The approach contributed to a 28% increase in new students after three months.',
        ],
    },
    {
        company: 'Food Souvenir Barcelona',
        period: 'Jan 2019 — May 2020',
        role: 'Founder & Full Stack Developer · eCommerce',
        context: 'Food & gastronomy eCommerce B2C',
        responsibilities: [
            'Created the digital presence and managed social media, SEO, customer acquisition and partner relationships.',
            'Founded a local gastronomic business and designed and developed its eCommerce platform from scratch.',
            'Combined product, business planning and technical delivery in a complete independent venture.',
        ],
        achievements: [
            'Conducted competition analysis and developed an economic viability plan.',
            'Built a customised WooCommerce eCommerce solution with a fully tailored theme.',
            'Achieved a 97/100 Google PageSpeed score through performance-first architecture.',
            'Integrated multiple functionalities into a unified plugin to improve efficiency and site performance.',
        ],
    },
];

export default function Projects() {
    const t = useT();

    return (
        <Layout>
            <Seo />
            <main className="projects-page">
                <section className="projects-hero section">
                    <div className="container projects-hero__inner">
                        <p className="eyebrow">{t('projects.eyebrow')}</p>
                        <h1>{t('projects.title')}</h1>
                        <p className="lead">{t('projects.intro')}</p>
                    </div>
                </section>

                <section className="section projects-section" aria-labelledby="professional-work-title">
                    <div className="container">
                        <div className="section-heading">
                            <p className="eyebrow">{t('projects.professionalEyebrow')}</p>
                            <h2 id="professional-work-title">{t('projects.professionalTitle')}</h2>
                        </div>

                        <div className="projects-grid projects-grid--professional">
                            {projects.slice(0, 3).map((project) => (
                                <article className={`project-card${project.featured ? ' project-card--featured' : ''}`} key={project.title}>
                                    <div className="project-card__body">
                                        <p className="project-card__eyebrow">{project.eyebrow}</p>
                                        <h3>{project.title}</h3>
                                        <p className="project-card__description">{project.description}</p>
                                        <div className="project-card__meta"><p>{project.meta}</p><p>{project.stack}</p></div>
                                        <p className="project-card__outcome"><span>{t('projects.outcomeLabel')}</span> {project.outcome}</p>
                                    </div>
                                    <span className="project-card__link">{t('projects.viewCase')} <span aria-hidden="true">→</span></span>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="section projects-section projects-section--personal" aria-labelledby="personal-projects-title">
                    <div className="container">
                        <div className="section-heading"><p className="eyebrow">{t('projects.personalEyebrow')}</p><h2 id="personal-projects-title">{t('projects.personalTitle')}</h2></div>
                        <div className="projects-grid projects-grid--personal">
                            {projects.slice(3).map((project) => (
                                <article className="project-card" key={project.title}>
                                    <div className="project-card__body"><p className="project-card__eyebrow">{project.eyebrow}</p><h3>{project.title}</h3><p className="project-card__description">{project.description}</p><div className="project-card__meta"><p>{project.meta}</p><p>{project.stack}</p></div><p className="project-card__outcome"><span>{t('projects.outcomeLabel')}</span> {project.outcome}</p></div>
                                    <span className="project-card__link">{t('projects.viewCase')} <span aria-hidden="true">→</span></span>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="section experience-section" aria-labelledby="experience-title">
                    <div className="container">
                        <div className="section-heading"><p className="eyebrow">{t('projects.experienceEyebrow')}</p><h2 id="experience-title">{t('projects.experienceTitle')}</h2><p className="lead">{t('projects.experienceIntro')}</p></div>
                        <div className="experience-list">
                            {experiences.map((experience) => (
                                <article className="experience-entry" key={`${experience.company}-${experience.period}`}>
                                    <div className="experience-entry__header"><div><p className="experience-entry__company">{experience.company}</p><h3>{experience.role}</h3></div><p className="experience-entry__period">{experience.period}</p></div>
                                    <p className="experience-entry__context">{experience.context}</p>
                                    <div className="experience-entry__columns"><div><h4>{t('projects.responsibilitiesLabel')}</h4><ul>{experience.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h4>{t('projects.achievementsLabel')}</h4><ul>{experience.achievements.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
