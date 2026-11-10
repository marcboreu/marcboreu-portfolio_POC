# Implementation Tasks: Scroll Timeline Component

## 1. Project Setup and TypeScript Interfaces

- [x] 1.1 Create component directory structure
  - Create `resources/js/components/ScrollTimeline/` directory
  - Create subdirectories: hooks/, types/, utils/
  - Verification: Directories exist and are empty
  - Dependencies: None

- [x] 1.2 Create TypeScript interfaces file
  - Create `ScrollTimeline/types.ts` with TimelineEventData, ScrollState, EventAnimationState, ScrollTimelineProps
  - Export all interfaces for use in components
  - Verification: types.ts compiles without errors
  - Dependencies: None

- [x] 1.3 Create utility functions file
  - Create `ScrollTimeline/utils/calculations.ts`
  - Implement: calculateScrollPercentage(), calculateOpacity(), calculateScale(), calculateVelocity()
  - Verification: Functions export correctly and have proper types
  - Dependencies: 1.2

## 2. Custom Hooks Implementation

- [x] 2.1 Create useScrollTracking hook
  - File: `ScrollTimeline/hooks/useScrollTracking.ts`
  - Returns: scrollTop, scrollPercentage, velocity, isScrolling
  - Uses: requestAnimationFrame for updates, exponential moving average for smoothing
  - Verification: Hook returns scroll state updates on container scroll
  - Dependencies: 1.2, 1.3

- [x] 2.2 Create useIntersectionObserver hook
  - File: `ScrollTimeline/hooks/useIntersectionObserver.ts`
  - Returns: Set<string> of visible event IDs
  - Uses: IntersectionObserver API with 50% threshold
  - Verification: Hook detects visible events correctly
  - Dependencies: 1.2

- [x] 2.3 Create useAnimationFrame hook
  - File: `ScrollTimeline/hooks/useAnimationFrame.ts`
  - Purpose: Lifecycle management for animation loop
  - Returns: void (callback-based)
  - Verification: Hook runs callback at 60 FPS and cleans up on unmount
  - Dependencies: None

- [x] 2.4 Create useMomentumPhysics hook
  - File: `ScrollTimeline/hooks/useMomentumPhysics.ts`
  - Calculates: spine height based on velocity and spring physics
  - Returns: spineHeight (number)
  - Verification: Spine height changes smoothly with velocity changes
  - Dependencies: 1.2, 1.3

- [x] 2.5 Create usePulseAnimation hook
  - File: `ScrollTimeline/hooks/usePulseAnimation.ts`
  - Triggers: pulse animation once per event visibility
  - Returns: shouldPulse (boolean) for given event ID
  - Verification: Pulse triggers exactly once when event becomes visible
  - Dependencies: 2.2

## 3. CSS and Styling

- [x] 3.1 Create main stylesheet
  - File: `ScrollTimeline/ScrollTimeline.css`
  - Includes: container, spine, events, markers, content styling
  - Verification: CSS compiles and no syntax errors
  - Dependencies: None

- [x] 3.2 Implement spine styling and transitions
  - Spine: position absolute, centered, transitions on height/width
  - Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
  - Duration: 0.2s for height changes
  - Verification: Spine renders as vertical line with smooth transitions
  - Dependencies: 3.1

- [x] 3.3 Implement event layout styles
  - Container: flex, alternating left/right via nth-child
  - Desktop: 50% padding on alternating sides
  - Responsive: adjusts for tablet/mobile
  - Verification: Events alternate left/right on desktop, stack on mobile
  - Dependencies: 3.1

- [x] 3.4 Implement marker animations
  - Marker: 12px circle, scale transitions
  - Scales: 1.0 default, 1.2 visible, 1.5 hover
  - Pulse animation: 0.8s scale 1.0→1.3→1.0
  - Verification: Markers scale smoothly on states, pulse animates
  - Dependencies: 3.1, 3.2

- [x] 3.5 Implement content animations
  - Content: opacity 0.5-1.0, translateY based on position
  - Fade: opacity transitions 0.4s ease-out
  - Slide: transform transitions 0.4s ease-out
  - Verification: Content fades and slides smoothly on scroll
  - Dependencies: 3.1

- [x] 3.6 Implement responsive breakpoints
  - Mobile (< 768px): single column, spine on left edge
  - Tablet (768-1024px): narrow alternating layout
  - Desktop (> 1024px): full alternating with centered spine
  - Verification: Layout switches correctly at each breakpoint
  - Dependencies: 3.1, 3.3

- [x] 3.7 Add GPU acceleration hints
  - Will-change: transform, opacity on animated elements
  - Transform: translateZ(0) for compositing layers
  - Contain: layout paint on container
  - Verification: DevTools shows proper compositing layers
  - Dependencies: 3.1-3.6

## 4. Main Component Implementation

- [x] 4.1 Create ScrollTimeline.tsx (main component)
  - File: `ScrollTimeline/ScrollTimeline.tsx`
  - Props: events[], height, spineWidth, spineColor, stretchFactor, markerSize, responsive, className, style
  - State: scrollState, visibleEvents, spineHeight
  - Render: container, spine, events list
  - Verification: Component renders without errors, accepts props
  - Dependencies: 1.2, 2.1-2.5, 3.1

