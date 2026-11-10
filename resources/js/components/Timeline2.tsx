import {
    useEffect,
    useId,
    useRef,
    useState,
    type CSSProperties,
} from "react";
import "./Timeline2.css";
import { Timeline2SVGLayer } from "./Timeline2SVGLayer";
import type { Timeline2Item, Timeline2Props } from "./Timeline2.types";

export type { Timeline2Item, Timeline2Props } from "./Timeline2.types";

/**
 * Timeline2 Component - Elegant scroll-driven timeline with SVG animations
 *
 * A sophisticated timeline component that displays chronological events with smooth,
 * velocity-responsive animations. Features include:
 * - SVG connector lines between items and central spine
 * - Scroll-synchronized animations with velocity calculations
 * - Dynamic glow effects on active items
 * - Gradient overlays and smooth transitions
 * - Full accessibility support with reduced-motion preferences
 * - Mobile-optimized rendering (60 FPS on mobile devices)
 *
 * Pure React, zero external animation dependencies (no GSAP, Framer Motion, etc.)
 *
 * @example
 * ```tsx
 * const items: Timeline2Item[] = [
 *   { id: "1", year: "2020", title: "Event", description: "..." },
 *   { id: "2", year: "2021", title: "Event", description: "..." },
 * ];
 * <Timeline2 items={items} title="Our Journey" />
 * ```
 *
 * @param props - Component props
 * @param props.items - Array of timeline events to display
 * @param props.eyebrow - Optional small text above title (default: "Chronicle")
 * @param props.title - Optional main heading (default: "Selected work")
 * @param props.intro - Optional introductory text
 *
 * @returns JSX element rendering the complete timeline
 */
