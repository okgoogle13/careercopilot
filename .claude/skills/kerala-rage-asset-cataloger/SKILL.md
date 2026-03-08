---
name: kerala-rage-asset-cataloger
description: Catalogs uncategorized asset files against the KR Solidarity manifest and emits deterministic metadata for safe manual triage.
metadata:
  version: 1.2.0
  mode_support: solidarity-only
---

# Kerala Rage Asset Cataloger

Deterministic manifest-aware cataloging for KR Solidarity asset intake.

## Purpose

This skill processes image files from uncategorized intake folders, validates the canonical manifest, and emits structured JSON metadata for manual triage and downstream tooling. It does not perform vision-based semantic classification.

## Supported Mode

`kerala-rage-solidarity` only.

Hard policy:
- Zero-Flora lockdown is active.
- Do not propose flora/endemic botanical motifs.

## When To Use

- Intake and normalize small/medium asset batches before curation.
- Generate deterministic IDs and processing metadata for reviewers.
- Preflight image files before packaging workflows.
- Validate manifest structure and duplicate-ID integrity.

## Capabilities

- Manifest validation (`exists`, parseable JSON, `assets[]` shape, duplicate ID rejection).
- Batch file validation (exists + supported extension).
- Deterministic suggested ID generation (`KR-SOLID-*` progression or legacy fallback).
- Structured output with analyzed entries and skipped-file reasons.
- Optional batch payload generation for large runs via `flash_batch.py`.
- PNG standardization and packaging via companion scripts.

## Non-Goals

- No automated visual triage classes (`MANIFEST_MATCH`, `DUPLICATE`, etc.).
- No automatic `mv` / `rm` execution plans.
- No autonomous compliance scoring of composition/aesthetics.

## Inputs

Required:
- Manifest path: `frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`
- Output JSON path (caller-defined)
- One or more image file paths

Supported image extensions:
- `.png`, `.jpg`, `.jpeg`, `.webp`

## Primary Script

```bash
python3 .claude/skills/kerala-rage-asset-cataloger/scripts/catalog_assets.py \
  frontend/public/assets/kerala-rage-kr-solidarity-manifest.json \
  /tmp/catalog.json \
  assets/uncategorized/*.png
```

## Output Contract

`catalog_assets.py` writes:

```json
{
  "cataloger_version": "2.1.0",
  "source_manifest": "...",
  "timestamp": "ISO-8601",
  "mode": "kerala-rage-solidarity",
  "total_requested": 0,
  "total_analyzed": 0,
  "total_skipped": 0,
  "entries": [
    {
      "filename": "...",
      "suggested_asset_id": "KR-SOLID-###",
      "analysis_timestamp": "ISO-8601",
      "manifest_compliant": true,
      "validation_notes": []
    }
  ],
  "skipped": [
    {"path": "...", "reason": "missing_file|unsupported_extension"}
  ]
}
```

If output path already exists, timestamp suffix is added to avoid overwrite.

## Safe Review Workflow

1. Run `catalog_assets.py` to produce metadata.
2. Manually review `entries[]` and `skipped[]`.
3. Use reviewer-approved move/delete actions in a separate curated step.
4. Keep destructive actions out of automatic pipelines.

## Companion Scripts

- `scripts/flash_batch.py`: build payload for Flash Sidekick routing when valid image count is `>= 20`.
- `scripts/standardize_png.py`: convert to PNG and validate size constraints from `usage_specs`.
- `scripts/package_assets.py`: package manifest assets by category and emit audit JSON.

## Troubleshooting

### Manifest not found

- Confirm path: `frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`.

### Malformed manifest JSON

- Fix JSON syntax and rerun.

### Duplicate manifest IDs

- Remove duplicates in `assets[].id` before running catalog.

### Empty or invalid image input set

- Expected: graceful zero-analysis result with skip reasons.

### Unsupported file types

- Only `.png`, `.jpg`, `.jpeg`, `.webp` are accepted.

## References

- `references/mode-compliance.md`
- `references/doc008-gaps.md`
- `references/asset-inventory.md`
- `MANIFEST-WORKFLOW.md`
- `INTEGRATION.md`

## Related Skills

- `manifest-reconciler`
- `vision-scorer-mcp`
- `batch-processor`

Last Updated: 2026-03-08 | Version: 1.2.0
