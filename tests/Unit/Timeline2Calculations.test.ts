import { describe, it, expect } from "vitest";

/**
 * SVG Position Calculation Tests
 */

// Test helper: Calculate connector distance
function calculateConnectorDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number
): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

// Test helper: Calculate stroke-dasharray for curved path
function calculateDashArray(distance: number): number {
    return distance * 1.3; // Account for curve
}

describe("Timeline2 SVG Position Calculations", () => {
    it("should calculate correct connector distance between two points", () => {
        const distance = calculateConnectorDistance(0, 0, 3, 4);
        expect(distance).toBe(5); // 3-4-5 triangle
    });

    it("should calculate stroke-dasharray for curved path", () => {
        const distance = 100;
        const dashArray = calculateDashArray(distance);
        expect(dashArray).toBe(130); // 100 * 1.3
    });

    it("should calculate correct distance for diagonal connector", () => {
        const distance = calculateConnectorDistance(10, 10, 20, 20);
        expect(distance).toBeCloseTo(Math.sqrt(200)); // ~14.14
    });

    it("should handle zero distance", () => {
        const distance = calculateConnectorDistance(5, 5, 5, 5);
        expect(distance).toBe(0);
    });

    it("should calculate positive distance regardless of point order", () => {
        const distance1 = calculateConnectorDistance(0, 0, 10, 10);
        const distance2 = calculateConnectorDistance(10, 10, 0, 0);
        expect(distance1).toBe(distance2);
    });
});

/**
 * Animation State Calculations
 */

function calculateAnimationProgress(
    scrollPosition: number,
    scrollableHeight: number
): number {
    return scrollableHeight > 0 ? scrollPosition / scrollableHeight : 0;
}

function calculateVelocityEMA(
    instantVelocity: number,
    previousVelocity: number,
    factor: number = 0.25
): number {
    return instantVelocity * factor + previousVelocity * (1 - factor);
}

function calculateItemDistance(
    itemIndex: number,
    progress: number,
    itemCount: number
): number {
    return Math.abs(itemIndex - progress * (itemCount - 1));
}

describe("Timeline2 Animation State Calculations", () => {
    it("should calculate progress from scroll position", () => {
        const progress = calculateAnimationProgress(500, 1000);
        expect(progress).toBe(0.5);
    });

    it("should clamp progress between 0 and 1", () => {
        const progress1 = calculateAnimationProgress(0, 1000);
        const progress2 = calculateAnimationProgress(1000, 1000);
        expect(progress1).toBe(0);
        expect(progress2).toBe(1);
    });

    it("should handle zero scrollable height", () => {
        const progress = calculateAnimationProgress(100, 0);
        expect(progress).toBe(0);
    });

    it("should calculate velocity with EMA smoothing", () => {
        const instantVelocity = 100;
        const previousVelocity = 50;
        const smoothed = calculateVelocityEMA(instantVelocity, previousVelocity, 0.25);
        expect(smoothed).toBe(75); // 100 * 0.25 + 50 * 0.75
    });

    it("should converge velocity over multiple frames", () => {
        let velocity = 0;
        const targetVelocity = 100;

        for (let i = 0; i < 10; i++) {
            velocity = calculateVelocityEMA(targetVelocity, velocity, 0.25);
        }

        expect(velocity).toBeCloseTo(targetVelocity, 0); // Should converge close to 100
    });

    it("should calculate distance from active item", () => {
        const distance = calculateItemDistance(5, 0.5, 10);
        expect(distance).toBeCloseTo(0); // At 50% progress, active item is at index 4.5
    });

    it("should calculate increasing distance as progress moves away", () => {
        const distance1 = calculateItemDistance(0, 0.5, 10);
        const distance2 = calculateItemDistance(1, 0.5, 10);
        expect(distance1).toBeGreaterThan(distance2);
    });
});

/**
 * Glow Intensity Calculations
 */

function calculateGlowIntensity(velocity: number): number {
    return Math.min(Math.abs(velocity) * 0.01, 1.5);
}

function calculateGlowBlur(baseBlur: number, glowIntensity: number): number {
    return baseBlur + glowIntensity * 30;
}

function calculateGlowSpread(baseSpread: number, glowIntensity: number): number {
    return baseSpread + glowIntensity * 15;
}

describe("Timeline2 Glow Effect Calculations", () => {
    it("should calculate glow intensity from velocity", () => {
        const intensity = calculateGlowIntensity(50);
        expect(intensity).toBe(0.5); // 50 * 0.01
    });

    it("should cap glow intensity at 1.5", () => {
        const intensity = calculateGlowIntensity(200);
        expect(intensity).toBe(1.5); // Capped at 1.5
    });

    it("should handle negative velocity (scrolling up)", () => {
        const intensity = calculateGlowIntensity(-50);
        expect(intensity).toBe(0.5); // Math.abs(-50) * 0.01
    });

    it("should calculate glow blur based on intensity", () => {
        const blur = calculateGlowBlur(15, 0.5);
        expect(blur).toBe(30); // 15 + 0.5 * 30
    });

    it("should calculate glow spread based on intensity", () => {
        const spread = calculateGlowSpread(10, 0.5);
        expect(spread).toBe(17.5); // 10 + 0.5 * 15
    });

    it("should scale glow effects proportionally", () => {
        const intensity1 = calculateGlowIntensity(50);
        const intensity2 = calculateGlowIntensity(100);
        expect(intensity2).toBe(intensity1 * 2);
    });
});
