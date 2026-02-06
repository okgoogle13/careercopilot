1---
name: m3-expressive-typography-enhancer
description: Elevate typography with Material Design 3 Expressive variable fonts, extreme weight contrasts (100 vs 900), optical sizing, and emotional tone guidance. Forbids generic fonts (Inter, Roboto, Arial). Enforces M3 Expressive semantic type scale and high-contrast font pairings.
---

# M3 Expressive Typography Enhancer

## Purpose

Elevate typography beyond basic token replacement with variable fonts, extreme weight contrasts, and emotional tone mapping. Transforms boring typography (Inter 400 vs 500) into expressive, memorable typography (100 vs 900) that conveys personality and meaning.

## When to Use

Use this skill when you need to:

- **Choose expressive fonts** that avoid generic defaults (Inter, Roboto, Arial)
- **Implement variable fonts** with fluid weight transitions
- **Create extreme contrasts** (9x weight difference, not 1.25x)
- **Map typography to emotion** (playful, confident, elegant, technical)
- **Validate font choices** against M3 Expressive principles
- **Establish font pairings** (display + monospace, serif + geometric)
- **Upgrade existing typography** from timid to dramatic

**Trigger scenarios:**

- "This typography feels generic and boring"
- "How do I make typography more expressive?"
- "What font conveys confidence and professionalism?"
- "Replace Inter with something distinctive"

## Overview

This skill enhances M3 typography with M3 Expressive principles:

1. **Variable Font Integration** - Font-variation-settings for fluid weight/width transitions
2. **Extreme Weight Contrasts** - 100 vs 900 (not 400 vs 600), 3x+ size jumps
3. **Emotional Tone Mapping** - Typography that conveys personality
4. **Anti-Slop Validation** - Reject generic fonts (Inter, Roboto, Arial)
5. **Expressive Font Pairing** - High-contrast combinations

## M3 Expressive Type Scale (Required Reference)

Material Design 3 Expressive uses a semantic type scale that must be paired with vibrant fonts:

| Type Scale          | M3 Expressive Font         | Weight Range | Use Case                          |
| ------------------- | -------------------------- | ------------ | --------------------------------- |
| **Display Large**   | Sora/Poppins Variable      | 300-900      | Hero headlines, key announcements |
| **Display Medium**  | Sora/Poppins Variable      | 400-800      | Feature headlines                 |
| **Display Small**   | Sora/Poppins Variable      | 500-700      | Section headings                  |
| **Headline Large**  | Plus Jakarta Sans Variable | 600-800      | Card headers, emphasis            |
| **Headline Medium** | Plus Jakarta Sans Variable | 500-700      | Subsection headers                |
| **Headline Small**  | Plus Jakarta Sans Variable | 400-600      | Small headers                     |
| **Title Large**     | Plus Jakarta Sans Variable | 500-700      | Dialog titles                     |
| **Title Medium**    | Plus Jakarta Sans Variable | 400-600      | Medium titles                     |
| **Title Small**     | Plus Jakarta Sans Variable | 400-600      | Small titles                      |
| **Body Large**      | Plus Jakarta Sans Variable | 300-500      | Long-form body text               |
| **Body Medium**     | Plus Jakarta Sans Variable | 300-500      | Standard body text                |
| **Body Small**      | Plus Jakarta Sans Variable | 300-500      | Small body text                   |
| **Label Large**     | Plus Jakarta Sans Variable | 500-700      | Button labels, chips              |
| **Label Medium**    | Plus Jakarta Sans Variable | 400-600      | Medium labels                     |
| **Label Small**     | Plus Jakarta Sans Variable | 400-600      | Small labels, badges              |

**M3 Expressive Addition**: Use variable font axes to create **extreme contrasts**:

- Display Large (hero): wght 300 at 57px → "thin and tall"
- Body Medium (supporting): wght 700 at 14px → "bold and small"
- Ratio: 4x weight difference + 4x size difference = Visual drama

