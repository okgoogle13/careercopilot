---
name: m3-expressive-token-orchestrator
description: Validate Material Design 3 Expressive design tokens for DTCG compliance, vibrant palette rules, and M3 Expressive principles. Enforces no purple gradients, no generic blue, vibrant saturation (40-80%), spring physics motion curves, and M3 type scale with variable fonts.
version: 1.0.0
tags: []
---

# M3 Expressive Token Orchestrator

## Purpose

Validate M3 Expressive design tokens for DTCG compliance, vibrant palette rules, and M3 Expressive principles. Ensures tokens are production-ready and aligned with M3 Expressive standards.

## When to Use

- **Build failing with getValue() errors?** → Run token validation
- **Adding new tokens?** → Validate against M3 Expressive spec
- **Checking vibrant compliance?** → Run palette validator
- **Finding hardcoded colors?** → Run hardcoded value detector
- **Pre-commit validation?** → Run full audit

## Process

### 1. Fix Token Build Errors

Resolve `getValue()` path errors in token references.

**Common Issues**:

- Token path incorrect (`color.primary` vs `sys.color.primary`)
- Token doesn't exist in source
- Circular references

**Fix**: Validate token structure, check paths, resolve references.

### 2. Validate Token Structure

Ensure DTCG format compliance.

**Checks**:

- `$type` field present and valid
- `$value` field present
- Color formats valid (hex, rgb, hsl)
- Dimensions have units (px, rem, em)
- References use `{token.path}` syntax

### 3. Validate M3 Expressive Palette

Ensure vibrant saturation and no forbidden patterns.

**Checks**:

