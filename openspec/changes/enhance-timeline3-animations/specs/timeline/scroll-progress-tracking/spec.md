# Spec Delta

## Purpose

Track the user's scroll position relative to the timeline container and update visual progress indicators and item animations based on viewport visibility and scroll progress.

## ADDED Requirements

### Requirement: Scroll progress calculation
The component SHALL calculate the scroll progress as a value between 0 and 1 representing how far through the timeline the user has scrolled.

#### Scenario: At top of timeline
- **WHEN** the timeline element's top is at or above the viewport top
- **THEN** scroll progress value is 0

#### Scenario: At bottom of timeline
- **WHEN** the timeline element's bottom is at or below the viewport bottom
- **THEN** scroll progress value is 1

#### Scenario: Partially visible timeline
- **WHEN** the timeline spans across the viewport
- **THEN** scroll progress is calculated as (negative top distance) / (total scrollable height)

#### Scenario: Timeline shorter than viewport
- **WHEN** the entire timeline fits within the viewport
- **THEN** scroll progress remains 0 or is not tracked

### Requirement: Progress bar animation
The visual progress indicator SHALL animate smoothly to reflect the current scroll progress.

#### Scenario: Progress bar height updates
- **WHEN** user scrolls and scroll progress changes
- **THEN** the progress bar fill height animates to the new progress value

#### Scenario: Smooth interpolation
- **WHEN** scroll progress updates frequently during scroll events
- **THEN** the progress bar uses easing to smooth animation between values (using requestAnimationFrame)

#### Scenario: No progress animation on reduced motion preference
- **WHEN** user has set `prefers-reduced-motion: reduce` in OS settings
- **THEN** progress bar updates immediately without animation transitions

### Requirement: Item animation triggering
Timeline items SHALL animate when they enter the viewport based on intersection thresholds.

#### Scenario: Item enters viewport
- **WHEN** a timeline item's top crosses into the viewport with 20% threshold
- **THEN** item animation is triggered (circle path, lines, and text fade in)

#### Scenario: Item has visible attribute
- **WHEN** an item is within the viewport intersection threshold
- **THEN** the item element receives a `data-visible` attribute

#### Scenario: Item leaves viewport
- **WHEN** a timeline item scrolls out of the viewport below the threshold
- **THEN** the `data-visible` attribute is removed (animation may reverse or item maintains state based on design)

### Requirement: Intersection observer configuration
The visibility detection system SHALL use appropriate thresholds and margins for reliable item detection.

#### Scenario: Bottom margin threshold
- **WHEN** the intersection observer is configured
- **THEN** it uses a bottom margin of `-15%` to start animations slightly before items reach the viewport center

#### Scenario: Visibility threshold
- **WHEN** items are observed
- **THEN** visibility is triggered at 20% intersection threshold

### Requirement: Scroll event performance
The scroll event handling SHALL be optimized to prevent jank and excessive reflows.

#### Scenario: Passive scroll listener
- **WHEN** scroll event listener is registered
- **THEN** it uses the `{ passive: true }` option to avoid blocking scroll performance

#### Scenario: Window resize handling
- **WHEN** window is resized
- **THEN** scroll progress is recalculated to account for new viewport dimensions

#### Scenario: Animation frame batching
- **WHEN** scroll events fire rapidly
- **THEN** DOM updates are batched via requestAnimationFrame to avoid excessive reflows