This creates the characteristic "M3 Expressive" feel: elegant/powerful contrast, not timid.

## M3 Expressive Typography Principles

### 1. Variable Fonts (Fluid Typography)

**M3 Expressive Variable Fonts** (Ranked by Expressiveness):

1. **Sora** (100-800) - Recommended for Display/Headlines
   - ✅ Tech-forward, unique, highly variable
   - ✅ Extreme weight range (100-800)
   - ✅ Perfect for "thin elegant" to "bold dramatic" contrast
   - Use: Display Large, Display Medium, Feature headlines

2. **Poppins** (100-900) - Recommended for Display/Accent
   - ✅ Elegant, extremely versatile
   - ✅ Full weight range (100-900)
   - ✅ Supports extreme 9x weight ratio
   - Use: Hero headlines, emphasis, accent

3. **Plus Jakarta Sans** (200-800) - Recommended for Body/Labels
   - ✅ Modern, professional, highly readable
   - ✅ Supports extreme weight contrast
   - ✅ Perfect for Display + Body pairing (300 vs 700)
   - Use: Body text, labels, supporting text

4. **Montserrat** (100-900) - Recommended for Geometric Display
   - ✅ Bold, geometric, distinctive
   - ✅ Full weight range
   - ✅ High personality
   - Use: Alternative to Sora for bold brands

**Forbidden**: Inter, Roboto, Open Sans, Arial, Helvetica, system fonts (unless paired with distinctive display font)

**Example:**

```css
.expressive-heading {
  font-family: "Plus Jakarta Sans Variable", sans-serif;
  font-variation-settings: "wght" 800;
  transition: font-variation-settings 300ms var(--sys-motion-easing-expressive);
}

.expressive-heading:hover {
  font-variation-settings: "wght" 900;
}
```

### 2. Extreme Weight Contrasts

**Anti-Pattern (Boring):**

```tsx
// ❌ Timid contrast - 1.25x ratio
<h1 style={{ fontWeight: 400 }}>Heading</h1>
<p style={{ fontWeight: 500 }}>Body</p>
```

**M3 Expressive (Dramatic):**

```tsx
// ✅ Extreme contrast - 9x ratio
<h1 style={{
  fontWeight: 100,
  fontSize: 'var(--sys-type-display-large-size)',
  letterSpacing: '-0.02em'
}}>Heading</h1>
<p style={{
  fontWeight: 900,
  fontSize: 'var(--sys-type-body-small-size)'
}}>Subtext</p>
```

### 3. Optical Sizing (Critical for M3 Expressive)

Optical sizing automatically adjusts font details for readability at different sizes. M3 Expressive REQUIRES optical sizing.

**Why It Matters**:

- At small sizes (12px): Serifs wider, contrast adjusted for clarity
- At large sizes (57px): Serifs thinner, contrast maximized for drama
- Creates the "M3 Expressive" feel: elegant at all scales

**Implementation**:

```css
:root {
  font-optical-sizing: auto; /* REQUIRED for all variable fonts */
}

.expressive-headline {
  font-family: "Sora Variable", sans-serif;
  font-size: 57px;
  font-weight: 300;
  font-optical-sizing: auto; /* Sora adjusts finesse for large display */
}

.expressive-body {
  font-family: "Plus Jakarta Sans Variable", sans-serif;
  font-size: 14px;
  font-weight: 400;
  font-optical-sizing: auto; /* Plus Jakarta Sans adjusts for small text */
}
```

### 4. Emotional Tone Mapping

**Playful & Energetic** → Montserrat 900 + Nunito 400
**Confident & Professional** → Plus Jakarta Sans 800 + Inter 400
**Elegant & Premium** → Poppins 300 + Open Sans 400
**Tech-Forward** → Sora 700 + Inter 400

### 5. Expressive Font Pairing

