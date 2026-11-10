# Design

## Context

The current Timeline3 component uses CSS transitions with requestAnimationFrame for smooth scroll-based progress tracking. It calculates scroll progress and updates a progress bar height via CSS custom properties. Item visibility animations are triggered by an IntersectionObserver with specific thresholds. The component currently uses hardcoded values for timing (0.18 easing factor, 0.9s transitions), colors, and spacing.

See proposal.md for motivation and specs for detailed requirements.

## Goals

- Introduce a configuration system for animation timing, easing, colors, and layout without breaking existing usage
- Enable customization through a single optional `config` prop while maintaining sensible defaults
- Keep animation performance optimized with requestAnimationFrame and IntersectionObserver
- Support CSS-only animations without external libraries (no GSAP)
- Align visual design with CodePen reference while remaining flexible and composable

## Non-Goals

- Rewrite the entire scroll-tracking mechanism (keep core architecture)
- Support server-side rendering or hydration edge cases (assume client-side only)
- Create a full theme/style system (configuration-based customization only, not theming)
- Animate non-CSS properties (avoid JavaScript-driven transform/position changes)

## Decisions

### 1. Configuration Schema and Defaults

**Decision**: Define a `Timeline3Config` TypeScript interface with optional top-level properties for animations, colors, and layout. Each category has sensible defaults so users can partially override values.

**Rationale**:
- Backwards compatible: existing components work without any config
- Composable: users can override individual settings without needing to provide full configuration
- Type-safe in TypeScript projects

**Alternatives considered**:
- Flat config object (harder to organize, less discoverable)
- Multiple separate props (verbose prop drilling)
- Theme provider context (adds dependency, overkill for this component)

**Implementation approach**:
```typescript
type Timeline3Config = {
  animations?: {
    duration?: number; // milliseconds, default 900
    easing?: string | Partial<{circle, line, text}>; // CSS easing or per-type
    variant?: 'smooth' | 'energetic' | 'custom'; // preset or custom
  };
  colors?: {
    progress?: string; // hex/rgb, default '#fff'
    line?: string;
    circle?: string;
    text?: string;
  };
  layout?: {
    itemSpacing?: string; // CSS length, default 5rem
    circleSize?: string; // default 6.125rem
    contentPadding?: string; // default 7.5rem
  };
};
```

### 2. Animation Implementation: CSS + RequestAnimationFrame

**Decision**: Keep the existing requestAnimationFrame + CSS custom property approach for progress tracking and smooth interpolation. Use CSS transitions/animations for item entrance animations (circle path stroke, lines, text fade).

**Rationale**:
- Maintains current performance optimization (passive scroll listeners, batched reflows)
- CSS animations are composable with CSS custom properties
- No new dependencies
- RequestAnimationFrame gives precise control over progress interpolation (easing factor)

**Alternatives considered**:
- Pure CSS animations via CSS animations API (less control over easing factor on progress)
- Web Animations API (overhead, requires fallbacks)
- Spring physics (unnecessary complexity for this use case)

### 3. Easing Configuration

**Decision**: Accept easing as either a CSS cubic-bezier string or a per-animation-type object. For progress bar interpolation (requestAnimationFrame), use a numeric easing factor (0-1) derived from a predefined easing curve.

**Rationale**:
- CSS easing strings are familiar and portable
- Per-animation flexibility for circle, line, and text stagger effects
- Numeric factor approach keeps smooth interpolation algorithm simple and fast

**Alternatives considered**:
- Only CSS easing strings (limits JS control over progress bar smoothness)
- Only numeric factors (unfamiliar to designers, less expressive)

### 4. Color Customization via CSS Variables

**Decision**: Apply configuration colors to CSS custom properties (--timeline3-color-progress, --timeline3-color-line, etc.) instead of inline styles. Update the CSS to reference these variables.

**Rationale**:
- Keeps DOM mutations minimal (one-time props setup)
- Allows CSS to compose colors naturally
- Easier to override defaults in CSS if needed
- Better separation of concerns

### 5. Layout Spacing via CSS Variables

**Decision**: Convert hardcoded spacing, sizing values to CSS custom properties that can be set from the config object on the root element.

**Rationale**:
- Maintains responsive design via clamp() and viewport units
- One-time setup, no JavaScript updates needed during scroll
- Easier to maintain and adjust in CSS media queries

### 6. Backwards Compatibility

**Decision**: Make the `config` prop optional with all properties optional. If not provided, use inline defaults defined in the component.

**Rationale**:
- Zero breaking changes for existing usage
- Gradual adoption path for users who want customization
- Simple to document and understand

### 7. CodePen Reference Integration

**Decision**: Use the CodePen reference (https://codepen.io/santoshban/pen/pvjqqNK) as inspiration for:
- Animation timing and stagger patterns
- Visual polish (gradient directions, circle animations, line effects)
- But do NOT port its entire implementation (GSAP, specific layout)

**Rationale**:
- Achieves design goal without creating library lock-in
- Allows us to adapt patterns to our data structure and constraints
- Maintains code ownership and maintainability

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Config object becomes too large | Keep it focused on visual/animation properties; don't add behavior config. Start with essentials, add more via minor version updates. |
| CSS variable cascading issues | Document that config sets variables on the root section element; component styles are scoped. Users should not have conflicting timeline3 custom properties. |
| Partial config fallback complexity | Type the config as fully optional at each level; use ?? or default object merging in component for clarity. |
| Browser support for CSS custom properties | Only older IE lacks support; project likely targets modern browsers already. Graceful degradation for older browsers is acceptable. |
| Scroll performance regression | Maintain IntersectionObserver, passive listeners, and requestAnimationFrame optimizations. Test on low-end devices. |

## Migration Plan

1. **Phase 1**: Add `Timeline3Config` type and optional `config` prop to component
2. **Phase 2**: Refactor hardcoded values to CSS custom properties with defaults
3. **Phase 3**: Implement config merging logic and apply to CSS properties
4. **Phase 4**: Update CSS to use new variables, ensure visual fidelity
5. **Phase 5**: Test with partial configs and edge cases
6. **Phase 6**: Documentation and examples for customization

No breaking changes; existing components will continue to work as-is.

## Open Questions

- **CodePen visual replication scope**: Should we match the exact animation timing/easing from the reference, or is the spirit of the animations sufficient? (Defer to visual review after implementation)
- **Animation stagger for items**: Should there be a configuration option for stagger timing between multiple items, or should all items in the timeline animate independently? (Can be added in a follow-up if needed)
- **Responsive breakpoint handling**: Should layout config values include mobile/tablet variants, or should media queries in CSS handle that? (CSS media queries sufficient for now)
