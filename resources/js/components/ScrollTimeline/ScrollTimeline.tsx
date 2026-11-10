/**
 * ScrollTimeline Component - Main Component
 * High-performance scroll-driven timeline with momentum effects
 * Pure React + TypeScript + CSS vanilla (no animation libraries)
 */

import React, { useRef, useMemo } from "react";
import { TimelineEventData, ScrollTimelineProps, ScrollState } from "./types";
import { useScrollTracking } from "./hooks/useScrollTracking";
import { useIntersectionObserver } from "./hooks/useIntersectionObserver";
import { useMomentumPhysics } from "./hooks/useMomentumPhysics";
import { determineEventSide } from "./utils/calculations";
import TimelineEvent from "./TimelineEvent";
import "./ScrollTimeline.css";

/**
 * ScrollTimeline Component
 * Main container for scroll-driven timeline visualization
 */
const ScrollTimeline: React.FC<ScrollTimelineProps> = ({
    events,
    height = "100vh",
    spineWidth = 2,
    spineColor = "#333",
    stretchFactor = 0.5,
    markerSize = 12,
    markerColor,
    responsive = true,
    className = "",
    style = {},
}) => {
    // Refs for scroll container and events
    const containerRef = useRef<HTMLDivElement>(null);
    const eventRefsMap = useRef<Map<string, React.RefObject<HTMLDivElement>>>(
        new Map(),
    );

    // Initialize event refs
    useMemo(() => {
        events.forEach((event) => {
            if (!eventRefsMap.current.has(event.id)) {
                eventRefsMap.current.set(
                    event.id,
                    React.createRef<HTMLDivElement>(),
                );
            }
        });
        return eventRefsMap.current;
    }, [events]);

    // Track scroll position and velocity
    const scrollState = useScrollTracking(containerRef, true);

    // Track visible events
    const visibleEvents = useIntersectionObserver(eventRefsMap.current, 0.5);

    // Calculate spine height with momentum physics
    const baseSpineHeight = (containerRef.current?.clientHeight || 1000) * 1.5;
    const spineHeight = useMomentumPhysics(
        baseSpineHeight,
        scrollState.velocity,
        stretchFactor,
        true,
    );

    // Default marker color to spine color
    const finalMarkerColor = markerColor || spineColor;

    // Container height CSS value
    const containerHeight = typeof height === "number" ? `${height}px` : height;

    // Container styles
    const containerStyle: React.CSSProperties = {
        height: containerHeight,
        ...style,
    };

    // Handle custom class names
    const containerClasses = [
        "timeline-container",
        scrollState.isScrolling ? "scrolling" : "",
        Math.abs(scrollState.velocity) > 0.05 ? "active" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    // Spine styles
    const spineStyle: React.CSSProperties = {
        width: spineWidth,
        height: spineHeight,
        backgroundColor: spineColor,
        boxShadow: `0 0 15px ${spineColor}33`,
    };

    return (
        <div
            ref={containerRef}
            className={containerClasses}
            style={containerStyle}
            role="region"
            aria-label="Timeline"
        >
            {/* Spine - vertical line connecting events */}
            <div
                className={`timeline-spine ${Math.abs(scrollState.velocity) > 0.1 ? "active" : ""}`}
                style={spineStyle}
                aria-hidden="true"
            />

            {/* Events container */}
            <div className="timeline-events">
                {events.map((event, index) => {
                    const eventRef = eventRefsMap.current.get(event.id);
                    const isVisible = visibleEvents.has(event.id);
                    const side = event.side || determineEventSide(index);

                    return (
                        <TimelineEvent
                            key={event.id}
                            ref={eventRef}
                            event={event}
                            isVisible={isVisible}
                            side={side}
                            markerSize={markerSize}
                            markerColor={finalMarkerColor}
                        />
                    );
                })}
            </div>

            {/* Accessibility: announce scroll state changes */}
            <div
                className="sr-only"
                role="status"
                aria-live="polite"
                aria-atomic="false"
            >
                {scrollState.isScrolling
                    ? `Scrolling through timeline at ${Math.round(scrollState.scrollPercentage * 100)}%`
                    : "Scroll complete"}
            </div>
        </div>
    );
};

ScrollTimeline.displayName = "ScrollTimeline";

export default ScrollTimeline;
