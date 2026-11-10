# Component Architecture and Layout

## Requirements

### R1: Component Structure
The component must follow a clear React architecture with proper TypeScript types.

**R1.1 - Main ScrollTimeline component**
- Props interface: `ScrollTimelineProps` with events array, optional styling
- Events: array of `TimelineEvent` objects with: id, year, number (01-13), title, description, side ('left'|'right'|'auto')
- Renders container div with role="region" for accessibility
- Manages scroll state and animation frame loop
- Verification: Component accepts events array and renders without errors

**R1.2 - TimelineEvent component**
- Props interface: `TimelineEventProps` with event data, position info
- Receives: event data, calculated position (0-1), is visible, spine height
- Renders: year label, event marker (dot), content (title + description)
- Side determined by: explicit prop or alternating pattern (even left, odd right)
- Verification: Component renders event with correct content and layout

**R1.3 - TypeScript interfaces**
```typescript
interface TimelineEventData {
  id: string;
  year: number;
  number: string; // "01", "02", etc
  title: string;
  description: string;
  side?: 'left' | 'right';
}

interface TimelineState {
  scrollPosition: number; // 0-1 (percentage)
  scrollVelocity: number; // pixels per frame
  containerHeight: number;
  contentHeight: number;
}
```

**R1.4 - Module organization**
- `ScrollTimeline/index.tsx` - main component export
- `ScrollTimeline/TimelineEvent.tsx` - event component
- `ScrollTimeline/ScrollTimeline.tsx` - container component
- `ScrollTimeline/usScrollTracking.ts` - scroll state hook
- `ScrollTimeline/ScrollTimeline.css` - all styling
- `ScrollTimeline/types.ts` - TypeScript interfaces

### R2: Visual Layout
The component must render a vertical timeline with specific visual proportions.

