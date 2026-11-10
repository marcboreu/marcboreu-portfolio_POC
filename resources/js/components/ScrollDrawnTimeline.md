# ScrollDrawnTimeline Component

## Overview

**ScrollDrawnTimeline** is a React component that renders a U-shaped timeline that draws itself as you scroll. Inspired by the EmiraIT CodePen design, it features:

- **Scroll-driven SVG animation**: A glowing line that draws along a U-shaped path
- **Responsive layout**:
  - **Landscape (wide)**: Pinned SVG drawing with camera following the line tip
  - **Portrait/Mobile**: Vertical list with animated fill line
- **Pin animations**: Pins "pop in" as the line reaches them
- **Camera system**: Follows the drawing tip and pulls back to reveal the full timeline
- **No GSAP required**: Pure React with vanilla scroll tracking

## Installation

The component is self-contained in `ScrollDrawnTimeline.tsx` with styling in `ScrollDrawnTimeline.css`.

```tsx
import ScrollDrawnTimeline, { type TimelineEntry } from "@/components/ScrollDrawnTimeline";
```

## Usage

### Basic Example

```tsx
const data: TimelineEntry[] = [
  { year: "2020", names: ["Product Launch"] },
  { year: "2021", names: ["Series A Funding"] },
  { year: "2022", names: ["Global Expansion"] },
  { year: "2023", names: ["1M Users"] },
];

export function Page() {
  return (
    <ScrollDrawnTimeline
      entries={data}
      heading="Our Story"
      scrollLength={4.6}
    />
  );
}
```

### Props

```typescript
type ScrollDrawnTimelineProps = {
  entries: TimelineEntry[];      // Array of timeline events
  heading?: string;               // Main title (default: "Timeline")
  scrollLength?: number;          // Screen heights for full animation (default: 4.6)
  smoothScroll?: boolean;         // Enable smooth scrolling (default: true)
};

type TimelineEntry = {
  year: string;                   // Year or date to display
  names: string[];                // List of names/events (dividers auto-added)
};
```

## How It Works

### Layout Splitting

The timeline automatically splits entries into two rows:

- **Top row**: First half of entries, positioned left → right
- **Bottom row**: Second half of entries, positioned right → left

This creates the U-shape that draws as you scroll.

### Scroll-Driven Animation

1. **Scroll Progress** (0 → 1):
   - **0.03–0.83**: Line draws, pins pop in, camera follows
   - **0.80–0.96**: Camera pulls back to show full timeline

2. **Line Drawing**: Uses SVG `stroke-dashoffset` to simulate drawing

3. **Pin Animations**:
   - Scale up with "back-out" easing as line reaches them
   - Opacity fades in
   - Labels slide up

4. **Camera Follow**: Stays ahead of the drawing tip, then transitions to full view

### Responsive Behavior

#### Landscape (640px+ width, landscape orientation)
- SVG drawing is pinned to viewport
- Entries positioned along the U-shaped path
- Camera animates based on scroll

#### Portrait / Mobile
- List view with vertical entries
- White line fills from top as you scroll
- Full accessibility with semantic HTML

## Styling

### CSS Custom Properties

The component uses CSS variables from `:root`:

```css
--gold: #c49a68;           /* Primary color */
--gold-ink: #a7773f;       /* Text inside pins */
--night: #04150c;          /* Dark color */
--cream: #f1e3c8;          /* Light text */
--gold-hi: #f6c33a;        /* Highlight */
--ff-serif: serif font;    /* Heading font */
--ff-sans: sans-serif;     /* Body font */
```

### Customizing Colors

Override the CSS variables in your component:

```css
.scroll-drawn-timeline {
  --gold: #your-color;
  --night: #your-dark-color;
  --cream: #your-light-color;
}
```

## Accessibility

- **Semantic HTML**: Uses `<ol>` and `<li>` for the list
- **Screen Readers**: Hidden `aria-hidden="true"` on SVG, proper labels on interactive elements
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Reduced Motion**: SVG animations disable with `prefers-reduced-motion: reduce`
- **Print Friendly**: List displays properly in print view

## Performance

- **No external libraries**: Pure React + vanilla JavaScript
- **Efficient animations**: Uses CSS transforms and `will-change`
- **Optimized SVG**: Lazy renders only visible elements
- **Scroll throttling**: Uses `requestAnimationFrame` with smooth 60 FPS

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Implementation Details

### SVG Path Calculation

The U-shaped path is hardcoded but scalable:

```typescript
const VW = 1600, VH = 880;  // SVG viewBox
const Y1 = 300, Y2 = 610;   // Top and bottom row Y positions
const X0 = 300, XR = 1500;  // Left and right boundaries
const R = 46;               // Corner radius

// Path: left line → right corner → right line
const TRACK = `M${X0} ${Y1}H${XR}A${R} ${R} 0 0 1 ${XR + R} ${Y1 + R}V${Y2 - R}A${R} ${R} 0 0 1 ${XR} ${Y2}H${XL}`;
```

### Entry Positioning

Entries are evenly spaced along each row:

```typescript
const step = (a, b, n, i) => a + (i * (b - a)) / (n - 1);
// Top row: positions 400 → 1440
// Bottom row: positions 1440 → 200 (right to left)
```

### Camera System

Follows the line tip with look-ahead and smooth zoom:

```typescript
// Get point ahead on the line
const ahead = track.getPointAtLength(len + 170);
// Zoom out during final animation
const z = lerp(Z0, 1, smoothstep(0.8, 0.96, progress));
// Center on ahead point
const cx = clamp(lerp(ahead.x, VW/2, zk), ...);
```

## Troubleshooting

### SVG not showing on landscape

- Check that viewport is landscape and >= 640px wide
- Verify media query in CSS matches component's `CONFIG.wideQuery`
- Check browser DevTools → Elements to see if `.tl-svg` has `display: block`

### Line not drawing

- Ensure scroll container has sufficient height (at least `scrollLength * window.innerHeight`)
- Check that `progress` state is updating (add console.log in useEffect)
- Verify SVG has `viewBox` attribute

### Mobile list not showing

- Component falls back to list on portrait/narrow screens
- Check that `.tl-mobile` is visible in DevTools
- Verify CSS media query is not hiding the list

### Performance issues

- Reduce number of entries (< 30 works best)
- Check if other animations on page are causing issues
- Verify GPU acceleration is enabled (DevTools → Performance)

## Examples

See `ScrollDrawnTimeline.example.tsx` for a complete working example with sample company history data.

## References

- Original CodePen: https://codepen.io/emirait/pen/gOdxQJM (EmiraIT)
- React Hooks: `useEffect`, `useRef`, `useState`, `useMemo`
- SVG APIs: `getPointAtLength()`, `getBoundingClientRect()`
- CSS: Media queries, SVG filters, gradients, animations

## License

Converted to React from the original EmiraIT CodePen design. Original design released under MIT license.
