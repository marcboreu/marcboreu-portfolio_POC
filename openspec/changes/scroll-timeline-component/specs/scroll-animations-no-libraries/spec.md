# Scroll-Driven Animations (No Libraries)

## Requirements

### R1: Scroll Tracking Without Libraries
The component must track scroll position using native Web APIs.

**R1.1 - IntersectionObserver API**
- Detects when events enter/exit viewport
- Sets threshold to 50% for activation
- Updates event visibility state
- No event listeners on scroll element itself (performance)
- Verification: Events mark as visible when ≥ 50% in viewport

**R1.2 - RequestAnimationFrame loop**
- Main animation loop runs at refresh rate (60 FPS)
- Calculates delta time between frames
- Updates scroll velocity based on position delta
- Deceleration: velocity decays over 500ms when scroll stops
- Verification: Loop maintains 60 FPS during active scroll

**R1.3 - Scroll position calculation**
- Reads `element.scrollTop` / total scrollable height
- Normalizes to 0-1 range
- Clamped between min/max to prevent over-scroll
- Updates on every animation frame
- Verification: Position accurately reflects scroll depth

**R1.4 - No scroll event listener**
- Instead: uses IntersectionObserver + requestAnimationFrame
- Scroll event fires too frequently (100s per second)
- IntersectionObserver is batched and throttled by browser
- Combined approach: smooth animations without browser thrashing
- Verification: Performance metrics show minimal CPU usage

### R2: Spine Stretching Animation
The component must implement dynamic spine height based on scroll velocity.

**R2.1 - Velocity measurement**
- Formula: `velocity = (currentScroll - previousScroll) / deltaTime`
- Units: pixels per millisecond
- Smoothed: use exponential moving average (EMA) to reduce jitter
- EMA factor: 0.2 (higher = more responsive, more jittery; lower = smoother, more delay)
- Verification: Velocity responds quickly to scroll changes

**R2.2 - Spine height calculation**
- Base height: container scrollable height
- Stretch amount: `velocity × stretchFactor`
- stretchFactor: configurable, default 0.5
- Max height: base height × 2.0 (cap the stretch)
- Formula: `spineHeight = Math.min(baseHeight + velocity × stretchFactor, baseHeight × 2.0)`
- Verification: Spine height correlates to scroll velocity

