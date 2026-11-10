# Spec Delta

## Purpose

Enable timeline components to accept a configuration object that controls animation timing, easing, colors, and layout properties, allowing customization without code changes.

## ADDED Requirements

### Requirement: Configuration object support
The Timeline3 component SHALL accept an optional `config` prop that provides animation and visual customization parameters without breaking existing props-based usage.

#### Scenario: Default behavior without config
- **WHEN** component renders without a `config` prop
- **THEN** component uses sensible built-in defaults for all animations, colors, and spacing

#### Scenario: Custom config provided
- **WHEN** component receives a valid `config` object
- **THEN** component applies configuration values to animations, colors, and layout

#### Scenario: Partial config override
- **WHEN** component receives a `config` with only some properties defined
- **THEN** undefined properties fall back to built-in defaults while provided values are applied

### Requirement: Timing and easing customization
The animation system SHALL allow configuration of animation duration and easing functions via the config object.

#### Scenario: Custom animation duration
- **WHEN** component is configured with `animationDuration: 1200`
- **THEN** all timeline animations complete in 1200ms instead of default

#### Scenario: Custom easing function
- **WHEN** component is configured with `easing: 'cubic-bezier(0.22, 1, 0.36, 1)'`
- **THEN** animations use the specified easing curve for smoother or more energetic motion

#### Scenario: Separate easing for different animation types
- **WHEN** component is configured with `easing.circle`, `easing.line`, and `easing.text`
- **THEN** each animation type uses its corresponding easing function if specified

### Requirement: Color customization
The visual design SHALL allow configuration of primary colors for progress indicators, lines, circles, and text.

#### Scenario: Custom progress bar color
- **WHEN** component is configured with `colors.progress: '#00FF00'`
- **THEN** the progress indicator fills with the specified color

#### Scenario: Custom line color
- **WHEN** component is configured with `colors.line: '#FF0000'`
- **THEN** connecting lines between timeline items render in the specified color

#### Scenario: Custom circle color
- **WHEN** component is configured with `colors.circle: '#0000FF'`
- **THEN** phase indicator circles stroke with the specified color

#### Scenario: Custom text color
- **WHEN** component is configured with `colors.text: '#CCCCCC'`
- **THEN** timeline content text displays in the specified color

### Requirement: Layout customization
The component SHALL support configuration of spacing, sizing, and padding values.

#### Scenario: Custom item spacing
- **WHEN** component is configured with `layout.itemSpacing: '8rem'`
- **THEN** vertical spacing between timeline items matches the configured value

#### Scenario: Custom circle size
- **WHEN** component is configured with `layout.circleSize: '4rem'`
- **THEN** phase indicator circles render with the specified width and height

#### Scenario: Custom content padding
- **WHEN** component is configured with `layout.contentPadding: '4rem'`
- **THEN** timeline item content maintains the specified padding relative to the center line

### Requirement: Animation variant selection
The timeline system SHALL support different animation effect presets or variants.

#### Scenario: Select animation variant
- **WHEN** component is configured with `animationVariant: 'smooth'` or `'energetic'`
- **THEN** all animations use timing and easing values defined for that variant

#### Scenario: Unknown variant falls back to default
- **WHEN** component is configured with an unrecognized `animationVariant` value
- **THEN** component uses the default animation behavior without error
