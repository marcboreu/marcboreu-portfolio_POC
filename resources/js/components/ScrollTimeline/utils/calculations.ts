/**
 * Utility functions for ScrollTimeline component calculations
 * Pure functions for scroll, position, animation calculations
 */

import { PositionCalculationOptions } from "../types";

/**
 * Calculate normalized scroll position (0-1)
 * @param scrollTop - Raw scroll position in pixels
 * @param scrollableHeight - Total scrollable height
 * @returns Normalized value between 0 and 1
 */
export function calculateScrollPercentage(
    scrollTop: number,
    scrollableHeight: number,
): number {
    if (scrollableHeight <= 0) return 0;
    return Math.min(1, Math.max(0, scrollTop / scrollableHeight));
}

/**
 * Calculate scroll velocity using exponential moving average
 * Smooths velocity to reduce jitter from individual scroll events
 * @param currentVelocity - Latest calculated velocity
 * @param previousVelocity - Previous frame's velocity
 * @param smoothingFactor - EMA factor (0.2 default, higher = more responsive but jittery)
 * @returns Smoothed velocity value
 */
export function smoothVelocity(
    currentVelocity: number,
    previousVelocity: number,
    smoothingFactor: number = 0.2,
): number {
    return (
        currentVelocity * smoothingFactor +
        previousVelocity * (1 - smoothingFactor)
    );
}

/**
 * Calculate event position based on scroll
 * Determines where an event should be positioned in the timeline
 * @param options - Position calculation options
 * @returns Vertical position in pixels
 */
export function calculateEventPosition(
    options: PositionCalculationOptions,
): number {
    const {
        eventIndex,
        totalEvents,
        scrollPercentage,
        viewportHeight,
        eventSpacing = 80,
    } = options;

    // Target position for this event (evenly distributed along timeline)
    const eventSpacingTotal = (viewportHeight + eventSpacing) * totalEvents;
    const targetPosition = (eventIndex / totalEvents) * eventSpacingTotal;

    // Current position based on scroll
    const scrollOffset = scrollPercentage * eventSpacingTotal;
    const currentPosition = targetPosition - scrollOffset;

    return currentPosition;
}

/**
 * Calculate distance from viewport center
 * Used to determine opacity and scale of events
 * @param eventPosition - Event's Y position in pixels
 * @param viewportHeight - Height of viewport in pixels
 * @returns Absolute distance from center in pixels
 */
export function calculateDistanceFromCenter(
    eventPosition: number,
    viewportHeight: number,
): number {
    const viewportCenter = viewportHeight / 2;
    return Math.abs(eventPosition - viewportCenter);
}

/**
 * Calculate opacity based on distance from viewport center
 * Events fade as they move away from center
 * @param distanceFromCenter - Distance in pixels
 * @param maxDistance - Distance at which opacity reaches minimum
 * @returns Opacity value between 0.5 and 1.0
 */
export function calculateOpacity(
    distanceFromCenter: number,
    maxDistance: number,
): number {
    if (maxDistance <= 0) return 1.0;

    // Normalize distance to 0-1 range
    const normalizedDistance = Math.min(1, distanceFromCenter / maxDistance);

    // Opacity ranges from 1.0 (center) to 0.5 (edges)
    return 1.0 - normalizedDistance * 0.5;
}

/**
 * Calculate scale based on opacity
 * Events at viewport edges scale down slightly
 * @param opacity - Opacity value (typically 0.5-1.0)
 * @returns Scale value between 1.0 and 1.05
 */
export function calculateScale(opacity: number): number {
    // 1.0 - (1.0 - opacity) * 0.1
    // At opacity 1.0: scale = 1.0
    // At opacity 0.5: scale = 1.05
    return 1.0 + (1.0 - opacity) * 0.1;
}

