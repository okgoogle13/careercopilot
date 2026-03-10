# M3 Expressive Typography Enhancer

**Purpose:** Elevate typography beyond basic token replacement with variable fonts, extreme weight contrasts, and emotional tone guidance.

**Input:** Component file path + tokens-expressive.json + aesthetic preferences
**Output:** Expressive typography system with variable fonts and dramatic hierarchy

---

## Overview

This skill enhances M3 typography with M3 Expressive principles:

1. **Variable Font Integration** - Use font-variation-settings for fluid weight/width transitions
2. **Extreme Weight Contrasts** - 100 vs 900, not 400 vs 600 (3x+ size jumps, not 1.5x)
3. **Emotional Tone Mapping** - Typography that conveys personality (playful, confident, elegant)
4. **Anti-Slop Validation** - Reject generic fonts (Inter, Roboto, Arial, system fonts)
5. **Expressive Font Pairing** - High-contrast pairings (display + monospace, serif + geometric)

---

## M3 Expressive Typography Principles

### 1. Variable Fonts (Fluid Typography)

**Why:** Variable fonts enable smooth animations between weights, creating "alive" typography that responds to user interactions.

**KR Solidarity Canonical Typography Stack (MANDATORY):**

For `kr-solidarity` projects, the following font stack is strict. **Do not use any other fonts.**

- **UI/Primary**: `Work Sans` (Variable 100-900)
- **Display/Expressive**: `Fraunces` (Variable opsz, wght, SOFT, WONK)
- **Proclamation**: `Libre Bodoni`
- **Technical/Data**: `JetBrains Mono`
- **Curator Notes**: `Caveat` (Handwritten)
- **Hero Accent**: `Nabla`

**KR Solidarity Pressure/Relief Mechanic:**

Typography in `kr-solidarity` is not static; it responds to emotional states via variable axes:

- **Solidarity/Protest**: Max expansion (`wght: 900`, `wdth: 120`).
- **Labor Pressure**: Compressed intensity (`wght: 900`, `wdth: 75`).
- **Melancholy**: Mid-weight breathing (`wght: 475`, `wdth: 98`).
- **Assertion**: Firm stance (`wght: 700`, `wdth: 110`).

**Standard M3 Expressive Variable Fonts (Non-KR Projects):**

- **Plus Jakarta Sans** (Weight: 200-800, modern, professional)
- **Poppins** (Weight: 100-900, elegant, versatile)
- **Montserrat** (Weight: 100-900, bold, geometric)
- **Sora** (Weight: 100-800, tech-forward, unique)
- **Inter Variable** (Weight: 100-900, only if paired with distinctive display font)

**Font Variation Settings:**

```css
/* Enable variable font features */
.expressive-heading {
  font-family: "Plus Jakarta Sans Variable", sans-serif;
  font-variation-settings: "wght" 800; /* Weight axis */
  transition: font-variation-settings 300ms var(--sys-motion-easing-expressive);
}

.expressive-heading:hover {
  font-variation-settings: "wght" 900; /* Subtle weight shift on hover */
}
```

**Token Structure:**

```json
{
  "typography": {
    "display": {
      "fontFamily": "'Plus Jakarta Sans Variable', sans-serif",
      "fontWeight": "800",
      "fontVariationSettings": "'wght' 800",
      "supportsFontVariation": true
    },
    "body": {
      "fontFamily": "'Inter Variable', sans-serif",
      "fontWeight": "400",
      "fontVariationSettings": "'wght' 400",
      "supportsFontVariation": true
    }
  }
}
```

---

### 2. Extreme Weight Contrasts (Not Boring)

**Anti-Pattern (Boring):**

```tsx
// ❌ Timid contrast - no visual impact
<h1 style={{ fontWeight: 400 }}>Heading</h1>
<p style={{ fontWeight: 500 }}>Body</p>
// Contrast ratio: 1.25x (barely noticeable)
```

**M3 Expressive (Dramatic):**

