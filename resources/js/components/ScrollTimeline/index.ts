/**
 * ScrollTimeline Component - Main Export
 * Re-exports all component, hooks, types, and utilities
 */

// Main component
export { default as ScrollTimeline } from "./ScrollTimeline";
export { default as TimelineEvent } from "./TimelineEvent";

// Hooks
export { useScrollTracking } from "./hooks/useScrollTracking";
export {
    useIntersectionObserver,
    useIsIntersecting,
} from "./hooks/useIntersectionObserver";
export {
    useAnimationFrame,
    useAnimationFrameThrottled,
    useAnimationFrameFps,
} from "./hooks/useAnimationFrame";
export {
    useMomentumPhysics,
    useMomentumPhysicsAdvanced,
} from "./hooks/useMomentumPhysics";
export {
    usePulseAnimation,
    usePulseAnimationDebounced,
    usePulseAnimationState,
    type PulseState,
} from "./hooks/usePulseAnimation";

// Types
export type {
    TimelineEventData,
    ScrollState,
    EventAnimationState,
    ScrollTimelineProps,
    TimelineEventProps,
    MomentumConfig,
    MomentumResult,
    AnimationFrameConfig,
    PositionCalculationOptions,
} from "./types";

// Utilities
export {
    calculateScrollPercentage,
    smoothVelocity,
    calculateEventPosition,
    calculateDistanceFromCenter,
    calculateOpacity,
    calculateScale,
    calculateTranslateY,
    calculateSpineHeight,
    isEventVisible,
    clamp,
    lerp,
    easeOutCubic,
    determineEventSide,
    decelerateVelocity,
} from "./utils/calculations";
