---
name: m3-design-system-generator
description: "Complete M3 Expressive design token generation from aestheticPreferences input. Unified workflow: color palettes + motion tokens + base tokens + WCAG validation."
version: 2.0.0
tags: [design, m3, tokens, generation, wcag, accessibility]
---

# M3 Design System Generator

**Purpose:** Single unified entry point for generating complete M3 Expressive design token system from visual preferences.

**Input:** `aestheticPreferences` JSON (from visual-design-director)
**Output:** Complete `tokens-expressive.json` + `design-system/` assets + WCAG validation report

---

## Overview

Consolidates 3 design generator skills + WCAG validation into 1 unified workflow:

1. **Parse Aesthetic Preferences** - Extract style, colors, fonts, layout, shapes, shadows
2. **Generate Color Tokens** - 40+ tonal shades per palette using HCT color space
3. **Generate Motion Tokens** - 16 duration scales + 10 easing functions + spring physics
4. **Generate Base Tokens** - Shape scales, spacing grid, elevation system, typography scales
5. **WCAG Validation** - Check all color pairs meet AA/AAA contrast requirements
6. **Output Assets** - Save tokens.json, CSS variables, Tailwind patch, accessibility report

---

## Workflow

### Step 1: Parse Aesthetic Preferences

**Input Example:**

```json
{
  "style": "vibrant, minimal",
  "colorPalette": {
    "primary": "#1976d2",
    "secondary": "#7c4dff",
    "tertiary": "#f50057",
    "neutral": "#78909c"
  },
  "fontPairing": {
    "heading": "Plus Jakarta Sans Variable",
    "body": "Poppins"
  },
  "layout": "spacious",
  "shape": "pill-shaped",
  "shadows": "elevated"
}
```

### Step 2: Generate Color Tokens (M3 Expressive)

**Process:**

1. Extract base colors (primary, secondary, tertiary, neutral, error)
2. Generate 13 tonal variants per color using HCT color space
3. Map to semantic roles: on-primary, on-secondary, surface, surface-variant, etc.
4. Create 78+ total color tokens

**Output:**

```json
{
  "color": {
    "primary": {
      "0": "#000000",
      "10": "#001a4d",
      "20": "#003a99",
      "30": "#0052cc",
      ...
      "100": "#ffffff"
    },
    "secondary": { /* 13 tones */ },
    "tertiary": { /* 13 tones */ },
    "error": { /* 13 tones */ },
    "neutral": { /* 13 tones */ },
    "on-primary": "#ffffff",
    "on-secondary": "#ffffff",
    "surface": "#fafafa",
    "surface-variant": "#e8eef7"
  }
}
```

### Step 3: Generate Motion Tokens

**Process:**

1. Define 16 duration scales (50ms → 1000ms)
2. Define 10 easing functions (standard, emphasized, spring, bounce)
3. Create animation patterns (fadeIn, slideUp, scaleDown, etc.)

**Output:**

```json
{
  "motion": {
    "duration": {
      "short-1": "50ms",
      "short-2": "100ms",
      ...
      "extra-long-4": "1000ms"
    },
    "easing": {
      "linear": "linear",
      "standard": "cubic-bezier(0.2, 0, 0, 1)",
      "emphasized": "cubic-bezier(0.2, 0, 0, 1)",
      "emphasized-accelerate": "cubic-bezier(0.3, 0, 0.8, 0.15)",
      "emphasized-decelerate": "cubic-bezier(0.05, 0.7, 0.1, 1)",
      "spring": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      "bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
    }
  }
}
```

### Step 4: Generate Base Tokens

**Process:**

1. Shape tokens: 7 corner radii (0px → 9999px)
2. Spacing scale: 12-stop grid (0px → 64px) at 4px increments
3. Elevation levels: 6 shadow depths mapped to Material Design
4. Typography scales: 13 semantic type scales with variable fonts

**Output:**

```json
{
  "shape": {
    "corner-none": "0px",
    "corner-extra-small": "4px",
    "corner-small": "8px",
    ...
    "corner-full": "9999px"
  },
  "spacing": {
    "space-0": "0px",
    "space-1": "4px",
    ...
    "space-16": "64px"
  },
  "elevation": {
    "level-0": "none",
    "level-1": "0 1px 3px rgba(0,0,0,0.12)",
    ...
    "level-5": "0 24px 38px rgba(0,0,0,0.14)"
  },
  "typography": {
    "display-large": { "size": "57px", "weight": "400", "lineHeight": "64px" },
    "headline-large": { "size": "32px", "weight": "400", "lineHeight": "40px" },
    ...
    "body-small": { "size": "12px", "weight": "400", "lineHeight": "16px" }
  }
}
```