**R2.1 - Vertical spine**
- Renders as vertical line (e.g., 2px width, centered)
- Extends full height of container
- Height changes dynamically based on scroll velocity (stretching effect)
- Color: configurable, default to brand color (e.g., #333)
- Position: centered horizontally in desktop view, hidden on mobile

**R2.2 - Event markers**
- Circular dots at intersection of spine and event content
- Size: 12px diameter (configurable)
- Color: matches spine color
- Scale effect: grows on hover/when visible
- Position: fixed to spine center, positioned based on event index

**R2.3 - Event content layout**
- Desktop (> 768px): alternating left/right layout with spine in center
  - Even events (0, 2, 4...): content on left, marker on right side of spine
  - Odd events (1, 3, 5...): content on right, marker on left side of spine
- Tablet (768-1024px): content alternates, spine visible
- Mobile (< 768px): single column layout, all content stacked, spine hidden
- Horizontal spacing: configurable gap between content and spine (e.g., 48px)

**R2.4 - Year/Number labels**
- Year rendered above title (e.g., "2014")
- Number rendered separately (e.g., "01", "02")
- Number displayed prominently near event marker
- Format: Number aligned with event marker, Year above content

### R3: Scroll Tracking
The component must track scroll position and velocity.

**R3.1 - Scroll position calculation**
- Container: captures scroll within component viewport
- Position normalized to 0-1 range (0 = top of timeline, 1 = bottom)
- Updates on every scroll event
- Throttled/debounced based on requestAnimationFrame

**R3.2 - Scroll velocity calculation**
- Velocity: measured in pixels per frame
- Calculated as: (current scroll position - previous scroll position) / delta time
- Used to determine spine stretching intensity
- Reset when scroll stops (deceleration over 500ms)

**R3.3 - Event visibility detection**
- Uses Intersection Observer API to detect visible events
- Marks events as visible when >= 50% in viewport
- Triggers animations for visible events
- Verification: Events become visible/invisible as viewport scrolls

**R3.4 - Requestivity frame loop**
- Main animation loop using requestAnimationFrame
- Updates spine height based on velocity
- Updates event positions based on scroll
- Runs continuously during scroll, stops when idle
- Verification: FPS stays at 60 during scroll

### R4: Animation Mechanics
The component must implement scroll-driven animations without libraries.

**R4.1 - Spine stretching effect**
- Base height: full container height
- Stretch multiplier: velocity × factor (e.g., velocity × 0.5)
- Max stretch: 2x base height (configurable)
- Animation: CSS transition with configurable duration (e.g., 0.2s easing)
- Formula: `spineHeight = containerHeight + (velocity * stretchFactor)`
- Verification: Spine visibly stretches during fast scroll

**R4.2 - Event position animation**
- Each event positioned based on scroll percentage
- Position offset: (scrollPosition × totalEventCount) * eventSpacing
- Opacity: ramped based on distance from center (fade in/out at edges)
- Scale: slight scale change (0.95-1.05) based on visibility
- Verification: Events animate smoothly as viewport scrolls

**R4.3 - Marker animation**
- Marker scale: 1.0 by default, 1.5 on hover, 1.3 when visible
- Animation: CSS transition (0.3s cubic-bezier)
- Color change: optional pulse effect when event enters viewport
- Verification: Markers scale and animate on interaction

**R4.4 - Content fade and slide**
- Content fades in as it approaches center of viewport
- Opacity: 0.5 at viewport edge, 1.0 at center
- Slide: slight translateY based on distance from center (e.g., ±10px)
- Animation: CSS transform + opacity transition
- Verification: Content fades and slides as viewport scrolls

### R5: Responsive Design
The component must adapt to different screen sizes.

**R5.1 - Mobile layout (< 768px)**
- Single column timeline
- Spine hidden or very thin
- All content stacked vertically
- Markers visible but smaller
- Year and number stacked above content
- Full width content area
- Verification: Mobile layout renders correctly

**R5.2 - Tablet layout (768-1024px)**
- Alternating left/right layout preserved
- Spine visible but narrower viewport
- Content area adjusted for smaller screen
- Markers scaled appropriately
- Verification: Tablet layout maintains readability

**R5.3 - Desktop layout (> 1024px)**
- Full alternating layout with spine centered
- Maximum width container (e.g., 1200px)
- Full visual effects (spine stretching, etc)
- Optimal spacing and proportions
- Verification: Desktop layout matches design

### R6: Accessibility
The component must be accessible to keyboard and screen reader users.

**R6.1 - Semantic HTML**
- Container: `<section role="region" aria-label="Timeline">`
- Events: `<article>` elements
- Proper heading hierarchy (h2, h3)
- Navigation structure: events are in reading order

**R6.2 - Keyboard navigation**
- Events focusable with Tab key
- Focus visible indicator on markers/events
- Enter key can expand event details (if applicable)
- Escape to close expanded content

**R6.3 - Screen reader compatibility**
- aria-label for timeline and events
- aria-current for active event
- aria-expanded for expanded state (if applicable)
- Descriptive alt text for year/number labels

## Scenarios

### S1: Initial Render
**Given**: ScrollTimeline component with 5 events  
**When**: Component mounts  
**Then**:
- Container renders with proper height
- All 5 events visible in document
- Spine renders centered (desktop) or hidden (mobile)
- First event visible in viewport

### S2: Scroll and Reflow
**Given**: Desktop view with timeline fully rendered  
**When**: User scrolls down 20% of viewport  
**Then**:
- Scroll position updates to 0.2
- Second event begins to appear in viewport
- First event begins to fade
- Spine height remains constant (low velocity)
- Markers scale based on visibility

### S3: Fast Scroll (Momentum)
**Given**: Desktop view at middle of timeline  
**When**: User scrolls down rapidly (e.g., 500px in 100ms)  
**Then**:
- Velocity calculated: 500px / frame ≈ 50+ pixels/frame
- Spine stretches to 1.5x-2x height
- Stretch gradually eases back over 500ms
- Events continue to animate smoothly
- Verification: No jank, smooth 60 FPS

### S4: Mobile View
**Given**: Mobile device (< 768px width)  
**When**: Component renders  
**Then**:
- Single column layout renders
- All events stacked vertically
- Spine hidden or very thin
- Content full width
- Markers visible on right side
- Markers remain clickable/interactive

### S5: Hover Marker
**Given**: Desktop view with event marker visible  
**When**: User hovers over event marker  
**Then**:
- Marker scales to 1.5x
- Cursor changes to pointer (if clickable)
- Optional tooltip shows year/number
- Animation smooth (0.3s transition)

### S6: Custom Event Data
**Given**: ScrollTimeline receives 13 events with custom data  
**When**: Component renders  
**Then**:
- All 13 events render correctly
- Numbers cycle 01-13
- Titles and descriptions render from data
- Alternating layout applies correctly
- Spine height adjusts to content

### S7: Responsive Reflow
**Given**: Desktop view at 60% scroll  
**When**: Window resized from 1200px to 600px (desktop to mobile)  
**Then**:
- Layout switches to single column
- Scroll position preserved (user stays at 60%)
- Events reorganize correctly
- No layout shift or jank
- Spine visibility toggles

## Out of Scope (for this spec)

- Horizontal timeline variant
- 3D or perspective effects
- Custom marker shapes beyond circles
- Click/interaction handlers (read-only display in v1)
- Data fetching or API integration
- Animation presets or configurability beyond basic props
- Infinite scroll or lazy loading
