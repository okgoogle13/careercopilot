# M3 Design Token Reference Guide

**Status:** Phase 1 Complete
**Created:** November 26, 2025
**Version:** 1.0

---

## Overview

This is the definitive reference for all Material Design 3 (M3) tokens used in CareerCopilot. Use this guide when migrating components from MUI v5 legacy patterns to M3 token-based design.

### Quick Start

- All token values are defined in `frontend/src/theme/theme.ts`
- Access tokens via `theme` object in styled components
- Use CSS custom properties (`var(--sys-color-*)`) in inline styles
- Ensure all hardcoded colors are replaced with M3 tokens

---

## Color Tokens

### Primary Color System

| Purpose             | Token                                | Value     | Usage                            |
| ------------------- | ------------------------------------ | --------- | -------------------------------- |
| Primary brand color | `theme.palette.primary.main`         | `#A78BFA` | Buttons, links, active states    |
| Primary highlight   | `theme.palette.primary.light`        | `#C084FC` | Hover states, accents            |
| Primary container   | `theme.palette.primary.dark`         | `#7C3AED` | Backgrounds for primary elements |
| Text on primary     | `theme.palette.primary.contrastText` | `#1E1B4B` | Text over primary backgrounds    |

**CSS Variables:**

```css
--sys-color-primary: #a78bfa;
--sys-color-primary-accent: #c084fc;
--sys-color-primary-container: #7c3aed;
--sys-color-on-primary: #1e1b4b;
```

### Secondary Color System

| Purpose             | Token                                  | Value     | Usage                         |
| ------------------- | -------------------------------------- | --------- | ----------------------------- |
| Secondary color     | `theme.palette.secondary.main`         | `#C9C3DC` | Secondary buttons, accents    |
| Secondary container | `theme.palette.secondary.dark`         | `#474459` | Secondary backgrounds         |
| Text on secondary   | `theme.palette.secondary.contrastText` | `#312E41` | Text on secondary backgrounds |

**CSS Variables:**

```css
--sys-color-secondary: #c9c3dc;
--sys-color-secondary-container: #474459;
--sys-color-on-secondary: #312e41;
```

### Tertiary Color System

| Purpose            | Token                                 | Value     | Usage                        |
| ------------------ | ------------------------------------- | --------- | ---------------------------- |
| Tertiary color     | `theme.palette.tertiary.main`         | `#F472B6` | Tertiary accents, highlights |
| Tertiary container | `theme.palette.tertiary.dark`         | `#EC4899` | Tertiary backgrounds         |
| Text on tertiary   | `theme.palette.tertiary.contrastText` | `#831843` | Text on tertiary backgrounds |

**CSS Variables:**

```css
--sys-color-tertiary: #f472b6;
--sys-color-tertiary-container: #ec4899;
--sys-color-on-tertiary: #831843;
```

### Error Color System

| Purpose             | Token                              | Value     | Usage                          |
| ------------------- | ---------------------------------- | --------- | ------------------------------ |
| Error/warning color | `theme.palette.error.main`         | `#FFB4AB` | Error states, warnings, danger |
| Error container     | `theme.palette.error.dark`         | `#93000A` | Error backgrounds              |
| Text on error       | `theme.palette.error.contrastText` | `#690005` | Text over error backgrounds    |

**CSS Variables:**

```css
--sys-color-error: #ffb4ab;
--sys-color-error-container: #93000a;
--sys-color-on-error: #690005;
```

### Surface & Background Colors

| Purpose                       | Token                                    | Value     | Usage                       |
| ----------------------------- | ---------------------------------------- | --------- | --------------------------- |
| **Background**                | `theme.palette.background.default`       | `#131318` | Page background             |
| **Surface (Paper)**           | `theme.palette.background.paper`         | `#1E1E23` | Default card background     |
| **Surface Main**              | `theme.palette.surface.main`             | `#131318` | Primary surface color       |
| **Surface Variant**           | `theme.palette.surface.variant`          | `#1F1F23` | Variant surface             |
| **Surface Container Low**     | `theme.palette.surface.containerLow`     | `#18181D` | Lowest elevation surface    |
| **Surface Container**         | `theme.palette.surface.container`        | `#1E1E23` | Default container           |
| **Surface Container High**    | `theme.palette.surface.containerHigh`    | `#262629` | Elevated container          |
| **Surface Container Highest** | `theme.palette.surface.containerHighest` | `#2E2E32` | Highest elevation container |

**CSS Variables:**

