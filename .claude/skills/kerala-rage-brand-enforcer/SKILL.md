---
name: kr-solidarity-brand-enforcer
description: Enforce KR Solidarity brand compliance across code and design artifacts with deterministic rule IDs and structured JSON output.
metadata:
  version: 6.2.0
  tags:
    - brand
    - compliance
    - kr-solidarity
---

# KR Solidarity Brand Enforcer

## Purpose

Run deterministic brand-policy checks and emit actionable violations before merge/release.

## When to Use

- PR review for UI/style changes.
- Design artifact compliance audits.
- Release-readiness checks.

## Shared References

- `../shared-references/BRAND_CANON.md`
- `../shared-references/STATUS_THRESHOLDS.md`
- `../shared-references/AUDIT_OUTPUT_CONTRACT.md`

## Rule Engine

Primary executable:
- `scripts/enforce_brand.py`

Severity configuration:
- `references/severity-map.json`

Deterministic rule IDs:
- `BR-COLOR-001` hardcoded hex values
- `BR-COLOR-002` disallowed white background usage
- `BR-TYPE-001` banned fonts
- `BR-SHAPE-001` disallowed `border-radius: 50%`
- `BR-MOTIF-001` flora motif drift

## Process

1. Scan target files/directories.
2. Emit violations with rule_id, severity, location, evidence, fix.
3. Compute score/status via severity map.
4. Return structured JSON.

## Usage

```bash
python3 .claude/skills/kerala-rage-brand-enforcer/scripts/enforce_brand.py frontend/src --context code --min-score 90
```

## Edge Cases

- Markdown policy docs are de-noised to reduce false positives.
- Screenshot context lowers confidence to `medium` by default.

## Related Skills

- `component-visual-audit`
- `m3-visual-audit`
- `ui-design-evaluator`
