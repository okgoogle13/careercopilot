---
name: kerala-rage-brand-enforcer
description: Enforce KR Solidarity brand compliance across code and design artifacts with deterministic rule IDs and structured JSON output.
commands:
  - /brand-check
  - /enforce-brand
  - /kr-check
metadata:
  version: 6.3.0
  tags:
    - brand
    - compliance
    - kr-solidarity
    - kr-solidarity-v6.1
    - archetypes
    - motion-tokens
    - shape-tokens
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
- `BR-COLOR-003` non-semantic color tokens
- `BR-TYPE-001` non-approved variable font stack (Work Sans, Fraunces, Libre Bodoni, JetBrains Mono)
- `BR-SHAPE-001` disallowed `border-radius: 50%`
- `BR-ARCH-001` non-archetype shape tokens (Strike, Placard, Scaffold, March, Megaphone, Substrate)
- `BR-MOTIF-001` flora motif drift
- `BR-MOTION-001` motion pattern token validation (dragSettle, typeSpringSlam, waterRipple, windFlutter, pulseThrob, melancholyBreath)
- `BR-MOTION-002` hardcoded animation durations outside archetype mappings

## Process

1. Scan target files/directories.
2. Emit violations with rule_id, severity, location, evidence, fix.
3. Compute score/status via severity map.
4. Return structured JSON.

## Usage

```bash
python3 .claude/skills/kerala-rage-brand-enforcer/scripts/enforce_brand.py frontend/src --context code --min-score 90
```

### Via slash command

```bash
/brand-check frontend/src
/kr-check frontend/src/components --min-score 95
/enforce-brand . --fail-on high
```

### Via skill tool

```bash
claude-code --skill kerala-rage-brand-enforcer --path frontend/src
```

Arguments:
- `path` required: file or directory to scan
- `--min-score`: minimum passing score, default `90`
- `--fail-on`: `critical | high | medium | low`, default `high`
- `--output`: optional output file path, default `brand-enforcement-report.json`
- `--context`: `code | screenshot | markdown`, default `code`

## Edge Cases

- Markdown policy docs are de-noised to reduce false positives.
- Screenshot context lowers confidence to `medium` by default.

## Related Skills

- `component-visual-audit`
- `m3-visual-audit`
- `ui-design-evaluator`
