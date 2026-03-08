---
name: m3-visual-audit
description: Audit UI screenshots against KR Solidarity M3 Expressive standards with deterministic scoring, explicit pass/fail criteria, and actionable remediation guidance.
metadata:
  version: 3.1.0
  tags:
    - m3-expressive
    - visual-audit
    - kr-solidarity
    - compliance
---

# M3 Visual Audit

## Purpose

Evaluate component screenshots for KR Solidarity M3 Expressive compliance across typography, color, layout, states, motion, and distinctiveness.

## When to Use

- Before release reviews for visual quality gates.
- During migration from baseline M3 to expressive KR Solidarity.
- For regression checks after component styling changes.

## Scope

In scope:
- Screenshot-based visual compliance analysis.
- Deterministic scoring and remediation guidance.

Out of scope:
- Source-code linting (use token/type validators).
- Automatic code rewriting.

## Canon Rules

- Allowed typography stack: `Work Sans`, `Fraunces`, `Libre Bodoni`, `JetBrains Mono`, `Caveat`, `Nabla`.
- Banned fonts: `Inter`, `Roboto`, `Arial`, `Sora`, `Plus Jakarta Sans`.
- Token-first color policy: semantic `--sys-color-*` usage intent only.
- Zero-Flora lockdown: no botanical/floral motifs.
- No perfect circles for expressive shapes (`border-radius: 50%` fails shape rule).

## Audit Dimensions (100)

1. Typography: 20
- Distinctive hierarchy and expressive contrast.
- Clear font-role assignment (display/body/supporting).

2. Color: 20
- Vibrant but controlled palette usage.
- No visual signal of hardcoded unsafe defaults (for example pure white backgrounds in expressive surfaces).

3. Layout/Shape: 15
- Intentional asymmetry and layered composition.
- Avoid mechanical uniformity.

4. State Visibility: 15
- Distinct default/hover/active/disabled/focus/error affordances where visible.

5. Motion (inferred): 15
- Visual evidence of spring-like interaction intent where states are shown.
- Respect reduced-motion expectations in recommendations.

6. Expressive Distinctiveness: 15
- Personality-driven, non-generic appearance.
- No “AI slop” markers (generic gradients, timid hierarchy, boilerplate look).

## Status Thresholds

- `pass`: score >= 90 and no hard-rule violations.
- `needs_refinement`: score 75-89 or minor policy concerns.
- `fail`: score < 75 or any hard-rule violation.

Hard-rule violations:
- banned font usage
- flora/botanical motifs
- explicit perfect-circle dependency as primary expressive shape

## Report Contract

```json
{
  "audit": {
    "component_name": "string",
    "design_system": "KR Solidarity M3 Expressive",
    "audit_date": "ISO-8601",
    "overall_status": "pass|needs_refinement|fail",
    "compliance_score": 0,
    "dimensions": {
      "typography": {"score": 0, "status": "pass|needs_refinement|fail", "findings": [], "recommendations": []},
      "color": {"score": 0, "status": "pass|needs_refinement|fail", "findings": [], "recommendations": []},
      "layout_shape": {"score": 0, "status": "pass|needs_refinement|fail", "findings": [], "recommendations": []},
      "state_visibility": {"score": 0, "status": "pass|needs_refinement|fail", "findings": [], "recommendations": []},
      "motion": {"score": 0, "status": "pass|needs_refinement|fail", "findings": [], "recommendations": []},
      "expressive_distinctiveness": {"score": 0, "status": "pass|needs_refinement|fail", "findings": [], "recommendations": []}
    },
    "hard_rule_violations": [],
    "assessment": "string"
  }
}
```

## Process

1. Confirm screenshot quality and context (component name, state shown, viewport).
2. Evaluate each dimension using explicit criteria.
3. Record hard-rule violations separately.
4. Compute total score and status.
5. Emit structured JSON with targeted remediation.

## Screenshot Quality Preconditions

- Resolution sufficient to inspect typography and spacing.
- At least one interactive state shown when motion/state claims are evaluated.
- Minimal cropping around core component bounds.

If preconditions fail, return `needs_refinement` with `insufficient_visual_evidence` note.

## Troubleshooting

### Low-resolution screenshot

- Request higher-resolution capture or zoomed crop of the component.
- Avoid definitive font judgments under ambiguous rendering.

### Ambiguous dark/light context

- Ask for explicit theme context.
- Score color conservatively and mark uncertainty in findings.

### Missing interaction states

- Do not fail motion/state visibility by default.
- Mark as `insufficient_visual_evidence` and request hover/focus/active captures.

### Conflicting signals

- Prioritize hard-rule violations over aggregate score.
- Use `needs_refinement` when evidence is mixed but non-critical.

## Example Summary

```json
{
  "audit": {
    "component_name": "PrimaryButton",
    "overall_status": "needs_refinement",
    "compliance_score": 84,
    "hard_rule_violations": [],
    "assessment": "Strong color and hierarchy; refine state contrast and interaction expressiveness."
  }
}
```

## Related Skills

- [m3-anti-slop-validator](../design-skills/m3-anti-slop-validator/SKILL.md)
- [m3-expressive-typography-enhancer](../design-skills/m3-expressive-typography-enhancer/SKILL.md)
- [brand-brief-optimizer](../brand-brief-optimizer/SKILL.md)
- [design-token-validator](../design-token-validator/SKILL.md)

Last Updated: 2026-03-08 | Version: 3.1.0
