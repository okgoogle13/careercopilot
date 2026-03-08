---
name: m3-expressive-compliance-dashboard
description: Track KR Solidarity M3 Expressive adoption with deterministic metrics, maturity grading, and prioritized remediation guidance.
metadata:
  version: 6.1.0
  tags:
    - m3-expressive
    - kr-solidarity
    - compliance
    - design-system
---

# KR Solidarity M3 Expressive Compliance Dashboard (v6.1)

## Purpose

Measure KR Solidarity compliance across frontend components using five deterministic metrics, identify failing components, and output prioritized remediation actions.

## When to Use

- Audit design-system compliance before releases.
- Track sprint-over-sprint expressiveness adoption.
- Prioritize component refactors by risk and visibility.
- Produce stakeholder-readable compliance reports.

## Scope

In scope:
- Static source scanning and token/font/motion/layout signal checks.
- Deterministic metric percentages and maturity bands.

Out of scope:
- Runtime visual scoring from screenshots (use `m3-visual-audit` or `vision-scorer-mcp`).
- Automatic code rewriting.

## Core Metrics

1. `solidarity_stack`
- Compliant component uses approved stack only: `Work Sans`, `Fraunces`, `Libre Bodoni`, `JetBrains Mono`, `Caveat`, `Nabla`.
- Non-compliant if using banned fonts: `Inter`, `Roboto`, `Arial`, `Sora`, `Plus Jakarta Sans`.

2. `extreme_contrasts`
- Compliant when component includes strong hierarchy equivalent to 9x weight contrast guidance (`300` body vs `900` display) and clear size separation.

3. `spring_physics`
- Compliant interactive components use expressive easing, default target: `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- Non-interactive components are excluded from this denominator.

4. `vibrant_tokens`
- Compliant when color usage is semantic-token based (`--sys-color-*`) with no hardcoded hex/rgb in component styles.

5. `kr_solidarity_asymmetry`
- Compliant when component shape/layout reflects KR asymmetric form language.
- Hard fail for `border-radius: 50%`.

Detailed formulas and denominator rules:
- [references/SCORING.md](./references/SCORING.md)

## Dashboard Score

Overall score:

```text
overall_score = round((solidarity_stack + extreme_contrasts + spring_physics + vibrant_tokens + kr_solidarity_asymmetry) / 5)
```

Grade scale:
- `A`: 90-100
- `B`: 75-89
- `C`: 60-74
- `D`: 40-59
- `F`: <40

Maturity bands:
- `kr_solidarity`: 5/5 metrics pass
- `mostly_expressive`: 4/5 pass
- `partially_expressive`: 2-3/5 pass
- `baseline_m3`: 0-1/5 pass

## Report Contract

```json
{
  "compliance_dashboard": {
    "report_date": "ISO-8601",
    "design_system": "KR Solidarity v6.x",
    "total_components": 0,
    "overall_score": 0,
    "grade": "A|B|C|D|F",
    "metrics": {
      "solidarity_stack": {"percentage": 0, "compliant_count": 0, "non_compliant_count": 0, "status": "ok|warn|fail", "violations": []},
      "extreme_contrasts": {"percentage": 0, "compliant_count": 0, "non_compliant_count": 0, "status": "ok|warn|fail"},
      "spring_physics": {"percentage": 0, "compliant_count": 0, "non_compliant_count": 0, "status": "ok|warn|fail"},
      "vibrant_tokens": {"percentage": 0, "compliant_count": 0, "non_compliant_count": 0, "status": "ok|warn|fail"},
      "kr_solidarity_asymmetry": {"percentage": 0, "compliant_count": 0, "non_compliant_count": 0, "status": "ok|warn|fail"}
    },
    "maturity_distribution": {
      "kr_solidarity": {"count": 0, "percentage": 0},
      "mostly_expressive": {"count": 0, "percentage": 0},
      "partially_expressive": {"count": 0, "percentage": 0},
      "baseline_m3": {"count": 0, "percentage": 0}
    },
    "components_needing_enhancement": [],
    "recommendations": []
  }
}
```

## Scanning Commands

```bash
# Detect banned fonts
rg -n "(Inter|Roboto|Arial|Sora|Plus Jakarta Sans)" frontend/src/

# Detect hardcoded color literals
rg -n "#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b|rgb\(|rgba\(" frontend/src/

# Detect forbidden perfect circles
rg -n "border-radius:\s*50%" frontend/src/

# Detect non-expressive easing in styles
rg -n "ease-in|ease-out|linear" --type css frontend/src/

# Validate tokens
python3 scripts/design-validation/validate-tokens.py
```

## Process

1. Run scanning commands.
2. Compute metric percentages using formulas in `references/SCORING.md`.
3. Assign per-component failing metrics.
4. Build maturity distribution and overall score.
5. Emit JSON report and remediation priorities.

## Priority Rules

High:
- Baseline components (0-1/5)
- High-traffic/high-visibility components

Medium:
- Partial components (2-3/5)

Low:
- Mostly expressive components (4/5)

## Troubleshooting

### False positives in font detection
- Verify files containing font examples/docs are excluded from component scans.
- Restrict scan roots to implementation directories only.

### Token false positives
- Exclude generated files and test snapshots.
- Confirm `--sys-color-*` aliases in imported CSS are resolved.

### Motion denominator drift
- Ensure only interactive components are counted for `spring_physics`.
- Document interactive component set used in report metadata.

### Incomplete component discovery
- Include all component roots (`frontend/src/components`, `frontend/src/pages`, `frontend/src/layouts` where applicable).

## Related Skills

- [m3-visual-audit](../m3-visual-audit/SKILL.md)
- [kerala-rage-brand-enforcer](../kerala-rage-brand-enforcer/SKILL.md)
- [vision-scorer-mcp](../vision-scorer-mcp/SKILL.md)

Version: 6.1.0 | Status: Production Ready | Updated: 2026-03-08