```css
--sys-color-background: #131318;
--sys-color-surface: #131318;
--sys-color-surface-variant: #1f1f23;
--sys-color-surface-container-low: #18181d;
--sys-color-surface-container: #1e1e23;
--sys-color-surface-container-high: #262629;
--sys-color-surface-container-highest: #2e2e32;
```

### Text & Outline Colors

| Purpose             | Token                           | Value     | Usage                       |
| ------------------- | ------------------------------- | --------- | --------------------------- |
| **Text Primary**    | `theme.palette.text.primary`    | `#F8FAFC` | Main text, headings         |
| **Text Secondary**  | `theme.palette.text.secondary`  | `#E2E8F0` | Secondary text, labels      |
| **Text Disabled**   | `theme.palette.text.disabled`   | `#928F99` | Disabled text, subtle text  |
| **Divider**         | `theme.palette.divider`         | `#48464F` | Borders, dividers, outlines |
| **Outline Main**    | `theme.palette.outline.main`    | `#928F99` | Primary outline color       |
| **Outline Variant** | `theme.palette.outline.variant` | `#48464F` | Secondary outline color     |

**CSS Variables:**

```css
--sys-color-on-surface: #f8fafc;
--sys-color-on-surface-variant: #e2e8f0;
--sys-color-outline: #928f99;
--sys-color-outline-variant: #48464f;
```

### Status Colors (Custom)

| Purpose         | Token                 | Value     | Usage                          |
| --------------- | --------------------- | --------- | ------------------------------ |
| Danger/Critical | `theme.status.danger` | `#FFB4AB` | Critical alerts, danger states |

---

## Typography Tokens

### Font Family

```typescript
fontFamily: '"Google Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
```

### Heading Styles

| Variant | Severity        | Font Weight | Font Size | Line Height | Letter Spacing | Usage                  |
| ------- | --------------- | ----------- | --------- | ----------- | -------------- | ---------------------- |
| **h1**  | Display Large   | 700         | 64px      | 1.2         | -0.02em        | Page titles, hero text |
| **h2**  | Display Medium  | 600         | 48px      | 1.2         | 0              | Section titles         |
| **h3**  | Display Small   | 600         | 32px      | 1.3         | 0              | Subsection titles      |
| **h4**  | Headline Large  | 600         | 24px      | 1.4         | 0              | Component headings     |
| **h5**  | Headline Medium | 600         | 18px      | 1.4         | 0              | Card titles            |
| **h6**  | Headline Small  | 600         | 16px      | 1.5         | 0              | Label headings         |

### Body Text Styles

| Variant     | Severity    | Font Weight | Font Size | Line Height | Usage                        |
| ----------- | ----------- | ----------- | --------- | ----------- | ---------------------------- |
| **body1**   | Body Large  | 400         | 16px      | 1.5         | Main body text, descriptions |
| **body2**   | Body Medium | 400         | 14px      | 1.5         | Secondary text, metadata     |
| **caption** | Body Small  | 400         | 12px      | 1.5         | Fine print, timestamps       |
| **button**  | Button Text | 500         | 14px      | 1.5         | Button labels                |

### Usage in Components

**React Typography Component:**

```tsx
// Import Typography from @mui/material
import { Typography } from '@mui/material';

// Use appropriate variants
<Typography variant="h1">Page Title</Typography>        {/* 64px, 700 weight */}
<Typography variant="h4">Component Heading</Typography>   {/* 24px, 600 weight */}
<Typography variant="body1">Body text here</Typography>   {/* 16px, 400 weight */}
```

**Styled Components:**

```tsx
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const StyledHeading = styled(Typography)(({ theme }) => ({
  fontSize: "24px",
  fontWeight: 600,
  lineHeight: 1.4,
}));
```

---

## Spacing Tokens

### 4px Base Grid System

M3 uses a **4px base grid**. All spacing should be a multiple of 4:

| Size | Pixels | Token              | CSS         | Usage               |
| ---- | ------ | ------------------ | ----------- | ------------------- |
| xs   | 4px    | `theme.spacing(1)` | `gap: 4px`  | Tight spacing       |
| sm   | 8px    | `theme.spacing(2)` | `gap: 8px`  | Regular padding     |
| md   | 12px   | `theme.spacing(3)` | `gap: 12px` | Medium spacing      |
| lg   | 16px   | `theme.spacing(4)` | `gap: 16px` | Large padding       |
| xl   | 24px   | `theme.spacing(6)` | `gap: 24px` | Extra large spacing |
| 2xl  | 32px   | `theme.spacing(8)` | `gap: 32px` | 2x extra large      |