/**
 * Calculate vertical translation (slide effect)
 * Events slide up/down based on distance from center
 * @param distanceFromCenter - Distance in pixels
 * @param maxDistance - Maximum distance for full slide
 * @param maxTranslateY - Maximum translation amount in pixels (default: 8px)
 * @returns Translation value in pixels (can be negative)
 */
export function calculateTranslateY(
    distanceFromCenter: number,
    maxDistance: number,
    maxTranslateY: number = 8,
): number {
    if (maxDistance <= 0) return 0;

    const normalizedDistance = Math.min(1, distanceFromCenter / maxDistance);
    const direction = distanceFromCenter > 0 ? 1 : -1;

    return direction * normalizedDistance * maxTranslateY;
}

/**
 * Calculate spine height based on scroll velocity
 * Higher velocity = more stretch (momentum effect)
 * @param baseHeight - Base spine height in pixels
 * @param velocity - Scroll velocity in pixels per millisecond
 * @param stretchFactor - Multiplier for velocity (default: 0.5)
 * @param maxMultiplier - Maximum height as multiple of base (default: 2.0)
 * @returns Calculated spine height in pixels
 */
export function calculateSpineHeight(
    baseHeight: number,
    velocity: number,
    stretchFactor: number = 0.5,
    maxMultiplier: number = 2.0,
): number {
    const absoluteVelocity = Math.abs(velocity);
    const stretchAmount = absoluteVelocity * stretchFactor;
    const maxHeight = baseHeight * maxMultiplier;

    return Math.min(baseHeight + stretchAmount, maxHeight);
}

/**
 * Calculate if event should be considered "visible"
 * Based on intersection observer threshold (typically 50%)
 * @param eventPosition - Event Y position in pixels
 * @param viewportHeight - Viewport height in pixels
 * @param threshold - Visibility threshold (default: 0.5 for 50%)
 * @returns Boolean indicating visibility
 */
export function isEventVisible(
    eventPosition: number,
    viewportHeight: number,
    threshold: number = 0.5,
): boolean {
    // Assuming event has ~60-100px height, check if sufficient portion is visible
    const eventHeight = 80; // approximate
    const eventTop = eventPosition;
    const eventBottom = eventPosition + eventHeight;

    // Calculate what portion is visible
    const visibleTop = Math.max(0, eventTop);
    const visibleBottom = Math.min(viewportHeight, eventBottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

    return visibleHeight / eventHeight >= threshold;
}

/**
 * Clamp a value between min and max
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values
 * @param start - Start value
 * @param end - End value
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated value
 */
export function lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
}

/**
 * Ease out cubic bezier easing function
 * Used for smooth animations with spring-like feel
 * @param t - Time value (0-1)
 * @returns Eased value (0-1)
 */
export function easeOutCubic(t: number): number {
    const t1 = t - 1;
    return t1 * t1 * t1 + 1;
}

/**
 * Determine event side (left or right) in alternating layout
 * @param index - Event index (0-based)
 * @param override - Explicit side override ('left' | 'right')
 * @returns 'left' or 'right'
 */
export function determineEventSide(
    index: number,
    override?: "left" | "right",
): "left" | "right" {
    if (override) return override;
    // Even indices on left, odd indices on right
    return index % 2 === 0 ? "left" : "right";
}

/**
 * Calculate deceleration of velocity over time
 * Models natural scroll deceleration (momentum settling)
 * @param velocity - Current velocity
 * @param deltaTime - Time elapsed in milliseconds
 * @param decelerationRate - Rate of deceleration (0-1, higher = slower decay)
 * @returns Velocity after deceleration
 */
export function decelerateVelocity(
    velocity: number,
    deltaTime: number,
    decelerationRate: number = 0.95,
): number {
    // Apply exponential decay: velocity *= (decelerationRate ^ (deltaTime / 16.67ms))
    // Normalized to 60 FPS = 16.67ms per frame
    const framesElapsed = deltaTime / 16.67;
    return velocity * Math.pow(decelerationRate, framesElapsed);
}