```tsx
// ✅ Extreme contrast - 9x difference
<h1 style={{
  fontWeight: 100, // Ultra-light display
  fontSize: 'var(--sys-type-display-large-size)', // 57px
  letterSpacing: '-0.02em' // Tighter tracking for impact
}}>
  Heading
</h1>
<p style={{
  fontWeight: 900, // Heavy body for contrast inversion
  fontSize: 'var(--sys-type-body-small-size)' // 12px
}}>
  Subtext
</p>
// Contrast ratio: 9x (dramatic, memorable)
```

**Extreme Weight Guidelines:**

| Element           | Weight  | Purpose              | Example                 |
| ----------------- | ------- | -------------------- | ----------------------- |
| Hero Display      | 100-200 | Ultra-light elegance | Landing page headlines  |
| Display Emphasis  | 800-900 | Bold confidence      | Call-to-action headings |
| Body Text (Light) | 300     | Refined, editorial   | Long-form content       |
| Body Text (Heavy) | 700     | Confidence, trust    | Key statistics, pricing |
| Micro-copy        | 900     | High-impact labels   | Badges, tags, status    |

**Size Contrast (3x+ Rule):**

```tsx
// ❌ Boring size contrast (1.5x)
<h1 style={{ fontSize: '24px' }}>Heading</h1>
<p style={{ fontSize: '16px' }}>Body</p>

// ✅ Dramatic size contrast (4.75x)
<h1 style={{ fontSize: '57px' }}>Heading</h1>
<p style={{ fontSize: '12px' }}>Body</p>
```

---

### 3. Beyond Weight: The Dimensionality of Emotion

Variable fonts in `kr-solidarity` (specifically **Fraunces** and **Work Sans**) provide advanced axes to amplify emotional tone beyond simple weight.

#### Optical Size (`opsz`) — *Clarity of Scale*
- **Hero/Poster**: Set `opsz` to maximum (e.g., `72`+) for hairline serifs and high detail.
- **Micro-labels**: Set `opsz` to minimum (e.g., `12`) to thicken thin strokes and maintain legibility under visual pressure.

#### Softness (`SOFT`) — *Gentleness vs. Harshness*
Available in **Fraunces**.
- **`'SOFT' 0`**: Sharp, aggressive terminals. Use for **Protest**, **Urgency**, or **Structural Critique**.
- **`'SOFT' 100`**: Fluid, rounded forms. Use for **Backwater Reflection**, **Trauma-Informed Support**, or **Community Solidarity**.

#### Wonkiness (`WONK`) — *Humanized Effort*
Available in **Fraunces**.
- **`'WONK' 1`**: Enables "wonky" alternates (slanted vertical serifs). Use for **Identity Assertion** or **Wheat-paste energy**. It breaks the "corporate grid" and feels hand-printed.

#### Grade (`GRAD`) — *Visual Density (No Reflow)*
- **Hover States**: Use `GRAD` to "embolden" text on hover without changing the physical width of the element. This avoids "layout jitter" while providing a satisfying response to interaction.

#### Emotional Axis Mapping:

| Emotion | Axes Configuration | Archetype |
| :--- | :--- | :--- |
| **Aggressive Protest** | `'wght' 900, 'SOFT' 0, 'WONK' 1` | Strike |
| **Reflective Longing** | `'wght' 300, 'SOFT' 100, 'opsz' 12` | Pebble |
| **Institutional Critique**| `'wght' 100, 'SOFT' 0, 'opsz' 72` | Slab |
| **Community Pulse** | `'wght' 700, 'SOFT' 80, 'WONK' 0` | March |

---

### 3. Emotional Tone Mapping

Typography conveys personality. Map type choices to emotional goals:

#### Playful & Energetic

```json
{
  "display": {
    "fontFamily": "'Montserrat Variable', sans-serif",
    "fontWeight": "900", // Heavy, bold
    "letterSpacing": "0.02em", // Open tracking
    "textTransform": "uppercase"
  },
  "body": {
    "fontFamily": "'Nunito', sans-serif",
    "fontWeight": "400",
    "tone": "friendly, approachable"
  }
}
```

**Use for:** Creative platforms, social apps, youth products

#### Confident & Professional

