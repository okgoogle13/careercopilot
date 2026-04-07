---
name: design-token-validator
description: Validate CareerCopilot design tokens for KR Solidarity v6.1 compliance,
  semantic color tokens, archetype shapes, motion patterns, WCAG contrast, and zero-flora
  rules. Use before deployment or component authoring.
metadata:
  version: 3.0.0
  tags:
    - design-tokens
    - validation
    - kr-solidarity-v6.1
    - semantic-colors
    - archetype-shapes
    - motion-patterns
    - accessibility
    - zero-flora
---

# Design Token Validator

## Quick Decision Tree

- **Checking semantic color tokens?** → Verify all colors use `--sys-color-*` format
- **Adding archetype shapes?** → Validate against Strike, Placard, Scaffold, March, Megaphone, Substrate shape tokens
- **Using motion patterns?** → Ensure duration compliance with archetype mappings (march/placard=800ms, strike/megaphone=600ms, substrate=3000ms)
- **Pre-deployment validation?** → Run brand enforcer + token validator together
- **Checking flora/botanical refs?** → Zero-flora lockdown active—no Australian endemic fauna

## Purpose

Ensures design token integrity by validating KR Solidarity v6.1 compliance: semantic color tokens (`--sys-color-*`), archetype-specific shape tokens (Strike, Placard, Scaffold, March, Megaphone, Substrate), motion pattern durations, WCAG contrast ratios, and zero-flora brand lockdown. Use before component authoring or deployment.

## Process

1. **Semantic Color Compliance**: Verify all color tokens use `--sys-color-{name}-base` naming.
2. **Archetype Shape Validation**: Confirm shape tokens map to valid archetypes (Strike, Placard, Scaffold, March, Megaphone, Substrate).
3. **Motion Pattern Duration**: Validate motion durations align with archetype mappings (march/placard=800ms, strike/megaphone=600ms, substrate=3000ms, scaffold=0ms).
4. **Zero-Flora Lockdown**: Scan for banned flora/botanical references and Australian endemic fauna.
5. **WCAG 2.2 AA Contrast**: Verify color contrast ratios meet 4.5:1 minimum.
6. **Typography Validation**: Confirm font stack uses approved variables (Work Sans, Fraunces, Libre Bodoni, JetBrains Mono).

## When to Use

- **ALWAYS** before committing token changes
- Before generating wireframes (ensures valid references)
- During CI/CD pipeline (pre-build check)
- When updating color palette or typography

## Validation Checks

1. ✅ **Semantic Color Tokens**: All colors must use `--sys-color-{name}-base` format.
2. ✅ **Archetype Shape Tokens**: Shapes must map to approved archetypes (Strike, Placard, Scaffold, March, Megaphone, Substrate).
3. ✅ **Motion Pattern Duration**: Duration values align with archetype mappings.
4. ✅ **Zero-Flora Lockdown**: No flora/botanical references; no Australian endemic fauna.
5. ✅ **WCAG 2.2 AA Contrast**: All color pairs meet 4.5:1 minimum ratio.
6. ✅ **Typography Compliance**: Only approved variable fonts (Work Sans, Fraunces, Libre Bodoni, JetBrains Mono).
7. ✅ **Circular References**: No infinite alias loops.

## Semantic Color Token Format

All color tokens must use this naming:

```json
{
  "--sys-color-{name}-base": "hex-value",
  "--sys-color-{name}-on": "hex-value"
}
```

Examples: `--sys-color-primary-base`, `--sys-color-charcoalBackground-base`

## Archetype Shape Tokens

Map shape tokens to archetypes:

| Archetype | Valid Shape Tokens |
| --- | --- |
| Strike | `shape.blockRiot03`, `shape.blockRiot02`, `shape.blockRiot03-loading`, `shape.blockRiot03-pressed`, `shape.alertShard01` |
| Placard | `shape.placardTorn01`, `shape.placardTorn01-loading`, `shape.placardTorn01-selected` |
| Scaffold | `shape.scaffoldFrame01`, `shape.scaffoldFrame01-focus` |
| March | `shape.pillMarch01`, `shape.pillMarch01-pressed`, `shape.marchSurge01`, `shape.marchSurge01-expanded` |
| Megaphone | `shape.megaphoneCut01`, `shape.megaphoneCut01-loading`, `shape.substrateTile01` |
| Substrate | `shape.substrateTile02`, `shape.substrateTile01`, `shape.substrateTile01-hover` |

## Motion Duration Compliance

Archetype-specific motion durations:

| Archetype | Duration |
| --- | --- |
| march | 800ms |
| placard | 800ms |
| strike | 600ms |
| megaphone | 600ms |
| substrate | 3000ms |
| scaffold | 0ms |

## Integration

Runs automatically before:

- Component authoring (validates token availability)
- Brand enforcement (works alongside `kerala-rage-brand-enforcer`)
- Deployment (pre-build verification)
