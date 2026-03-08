---
name: component-visual-audit
description: Audit UI component screenshots against KR Solidarity visual standards with deterministic scoring, canon-safe checks, and actionable remediation outputs.
metadata:
  version: 1.1.0
  tags:
    - validation
    - components
    - vision-analysis
    - kr-solidarity
    - design-system
    - ui-audit
---

# Component Visual Audit

## Purpose

Validate UI component screenshots against KR Solidarity visual standards and generate deterministic, actionable compliance reports.

## When to Use

- Before merge/release for design QA.
- During migration to KR Solidarity design canon.
- For regression checks after visual refactors.
- For portfolio-level trend tracking across component families.

## Canon Anchors

- `docs/design/01_CANON.md`
- `docs/design/02_SYSTEM.md`
- `frontend/src/design/styles/design-tokens.css`

## Scope

In scope:
- Screenshot-based audit of typography, color, layout/shape, motif policy, state visibility, and microcopy clarity.

Out of scope:
- Pixel-perfect spacing verification.
- Runtime performance/accessibility instrumentation.
- Automatic code mutation.

## Rule Set

1. Typography
- Allowed stack: `Work Sans`, `Fraunces`, `Libre Bodoni`, `JetBrains Mono`, `Caveat`, `Nabla` (restricted decorative usage).
- Banned fonts: `Inter`, `Roboto`, `Arial`, `Sora`, `Plus Jakarta Sans`.
- Require clear hierarchy and expressive contrast.

2. Color
- Prefer canonical tokens such as:
  - `--sys-color-charcoalBackground-base`
  - `--sys-color-solidarityRed-base`
  - `--sys-color-inkGold-base`
  - `--sys-color-stencilYellow-base`
  - `--sys-color-kr-activistSmokeGreen-base`
- White-background defaults and arbitrary non-token colors are violations.

3. Shape/Layout
- Archetypes: `Pebble`, `Stone`, `Slab`.
- `border-radius: 50%` is a violation.
- Avoid uniform/mechanical spacing patterns when expressive asymmetry is expected.

4. Motif Policy
- Zero-Flora lockdown: no botanical/floral motifs.
- Motifs must support hierarchy/meaning, not ornamental clutter.

5. State Visibility
- Visible and distinguishable states where provided (default/hover/active/disabled/focus/error).

6. Microcopy
- Action clarity within ~2 seconds for first-time user context.

## Deterministic Scoring (100)

- Typography: 20
- Color: 20
- Layout/Shape: 15
- Motif Integration Policy: 15
- State Visibility: 15
- Microcopy Clarity: 15

Status thresholds:
- `pass`: score >= 90 and no critical violations.
- `needs_refinement`: score 75-89 or any high violations.
- `fail`: score < 75 or any critical violations.

Critical violations:
- banned fonts
- flora/botanical motifs
- explicit perfect-circle expressive dependency

## Process

1. Validate screenshot quality and context.
2. Evaluate each dimension with findings and evidence.
3. Record violations with severity and concrete fix suggestions.
4. Compute score and status.
5. Return structured report.

## Output Contract

```json
{
  "audit": {
    "component_name": "string",
    "audit_date": "ISO-8601",
    "overall_status": "pass|needs_refinement|fail",
    "compliance_score": 0,
    "dimensions": {
      "typography": {"score": 0, "status": "pass|needs_refinement|fail", "findings": [], "recommendations": []},
      "color": {"score": 0, "status": "pass|needs_refinement|fail", "findings": [], "recommendations": []},
      "layout_shape": {"score": 0, "status": "pass|needs_refinement|fail", "findings": [], "recommendations": []},
      "motif_policy": {"score": 0, "status": "pass|needs_refinement|fail", "findings": [], "recommendations": []},
      "state_visibility": {"score": 0, "status": "pass|needs_refinement|fail", "findings": [], "recommendations": []},
      "microcopy": {"score": 0, "status": "pass|needs_refinement|fail", "findings": [], "recommendations": []}
    },
    "violations": [
      {"severity": "critical|high|medium|low", "rule": "string", "evidence": "string", "fix": "string"}
    ],
    "assessment": "string"
  }
}
```

## Troubleshooting

### Low-resolution screenshot
- Request higher-resolution image.
- Downgrade confidence for fine typography/color judgments.

### Missing interaction states
- Mark `state_visibility` as `insufficient_visual_evidence` and request state captures.

### Ambiguous theme context
- Ask whether screenshot is dark/light mode target.
- Use conservative scoring when context is missing.

### Conflicting signals
- Prioritize hard-rule violations over aggregate score.
- Return `needs_refinement` when evidence is mixed without critical violations.

## Reference Docs

- [component-visual-spec.md](./references/component-visual-spec.md)
- [passing-components.md](./references/passing-components.md)
- [design-evolution-tracking.md](./references/design-evolution-tracking.md)

## Related Skills

- [m3-visual-audit](../m3-visual-audit/SKILL.md)
- [m3-anti-slop-validator](../design-skills/m3-anti-slop-validator/SKILL.md)
- [design-token-validator](../design-token-validator/SKILL.md)

Last Updated: 2026-03-08 | Version: 1.1.0
