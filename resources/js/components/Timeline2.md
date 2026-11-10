# Timeline2 Component Documentation

## Overview

Timeline2 is an elegant, scroll-driven timeline component with advanced SVG animations and visual effects. It provides a sophisticated way to display chronological events with smooth, velocity-responsive animations that create an engaging user experience.

## Features

- **Scroll-Driven Animations**: All animations synchronize with scroll position and velocity
- **SVG Connectors**: Animated connector lines between items and central spine with draw animations
- **Enhanced Spine**: Gradient-filled spine with animated glow effects
- **Item Glows**: Dynamic glow effects on active items that scale with scroll velocity
- **Gradient Overlays**: Smooth gradient transitions for inactive items
- **Marker Badges**: Interactive markers with animated SVG check marks
- **Mobile Optimized**: Responsive design with mobile-specific optimizations
- **Accessibility**: Full keyboard navigation and screen reader support with reduced-motion preferences
- **Performance**: Optimized rendering using CSS and vanilla JavaScript (no external animation libraries)

## Usage

### Basic Example

```typescript
import Timeline2, { type Timeline2Item } from "@/components/Timeline2";

const items: Timeline2Item[] = [
  {
    id: "2020",
    year: "2020",
    title: "Project Alpha",
    description: "Launched flagship product with 100k users",
  },
  {
    id: "2021",
    year: "2021",
    title: "Series A Funding",
    description: "Raised $5M in Series A funding",
  },
  // ... more items
];

export default function Page() {
  return (
    <Timeline2
      items={items}
      eyebrow="Our Journey"
      title="Company Timeline"
      intro="Explore the key milestones in our company's growth"
    />
  );
}
```

### Props

```typescript
type Timeline2Props = {
  items: Timeline2Item[];           // Array of timeline events
  eyebrow?: string;                 // Small text above title (default: "Chronicle")
  title?: string;                   // Main heading (default: "Selected work")
  intro?: string;                   // Introductory text below title
};

type Timeline2Item = {
  id: string;                       // Unique identifier
  year: string;                     // Year or date to display
  title: string;                    // Event title
  description: string;              // Event description
};
```

## Animation System

### Scroll Tracking

The component tracks scroll position and calculates velocity using an Exponential Moving Average (EMA) smoothing algorithm for smooth, responsive animations.

```typescript
// Velocity is calculated with EMA smoothing
smoothVelocity = instantVelocity * 0.25 + smoothVelocity * 0.75;
```

### Animation Values

Each item's animation is calculated based on its distance from the current scroll position:

- **Opacity**: Fades in/out as items approach/leave active area
- **Scale**: Items scale up when active, down when scrolling past
- **Transform**: 3D perspective transforms for depth effect
- **Blur**: Increases blur for off-screen items
- **Glow**: Dynamic glow intensity based on scroll velocity

### Spine Animation

The central spine grows from top to bottom as the user scrolls:

```typescript
// Spine height proportional to scroll progress
height = `${spineProgress * 100}%`;

// Spine head height scales with velocity
headHeight = 6 + Math.abs(velocity) * 2;
```

### SVG Connectors

Connector lines between items and spine use SVG `stroke-dasharray` for draw animations:

```typescript
// Connector draws as scroll progresses
const normalizedDistance = distance * 1.3;
const targetDashOffset = -normalizedDistance + normalizedDistance * (progress * 2);
path.style.strokeDashoffset = `${targetDashOffset}px`;
```

## Glow Effects

Active items have velocity-responsive glow effects:

```typescript
// Glow intensity increases with scroll velocity
const glowIntensity = Math.min(Math.abs(velocity) * 0.01, 1.5);
const glowBlur = 15 + glowIntensity * 30;
const glowSpread = 10 + glowIntensity * 15;

// Applied as box-shadow
boxShadow = `0 0 ${glowBlur}px rgba(102, 126, 234, 0.5)`;
```

## CSS Customization

The component uses CSS custom properties for theming:

```css
:root {
  --timeline2-bg: #0f0f0f;                    /* Background color */
  --timeline2-fg: #ffffff;                    /* Foreground/text color */
  --timeline2-accent: #667eea;                /* Primary accent color */
  --timeline2-accent-light: #8ba3f5;          /* Light accent variant */
  --timeline2-border: rgba(255, 255, 255, 0.1); /* Border color */
  --timeline2-text-muted: rgba(255, 255, 255, 0.6); /* Muted text */
  --timeline2-spine-width: 2px;               /* Central spine width */
  --timeline2-marker-size: 12px;              /* Marker button size */
}
```

### Custom Styling Example