export default function Timeline2({
    items,
    eyebrow = "Chronicle",
    title = "Selected work",
    intro,
}: Timeline2Props) {
    const rootRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const spineRef = useRef<HTMLDivElement>(null);
    const spineHeadRef = useRef<HTMLDivElement>(null);
    const itemRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());

    const [progress, setProgress] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [velocity, setVelocity] = useState(0);
    const [isEnhanced, setIsEnhanced] = useState(false);
    const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

    const itemCount = items.length;
    const headingId = useId();

    // Intersection Observer for visibility tracking
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const element = entry.target as HTMLElement;
                    if (entry.isIntersecting) {
                        element.classList.add("timeline2-visible");
                    }
                });
            },
            { threshold: 0.15 }
        );

        itemRefsMap.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [items]);

    // Track stage dimensions for SVG rendering
    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;

        const resizeObserver = new ResizeObserver(() => {
            setSvgDimensions({
                width: stage.clientWidth,
                height: stage.clientHeight,
            });
        });

        resizeObserver.observe(stage);
        setSvgDimensions({
            width: stage.clientWidth,
            height: stage.clientHeight,
        });

        return () => resizeObserver.disconnect();
    }, []);

    // Scroll tracking with smooth velocity calculation
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            setIsEnhanced(false);
            return;
        }

        setIsEnhanced(true);

        let rafId = 0;
        let lastScrollPos = 0;
        let lastTime = Date.now();
        let smoothVelocity = 0;

        const updateProgress = () => {
            const rect = root.getBoundingClientRect();
            const scrollableHeight = root.scrollHeight - window.innerHeight;
            const scrollPos = Math.max(0, -rect.top);
            const newProgress = scrollableHeight > 0 ? scrollPos / scrollableHeight : 0;

            // Calculate velocity with EMA smoothing
            const now = Date.now();
            const deltaTime = Math.max(1, now - lastTime);
            const deltaPos = scrollPos - lastScrollPos;
            const instantVelocity = deltaPos / (deltaTime / 1000);

            // Exponential Moving Average for smooth velocity
            smoothVelocity = instantVelocity * 0.25 + smoothVelocity * 0.75;

            setProgress(Math.max(0, Math.min(1, newProgress)));
            setVelocity(smoothVelocity);
            setActiveIndex(Math.min(itemCount - 1, Math.round(newProgress * (itemCount - 1))));

            lastScrollPos = scrollPos;
            lastTime = now;
        };

        const handleScroll = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(updateProgress);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", updateProgress);
        updateProgress(); // Initial call

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", updateProgress);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [itemCount]);

    /**
     * Calculate animation styles for each timeline item
     * Uses distance from active item to determine opacity, scale, transform, and glow effects
     * Glow intensity scales with scroll velocity for more responsive visual feedback
     */
    const getItemStyle = (index: number): CSSProperties => {
        const distance = Math.abs(index - progress * (itemCount - 1));
        const maxDistance = 2.5;
        const normalizedDistance = Math.min(distance / maxDistance, 1);

        // Easing function for smooth transitions
        const easeOut = 1 - Math.pow(1 - normalizedDistance, 3);

        const opacity = Math.max(0.3, 1 - easeOut * 0.7);
        const scale = 1 - easeOut * 0.15;
        const blur = easeOut * 6;
        const translateY = easeOut * 40;
        const rotateX = easeOut * 12;
        const zIndex = 100 - index;

        // Calculate glow intensity based on velocity for active item
        const glowIntensity = Math.min(Math.abs(velocity) * 0.01, 1.5);
        const glowBlur = 15 + glowIntensity * 30;
        const glowSpread = 10 + glowIntensity * 15;

        // Enhanced glow for active items
        let boxShadow = `0 8px 32px rgba(102, 126, 234, 0.2)`;
        if (index === activeIndex && isEnhanced) {
            boxShadow = `
                0 0 ${glowBlur}px rgba(102, 126, 234, ${0.5 + glowIntensity * 0.2}),
                0 0 ${glowSpread}px rgba(102, 126, 234, ${0.3 + glowIntensity * 0.1}),
                inset 0 0 30px rgba(102, 126, 234, 0.15)
            `;
        } else if (index < activeIndex) {
            boxShadow = `0 8px 32px rgba(102, 126, 234, 0.15)`;
        }

        return {
            opacity,
            transform: `perspective(1200px) translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`,
            filter: `blur(${blur}px)`,
            boxShadow,
            zIndex: index === activeIndex ? 1000 : zIndex,
            transition: "all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
        };
    };

    // Spine and head animation
    const spineProgress = isEnhanced ? progress : 0;
    const velocityStretch = 1 + Math.min(Math.abs(velocity) * 0.15, 0.2);
    const headHeight = 6 + Math.abs(velocity) * 2;

    if (!itemCount) return null;

    return (
        <section
            ref={rootRef}
            className={`timeline2-root ${isEnhanced ? "timeline2-enhanced" : ""}`}
            aria-labelledby={headingId}
        >
            {/* Header Section */}
            <div className="timeline2-header">
                {eyebrow && (
                    <div className="timeline2-eyebrow">{eyebrow}</div>
                )}
                {title && (
                    <h2 id={headingId} className="timeline2-title">
                        {title}
                    </h2>
                )}
                {intro && (
                    <p className="timeline2-intro">{intro}</p>
                )}
            </div>

            {/* Pinned Stage */}
            <div
                ref={stageRef}
                className="timeline2-stage"
                style={{
                    perspective: "1200px",
                }}
            >
                {/* SVG Layer for enhanced visual effects */}
                {isEnhanced && svgDimensions.width > 0 && (
                    <Timeline2SVGLayer
                        itemCount={itemCount}
                        containerWidth={svgDimensions.width}
                        containerHeight={svgDimensions.height}
                        animationState={{
                            progress,
                            velocity,
                            activeIndex,
                        }}
                        itemRefsMap={itemRefsMap}
                        spineRef={spineRef}
                    />
                )}

                {/* Spine - Central vertical line */}
                <div className="timeline2-spine-container">
                    <div
                        ref={spineRef}
                        className="timeline2-spine"
                        style={{
                            height: `${spineProgress * 100}%`,
                            transform: `scaleY(${velocityStretch})`,
                        }}
                    />
                    <div
                        ref={spineHeadRef}
                        className="timeline2-spine-head"
                        style={{
                            top: `${spineProgress * 100}%`,
                            height: `${headHeight}px`,
                            transform: `translateX(-50%) scaleY(${velocityStretch})`,
                        }}
                    />
                </div>

                {/* Markers on spine */}
                {items.map((item, index) => (
                    <button
                        key={`marker-${item.id}`}
                        className={`timeline2-marker-btn ${
                            index <= activeIndex ? "timeline2-passed" : ""
                        }`}
                        style={{
                            top: `${(index / Math.max(1, itemCount - 1)) * 100}%`,
                        }}
                        aria-label={`Jump to ${item.year}`}
                        onClick={() => {
                            const root = rootRef.current;
                            if (!root) return;
                            const scrollableHeight = root.scrollHeight - window.innerHeight;
                            const targetProgress =
                                itemCount > 1 ? index / (itemCount - 1) : 0;
                            window.scrollTo({
                                top: root.offsetTop + targetProgress * scrollableHeight,
                                behavior: "smooth",
                            });
                        }}
                    >
                        {/* SVG Check Mark for passed items */}
                        {index <= activeIndex && (
                            <svg
                                className="timeline2-marker-svg-check"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                    d="M5 12l5 5L19 7"
                                    fill="none"
                                    strokeWidth="2.5"
                                />
                            </svg>
                        )}
                    </button>
                ))}

                {/* Items Stack */}
                <div className="timeline2-items-stack">
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            ref={(el) => {
                                if (el) {
                                    itemRefsMap.current.set(item.id, el);
                                } else {
                                    itemRefsMap.current.delete(item.id);
                                }
                            }}
                            className={`timeline2-item ${
                                index === activeIndex ? "timeline2-item-active" : ""
                            } ${index < activeIndex ? "timeline2-item-passed" : ""}`}
                            style={getItemStyle(index)}
                            data-index={index}
                        >
                            {/* Item Content */}
                            <div className="timeline2-item-content">
                                <span className="timeline2-item-year">
                                    {item.year}
                                </span>
                                <h3 className="timeline2-item-title">
                                    {item.title}
                                </h3>
                                <p className="timeline2-item-description">
                                    {item.description}
                                </p>
                            </div>

                            {/* Item Badge */}
                            <div className="timeline2-item-badge">
                                {String(index + 1).padStart(2, "0")}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Progress Indicator */}
                <div className="timeline2-progress">
                    <div className="timeline2-progress-year">
                        {items[activeIndex]?.year}
                    </div>
                    <div className="timeline2-progress-count">
                        {activeIndex + 1} / {itemCount}
                    </div>
                </div>
            </div>
        </section>
    );
}
