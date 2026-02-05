# Manifest-Driven Asset Workflow

## System Architecture

```
northcote-curio-manifest.json (Source of Truth)
    ↓
Cataloger analyzes uploads → validates against manifest schema
    ↓
Standardize PNG → applies size constraints from usage_specs
    ↓
Package Assets → organizes by category, generates audit
    ↓
Batch Processor → parallel IDF extraction + deployment
```

## Manifest Location

`/Users/okgoogle13/Desktop/careercopilot/assets/northcote-curio-manifest.json`

## Complete Workflow

### Phase 1: Catalog New Assets

**Small batch (1-15 images)**:
```bash
python3 scripts/catalog_assets.py \
  /Users/okgoogle13/Desktop/careercopilot/assets/northcote-curio-manifest.json \
  catalog-$(date +%Y%m%d).json \
  *.jpg *.png
```

**Large batch (20+ images)** - Route to Flash Sidekick:
```bash
# Generate MCP payload
python3 scripts/flash_batch.py \
  /Users/okgoogle13/Desktop/careercopilot/assets/northcote-curio-manifest.json \
  image*.jpg

# Then call: flash-sidekick:batch_file_analysis
```

### Phase 2: Standardize to PNG

```bash
python3 scripts/standardize_png.py \
  /Users/okgoogle13/Desktop/careercopilot/assets/northcote-curio-manifest.json \
  /tmp/standardized \
  raw-image1.jpg raw-image2.jpeg
```

**Validation**:
- Converts to PNG max quality
- Checks size against `usage_specs.size`
- Warns if below minimum or exceeds maximum
- Preserves transparency

### Phase 3: Package Assets

```bash
cd /Users/okgoogle13/Desktop/careercopilot/AIStudioAssets
python3 package_assets.py
```

**Output**:
```
packaged_assets/
  northcote-assets_20260203-1430/
    plates/
      ASSET-1_the-curio-wallpaper.png
      ASSET-6_banksia-pot-shell-stromatolite.png
    fauna/
      ASSET-2_the-sentry-kookaburra.png
    textures/
      ASSET-3_nocturnal-canopy-pattern.png
      ASSET-11_laboratory-paper-white-texture.png
    specimens/
      ASSET-4_wattle-branch-jewel-beetle.png
      ASSET-17_eucalyptus-hanging-ceiling-gum.png
    ui/
      ASSET-7_firefly-sprite.png
      ASSET-15_brass-compass-navigation.png
    package_audit.json
  northcote-assets_20260203-1430.zip
```

### Phase 4: Batch Processing (tier2-automation)

Feed standardized assets to batch-processor:

```json
{
  "batch_id": "manifest-batch-001",
  "assets": [
    {
      "asset_id": "ASSET-17",
      "path": "/packaged_assets/.../specimens/ASSET-17_eucalyptus-hanging.png",
      "manifest_entry": { ...from manifest... }
    }
  ]
}
```

## Naming Convention Enforcement

**From Manifest**:
```json
{
  "id": "ASSET-17",
  "name": "Eucalyptus Hanging Ceiling Gum"
}
```

**Generated Filename**:
`ASSET-17_eucalyptus-hanging-ceiling-gum.png`

**Algorithm**:
1. Take `id` field
2. Convert `name` to lowercase
3. Replace non-alphanumeric with hyphens
4. Join with underscore
5. Append `.png`

## Size Validation Rules

**From `usage_specs.size`**:

| Spec | Interpretation | Action |
|------|----------------|--------|
| `"160px"` | Max 160×160 box | Downscale if larger |
| `"320px width"` | Exact width 320px | Constrain width only |
| `"400px+"` | Minimum 400px width | Warn if smaller, no downscale |
| `"8-16px diameter"` | Range 8-16px | Target 12px, warn outside |

## Integration Points

**Cataloger → Packager**:
- Catalog validates manifest compliance
- Packager reads manifest for specs
- Both enforce PNG + naming standards

**Packager → Batch Processor**:
- Package audit includes asset IDs
- Batch processor reads from category dirs
- IDF generation uses manifest metadata

**Flash Sidekick (20+ images)**:
- Token efficient for large batches
- Returns structured catalog JSON
- Merge with manifest entries

## Quality Gates

**Cataloger checks**:
✅ Mode compliance (no flowers in Laboratory)
✅ Category matches subject
✅ Doc008 gap fulfillment

**Standardizer checks**:
✅ PNG format
✅ Size within constraints
✅ Transparency preserved

**Packager checks**:
✅ Naming convention: `ASSET-N_slug.png`
✅ Category directory placement
✅ Audit manifest generated

## Token Efficiency

**Without Scripts** (manual per-asset):
- Catalog: 15-20 min
- Standardize: 8-10 min
- Package: 12-15 min
- **Total: ~35 min/asset**

**With Scripts** (batch 10 assets):
- Catalog: 2 min (script)
- Standardize: 1 min (script)
- Package: 1 min (script)
- **Total: 4 min for 10 assets (0.4 min/asset)**

**Savings: 98.9% time reduction**

**Token Usage**:
- Script execution: ~50 tokens/call
- Manual analysis: ~2000 tokens/asset
- **20 assets: 1000 tokens vs 40,000 tokens**