```css
/* Override default colors */
.timeline2-root {
  --timeline2-accent: #00d4ff;
  --timeline2-accent-light: #00f0ff;
  --timeline2-bg: #1a1a2e;
}

/* Customize item styling */
.timeline2-item {
  border-radius: 20px; /* More rounded corners */
}

/* Adjust spine width */
.timeline2-root {
  --timeline2-spine-width: 4px; /* Thicker spine */
}
```

## Performance Optimization

### Visibility Culling

SVG connectors are only rendered for items within 2.5 units of the active item, improving performance with large datasets.

### GPU Acceleration

Key animations use CSS transforms and `will-change` properties for GPU acceleration:

```css
.timeline2-svg-connector,
.timeline2-spine,
.timeline2-item-badge {
  will-change: transform, opacity, filter;
  transform: translateZ(0);      /* Force GPU acceleration */
  backface-visibility: hidden;   /* Improve rendering performance */
}
```

### Responsive Breakpoints

- **Desktop** (> 768px): Full SVG connector rendering
- **Tablet** (768px - 480px): Simplified connectors
- **Mobile** (< 480px): Mobile-optimized layout

## Accessibility

### Keyboard Navigation

- **Tab**: Navigate through marker buttons
- **Enter/Space**: Jump to timeline event
- **Reduced Motion**: All animations disable with `prefers-reduced-motion: reduce`

### Screen Reader Support

- Semantic HTML structure with proper heading hierarchy
- ARIA labels on all interactive elements
- SVG elements marked with `aria-hidden="true"` where appropriate

### Color Contrast

All text meets WCAG AA contrast ratio requirements (4.5:1 minimum).

## Mobile Considerations

### Layout Adjustments

On mobile devices (< 768px):
- Items take full width for better readability
- Reduced padding and margins
- Smaller badge indicators
- Optimized spacing for touch interactions

### Performance

- SVG connector rendering is optimized for mobile devices
- Animations maintain 60 FPS on modern mobile hardware
- Smooth scroll tracking without jank

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Technical Details

### Component Structure

```
Timeline2 (Main component)
├── Header Section
│   ├── Eyebrow
│   ├── Title
│   └── Intro
├── Timeline2SVGLayer (SVG connectors and effects)
├── Spine Container
│   ├── Spine (gradient-filled)
│   └── Spine Head (moving marker)
├── Marker Buttons (with SVG check marks)
└── Items Stack
    ├── Item 1 (with gradient overlay)
    ├── Item 2
    └── ...
```

### Hooks Used

- `useEffect`: Scroll tracking, resize observation
- `useRef`: DOM measurements and animations
- `useState`: Animation state management
- `useId`: Unique identifiers for accessibility

## API Reference

### Exported Types

```typescript
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

export type AnimationState = {
  progress: number;    // 0-1, scroll position progress
  velocity: number;    // pixels per second
  activeIndex: number; // current active item index
};

export type SVGConnectorPosition = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};
```

## Examples

### Custom Timeline Data

```typescript
const TIMELINE_EVENTS: Timeline2Item[] = [
  {
    id: "2015",
    year: "2015",
    title: "Founded",
    description: "Started as a side project in a garage",
  },
  {
    id: "2018",
    year: "2018",
    title: "First Product",
    description: "Launched web app with 1000 beta users",
  },
  {
    id: "2020",
    year: "2020",
    title: "1M Users",
    description: "Reached 1 million active users",
  },
  {
    id: "2023",
    year: "2023",
    title: "Global Expansion",
    description: "Expanded to 50 countries worldwide",
  },
];
```

### Minimal Implementation

```typescript
export default function MinimalTimeline() {
  return (
    <Timeline2
      items={[
        { id: "1", year: "2020", title: "Event 1", description: "Description" },
        { id: "2", year: "2021", title: "Event 2", description: "Description" },
      ]}
    />
  );
}
```

## Troubleshooting

### Connectors not appearing

- Check that items are visible in viewport
- Verify SVG layer is being rendered (check browser console for errors)
- Ensure CSS for `.timeline2-svg-connector` is loaded

### Animations not smooth

- Check browser performance (F12 DevTools > Performance tab)
- Reduce dataset size if rendering 100+ items
- Verify hardware acceleration is enabled (CSS `will-change`)

### Mobile layout issues

- Test in actual mobile devices, not just browser dev tools
- Check viewport meta tag in HTML head
- Verify CSS media queries are being applied

## Contributing

When modifying the Timeline2 component:

1. Update `Timeline2.types.ts` if adding new types
2. Update this documentation file for user-facing changes
3. Add unit tests for new calculation functions
4. Test on mobile devices before merging
5. Verify accessibility with keyboard and screen readers

## License

Part of the Marc Boreu Portfolio project.
