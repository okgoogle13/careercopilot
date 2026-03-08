---
name: compliance-dashboard
description: Aggregate KR Solidarity design-system compliance metrics and produce deterministic health reports for migration and release gates.
metadata:
  version: 1.1.0
  tags:
    - dashboard
    - compliance
    - migration
---

# Compliance Dashboard

## Purpose

Provide a unified compliance health view across components, audits, and migration status.

## When to Use

- Sprint checkpoints.
- Release readiness gates.
- Migration progress reporting.

## Shared References

- `../shared-references/BRAND_CANON.md`
- `../shared-references/STATUS_THRESHOLDS.md`
- `../shared-references/AUDIT_OUTPUT_CONTRACT.md`

## Script

- `run.py`

## Scope

Aggregates metrics from component plans, audit artifacts, and inventory scripts.

## Usage

```bash
python3 .claude/skills/compliance-dashboard/run.py
python3 .claude/skills/compliance-dashboard/run.py --json
```

## Related Skills

- `m3-expressive-compliance-dashboard`
- `m3-visual-audit`
- `kerala-rage-brand-enforcer`