```json
{
  "display": {
    "fontFamily": "'Plus Jakarta Sans Variable', sans-serif",
    "fontWeight": "800",
    "letterSpacing": "-0.01em" // Tight tracking for authority
  },
  "body": {
    "fontFamily": "'Inter Variable', sans-serif",
    "fontWeight": "400",
    "tone": "modern, professional"
  }
}
```

**Use for:** SaaS platforms, productivity tools, business apps

#### Elegant & Premium

```json
{
  "display": {
    "fontFamily": "'Poppins', serif",
    "fontWeight": "300", // Light for sophistication
    "letterSpacing": "0.03em" // Wide tracking for luxury
  },
  "body": {
    "fontFamily": "'Open Sans', sans-serif",
    "fontWeight": "400",
    "tone": "refined, premium"
  }
}
```

**Use for:** Wellness apps, luxury platforms, lifestyle brands

#### Tech-Forward & Unique

```json
{
  "display": {
    "fontFamily": "'Sora Variable', sans-serif",
    "fontWeight": "700",
    "letterSpacing": "0" // Neutral tracking
  },
  "body": {
    "fontFamily": "'Inter Variable', sans-serif",
    "fontWeight": "400",
    "tone": "innovative, modern"
  }
}
```

**Use for:** Tech startups, AI products, developer tools

---

### 4. Anti-Slop Validation (Reject Generic Fonts)

**FORBIDDEN FONTS (Generic AI Slop & KR Bans):**

- ❌ **Inter** (STRICT BAN: do not use in `kr-solidarity`)
- ❌ **Roboto** (STRICT BAN: do not use in `kr-solidarity`)
- ❌ **Arial** (STRICT BAN: do not use in `kr-solidarity`)
- ❌ **Sora** (STRICT BAN: do not use in `kr-solidarity`)
- ❌ **Plus Jakarta Sans** (STRICT BAN: do not use in `kr-solidarity`)
- ❌ **Open Sans** (generic, dated)
- ❌ **Helvetica** (overused, bland)
- ❌ **System fonts** (-apple-system, BlinkMacSystemFont, etc.)
- ❌ **Lato** (clichéd)

**Validation Rules:**

```javascript
function validateTypography(fontFamily) {
  const forbiddenFonts = ["inter", "roboto", "open sans", "arial", "helvetica", "lato", "-apple-system", "blinkmacsystemfont", "system-ui"];

  const isForbidden = forbiddenFonts.some((forbidden) => fontFamily.toLowerCase().includes(forbidden));

  if (isForbidden) {
    return {
      valid: false,
      error: `Forbidden font detected: ${fontFamily}. For KR Solidarity, use Work Sans (UI) or Fraunces (Display).`,
      suggestion: getAlternativeFont(fontFamily),
    };
  }

  return { valid: true };
}

function getAlternativeFont(genericFont) {
  const alternatives = {
    inter: "Work Sans",
    roboto: "Work Sans",
    "plus jakarta sans": "Work Sans",
    sora: "Work Sans",
    "open sans": "Work Sans",
    arial: "Work Sans",
    helvetica: "Fraunces",
  };

  return alternatives[genericFont.toLowerCase()] || "Work Sans";
}
```

---

### 5. Expressive Font Pairing (High Contrast)

**Pairing Principle:** High contrast = interesting. Avoid monotone pairings.

#### Anti-Pattern (Boring, Monotone):

```json
// ❌ Same font family, barely different weights
{
  "display": "'Roboto', sans-serif",
  "body": "'Roboto', sans-serif"
}
```

#### M3 Expressive (High Contrast):

**Display + Monospace:**

```json
{
  "display": "'Plus Jakarta Sans Variable', sans-serif",
  "body": "'JetBrains Mono', monospace"
}
```

**Use for:** Developer tools, code editors, tech platforms

**Serif + Geometric Sans:**

```json
{
  "display": "'Playfair Display', serif",
  "body": "'Poppins', sans-serif"
}
```

**Use for:** Editorial, publishing, content platforms

**Variable Font Across Weights:**

