# M3 Design Spec Reference

**Material Design 3 Expressive Design System**  
**Complete token reference for CareerCopilot components**

---

## 🎨 Color System

### Primary Colors
```css
--md-sys-color-primary-0: #000000
--md-sys-color-primary-10: #21005D
--md-sys-color-primary-20: #381E72
--md-sys-color-primary-30: #4F378B
--md-sys-color-primary-40: #6750A4
--md-sys-color-primary-50: #7F67BE  /* Main primary */
--md-sys-color-primary-60: #9A82DB
--md-sys-color-primary-70: #B69DF8
--md-sys-color-primary-80: #D0BCFF
--md-sys-color-primary-90: #EADDFF
--md-sys-color-primary-95: #F6EDFF
--md-sys-color-primary-99: #FFFBFE
--md-sys-color-primary-100: #FFFFFF
```

### Usage Guidelines
- **Primary-50**: Main brand color, primary actions
- **Primary-80**: Hover states, highlights
- **Primary-90**: Light backgrounds, containers
- **Primary-10-30**: Dark text on light backgrounds

### Surface Colors
```css
--md-sys-color-surface: #FFFBFE
--md-sys-color-surface-dim: #DDD8E1
--md-sys-color-surface-bright: #FFFBFE
--md-sys-color-surface-container: #F7F2FA
--md-sys-color-surface-container-low: #FBF7FD
--md-sys-color-surface-container-high: #ECE6F0
--md-sys-color-surface-container-highest: #E6E0E9
```

### On-Surface Colors
```css
--md-sys-color-on-surface: #1C1B1F
--md-sys-color-on-surface-variant: #49454F
--md-sys-color-on-primary: #FFFFFF
--md-sys-color-on-secondary: #FFFFFF
```

---

## 📏 Spacing Scale

### Standard Spacing Values
```css
--md-sys-spacing-0: 0px
--md-sys-spacing-1: 4px    /* XS spacing */
--md-sys-spacing-2: 8px    /* Small spacing */
--md-sys-spacing-3: 12px   /* Medium-small */
--md-sys-spacing-4: 16px   /* Base spacing */
--md-sys-spacing-5: 20px
--md-sys-spacing-6: 24px   /* Common padding */
--md-sys-spacing-7: 28px
--md-sys-spacing-8: 32px   /* Large spacing */
--md-sys-spacing-12: 48px
--md-sys-spacing-16: 64px
--md-sys-spacing-24: 96px
--md-sys-spacing-32: 128px
```

### Usage Guidelines
- **Spacing-1-2**: Tight spacing (icons, badges)
- **Spacing-4**: Standard padding, gaps
- **Spacing-6**: Card padding, section spacing
- **Spacing-8**: Large gaps, section dividers

---

## 🔲 Shape Tokens

### Corner Radius
```css
--md-sys-shape-corner-none: 0px
--md-sys-shape-corner-extra-small: 4px
--md-sys-shape-corner-small: 4px
--md-sys-shape-corner-medium: 8px
--md-sys-shape-corner-large: 12px
--md-sys-shape-corner-extra-large: 28px
--md-sys-shape-corner-full: 9999px  /* Circular */
```

### Usage Guidelines
- **Small**: Buttons, chips, tags
- **Medium**: Cards, inputs, modals
- **Large**: Large cards, dialogs
- **Full**: Avatars, circular buttons

---

## 📐 Typography Scale

### Display (Largest)
```css
--md-sys-typescale-displayLarge-size: 57px
--md-sys-typescale-displayMedium-size: 45px
--md-sys-typescale-displaySmall-size: 36px
```

### Headline
```css
--md-sys-typescale-headlineLarge-size: 32px
--md-sys-typescale-headlineMedium-size: 28px
--md-sys-typescale-headlineSmall-size: 24px
```

### Title
```css
--md-sys-typescale-titleLarge-size: 22px
--md-sys-typescale-titleMedium-size: 16px
--md-sys-typescale-titleSmall-size: 14px
```

### Body
```css
--md-sys-typescale-bodyLarge-size: 16px
--md-sys-typescale-bodyMedium-size: 14px
--md-sys-typescale-bodySmall-size: 12px
```

### Label
```css
--md-sys-typescale-labelLarge-size: 14px
--md-sys-typescale-labelMedium-size: 12px
--md-sys-typescale-labelSmall-size: 11px
```

### Font Weights
```css
--md-sys-typescale-weight-regular: 400
--md-sys-typescale-weight-medium: 500
--md-sys-typescale-weight-semibold: 600
--md-sys-typescale-weight-bold: 700
```

---

## ☁️ Elevation System

