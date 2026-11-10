/**
 * usePulseAnimation hook
 * Triggers pulse animation when event becomes visible
 * Fires only once per visibility state change
 */

import { useEffect, useRef, useState } from "react";

/**
 * Hook to trigger pulse animation on visibility change
 * @param eventId - Unique identifier for the event
 * @param isVisible - Whether event is currently visible
 * @returns Boolean indicating whether pulse should be playing
 */
export function usePulseAnimation(
    eventId: string,
    isVisible: boolean,
): boolean {
    const [shouldPulse, setShouldPulse] = useState(false);
    const wasVisibleRef = useRef(false);
    const pulseTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        // Trigger pulse when visibility changes from false to true
        if (isVisible && !wasVisibleRef.current) {
            setShouldPulse(true);

            // Clear any existing timeout
            if (pulseTimeoutRef.current) {
                clearTimeout(pulseTimeoutRef.current);
            }

            // Pulse animation duration is 0.8s, stop pulsing after that
            pulseTimeoutRef.current = setTimeout(() => {
                setShouldPulse(false);
            }, 800); // Match CSS animation duration
        }

        // Update visibility state
        wasVisibleRef.current = isVisible;

        // Cleanup
        return () => {
            if (pulseTimeoutRef.current) {
                clearTimeout(pulseTimeoutRef.current);
            }
        };
    }, [eventId, isVisible]);

    return shouldPulse;
}

/**
 * Advanced version: track multiple pulse events with debouncing
 * Prevents too many pulses firing in rapid succession
 * @param eventId - Unique identifier
 * @param isVisible - Current visibility state
 * @param debounceMs - Debounce time in milliseconds (default: 200)
 * @returns shouldPulse boolean
 */
export function usePulseAnimationDebounced(
    eventId: string,
    isVisible: boolean,
    debounceMs: number = 200,
): boolean {
    const [shouldPulse, setShouldPulse] = useState(false);
    const wasVisibleRef = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        // Only trigger if visibility is changing from false to true
        if (isVisible && !wasVisibleRef.current) {
            // Debounce the pulse trigger
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(() => {
                setShouldPulse(true);

                // Stop pulsing after animation duration
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                timeoutRef.current = setTimeout(() => {
                    setShouldPulse(false);
                }, 800);
            }, debounceMs);
        } else if (!isVisible) {
            // Clear any pending pulse when visibility is lost
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setShouldPulse(false);
        }

        wasVisibleRef.current = isVisible;

        // Cleanup
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [eventId, isVisible, debounceMs]);

    return shouldPulse;
}

/**
 * Track pulse completion state
 * Useful for triggering other actions after pulse completes
 */
export interface PulseState {
    /** Whether pulse is currently playing */
    isPulsing: boolean;
    /** Pulse progress (0-1) */
    progress: number;
    /** Number of times this event has pulsed */
    pulseCount: number;
}

/**
 * Advanced version: returns detailed pulse state
 * @param eventId - Event identifier
 * @param isVisible - Visibility state
 * @returns Detailed pulse state object
 */
export function usePulseAnimationState(
    eventId: string,
    isVisible: boolean,
): PulseState {
    const [pulseState, setPulseState] = useState<PulseState>({
        isPulsing: false,
        progress: 0,
        pulseCount: 0,
    });

    const wasVisibleRef = useRef(false);
    const startTimeRef = useRef(0);
    const pulseCountRef = useRef(0);
    const animationFrameIdRef = useRef<number | undefined>(undefined);

    const PULSE_DURATION = 800; // milliseconds

    useEffect(() => {
        // Trigger pulse when visibility changes
        if (isVisible && !wasVisibleRef.current) {
            pulseCountRef.current++;
            startTimeRef.current = Date.now();

            const updateProgress = () => {
                const elapsed = Date.now() - startTimeRef.current;
                const progress = Math.min(1, elapsed / PULSE_DURATION);

                setPulseState({
                    isPulsing: progress < 1,
                    progress,
                    pulseCount: pulseCountRef.current,
                });

                // Continue animation or stop
                if (progress < 1) {
                    animationFrameIdRef.current =
                        requestAnimationFrame(updateProgress);
                } else {
                    setPulseState((prev) => ({
                        ...prev,
                        isPulsing: false,
                    }));
                }
            };

            animationFrameIdRef.current = requestAnimationFrame(updateProgress);
        }

        wasVisibleRef.current = isVisible;

        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, [eventId, isVisible]);

    return pulseState;
}

export default usePulseAnimation;
