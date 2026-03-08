---
name: manifest-reconciler
description: Reconcile KR Solidarity assets across filesystem, manifest, and hero registry, and report deterministic integrity, coverage, and layering compatibility findings.
metadata:
  version: 2.2.0
  tags:
    - manifest
    - integrity
    - hero
    - layering-compatibility
---

# Manifest Reconciler (v2.2.0)

## Purpose

Ensure assets on disk, manifest entries, and hero registry references stay synchronized before packaging or release.

## When to Use

- Before release or asset packaging.
- After bulk asset imports, moves, or deletions.
- After manifest or hero registry edits.
- During CI quality gates for asset integrity.

## Inputs

Required:

```json
{
  "asset_root": "frontend/public/assets/kr-solidarity",
  "manifest": "frontend/public/assets/kerala-rage-kr-solidarity-manifest.json",
  "hero_registry": "frontend/public/assets/kr-solidarity-hero-registry.json"
}
```

Optional:

```json
{
  "hero_token_map": "frontend/public/assets/kr-solidarity-hero-token-map.v2.json"
}
```

Notes:
- `hero_token_map` is optional and may be absent in this repository.
- Reconciliation must still run and return valid output when optional input is missing.

## Checks

1. Filesystem -> manifest reconciliation
- `orphans`: file exists on disk but not referenced by manifest.
- `broken_references`: manifest `file_path` missing on disk.
- `duplicates`: duplicate manifest IDs or duplicate `file_path` values.
- `layer_name_warnings`: non-canonical layer naming (for example `ui_kit` vs `ui-kit`).

2. Hero reconciliation
- Hero composition asset IDs resolve to manifest IDs when not `auto`.
- `asset_id="auto"` is allowed and counted in `hero_auto_resolved`.
- Missing hero asset references are reported in `hero_missing_assets`.
- Hero depth coverage is reported via `hero_depth_ratio`.

3. Layering compatibility
- Validate composition layer pairings against manifest `layering_compatibility` constraints.
- Conflicts reported in `layering_conflicts`.

4. Coverage summary
- `manifest_total`: dynamic count from manifest assets array.
- `per_layer_counts`: computed from manifest layer values.
- `hero_composition_count` and `hero_unique_assets_used`.

## Deterministic Normalization Rules

- Canonical layer names are hyphenated (for example `ui-kit`).
- If registry/composition values use underscore form (for example `ui_kit`), normalize to hyphen form for comparison.
- Preserve original value in diagnostics while using normalized value for rule checks.

## Process

1. Parse required JSON files (`manifest`, `hero_registry`).
2. Parse optional `hero_token_map` if present.
3. Build manifest indices (`id -> asset`, `file_path -> asset`).
4. Scan filesystem under `asset_root` for referenced/unreferenced files.
5. Reconcile hero compositions and compute depth/coverage.
6. Run layering compatibility validation.
7. Emit deterministic report JSON.

## Output Contract

```json
{
  "status": "PASS|WARN|FAIL",
  "manifest_version": "string",
  "manifest_total": 0,
  "orphans": [],
  "broken_references": [],
  "duplicates": {
    "ids": [],
    "file_paths": []
  },
  "hero_missing_assets": [],
  "hero_auto_resolved": 0,
  "hero_depth_ratio": 0.0,
  "layering_conflicts": [],
  "layer_name_warnings": [],
  "coverage": {
    "per_layer_counts": {},
    "hero_composition_count": 0,
    "hero_unique_assets_used": 0
  },
  "notes": []
}
```

Status guidance:
- `PASS`: no critical integrity failures.
- `WARN`: non-blocking findings exist (for example naming warnings, manageable orphans).
- `FAIL`: required files unparsable, missing critical assets, or hard layering conflicts.

## Example

```json
{
  "status": "WARN",
  "manifest_version": "6.0.0",
  "manifest_total": 87,
  "orphans": ["/assets/kr-solidarity/ui-kit/svg/unused-icon.svg"],
  "broken_references": [],
  "duplicates": {"ids": [], "file_paths": []},
  "hero_missing_assets": [],
  "hero_auto_resolved": 8,
  "hero_depth_ratio": 0.75,
  "layering_conflicts": [],
  "layer_name_warnings": ["ui_kit normalized to ui-kit in composition heroA.layer2"],
  "coverage": {
    "per_layer_counts": {"substrate": 10, "atmospheric": 20, "ui-kit": 39},
    "hero_composition_count": 16,
    "hero_unique_assets_used": 31
  },
  "notes": ["Optional hero_token_map not provided; skipped token-map checks"]
}
```

## Safety Rules

- Never delete files automatically.
- Emit proposed `git rm` suggestions only for reviewed orphan candidates.
- Fail when required files cannot be parsed.
- Do not fail solely because optional `hero_token_map` is absent.

## Troubleshooting

### Required file parse failure

- Validate JSON syntax for `manifest` and `hero_registry`.
- Ensure paths are repo-relative and exist.

### Unexpected orphan spike

- Confirm new assets were added to manifest after filesystem import.
- Check for path prefix mismatches (`/assets/...` normalization).

### Layering conflict noise

- Confirm normalization from underscore to hyphen is applied before compatibility checks.
- Re-run after correcting non-canonical layer labels in registry data.

### Hero depth ratio below threshold

- Inspect compositions with missing depth layers and add required layer diversity.

Last Updated: 2026-03-08 | Version: 2.2.0
