---
name: ui-design-evaluator
description: Evaluate UI designs and wireframes against KR Solidarity standards, then generate deterministic high-fidelity mockup guidance and compliance reports.
metadata:
  version: 2.1.0
  tags:
    - design
    - research
    - ui
    - ux
    - kr-solidarity
---

# UI Design Evaluator & HiFi Mockup Creator

## Purpose

Evaluate design assets and annotated wireframes, then produce KR Solidarity-compliant high-fidelity mockup guidance, component specs, and structured evaluation output.

## When to Use

- Auditing designs against KR Solidarity canon.
- Translating annotated wireframes into high-fidelity implementation guidance.
- Scoring compliance and prioritizing remediation work.
- Generating prototype/component handoff material.

## Canon References

- `docs/design/01_CANON.md`
- `docs/design/02_SYSTEM.md`
- `frontend/src/design/styles/design-tokens.css`

## Process

1. Input collection
- screenshots, wireframes, markdown specs, component requirements.

2. Analysis
- extract hierarchy, flow, component candidates, and state requirements.

3. Evaluation (400-point rubric)
- KR Solidarity compliance: 100
- Accessibility: 100
- User-flow logic: 100
- Visual hierarchy/typography: 100

4. Design synthesis
- map UI regions to archetypes and canonical tokens.
- define interaction states and motion guidance.

5. Delivery
- structured report + component specs + implementation guidance.

## Archetype Mapping

Use current archetype vocabulary:
- `Strike`: primary actions
- `March`: sequential/flow indicators
- `Megaphone`: interruption/focal overlays
- `Placard`: content containers
- `Scaffold`: structural/input patterns
- `Substrate`: atmospheric/background layers

## Canonical Token Guidance

Use canonical tokens (examples):
- `--sys-color-charcoalBackground-base`
- `--sys-color-solidarityRed-base`
- `--sys-color-inkGold-base`
- `--sys-color-paperWhite-base`
- `--sys-color-concreteGrey-base`
- `--sys-color-kr-activistSmokeGreen-base`

Avoid stale aliases like `--sys-color-solidarity-red` / `--sys-color-ink-gold`.

## Scoring and Grades

Grade scale:
- `360+`: Excellent (production-ready)
- `320-359`: Good (minor refinements)
- `280-319`: Satisfactory (needs work)
- `240-279`: Significant improvement required
- `<240`: Not compliant

## Output Contract

```json
{
  "evaluation": {
    "target": "string",
    "overall_score": 0,
    "grade": "A|B|C|D|F",
    "status": "pass|needs_refinement|fail",
    "dimensions": {
      "kr_solidarity_compliance": {"score": 0, "findings": [], "recommendations": []},
      "accessibility": {"score": 0, "findings": [], "recommendations": []},
      "user_flow_logic": {"score": 0, "findings": [], "recommendations": []},
      "visual_hierarchy_typography": {"score": 0, "findings": [], "recommendations": []}
    },
    "violations": [
      {"severity": "critical|high|medium|low", "rule": "string", "evidence": "string", "fix": "string"}
    ]
  }
}
```

## Compliance Checklist

- Approved typography stack only (`Work Sans`, `Fraunces`, `JetBrains Mono`, `Libre Bodoni`, `Caveat`, optional restricted `Nabla`).
- No banned fonts (`Inter`, `Roboto`, `Arial`, `Sora`, `Plus Jakarta Sans`).
- Canonical `--sys-color-*` tokens only.
- No hardcoded hex in implementation guidance unless explicitly diagnostic.
- No white-first expressive surfaces.
- No `border-radius: 50%` for core expressive forms.
- No flora/botanical motifs (zero-flora lockdown).

## Troubleshooting

### Low-fidelity screenshot
- Mark uncertain findings and request higher-resolution capture.
- Avoid critical decisions on ambiguous typography/color details.

### Missing interaction states
- Flag `insufficient_state_evidence`.
- Request hover/focus/active/error captures before final scoring.

### Conflicting signals between dimensions
- Prioritize critical violations over aggregate score.
- Return `needs_refinement` when evidence is mixed without hard-rule breach.

### Token name mismatch in source material
- Normalize to canonical token names from `design-tokens.css` before scoring.

## Related Skills

- `wireframe-annotator`
- `asset-placement-strategy`
- `component-builder`
- `component-visual-audit`
- `hifi-blueprint-linter`

Last Updated: 2026-03-08 | Version: 2.1.0