### Step 5: WCAG Validation

**Process:**

1. Check all text+background color pairs
2. Verify minimum contrast ratios:
   - AA Small Text: 4.5:1
   - AA Large Text: 3:1
   - AAA Small Text: 7:1
3. Generate accessibility report

**Output:**

```json
{
  "wcag_validation": {
    "status": "pass",
    "level": "AAA",
    "checked_pairs": 156,
    "passing_pairs": 156,
    "failing_pairs": 0,
    "details": [
      {
        "foreground": "#1976d2",
        "background": "#ffffff",
        "contrast_ratio": "8.59:1",
        "aa_small": "pass",
        "aa_large": "pass",
        "aaa_small": "pass",
        "aaa_large": "pass"
      }
    ]
  }
}
```

### Step 6: Output Assets

**Files Generated:**

1. `design-system/tokens-expressive.json` - Complete token system
2. `frontend/src/theme/design-tokens.css` - CSS variables
3. `design-system/tailwind-token-patch.js` - Tailwind config patch
4. `design-system/WCAG_VALIDATION_REPORT.md` - Accessibility details
5. `design-system/TOKEN_MANIFEST.json` - Index of all tokens

---

## Complete Workflow Example

**User Request:** "Create design system with vibrant, minimal aesthetic"

**Visual Design Director Output:**

```json
{
  "style": "vibrant, minimal",
  "colorPalette": {
    "primary": "#1976d2",
    "secondary": "#7c4dff",
    "tertiary": "#f50057"
  },
  "fontPairing": {
    "heading": "Plus Jakarta Sans Variable",
    "body": "Poppins"
  },
  "layout": "spacious",
  "shape": "rounded",
  "shadows": "elevated"
}
```

**m3-design-system-generator Process:**

1. ✅ **Parse preferences** - Extract all values
2. ✅ **Generate colors** - 78+ tokens, 13 tones each
3. ✅ **Generate motion** - 16 durations, 10 easing curves
4. ✅ **Generate base tokens** - Shape, spacing, elevation, typography
5. ✅ **WCAG validation** - Check 156 color pairs (all pass AAA)
6. ✅ **Output assets** - Generate 5 files

**Final Output:**

```json
{
  "status": "success",
  "tokens_generated": 200,
  "wcag_status": "AAA",
  "files_created": ["design-system/tokens-expressive.json", "frontend/src/theme/design-tokens.css", "design-system/tailwind-token-patch.js", "design-system/WCAG_VALIDATION_REPORT.md"],
  "aesthetic_score": 92,
  "recommended_actions": []
}
```

---

## Token Counts (Complete System)

| Category       | Count | Details                                |
| -------------- | ----- | -------------------------------------- |
| **Color**      | 78+   | 5 palettes × 13 tones + semantic roles |
| **Motion**     | 26    | 16 durations + 10 easing functions     |
| **Shape**      | 7     | Corner radii scales                    |
| **Spacing**    | 12    | 4px-based grid                         |
| **Elevation**  | 6     | Shadow depth levels                    |
| **Typography** | 13    | Type scales + variable font settings   |
| **Total**      | 150+  | Production-ready design system         |

---

## Usage

**Called by Design Systems Architect:**

```bash
# User: "Create design system with minimal, vibrant aesthetic"
#
# Visual Design Director generates aestheticPreferences
# Design Systems Architect calls m3-design-system-generator:
#
# Input: aestheticPreferences.json
# Output: design-system/tokens-expressive.json + CSS assets + WCAG report
```

**Integration with Build System:**

```bash
./scripts/update-design-system.sh
# Runs m3-design-system-generator
# Builds design-tokens.css
# Updates Tailwind config
# Validates WCAG compliance
```

---

## Progressive Disclosure

**Detailed algorithms moved to references:**

- `COLOR_GENERATION_ALGORITHM.md` - HCT color space calculations
- `MOTION_PHYSICS.md` - Spring physics, easing curves, choreography
- `WCAG_CONTRAST_CALCULATION.md` - Contrast ratio formulas

---

## Success Criteria

✅ All 150+ tokens generated
✅ WCAG AAA compliance (7:1 contrast minimum)
✅ No forbidden patterns (generic fonts, flat layouts)
✅ Aesthetic quality score ≥ 80
✅ CSS variables output valid
✅ Tailwind config patch compatible
✅ Design token manifest complete

---

**Version:** 2.0.0
**Status:** Unified skill consolidating 3 generators + WCAG validation
**Replaces:** design-token-generator, m3-expressive-color-generator, m3-motion-token-generator
