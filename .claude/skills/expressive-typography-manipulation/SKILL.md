---
name: expressive-typography-manipulation
description: Technical implementation guide for Material Design 3 Expressive Typography.
  Contains code patterns for variable font axis manipulation (wght, wdth, opsz), semantic
  token theming, and Framer Motion typographic animations with spring physics.
metadata:
  legacy_frontmatter:
    version: 1.0.0
    tags: []
---

# Expressive Typography Manipulation (Material Design 3 Expressive)

## Purpose

Technical implementation guide for Material Design 3 Expressive Typography. Provides code patterns for variable font axis manipulation, semantic token theming, and spring physics animations.

## When to Use

- When implementing variable font axes (wght, wdth, opsz) in CSS or React.
- When creating "alive" interaction patterns (bloom effects, weight shifts) for M3 Expressive components.
- When mapping scroll position or user input to typographic animations.
- When ensuring theme tokens and dark mode are correctly applied to typography.

## Process

1. **Token Definition**: Establish variable font tokens in `:root` (wght, wdth, opsz).
2. **Interaction Mapping**: Implement hover and state patterns using `font-variation-settings`.
3. **Animation Implementation**: Apply Framer Motion transforms for scroll-linked or entrance animations.
4. **Theme Alignment**: Synchronize typography with M3 semantic color tokens and dark mode.

## M3 Expressive Typography Fundamentals

This skill implements **three-tier typography system** for M3 Expressive:

| Tier                             | Font                       | Weight Range | Purpose                             |
| -------------------------------- | -------------------------- | ------------ | ----------------------------------- |
| **Display (Hero/Emphasis)**      | Sora Variable              | 300-900      | Headlines, key announcements, drama |
| **Body (Workhorse/Readability)** | Plus Jakarta Sans Variable | 200-800      | Body text, labels, supporting       |
| **Accent (Flourish/Signal)**     | Poppins Variable           | 100-900      | Alerts, special states, emphasis    |

Each tier uses **variable fonts** with **extreme weight manipulation** to create M3 Expressive visual drama.

---

## Section 1: The Variable Font Token System

Define these CSS Variables to control M3 Expressive typography globally.

```css
:root {
  /* --- M3 Expressive Display (Headlines) --- */
  --font-display: "Sora Variable", sans-serif;
  --type-display-weight-light: 300;
  --type-display-weight-bold: 900;
  --type-display-optical-sizing: auto;

  /* --- M3 Expressive Body (Workhorse/Text) --- */
  --font-body: "Plus Jakarta Sans Variable", sans-serif;
  --type-body-weight-light: 200;
  --type-body-weight-regular: 400;
  --type-body-weight-bold: 700;
  --type-body-weight-extra-bold: 800;
  --type-body-optical-sizing: auto;

  /* --- M3 Expressive Accent (Emphasis/States) --- */
  --font-accent: "Poppins Variable", sans-serif;
  --type-accent-weight-light: 100;
  --type-accent-weight-bold: 900;
  --type-accent-optical-sizing: auto;

  /* --- M3 Expressive Motion (Shared) --- */
  --sys-motion-easing-expressive: cubic-bezier(0.34, 1.56, 0.64, 1);
  --sys-motion-duration-short: 50ms;
  --sys-motion-duration-medium: 250ms;
  --sys-motion-duration-long: 500ms;
}
```

---

## Section 2: M3 Expressive Interaction Patterns

M3 Expressive interactions use **variable font weight shifts** to create "alive" hover states without layout reflow.

### Pattern 1: Weight-Shift Hover (No Layout Change)

Use variable font weight instead of standard `font-weight: bold` to avoid layout shift.

```tsx
import styled from "styled-components";

// ❌ BAD - Causes layout shift
const BadButton = styled.button`
  font-weight: 400;
  &:hover {
    font-weight: 700; // Changes width, causes reflow
  }
`;

// ✅ GOOD - M3 Expressive weight shift
const GoodButton = styled.button`
  font-family: var(--font-body);
  font-weight: 500;
  font-variation-settings: "wght" 500;
  transition: font-variation-settings 300ms var(--sys-motion-easing-expressive);

  &:hover {
    font-variation-settings: "wght" 700; // Weight shifts, no width change
    cursor: pointer;
  }
`;
```

**Why This Works**:

- Variable fonts have internal spacing adjustments
- Weight shift happens within the same glyph metrics
- No reflow, no layout jump
- Feels responsive and M3 Expressive

