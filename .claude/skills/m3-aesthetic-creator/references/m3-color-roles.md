# Material 3 Color Roles Reference

This reference provides comprehensive specifications for the Material 3 color system. Use this when developing color palettes in Step 2 of the creation process.

## Overview

Material 3's color system uses **semantic color roles** rather than hardcoded colors. Each role has a specific purpose, ensuring consistency and accessibility across light and dark themes.

## Surface Colors (Backgrounds & Containers)

These define the foundational surfaces of your interface:

### Core Surface Roles

- **`surface`** - Main background surface (e.g., screen background)
- **`surface-variant`** - Alternate surface for subtle differentiation
- **`surface-dim`** - Dimmed surface (darker than surface)
- **`surface-bright`** - Brightened surface (lighter than surface)
- **`inverse-surface`** - Inverted surface for contrast (opposite theme)

### Surface Containers (Elevation Levels)

Material 3 uses container levels to create elevation hierarchy:

- **`surface-container-lowest`** - Lowest elevation (barely visible)
- **`surface-container-low`** - Low elevation
- **`surface-container`** - Default container elevation
- **`surface-container-high`** - High elevation
- **`surface-container-highest`** - Highest elevation (most prominent)

**Usage**: Cards, dialogs, menus, and floating UI elements use container colors to show elevation.

## Key Colors (Brand & Emphasis)

These are your brand colors and primary interaction colors:

### Primary Color Family

- **`primary`** - Main brand color, used for prominent actions (buttons, FABs, active states)
- **`primary-container`** - Subdued version for backgrounds, tags, chips
- **`on-primary`** - Text/icons on primary backgrounds
- **`on-primary-container`** - Text/icons on primary-container backgrounds

### Secondary Color Family

- **`secondary`** - Supporting brand color, used for less prominent actions
- **`secondary-container`** - Subdued version for backgrounds
- **`on-secondary`** - Text/icons on secondary backgrounds
- **`on-secondary-container`** - Text/icons on secondary-container backgrounds

### Tertiary Color Family

- **`tertiary`** - Accent color for contrast and highlights
- **`tertiary-container`** - Subdued version for backgrounds
- **`on-tertiary`** - Text/icons on tertiary backgrounds
- **`on-tertiary-container`** - Text/icons on tertiary-container backgrounds

**Usage Strategy**: Primary dominates (60%), secondary supports (30%), tertiary accents (10%).

## Semantic Colors

Colors with specific functional meanings:

### Error States

- **`error`** - Error color for warnings and destructive actions
- **`error-container`** - Subdued error background
- **`on-error`** - Text/icons on error backgrounds
- **`on-error-container`** - Text/icons on error-container backgrounds

### Outline & Borders

- **`outline`** - Default borders and dividers
- **`outline-variant`** - Subtle borders and decorative elements

### Overlays

- **`scrim`** - Semi-transparent overlay for modals/dialogs (typically rgba(0,0,0,0.32))
- **`shadow`** - Shadow color (typically transparent black with varying opacity)

## On-Colors (Text & Icons)

These ensure readable text on colored backgrounds:

### On-Surface Roles

- **`on-surface`** - Primary text/icons on surface backgrounds (highest contrast)
- **`on-surface-variant`** - Secondary text/icons on surface backgrounds (medium contrast)
- **`inverse-on-surface`** - Text/icons on inverse-surface backgrounds

### On-Key-Color Roles

Already covered above in Key Colors section:
- `on-primary`, `on-primary-container`
- `on-secondary`, `on-secondary-container`
- `on-tertiary`, `on-tertiary-container`
- `on-error`, `on-error-container`

## Tonal Palettes

Material 3 defines color in **tonal palettes** (0-100 scale):

- **0** - Pure black (or darkest tone)
- **10, 20, 30...** - Progressively lighter tones
- **100** - Pure white (or lightest tone)

### Tonal Palette Guidelines

For each key color (primary, secondary, tertiary), define:
- **Core tone** (40-50 for light mode, 80-90 for dark mode)
- **Container tone** (90-95 for light mode, 30-40 for dark mode)
- **On-color tone** (100 for light mode on dark colors, 10-20 for dark mode on light colors)

Example primary palette:
```
primary-0: #000000      (black)
primary-10: #1a0f3e
primary-20: #2e1b60
primary-30: #432882
primary-40: #5835a5     ← Use as `primary` in light mode
primary-50: #6f42c9
primary-60: #8950ec
primary-70: #a36fff
primary-80: #bd8fff     ← Use as `primary` in dark mode
primary-90: #d7b0ff
primary-95: #ebd9ff
primary-99: #fdf8ff
primary-100: #ffffff    (white)
```

## Color Harmony Strategies

Choose one of these strategies for your palette:

### Analogous
Colors next to each other on the color wheel (e.g., blue, blue-green, green).
- **Emotional effect**: Harmonious, calm, natural
- **Use for**: Cohesive, serene interfaces

### Complementary
Colors opposite on the color wheel (e.g., blue and orange).
- **Emotional effect**: Dynamic, energetic, high contrast
- **Use for**: Bold, attention-grabbing interfaces

### Triadic
Three colors evenly spaced on the color wheel (e.g., red, yellow, blue).
- **Emotional effect**: Vibrant, balanced, playful
- **Use for**: Colorful, expressive interfaces

### Split-Complementary
Base color + two colors adjacent to its complement.
- **Emotional effect**: Balanced with contrast
- **Use for**: Sophisticated, nuanced interfaces

### Custom Harmony
Define a unique color relationship based on visual metaphor.
- **Emotional effect**: Varies based on intent
- **Use for**: Distinctive, conceptual interfaces

## Accessibility Requirements

All color combinations must meet WCAG standards:

- **WCAG AA** (minimum): 4.5:1 contrast ratio for normal text, 3:1 for large text
- **WCAG AAA** (enhanced): 7:1 contrast ratio for normal text, 4.5:1 for large text

Always test:
- `on-surface` on `surface`
- `on-primary` on `primary`
- `on-secondary` on `secondary`
- `on-tertiary` on `tertiary`
- `on-error` on `error`

## Dark Mode Strategy

Material 3 supports automatic light/dark theme switching:

### Approach 1: Separate Palettes
Define completely separate color values for light and dark modes.

### Approach 2: Tonal Inversion
Use different tones from the same tonal palette:
- Light mode: Use tones 40-50 for key colors, 90-95 for containers
- Dark mode: Use tones 80-90 for key colors, 30-40 for containers

### Surface Elevation in Dark Mode
In dark mode, elevated surfaces become LIGHTER (not darker):
- `surface-container-lowest`: Darkest
- `surface-container`: Slightly lighter
- `surface-container-highest`: Lightest

## Implementation Format

Provide color values in one of these formats:

- **Hex**: `#5835a5`
- **HSL**: `hsl(258, 58%, 43%)`
- **OKLCH** (recommended): `oklch(0.52 0.21 285)`

OKLCH is recommended because it provides perceptually uniform color space.

## Rationale Template

For each color role, explain:
1. **Why this hue?** - How does it support the visual metaphor?
2. **Why this saturation/lightness?** - What emotional impact does it create?
3. **How does it relate to other colors?** - What harmony strategy does it use?

Example:
> **Primary (#5835a5 - Deep Violet)**
> Chosen to evoke mystery and creativity, supporting our "Cosmic Laboratory" metaphor. The deep saturation (58%) creates a sense of richness without overwhelming. Forms an analogous harmony with secondary (blue-violet) for cohesion while maintaining distinction.
