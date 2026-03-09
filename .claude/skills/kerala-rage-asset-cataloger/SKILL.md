---
name: kerala-rage-asset-cataloger
description: Catalog uncategorized assets against the KR Solidarity manifest and emit deterministic intake metadata for triage.
metadata:
  version: 1.3.0
  mode_support: solidarity-only
---

# Kerala Rage Asset Cataloger

## Purpose

Generate manifest-aware intake metadata for asset files and identify missing/invalid inputs before downstream processing.

## When to Use

- During asset intake and triage.
- Before metadata enrichment/placement/packaging.

## Shared References

- `../shared-references/ASSET_WORKFLOW_CANON.md`
- `../shared-references/STATUS_THRESHOLDS.md`

## Script

- `scripts/catalog_assets.py`

## Inputs

- manifest path
- output json path
- one or more image files

## Output

Deterministic catalog JSON with analyzed and skipped assets.

## Usage

```bash
python3 .claude/skills/kerala-rage-asset-cataloger/scripts/catalog_assets.py \
  frontend/public/assets/kerala-rage-kr-solidarity-manifest.json \
  /tmp/catalog.json \
  frontend/public/assets/kr-solidarity/**/*.png
```

## Related Skills

- `asset-metadata-enricher`
- `asset-placement-strategy`
- `manifest-reconciler`
