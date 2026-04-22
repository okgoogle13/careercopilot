# ASSET_GOVERNANCE.md

## Overview
This document defines the policies for managing UI assets and other non-code files in the CareerCopilot repository.

## Canonical Asset Locations

| Directory | Status | Purpose |
|---|---|---|
| `frontend/src/assets/` | **Active** | React-imported assets (SVG, lightweight WebP). Must be optimised. |
| `frontend/src/hero/` | **Active** | Hero layer composition config (`hero.layers.json`). |
| `frontend/public/assets/kr-solidarity/` | **Active** | Primary KR Solidarity visual asset library, organised by category subdirectory. |
| `frontend/public/assets/templates/` | **Reserved** | Future UI templates. See `templates/README.md` before adding files. |
| `asset-packages/KR-SOLID-{NNN}/` | **Ingestion** | Raw packaged assets with `metadata.json` and `PACKAGING_MANIFEST.json`. IDs use 3-digit format (no leading zero above 99). |
| `docs/_archive/components/` | **Archive** | Orphaned root-level component files retained for reference. |
| `_archive/legacy-assets/` | **Reference** | Legacy assets from original `assets/` cleanup. Not referenced in code. |

## Deprecated Locations (do not add files)

- `assets/` (root-level) — fully deprecated, transitioning out
- `frontend/public/assets/uncategorized/` — temporary holding area; all files should be categorised promptly

## Canonical File Naming

### Governance JSON files (`frontend/public/assets/`)
Pattern: `{system-id}-{type}.json`
Examples:
- `kr-solidarity-manifest.json` ✅
- `kr-solidarity-hero-registry.json` ✅
- `kr-solidarity-hero-token-map.v2.json` ✅

### Asset image files
Pattern: `{system-id}__{category}__{subcategory}--{slug}--{version}.{ext}`
Examples:
- `kr-solidarity__street__protest--textless-protest-tram--v1.png` ✅
- `kr-solidarity__spiritual__devotional--shiva-statue--v1.png` ✅

### Asset package directories (`asset-packages/`)
Pattern: `KR-SOLID-{NNN}` where NNN is a **3-digit minimum** integer with no superfluous leading zeros.
- `KR-SOLID-001` through `KR-SOLID-099` — 3 digits ✅
- `KR-SOLID-100` through `KR-SOLID-999` — 3 digits (no extra leading zero) ✅

## Cleanup Protocol (The Purge)
When removing assets, follow these steps:
1. **Scan**: Run a regex search for the filename in `frontend/src/`.
2. **Classify**:
   - `active`: Found in code. Do not move.
   - `candidate-archive`: Not found in code, but provides artistic value/reference. Move to `_archive/legacy-assets/`.
   - `candidate-delete`: Temporary files (`.bak`), duplicates, or low-value backups. Remove via `git rm`.
3. **Review**: All movements must be documented in `docs/ASSET_CLEANUP_REPORT.md` and approved.

## Automation
- Run `scripts/maintenance/categorize_assets.py` for audit automation.
- Run `frontend/scripts/kr/validate-manifest.mjs` to verify manifest integrity against canonical paths.
- Regularly scan `_archive/` to ensure it doesn't grow indefinitely.

## Manifest Reference
The canonical project manifest is: `frontend/public/assets/kr-solidarity-manifest.json`
