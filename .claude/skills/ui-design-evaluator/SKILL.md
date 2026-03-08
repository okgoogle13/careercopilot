---
name: ui-design-evaluator
description: Evaluate wireframes/design assets against KR Solidarity standards and generate deterministic high-fidelity guidance.
metadata:
  version: 6.2.0
  tags:
    - design-evaluation
    - wireframes
    - hifi-guidance
---

# UI Design Evaluator

## Purpose

Assess UI design artifacts (wireframes, mockups, screenshots) and produce deterministic, implementation-ready guidance aligned with KR Solidarity.

## When to Use

- Before component build from wireframes.
- During handoff from design to implementation.
- During quality gates for new page-level experiences.

## Shared References

- `../shared-references/BRAND_CANON.md`
- `../shared-references/STATUS_THRESHOLDS.md`
- `../shared-references/AUDIT_OUTPUT_CONTRACT.md`

## Scope

This skill covers:
- visual compliance scoring
- hi-fi guidance from low/medium fidelity artifacts
- token/archetype recommendations

This skill does not cover:
- direct code generation for all components
- runtime performance validation

## Process

1. Parse artifact intent and layout.
2. Map regions to KR archetypes/tokens.
3. Score compliance and identify drift.
4. Emit implementation guidance and prioritized fixes.

## Output Contract

Use shared audit contract shape with wrapper key `ui_design_evaluation` plus:
- `hifi_guidance[]`
- `token_recommendations[]`

## Troubleshooting

### Low-fidelity source
- Mark uncertain findings and request higher-fidelity references.

### Conflicting signals
- Prioritize canon documents over ambiguous stylistic cues.

## Related Skills

- `component-visual-audit`
- `asset-placement-strategy`
- `kerala-rage-brand-enforcer`
