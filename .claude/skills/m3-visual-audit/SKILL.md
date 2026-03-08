---
name: m3-visual-audit
description: Audit UI screenshots against KR Solidarity M3 Expressive standards with deterministic scoring and actionable remediation.
metadata:
  version: 6.2.0
  tags:
    - visual-audit
    - m3-expressive
    - kr-solidarity
---

# M3 Visual Audit

## Purpose

Evaluate screenshot-level M3 Expressive compliance for KR Solidarity interfaces and emit deterministic findings.

## When to Use

- During visual QA before merge.
- During regression checks after token/layout/motion changes.
- When a design review needs objective pass/fail scoring.

## Shared References

- `../shared-references/BRAND_CANON.md`
- `../shared-references/STATUS_THRESHOLDS.md`
- `../shared-references/AUDIT_OUTPUT_CONTRACT.md`

## Scope

This skill focuses on screenshot evidence for:
- typography hierarchy and contrast
- color expressiveness and token alignment
- layout asymmetry and depth
- motion intent inference from visual cues

## Audit Dimensions (100)

- Typography: 25
- Color/token compliance: 25
- Layout and hierarchy: 25
- Expressive distinctiveness: 25

## Process

1. Validate screenshot quality and context.
2. Score each dimension with evidence.
3. Classify violations by severity.
4. Emit structured report with fixes.

## Output Contract

Use shared audit contract shape with wrapper key `visual_audit`.

## Troubleshooting

### Low-resolution screenshot
- Request higher-resolution capture.
- Mark uncertain findings as medium severity.

### Missing interaction states
- Request hover/focus/active captures.
- Avoid high-confidence motion judgments without state evidence.

## Related Skills

- `component-visual-audit`
- `ui-design-evaluator`
- `kerala-rage-brand-enforcer`
