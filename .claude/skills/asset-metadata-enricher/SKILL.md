---
name: asset-metadata-enricher
description: Enrich KR Solidarity asset metadata with deterministic accessibility and semantic fields while preserving manifest integrity.
metadata:
  version: 1.2.0
  tags:
    - assets
    - metadata
    - accessibility
---

# Asset Metadata Enricher

## Purpose

Add or normalize metadata fields (alt text, semantic roles, intent) for manifest assets without breaking existing structure.

## When to Use

- After intake cataloging.
- Before packaging and reconciliation.

## Shared References

- `../shared-references/ASSET_WORKFLOW_CANON.md`
- `../shared-references/BRAND_CANON.md`

## Scope

This skill covers metadata enrichment only; it does not generate new assets or perform visual scoring.

## Output Contract

Use deterministic audit shape (`status`, `score`, `violations`, `recommendations`) with wrapper key `metadata_enrichment_audit`.

## Process

1. Validate input manifest shape.
2. Apply idempotent metadata updates.
3. Emit change summary + unresolved items.

## Related Skills

- `kerala-rage-asset-cataloger`
- `asset-packager`
- `manifest-reconciler`
