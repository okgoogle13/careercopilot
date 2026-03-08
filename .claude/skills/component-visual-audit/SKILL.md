---
name: component-visual-audit
description: Audit component screenshots for KR Solidarity compliance with deterministic scoring and component-specific remediation.
metadata:
  version: 6.2.0
  tags:
    - visual-audit
    - component-qa
    - kr-solidarity
---

# Component Visual Audit

## Purpose

Evaluate single-component screenshots against KR Solidarity visual rules and produce precise remediation for implementation teams.

## When to Use

- Component-level QA before Storybook/PR approval.
- Regression checks after style/token updates.
- Triage when a component visually drifts from canon.

## Shared References

- `../shared-references/BRAND_CANON.md`
- `../shared-references/STATUS_THRESHOLDS.md`
- `../shared-references/AUDIT_OUTPUT_CONTRACT.md`

## Scope

Component-focused checks:
- tokenized color usage
- type hierarchy within component bounds
- shape/archetype alignment
- spacing/rhythm consistency

## Scoring (100)

- Brand/token compliance: 30
- Typography: 25
- Shape/layout: 25
- Component clarity/usability: 20

## Process

1. Confirm target component and state.
2. Run deterministic checks and collect evidence.
3. Score and assign status.
4. Emit fixes mapped to component code targets.

## Output Contract

Use shared audit contract shape with wrapper key `component_visual_audit`.

## Troubleshooting

### Missing states
- Capture default + hover/focus/disabled/error as relevant.

### Ambiguous theme context
- Confirm token/theme mode before scoring color violations.

## Related Skills

- `m3-visual-audit`
- `ui-design-evaluator`
- `kerala-rage-brand-enforcer`
