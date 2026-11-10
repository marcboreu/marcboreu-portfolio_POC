/**
 * useAnimationFrame hook
 * Manages animation loop lifecycle with requestAnimationFrame
 * Handles cleanup and performance optimization
 */

import { useEffect, useRef, useCallback } from "react";

/**
 * Hook to run a callback at each animation frame
 * Automatically handles cleanup on unmount
 * @param callback - Function to call each frame, receives deltaTime in ms
 * @param enabled - Whether animation loop is active (default: true)
 */
export function useAnimationFrame(
    callback: (deltaTime: number) => void,
    enabled: boolean = true,
): void {
    const animationFrameIdRef = useRef<number | undefined>(undefined);
    const lastTimeRef = useRef<number>(Date.now());

    const animationLoop = useCallback(() => {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTimeRef.current;
        lastTimeRef.current = currentTime;

        callback(deltaTime);

        // Schedule next frame
        if (enabled) {
            animationFrameIdRef.current = requestAnimationFrame(animationLoop);
        }
    }, [callback, enabled]);

    useEffect(() => {
        if (!enabled) {
            // Cancel any running animation
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            return;
        }

        // Start animation loop
        lastTimeRef.current = Date.now();
        animationFrameIdRef.current = requestAnimationFrame(animationLoop);

        // Cleanup on unmount or when disabled
        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, [animationLoop, enabled]);
}

/**
 * Advanced version: throttle callback to specific FPS target
 * Useful for heavy calculations that don't need 60 FPS
 * @param callback - Function to call
 * @param targetFPS - Target frames per second (default: 60)
 * @param enabled - Whether active (default: true)
 */
export function useAnimationFrameThrottled(
    callback: (deltaTime: number) => void,
    targetFPS: number = 60,
    enabled: boolean = true,
): void {
    const frameIntervalRef = useRef(1000 / targetFPS);
    const accumulatorRef = useRef(0);
    const lastTimeRef = useRef(Date.now());

    const throttledAnimationLoop = useCallback(() => {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTimeRef.current;
        lastTimeRef.current = currentTime;

        accumulatorRef.current += deltaTime;

        // Only call callback if enough time has elapsed
        if (accumulatorRef.current >= frameIntervalRef.current) {
            callback(accumulatorRef.current);
            accumulatorRef.current = 0;
        }

        // Schedule next frame
        if (enabled) {
            requestAnimationFrame(throttledAnimationLoop);
        }
    }, [callback, enabled]);

    useEffect(() => {
        if (!enabled) return;

        lastTimeRef.current = Date.now();
        const id = requestAnimationFrame(throttledAnimationLoop);

        return () => cancelAnimationFrame(id);
    }, [throttledAnimationLoop, enabled]);
}

/**
 * Measure FPS for debugging/monitoring performance
 * @param onFpsUpdate - Callback with current FPS (called every 500ms)
 * @param enabled - Whether monitoring is active (default: true)
 */
export function useAnimationFrameFps(
    onFpsUpdate: (fps: number) => void,
    enabled: boolean = true,
): void {
    const frameCountRef = useRef(0);
    const lastUpdateRef = useRef(Date.now());

    const measureFps = useCallback(() => {
        frameCountRef.current++;

        const currentTime = Date.now();
        const elapsed = currentTime - lastUpdateRef.current;

        // Update FPS every 500ms
        if (elapsed >= 500) {
            const fps = (frameCountRef.current / elapsed) * 1000;
            onFpsUpdate(Math.round(fps));
            frameCountRef.current = 0;
            lastUpdateRef.current = currentTime;
        }

        if (enabled) {
            requestAnimationFrame(measureFps);
        }
    }, [onFpsUpdate, enabled]);

    useEffect(() => {
        if (!enabled) return;

        const id = requestAnimationFrame(measureFps);

        return () => cancelAnimationFrame(id);
    }, [measureFps, enabled]);
}

export default useAnimationFrame;