```json
{
  "display": {
    "fontFamily": "'Montserrat Variable', sans-serif",
    "fontWeight": "900" // Heavy
  },
  "body": {
    "fontFamily": "'Montserrat Variable', sans-serif",
    "fontWeight": "300" // Light
  }
}
```

**Use for:** Creative platforms, social apps (weight contrast creates hierarchy)

**Code + Editorial:**

```json
{
  "display": "'Fira Code', monospace",
  "body": "'Crimson Pro', serif"
}
```

**Use for:** Documentation, technical writing, knowledge bases

---

## Detection & Replacement Patterns

### Pattern 1: Detect Generic Fonts (Auto-Replace)

```tsx
// ❌ Before (Generic, Boring)
<Typography sx={{
  fontFamily: 'Roboto, sans-serif',
  fontSize: '24px',
  fontWeight: 400
}} />

// ✅ After (Expressive, Distinctive)
<Typography sx={{
  fontFamily: 'var(--sys-type-display-family)', // Plus Jakarta Sans Variable
  fontSize: 'var(--sys-type-headline-small-size)',
  fontWeight: 100, // Ultra-light for drama
  letterSpacing: '-0.02em'
}} />
```

**Regex Detection:**

```javascript
/(fontFamily):\s*['"]?(Roboto|Inter|Open Sans|Arial|Helvetica|system-ui)[^'"]*['"]?/g;
```

### Pattern 2: Detect Timid Weight Contrasts (Auto-Fix)

```tsx
// ❌ Before (Timid contrast: 1.25x)
<h1 style={{ fontWeight: 400 }}>Heading</h1>
<p style={{ fontWeight: 500 }}>Body</p>

// ✅ After (Extreme contrast: 9x)
<h1 style={{
  fontWeight: 100, // var(--sys-type-display-weight-light)
  fontSize: 'var(--sys-type-display-large-size)'
}}>
  Heading
</h1>
<p style={{
  fontWeight: 900, // var(--sys-type-body-weight-heavy)
  fontSize: 'var(--sys-type-body-small-size)'
}}>
  Body
</p>
```

**Detection Logic:**

```javascript
function detectTimidContrast(headingWeight, bodyWeight) {
  const contrastRatio = Math.max(headingWeight, bodyWeight) / Math.min(headingWeight, bodyWeight);

  if (contrastRatio < 1.5) {
    return {
      isTimid: true,
      suggestion: {
        heading: headingWeight > bodyWeight ? 800 : 100,
        body: headingWeight > bodyWeight ? 300 : 700,
      },
      message: `Contrast ratio ${contrastRatio.toFixed(2)}x is too timid. Aim for 3x+ (e.g., 100 vs 900).`,
    };
  }

  return { isTimid: false };
}
```

### Pattern 3: Variable Font Integration

```tsx
// ✅ Add variable font support
<Typography
  sx={{
    fontFamily: "var(--sys-type-display-family-variable)",
    fontVariationSettings: "var(--sys-type-display-variation-settings)",
    transition: "font-variation-settings var(--sys-motion-duration-medium-2) var(--sys-motion-easing-expressive)",

    "&:hover": {
      fontVariationSettings: "'wght' 900", // Increase weight on hover
    },
  }}
/>
```

**Token Structure:**

```json
{
  "typography": {
    "display": {
      "family": "'Plus Jakarta Sans', sans-serif",
      "familyVariable": "'Plus Jakarta Sans Variable', sans-serif",
      "variationSettings": "'wght' 800",
      "variationSettingsHover": "'wght' 900",
      "supportsVariation": true
    }
  }
}
```

---

## Emotional Tone Examples

### Playful & Energetic (Social Apps)

```tsx
const PlayfulTypography = () => (
  <>
    <h1
      style={{
        fontFamily: "'Montserrat Variable', sans-serif",
        fontWeight: 900, // Heavy, bold
        fontSize: "45px", // display-medium
        letterSpacing: "0.02em", // Open tracking
        textTransform: "uppercase",
        background: "linear-gradient(90deg, #E91E63, #00BCD4)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      Let's Create!
    </h1>
    <p
      style={{
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 400,
        fontSize: "16px",
        color: "var(--sys-color-on-surface)",
      }}
    >
      Join the community and start building.
    </p>
  </>
);
```

