# Tasks

## 1. Configuration Type Definition

- [x] 1.1 Create `Timeline3Config` TypeScript interface with nested structure for animations, colors, and layout in Timeline3.tsx. Verify the interface is exported and has full JSDoc comments for each property and its defaults.

- [x] 1.2 Update Timeline3Props to include optional `config?: Timeline3Config` prop. Verify TypeScript compilation succeeds without errors.

## 2. CSS Custom Properties and Defaults

- [x] 2.1 Add CSS custom properties to `Timeline3.css` for animation timing (--timeline3-duration), easing variants (--timeline3-easing-circle, --timeline3-easing-line, --timeline3-easing-text), and all color and layout variables. Include fallback values as defaults. Verify CSS is valid and custom properties are recognized by browser DevTools.

- [x] 2.2 Update all hardcoded values in `Timeline3.css` to use the new custom properties (e.g., replace `0.9s ease-out` transitions with `calc(var(--timeline3-duration) / 1000 * 0.9)s var(--timeline3-easing-circle)` for circle animations). Verify visual appearance matches original when no config is provided.

## 3. Config Merging and Application Logic

- [x] 3.1 Implement config merging function that combines provided `config` props with built-in defaults. Handle optional nested properties (animations.easing, colors, layout). Verify logic with unit tests covering partial configs and undefined values.

- [x] 3.2 Apply merged config to CSS custom properties on the root section element using inline styles. Convert animation durations to milliseconds and easing strings for CSS. Verify properties are set correctly by inspecting the DOM in DevTools.

## 4. Animation Easing and Variants

- [x] 4.1 Define easing presets for 'smooth' and 'energetic' variants (cubic-bezier values for circle, line, and text animations). Implement variant selection logic that applies the preset if `animationVariant` is specified in config. Verify easing values are applied to the correct animation types via CSS.

- [x] 4.2 Implement per-animation-type easing override: if `config.animations.easing` is an object with `circle`, `line`, or `text` properties, apply those instead of the variant preset. Verify all three easing types can be customized independently.

## 5. Color Customization Implementation

- [x] 5.1 Map `config.colors` object properties (progress, line, circle, text) to CSS custom properties and apply them to the section element. Ensure proper CSS syntax for color values (hex, rgb, hsl). Verify colors update in browser by inspecting CSS custom properties.

- [x] 5.2 Update `Timeline3.css` to use color custom properties in all relevant places (progress bar background, line backgrounds and gradients, circle stroke, text color). Verify default appearance unchanged and custom colors apply correctly.

## 6. Layout Customization Implementation

- [x] 6.1 Map `config.layout` properties (itemSpacing, circleSize, contentPadding) to CSS custom properties. Handle CSS length values (rem, px, em, etc.) passed from config. Verify CSS custom properties are set correctly.

- [x] 6.2 Update spacing and sizing rules in `Timeline3.css` to use layout custom properties (e.g., `var(--timeline3-item-spacing)` instead of `5rem`). Maintain responsive design via clamp() and media queries. Verify responsive behavior still works on mobile and desktop viewports.

## 7. Progress Bar Smooth Animation with Easing

- [x] 7.1 Update requestAnimationFrame paint loop to apply the configured easing (numeric factor or derived from cubic-bezier). Accept `config.animations.duration` to control animation speed. Verify smooth interpolation when scrolling by checking that progress bar animates at configured duration.

- [x] 7.2 Extract easing factor from config (default 0.18) and apply it to the interpolation calculation: `current += (target - current) * easingFactor`. Support both numeric factors and conversion from CSS easing strings. Verify animation smoothness via manual scroll testing.

## 8. Intersection Observer and Item Animations

- [x] 8.1 Ensure IntersectionObserver thresholds and margins remain configurable via hidden config properties if needed, but keep defaults aligned with spec. Verify item animations trigger at correct viewport positions (20% threshold, -15% bottom margin).

- [x] 8.2 Verify that item animations (circle path, lines, text content) use the configured easing and duration via CSS transitions. Manually test entering and exiting viewport to confirm animation triggers correctly.

## 9. Reduced Motion Support

- [x] 9.1 Verify that `prefers-reduced-motion: reduce` query still disables all transitions and animations. Test by enabling reduced motion in OS settings and confirming progress bar and item animations become instant. Verify code checks `reducedMotion.matches` before triggering requestAnimationFrame.

## 10. Testing and Validation

- [x] 10.1 Write unit tests for config merging logic (partial overrides, nested properties, defaults). Verify tests pass and cover edge cases (undefined values, empty objects, invalid types).

- [x] 10.2 Create integration test or manual test scenario with multiple Timeline3 instances using different configs. Verify each instance applies its own config independently. Test with hardcoded config objects in a test component or Storybook story.

- [x] 10.3 Verify all TypeScript types are correct and compile without errors. Run `tsc --noEmit` or your project's type check command. Verify no `any` types are used and interfaces are properly exported.

## 11. Documentation and Examples

- [x] 11.1 Update Timeline3 component JSDoc comment with example usage showing config prop. Include examples for common customizations (custom easing, color, spacing). Verify documentation renders correctly in IDE tooltips.

- [x] 11.2 Create or update Storybook stories (or a dedicated example component) showing Timeline3 with default config, custom animations config, and custom colors config. Verify stories render without errors and all customizations are visually apparent.

## 12. CodePen Reference Visual Alignment

- [x] 12.1 Compare visual appearance of enhanced Timeline3 with the CodePen reference (https://codepen.io/santoshban/pen/pvjqqNK). Adjust easing, timing, and animation patterns to match reference design while keeping the component's data structure and React interface intact. Verify animations feel polished and professional.

- [x] 12.2 Test scroll-based progress bar animation at various scroll speeds and verify it remains smooth. Test on lower-end devices or throttle CPU to detect performance regressions. Verify frame rate is consistent.

## 13. Backwards Compatibility Verification

- [x] 13.1 Render existing Timeline3 instances throughout the project (e.g., in Contact.tsx or other pages) without passing a config prop. Verify they continue to work identically to before (same visual appearance, same animations). Confirm no console errors or warnings.

- [x] 13.2 Run full test suite and build pipeline. Verify no regressions in other components or pages. Confirm builds succeed and app renders correctly.

## Workflow follow-up

- After all tasks are verified complete, prepare the change for review by running `openspec validate --change "enhance-timeline3-animations"` and address any validation warnings.
- Archive the change once project review requirements are satisfied using `openspec archive "enhance-timeline3-animations"`.
