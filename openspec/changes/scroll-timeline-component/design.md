# Design: Scroll Timeline Component

## Architecture Overview

```
┌───────────────────────────────────────────────────────────────────┐
│  ScrollTimeline Component (React + TypeScript + CSS)             │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ ScrollTimeline.tsx (Main Container)                         │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ • State management: scroll position, velocity, visibility   │ │
│  │ • Intersection Observer: detect event visibility            │ │
│  │ • RequestAnimationFrame loop: animation updates             │ │
│  │ • Props: events[], containment, styling config              │ │
│  │ • Renders: spine container + event list                     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Spine SVG/Element (Animated Height)                         │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ • Vertical line centered                                     │ │
│  │ • Height: baseHeight + (velocity × stretchFactor)            │ │
│  │ • CSS transition for smooth height changes                   │ │
│  │ • GPU accelerated via transform (if possible)                │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Events Container (Scrollable)                               │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ TimelineEvent.tsx (Individual Event)                │  │ │
│  │  ├──────────────────────────────────────────────────────┤  │ │
│  │  │ • Props: event data, position, visibility, side     │  │ │
│  │  │ • Left Layout:       [Content] ─ Marker ─ Spine     │  │ │
│  │  │ • Right Layout:      Spine ─ Marker ─ [Content]     │  │ │
│  │  │                                                      │  │ │
│  │  │ ┌──────────────────────────────────────────────┐   │  │ │
│  │  │ │ Year Label (above marker)                   │   │  │ │
│  │  │ │ Number (01, 02, etc) - prominent           │   │  │ │
│  │  │ │ Event Marker (Animated Dot)                │   │  │ │
│  │  │ │  └─ Scale: 1.0 default, 1.2 visible,      │   │  │ │
│  │  │ │     1.5 hover                              │   │  │ │
│  │  │ └──────────────────────────────────────────────┘   │  │ │
│  │  │                                                      │  │ │
│  │  │ ┌──────────────────────────────────────────────┐   │  │ │
│  │  │ │ Content (Title + Description)               │   │  │ │
│  │  │ │  └─ Opacity: 0.5-1.0 based on position     │   │  │ │
│  │  │ │  └─ Transform: translateY + scale          │   │  │ │
│  │  │ │  └─ Animation: fade-in/out on scroll       │   │  │ │
│  │  │ └──────────────────────────────────────────────┘   │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                                                              │ │
│  │  [Repeat for each event in array]                           │ │
│  │                                                              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Hooks & Utilities                                           │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ • useScrollTracking(): scroll position + velocity           │ │
│  │ • useIntersectionObserver(): event visibility              │ │
│  │ • useAnimationFrame(): animation loop lifecycle             │ │
│  │ • useMomentumPhysics(): spring physics for spine           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Styling (ScrollTimeline.css)                                │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ • Container: overflow-y: auto; position: relative           │ │
│  │ • Spine: position: absolute; CSS transitions               │ │
│  │ • Events: display: flex; alternating layout via nth-child  │ │
│  │ • Markers: position absolute; scale animations             │ │
│  │ • Responsive: media queries for mobile/tablet             │ │
│  │ • Animations: keyframes for pulse, fade, slide             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
ScrollTimeline
├── ContainerDiv (scroll container)
│   ├── Spine (SVG or div, absolutely positioned)
│   └── EventsList
│       ├── TimelineEvent
│       │   ├── YearLabel
│       │   ├── EventMarker
│       │   └── ContentArea
│       │       ├── NumberBadge
│       │       ├── Title
│       │       └── Description
│       ├── TimelineEvent
│       │   └── [same structure]
│       └── ... (repeat for each event)
```

## TypeScript Interfaces

