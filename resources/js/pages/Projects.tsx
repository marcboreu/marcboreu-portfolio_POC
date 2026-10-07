import Layout from '@/components/Layout';
import Seo from '@/components/Seo';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import { useT } from '@/lib/i18n';

type Project = { title: string; description: string; responsibilities: string[]; achievements: string[]; badges: string[] };
type Experience = { company: string; period: string; role: string; context: string; responsibilities: string[]; achievements: string[]; badges: string[]; subprojects: Project[] };

const experiences: Experience[] = [];

export default function Projects() {
    const t = useT();
    const labels = { responsibilities: t('projects.responsibilitiesLabel'), achievements: t('projects.achievementsLabel'), projects: t('projects.projectsWithinRole') };
    return <Layout><Seo /><main className="projects-page"><section className="projects-hero section"><div className="container projects-hero__inner"><p className="eyebrow">{t('projects.eyebrow')}</p><h1>{t('projects.title')}</h1><p className="lead">{t('projects.intro')}</p></div></section><section className="section experience-section"><div className="container"><div className="section-heading"><p className="eyebrow">{t('projects.experienceEyebrow')}</p><h2>{t('projects.experienceTitle')}</h2><p className="lead">{t('projects.experienceIntro')}</p></div><ExperienceTimeline experiences={experiences} labels={labels} /></div></section></main></Layout>;
}