### Confident & Professional (SaaS Platforms)

```tsx
const ConfidentTypography = () => (
  <>
    <h1
      style={{
        fontFamily: "'Plus Jakarta Sans Variable', sans-serif",
        fontWeight: 800,
        fontSize: "57px", // display-large
        letterSpacing: "-0.01em", // Tight for authority
        color: "var(--sys-color-primary)",
      }}
    >
      Scale Your Business
    </h1>
    <p
      style={{
        fontFamily: "'Inter Variable', sans-serif",
        fontWeight: 400,
        fontSize: "16px",
        lineHeight: "24px",
        color: "var(--sys-color-on-surface-variant)",
      }}
    >
      Enterprise-grade tools for modern teams.
    </p>
  </>
);
```

### Elegant & Premium (Lifestyle Brands)

```tsx
const ElegantTypography = () => (
  <>
    <h1
      style={{
        fontFamily: "'Poppins', serif",
        fontWeight: 300, // Light for sophistication
        fontSize: "45px",
        letterSpacing: "0.03em", // Wide tracking for luxury
        color: "var(--sys-color-primary)",
      }}
    >
      Wellness Reimagined
    </h1>
    <p
      style={{
        fontFamily: "'Open Sans', sans-serif",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "20px",
        color: "var(--sys-color-on-surface-variant)",
      }}
    >
      Discover inner peace through guided meditation.
    </p>
  </>
);
```

---

## Enhanced Token Schema

```json
{
  "typography": {
    "expressive": {
      "variableFonts": {
        "display": {
          "family": "'Plus Jakarta Sans Variable', sans-serif",
          "weightAxis": "200-800",
          "defaultWeight": 800,
          "hoverWeight": 900,
          "variationSettings": "'wght' 800",
          "googleFontsUrl": "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap"
        },
        "body": {
          "family": "'Inter Variable', sans-serif",
          "weightAxis": "100-900",
          "defaultWeight": 400,
          "variationSettings": "'wght' 400"
        }
      },
      "extremeWeights": {
        "ultraLight": 100,
        "light": 300,
        "regular": 400,
        "bold": 700,
        "heavy": 900
      },
      "emotionalTone": "confident-professional", // or "playful-energetic", "elegant-premium"
      "contrast": {
        "weightRatio": 9, // 100 vs 900
        "sizeRatio": 4.75 // 57px vs 12px
      },
      "antiSlop": {
        "forbiddenFonts": ["Inter", "Roboto", "Open Sans", "Arial"],
        "validationEnabled": true
      }
    }
  }
}
```

---

## Usage

**Standalone Skill:**

```bash
# Enhance typography with M3 Expressive principles
m3-expressive-typography-enhancer \
  --file frontend/src/components/ui/Card/Card.tsx \
  --tone "confident-professional" \
  --validate-anti-slop
```

**Within Design Systems Architect:**

```javascript
// Called after m3-typography-classifier
const expressiveTypography = await runSkill("m3-expressive-typography-enhancer", {
  code: typographyClassifiedCode,
  tokens: tokensExpressive,
  emotionalTone: "playful-energetic",
});
```

---

## Validation Checklist

- [ ] No forbidden fonts (Inter, Roboto, Arial, etc.) used alone
- [ ] Weight contrast ratio ≥ 3x (e.g., 100 vs 900, not 400 vs 600)
- [ ] Size contrast ratio ≥ 3x (e.g., 57px vs 12px)
- [ ] Variable fonts enabled with font-variation-settings
- [ ] Emotional tone matches aesthetic preferences
- [ ] Font pairing uses high contrast (display + monospace, serif + geometric)
- [ ] Letter spacing applied correctly (tight for authority, wide for luxury)
- [ ] Google Fonts URLs included for distinctive fonts

---

**Created:** 2025-01-18
**Version:** 1.0.0
**Status:** Production Ready
**Aligned with:** M3 Expressive Principles (vibrant, dynamic, playful, emotionally impactful)