```typescript
// Event data structure
interface TimelineEventData {
  id: string;
  year: number;
  number: string; // "01", "02", ..., "13"
  title: string;
  description: string;
  side?: 'left' | 'right'; // if undefined, alternate automatically
}

// Scroll state
interface ScrollState {
  scrollPosition: number; // 0-1, relative to container height
  scrollTop: number; // pixels
  scrollPercentage: number; // scroll / (containerHeight - viewportHeight)
  velocity: number; // pixels per frame
  isScrolling: boolean;
}

// Event visibility and animation state
interface EventAnimationState {
  isVisible: boolean; // ≥ 50% in viewport
  distanceFromCenter: number; // pixels from viewport center
  opacity: number; // 0.5-1.0
  scale: number; // 1.0-1.05
  translateY: number; // pixels
}

// Component props
interface ScrollTimelineProps {
  events: TimelineEventData[];
  height?: string | number; // container height, default: '100vh'
  spineWidth?: number; // default: 2
  spineColor?: string; // default: '#333'
  stretchFactor?: number; // default: 0.5
  markerSize?: number; // default: 12
  markerColor?: string; // default: spineColor
  responsive?: boolean; // default: true
  className?: string;
  style?: React.CSSProperties;
}
```

## Hook Architecture

### 1. useScrollTracking Hook

**Purpose**: Track scroll position and velocity

```typescript
function useScrollTracking(containerRef: RefObject<HTMLDivElement>) {
  const [scrollState, setScrollState] = useState<ScrollState>({...})
  
  useEffect(() => {
    let animationFrameId: number
    let previousScrollTop = 0
    let previousTime = Date.now()
    
    const updateScroll = () => {
      const container = containerRef.current
      if (!container) return
      
      const currentScrollTop = container.scrollTop
      const currentTime = Date.now()
      const deltaTime = currentTime - previousTime
      
      // Calculate velocity (pixels per millisecond)
      const velocity = (currentScrollTop - previousScrollTop) / deltaTime
      
      // Normalize scroll to 0-1
      const scrollPercentage = currentScrollTop / container.scrollHeight
      
      setScrollState({
        scrollTop: currentScrollTop,
        scrollPosition: scrollPercentage,
        velocity: velocity,
        isScrolling: Math.abs(velocity) > 0.01
      })
      
      previousScrollTop = currentScrollTop
      previousTime = currentTime
      
      animationFrameId = requestAnimationFrame(updateScroll)
    }
    
    animationFrameId = requestAnimationFrame(updateScroll)
    
    return () => cancelAnimationFrame(animationFrameId)
  }, [])
  
  return scrollState
}
```

### 2. useIntersectionObserver Hook

**Purpose**: Detect event visibility

```typescript
function useIntersectionObserver(eventRefs: Map<string, HTMLElement>) {
  const [visibleEvents, setVisibleEvents] = useState<Set<string>>(new Set())
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newVisible = new Set(visibleEvents)
        entries.forEach((entry) => {
          const eventId = entry.target.getAttribute('data-event-id')
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            newVisible.add(eventId)
          } else {
            newVisible.delete(eventId)
          }
        })
        setVisibleEvents(newVisible)
      },
      { threshold: 0.5 }
    )
    
    eventRefs.forEach((el) => observer.observe(el))
    
    return () => {
      eventRefs.forEach((el) => observer.unobserve(el))
    }
  }, [eventRefs])
  
  return visibleEvents
}
```

### 3. useAnimationFrame Hook

**Purpose**: Manage animation loop lifecycle

```typescript
function useAnimationFrame(callback: (deltaTime: number) => void) {
  const animationFrameId = useRef<number>()
  const lastTimeRef = useRef<number>(Date.now())
  
  useEffect(() => {
    const animate = () => {
      const currentTime = Date.now()
      const deltaTime = currentTime - lastTimeRef.current
      
      callback(deltaTime)
      
      lastTimeRef.current = currentTime
      animationFrameId.current = requestAnimationFrame(animate)
    }
    
    animationFrameId.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [callback])
}
```

### 4. useMomentumPhysics Hook

**Purpose**: Calculate spring physics for spine stretching

```typescript
function useMomentumPhysics(
  velocity: number,
  baseHeight: number,
  stretchFactor: number
) {
  const [spineHeight, setSpineHeight] = useState(baseHeight)
  
  useEffect(() => {
    // Clamp spine height based on velocity
    const stretchAmount = Math.abs(velocity * stretchFactor)
    const maxHeight = baseHeight * 2
    const targetHeight = Math.min(baseHeight + stretchAmount, maxHeight)
    
    setSpineHeight(targetHeight)
  }, [velocity, baseHeight, stretchFactor])
  
  return spineHeight
}
```

