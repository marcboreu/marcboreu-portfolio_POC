import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import Badge from '@/components/ui/Badge';

type Project = { title: string; description: string; responsibilities: string[]; achievements: string[]; badges: string[] };
type Experience = { company: string; period: string; role: string; context: string; responsibilities: string[]; achievements: string[]; badges: string[]; subprojects: Project[] };

type Props = { experiences: Experience[]; labels: { responsibilities: string; achievements: string; projects: string } };

function BadgeList({ items }: { items: string[] }) {
    return <ul className="badge-list" aria-label="Technologies and capabilities">{items.map((item) => <li key={item}><Badge>{item}</Badge></li>)}</ul>;
}

function TextBlocks({ title, items }: { title: string; items: string[] }) {
    return <div className="experience-card__text-blocks"><p className="experience-card__label">{title}</p>{items.map((item) => <p key={item}>{item}</p>)}</div>;
}

function ExperienceCard({ experience, index, labels }: { experience: Experience; index: number; labels: Props['labels'] }) {
    const ref = useRef<HTMLElement | null>(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: '-38% 0px -38% 0px', threshold: 0 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return <article ref={ref} className={`experience-timeline__item experience-timeline__item--${index % 2 === 0 ? 'left' : 'right'}${active ? ' is-active' : ''}`}>
        <span className="experience-timeline__node" aria-hidden="true" />
        <p className="experience-timeline__year">{experience.period.split(' ')[0]}</p>
        <div className="experience-card">
            <header className="experience-card__header"><div><p className="experience-card__company">{experience.company}</p><h3>{experience.role}</h3></div><p className="experience-card__period">{experience.period}</p></header>
            <p className="experience-card__context">{experience.context}</p>
            <BadgeList items={experience.badges} />
            <div className="experience-card__content"><TextBlocks title={labels.responsibilities} items={experience.responsibilities} /><TextBlocks title={labels.achievements} items={experience.achievements} /></div>
            <div className="experience-card__projects"><p className="experience-card__label">{labels.projects}</p><div className="experience-card__project-grid">{experience.subprojects.map((project) => <section className="experience-card__project" key={project.title}><h4>{project.title}</h4><p>{project.description}</p><BadgeList items={project.badges} /><div className="experience-card__project-content"><TextBlocks title={labels.responsibilities} items={project.responsibilities} /><TextBlocks title={labels.achievements} items={project.achievements} /></div></section>)}</div></div>
        </div>
    </article>;
}

export default function ExperienceTimeline({ experiences, labels }: Props) {
    const timelineRef = useRef<HTMLElement | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            if (!timelineRef.current) return;
            const rect = timelineRef.current.getBoundingClientRect();
            const viewport = window.innerHeight;
            const value = Math.min(100, Math.max(0, ((viewport * 0.5 - rect.top) / rect.height) * 100));
            setProgress(value);
        };
        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
        return () => { window.removeEventListener('scroll', updateProgress); window.removeEventListener('resize', updateProgress); };
    }, []);

    return <section ref={timelineRef} className="experience-timeline" style={{ '--timeline-progress': `${progress}%` } as CSSProperties} aria-label="Professional experience"><div className="experience-timeline__line" aria-hidden="true" /><div className="experience-timeline__progress" aria-hidden="true" />{experiences.map((experience, index) => <ExperienceCard key={`${experience.company}-${experience.period}`} experience={experience} index={index} labels={labels} />)}</section>;
}
