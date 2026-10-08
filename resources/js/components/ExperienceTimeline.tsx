import { useEffect, useRef, useState } from "react";
import {
    motion,
    useMotionTemplate,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from "motion/react";
import Badge from "@/components/ui/Badge";

type Project = {
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
    subprojects: Project[];
};
type Props = {
    experiences: Experience[];
    labels: {
        responsibilities: string;
        achievements: string;
        projects: string;
        moreInfo?: string;
        close?: string;
    };
};

function BadgeList({ items }: { items: string[] }) {
    return (
        <ul className="badge-list" aria-label="Technologies and capabilities">
            {items.map((item) => (
                <li key={item}>
                    <Badge>{item}</Badge>
                </li>
            ))}
        </ul>
    );
}
function TextBlocks({ title, items }: { title: string; items: string[] }) {
    return (
        <div className="experience-card__text-blocks">
            <p className="experience-card__label">{title}</p>
            {items.map((item) => (
                <p key={item}>{item}</p>
            ))}
        </div>
    );
}
function ExperienceDetails({
    experience,
    labels,
}: {
    experience: Experience;
    labels: Props["labels"];
}) {
    return (
        <>
            <p className="experience-card__context">{experience.context}</p>
            <BadgeList items={experience.badges} />
            <div className="experience-card__content">
                <TextBlocks
                    title={labels.responsibilities}
                    items={experience.responsibilities}
                />
                <TextBlocks
                    title={labels.achievements}
                    items={experience.achievements}
                />
            </div>
            <div className="experience-card__projects">
                <p className="experience-card__label">{labels.projects}</p>
                <div className="experience-card__project-grid">
                    {experience.subprojects.map((project) => (
                        <section
                            key={project.title}
                            className="experience-card__project"
                        >
                            <h4>{project.title}</h4>
                            <p>{project.description}</p>
                            <BadgeList items={project.badges} />
                            <div className="experience-card__project-content">
                                <TextBlocks
                                    title={labels.responsibilities}
                                    items={project.responsibilities}
                                />
                                <TextBlocks
                                    title={labels.achievements}
                                    items={project.achievements}
                                />
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </>
    );
}
function ExperienceCard({
    experience,
    index,
    labels,
    onMoreInfo,
    activeIndex,
}: {
    experience: Experience;
    index: number;
    labels: Props["labels"];
    onMoreInfo: () => void;
    activeIndex: number | null;
}) {
    const ref = useRef<HTMLElement | null>(null);
    const reducedMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.92", "center 0.5", "end 0.08"],
    });
    const opacity = useSpring(
        useTransform(
            scrollYProgress,
            [0, 0.5, 1],
            reducedMotion ? [1, 1, 1] : [0.35, 1, 0.45],
        ),
        { stiffness: 120, damping: 30, mass: 0.9 },
    );
    const scale = useSpring(
        useTransform(
            scrollYProgress,
            [0, 0.5, 1],
            reducedMotion ? [1, 1, 1] : [0.88, 1, 0.9],
        ),
        { stiffness: 120, damping: 30, mass: 0.9 },
    );
    const y = useSpring(
        useTransform(
            scrollYProgress,
            [0, 0.5, 1],
            reducedMotion ? [0, 0, 0] : [42, 0, -30],
        ),
        { stiffness: 120, damping: 30, mass: 0.9 },
    );
    const rotate = useSpring(
        useTransform(
            scrollYProgress,
            [0, 0.5, 1],
            reducedMotion ? [0, 0, 0] : [-1.8, 0, 1.8],
        ),
        { stiffness: 120, damping: 30, mass: 0.9 },
    );
    const blur = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        reducedMotion ? [0, 0, 0] : [2, 0, 2],
    );
    const filter = useMotionTemplate`blur(${blur}px)`;
    const side = index % 2 === 0 ? "left" : "right";
    const moreInfo = labels.moreInfo ?? "More info";
    const isActive = activeIndex === index;
    const cardOpacity = reducedMotion ? 1 : isActive ? 1 : 0.58;
    const cardScale = reducedMotion ? 1 : isActive ? 1.04 : 0.88;
    const cardRotate = reducedMotion
        ? 0
        : isActive
          ? 0
          : index < (activeIndex ?? index)
            ? -1.2
            : 1.2;
    return (
        <motion.article
            ref={ref}
            className={`experience-timeline__item experience-timeline__item--${side}${isActive ? " is-active" : ""}`}
            style={{
                opacity: cardOpacity,
                scale: cardScale,
                y,
                rotate: cardRotate,
                filter: isActive ? "blur(0px)" : filter,
            }}
        >
            <span className="experience-timeline__node" aria-hidden="true" />
            <p className="experience-timeline__year">
                {experience.period.split(" ")[1] ??
                    experience.period.split(" ")[0]}
            </p>
            <div className="experience-card">
                <header className="experience-card__header">
                    <div>
                        <p className="experience-card__company">
                            {experience.company}
                        </p>
                        <h3>{experience.role}</h3>
                    </div>
                    <p className="experience-card__period">
                        {experience.period}
                    </p>
                </header>
                <p className="experience-card__context experience-card__context--preview">
                    {experience.context}
                </p>
                <BadgeList items={experience.badges.slice(0, 4)} />
                <button
                    type="button"
                    className="experience-card__more"
                    onClick={onMoreInfo}
                >
                    {moreInfo}
                    <span aria-hidden="true">→</span>
                </button>
            </div>
        </motion.article>
    );
}
function ExperienceModal({
    experience,
    labels,
    onClose,
}: {
    experience: Experience;
    labels: Props["labels"];
    onClose: () => void;
}) {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onClose]);
    return (
        <div
            className="experience-modal"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                className="experience-modal__dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="experience-modal-title"
            >
                <button
                    type="button"
                    className="experience-modal__close"
                    onClick={onClose}
                    aria-label={labels.close ?? "Close"}
                >
                    ×
                </button>
                <p className="experience-card__company">{experience.company}</p>
                <h3 id="experience-modal-title">{experience.role}</h3>
                <p className="experience-card__period">{experience.period}</p>
                <ExperienceDetails experience={experience} labels={labels} />
            </div>
        </div>
    );
}
export default function ExperienceTimeline({ experiences, labels }: Props) {
    const timelineRef = useRef<HTMLElement | null>(null);
    const reducedMotion = useReducedMotion();
    const [selectedExperience, setSelectedExperience] =
        useState<Experience | null>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start 0.5", "end 0.5"],
    });
    const progress = useSpring(scrollYProgress, {
        stiffness: 70,
        damping: 32,
        mass: 0.9,
    });
    useEffect(() => {
        const updateActive = () => {
            const nodes = Array.from(
                document.querySelectorAll<HTMLElement>(
                    ".experience-timeline__item",
                ),
            );
            if (!nodes.length) return;
            const center = window.innerHeight / 2;
            let nearest = 0;
            let distance = Number.POSITIVE_INFINITY;
            nodes.forEach((node, index) => {
                const rect = node.getBoundingClientRect();
                const currentDistance = Math.abs(
                    rect.top + rect.height / 2 - center,
                );
                if (currentDistance < distance) {
                    distance = currentDistance;
                    nearest = index;
                }
            });
            setActiveIndex(nearest);
        };
        updateActive();
        window.addEventListener("scroll", updateActive, { passive: true });
        window.addEventListener("resize", updateActive);
        return () => {
            window.removeEventListener("scroll", updateActive);
            window.removeEventListener("resize", updateActive);
        };
    }, []);
    return (
        <>
            <section
                ref={timelineRef}
                className="experience-timeline"
                aria-label="Professional experience"
            >
                <div className="experience-timeline__line" aria-hidden="true" />
                <motion.div
                    className="experience-timeline__progress"
                    style={{ scaleY: reducedMotion ? 1 : progress }}
                    aria-hidden="true"
                />
                {experiences.map((experience, index) => (
                    <ExperienceCard
                        key={`${experience.company}-${experience.period}`}
                        experience={experience}
                        index={index}
                        labels={labels}
                        activeIndex={activeIndex}
                        onMoreInfo={() => setSelectedExperience(experience)}
                    />
                ))}
            </section>
            {selectedExperience && (
                <ExperienceModal
                    experience={selectedExperience}
                    labels={labels}
                    onClose={() => setSelectedExperience(null)}
                />
            )}
        </>
    );
}
