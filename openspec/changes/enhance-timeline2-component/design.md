# Design

## Context

The current Timeline2 component provides basic scroll-driven animations with perspective transforms, opacity, and scale effects. It uses React hooks (useEffect, useRef, useState) and CSS transitions for animations. The component currently lacks visual polish and sophisticated effects present in the reference CodePen design (https://codepen.io/sainul/pen/bNqMpXq), specifically:

- No SVG elements for connector lines or spine animations
- No animated glows or shadow effects
- Limited visual feedback on scroll interactions
- No gradient overlays or sophisticated visual hierarchy

The redesign must maintain:
- Zero external animation library dependencies (no GSAP, Framer Motion)
- React 18 + TypeScript strict mode compatibility
- The existing component API (props, exports)
- Integration with existing pages (Contact, etc.)
- 60 FPS performance on target devices

## Goals / Non-Goals

### Goals
- Replicate visual effects and animations from reference CodePen design using React/TypeScript/CSS vanilla
- Implement SVG-based connector lines with stroke-dasharray drawing animations
- Add enhanced spine with gradient and animated fill synchronized to scroll
- Implement item glow/shadow effects that respond to scroll velocity
- Maintain 60 FPS performance and smooth animations across all interactions
- Ensure accessibility with reduced-motion preference support
- Keep component bundle size reasonable without external dependencies

### Non-Goals
- Do NOT add GSAP, Framer Motion, or other animation libraries
- Do NOT significantly change the React component structure or props interface
- Do NOT break existing integrations (Contact page, etc.)
- Do NOT add new external dependencies beyond what's already in the project
- Do NOT implement new features beyond visual enhancements (no data model changes)

## Decisions

### Decision 1: Use Inline SVG Elements for Connectors

**Choice**: Render SVG connector lines directly in JSX as inline `<svg>` elements rather than separate SVG files or canvas rendering.

**Rationale**:
- Inline SVG allows dynamic positioning based on React state and DOM measurements
- Easy to style with CSS classes and inline styles
- Can use native SVG stroke-dasharray for draw animations
- No file system dependencies or build complications

**Alternatives considered**:
- Separate SVG files: Would require more complex positioning logic and imports
- Canvas rendering: Would be less maintainable and harder to style
- CSS Box-shadow only: Cannot create connector lines between disparate elements

### Decision 2: Scroll Tracking with requestAnimationFrame + Velocity Calculation

**Choice**: Keep existing RAF-based scroll tracking with EMA (Exponential Moving Average) velocity smoothing. Reuse existing useScrollTracking hook patterns.

**Rationale**:
- RAF provides 60 FPS capability without blocking main thread
- EMA smoothing already implemented and working well
- Allows smooth velocity-responsive animations
- Familiar pattern from existing codebase

**Alternatives considered**:
- Scroll event listener: Would be less performant and cause jank
- Web Animation API: Overkill for this use case and less flexible
- Intersection Observer only: Cannot capture velocity information

### Decision 3: SVG Stroke-Dasharray for Draw Animations

**Choice**: Use SVG stroke-dasharray and stroke-dashoffset properties to animate line drawing effects, controlled via CSS and inline styles updated by JavaScript.

**Rationale**:
- Native SVG feature, no library needed
- Performant and GPU-accelerated
- Works across all modern browsers
- Easy to control with JavaScript state updates

**Alternatives considered**:
- GSAP/libraries: Violates no-dependency requirement
- CSS animations only: Cannot sync with scroll position accurately
- Custom SVG Path animations: More complex to implement and maintain

### Decision 4: CSS Gradients and Transitions for Glow/Shadow Effects

**Choice**: Use CSS gradient properties, box-shadow, and filter properties (blur, brightness) to create glow and shadow effects. Control opacity and intensity via JavaScript based on scroll velocity.

**Rationale**:
- No additional libraries needed
- CSS properties are GPU-accelerated
- Easy to adjust in CSS without code changes
- Smooth performance on all devices

**Alternatives considered**:
- Canvas glow effects: Harder to maintain and synchronize
- SVG filters: More complex XML structure and harder to animate
- Only CSS animations: Cannot respond to scroll velocity effectively

### Decision 5: Component Structure - Separate SVG Layer

**Choice**: Create a separate SVG container overlay that renders connectors and animated elements, positioned absolutely over the main timeline content.

**Rationale**:
- Keeps SVG concerns separate from item content
- Easier to manage Z-indexing
- Doesn't interfere with item layout
- Can animate independently

**Alternatives considered**:
- Inline SVG within each item: More complex ref management
- Single global SVG: Harder to manage complex SVG structures

### Decision 6: TypeScript Types for SVG Animation State

**Choice**: Extend existing Timeline2 types with new SVG animation-related types (ConnectorPosition, AnimationState, etc.).

**Rationale**:
- Maintain type safety with strict TypeScript checking
- Clear contracts for animation state data structures
- Better IDE autocomplete and error detection

**Alternatives considered**:
- Use `any` types: Would reduce type safety
- Create separate types file: Overkill for this scope

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| **SVG Performance at Scale** - Many animated SVG elements could impact performance on older devices | Implement efficient rendering with React.memo for SVG components. Monitor FPS in testing. Consider reducing connector count on low-end devices (feature flag). |
| **Browser Compatibility** - SVG stroke-dasharray animation not supported in IE11 | Document IE11 as unsupported. Implement graceful degradation (simple connecting lines, no animation). |
| **Complex Coordinate Calculations** - Calculating SVG connector endpoints from DOM elements is error-prone | Create utility functions with comprehensive testing. Use getBoundingClientRect() with error handling. Add logging in development. |
| **Increased Bundle Size** - More complex component code and SVG rendering could increase size | Monitor final bundle size. Minify SVG paths. Consider lazy-loading for non-critical animations. |
| **Animation Sync Accuracy** - Scroll-synchronized animations might have micro-timing issues | Use requestAnimationFrame consistently. Test with various scroll speeds. Implement velocity smoothing (already done). |
| **Responsive SVG Positioning** - SVG connectors need to reposition on window resize or orientation change | Implement resize observer. Recalculate connector positions on resize. Test across breakpoints. |

## Migration Plan

### Phase 1: Development
1. Create enhanced Timeline2.tsx with new component structure
2. Implement SVG connector system with positioned elements
3. Add glow/shadow effect CSS and JavaScript logic
4. Add gradient overlay styles
5. Implement enhanced spine with fill animation
6. Implement enhanced marker buttons

### Phase 2: Testing
1. Verify 60 FPS performance on test devices
2. Test responsive behavior across breakpoints
3. Test accessibility (reduced-motion, keyboard, screen readers)
4. Test browser compatibility
5. Performance audit with Lighthouse

### Phase 3: Deployment
1. Update imports in Contact.tsx (already has Timeline2)
2. Test Contact page integration
3. Monitor performance in production
4. Gather user feedback

### Rollback Strategy
- Keep old Timeline2.tsx as Timeline2-old.tsx as backup
- Can quickly revert by changing imports
- No data model changes, so no database migrations needed

## Open Questions

1. **Exact CodePen Replication Fidelity**: Should we replicate the CodePen 100% pixel-perfect, or is "inspired by" sufficient? Answer deferred to implementation phase - can be answered by visual comparison during development.

2. **Mobile SVG Animation Performance**: Should we disable or simplify SVG connector animations on mobile to preserve performance, or animate fully? Can be determined after initial performance testing in Phase 2.

3. **Number of Connector Lines**: Should every item have an animated connector, or only visible/nearby items? Can optimize after initial implementation and performance testing.

4. **Gradient Animation Complexity**: Should gradients animate position/angle, or only opacity? Can be refined based on visual testing and performance metrics.
