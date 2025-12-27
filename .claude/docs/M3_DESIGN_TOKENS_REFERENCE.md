# Material Design 3 Design Tokens - Complete Reference Guide

**Purpose:** Comprehensive reference for all M3 design tokens used in CareerCopilot
**Status:** Production Ready
**Last Updated:** November 26, 2025
**Version:** 1.0

---

## Color System (78 Tokens)

### Primary Colors

```css
--sys-color-primary: #a78bfa;
--sys-color-on-primary: #1e1b4b;
--sys-color-primary-container: #7c3aed;
--sys-color-on-primary-container: #ede9fe;
```

### Secondary Colors

```css
--sys-color-secondary: #c9c3dc;
--sys-color-on-secondary: #312e41;
--sys-color-secondary-container: #474459;
--sys-color-on-secondary-container: #f8f7fa;
```

### Tertiary Colors

```css
--sys-color-tertiary: #f472b6;
--sys-color-on-tertiary: #831843;
--sys-color-tertiary-container: #ec4899;
--sys-color-on-tertiary-container: #fce7f3;
```

### Error Colors

```css
--sys-color-error: #ffb4ab;
--sys-color-on-error: #690005;
--sys-color-error-container: #93000a;
--sys-color-on-error-container: #ffcac0;
```

### Surface & Background Colors

```css
--sys-color-surface: #131318;
--sys-color-on-surface: #f8fafc;
--sys-color-surface-variant: #1f1f23;
--sys-color-on-surface-variant: #e2e8f0;

--sys-color-surface-container-lowest: #0a0a0e;
--sys-color-surface-container-low: #18181d;
--sys-color-surface-container: #1e1e23;
--sys-color-surface-container-high: #262629;
--sys-color-surface-container-highest: #2e2e32;

--sys-color-background: #131318;
--sys-color-on-background: #f8fafc;
```

### Outline Colors

```css
--sys-color-outline: #928f99;
--sys-color-outline-variant: #48464f;
```

---

## Typography System (13 Scales)

### Display Styles

```css
--sys-typescale-display-large: 57px, 700, 64px;
--sys-typescale-display-medium: 45px, 700, 52px;
--sys-typescale-display-small: 36px, 700, 44px;
```

### Headline Styles

```css
--sys-typescale-headline-large: 32px, 700, 40px;
--sys-typescale-headline-medium: 28px, 700, 36px;
--sys-typescale-headline-small: 24px, 700, 32px;
```

### Title Styles

```css
--sys-typescale-title-large: 22px, 700, 28px;
--sys-typescale-title-medium: 16px, 700, 24px;
--sys-typescale-title-small: 14px, 700, 20px;
```

### Body Styles

```css
--sys-typescale-body-large: 16px, 400, 24px;
--sys-typescale-body-medium: 14px, 400, 20px;
--sys-typescale-body-small: 12px, 400, 16px;
```

---

## Spacing System (4px Grid)

```css
--sys-spacing-1: 4px;
--sys-spacing-2: 8px;
--sys-spacing-3: 12px;
--sys-spacing-4: 16px;
--sys-spacing-6: 24px;
--sys-spacing-8: 32px;
```

---

## Shape System

```css
--sys-shape-corner-extra-small: 4px;
--sys-shape-corner-small: 8px;
--sys-shape-corner-medium: 12px;
--sys-shape-corner-large: 16px;
--sys-shape-corner-full: 999px;
```

---

## Elevation System (6 Levels)

```css
--sys-elevation-level0: none;
--sys-elevation-level1: 0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px rgba(0, 0, 0, 0.12);
--sys-elevation-level2: 0px 2px 4px rgba(0, 0, 0, 0.3), 0px 2px 6px rgba(0, 0, 0, 0.12);
--sys-elevation-level3: 0px 4px 8px rgba(0, 0, 0, 0.3), 0px 4px 12px rgba(0, 0, 0, 0.12);
--sys-elevation-level4: 0px 6px 12px rgba(0, 0, 0, 0.3), 0px 8px 16px rgba(0, 0, 0, 0.12);
--sys-elevation-level5: 0px 8px 16px rgba(0, 0, 0, 0.3), 0px 12px 24px rgba(0, 0, 0, 0.12);
```

---

## Common Color Replacements

| Old Pattern                        | New M3 Token                  |
| ---------------------------------- | ----------------------------- |
| `theme.palette.primary.main`       | `var(--sys-color-primary)`    |
| `theme.palette.secondary.main`     | `var(--sys-color-secondary)`  |
| `theme.palette.error.main`         | `var(--sys-color-error)`      |
| `theme.palette.background.default` | `var(--sys-color-background)` |
| Text on primary                    | `var(--sys-color-on-primary)` |
| Text on surface                    | `var(--sys-color-on-surface)` |

---

## Common Spacing Replacements

| Old Pattern | New M3 Token           |
| ----------- | ---------------------- |
| `4px`       | No token (raw)         |
| `8px`       | `var(--sys-spacing-2)` |
| `12px`      | `var(--sys-spacing-3)` |
| `16px`      | `var(--sys-spacing-4)` |
| `24px`      | `var(--sys-spacing-6)` |
| `32px`      | `var(--sys-spacing-8)` |

---

## Component Token Mapping Examples

### Button

```typescript
<Button sx={{
  backgroundColor: 'var(--sys-color-primary)',
  color: 'var(--sys-color-on-primary)',
  padding: '8px 16px',
  borderRadius: 'var(--sys-shape-corner-extra-small)',
  fontSize: '14px',
  fontWeight: 700,
}} />
```

### Card

```typescript
<Card sx={{
  backgroundColor: 'var(--sys-color-surface-container)',
  color: 'var(--sys-color-on-surface)',
  padding: '16px',
  borderRadius: 'var(--sys-shape-corner-medium)',
  boxShadow: 'var(--sys-elevation-level1)',
}} />
```

### Typography

```typescript
<Typography sx={{
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '24px',
  color: 'var(--sys-color-on-surface)',
}} />
```

---

## Resources

- M3 Official: https://m3.material.io/
- Color System: https://m3.material.io/styles/color/overview
- Typography: https://m3.material.io/styles/typography/overview

**Version:** 1.0 | **Status:** Production Ready
