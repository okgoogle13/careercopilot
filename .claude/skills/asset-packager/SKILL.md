---
name: asset-packager
description: Package validated KR assets into deterministic production bundles with context, tokens, usage guidance, and runtime placement.
metadata:
  version: 1.2.0
  tags:
    - assets
    - packaging
    - automation
---

# Asset Packager

## Purpose

Create standardized production bundles for validated assets and prepare runtime-ready file placement.

## When to Use

- After validation score gate passes.
- Before reconciliation and release.

## Shared References

- `../shared-references/ASSET_WORKFLOW_CANON.md`
- `../shared-references/BRAND_CANON.md`

## Outputs

- `context.md`
- `tokens.json`
- `usage.md`
- copied production PNG path

## Scope

Packaging only; commit/deploy steps remain explicit and manual unless separately automated.

## Related Skills

- `auto-validator`
- `asset-metadata-enricher`
- `manifest-reconciler`
