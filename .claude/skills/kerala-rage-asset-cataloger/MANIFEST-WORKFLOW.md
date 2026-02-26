# Manifest-Driven Asset Workflow

## System Architecture

```text
frontend/public/assets/kerala-rage-kr-solidarity-manifest.json (source of truth)
    ↓
Cataloger analyzes uploads and validates manifest structure
    ↓
Standardize PNG applies size constraints from usage_specs
    ↓
Package Assets organizes by category and generates audit metadata
    ↓
Batch Processor handles parallel extraction and deployment
```

## Manifest Location

`frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`

## Complete Workflow

### Phase 1: Catalog New Assets

Small batch (1-15 images):

```bash
python3 scripts/catalog_assets.py \
  frontend/public/assets/kerala-rage-kr-solidarity-manifest.json \
  catalog-$(date +%Y%m%d).json \
  *.jpg *.png
```

Large batch (20+ images), route to Flash Sidekick:

```bash
python3 scripts/flash_batch.py \
  frontend/public/assets/kerala-rage-kr-solidarity-manifest.json \
  image*.jpg
```

### Phase 2: Standardize to PNG

```bash
python3 scripts/standardize_png.py \
  frontend/public/assets/kerala-rage-kr-solidarity-manifest.json \
  /tmp/standardized \
  raw-image1.jpg raw-image2.jpeg
```

Validation:

- Convert to PNG.
- Validate size constraints from `usage_specs.size`.
- Warn on under/oversized assets.
- Preserve transparency.

### Phase 3: Package Assets

```bash
cd /Users/okgoogle13/Projects/careercopilot
python3 .claude/skills/kerala-rage-asset-cataloger/scripts/package_assets.py
```

### Phase 4: Batch Processing

Feed standardized assets to the batch processor:

```json
{
  "batch_id": "manifest-batch-001",
  "assets": [
    {
      "asset_id": "KR-SOLID-017",
      "path": "/packaged_assets/.../symbol/kr-solidarity__cultural__lyrebird-display__v1.png",
      "manifest_entry": {}
    }
  ]
}
```

## Quality Gates

Cataloger checks:

- Manifest exists and parses.
- Duplicate manifest IDs are rejected.
- Input assets are image files.
- Solidarity mode compliance is enforced.

Standardizer checks:

- PNG output format.
- Size within constraints.
- Transparency preserved.

Packager checks:

- Naming convention compliance.
- Category directory placement.
- Package audit metadata generation.
