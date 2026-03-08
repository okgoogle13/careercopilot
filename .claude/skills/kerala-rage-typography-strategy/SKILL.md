---
name: kerala-rage-typography-strategy
description: Consolidated KR Solidarity typography strategy and implementation guide covering stack policy, variable-axis patterns, motion-safe interactions, and troubleshooting.
metadata:
  version: 6.2.0
  tags:
    - typography
    - kr-solidarity
    - design-system
    - m3-expressive
---

# Kerala Rage Typography Strategy (Consolidated)

## Purpose

Single source of truth for KR Solidarity typography policy and implementation patterns. Consolidates conceptual strategy and technical manipulation guidance.

## When to Use

- Defining typography rules for new UI work.
- Implementing variable-font interactions in CSS/React.
- Auditing typography compliance before release.
- Migrating legacy text styles to KR Solidarity canon.

## Canon Rules

Approved stack:
- `Work Sans`
- `Fraunces`
- `Libre Bodoni`
- `JetBrains Mono`
- `Caveat`
- `Nabla` (restricted decorative/icon-scale usage)

Banned defaults:
- `Inter`, `Roboto`, `Arial`, `Sora`, `Plus Jakarta Sans`

Core principles:
- Strong hierarchy and expressive contrast.
- Variable-font axes used intentionally, not arbitrarily.
- No layout-shifting hover hacks (`font-weight` jumps) when grade/axis-safe alternatives exist.

## Tier Model

1. Workhorse (Body/UI)
- Primary: `Work Sans`
- Use for navigation, body, labels.

2. Expressive (Display/Headline)
- Primary: `Fraunces`
- Secondary editorial emphasis: `Libre Bodoni`

3. Accent/Technical
- `Caveat` for annotation tone.
- `JetBrains Mono` for technical/data surfaces.
- `Nabla` only for constrained decorative moments.

## Variable Axis Strategy

Registered axes:
- `wght`: controlled contrast and hierarchy.
- `wdth`: responsive fitting for large display text.
- `opsz`: use `font-optical-sizing: auto`.
- `GRAD`: interaction emphasis without reflow risk.

Custom axes (Fraunces):
- `WONK`: controlled irregular personality.
- `SOFT`: ink-softness style modulation.

Guidelines:
- Animate one to two axes per interaction.
- Avoid simultaneous multi-axis extremes.
- Keep body text readability stable.

## Implementation Patterns

### 1) Layout-safe interaction emphasis

```css
.kr-button {
  font-family: "Work Sans Variable", sans-serif;
  font-variation-settings: "wght" 500, "GRAD" 0;
  transition: font-variation-settings 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.kr-button:hover {
  font-variation-settings: "wght" 500, "GRAD" 120;
}
```

### 2) Expressive display with controlled Fraunces axes

```css
.kr-headline {
  font-family: "Fraunces Variable", serif;
  font-optical-sizing: auto;
  font-variation-settings: "wght" 780, "WONK" 0.6, "SOFT" 40;
}
```

### 3) React/Framer motion header evolution

```tsx
<motion.h1
  style={{
    fontFamily: "Fraunces Variable",
    fontVariationSettings: '"wght" 760, "WONK" 0.5',
  }}
  transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
>
  Solidarity Heading
</motion.h1>
```

## Motion & Accessibility

- Preferred expressive easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- Respect `prefers-reduced-motion`; provide minimal-motion fallbacks.
- Preserve readability under contrast preferences.

## Anti-Patterns

- Static font-file fragmentation when variable files are available.
- Hover `font-weight` jumps that cause layout shift.
- Unbounded axis animation on body text.
- Using Nabla as primary body/display text.
- Reintroducing banned default font families.

## Deterministic Output Contract

```json
{
  "typography_audit": {
    "status": "pass|needs_refinement|fail",
    "score": 0,
    "violations": [
      {
        "severity": "critical|high|medium|low",
        "rule": "string",
        "location": "string",
        "evidence": "string",
        "fix": "string"
      }
    ],
    "recommendations": []
  }
}
```

## Troubleshooting

### Font not rendering as variable
- Verify variable font files are loaded.
- Confirm `font-variation-settings` applied to correct family.

### Layout shift on hover
- Replace hover `wght` jumps with `GRAD`-driven emphasis.
- Keep width-sensitive labels at stable `wdth`/`wght` values.

### Axis values look erratic
- Reduce animated axis count.
- Clamp `WONK`/`SOFT` to restrained ranges for production UI.

### Inconsistent hierarchy across breakpoints
- Use `wdth` and size tokens jointly.
- Re-check display/body contrast after responsive changes.

## Consolidation Note

This file supersedes legacy typography manipulation guidance. The `expressive-typography-manipulation` skill should defer here for canonical policy.

Last Updated: 2026-03-08 | Version: 6.2.0