**Display + Monospace:** Plus Jakarta Sans + JetBrains Mono
**Serif + Geometric:** Playfair Display + Poppins
**Variable Across Weights:** Montserrat 900 + Montserrat 300

### 6. Variable Font Animation (M3 Expressive Motion)

M3 Expressive brings typography to life through variable font axis animation.

**Pattern: Scroll-Driven Typography**

As user scrolls, typography transforms via variable font axes:

```tsx
import { motion, useScroll, useTransform } from "framer-motion";

export const ScrollExpressiveHeader = () => {
  const { scrollYProgress } = useScroll();

  // As user scrolls (0 → 1), weight changes (300 → 700)
  const weight = useTransform(scrollYProgress, [0, 1], [300, 700]);

  return (
    <motion.h1
      style={{
        fontFamily: "Plus Jakarta Sans Variable",
        fontVariationSettings: weight.get() ? `"wght" ${weight}` : '"wght" 300',
      }}
    >
      Expressive Typography
    </motion.h1>
  );
};
```

**Pattern: Hover-Driven Typography**

On hover, typography becomes more "expressive" (bolder, more extreme):

```css
.expressive-button {
  font-family: "Plus Jakarta Sans Variable";
  font-weight: 500;
  transition: font-variation-settings 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.expressive-button:hover {
  font-weight: 700; /* Becomes bolder on hover */
  /* Alternatively, use GRAD axis for layout-safe hover */
  font-variation-settings: "GRAD" 150;
}
```

**M3 Expressive Motion Easing**: Always use `cubic-bezier(0.34, 1.56, 0.64, 1)` for that characteristic "springy" feel.

## Usage

```bash
m3-expressive-typography-enhancer \
  --file frontend/src/components/ui/Card/Card.tsx \
  --tone "confident-professional" \
  --validate-anti-slop
```

## M3 Expressive Validation Checklist

- [ ] **No forbidden fonts**: Only Plus Jakarta Sans, Sora, Poppins, Montserrat (not Inter, Roboto, Arial)
- [ ] **Weight contrast ≥ 3x**: Display at 300 weight, Body at 700 weight (or similar extreme)
- [ ] **Size contrast ≥ 3x**: Display 57px vs Body 14px (or similar 3x+ ratio)
- [ ] **Variable fonts enabled**: Using .woff2 variable files, not static weights
- [ ] **Optical sizing**: `font-optical-sizing: auto` set globally
- [ ] **Emotional tone**: Typography conveys intended emotion (playful, confident, elegant, technical)
- [ ] **High-contrast font pairing**: Display + Body fonts visually distinct (not same family)
- [ ] **Letter spacing**: Applied intentionally, supports readability at all sizes
- [ ] **Animation**: Typography responds to user interaction (scroll, hover) via variable axes
- [ ] **Motion easing**: Uses M3 Expressive easing (cubic-bezier overshoot), not linear
- [ ] **M3 type scale**: Follows semantic type scale (Display Large → Label Small)
- [ ] **No AI slop**: Typography feels intentional, not generic

## Troubleshooting

### Variable Fonts Not Loading

**Solution:**

```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap" rel="stylesheet" />
```

### Weight Contrast Too Extreme

**Solution:**
Start with 300 vs 700, gradually increase to 100 vs 900

### Font Pairing Incoherent

**Solution:**
Use same family at different weights or ensure emotional tone consistency

## Related Skills

- [m3-anti-slop-validator](../m3-anti-slop-validator/SKILL.md) - Validate typography against M3 Expressive standards
- [m3-visual-audit](../../../m3-visual-audit/SKILL.md) - Audit component typography rendering
- [expressive-typography-manipulation](../../../expressive-typography-manipulation/SKILL.md) - Technical implementation patterns
- [brand-brief-optimizer](../../../brand-brief-optimizer/SKILL.md) - Brief clarity on typography standards

---

**Version:** 3.0.0 (M3 Expressive)
**Status:** Production Ready
