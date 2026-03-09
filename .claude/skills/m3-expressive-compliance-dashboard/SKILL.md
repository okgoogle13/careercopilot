---
name: m3-expressive-compliance-dashboard
description: Track KR Solidarity M3 Expressive adoption metrics and produce deterministic remediation priorities.
metadata:
  version: 6.2.0
  tags:
    - dashboard
    - compliance
    - m3-expressive
---

# M3 Expressive Compliance Dashboard

## Purpose

Aggregate M3 Expressive compliance metrics across components and surface prioritized improvements.

## When to Use

- Weekly design-system health checks.
- Before release readiness reviews.

## Shared References

- `../shared-references/BRAND_CANON.md`
- `../shared-references/STATUS_THRESHOLDS.md`
- `../shared-references/AUDIT_OUTPUT_CONTRACT.md`

## Scope

Metrics include:
- typography compliance
- token compliance
- layout expressiveness
- rule-violation density

## Output Contract

Dashboard report with component-level statuses, score deltas, and prioritized actions.

## Related Skills

- `m3-expressive-token-orchestrator`
- `compliance-dashboard`
- `m3-visual-audit`