**R2.3 - Spine height animation**
- Apply CSS transition to spine element: `transition: height 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Easing: custom cubic-bezier (bouncy spring-like feel)
- Duration: 200ms (adjustable)
- When velocity drops to 0: spine animates back to base height over 400ms
- Verification: Spine smoothly stretches and contracts

**R2.4 - Visual spine rendering**
- Spine is SVG `<line>` or CSS div `border-left`
- Width: 2px (configurable)
- Color: inherit from theme or prop (e.g., #333)
- Opacity: 0.8 (slightly transparent)
- Position: absolute, centered horizontally in container
- Height applied as CSS style: `style={{ height: spineHeight + 'px' }}`
- Verification: Spine renders as visual line, changes height smoothly

### R3: Event Position and Opacity Animation
Events must animate position and opacity based on scroll.

**R3.1 - Event offset calculation**
- Each event has a target position: `(index / totalEvents) * totalHeight`
- Current position: `targetPosition - (scrollPercentage × totalHeight)`
- Vertical translation: clamp offset to viewport (don't render off-screen)
- CSS transform: `translateY(offset)` + `transform-gpu` for hardware acceleration
- Verification: Events move smoothly as viewport scrolls

**R3.2 - Event opacity based on center distance**
- Center of viewport: `viewportHeight / 2`
- Event distance from center: `Math.abs(eventPosition - center)`
- Max visible distance: configurable, default `viewportHeight * 0.6`
- Opacity formula: `1.0 - (distance / maxDistance) × 0.5`
- Clamped: 0.5 to 1.0 (never fully invisible while in viewport)
- Verification: Events fade as they approach viewport edges

**R3.3 - Event scale animation**
- Base scale: 1.0
- Distance-based scale: `1.0 + (1.0 - opacity) × 0.1` (events at edges are slightly smaller)
- Hover scale: 1.05 (slightly larger)
- Animation: CSS transition on transform (0.3s ease-out)
- Verification: Events scale subtly based on viewport position

**R3.4 - Content slide animation**
- Content (title + description) has subtle translateY
- Formula: `translateY = (distanceFromCenter / maxDistance) × 8px`
- Moves up/down based on distance from center
- Combined with opacity for entrance/exit effect
- Verification: Content slides gently as viewport scrolls

### R4: Marker Animation and Interaction
Event markers (dots) must animate on scroll and interaction.

**R4.1 - Marker scale on scroll**
- Base scale: 1.0
- Visible scale: 1.2 (when event ≥ 50% in viewport)
- Animation: CSS transition (0.3s cubic-bezier)
- Easing: cubic-bezier(0.34, 1.56, 0.64, 1) (spring-like)
- Verification: Markers scale smoothly as events become visible

**R4.2 - Marker hover interaction**
- Hover scale: 1.5 (larger than visible state)
- Cursor: pointer
- Animation: CSS transition (0.2s ease-out)
- Background color change: optional, e.g., highlight color
- Verification: Markers respond to mouse hover with scale change

**R4.3 - Marker pulse effect (optional)**
- Subtle pulse animation when event enters viewport
- Keyframes: scale 1.0 → 1.3 → 1.0 over 800ms
- Animation: `animation: pulse 0.8s ease-out`
- One-time trigger per event visibility
- Verification: Pulse animates once when event becomes visible

**R4.4 - Marker focus state**
- Focus ring when tabbed to
- Ring width: 2px, color: configurable (e.g., brand color)
- Offset: 4px from marker edge
- Animation: subtle glow (box-shadow)
- Verification: Focus visible for keyboard navigation

### R5: CSS Animations and Transitions
All animations must use native CSS for performance.

**R5.1 - CSS Transitions**
- Applied to: transform, opacity, height, color
- Durations: 0.2s-0.4s depending on property
- Easing: cubic-bezier (custom spring curves)
- Properties: will-change on active elements for GPU acceleration
- Verification: Transitions are hardware-accelerated

**R5.2 - CSS Animations (keyframes)**
- Pulse: scale animation for markers
- Fade: opacity animation for content
- Defined in component stylesheet
- Duration: 0.6s-0.8s for entrance/exit effects
- Verification: Keyframes animate smoothly at 60 FPS

**R5.3 - GPU acceleration hints**
- Use `transform: translateZ(0)` or `will-change: transform`
- Applied to: spine, events, markers
- Reduces repaints, improves scroll performance
- Verification: DevTools shows compositing layers

**R5.4 - Avoiding jank**
- No inline style updates per frame on properties that trigger layouts
- Use transform and opacity only (don't animate width/height on scroll)
- Batch DOM updates with requestAnimationFrame
- Use CSS containment: `contain: layout paint`
- Verification: Lighthouse Performance score remains high

### R6: Performance Optimization
Component must maintain 60 FPS on mid-range devices.

**R6.1 - Throttle updates**
- Animation frame loop updates spine height
- Event positions update on IntersectionObserver changes + frame loop
- Scroll position recalculated only once per frame
- Verification: CPU usage < 5% during active scroll

**R6.2 - Debounce and cleanup**
- Observers unobserve when events exit viewport (memory cleanup)
- RequestAnimationFrame stops when scroll velocity reaches 0
- Idle detection: if scroll hasn't changed for 500ms, stop loop
- Verification: Memory usage stable over time

**R6.3 - Browser compatibility**
- IntersectionObserver: all modern browsers (IE11 with polyfill)
- RequestAnimationFrame: all modern browsers
- CSS transforms: all modern browsers
- Fallback: basic static layout if APIs unavailable
- Verification: Works in Chrome, Firefox, Safari, Edge

### R7: Scroll Momentum and Spring Effect
Fast scrolls trigger spring-like spine stretching.

**R7.1 - Momentum detection**
- If velocity > threshold (e.g., 10 pixels/frame), trigger momentum mode
- Momentum mode: apply spring physics to spine height
- Spring constant: 0.1 (soft spring)
- Damping: 0.3 (bounce 1-2 times before settling)
- Verification: Spine bounces on fast scroll

**R7.2 - Spring physics**
- Formula: `acceleration = (targetHeight - currentHeight) × springConstant`
- Velocity: `velocity += acceleration; currentHeight += velocity`
- Damping: `velocity *= (1 - damping)`
- Recalculated every frame until velocity near 0
- Verification: Smooth spring animation without overshooting

**R7.3 - Momentum decay**
- Velocity decelerates naturally over time
- Deceleration rate: exponential (e.g., `velocity *= 0.95` per frame)
- Duration: 400-600ms total decay
- Verification: Spine returns to rest height smoothly

## Scenarios

### S1: Smooth Scroll
**Given**: Desktop view with timeline rendered  
**When**: User scrolls slowly and steadily down  
**Then**:
- Spine height remains near base (low velocity)
- Events fade in and slide up smoothly
- Opacity animates from 0.5 to 1.0 as event reaches center
- Scale remains near 1.0
- No visual jank, smooth 60 FPS
- Verification: Scrolling feels buttery smooth

### S2: Fast Scroll with Momentum
**Given**: Desktop view at middle of timeline  
**When**: User scrolls down rapidly (flick)  
**Then**:
- Velocity calculated: 50+ pixels/frame
- Spine stretches to 1.8x height instantly
- Spring physics engage (slight overshoot)
- Spine bounces back with 1-2 oscillations
- Returns to base height over 400-600ms
- Events continue animating smoothly throughout
- Verification: Momentum effect visible, spring feels natural

### S3: Multiple Events Visibility
**Given**: 5+ events in viewport  
**When**: User scrolls to position with 3 events visible  
**Then**:
- Top event: fading out (opacity 0.6)
- Middle event: fully visible (opacity 1.0, scale 1.2)
- Bottom event: fading in (opacity 0.6)
- Markers scale: 1.2 for visible events, 1.0 for others
- All animations synchronized smoothly
- Verification: Multiple events animate in harmony

### S4: Marker Hover on Scrolling
**Given**: Desktop view with event marker visible  
**When**: User hovers marker while scrolling continues  
**Then**:
- Marker scales to 1.5 (hover takes precedence)
- Scroll animations continue underneath
- Marker remains interactive throughout
- No interruption to scroll experience
- Verification: Hover and scroll work together seamlessly

### S5: Scroll Stops and Spine Relaxes
**Given**: Desktop view with spine stretched  
**When**: User stops scrolling (scroll velocity = 0)  
**Then**:
- Velocity measured at 0
- Spine height animates back to base over 400ms
- Deceleration smooth with cubic-bezier easing
- No abrupt snap-back
- Events stabilize at their positions
- Verification: Relaxation animation smooth and natural

### S6: Mobile Scroll
**Given**: Mobile device (single column timeline)  
**When**: User scrolls through timeline  
**Then**:
- Spine hidden or minimal (not distracting on mobile)
- Events stack vertically
- Events still fade/scale based on visibility
- Scroll smooth and responsive
- No momentum effect needed (mobile has native momentum)
- Verification: Mobile experience not janky

### S7: Event Marker Pulse
**Given**: Mobile or desktop, event not yet visible  
**When**: Event scrolls into viewport (50%+ visible)  
**Then**:
- Marker pulse animation triggers (once)
- Scale: 1.0 → 1.3 → 1.0 over 800ms
- Pulse plays single time per visibility state
- Subsequent scrolls don't re-trigger pulse
- Verification: Pulse activates once per viewport entry

## Out of Scope (for this spec)

- Click handlers for events (read-only display in v1)
- Scrolling to specific event programmatically
- Prev/next button navigation
- Keyboard arrow key navigation (future enhancement)
- Custom animation durations per event
- Parallax effects (reserved for future)
- WebGL/Canvas rendering (CSS-based only for v1)
