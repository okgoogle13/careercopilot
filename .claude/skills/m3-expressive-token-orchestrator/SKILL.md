---
name: m3-expressive-token-orchestrator
description: Validate KR Solidarity (Migrant Rage) v6.0 design tokens for DTCG compliance,
  vibrant palette rules, and M3 Expressive principles. Enforces Solidarity Stack
  (Fraunces/Work Sans), no purple or white backgrounds, vibrant saturation (40-80%),
  spring physics motion curves, and asymmetric kr-solidarity shapes.
metadata:
  version: 6.0.0
  tags:
    - design-tokens
    - kr-solidarity
    - m3-expressive
    - compliance
---

# KR Solidarity M3 Expressive Token Orchestrator (v6.0)

## Purpose

Validate KR Solidarity design tokens (`tokens.json`) for DTCG compliance, vibrant palette rules, and M3 Expressive principles as defined in the KR Solidarity Design Canon. Ensures tokens are production-ready and aligned with v6.0 standards.

## When to Use

- **Build failing with `getValue()` errors?** → Run token validation
- **Adding new tokens?** → Validate against KR Solidarity v6.0 spec
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

### 3. Validate KR Solidarity Palette

Ensure vibrant saturation and no forbidden patterns.

**Checks**:
- ✅ Saturation 40–80% for brand accents (vibrant, not muted)
- ✅ Solidarity Charcoal background (#1A1714)
- ✅ Solidarity Crimson (#F14714) as primary CTA
- ✅ Ink Gold (#DAF674) as primary accent
- ❌ No purple gradients (#7C4DFF → #9C27B0) — banned
- ❌ No generic blue (#2196F3) — banned
- ❌ No white backgrounds (#FFFFFF) — banned

### 4. Detect Hardcoded Values

Find non-token CSS in components.

**Patterns to Detect**:
- `color: #FF5733` (hardcoded hex — must use `--sys-color-*`)
- `font-size: 16px` (hardcoded — should use `--sys-type-*` token)
- `padding: 12px` (hardcoded — should use spacing token)

**Fix**: Replace with `--sys-color-*` or `--sys-type-*` semantic tokens.

### 5. Validate Semantic Tokens

Ensure KR Solidarity semantic tokens are defined.

**Required Token Groups**:
- `--sys-color-charcoalBackground-*` (dark base)
- `--sys-color-solidarityCrimson-*` (primary actions)
- `--sys-color-inkGold-*` (accent / halo)
- `--sys-color-stencilYellow-*` (attention markers)
- `--sys-color-activistSmoke-*` (secondary highlights)

### 6. Build Token Artifacts

Generate CSS variables, TypeScript types.

**Outputs**:
- `design-tokens.css` (CSS custom properties)
- `tokens.d.ts` (TypeScript types)

### 7. Sync Cross-System

Ensure `tokens.json` ↔ CSS ↔ TypeScript are in sync.

## KR Solidarity Semantic Tokens

### Color Tokens (Solidarity Palette)

| Token | Value | Usage |
| --- | --- | --- |
| **charcoalBackground-base** | `#1A1714` | Global floor; never white |
| **solidarityCrimson-base** | `#F14714` | Primary action, screenprint heat |
| **inkGold-base** | `#DAF674` | Temple radiance, halo disks |
| **stencilYellow-base** | `#F6E748` | Attention markers |
| **activistSmoke-base** | `#48DA8B` | Growth, secondary highlights |
| **paperWhite** | `#F5F0E8` | Primary text on dark surfaces |
| **concreteGrey** | `#A39B8F` | Neutral / disabled |

**KR Solidarity Rule**: Background MUST be `charcoalBackground`. NO white (`#FFFFFF`) backgrounds. All semantic tokens use `--sys-color-*` namespace.

### Typography Tokens (Solidarity Stack)

| Token | Font | Weight Range | Use |
| --- | --- | --- | --- |
| **Display Large** | **Fraunces Variable** | 300–900 | Hero headlines, proclamation |
| **Display Medium** | **Fraunces Variable** | 400–800 | Section headers |
| **Headline Large** | **Fraunces Variable** | 600–900 | Key UI headers |
| **Body Large** | **Work Sans Variable** | 300–500 | Body copy, navigation |
| **Body Medium** | **Work Sans Variable** | 300–500 | Secondary body copy |
| **Label Large** | **Work Sans Variable** | 500–700 | UI labels, tags |
| **Code / Data** | **JetBrains Mono** | 400 | Technical data, code |
| **Annotation** | **Caveat** | 400–700 | Human notes, metadata |

**KR Solidarity Rule**: ONLY Solidarity Stack (`Fraunces Variable`, `Work Sans Variable`, `Libre Bodoni`, `JetBrains Mono`, `Caveat`). **Forbidden**: Inter, Roboto, Arial, Sora, Plus Jakarta Sans, Poppins, Montserrat, Space Grotesk.

**Variable Axis Strategy**:
- `GRAD` for hover (avoid weight reflow)
- `WONK` (0–1) + `SOFT` (0–100) for Fraunces streetprint personality
- `wdth` for responsive headline compression
- `opsz: auto` always

### Motion Tokens (Spring Physics)

| Token | Duration | Easing | Usage |
| --- | --- | --- | --- |
| **Short** | 50ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Quick feedback |
| **Medium** | 250ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Hover, state change |
| **Long** | 500ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Entrance, emphasis |

**KR Solidarity Rule**: ALL motion tokens use spring physics overshoot easing. No linear. No standard easing.

### Spacing Tokens (Collective Rhythm)

| Token | Value | Usage |
| --- | --- | --- |
| **XS** | 4px | Tight |
| **S** | 8px | Small |
| **M** | 16px | Medium |
| **L** | 24px | Large |
| **XL** | 40px | Extra large |

**KR Solidarity Rule**: Spacing follows **varied rhythm** (8px, 16px, 24px, 40px). Not uniform (16px everywhere). Deliberate disruptions for poster-like hierarchy.

### Shape Tokens (KR Solidarity Asymmetric)

| Token | Value | Archetype |
| --- | --- | --- |
| **Seed** | `40px 12px 40px 12px` | Button, chip, badge |
| **Pebble** | `20px 6px 20px 6px` | Progress, stacked items |
| **Lens** | `24px 8px 20px 8px` | Modal, popover |
| **Jar** | `32px 8px 28px 12px` | Card, panel |
| **Stone** | `8px 2px 8px 2px` | Divider, small accent |

**KR Solidarity Rule**: Border-radius MUST be asymmetric per archetype. **`border-radius: 50%` is strictly banned.**

## Token Validation Checklist

### Structure Validation
- [ ] All tokens have `$type` field
- [ ] All tokens have `$value` field
- [ ] Color formats valid (hex, rgb, hsl)
- [ ] Dimensions have units (px, rem, em)
- [ ] References use `{token.path}` syntax
- [ ] No circular references

### KR Solidarity Palette Validation
- [ ] Background uses `charcoalBackground-base` (#1A1714)
- [ ] Primary CTA uses `solidarityCrimson-base` (#F14714)
- [ ] Accent uses `inkGold-base` (#DAF674)
- [ ] No purple gradients
- [ ] No generic blue (#2196F3)
- [ ] No white (#FFFFFF)

### Typography Validation
- [ ] All type tokens use Solidarity Stack (Fraunces / Work Sans / JetBrains Mono)
- [ ] No forbidden fonts (Inter, Roboto, Arial, Sora, Plus Jakarta Sans)
- [ ] Weight ranges 300–900 defined
- [ ] Optical sizing tokens present (`opsz: auto`)
- [ ] Variable axis tokens defined (GRAD, WONK, SOFT)

### Motion Validation
- [ ] All motion tokens use spring physics easing
- [ ] Easing curve: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- [ ] Duration tokens: 50ms / 250ms / 500ms
- [ ] No linear easing
- [ ] No instant transitions

### Shape Validation
- [ ] Border-radius is asymmetric per archetype
- [ ] No `border-radius: 50%`
- [ ] No mechanical uniformity (8px all corners)

## Validation Commands

```bash
# Validate token structure (DTCG compliance)
python3 scripts/design-validation/validate-tokens.py

# Validate palette against KR Solidarity spec
python3 scripts/validate_palette_mcp.py

# Scan for hardcoded hex in components
rg -n "#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b" frontend/src/components frontend/src/layouts frontend/src/pages

# Scan for forbidden fonts
rg -n "(Inter|Roboto|Arial|Sora|Plus Jakarta Sans|Poppins)" frontend/src/

# Find perfect circles (banned)
rg -n "border-radius:\s*50%" frontend/src/

# Validate manifest integrity
node frontend/scripts/kr/validate-manifest.mjs
```

## Example tokens.json (KR Solidarity v6.0)

```json
{
  "sys": {
    "color": {
      "charcoalBackground": {
        "base": {
          "$type": "color",
          "$value": "#1A1714",
          "$description": "KR Solidarity global floor — never white"
        }
      },
      "solidarityCrimson": {
        "base": {
          "$type": "color",
          "$value": "#F14714",
          "$description": "Screenprint ink, resistance heat, primary CTA"
        }
      },
      "inkGold": {
        "base": {
          "$type": "color",
          "$value": "#DAF674",
          "$description": "Temple radiance, optimistic defiance, halo disks"
        }
      }
    },
    "motion": {
      "easing": {
        "spring": {
          "$type": "cubicBezier",
          "$value": [0.34, 1.56, 0.64, 1],
          "$description": "KR Solidarity spring physics — overshoot required"
        }
      },
      "duration": {
        "short": { "$type": "duration", "$value": "50ms" },
        "medium": { "$type": "duration", "$value": "250ms" },
        "long": { "$type": "duration", "$value": "500ms" }
      }
    },
    "type": {
      "display": {
        "large": {
          "font": {
            "$type": "fontFamily",
            "$value": ["Fraunces Variable", "serif"],
            "$description": "KR Solidarity Expressive — proclamation and hero"
          },
          "size": { "$type": "dimension", "$value": "72px" },
          "weight": { "$type": "fontWeight", "$value": 900 }
        }
      },
      "body": {
        "large": {
          "font": {
            "$type": "fontFamily",
            "$value": ["Work Sans Variable", "sans-serif"],
            "$description": "KR Solidarity Workhorse — body and UI"
          },
          "size": { "$type": "dimension", "$value": "16px" },
          "weight": { "$type": "fontWeight", "$value": 400 }
        }
      }
    }
  }
}
```

## Related Skills

- [kerala-rage-brand-enforcer](../kerala-rage-brand-enforcer/SKILL.md) — Brand enforcement including palette and Zero-Flora
- [kerala-rage-typography-strategy](../kerala-rage-typography-strategy/SKILL.md) — Solidarity Stack variable axis strategy
- [asset-placement-strategy](../asset-placement-strategy/SKILL.md) — Wireframe slot and z-index token validation
- [vision-scorer-mcp](../vision-scorer-mcp/SKILL.md) — Deterministic visual quality gate

---

**Version:** 6.0.0 | **Status:** Production Ready | **Updated:** 2026-03-07

_Token integrity is the foundation. Every `--sys-color-*` violation is a crack in the solidarity wall._