### Pattern 2: Scale + Weight Bloom (Hover Effect)

Combine weight shift with scale for M3 Expressive "bloom" effect:

```css
.expressive-button {
  font-family: var(--font-body);
  font-weight: 500;
  font-variation-settings: "wght" 500;
  scale: 1;
  transition:
    font-variation-settings 300ms var(--sys-motion-easing-expressive),
    scale 300ms var(--sys-motion-easing-expressive);
}

.expressive-button:hover {
  font-variation-settings: "wght" 700;  // Bolder
  scale: 1.03;  // Slightly larger
}
```

**Result**: Button "blooms" on hover (gets bolder + slightly bigger), M3 Expressive signature effect.

### Pattern 3: Display Font Weight Range (Hero Drama)

Display fonts use extreme weight range to create visual drama:

```tsx
export const HeroHeadline = ({ isLoaded }: { isLoaded: boolean }) => (
  <h1
    style={{
      fontFamily: "var(--font-display)",
      fontSize: "57px",
      fontWeight: isLoaded ? 900 : 300, // 900 when content loads
      fontVariationSettings: isLoaded ? '"wght" 900' : '"wght" 300',
      transition: "font-variation-settings 500ms var(--sys-motion-easing-expressive)",
    }}
  >
    Expressive Typography
  </h1>
);
```

**Result**: Hero headline "grows" from thin (300) to bold (900) when page loads, M3 Expressive micro-interaction.

### Pattern 4: Body Font Legibility Adjustment

Body font uses moderate weight range for clarity:

```css
.body-text {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 400;
  font-variation-settings: "wght" 400;
}

/* Emphasis within body */
.body-text strong {
  font-weight: 700;
  font-variation-settings: "wght" 700;
}

/* De-emphasis (secondary info) */
.body-text .secondary {
  font-weight: 300;
  font-variation-settings: "wght" 300;
}
```

**Result**: Body text has readable hierarchy (light → regular → bold) without font changes.

---

## Section 3: Scroll-Driven Expressive Typography

M3 Expressive enables dramatic typography shifts via scroll position, creating "living" headers.

### Pattern: Scroll-Linked Weight (Breathing Header)

As user scrolls, display font weight increases (text gets bolder), creating "breathing" effect:

```tsx
import { motion, useScroll, useTransform } from "framer-motion";

export const ScrollDrivenHeader = () => {
  const { scrollYProgress } = useScroll();

  // Map scroll progress (0→1) to weight range (300→900)
  const displayWeight = useTransform(
    scrollYProgress,
    [0, 0.5], // At 0% scroll: weight 300, at 50% scroll: weight 900
    [300, 900],
  );

  return (
    <motion.h1
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "57px",
        fontVariationSettings: displayWeight.get() ? `"wght" ${displayWeight}` : '"wght" 300',
      }}
    >
      M3 Expressive
    </motion.h1>
  );
};
```

**Result**: As user scrolls down, header gets progressively bolder (300 → 900), then stays bold. Signature M3 Expressive "living header" pattern.

### Pattern: Scroll-Linked Width (Compressing Header)

Alternatively, compress header width on scroll (requires font with wdth axis):

```tsx
// Use Sora or Plus Jakarta Sans which support width axis
const width = useTransform(scrollYProgress, [0, 1], [100, 75]); // Normal → Compressed

<motion.h1
  style={{
    fontVariationSettings: `"wdth" ${width}`,
  }}
>
  Compressed Header
</motion.h1>;
```

**Result**: Header compresses horizontally as user scrolls (useful for mobile).

### Pattern: Scroll-Linked Scale (Entrance Animation)

Combine weight + scale for entrance animation:

```tsx
const visibility = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
const weight = useTransform(scrollYProgress, [0, 0.2], [300, 700]);
const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

<motion.h2
  style={{
    opacity: visibility,
    fontVariationSettings: `"wght" ${weight}`,
    scale: scale,
    transition: "all 300ms var(--sys-motion-easing-expressive)",
  }}
>
  Scroll to Reveal
</motion.h2>;
```

**Result**: Section heading fades in, becomes bolder, and scales up as it enters viewport. M3 Expressive entrance pattern.

---

## Section 4: Semantic Token Theming (M3 Expressive)

M3 Expressive uses semantic token theming to switch between vibrant and reduced-contrast modes.

### Pattern: Dark Mode with Vibrant Tokens

