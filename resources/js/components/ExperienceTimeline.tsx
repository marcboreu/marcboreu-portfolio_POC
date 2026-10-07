import { useRef } from 'react';
import { motion, useMotionTemplate, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import Badge from '@/components/ui/Badge';

type Project = { title: string; description: string; responsibilities: string[]; achievements: string[]; badges: string[] };
type Experience = { company: string; period: string; role: string; context: string; responsibilities: string[]; achievements: string[]; badges: string[]; subprojects: Project[] };
type Props = { experiences: Experience[]; labels: { responsibilities: string; achievements: string; projects: string } };

function BadgeList({ items }: { items: string[] }) { return <ul className="badge-list" aria-label="Technologies and capabilities">{items.map((item) => <li key={item}><Badge>{item}</Badge></li>)}</ul>; }
function TextBlocks({ title, items }: { title: string; items: string[] }) { return <div className="experience-card__text-blocks"><p className="experience-card__label">{title}</p>{items.map((item) => <p key={item}>{item}</p>)}</div>; }

function ExperienceCard({ experience, index, labels }: { experience: Experience; index: number; labels: Props['labels'] }) {
    const ref = useRef<HTMLElement | null>(null);
    const reducedMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.92', 'center 0.5', 'end 0.08'] });
    const opacity = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], reducedMotion ? [1, 1, 1] : [0.24, 1, 0.36]), { stiffness: 120, damping: 28, mass: 0.8 });
    const scale = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], reducedMotion ? [1, 1, 1] : [0.965, 1, 0.985]), { stiffness: 120, damping: 28, mass: 0.8 });
    const y = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], reducedMotion ? [0, 0, 0] : [36, 0, -22]), { stiffness: 120, damping: 28, mass: 0.8 });
    const blur = useTransform(scrollYProgress, [0, 0.5, 1], reducedMotion ? [0, 0, 0] : [16, 0, 8]);
    const filter = useMotionTemplate`blur(${blur}px)`;
    const side = index % 2 === 0 ? 'left' : 'right';

    return <motion.article ref={ref} className={`experience-timeline__item experience-timeline__item--${side}`} style={{ opacity, scale, y, filter }}><span className="experience-timeline__node" aria-hidden="true" /><p className="experience-timeline__year">{experience.period.split(' ')[1] ?? experience.period.split(' ')[0]}</p><div className="experience-card"><header className="experience-card__header"><div><p className="experience-card__company">{experience.company}</p><h3>{experience.role}</h3></div><p className="experience-card__period">{experience.period}</p></header><p className="experience-card__context">{experience.context}</p><BadgeList items={experience.badges} /><div className="experience-card__content"><TextBlocks title={labels.responsibilities} items={experience.responsibilities} /><TextBlocks title={labels.achievements} items={experience.achievements} /></div><div className="experience-card__projects"><p className="experience-card__label">{labels.projects}</p><div className="experience-card__project-grid">{experience.subprojects.map((project) => <motion.section key={project.title} className="experience-card__project" initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.24 }} transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}><h4>{project.title}</h4><p>{project.description}</p><BadgeList items={project.badges} /><div className="experience-card__project-content"><TextBlocks title={labels.responsibilities} items={project.responsibilities} /><TextBlocks title={labels.achievements} items={project.achievements} /></div></motion.section>)}</div></div></div></motion.article>;
}

export default function ExperienceTimeline({ experiences, labels }: Props) {
    const timelineRef = useRef<HTMLElement | null>(null);
    const reducedMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 0.75', 'end 0.25'] });
    const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.8 });
    return <section ref={timelineRef} className="experience-timeline" aria-label="Professional experience"><div className="experience-timeline__line" aria-hidden="true" /><motion.div className="experience-timeline__progress" style={{ scaleY: reducedMotion ? 1 : progress }} aria-hidden="true" />{experiences.map((experience, index) => <ExperienceCard key={`${experience.company}-${experience.period}`} experience={experience} index={index} labels={labels} />)}</section>;
}
