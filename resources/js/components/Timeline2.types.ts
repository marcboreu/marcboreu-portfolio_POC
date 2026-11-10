/**
 * Timeline2 Component Types
 * Comprehensive type definitions for enhanced Timeline2 component with SVG animations
 */

export type Timeline2Item = {
    id: string;
    year: string;
    title: string;
    description: string;
};

export type Timeline2Props = {
    items: Timeline2Item[];
    eyebrow?: string;
    title?: string;
    intro?: string;
};

export type SVGConnectorPosition = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

export type AnimationState = {
    progress: number;
    velocity: number;
    activeIndex: number;
};

export type ItemAnimationValues = {
    opacity: number;
    scale: number;
    translateY: number;
    rotateX: number;
    blur: number;
    glowIntensity: number;
};

export type SVGAnimationConfig = {
    strokeDasharray: number;
    strokeDashoffset: number;
    opacity: number;
    color: string;
};

export type VelocityTrackingData = {
    scrollPosition: number;
    timestamp: number;
    velocity: number;
};

export type ResponsiveLayout = {
    viewportWidth: number;
    viewportHeight: number;
    isMobile: boolean;
    isTablet: boolean;
};

export type GlowEffectConfig = {
    intensity: number;
    color: string;
    blurRadius: number;
    spreadRadius: number;
    animated: boolean;
};

export type GradientOverlayConfig = {
    colors: string[];
    opacity: number;
    animated: boolean;
    transitionDuration: number;
};