## CSS Architecture

**File**: `ScrollTimeline.css`

```css
/* Container */
.scroll-timeline {
  position: relative;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth; /* optional */
  contain: layout paint; /* CSS containment for performance */
}

/* Spine */
.timeline-spine {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 100%;
  background-color: #333;
  opacity: 0.8;
  transition: height 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: height;
}

/* Events container */
.timeline-events {
  position: relative;
  z-index: 10;
}

/* Individual event */
.timeline-event {
  display: flex;
  align-items: center;
  margin: 80px 0; /* spacing between events */
  min-height: 100px;
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
  will-change: transform, opacity;
}

/* Event on left side */
.timeline-event:nth-child(odd) {
  flex-direction: row-reverse;
  padding-right: 50%;
}

/* Event on right side */
.timeline-event:nth-child(even) {
  flex-direction: row;
  padding-left: 50%;
}

/* Event marker */
.timeline-marker {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #333;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  will-change: transform;
  z-index: 20;
}

.timeline-marker:hover {
  transform: translateX(-50%) scale(1.5);
}

.timeline-event.visible .timeline-marker {
  transform: translateX(-50%) scale(1.2);
}

/* Marker pulse animation */
@keyframes pulse {
  0%, 100% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.3); }
}

.timeline-marker.pulse {
  animation: pulse 0.8s ease-out;
}

/* Event content */
.timeline-content {
  flex: 1;
  padding: 0 48px;
  opacity: 0.8;
  transform: translateY(0);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}

.timeline-event.visible .timeline-content {
  opacity: 1;
}

/* Year label */
.timeline-year {
  font-size: 14px;
  font-weight: bold;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

/* Event number */
.timeline-number {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  line-height: 1;
  margin-bottom: 12px;
}

/* Event title */
.timeline-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
}

/* Event description */
.timeline-description {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  max-width: 400px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .timeline-spine {
    left: 20px; /* move spine to left edge */
    opacity: 0.3; /* make less prominent */
  }
  
  .timeline-event {
    flex-direction: column;
    align-items: flex-start;
    padding-left: 60px !important;
    padding-right: 0 !important;
    margin: 40px 0;
  }
  
  .timeline-marker {
    left: 0;
    transform: translateX(-50%);
  }
  
  .timeline-content {
    padding-left: 0;
    padding-right: 20px;
  }
  
  .timeline-title {
    font-size: 16px;
  }
  
  .timeline-description {
    font-size: 14px;
  }
}

/* Fade and slide animations */
@keyframes fadeSlideIn {
  from {
    opacity: 0.5;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.timeline-event.visible {
  animation: fadeSlideIn 0.6s ease-out;
}
```

## Data Flow

### Initialization
1. Parent renders `<ScrollTimeline events={data} />`
2. Component initializes refs for container and events
3. Intersection Observer set up with threshold 0.5
4. Animation frame loop starts

### On Scroll
1. Animation frame loop updates `scrollState`
2. `scrollState` triggers re-render of spine height
3. Spine element style updates via CSS transition
4. Events fade/scale based on viewport position
5. Markers scale based on visibility

### On Event Visibility Change
1. Intersection Observer fires entry change
2. `visibleEvents` Set updates
3. Events with visibility gain animation triggers
4. Marker scale animates to 1.2
5. Content fades and slides

## Performance Considerations

1. **Scroll loop throttling**: Only recalculate on `requestAnimationFrame` (not on scroll event)
2. **GPU acceleration**: Use `transform` and `opacity` for animations (compositable properties)
3. **CSS containment**: `contain: layout paint` isolates layout calculations
4. **Observer cleanup**: Remove Intersection Observer callbacks when component unmounts
5. **Memoization**: Memoize event renderers to avoid unnecessary re-renders

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 13+)
- Mobile: Responsive layout, touch-friendly
- IE11: Graceful degradation (no Intersection Observer, fallback to static layout)
