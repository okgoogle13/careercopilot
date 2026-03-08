---
name: manifest-reconciler
description: Reconcile assets across filesystem, manifest, and hero registry and report deterministic integrity gaps.
metadata:
  version: 2.3.0
  tags:
    - assets
    - manifest
    - integrity
---

# Manifest Reconciler

## Purpose

Detect mismatches between on-disk assets, manifest entries, and hero registry references.

## When to Use

- Before packaging/deploy.
- After bulk asset edits.

## Shared References

- `../shared-references/ASSET_WORKFLOW_CANON.md`
- `../shared-references/STATUS_THRESHOLDS.md`

## Scope

Checks:
- missing or orphaned assets
- unresolved manifest references
- hero-registry/manifest drift
- layering compatibility consistency

## Output Contract

Use deterministic shape with wrapper key `manifest_reconciliation_audit`.

## Related Skills

- `asset-path-validator`
- `asset-packager`
- `phase4-pipeline-orchestrator`