M3 Expressive is dark-first. Body background is dark (#1A1714), text is light (#F5F0E8).

```css
:root {
  /* M3 Expressive Dark Mode (Default) */
  --sys-color-primary: #6750a4; /* Vibrant purple */
  --sys-color-primary-container: #e5d5ff; /* Light variant for contrast */
  --sys-color-on-primary: #ffffff; /* White text on vibrant primary */

  --sys-color-surface: #1a1714; /* Dark background (asphalt black) */
  --sys-color-on-surface: #f5f0e8; /* Light text (paper white) */
}
```

### Pattern: High-Contrast Mode (Accessibility)

For users with reduced-motion or high-contrast preferences:

```css
@media (prefers-contrast: more) {
  :root {
    --sys-color-primary: #3d1e6d; /* Even darker primary */
    --sys-color-on-surface: #ffffff; /* Pure white text */
  }
}
```

### Pattern: Reduced-Motion (M3 Expressive Graceful Fallback)

For users with `prefers-reduced-motion: reduce`, disable motion:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**M3 Expressive Principle**: Motion is personality, but accessibility is non-negotiable. Always respect `prefers-reduced-motion`.

---

## Section 5: M3 Expressive Accent Patterns

### Pattern: Label Emphasis with Accent Font

Use Poppins Variable (accent tier) for labels that need emphasis:

```tsx
<div style={{ display: "grid", gridTemplateColumns: "1fr auto" }}>
  <label
    style={{
      fontFamily: "var(--font-body)",
      fontWeight: 400,
      fontSize: "14px",
    }}
  >
    Username
  </label>
  <span
    style={{
      fontFamily: "var(--font-accent)",
      fontWeight: 900, // Extreme weight for emphasis
      fontSize: "12px",
      color: "var(--sys-color-tertiary)",
    }}
  >
    Required
  </span>
</div>
```

**Result**: "Required" label stands out with Poppins bold (900), clearly distinct from body font.

### Pattern: State Indication with Font Weight

Use font weight to indicate interactive states:

```tsx
<button style={{
  fontFamily: 'var(--font-body)',
  fontWeight: 500,  // Default state
  fontVariationSettings: '"wght" 500'
}}>
  Default Button
</button>

<button disabled style={{
  fontFamily: 'var(--font-body)',
  fontWeight: 300,  // Lighter = disabled
  fontVariationSettings: '"wght" 300',
  opacity: 0.5
}}>
  Disabled Button
</button>

<button style={{
  fontFamily: 'var(--font-accent)',  // Switch to accent font for primary CTA
  fontWeight: 700,  // Bold
  fontVariationSettings: '"wght" 700'
}}>
  Primary Action
</button>
```

**Result**: Different states are visually distinct via font choice and weight.

---

## Section 6: M3 Expressive Implementation Checklist

When implementing typography in components:

### Typography Checks

1. **Font Choice** (M3 Expressive Specific)
   - ❌ FORBIDDEN: Inter, Roboto, Arial, system fonts (alone)
   - ✅ REQUIRED: Sora (display), Plus Jakarta Sans (body), Poppins (accent)
   - ✅ REQUIRED: All fonts are variable (.woff2)

2. **Weight Ranges** (M3 Expressive Extremes)
   - Display (Sora): 300 (light) → 900 (bold)
   - Body (Plus Jakarta Sans): 200 (thin) → 800 (heavy)
   - Accent (Poppins): 100 (ultra-light) → 900 (ultra-bold)
   - ✅ Minimum contrast: 3x weight ratio (not 1.25x)

3. **Optical Sizing** (M3 Expressive Critical)
   - ✅ REQUIRED: `font-optical-sizing: auto` on `:root`
   - ✅ REQUIRED: All variable fonts respect optical sizing

4. **Motion** (M3 Expressive Signature)
   - ✅ Hover states: Use font-variation-settings, not font-weight
   - ✅ Scroll animations: Map scroll to weight/width changes
   - ✅ Easing: Always cubic-bezier(0.34, 1.56, 0.64, 1) (spring physics)
   - ✅ Duration: 250-400ms (not instant, not too slow)

5. **No Forbidden Patterns** (M3 Expressive Anti-Slop)
   - ❌ FORBIDDEN: font-weight: bold on hover (causes layout shift)
   - ❌ FORBIDDEN: Static fonts (must be variable)
   - ❌ FORBIDDEN: Linear easing (must be spring physics)
   - ❌ FORBIDDEN: Instant state changes (must animate)

6. **Accessibility** (M3 Expressive + Inclusive)
   - ✅ Contrast: 4.5:1 minimum (WCAG AA)
   - ✅ Reduced motion: Respects `prefers-reduced-motion`
   - ✅ Focus states: Always visible
   - ✅ Semantic HTML: Uses proper headings, labels, etc.

---

## M3 Expressive Anti-Patterns (What NOT to Do)

### ❌ Generic Fonts

```css
/* FORBIDDEN */
font-family: "Inter", sans-serif; /* Generic, M3 Baseline only */
font-family: "Roboto", sans-serif; /* Generic, forbidden */
font-family: system-ui; /* System fonts, forbidden */
```

**Why**: Generic fonts lack personality. M3 Expressive requires distinctive fonts.

**✅ Fix**: Use Sora/Plus Jakarta Sans/Poppins:

```css
font-family: "Sora Variable", sans-serif; /* Display tier */
font-family: "Plus Jakarta Sans Variable", sans-serif; /* Body tier */
font-family: "Poppins Variable", sans-serif; /* Accent tier */
```

---

### ❌ Static Fonts (No Variable Font)

```css
/* FORBIDDEN */
font-family: "Sora-Bold.ttf"; /* Static bold, can't vary */
font-weight: 700; /* Not variable */
```

**Why**: Static fonts can't create M3 Expressive dramatic weight shifts.

**✅ Fix**: Use variable fonts:

```css
font-family: "Sora Variable", sans-serif;
font-variation-settings: "wght" 300; /* Can shift to 900 on demand */
```

---

### ❌ Timid Contrast

```css
/* FORBIDDEN - 1.25x ratio (timid) */
font-weight: 400; /* Regular */
/* On hover: */
font-weight: 500; /* Only slightly bolder */
```

**Why**: M3 Expressive requires 3x+ weight contrast, not timid shifts.

**✅ Fix**: Extreme contrast:

```css
font-variation-settings: "wght" 300; /* Light display */
/* On state change: */
font-variation-settings: "wght" 900; /* Bold emphasis (9x contrast) */
```

---

### ❌ Layout Shift on Hover

```css
/* FORBIDDEN - Causes reflow */
font-weight: 400;
:hover {
  font-weight: 700; /* Width changes, layout jumps */
}
```

**Why**: Weight changes with static fonts cause layout shifts. M3 Expressive feels janky.

**✅ Fix**: Use variable fonts:

```css
font-variation-settings: "wght" 400;
transition: font-variation-settings 300ms var(--sys-motion-easing-expressive);
:hover {
  font-variation-settings: "wght" 700; /* No width change, smooth */
}
```

---

### ❌ Linear Easing (No Personality)

```css
/* FORBIDDEN - Feels mechanical */
transition: all 300ms linear;
```

**Why**: Linear easing feels robotic. M3 Expressive requires spring physics.

**✅ Fix**: Use M3 Expressive easing:

```css
transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1); /* Spring overshoot */
```

---

### ❌ No Optical Sizing

```css
/* FORBIDDEN - At large sizes, looks crude */
font-family: "Sora Variable", sans-serif;
font-optical-sizing: none; /* Disabled! */
font-size: 57px; /* Looks pixelated */
```

**Why**: Without optical sizing, large text looks rough. M3 Expressive requires finesse.

**✅ Fix**: Enable optical sizing:

```css
:root {
  font-optical-sizing: auto; /* Global, all fonts */
}

.display-large {
  font-size: 57px; /* Now looks polished */
}
```

---

### ❌ No Animation (Static Components)

```jsx
/* FORBIDDEN - Feels dead */
<button>{text}</button>
/* No hover effect, no state change animation */
```

**Why**: M3 Expressive components should feel alive and responsive.

**✅ Fix**: Add typography animation:

```jsx
<button
  style={{
    fontVariationSettings: '"wght" 500',
    transition: "font-variation-settings 300ms ...",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.fontVariationSettings = '"wght" 700';
  }}
>
  {text}
</button>
```

---

## Related Skills

- [m3-expressive-typography-enhancer](../design-skills/m3-expressive-typography-enhancer/SKILL.md) - Strategic typography guidance
- [m3-anti-slop-validator](../design-skills/m3-anti-slop-validator/SKILL.md) - Validate against M3 Expressive standards
- [m3-visual-audit](../m3-visual-audit/SKILL.md) - Audit component typography rendering

---

**Version:** 3.0.0 (M3 Expressive)
**Status:** Production Ready