- ✅ Saturation 40-80% (vibrant, not muted)
- ❌ No purple gradients (#7C4DFF → #9C27B0)
- ❌ No generic blue (#2196F3)
- ✅ Dominant color in palette (not evenly distributed)
- ✅ Semantic tokens at expressive saturation (not baseline)

### 4. Detect Hardcoded Values

Find non-token CSS in components.

**Patterns to Detect**:

- `color: #FF5733` (hardcoded hex)
- `font-size: 16px` (hardcoded size, should be token)
- `padding: 12px` (hardcoded spacing, should be token)

**Fix**: Replace with semantic tokens.

### 5. Validate Semantic Tokens

Ensure M3 Expressive semantic tokens are defined.

**Required Tokens**:

- Primary (vibrant)
- Secondary (vibrant)
- Tertiary (vibrant)
- Error (vibrant)
- Neutral (dark background)
- On-surface (light text)

### 6. Build Token Artifacts

Generate CSS variables, Tailwind config, TypeScript types.

**Outputs**:

- `design-tokens.css` (CSS custom properties)
- `tailwind.config.js` (Tailwind theme)
- `tokens.d.ts` (TypeScript types)

### 7. Sync Cross-System

Ensure Figma ↔ tokens.json ↔ CSS ↔ Tailwind are in sync.

## M3 Expressive Semantic Tokens

### Color Tokens (Vibrant)

| Token          | M3 Expressive Vibrant         | Saturation | Usage                     |
| -------------- | ----------------------------- | ---------- | ------------------------- |
| **Primary**    | #6750A4 (vibrant purple)      | 60%        | Primary actions, focus    |
| **Secondary**  | #625B71 (vibrant gray-purple) | 45%        | Secondary actions         |
| **Tertiary**   | #7D5260 (vibrant mauve)       | 50%        | Tertiary actions          |
| **Error**      | #B3261E (vibrant red)         | 70%        | Error states              |
| **Neutral**    | #1A1714 (dark gray)           | 10%        | Backgrounds, neutral text |
| **Surface**    | #1A1714 (asphalt black)       | 10%        | Component backgrounds     |
| **On-Surface** | #F5F0E8 (paper white)         | 5%         | Text on dark backgrounds  |

**M3 Expressive Rule**: All semantic color tokens must use **vibrant tones** (40-80% saturation), not baseline M3 colors.

### Typography Tokens (Variable Fonts)

| Token              | Font                       | Weight Range | Size | Line Height |
| ------------------ | -------------------------- | ------------ | ---- | ----------- |
| **Display Large**  | Sora Variable              | 300-900      | 57px | 64px        |
| **Display Medium** | Sora Variable              | 400-800      | 45px | 52px        |
| **Display Small**  | Sora Variable              | 500-700      | 36px | 44px        |
| **Headline Large** | Plus Jakarta Sans Variable | 600-800      | 32px | 40px        |
| **Body Large**     | Plus Jakarta Sans Variable | 300-500      | 16px | 24px        |
| **Body Medium**    | Plus Jakarta Sans Variable | 300-500      | 14px | 20px        |
| **Label Large**    | Plus Jakarta Sans Variable | 500-700      | 14px | 20px        |

**M3 Expressive Rule**: All typography tokens must use **variable fonts** (Sora, Plus Jakarta Sans, Poppins), not static fonts or generic fonts (Inter, Roboto).

### Motion Tokens (Spring Physics)

| Token      | Duration | Easing                            | Usage               |
| ---------- | -------- | --------------------------------- | ------------------- |
| **Short**  | 50ms     | cubic-bezier(0.34, 1.56, 0.64, 1) | Quick feedback      |
| **Medium** | 250ms    | cubic-bezier(0.34, 1.56, 0.64, 1) | Hover, state change |
| **Long**   | 500ms    | cubic-bezier(0.34, 1.56, 0.64, 1) | Entrance, emphasis  |

**M3 Expressive Rule**: All motion tokens must use **spring physics easing** (cubic-bezier with overshoot), not linear or standard easing.

### Spacing Tokens ([DEPRECATED_STYLE] Rhythm)

| Token  | Value | Usage               |
| ------ | ----- | ------------------- |
| **XS** | 4px   | Tight spacing       |
| **S**  | 8px   | Small spacing       |
| **M**  | 16px  | Medium spacing      |
| **L**  | 24px  | Large spacing       |
| **XL** | 40px  | Extra large spacing |

**M3 Expressive Rule**: Spacing should follow **varied rhythm** (8px, 16px, 24px, 40px), not uniform (16px everywhere).

### Shape Tokens (Asymmetric)

| Token      | Value               | Usage             |
| ---------- | ------------------- | ----------------- |
| **Small**  | 4px 6px 4px 6px     | Small components  |
| **Medium** | 8px 12px 8px 12px   | Medium components |
| **Large**  | 16px 20px 16px 20px | Large components  |

**M3 Expressive Rule**: Border-radius should be **asymmetric** (pebble, stone, leaf-inspired), not uniform (8px all corners).

## Token Validation Checklist

### Structure Validation

- [ ] All tokens have `$type` field
- [ ] All tokens have `$value` field
- [ ] Color formats valid (hex, rgb, hsl)
- [ ] Dimensions have units (px, rem, em)
- [ ] References use `{token.path}` syntax
- [ ] No circular references

### M3 Expressive Palette Validation

- [ ] All semantic colors are vibrant (40-80% saturation)
- [ ] No purple gradients (#7C4DFF → #9C27B0)
- [ ] No generic blue (#2196F3)
- [ ] Primary token uses vibrant tone
- [ ] Secondary token uses vibrant tone
- [ ] Tertiary token uses vibrant tone
- [ ] Error token uses vibrant tone

### Typography Validation

- [ ] All type tokens use variable fonts (Sora, Plus Jakarta Sans, Poppins)
- [ ] No generic fonts (Inter, Roboto, Arial)
- [ ] Weight ranges defined (300-900)
- [ ] Optical sizing enabled
- [ ] Type scale follows M3 Expressive (Display → Label)

### Motion Validation

- [ ] All motion tokens use spring physics easing
- [ ] Easing curve: cubic-bezier(0.34, 1.56, 0.64, 1)
- [ ] Duration tokens: 50ms, 250ms, 500ms
- [ ] No linear easing
- [ ] No instant transitions

### Spacing Validation

- [ ] Spacing follows varied rhythm (8px, 16px, 24px, 40px)
- [ ] No uniform spacing (16px everywhere)
- [ ] Follows 8dp grid

### Shape Validation

- [ ] Border-radius is asymmetric (not uniform)
- [ ] [DEPRECATED_STYLE] shapes (pebble, stone, leaf-inspired)
- [ ] No mechanical uniformity (8px all corners)

## Pre-Commit Validation Checklist

Before committing token changes:

- [ ] **Token structure validates** (DTCG format)
- [ ] **All colors are M3 Expressive vibrant** (not baseline)
- [ ] **No purple gradients**
- [ ] **No generic blue (#2196F3)**
- [ ] **Motion easing uses spring physics** (overshoot)
- [ ] **Type scale uses M3 Expressive fonts**
- [ ] **No hardcoded CSS values**
- [ ] **Tailwind config updated**
- [ ] **All tokens resolve correctly** (getValue() works)

## Usage Examples

### Example 1: Validate Token Structure

```bash
# Run token validation
npm run validate:tokens

# Output:
# ✅ All tokens have $type field
# ✅ All tokens have $value field
# ❌ color.accent missing saturation (should be 40-80%)
# ❌ motion.fast uses linear easing (should be spring physics)
```

### Example 2: Detect Hardcoded Values

```bash
# Scan components for hardcoded values
npm run detect:hardcoded

# Output:
# ❌ Button.tsx:42 - color: #FF5733 (should use token)
# ❌ Card.tsx:18 - font-size: 16px (should use token)
# ❌ Input.tsx:25 - padding: 12px (should use token)
```

### Example 3: Validate M3 Expressive Palette

```bash
# Check palette compliance
npm run validate:palette

# Output:
# ✅ Primary token vibrant (60% saturation)
# ✅ Secondary token vibrant (45% saturation)
# ❌ Tertiary token muted (20% saturation, should be 40-80%)
# ❌ Purple gradient detected in accent colors
```

### Example 4: Build Token Artifacts

```bash
# Generate CSS, Tailwind, TypeScript
npm run build:tokens

# Output:
# ✅ design-tokens.css generated
# ✅ tailwind.config.js updated
# ✅ tokens.d.ts generated
```

## Token File Structure

```
design-system/
├── tokens.json              # Source of truth (DTCG format)
├── design-tokens.css        # Generated CSS variables
├── tailwind.config.js       # Generated Tailwind theme
├── tokens.d.ts              # Generated TypeScript types
└── scripts/
    ├── validate-tokens.js   # Structure validation
    ├── validate-palette.js  # M3 Expressive palette validation
    ├── detect-hardcoded.js  # Hardcoded value detection
    └── build-tokens.js      # Artifact generation
```

## Example tokens.json (M3 Expressive)

```json
{
  "sys": {
    "color": {
      "primary": {
        "$type": "color",
        "$value": "#6750A4",
        "$description": "M3 Expressive vibrant primary (60% saturation)"
      },
      "secondary": {
        "$type": "color",
        "$value": "#625B71",
        "$description": "M3 Expressive vibrant secondary (45% saturation)"
      },
      "surface": {
        "$type": "color",
        "$value": "#1A1714",
        "$description": "Dark background (asphalt black)"
      },
      "on-surface": {
        "$type": "color",
        "$value": "#F5F0E8",
        "$description": "Light text (paper white)"
      }
    },
    "motion": {
      "easing": {
        "expressive": {
          "$type": "cubicBezier",
          "$value": [0.34, 1.56, 0.64, 1],
          "$description": "M3 Expressive spring physics (overshoot)"
        }
      },
      "duration": {
        "short": {
          "$type": "duration",
          "$value": "50ms"
        },
        "medium": {
          "$type": "duration",
          "$value": "250ms"
        },
        "long": {
          "$type": "duration",
          "$value": "500ms"
        }
      }
    },
    "type": {
      "display": {
        "large": {
          "font": {
            "$type": "fontFamily",
            "$value": ["Sora Variable", "sans-serif"]
          },
          "size": {
            "$type": "dimension",
            "$value": "57px"
          },
          "lineHeight": {
            "$type": "dimension",
            "$value": "64px"
          },
          "weight": {
            "$type": "fontWeight",
            "$value": 300
          }
        }
      }
    }
  }
}
```

## Related Skills

- [m3-expressive-ui-evaluator](../m3-expressive-ui-evaluator/SKILL.md) - Evaluate designs against M3 Expressive
- [m3-visual-audit](../m3-visual-audit/SKILL.md) - Audit component screenshots
- [design-token-validator](file:///.claude/skills/design-token-validator/SKILL.md) - Validate against slop patterns
- [brand-brief-optimizer](../brand-brief-optimizer/SKILL.md) - Stress-test design briefs

---

**Version:** 1.0.0 (M3 Expressive)
**Status:** Production Ready