- [x] 4.2 Implement scroll container logic
  - Container: ref, overflow-y auto, overflow-x hidden
  - Binds: useScrollTracking to container
  - Updates: scroll state on every frame
  - Verification: Container scrollable, scroll state updates
  - Dependencies: 4.1, 2.1

- [x] 4.3 Implement spine rendering and updates
  - Spine: SVG line or div element, absolutely positioned
  - Height: updates based on velocity (useM omentumPhysics)
  - CSS class: .timeline-spine with transitions
  - Verification: Spine renders, height changes on scroll velocity
  - Dependencies: 4.1, 2.4, 3.2

- [x] 4.4 Implement events list rendering
  - Map over events array
  - Create TimelineEvent components for each event
  - Pass: event data, position, visibility, side
  - Key: use event.id for React reconciliation
  - Verification: All events render, correct data passed to children
  - Dependencies: 4.1, TimelineEvent created

- [x] 4.5 Wire up Intersection Observer
  - Create refs for all event elements
  - Call useIntersectionObserver with refs
  - Pass visibleEvents to event components
  - Verification: visibleEvents updates as events scroll into/out of viewport
  - Dependencies: 4.4, 2.2

- [x] 4.6 Add className and style props
  - Allow custom className on container
  - Allow custom styles via style prop
  - Merge with default styles via classNames utility
  - Verification: Custom className and styles apply correctly
  - Dependencies: 4.1

## 5. TimelineEvent Component

- [x] 5.1 Create TimelineEvent.tsx component
  - File: `ScrollTimeline/TimelineEvent.tsx`
  - Props: event data, position (0-1), isVisible, side, spineHeight
  - Renders: year label, marker, content (title + description)
  - Verification: Component renders event with all parts
  - Dependencies: 1.2

- [x] 5.2 Implement event marker rendering
  - Marker: div or span, position absolute, centered on spine
  - Size: 12px diameter circle (configurable)
  - Classes: timeline-marker, with pulse/visible classes
  - Verification: Marker renders at correct position, scales correctly
  - Dependencies: 5.1, 3.4

- [x] 5.3 Implement event content layout
  - Content: title, description, year, number
  - Layout: flex container with vertical stacking
  - Year: smaller, gray, uppercase
  - Number: large, bold, prominent
  - Title: bold, main heading
  - Description: body text, line-limited
  - Verification: Content renders in correct order with proper styling
  - Dependencies: 5.1

- [x] 5.4 Implement opacity and scale animations
  - Opacity: calculated from distanceFromCenter
  - Scale: calculated from opacity (1.0 - opacity * 0.05)
  - Apply via inline styles: style={{ opacity, transform: `scale(${scale})` }}
  - Transitions: handled by CSS .timeline-content
  - Verification: Opacity and scale update smoothly on scroll
  - Dependencies: 5.1, 1.3

- [x] 5.5 Implement position-based animations
  - TranslateY: based on distanceFromCenter (±8px)
  - Applied via transform: translateY(${translateY}px)
  - Combined with opacity for entrance/exit effect
  - Verification: Events slide smoothly as they pass through viewport
  - Dependencies: 5.4

- [x] 5.6 Add hover and focus states
  - Hover: marker scales to 1.5, cursor: pointer
  - Focus: marker has focus ring (2px outline)
  - States applied via CSS :hover, :focus pseudo-classes
  - Verification: Hover and focus states work correctly
  - Dependencies: 5.1, 3.4

- [x] 5.7 Implement pulse animation trigger
  - Pulse: triggered when isVisible changes from false to true
  - Animation class: .timeline-marker.pulse
  - Duration: 0.8s, runs once
  - Verification: Pulse animation plays once per visibility state change
  - Dependencies: 5.2, 2.5

## 6. Event Position Calculation and Animation

- [x] 6.1 Implement position calculation utility
  - Function: calculateEventPosition(eventIndex, totalEvents, scrollPercentage)
  - Returns: position offset in pixels
  - Calculation: (scrollPercentage × totalHeight) - (eventIndex × eventSpacing)
  - Verification: Positions calculated correctly, events move smoothly
  - Dependencies: 1.3

- [x] 6.2 Implement viewport distance calculation
  - Function: calculateDistanceFromCenter(eventPosition, viewportHeight)
  - Returns: distance in pixels from viewport center
  - Absolute value: distance always positive
  - Clamped: between 0 and maxDistance
  - Verification: Distance calculated correctly for all scroll positions
  - Dependencies: 1.3

- [x] 6.3 Implement opacity calculation
  - Function: calculateOpacity(distanceFromCenter, maxDistance)
  - Range: 0.5 to 1.0 (never fully invisible)
  - Formula: 1.0 - (distance / maxDistance) × 0.5
  - Verification: Opacity ranges 0.5-1.0, matches distance
  - Dependencies: 1.3, 6.2

- [x] 6.4 Implement scale calculation
  - Function: calculateScale(opacity)
  - Range: 1.0 to 1.05
  - Formula: 1.0 + (1.0 - opacity) × 0.1
  - Verification: Scale increases as opacity decreases
  - Dependencies: 1.3, 6.3

