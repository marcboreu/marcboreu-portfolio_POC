# Spec Delta

## Purpose

Provides a high-performance, scroll-driven timeline component with advanced SVG animations, enhanced visual effects, and professional polish. Animates connectors, spine, and item interactions in sync with scroll position using native SVG and CSS without external animation libraries.

## ADDED Requirements

### Requirement: SVG Spine with Animated Fill

The timeline component SHALL render a central vertical spine (SVG line) with an animated fill that grows from top to bottom as the user scrolls down the page.

#### Scenario: Spine fill animates on page scroll
- **WHEN** user scrolls down the page
- **THEN** the spine's animated fill extends downward proportional to scroll progress, creating a visual indication of progress through the timeline

#### Scenario: Spine fill resets when scrolling up
- **WHEN** user scrolls up the page
- **THEN** the spine's animated fill shrinks proportionally to match current scroll position

#### Scenario: Spine renders with gradient effects
- **WHEN** component mounts
- **THEN** the spine displays with gradient color from top to bottom for visual enhancement

### Requirement: Animated Item Connectors

The timeline component SHALL display animated SVG connector lines from each timeline item to the central spine, with drawing animations synchronized to scroll position.

#### Scenario: Connector lines draw as items enter viewport
- **WHEN** timeline item becomes visible in the viewport
- **THEN** SVG connector line from item to spine animates with a drawing effect (stroke-dasharray animation)

#### Scenario: Connectors animate based on scroll velocity
- **WHEN** user scrolls at varying speeds
- **THEN** connector animations adjust smoothly to reflect current scroll velocity, creating a fluid visual connection

#### Scenario: Multiple item connectors animate independently
- **WHEN** multiple timeline items are on screen simultaneously
- **THEN** each connector animates independently based on its item's scroll state and distance from active item

### Requirement: Enhanced Marker Buttons with SVG Animation

The timeline component SHALL render marker buttons on the spine with animated SVG paths or shapes that respond to scroll state and user interaction.

#### Scenario: Markers show animated check marks for passed items
- **WHEN** an item has been scrolled past
- **THEN** marker button displays an animated SVG check mark or fill animation indicating completion

#### Scenario: Active marker button displays animated glow effect
- **WHEN** user scrolls near an item making it the active item
- **THEN** corresponding marker button displays an animated SVG glow or shadow effect

#### Scenario: Markers are clickable and animated on interaction
- **WHEN** user hovers over or clicks a marker button
- **THEN** marker button animates with scale, rotation, or SVG path animations providing visual feedback

### Requirement: Item Glow and Shadow Effects

The timeline component SHALL render animated glow and shadow effects on timeline items that pulse or respond to scroll velocity.

#### Scenario: Active item displays animated glow effect
- **WHEN** an item becomes the active item (centered on screen)
- **THEN** item displays an animated glowing border or shadow effect that enhances visual prominence

#### Scenario: Glow intensity responds to scroll velocity
- **WHEN** user scrolls faster
- **THEN** glow/shadow effects become more pronounced, then gradually reduce to normal intensity

#### Scenario: Glow animation is smooth and continuous
- **WHEN** items transition between active and inactive states
- **THEN** glow animations transition smoothly with no jarring visual changes

### Requirement: Animated Item Badges with Rotation

The timeline component SHALL render numbered badges on timeline items with animated rotation and scale effects.

#### Scenario: Badge rotates as item animates
- **WHEN** item moves through scroll animations
- **THEN** badge element rotates smoothly in sync with item's visual transformation

#### Scenario: Badge scales with item prominence
- **WHEN** item becomes active (center of viewport)
- **THEN** badge scales up slightly and may display additional animated effects

### Requirement: Gradient Overlays on Timeline Items

The timeline component SHALL render animated gradient overlays on timeline items that change based on scroll position and item state.

#### Scenario: Item gradient appears when item is inactive
- **WHEN** timeline item is not the active item
- **THEN** item displays a subtle gradient overlay that enhances readability and visual hierarchy

#### Scenario: Gradient animates when item becomes active
- **WHEN** item becomes the active item
- **THEN** gradient overlay animates smoothly to a lighter or more transparent state, revealing full content

### Requirement: Spine Head with Enhanced Animation

The timeline component SHALL render an enhanced spine head (indicator at current scroll position) with extended visual effects.

#### Scenario: Spine head extends with velocity
- **WHEN** user scrolls with varying velocities
- **THEN** spine head grows and shrinks based on scroll velocity, creating a "pulling" visual effect

#### Scenario: Spine head displays animated glow
- **WHEN** component renders
- **THEN** spine head displays an animated glow effect with subtle pulsing animation

### Requirement: Scroll-Synchronized Animation System

The timeline component SHALL synchronize all SVG and CSS animations with scroll position using a scroll tracking system that calculates velocity and progress.

#### Scenario: All animations sync to scroll position in real-time
- **WHEN** user scrolls the page at any speed
- **THEN** all component animations (connectors, spine, glows, rotations) update in real-time without lag or latency

#### Scenario: Animation system supports variable scroll speeds
- **WHEN** user scrolls very fast or very slow
- **THEN** animations adapt smoothly with appropriate easing and timing to maintain visual coherence

#### Scenario: Reduced motion preference is respected
- **WHEN** user has prefers-reduced-motion enabled in their browser
- **THEN** all animations are disabled or significantly reduced to respect user accessibility preference

### Requirement: Component Maintains Responsive Design

The timeline component SHALL render correctly and animate properly across all device sizes and viewport dimensions.

#### Scenario: SVG connectors adjust to viewport width
- **WHEN** component renders on different screen sizes
- **THEN** SVG connector lines properly connect items to spine regardless of viewport width

#### Scenario: Component adapts to mobile viewports
- **WHEN** component renders on mobile devices (< 768px)
- **THEN** layout adapts appropriately (spine may hide, items stack vertically) while maintaining smooth animations

#### Scenario: Animations perform smoothly on all device sizes
- **WHEN** user scrolls on any device
- **THEN** animations maintain 60 FPS performance without dropping frames or stuttering

### Requirement: SVG Elements Render Without External Libraries

The timeline component SHALL use only native SVG elements and CSS animations, with no dependency on external animation libraries (GSAP, Framer Motion, etc.).

#### Scenario: Component uses only SVG stroke-dasharray for draw animations
- **WHEN** component renders animated connectors or lines
- **THEN** animations use native SVG stroke-dasharray and stroke-dashoffset properties

#### Scenario: Component uses only CSS and JavaScript for transformations
- **WHEN** items or badges animate
- **THEN** animations use CSS transforms, opacity, and filters with JavaScript requestAnimationFrame for scroll tracking

#### Scenario: Component bundle size remains reasonable
- **WHEN** component is bundled for production
- **THEN** component adds minimal overhead due to no external animation library dependencies

### Requirement: Component Maintains Backward Compatibility

The timeline component SHALL maintain the same React component API and prop interface as the previous version.

#### Scenario: Component accepts same props as previous version
- **WHEN** consuming code uses the component
- **THEN** component accepts the same props (items, title, intro, eyebrow, etc.) with same behavior

#### Scenario: Component integrates into existing pages without modification
- **WHEN** component is upgraded in an existing application
- **THEN** existing integrations (Contact page, other pages) work without code changes

#### Scenario: Component exports same type definitions as before
- **WHEN** TypeScript consumers import component types
- **THEN** types (Timeline2Item, Timeline2Props) remain available and compatible
