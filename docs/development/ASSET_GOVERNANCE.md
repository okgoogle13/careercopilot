# ASSET_GOVERNANCE.md

## Overview
This document defines the policies for managing UI assets and other non-code files in the CareerCopilot repository.

## Asset Locations
- `frontend/src/assets/`: **Active** assets used in the React components. These must be optimized (e.g., SVG, lightweight WebP).
- `_archive/legacy-assets/`: **Reference** materials moved from the original `assets/` and `frontend/src/assets/` during the cleanup phase. These are preserved for design reference but not referenced in code.
- `assets/` (Deprecated): No new files should be added here. This directory is being transitioned out.

## Cleanup Protocol (The Purge)
When removing assets, follow these steps:
1. **Scan**: Run a regex search for the filename in `frontend/src/`.
2. **Classify**:
   - `active`: Found in code. Do not move.
   - `candidate-archive`: Not found in code, but provides artistic value/reference. Move to `_archive/legacy-assets/`.
   - `candidate-delete`: Temporary files (`.bak`), duplicates, or low-value backups. Remove via `git rm`.
3. **Review**: All movements must be documented in `docs/ASSET_CLEANUP_REPORT.md` and approved.

## Maintenance
- Regularly scan `_archive/` to ensure it doesn't grow indefinitely.
- Use `scripts/maintenance/categorize_assets.py` for audit automation.
