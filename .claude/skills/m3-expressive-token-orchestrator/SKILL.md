---
name: m3-expressive-token-orchestrator
description: Validate KR Solidarity token sets for DTCG integrity, canonical naming, and expressive compliance with deterministic diagnostics.
metadata:
  version: 6.2.0
  tags:
    - tokens
    - dtcg
    - compliance
---

# M3 Expressive Token Orchestrator

## Purpose

Ensure token sources and generated token artifacts remain structurally valid and canon-compliant.

## When to Use

- Before frontend build/release.
- After token edits or synchronization.

## Shared References

- `../shared-references/BRAND_CANON.md`
- `../shared-references/STATUS_THRESHOLDS.md`

## Scope

Checks include:
- DTCG shape integrity
- canonical naming
- deprecated/banned token detection
- expressive palette and contrast constraints

## Output Contract

Use deterministic audit shape with wrapper key `token_orchestration_audit`.

## Related Skills

- `kerala-rage-brand-enforcer`
- `m3-expressive-compliance-dashboard`
- `compliance-dashboard`
