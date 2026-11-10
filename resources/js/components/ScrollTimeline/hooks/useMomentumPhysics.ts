/**
 * useMomentumPhysics hook
 * Calculates spine height based on scroll velocity and spring physics
 * Implements elastic/bouncy effect on fast scrolls
 */

import { useEffect, useRef, useState } from "react";
import { ScrollState, MomentumResult } from "../types";

/**
 * Configuration for spring physics
 */
interface SpringConfig {
    springConstant: number; // How much to accelerate toward target (0.1 default)
    damping: number; // Resistance/friction (0.3 default, higher = more damping)
    friction: number; // Velocity decay when not scrolling (0.95 default)
}

/**
 * Hook to calculate spine height with spring physics
 * Creates bouncy/elastic momentum effect when scrolling fast
 * @param baseHeight - Base spine height in pixels
 * @param velocity - Current scroll velocity
 * @param stretchFactor - Multiplier for velocity effect (default: 0.5)
 * @param enabled - Whether physics is active (default: true)
 * @returns Calculated spine height in pixels
 */
export function useMomentumPhysics(
    baseHeight: number,
    velocity: number,
    stretchFactor: number = 0.5,
    enabled: boolean = true,
): number {
    const [spineHeight, setSpineHeight] = useState(baseHeight);

    const currentHeightRef = useRef(baseHeight);
    const velocityRef = useRef(0);
    const animationFrameIdRef = useRef<number | undefined>(undefined);

    // Spring physics configuration
    const springConfig: SpringConfig = {
        springConstant: 0.1, // Lower = slower return to base, higher = faster
        damping: 0.3, // Higher = bouncier with overshoot, lower = smoother
        friction: 0.95, // Decay when not actively scrolling
    };

    const maxHeight = baseHeight * 2.0; // Cap at 200% of base
    const minHeight = baseHeight; // Never go below base

    useEffect(() => {
        velocityRef.current = velocity;
    }, [velocity]);

    useEffect(() => {
        if (!enabled) return;

        const updatePhysics = () => {
            const absoluteVelocity = Math.abs(velocityRef.current);

            // Target height based on velocity and stretch factor
            const stretchAmount = absoluteVelocity * stretchFactor * 1000; // Scale for milliseconds
            const targetHeight = Math.min(
                baseHeight + stretchAmount,
                maxHeight,
            );

            // Spring physics
            // Acceleration = (target - current) * springConstant
            let currentHeight = currentHeightRef.current;
            let velocity =
                (targetHeight - currentHeight) * springConfig.springConstant;

            // Apply damping (resistance)
            velocity *= 1 - springConfig.damping;

            // Update height
            currentHeight += velocity;

            // Clamp to valid range
            currentHeight = Math.max(
                minHeight,
                Math.min(maxHeight, currentHeight),
            );

            // Apply friction when not scrolling (decay velocity toward base)
            if (absoluteVelocity < 0.01) {
                const decay = (baseHeight - currentHeight) * 0.05; // Slight return force
                currentHeight += decay;
            }

            // Clamp again after friction
            currentHeight = Math.max(
                minHeight,
                Math.min(maxHeight, currentHeight),
            );

            currentHeightRef.current = currentHeight;
            setSpineHeight(currentHeight);

            // Continue animation loop
            animationFrameIdRef.current = requestAnimationFrame(updatePhysics);
        };

        animationFrameIdRef.current = requestAnimationFrame(updatePhysics);

        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, [baseHeight, stretchFactor, enabled]);

    return spineHeight;
}

/**
 * Advanced version: calculates full momentum physics result
 * Returns both height and animation state
 */
export function useMomentumPhysicsAdvanced(
    baseHeight: number,
    scrollState: ScrollState,
    stretchFactor: number = 0.5,
    enabled: boolean = true,
): MomentumResult {
    const [result, setResult] = useState<MomentumResult>({
        spineHeight: baseHeight,
        isDecelerating: false,
    });

    const currentHeightRef = useRef(baseHeight);
    const currentVelocityRef = useRef(0);
    const isDeceleratingRef = useRef(false);
    const animationFrameIdRef = useRef<number | undefined>(undefined);
    const lastVelocityRef = useRef(0);

    const springConfig = {
        springConstant: 0.1,
        damping: 0.3,
        friction: 0.95,
        decelerationThreshold: 0.001,
    };

    const maxHeight = baseHeight * 2.0;
    const minHeight = baseHeight;

    useEffect(() => {
        if (!enabled) return;

        const updatePhysics = () => {
            const velocity = scrollState.velocity;
            const absoluteVelocity = Math.abs(velocity);

            // Detect deceleration state
            const prevAbsVelocity = Math.abs(lastVelocityRef.current);
            isDeceleratingRef.current = absoluteVelocity < prevAbsVelocity;
            lastVelocityRef.current = velocity;

            // Target height based on velocity
            const stretchAmount = absoluteVelocity * stretchFactor * 1000;
            const targetHeight = Math.min(
                baseHeight + stretchAmount,
                maxHeight,
            );

            // Spring physics calculation
            let currentHeight = currentHeightRef.current;
            let springForce =
                (targetHeight - currentHeight) * springConfig.springConstant;

            // Apply damping
            springForce *= 1 - springConfig.damping;

            currentHeight += springForce;

            // Clamp to range
            currentHeight = Math.max(
                minHeight,
                Math.min(maxHeight, currentHeight),
            );

            // Apply friction when not scrolling
            if (absoluteVelocity < 0.01) {
                const returnForce = (baseHeight - currentHeight) * 0.05;
                currentHeight += returnForce;
                currentHeight = Math.max(
                    minHeight,
                    Math.min(maxHeight, currentHeight),
                );
            }

            currentHeightRef.current = currentHeight;

            setResult({
                spineHeight: currentHeight,
                isDecelerating:
                    isDeceleratingRef.current && absoluteVelocity > 0,
            });

            animationFrameIdRef.current = requestAnimationFrame(updatePhysics);
        };

        animationFrameIdRef.current = requestAnimationFrame(updatePhysics);

        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, [baseHeight, scrollState, stretchFactor, enabled]);

    return result;
}

export default useMomentumPhysics;
