# Asset Cataloger Integration Example

## Workflow

### Phase 1: Cataloging

```bash
python3 .claude/skills/kerala-rage-asset-cataloger/scripts/catalog_assets.py \
  frontend/public/assets/kerala-rage-kr-solidarity-manifest.json \
  /tmp/catalog.json \
  assets/uncategorized/*.png
```

Sample output entry:

```json
{
  "filename": "upload-001.png",
  "suggested_asset_id": "KR-SOLID-088",
  "analysis_timestamp": "2026-03-08T11:10:00",
  "manifest_compliant": true,
  "validation_notes": []
}
```

### Phase 2: Optional Large-Batch Routing

For 20+ valid images:

```bash
python3 .claude/skills/kerala-rage-asset-cataloger/scripts/flash_batch.py \
  frontend/public/assets/kerala-rage-kr-solidarity-manifest.json \
  assets/uncategorized/*.png
```

This emits a payload for Flash Sidekick routing. It does not mutate files.

### Phase 3: Manual Curation

- Review `entries[]` and `skipped[]`.
- Apply human-approved move/delete operations in a separate step.
- Reject flora/botanical motifs per zero-flora policy.

## Integration Chain

```text
Input assets
  -> catalog_assets.py (metadata)
  -> optional flash_batch.py (routing payload)
  -> manual curation decision
  -> standardize_png.py / package_assets.py
```