### Elevation Levels
```css
--md-sys-elevation-level0: none
--md-sys-elevation-level1: 
  /* Subtle shadow for cards at rest */
  0px 1px 2px 0px rgba(0, 0, 0, 0.3),
  0px 1px 3px 1px rgba(0, 0, 0, 0.15)
--md-sys-elevation-level2:
  /* Medium shadow for hover states */
  0px 1px 2px 0px rgba(0, 0, 0, 0.3),
  0px 2px 6px 2px rgba(0, 0, 0, 0.15)
--md-sys-elevation-level3:
  /* Strong shadow for modals, dialogs */
  0px 1px 3px 0px rgba(0, 0, 0, 0.3),
  0px 4px 8px 3px rgba(0, 0, 0, 0.15)
--md-sys-elevation-level4:
  /* Very strong for overlays */
  0px 2px 3px 0px rgba(0, 0, 0, 0.3),
  0px 6px 10px 4px rgba(0, 0, 0, 0.15)
--md-sys-elevation-level5:
  /* Maximum elevation */
  0px 4px 4px 0px rgba(0, 0, 0, 0.3),
  0px 8px 12px 6px rgba(0, 0, 0, 0.15)
```

### Usage Guidelines
- **Level 0**: Flat surfaces, no elevation
- **Level 1**: Cards, surfaces at rest
- **Level 2**: Hover states, raised buttons
- **Level 3**: Modals, dialogs, dropdowns
- **Level 4-5**: Overlays, tooltips, popovers

---

## ⚡ Motion System

### Durations
```css
--md-sys-motion-duration-short1: 50ms
--md-sys-motion-duration-short2: 100ms
--md-sys-motion-duration-short3: 150ms
--md-sys-motion-duration-short4: 200ms
--md-sys-motion-duration-medium1: 250ms
--md-sys-motion-duration-medium2: 300ms
--md-sys-motion-duration-medium3: 350ms
--md-sys-motion-duration-medium4: 400ms
--md-sys-motion-duration-long1: 450ms
--md-sys-motion-duration-long2: 500ms
--md-sys-motion-duration-long3: 550ms
--md-sys-motion-duration-long4: 600ms
```

### Easing Functions
```css
--md-sys-motion-easing-linear: linear
--md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1)
--md-sys-motion-easing-standard-accelerate: cubic-bezier(0.3, 0, 1, 1)
--md-sys-motion-easing-standard-decelerate: cubic-bezier(0, 0, 0.2, 1)
--md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1)
```

### Usage Guidelines
- **Short (50-200ms)**: Micro-interactions, hover states
- **Medium (250-400ms)**: Component transitions, state changes
- **Long (450-600ms)**: Page transitions, complex animations

---

## 🎯 Component-Specific Guidelines

### Buttons
- **Padding**: `spacing-4` horizontal, `spacing-2` vertical
- **Border-radius**: `shape-corner-small` or `shape-corner-full`
- **Elevation**: Level 0 (flat) or Level 1 (raised)
- **Hover**: Increase elevation by 1 level

### Cards
- **Padding**: `spacing-4` to `spacing-6`
- **Border-radius**: `shape-corner-medium`
- **Elevation**: Level 1 (at rest), Level 2 (hover)
- **Spacing between cards**: `spacing-4` to `spacing-6`

### Inputs
- **Height**: 56px (large), 48px (medium), 40px (small)
- **Padding**: `spacing-4` horizontal
- **Border-radius**: `shape-corner-small`
- **Focus ring**: 2px outline with primary color

### Modals/Dialogs
- **Elevation**: Level 3
- **Border-radius**: `shape-corner-large`
- **Padding**: `spacing-6`
- **Backdrop**: Surface-dim with opacity

### Lists
- **Item height**: 48px (standard), 40px (dense)
- **Padding**: `spacing-4` horizontal
- **Divider**: 1px solid outline-variant

---

## ✅ Consistency Checklist

### Colors
- [ ] All colors use `--md-sys-color-*` tokens
- [ ] No hardcoded hex/rgb values
- [ ] Proper color roles (primary for actions, error for errors)
- [ ] Contrast ratios meet WCAG AA (4.5:1 for text)

### Spacing
- [ ] All spacing uses `--md-sys-spacing-*` tokens
- [ ] Consistent padding across similar components
- [ ] No arbitrary pixel values
- [ ] Spacing scale is respected

### Typography
- [ ] All text uses `--md-sys-typescale-*` tokens
- [ ] Font sizes are consistent
- [ ] Line heights use type scale
- [ ] Font weights are appropriate

### Elevation
- [ ] All shadows use `--md-sys-elevation-*` tokens
- [ ] Elevation levels are appropriate
- [ ] Hover states increase elevation
- [ ] No hardcoded shadow values

### Motion
- [ ] All transitions use `--md-sys-motion-*` tokens
- [ ] Durations are appropriate for interaction type
- [ ] Easing functions are consistent
- [ ] No hardcoded timing values

---

## 📚 Additional Resources

- **M3 Design Spec**: https://m3.material.io/
- **Token Documentation**: `frontend/src/styles/m3-design-tokens.css`
- **Component Examples**: Storybook (`yarn storybook`)
- **Integration Test Page**: `/m3-integration-test`

---

**Last Updated:** 2025-01-XX  
**Version:** M3 Expressive Design System v1.0