**Note:** `theme.spacing()` multiplies by 4px base, so `theme.spacing(2)` = 8px

### Spacing Pattern Examples

```tsx
// BEFORE (MUI v5 - hardcoded)
const Card = styled(Box)(({ theme }) => ({
  padding: "20px", // ❌ Wrong - breaks grid
  margin: "12px auto", // ✓ Okay - 3x grid
  gap: "8px", // ✓ Good - 2x grid
}));

// AFTER (M3 - grid aligned)
const Card = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4), // ✓ 16px = 4x grid
  margin: theme.spacing(3), // ✓ 12px = 3x grid
  gap: theme.spacing(2), // ✓ 8px = 2x grid
}));
```

---

## Shape Tokens

### Border Radius

| Purpose     | Value | Token                      | Usage                    |
| ----------- | ----- | -------------------------- | ------------------------ |
| Small       | 4px   | N/A                        | Minimal rounding         |
| Medium      | 12px  | `theme.shape.borderRadius` | Default (buttons, cards) |
| Large       | 16px  | N/A                        | Cards, elevated surfaces |
| Extra Large | 24px  | N/A                        | Large containers         |

**Theme Default:**

```typescript
shape: {
  borderRadius: 12; // 12px default for buttons, cards
}
```

---

## Shadow/Elevation Tokens

### Custom Shadows (Glow Effects)

| Token                               | Formula                             | Usage                 |
| ----------------------------------- | ----------------------------------- | --------------------- |
| `theme.customShadows.glowPrimary`   | `0 0 16px ${alpha(primary, 0.4)}`   | Primary glow effect   |
| `theme.customShadows.glowSecondary` | `0 0 16px ${alpha(secondary, 0.4)}` | Secondary glow effect |
| `theme.customShadows.glowTertiary`  | `0 0 16px ${alpha(tertiary, 0.4)}`  | Tertiary glow effect  |
| `theme.customShadows.glowAurora`    | `0 0 64px ${alpha(primary, 0.2)}`   | Large aurora glow     |
| `theme.customShadows.glass`         | `0 4px 30px rgba(0, 0, 0, 0.1)`     | Glass morphism shadow |
| `theme.customShadows.glassHover`    | `0 8px 40px rgba(0, 0, 0, 0.15)`    | Glass hover shadow    |

### Usage Example

```tsx
const GlowingCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.customShadows.glowPrimary, // Adds primary glow
  "&:hover": {
    boxShadow: theme.customShadows.glowSecondary,
  },
}));
```

---

## Glass Morphism Tokens

### Glass Effect Tokens

```typescript
glass: {
  background: 'rgba(30, 30, 35, 0.7)',        // Frosted background
  backgroundHover: 'rgba(38, 38, 41, 0.8)',   // Hover background
  border: 'rgba(167, 139, 250, 0.2)',         // Purple border
  borderHover: 'rgba(244, 114, 182, 0.4)',    // Pink border on hover
  blur: '24px',                                // Backdrop blur amount
}
```

### Glass Card Variant

Available on `<Card>` and `<Paper>` components:

```tsx
<Card variant="glass">{/* Glass morphism card with frosted background */}</Card>
```

---

## Color Replacement Reference

### Common Old → New Mappings

| Old Pattern                              | New M3 Token                             | Reason             |
| ---------------------------------------- | ---------------------------------------- | ------------------ |
| `theme.palette.primary.main`             | `theme.palette.primary.main`             | ✓ Already M3       |
| `theme.palette.secondary.main`           | `theme.palette.secondary.main`           | ✓ Already M3       |
| `#fff` / `white`                         | `theme.palette.surface.containerHighest` | Text background    |
| `#000` / `black`                         | `theme.palette.background.default`       | Dark background    |
| Hardcoded `#ABCDEF`                      | Replace with M3 token                    | Find closest match |
| `alpha(theme.palette.primary.main, 0.5)` | Use `alpha()` helper                     | ✓ Use helper       |

### Example Replacements

```tsx
// BEFORE
const OldComponent = styled(Box)(({ theme }) => ({
  backgroundColor: "#131318",
  color: "#F8FAFC",
  borderColor: "#48464F",
  borderRadius: "12px",
}));

// AFTER
const NewComponent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
}));
```

---

## Validation Checklist

Use this checklist when migrating a component:

### Colors

