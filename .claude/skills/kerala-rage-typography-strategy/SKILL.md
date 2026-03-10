---
name: kerala-rage-typography-strategy
description: Canonical KR Solidarity typography strategy covering stack policy, variable-axis guidance, and production-safe interaction patterns.
commands:
  - /typo-check
  - /typography-audit
  - /font-check
metadata:
  version: 6.3.0
  tags:
    - typography
    - design-system
    - m3-expressive
---

# Kerala Rage Typography Strategy

## Purpose

Define canonical typography policy and implementation patterns for KR Solidarity outputs.

## Usage

### Via slash command

```bash
/typo-check LoginScreen.tsx
/typography-audit frontend/src/components
/font-check .
```

### Via skill tool

```bash
claude-code --skill kerala-rage-typography-strategy --path LoginScreen.tsx
```

Arguments:
- `path` required: file or directory to audit
- `--output`: optional output file, default `typography-audit-report.json`

## When to Use

- Designing or auditing typography.
- Implementing variable-font interactions.

## Shared References

- `../shared-references/BRAND_CANON.md`
- `../shared-references/STATUS_THRESHOLDS.md`
- `references/FONT_POLICY.md`
- `references/SCORING.md`
- `references/ANTI_PATTERNS.md`

## Scope

- approved font stack
- variable axis usage guidance
- motion-safe typography emphasis
- anti-patterns and troubleshooting

## Canonical Font Stack

Use only approved KR Solidarity families:

- `Work Sans` for UI body, labels, helper text, and form copy
- `Fraunces` for display or headline emphasis where contrast is needed
- `JetBrains Mono` for technical/meta text only
- `Libre Bodoni`, `Caveat`, and `Nabla` only when the design context explicitly justifies them

Do not introduce:

- `Inter`
- `Roboto`
- `Arial`
- `Sora`
- `Plus Jakarta Sans`

## Variable Axis Guidance

- use weight contrast intentionally rather than uniformly
- preserve readability first on auth and form-heavy screens
- avoid decorative slant or instability in core task flows unless the benchmark explicitly supports it
- treat expressive display use as headline-level emphasis, not default body styling

## Scoring Methodology (100)

- Stack compliance: 30
- Hierarchy and contrast: 30
- Readability and density fit: 20
- Expressive appropriateness: 20

Interpretation:
- `>= 90`: production-ready typography
- `75-89`: needs refinement
- `< 75`: fails typography gate for migration readiness

## Anti-Patterns

- banned font families in migration code
- weak hierarchy where headline, body, and CTA all read at the same visual weight
- over-styled auth screens that reduce clarity
- decorative display use in form labels or helper text
- expressive typography that breaks accessibility or trust in transactional flows

## Typical Workflow

1. Inspect the target screen or component source.
2. Confirm the font family usage aligns to the canonical stack.
3. Score hierarchy, readability, and expressive fit using `references/SCORING.md`.
4. Record anti-patterns using `references/ANTI_PATTERNS.md`.
5. Hand off to `m3-visual-audit` if the implementation needs screenshot-level confirmation.

## Output Contract

Use deterministic audit shape with wrapper key `typography_audit`.

## Related Skills

- `kerala-rage-brand-enforcer`
- `m3-visual-audit`
- `m3-expressive-token-orchestrator`
