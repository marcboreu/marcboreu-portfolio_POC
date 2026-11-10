/**
 * TimelineEvent Component
 * Individual event in the scroll timeline
 * Renders marker, content (title, description, year, number)
 * Handles animations based on scroll position and visibility
 */

import React, { useMemo } from "react";
import { TimelineEventProps } from "./types";
import {
    calculateDistanceFromCenter,
    calculateOpacity,
    calculateScale,
    calculateTranslateY,
    determineEventSide,
} from "./utils/calculations";
import { usePulseAnimation } from "./hooks/usePulseAnimation";

/**
 * TimelineEvent Component
 * Memoized for performance with scroll/visibility updates
 */
const TimelineEvent = React.forwardRef<HTMLDivElement, TimelineEventProps>(
    ({ event, isVisible, side, markerSize, markerColor }, ref) => {
        // Calculate distance from viewport center
        const distanceFromCenter = useMemo(() => {
            // This would be calculated based on element position
            // For now, use inverse of visibility for basic fade
            return isVisible ? 0 : 100;
        }, [isVisible]);

        // Calculate animation values
        const opacity = useMemo(() => {
            return calculateOpacity(distanceFromCenter, 200);
        }, [distanceFromCenter]);

        const scale = useMemo(() => {
            return calculateScale(opacity);
        }, [opacity]);

        const translateY = useMemo(() => {
            return calculateTranslateY(distanceFromCenter, 200, 8);
        }, [distanceFromCenter]);

        // Pulse animation state
        const shouldPulseMarker = usePulseAnimation(event.id, isVisible);

        // Content styles with animations
        const contentStyle: React.CSSProperties = {
            opacity,
            transform: `translateY(${translateY}px) scale(${scale})`,
        };

        // Marker styles
        const markerStyle: React.CSSProperties = {
            width: markerSize,
            height: markerSize,
            backgroundColor: markerColor,
            boxShadow: `0 0 ${Math.max(4, markerSize / 3)}px ${markerColor}33`,
        };

        // Side-specific classes
        const sideClass = side === "left" ? "left" : "right";

        return (
            <div
                ref={ref}
                className={`timeline-event ${sideClass} ${isVisible ? "visible" : "hidden"}`}
                data-event-id={event.id}
                role="listitem"
            >
                {/* Event Marker (Circle Dot) */}
                <div
                    className={`timeline-marker ${isVisible ? "visible" : ""} ${
                        shouldPulseMarker ? "pulse" : ""
                    }`}
                    style={markerStyle}
                    role="button"
                    tabIndex={0}
                    aria-label={`${event.year}: ${event.title}`}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            // Could trigger click handler here
                        }
                    }}
                />

                {/* Event Content */}
                <div
                    className={`timeline-content ${isVisible ? "" : "hidden"}`}
                    style={contentStyle}
                >
                    {/* Year Badge */}
                    {event.year && (
                        <div
                            className="timeline-year"
                            aria-label={`Year: ${event.year}`}
                        >
                            {event.year}
                        </div>
                    )}

                    {/* Event Number */}
                    {event.number && (
                        <div
                            className="timeline-number"
                            aria-label={`Event number: ${event.number}`}
                        >
                            {event.number}
                        </div>
                    )}

                    {/* Event Title */}
                    {event.title && (
                        <h3
                            className="timeline-title"
                            id={`event-${event.id}-title`}
                        >
                            {event.title}
                        </h3>
                    )}

                    {/* Event Description */}
                    {event.description && (
                        <p
                            className="timeline-description"
                            aria-describedby={`event-${event.id}-title`}
                        >
                            {event.description}
                        </p>
                    )}
                </div>
            </div>
        );
    },
);

TimelineEvent.displayName = "TimelineEvent";

export default TimelineEvent;