- [x] 6.5 Implement velocity-based spine stretching
  - Function: calculateSpineHeight(baseHeight, velocity, stretchFactor)
  - Stretch: baseHeight + (velocity × stretchFactor)
  - Max: baseHeight × 2.0 (capped)
  - Verification: Spine height correlates to velocity
  - Dependencies: 1.3, 2.4

## 7. Testing and Validation

- [x] 7.1 Test component rendering
  - Render with sample 5-event data
  - Verify: all events render, spine visible, markers present
  - Verification: No console errors, component mounts correctly
  - Dependencies: 4.1, 5.1

- [x] 7.2 Test scroll responsiveness
  - Scroll through timeline in browser
  - Verify: events fade/scale smoothly
  - Verify: spine height changes on scroll velocity
  - Verify: no jank or dropped frames
  - Verification: 60 FPS on modern hardware
  - Dependencies: 7.1, 4.2, 4.3

- [x] 7.3 Test momentum effect
  - Scroll rapidly (flick) on desktop
  - Verify: spine stretches noticeably
  - Verify: spring-like bounce effect
  - Verify: deceleration over 400-600ms
  - Verification: Momentum effect visually apparent
  - Dependencies: 7.2, 2.4

- [x] 7.4 Test mobile responsiveness
  - View on mobile device (< 768px) or DevTools mobile emulation
  - Verify: single column layout
  - Verify: spine hidden or minimal
  - Verify: events readable and interactive
  - Verify: no horizontal scroll
  - Verification: Mobile layout correct and usable
  - Dependencies: 7.1, 3.6

- [x] 7.5 Test marker interactions
  - Hover over markers on desktop
  - Verify: scale to 1.5, cursor pointer
  - Tab to markers (keyboard navigation)
  - Verify: focus ring visible
  - Verification: Interactions work smoothly
  - Dependencies: 7.1, 5.6

- [x] 7.6 Test event visibility and animation
  - Scroll to specific event
  - Verify: event becomes visible (≥ 50% in viewport)
  - Verify: marker scale changes to 1.2
  - Verify: content opacity becomes 1.0
  - Verify: pulse animation plays once
  - Verification: Visibility and animations trigger correctly
  - Dependencies: 7.2, 5.7

- [x] 7.7 Test performance metrics
  - Run Lighthouse Performance audit
  - Measure: frame rate during scroll (DevTools)
  - Verify: consistent 60 FPS
  - Verify: no Long Tasks (>50ms)
  - Measurement: CPU usage < 10% during active scroll
  - Dependencies: 7.2, 3.7

- [x] 7.8 Test browser compatibility
  - Test in: Chrome, Firefox, Safari, Edge
  - Verify: component renders correctly in all browsers
  - Verify: animations smooth in all browsers
  - Verify: responsive layout works
  - Verification: No console errors in any browser
  - Dependencies: 7.1-7.7

- [x] 7.9 Test with various event counts
  - Test with 5, 13, 25 events
  - Verify: layout adapts correctly
  - Verify: scrolling smooth regardless of count
  - Verify: no memory leaks with many events
  - Verification: Scales well to larger datasets
  - Dependencies: 7.1, 7.2

- [x] 7.10 Test custom props
  - Pass custom: height, spineWidth, spineColor, stretchFactor, markerSize
  - Verify: all props apply correctly
  - Verify: no prop validation errors
  - Verification: Component respects all customization props
  - Dependencies: 4.6, 5.1

## 8. Documentation and Integration

- [x] 8.1 Create component documentation
  - File: `ScrollTimeline/README.md`
  - Include: component description, props interface, usage example, styling customization
  - Verification: Documentation is comprehensive and clear
  - Dependencies: All previous tasks complete

- [x] 8.2 Create usage example page
  - File: `resources/js/pages/TimelineShowcase.tsx` (optional)
  - Or: integrate into Projects or About page
  - Shows: working example with 13-event timeline data
  - Verification: Example renders correctly and demonstrates features
  - Dependencies: 8.1

- [x] 8.3 Export component from index
  - File: `ScrollTimeline/index.ts`
  - Export: ScrollTimeline component, types, hooks
  - Verification: Component importable from `@/components/ScrollTimeline`
  - Dependencies: 4.1, 5.1, 1.2

- [x] 8.4 Run full build and validate
  - npm run build
  - Verify: no TypeScript errors
  - Verify: no CSS errors
  - Verify: component compiles correctly
  - Verification: Build succeeds with no warnings
  - Dependencies: 8.3

- [x] 8.5 Lighthouse and SEO validation
  - Run Lighthouse audit on page with timeline
  - Verify: Performance score ≥ 90
  - Verify: Accessibility score ≥ 90
  - Verify: no Core Web Vitals issues
  - Measurement: CLS (Cumulative Layout Shift) < 0.1
  - Dependencies: 7.7, 8.4

## Workflow Follow-up

- After all tasks complete and tests pass, run `openspec status --change "scroll-timeline-component"` to mark complete
- Archive the change once validation passes: `openspec archive --change "scroll-timeline-component"`
