# Scroll Timeline Component

## What

Implement a high-performance, scroll-driven timeline component inspired by the GSAP Vault Chronicle demo (https://gsapvault.com/demos/scroll-timeline-chronicle/). The component will:

- Display a vertical timeline with a central "spine" and event markers
- Render events with alternating left/right content layout
- Implement scroll-linked animations using native Web APIs (no GSAP, no animation libraries)
- Enable dynamic spine stretching during fast scrolls (momentum effect)
- Support customizable event data (year, number, title, description)
- Provide responsive design across mobile, tablet, and desktop
- Use React + TypeScript + CSS vanilla for maximum performance and control

## Why

Current state:
- Portfolio has existing timeline components (ExperienceTimeline, Timeline2-4.tsx) but they're limited to specific use cases
- No reusable scroll-driven timeline component that matches modern design standards
- Timeline animations use limited/no scroll-linking
- Opportunity to showcase motion and interaction design skills on the portfolio

This addition enables:
- Demonstrate mastery of scroll animations without heavy libraries
- Create a reusable, performant component for showcasing projects, timeline of work, or milestones
- Show understanding of Web APIs (IntersectionObserver, requestAnimationFrame, ScrollTimeline when available)
- Portfolio content becomes more dynamic and engaging
- Component is teachable/auditable (vanilla CSS + React = clear implementation)

## Success Criteria

1. **Visual fidelity** - Timeline matches reference design (vertical spine, alternating content, event markers)
2. **Scroll responsiveness** - Timeline animations track scroll position in real-time
3. **Performance** - 60 FPS scroll experience (no jank, smooth animations)
4. **Responsive design** - Works on mobile (single column), tablet, desktop (alternating layout)
5. **Browser compatibility** - Works in modern browsers (Chrome, Firefox, Safari, Edge)
6. **Customizable data** - Can render any number of events with custom content
7. **No heavy dependencies** - Pure React + CSS (no GSAP, Framer Motion, or animation libraries)
8. **Accessibility** - Proper semantic HTML, keyboard navigation if applicable

## Scope

**Includes:**
- ScrollTimeline component (main container)
- TimelineEvent component (individual event)
- Vertical spine with dynamic stretching effect
- Event markers (circles/dots at spine intersection)
- Left/right alternating content layout
- Scroll-linked animation (spine height, marker positions)
- Momentum/spring effect on fast scrolls
- Responsive design (mobile/tablet/desktop)
- CSS animations and transitions
- TypeScript interfaces for event data

**Excludes (future work):**
- Horizontal timeline variant
- 3D timeline effects
- Custom marker shapes (only circles/dots in this version)
- Animation presets library
- Timeline editor UI
- Infinite/paginated timelines
- Multi-language localization

## Estimate

6 implementation tasks across:
1. Component architecture and data model
2. Spine rendering and scroll tracking
3. Event markers and positioning
4. Content layout (alternating left/right)
5. Scroll animations and momentum effect
6. Responsive design and testing

## Timeline

- **Proposal**: ✅ Complete
- **Specs**: Next - Define requirements and scenarios
- **Design**: Architecture and implementation approach
- **Tasks**: Breakdown into actionable work items
- **Implementation**: Sequential task execution
- **Testing**: Visual and performance validation
- **Archive**: Finalization after verification

## Integration

This component will be:
- Placed in `resources/js/components/ScrollTimeline/` directory
- Integrated into the Projects page (or new Timeline showcase page)
- Exported as reusable component for future use
- Styled within the portfolio's existing design system
