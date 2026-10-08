import CompanyLogoMarquee from '@/components/CompanyLogoMarquee';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import Seo from '@/components/Seo';

export default function Projects() {
    return <main className="projects-page"><Seo title="Projects" description="Selected projects and professional experience." /><section className="projects-hero"><div className="projects-hero__inner"><p className="eyebrow">Projects</p><h1>Professional experience and selected work.</h1><p>Digital products, commerce platforms and experiences built across different industries.</p></div></section><CompanyLogoMarquee /><ExperienceTimeline /></main>;
}
