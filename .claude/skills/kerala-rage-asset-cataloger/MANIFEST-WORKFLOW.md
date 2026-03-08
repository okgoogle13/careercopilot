# Manifest-Driven Asset Workflow

## Architecture

```text
frontend/public/assets/kerala-rage-kr-solidarity-manifest.json (source of truth)
  -> catalog_assets.py (manifest + file validation)
  -> standardize_png.py (format + size processing)
  -> package_assets.py (package + audit metadata)
```

## Manifest Location

`frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`

## Commands

### 1) Catalog batch

```bash
python3 .claude/skills/kerala-rage-asset-cataloger/scripts/catalog_assets.py \
  frontend/public/assets/kerala-rage-kr-solidarity-manifest.json \
  /tmp/catalog.json \
  assets/uncategorized/*.png
```

### 2) Standardize to PNG

```bash
python3 .claude/skills/kerala-rage-asset-cataloger/scripts/standardize_png.py \
  frontend/public/assets/kerala-rage-kr-solidarity-manifest.json \
  /tmp/standardized \
  assets/uncategorized/*.jpg
```

### 3) Package assets

```bash
python3 .claude/skills/kerala-rage-asset-cataloger/scripts/package_assets.py
```

## Quality Gates

Cataloger:
- manifest exists and parses
- duplicate manifest IDs rejected
- input files must exist and be supported image types

Standardizer:
- output PNG generation
- size constraint warnings from `usage_specs`
- transparency preserved where possible

Packager:
- manifest-driven category organization
- package audit metadata output

## Safety

- Do not pipe generated commands directly to `bash`.
- Keep move/delete actions in explicit human-reviewed steps.
- Enforce zero-flora motif policy during manual curation.
