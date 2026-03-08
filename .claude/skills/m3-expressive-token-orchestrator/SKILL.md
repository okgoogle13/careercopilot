---
name: m3-expressive-token-orchestrator
description: Validate KR Solidarity design tokens for DTCG integrity, canonical token naming, and expressive design compliance with deterministic checks and remediation output.
metadata:
  version: 6.1.0
  tags:
    - design-tokens
    - kr-solidarity
    - m3-expressive
    - compliance
---

# KR Solidarity M3 Expressive Token Orchestrator (v6.1)

## Purpose

Validate KR Solidarity token sources and generated artifacts for structural correctness, canonical naming, and expressive design-system compliance.

## When to Use

- Token builds fail (`getValue()`/reference errors).
- New tokens are added or renamed.
- Palette/token drift is suspected.
- Pre-commit or release readiness checks.

## Canonical Sources

- `frontend/src/design/tokens/tokens.json`
- `frontend/src/design/styles/design-tokens.css`

## Validation Scope

1. DTCG structure integrity
- `$type` and `$value` presence.
- reference syntax validity.
- circular reference detection.

2. KR Solidarity canonical naming
- prefer canonical tokens, including:
  - `--sys-color-charcoalBackground-base`
  - `--sys-color-solidarityRed-base`
  - `--sys-color-inkGold-base`
  - `--sys-color-stencilYellow-base`
  - `--sys-color-kr-activistSmokeGreen-base`
  - `--sys-color-worker-ash-base`
  - `--sys-color-paperWhite-base`
  - `--sys-color-concreteGrey-base`

3. Forbidden patterns
- no white-first backgrounds in expressive surfaces.
- no hardcoded hex/rgb in implementation-facing component code.
- no banned font families in typography tokens (`Inter`, `Roboto`, `Arial`, `Sora`, `Plus Jakarta Sans`).

4. Motion token policy
- expressive motion curves defined and consistent.
- no linear-only interaction defaults in expressive profile.

5. Shape policy
- archetypes should align to `Pebble`, `Stone`, `Slab` conventions.
- `border-radius: 50%` is prohibited for expressive shape language.

## Deterministic Process

1. Parse `tokens.json`.
2. Validate DTCG schema fields and references.
3. Validate canonical token presence and naming.
4. Scan implementation files for hardcoded value leakage.
5. Validate generated CSS token map consistency.
6. Emit structured report with severity and fixes.

## Output Contract

```json
{
  "token_audit": {
    "status": "pass|needs_refinement|fail",
    "score": 0,
    "summary": {
      "critical": 0,
      "high": 0,
      "medium": 0,
      "low": 0
    },
    "violations": [
      {
        "severity": "critical|high|medium|low",
        "rule": "string",
        "location": "string",
        "evidence": "string",
        "fix": "string"
      }
    ],
    "checks": {
      "dtcg_structure": true,
      "reference_integrity": true,
      "canonical_naming": true,
      "palette_policy": true,
      "motion_policy": true,
      "shape_policy": true
    }
  }
}
```

Status thresholds:
- `pass`: score >= 90 and no critical violations.
- `needs_refinement`: score 75-89 or any high violations.
- `fail`: score < 75 or any critical violations.

## Validation Commands

```bash
# Structural token validation
python3 scripts/design-validation/validate-tokens.py

# Palette validation
python3 scripts/validate_palette_mcp.py

# Hardcoded color leakage
rg -n "#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b|rgb\(|rgba\(" frontend/src/components frontend/src/layouts frontend/src/pages

# Banned fonts in source
rg -n "(Inter|Roboto|Arial|Sora|Plus Jakarta Sans)" frontend/src/

# Prohibited perfect circles
rg -n "border-radius:\s*50%" frontend/src/

# Manifest integrity (optional related check)
node frontend/scripts/kr/validate-manifest.mjs
```

## DTCG Example (Clarified)

Use raw source values in `tokens.json`; generated CSS variables are output artifacts.

```json
{
  "sys": {
    "color": {
      "charcoalBackground": {
        "base": {
          "$type": "color",
          "$value": "#1A1714"
        }
      },
      "solidarityRed": {
        "base": {
          "$type": "color",
          "$value": "#F14714"
        }
      },
      "inkGold": {
        "base": {
          "$type": "color",
          "$value": "#DAF674"
        }
      }
    }
  }
}
```

## Troubleshooting

### `getValue()` / unresolved token reference errors

- Verify reference path exists.
- Resolve circular references.
- Confirm token namespace moved from legacy aliases to canonical names.

### Canonical naming drift

- Normalize outdated variants (for example kebab aliases) to canonical `--sys-color-*-base` forms.
- Rebuild generated CSS after token-source updates.

### False positives in hardcoded scan

- Exclude fixture/snapshot files when appropriate.
- Validate context before applying critical severity.

### Mixed legacy archetype names

- Replace deprecated names with current `Pebble/Stone/Slab` mapping.

## Related Skills

- [kr-solidarity-brand-enforcer](../kerala-rage-brand-enforcer/SKILL.md)
- [m3-expressive-compliance-dashboard](../m3-expressive-compliance-dashboard/SKILL.md)
- [asset-placement-strategy](../asset-placement-strategy/SKILL.md)
- [vision-scorer-mcp](../vision-scorer-mcp/SKILL.md)

Last Updated: 2026-03-08 | Version: 6.1.0
