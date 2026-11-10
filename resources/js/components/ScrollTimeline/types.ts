/**
 * ScrollTimeline Component TypeScript Interfaces
 * Defines all types used across the component system
 */

/**
 * Individual timeline event data
 */
export interface TimelineEventData {
    /** Unique identifier for the event */
    id: string;
    /** Year of the event (e.g., 2014) */
    year: number;
    /** Event number as string (e.g., "01", "02", ..., "13") */
    number: string;
    /** Event title/heading */
    title: string;
    /** Event description/body text */
    description: string;
    /** Optional side override: 'left' | 'right', otherwise alternates automatically */
    side?: "left" | "right";
}

/**
 * Scroll state tracked by useScrollTracking hook
 */
export interface ScrollState {
    /** Raw scroll position in pixels (scrollTop) */
    scrollTop: number;
    /** Normalized scroll position (0-1, where 0 = top, 1 = bottom) */
    scrollPosition: number;
    /** Scroll as percentage of total scrollable height */
    scrollPercentage: number;
    /** Velocity in pixels per millisecond */
    velocity: number;
    /** Whether user is actively scrolling */
    isScrolling: boolean;
}

/**
 * Animation state for an individual event
 */
export interface EventAnimationState {
    /** Whether event is ≥ 50% visible in viewport */
    isVisible: boolean;
    /** Distance from viewport center in pixels */
    distanceFromCenter: number;
    /** Calculated opacity (0.5-1.0 range) */
    opacity: number;
    /** Calculated scale (1.0-1.05 range) */
    scale: number;
    /** Vertical translation in pixels (for slide effect) */
    translateY: number;
    /** Whether pulse animation should trigger */
    shouldPulse: boolean;
}

/**
 * Props for ScrollTimeline main component
 */
export interface ScrollTimelineProps {
    /** Array of event data to render */
    events: TimelineEventData[];
    /** Container height (CSS value: "100vh", "500px", etc), default: "100vh" */
    height?: string | number;
    /** Spine width in pixels, default: 2 */
    spineWidth?: number;
    /** Spine color (CSS color value), default: "#333" */
    spineColor?: string;
    /** Velocity multiplier for spine stretching (higher = more stretch), default: 0.5 */
    stretchFactor?: number;
    /** Event marker size in pixels, default: 12 */
    markerSize?: number;
    /** Event marker color (CSS color value), default: spineColor */
    markerColor?: string;
    /** Enable responsive design, default: true */
    responsive?: boolean;
    /** Custom CSS class for container */
    className?: string;
    /** Custom inline styles for container */
    style?: React.CSSProperties;
}

/**
 * Props for TimelineEvent component
 */
export interface TimelineEventProps {
    /** Event data to render */
    event: TimelineEventData;
    /** Whether event is visible in viewport */
    isVisible: boolean;
    /** "left" or "right" side */
    side: "left" | "right";
    /** Marker size in pixels */
    markerSize: number;
    /** Marker color */
    markerColor: string;
}

/**
 * Configuration for momentum physics calculations
 */
export interface MomentumConfig {
    /** Base container height in pixels */
    baseHeight: number;
    /** Current scroll velocity (pixels per ms) */
    velocity: number;
    /** Multiplier for velocity → stretch amount */
    stretchFactor: number;
    /** Maximum spine height multiplier (e.g., 2.0 = 200% of base) */
    maxStretchMultiplier?: number;
}

/**
 * Result of momentum physics calculation
 */
export interface MomentumResult {
    /** Calculated spine height in pixels */
    spineHeight: number;
    /** Whether animation is currently decelerating */
    isDecelerating: boolean;
}

/**
 * Configuration for animation frame updates
 */
export interface AnimationFrameConfig {
    /** Time in ms since last update */
    deltaTime: number;
    /** Current scroll state */
    scrollState: ScrollState;
    /** Visible event IDs */
    visibleEvents: Set<string>;
}

/**
 * Options for event position calculations
 */
export interface PositionCalculationOptions {
    /** Event index in timeline (0-based) */
    eventIndex: number;
    /** Total number of events */
    totalEvents: number;
    /** Current scroll percentage (0-1) */
    scrollPercentage: number;
    /** Viewport/container height in pixels */
    viewportHeight: number;
    /** Spacing between events in pixels */
    eventSpacing?: number;
}