- [ ] All hardcoded color values replaced with M3 tokens
- [ ] Text colors use `text.primary` or `text.secondary`
- [ ] Background colors use `background.*` or `surface.*`
- [ ] Border colors use `divider` or `outline.*`
- [ ] Error states use `error.*` colors
- [ ] No `theme.palette.background.paper` (use `surface.container`)

### Typography

- [ ] All text wrapped in `<Typography>` component with proper variant
- [ ] Font sizes match M3 scale (h1-h6, body1-2, caption)
- [ ] Font weight follows variant specifications
- [ ] No custom font sizes outside M3 scale

### Spacing

- [ ] All spacing is multiple of 4px (4, 8, 12, 16, 24, 32, etc.)
- [ ] Use `theme.spacing()` instead of hardcoded px
- [ ] Padding/margin follow M3 grid
- [ ] Gap/flex spacing uses M3 grid

### Shadows

- [ ] Elevation shadows use custom shadow tokens
- [ ] Glass effects use `theme.glass.*` tokens
- [ ] Glow effects use `theme.customShadows.*` tokens

### Shapes

- [ ] Border radius uses `theme.shape.borderRadius` (12px)
- [ ] No hardcoded border-radius values

### Accessibility

- [ ] Text contrast ratios meet WCAG AA standard
- [ ] Focus states have sufficient visual indicators
- [ ] Color not used as only means of conveying information

---

## Migration Best Practices

### 1. Color Replacement Strategy

```tsx
// Step 1: Identify all colors in component
// Step 2: Match to M3 token from this guide
// Step 3: Replace in code
// Step 4: Verify contrast ratios with WCAG validator
```

### 2. Typography Standardization

```tsx
// Always use Typography component
<Typography variant="h4">Component Title</Typography>

// Never use styled divs with font size
// ❌ <div style={{ fontSize: '24px' }}>Title</div>
// ✓ <Typography variant="h4">Title</Typography>
```

### 3. Spacing Alignment

```tsx
// Use theme.spacing() function
const Box = styled("div")(({ theme }) => ({
  padding: theme.spacing(2), // 8px
  margin: theme.spacing(3), // 12px
  gap: theme.spacing(4), // 16px
}));
```

### 4. Validation Process

```tsx
// After migration:
// 1. Run TypeScript compiler
// 2. Check for visual regressions
// 3. Test responsive breakpoints
// 4. Verify WCAG accessibility
// 5. Test dark/light mode (if applicable)
```

---

## CSS Custom Properties (Alternative)

If using CSS custom properties instead of theme object:

```css
/* Colors */
--sys-color-primary: #a78bfa;
--sys-color-secondary: #c9c3dc;
--sys-color-tertiary: #f472b6;
--sys-color-error: #ffb4ab;
--sys-color-surface: #131318;
--sys-color-background: #131318;
--sys-color-on-surface: #f8fafc;
--sys-color-outline: #928f99;

/* Spacing (4px grid) */
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-6: 24px;
--spacing-8: 32px;

/* Shadows */
--shadow-glow-primary: 0 0 16px rgba(167, 139, 250, 0.4);
--shadow-glass: 0 4px 30px rgba(0, 0, 0, 0.1);
```

**Usage in CSS:**

```css
.component {
  background-color: var(--sys-color-surface);
  color: var(--sys-color-on-surface);
  padding: var(--spacing-4);
  border: 1px solid var(--sys-color-outline);
  border-radius: 12px;
}
```

---

## Questions & Troubleshooting

### Q: What token should I use for this color?

**A:** Check the "Color Tokens" section above. If not found, look for the closest semantic match (e.g., error states use `error.*`, surfaces use `surface.*`).

### Q: Can I use hardcoded hex colors?

**A:** **No.** All colors must use M3 tokens for consistency. If a color isn't in the system, request it through design team.

### Q: What about responsive spacing?

**A:** Use `theme.breakpoints` to change spacing at different screen sizes:

```tsx
const responsive = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4),
  },
}));
```

### Q: How do I create custom colors?

**A:** Don't. All colors must come from the M3 token system. To add a new color, contact design team to add to `theme.ts`.

---

## Related Documentation

- **Full Migration Plan:** [M3_MIGRATION_PLAN.md](./M3_MIGRATION_PLAN.md)
- **Migration Summary:** [M3_MIGRATION_SUMMARY.md](./M3_MIGRATION_SUMMARY.md)
- **Expressive Enhancements:** [M3_EXPRESSIVE_ENHANCEMENTS.md](./M3_EXPRESSIVE_ENHANCEMENTS.md)

---

**Document Version:** 1.0
**Status:** Phase 1 Complete
**Last Updated:** November 26, 2025
