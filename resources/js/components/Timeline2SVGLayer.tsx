import { useEffect, useRef, type CSSProperties } from "react";
import type { SVGConnectorPosition, AnimationState } from "./Timeline2.types";

type Timeline2SVGLayerProps = {
    itemCount: number;
    containerWidth: number;
    containerHeight: number;
    animationState: AnimationState;
    itemRefsMap: React.MutableRefObject<Map<string, HTMLDivElement>>;
    spineRef: React.RefObject<HTMLDivElement>;
};

/**
 * Timeline2SVGLayer - Renders SVG connectors and enhanced spine visuals
 * Handles SVG-based animations including connector lines, spine effects, and visual enhancements
 */
export function Timeline2SVGLayer({
    itemCount,
    containerWidth,
    containerHeight,
    animationState,
    itemRefsMap,
    spineRef,
}: Timeline2SVGLayerProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const connectorPathsRef = useRef<Map<number, SVGPathElement>>(new Map());

    const { progress, velocity, activeIndex } = animationState;

    // Calculate SVG connector positions based on item refs and render with draw animations
    useEffect(() => {
        if (!svgRef.current || !spineRef.current || itemRefsMap.current.size === 0) return;

        const svgElement = svgRef.current;
        const stageElement = spineRef.current.closest(".timeline2-stage");

        if (!stageElement) return;

        // Get spine container position (left 50% of stage)
        const stageRect = stageElement.getBoundingClientRect();
        const spineContainerX = stageRect.left + stageRect.width / 2;
        const spineContainerY = stageRect.top;
        const stageHeight = stageRect.height;

        // Spine center Y is at 50% of stage
        const spineY = spineContainerY + stageHeight / 2;

        const itemArray = Array.from(itemRefsMap.current.entries());

        itemArray.forEach(([_, itemRef], index) => {
            if (!itemRef) return;

            const itemRect = itemRef.getBoundingClientRect();

            // Calculate distance from active item
            const distanceFromActive = Math.abs(index - progress * (itemCount - 1));
            const maxVisibleDistance = 2.5;
            const isVisible = distanceFromActive < maxVisibleDistance;

            // Get or create path element
            let path = connectorPathsRef.current.get(index);
            if (!path) {
                path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("class", "timeline2-svg-connector");
                svgElement.appendChild(path);
                connectorPathsRef.current.set(index, path);
            }

            if (!isVisible) {
                path.style.opacity = "0";
                return;
            }

            // Calculate connector points
            const x1 = itemRect.left - stageRect.left + itemRect.width / 2;
            const y1 = itemRect.top - stageRect.top + itemRect.height / 2;
            const x2 = spineContainerX - stageRect.left;
            const y2 = spineY - stageRect.top;

            // Create path data for curved connector
            const midX = (x1 + x2) / 2;
            const controlX = midX;
            const pathData = `M ${x1} ${y1} Q ${controlX} ${(y1 + y2) / 2} ${x2} ${y2}`;

            path.setAttribute("d", pathData);

            // Calculate stroke-dasharray for draw animation
            const dx = x2 - x1;
            const dy = y2 - y1;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Calculate dashoffset based on scroll progress
            const normalizedDistance = distance * 1.3; // Add extra for curve
            const targetDashOffset = -normalizedDistance + normalizedDistance * (progress * 2);

            path.style.strokeDasharray = `${normalizedDistance}`;
            path.style.strokeDashoffset = `${targetDashOffset}px`;

            // Animate opacity based on distance from active
            const opacity = Math.max(0.2, 1 - distanceFromActive * 0.25);
            path.style.opacity = `${opacity}`;

            // Animate stroke color based on active state
            if (index <= activeIndex) {
                path.style.stroke = "var(--timeline2-accent)";
                path.style.filter = `drop-shadow(0 0 6px rgba(102, 126, 234, 0.6))`;
            } else {
                path.style.stroke = "rgba(102, 126, 234, 0.3)";
                path.style.filter = `drop-shadow(0 0 2px rgba(102, 126, 234, 0.3))`;
            }

            // Smooth transitions
            path.style.transition = "stroke 0.3s ease, filter 0.3s ease, opacity 0.2s ease";
        });
    }, [progress, activeIndex, itemCount, velocity]);

    // Handle window resize to update SVG dimensions
    useEffect(() => {
        const handleResize = () => {
            if (svgRef.current) {
                const stage = svgRef.current.closest(".timeline2-stage");
                if (stage) {
                    svgRef.current.setAttribute("viewBox", `0 0 ${stage.clientWidth} ${stage.clientHeight}`);
                }
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Cleanup paths on unmount
    useEffect(() => {
        return () => {
            connectorPathsRef.current.forEach((path) => {
                path.remove();
            });
            connectorPathsRef.current.clear();
        };
    }, []);

    const svgStyle: CSSProperties = {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 5,
        overflow: "visible",
    };

    return (
        <svg
            ref={svgRef}
            style={svgStyle}
            role="presentation"
            aria-hidden="true"
            viewBox={`0 0 ${containerWidth} ${containerHeight}`}
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id="timeline2-spine-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--timeline2-accent)" />
                    <stop offset="100%" stopColor="var(--timeline2-accent-light)" />
                </linearGradient>
                <filter id="timeline2-glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
        </svg>
    );
}
