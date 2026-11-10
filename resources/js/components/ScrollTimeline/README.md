# ScrollTimeline Component

High-performance, scroll-driven timeline component for React + TypeScript. Features dynamic spine stretching, event animations, momentum effects, and full responsiveness — all with vanilla CSS and zero animation libraries.

## 🎯 Features

- **Scroll-linked animations** - Events animate based on scroll position using native Web APIs
- **Momentum effect** - Dynamic spine stretching with spring physics on fast scrolls
- **Full responsiveness** - Mobile (single column), tablet, and desktop (alternating layout)
- **Zero dependencies** - Pure React + TypeScript + CSS (no GSAP, Framer Motion, or animation libraries)
- **Accessibility** - Semantic HTML, keyboard navigation, screen reader support
- **Performance** - 60 FPS animations, GPU acceleration, optimized rendering
- **Customizable** - Height, spine width, colors, stretch factor, and more
- **TypeScript** - Fully typed interfaces for all props and data

## 📦 Installation

The component is part of the portfolio codebase. Import it from:

```typescript
import { ScrollTimeline } from '@/components/ScrollTimeline';
```

## 🚀 Quick Start

```tsx
import { ScrollTimeline } from '@/components/ScrollTimeline';
import type { TimelineEventData } from '@/components/ScrollTimeline';

const events: TimelineEventData[] = [
  {
    id: '2014',
    year: 2014,
    number: '01',
    title: 'The Beginning',
    description: 'Started the journey with a single idea...',
  },
  {
    id: '2015',
    year: 2015,
    number: '02',
    title: 'First Milestone',
    description: 'Achieved initial goals and expanded team...',
  },
  // ... more events
];

export default function TimelinePage() {
  return (
    <ScrollTimeline
      events={events}
      height="100vh"
      spineColor="#333"
      markerSize={12}
      stretchFactor={0.5}
    />
  );
}
```

## 📋 Props

### `ScrollTimelineProps`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `events` | `TimelineEventData[]` | Required | Array of timeline events to display |
| `height` | `string \| number` | `'100vh'` | Container height (CSS value or pixels) |
| `spineWidth` | `number` | `2` | Spine vertical line width in pixels |
| `spineColor` | `string` | `'#333'` | Spine color (any CSS color value) |
| `stretchFactor` | `number` | `0.5` | Multiplier for velocity-based spine stretching |
| `markerSize` | `number` | `12` | Event marker circle diameter in pixels |
| `markerColor` | `string` | (same as spineColor) | Marker circle color |
| `responsive` | `boolean` | `true` | Enable responsive design (mobile, tablet, desktop) |
| `className` | `string` | `''` | Additional CSS class for container |
| `style` | `React.CSSProperties` | `{}` | Inline styles for container |

## 📊 Event Data Structure

```typescript
interface TimelineEventData {
  id: string;              // Unique identifier
  year: number;           // Event year
  number: string;         // Event number ("01", "02", etc.)
  title: string;          // Event title
  description: string;    // Event description
  side?: 'left' | 'right'; // Optional: force specific side (auto-alternates if omitted)
}
```

## 🎨 Styling & Customization

### CSS Classes

The component uses CSS classes for styling. Key classes:

- `.timeline-container` - Main container
- `.timeline-spine` - Vertical line connecting events
- `.timeline-event` - Individual event wrapper
- `.timeline-marker` - Circular marker on spine
- `.timeline-content` - Event content (title, description)

### Custom Styling

Override default styles by targeting these classes:

```css
.timeline-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.timeline-marker {
  background: #667eea;
  border-color: #764ba2;
}
```

### Responsive Breakpoints

- **Desktop** (> 1024px): Full alternating layout with centered spine
- **Tablet** (768-1024px): Narrow alternating layout
- **Mobile** (< 768px): Single column, spine on left edge

## 🪝 Custom Hooks

The component exports several reusable hooks:

### `useScrollTracking`

Track scroll position and velocity:

