/**
 * useScrollTracking hook
 * Tracks scroll position and velocity using requestAnimationFrame
 * No scroll event listeners for better performance
 */

import { useEffect, useRef, useState } from "react";
import { ScrollState } from "../types";
import {
    smoothVelocity,
    calculateScrollPercentage,
} from "../utils/calculations";

/**
 * Hook to track scroll position and velocity
 * @param containerRef - Ref to scrollable container element
 * @param enabled - Whether hook is active (default: true)
 * @returns Current scroll state
 */
export function useScrollTracking(
    containerRef: React.RefObject<HTMLDivElement>,
    enabled: boolean = true,
): ScrollState {
    const [scrollState, setScrollState] = useState<ScrollState>({
        scrollTop: 0,
        scrollPosition: 0,
        scrollPercentage: 0,
        velocity: 0,
        isScrolling: false,
    });

    const previousScrollTopRef = useRef(0);
    const previousTimeRef = useRef(Date.now());
    const previousVelocityRef = useRef(0);
    const animationFrameIdRef = useRef<number | undefined>(undefined);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        if (!enabled || !containerRef.current) return;

        const updateScroll = () => {
            const container = containerRef.current;
            if (!container) return;

            const currentTime = Date.now();
            const currentScrollTop = container.scrollTop;
            const deltaTime = Math.max(
                currentTime - previousTimeRef.current,
                1,
            ); // Avoid division by zero

            // Calculate raw velocity (pixels per millisecond)
            const rawVelocity =
                (currentScrollTop - previousScrollTopRef.current) / deltaTime;

            // Smooth velocity using exponential moving average
            // Higher smoothing factor (0.2) = more responsive but jittery
            // Lower smoothing factor (0.1) = smoother but delayed
            const velocity = smoothVelocity(
                rawVelocity,
                previousVelocityRef.current,
                0.15,
            );

            // Calculate scrollable height
            const scrollableHeight =
                container.scrollHeight - container.clientHeight;
            const scrollPercentage = calculateScrollPercentage(
                currentScrollTop,
                scrollableHeight,
            );

            // Normalize scroll position to 0-1 range
            const scrollPosition = scrollableHeight > 0 ? scrollPercentage : 0;

            // Determine if still scrolling (velocity > threshold)
            const isScrolling = Math.abs(velocity) > 0.01;

            setScrollState({
                scrollTop: currentScrollTop,
                scrollPosition,
                scrollPercentage,
                velocity,
                isScrolling,
            });

            // Update refs for next frame
            previousScrollTopRef.current = currentScrollTop;
            previousTimeRef.current = currentTime;
            previousVelocityRef.current = velocity;

            // Continue animation loop
            animationFrameIdRef.current = requestAnimationFrame(updateScroll);
        };

        // Start the animation loop
        animationFrameIdRef.current = requestAnimationFrame(updateScroll);

        // Cleanup
        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [containerRef, enabled]);

    return scrollState;
}

export default useScrollTracking;
