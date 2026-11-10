/**
 * useIntersectionObserver hook
 * Detects which timeline events are visible in the viewport
 * Uses Intersection Observer API for efficient visibility detection
 */

import { useEffect, useRef, useState } from "react";

/**
 * Hook to track which events are visible in viewport
 * @param eventRefs - Map of event IDs to ref objects
 * @param threshold - Intersection threshold (default: 0.5 for 50% visible)
 * @returns Set of visible event IDs
 */
export function useIntersectionObserver(
    eventRefs: Map<string, React.RefObject<HTMLDivElement>>,
    threshold: number = 0.5,
): Set<string> {
    const [visibleEvents, setVisibleEvents] = useState<Set<string>>(new Set());
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        // Create intersection observer with specified threshold
        observerRef.current = new IntersectionObserver(
            (entries) => {
                const newVisibleEvents = new Set<string>();

                entries.forEach((entry) => {
                    const eventId = entry.target.getAttribute("data-event-id");
                    if (eventId && entry.isIntersecting) {
                        newVisibleEvents.add(eventId);
                    }
                });

                // Update state with newly visible events
                // Keep existing visible events that are still being observed
                setVisibleEvents((prev) => {
                    const combined = new Set(prev);

                    // Add new visible events
                    newVisibleEvents.forEach((id) => combined.add(id));

                    // Remove events that are no longer visible
                    const allEventIds = Array.from(eventRefs.keys());
                    combined.forEach((id) => {
                        const isStillVisible =
                            newVisibleEvents.has(id) ||
                            (eventRefs.get(id)?.current &&
                                observerRef.current?.isVisible?.(
                                    eventRefs.get(id)!.current!,
                                ));

                        if (!isStillVisible && !newVisibleEvents.has(id)) {
                            combined.delete(id);
                        }
                    });

                    return combined;
                });
            },
            {
                threshold: Math.min(Math.max(threshold, 0), 1),
                rootMargin: "0px",
            },
        );

        // Observe all event elements
        eventRefs.forEach((ref) => {
            if (ref.current) {
                observerRef.current?.observe(ref.current);
            }
        });

        // Cleanup
        return () => {
            eventRefs.forEach((ref) => {
                if (ref.current && observerRef.current) {
                    observerRef.current.unobserve(ref.current);
                }
            });
            observerRef.current?.disconnect();
            observerRef.current = null;
        };
    }, [eventRefs, threshold]);

    return visibleEvents;
}

/**
 * Simplified version: just track individual event visibility
 * Returns boolean instead of Set
 */
export function useIsIntersecting(
    ref: React.RefObject<HTMLDivElement>,
    threshold: number = 0.5,
): boolean {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
            },
            {
                threshold: Math.min(Math.max(threshold, 0), 1),
                rootMargin: "0px",
            },
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        observerRef.current = observer;

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
            observer.disconnect();
        };
    }, [ref, threshold]);

    return isIntersecting;
}

export default useIntersectionObserver;
