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
- When a screen is code-compliant but still looks wrong.
- As the component-level visual layer inside `migration-audit`.

## Shared References

- `../shared-references/BRAND_CANON.md`
- `../shared-references/STATUS_THRESHOLDS.md`
- `../shared-references/AUDIT_OUTPUT_CONTRACT.md`
- `references/component-visual-spec.md`
- `references/passing-components.md`

## Scope

Component-focused checks:
- tokenized color usage
- type hierarchy within component bounds
- shape/archetype alignment
- spacing/rhythm consistency

## How To Use

Use this skill when you have screenshot evidence for one component or one screen-sized module and need deterministic visual feedback.

### Minimal workflow

1. Capture the component or screen module in a relevant state.
2. Compare it against the passing/failing examples in `references/passing-components.md`.
3. Score it using the rubric in `references/component-visual-spec.md`.
4. Emit fixes mapped back to the component code target.

### What to read first

If you only read one reference, start with:
- `references/passing-components.md`

Then use:
- `references/component-visual-spec.md`

Use `references/design-evolution-tracking.md` only when tracking iterations over time.

### Invocation pattern

This skill is evidence-driven, not command-driven:
- input = screenshot(s) + target component/screen name + state context
- output = component-level visual score and remediation

Typical prompt shape:
- target component or screen module
- screenshot path(s)
- state context (default, focus, error, hover)
- any known benchmark or migration route context

## Scoring (100)

- Brand/token compliance: 30
- Typography: 25
- Shape/layout: 25
- Component clarity/usability: 20

## Practical Walkthrough

For a migrated auth screen:

1. Capture the default state and one interaction state.
2. Audit typography and spacing at the component level first.
3. Check shape/archetype correctness and local compositional rhythm.
4. Use the output to decide whether to escalate to `m3-visual-audit` for full-page scoring.

Use this skill before `m3-visual-audit` when the problem appears local to one card, panel, or auth shell.

## Process

1. Confirm target component and state.
2. Run deterministic checks and collect evidence.
3. Score and assign status.
4. Emit fixes mapped to component code targets.

## Typical Findings

- typography hierarchy is technically present but visually weak
- spacing is mechanically even and hurts rhythm
- token use is compliant but local composition is still generic
- archetype edges or panel proportions feel wrong for the intended component weight

## Output Contract

Use shared audit contract shape with wrapper key `component_visual_audit`.

## Troubleshooting

### Missing states
- Capture default + hover/focus/disabled/error as relevant.

### Ambiguous theme context
- Confirm token/theme mode before scoring color violations.

### The component passes lint but still looks bad
- This is expected; lint is structural
- use the visual spec and passing examples to score the actual appearance

### Unsure whether to use this or `m3-visual-audit`
- use `component-visual-audit` for one bounded component or auth panel
- use `m3-visual-audit` for whole-page hierarchy and composition

## Related Skills

- `m3-visual-audit`
- `ui-design-evaluator`
- `kerala-rage-brand-enforcer`
- `migration-audit`