```typescript
const scrollState = useScrollTracking(containerRef);
// Returns: { scrollTop, scrollPosition, scrollPercentage, velocity, isScrolling }
```

### `useIntersectionObserver`

Detect visible elements:

```typescript
const visibleEvents = useIntersectionObserver(eventRefsMap, 0.5);
// Returns: Set<string> of visible event IDs
```

### `useMomentumPhysics`

Calculate spine height with spring physics:

```typescript
const spineHeight = useMomentumPhysics(baseHeight, velocity, stretchFactor);
```

### `usePulseAnimation`

Trigger pulse animation on visibility:

```typescript
const shouldPulse = usePulseAnimation(eventId, isVisible);
```

## 🔧 Utility Functions

The component exports calculation utilities:

```typescript
import {
  calculateOpacity,
  calculateScale,
  calculateSpineHeight,
  // ... and more
} from '@/components/ScrollTimeline';
```

## ♿ Accessibility

- **Semantic HTML** - Uses proper heading levels and list structures
- **ARIA Labels** - Events have descriptive aria-labels
- **Keyboard Navigation** - Markers are focusable with Tab key
- **Screen Readers** - Announcements for scroll state changes
- **High Contrast** - Respects `prefers-contrast` media query
- **Reduced Motion** - Disables animations for users with `prefers-reduced-motion`

## 🎬 Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 Performance

- **60 FPS scrolling** - Uses `requestAnimationFrame` for smooth animations
- **GPU acceleration** - Hardware-accelerated transforms and opacity
- **Efficient rendering** - `React.memo` and ref-based updates minimize re-renders
- **Lazy intersection** - Only observes visible events
- **CSS containment** - Isolates layout calculations for performance

### Lighthouse Targets

- **Performance**: ≥ 90
- **Accessibility**: ≥ 90
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

## 🚀 Advanced Usage

### Multiple Timelines

You can render multiple timeline components on the same page:

```tsx
<div>
  <ScrollTimeline events={timelineA} height="100vh" spineColor="#667eea" />
  <ScrollTimeline events={timelineB} height="100vh" spineColor="#764ba2" />
</div>
```

### Dynamic Events

Update events dynamically by passing new data:

```tsx
const [events, setEvents] = useState<TimelineEventData[]>(initialEvents);

// Add new event
const addEvent = (newEvent: TimelineEventData) => {
  setEvents([...events, newEvent]);
};
```

### Custom Animations

Use exported utilities to build custom animations:

```typescript
const opacity = calculateOpacity(distanceFromCenter, maxDistance);
const scale = calculateScale(opacity);
const translateY = calculateTranslateY(distanceFromCenter, maxDistance);
```

## 🐛 Troubleshooting

### Events not animating smoothly

- Check that container has defined height
- Ensure `overflow-y: auto` on container
- Verify event elements have proper refs

### Spine not stretching

- Verify `spineHeight` is being calculated (check Redux/state)
- Check CSS transitions on `.timeline-spine`
- Ensure scroll velocity is being measured (check `useScrollTracking`)

### Mobile layout issues

- Test with DevTools mobile emulation
- Verify viewport meta tag in HTML
- Check media query breakpoints in CSS

## 📝 Browser DevTools

To debug animations:

1. Open DevTools → Performance
2. Start recording
3. Scroll through timeline
4. Stop recording
5. Check for consistent 60 FPS (jank indicates issues)

## 📚 Related Files

- Component: `ScrollTimeline.tsx`
- Event component: `TimelineEvent.tsx`
- Styles: `ScrollTimeline.css`
- Hooks: `hooks/` directory
- Types: `types.ts`
- Utilities: `utils/calculations.ts`

## 📄 License

Part of the personal portfolio project.

## 🤝 Contributing

To contribute improvements:

1. Ensure all Lighthouse scores remain ≥ 90
2. Maintain TypeScript type safety
3. Test on multiple browsers and devices
4. Update this README with new features
5. Add accessibility attributes for new elements

---

**Last Updated:** November 10, 2026
**Version:** 1.0.0
