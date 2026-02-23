---
name: manifest-reconciler
description: Reconcile KR asset files against manifest and hero registries; report gaps, orphans, and hero coverage metrics.
metadata:
  legacy_frontmatter:
    version: 2.0.0
    tags:
    - manifest
    - integrity
    - hero
---

# Manifest Reconciler

## Purpose
Guarantee that assets on disk, manifest entries, and hero registry references are synchronized before packaging or deployment.

## Inputs
```json
{
  "asset_root": "frontend/public/assets/kr-solidarity",
  "manifest": "frontend/public/assets/kerala-rage-kr-solidarity-manifest.json",
  "hero_registry": "frontend/public/assets/kr-solidarity-hero-registry.json"
}
```

## Checks
1. Filesystem -> manifest reconciliation
- Orphans: file exists, not in manifest
- Broken refs: manifest path missing on disk
- Duplicates: duplicate ids or file paths

2. Hero reconciliation
- Hero layer asset IDs resolve to manifest IDs
- No missing IDs in hero compositions
- Hero depth metrics are reported (`layers >= 4` coverage)

3. Coverage summary
- Total assets
- Per-layer counts
- Hero composition count
- Unique hero assets used

## Output Contract
```json
{
  "status": "PASS",
  "manifest_total": 56,
  "orphans": [],
  "broken_references": [],
  "hero_missing_assets": [],
  "hero_depth_ratio": 0.50,
  "notes": []
}
```

## Safety Rules
- Never delete automatically.
- Emit proposed `git rm` commands only for reviewed orphan candidates.
- Fail if manifest or hero registry cannot be parsed.
