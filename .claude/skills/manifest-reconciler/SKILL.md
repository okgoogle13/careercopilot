---
name: manifest-reconciler
description: Reconcile KR asset files against manifest, hero registries, and token maps; report gaps, orphans, hero coverage, and layering compatibility.
metadata:
  legacy_frontmatter:
    version: 2.1.0
    tags:
    - manifest
    - integrity
    - hero
    - layering-compatibility
---

# Manifest Reconciler (v2.1.0)

## Purpose
Guarantee that assets on disk, manifest entries, hero registry references, and token maps are synchronized and compliant with KR Solidarity layering rules before packaging.

## Inputs
```json
{
  "asset_root": "frontend/public/assets/kr-solidarity",
  "manifest": "frontend/public/assets/kerala-rage-kr-solidarity-manifest.json",
  "hero_registry": "frontend/public/assets/kr-solidarity-hero-registry.json",
  "hero_token_map": "frontend/public/assets/kr-solidarity-hero-token-map.v2.json"
}
```

## Checks
1. **Filesystem -> manifest reconciliation**
- Orphans: file exists, not in manifest
- Broken refs: manifest path missing on disk
- Duplicates: duplicate ids or file paths
- Normalization: warn if layer names use underscores (`ui_kit`) instead of canonical hyphens (`ui-kit`)

2. **Hero reconciliation**
- Explicit IDs: Hero layer asset IDs resolve to manifest IDs
- Auto IDs: `asset_id="auto"` is valid; skip manifest lookup and flag as auto-resolved
- No missing IDs in hero compositions
- Hero depth metrics are reported (`layers >= 4` coverage; PASS threshold >= 0.625)

3. **Layering Compatibility**
- For each composition, validate that layer pairings do not violate manifest `layering_compatibility` rules (e.g., `cannot_overlay_with`).
- Flag violations as 🔴 CRITICAL if atmospheric motifs attempt to overlay restricted substrates.

4. **Coverage summary**
- Total assets (Current Baseline: 87)
- Per-layer counts
- Hero composition count
- Unique hero assets used (including auto-resolved count)

## Output Contract
```json
{
  "status": "PASS",
  "manifest_version": "6.0.0",
  "manifest_total": 87,
  "orphans": [],
  "broken_references": [],
  "hero_missing_assets": [],
  "hero_auto_resolved": 8,
  "hero_depth_ratio": 0.75,
  "layering_conflicts": [],
  "layer_name_warnings": [],
  "notes": []
}
```

## Safety Rules
- Never delete automatically.
- Emit proposed `git rm` commands only for reviewed orphan candidates.
- Fail if manifest, hero registry, or token map cannot be parsed.
