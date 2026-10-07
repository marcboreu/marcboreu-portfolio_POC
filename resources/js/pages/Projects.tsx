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
                                <article
                                    className={`project-card${project.featured ? ' project-card--featured' : ''}`}
                                    key={project.title}
                                >
                                    <div className="project-card__body">
                                        <p className="project-card__eyebrow">{project.eyebrow}</p>
                                        <h3>{project.title}</h3>
                                        <p className="project-card__description">{project.description}</p>
                                        <div className="project-card__meta">
                                            <p>{project.meta}</p>
                                            <p>{project.stack}</p>
                                        </div>
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
                        <div className="section-heading">
                            <p className="eyebrow">{t('projects.personalEyebrow')}</p>
                            <h2 id="personal-projects-title">{t('projects.personalTitle')}</h2>
                        </div>

                        <div className="projects-grid projects-grid--personal">
                            {projects.slice(3).map((project) => (
                                <article className="project-card" key={project.title}>
                                    <div className="project-card__body">
                                        <p className="project-card__eyebrow">{project.eyebrow}</p>
                                        <h3>{project.title}</h3>
                                        <p className="project-card__description">{project.description}</p>
                                        <div className="project-card__meta">
                                            <p>{project.meta}</p>
                                            <p>{project.stack}</p>
                                        </div>
                                        <p className="project-card__outcome"><span>{t('projects.outcomeLabel')}</span> {project.outcome}</p>
                                    </div>
                                    <span className="project-card__link">{t('projects.viewCase')} <span aria-hidden="true">→</span></span>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
