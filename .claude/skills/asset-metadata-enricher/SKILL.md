---
name: asset-metadata-enricher
description: Enrich KR Solidarity manifest assets with deterministic alt text and semantic metadata using canonical project context and idempotent update rules.
metadata:
  version: 1.1.0
  tags:
    - assets
    - ai
    - accessibility
    - metadata
---

# Asset Metadata Enricher

## Purpose

Generate and append high-quality metadata for KR Solidarity assets in the canonical manifest, including accessibility alt text and semantic descriptors, without breaking existing entries.

## When to Use

- A manifest has assets missing `alt_text` or semantic descriptors.
- New assets were added and require accessibility metadata.
- Metadata quality audit flags missing/inconsistent fields.

## Canonical Inputs

Required:
- `frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`

Context references (recommended):
- `docs/design/01_CANON.md`
- `docs/design/Archive/KERALA_RAGE_BRAND_BRIEF.md`

Notes:
- Do not target root `manifest.json` in this repo.
- If optional context files are unavailable, proceed with conservative metadata language.

## Scope

In scope:
- `alt_text`
- semantic context fields (for example `political_significance`, `cultural_context`, `usage_notes`)

Out of scope:
- asset generation or image editing
- changing canonical asset IDs or file paths
- deleting manifest entries

## Metadata Rules

1. `alt_text`
- concise, descriptive, non-promotional
- no style-only filler
- suitable for screen readers

2. `political_significance`
- short contextual statement grounded in project canon
- avoid speculative claims when confidence is low

3. `cultural_context`
- identify relevant cultural framing where present
- if uncertain, use neutral phrasing and mark low confidence

4. `usage_notes`
- optional implementation hints (layer role, safe placement context)

## Idempotent Update Rules

- Only enrich missing or empty metadata fields by default.
- Never overwrite non-empty fields unless `force_overwrite=true` is explicitly provided.
- Preserve unknown existing keys in each manifest entry.
- Maintain stable ordering of existing asset entries.

## Deterministic Output Contract

Return a report object:

```json
{
  "summary": {
    "assets_total": 0,
    "assets_enriched": 0,
    "assets_skipped": 0,
    "assets_failed": 0
  },
  "enriched": [
    {
      "asset_id": "KR-SOLID-022",
      "fields_added": ["alt_text", "political_significance"],
      "confidence": 0.91
    }
  ],
  "skipped": [
    {
      "asset_id": "KR-UI-004",
      "reason": "existing_metadata_present"
    }
  ],
  "failed": [
    {
      "asset_id": "KR-SOLID-099",
      "reason": "asset_entry_invalid"
    }
  ]
}
```

## Process

1. Parse canonical manifest.
2. Build enrichment target set (missing/empty metadata fields).
3. Generate metadata text using available context docs.
4. Apply idempotent updates per rules.
5. Validate updated manifest JSON shape.
6. Emit enrichment summary + changed asset IDs.

## Verification Checklist

- Manifest remains valid JSON.
- No asset IDs changed.
- No file paths changed.
- Only intended metadata fields were added/updated.
- Re-running with same inputs causes zero additional changes (idempotency).

## Safety Rules

- Never delete or rename assets.
- Never rewrite unrelated manifest fields.
- Do not introduce flora/botanical language that violates active project canon.
- If context is ambiguous, prefer neutral metadata and lower confidence tags.

## Troubleshooting

### Manifest parse failure

- Validate JSON syntax in `frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`.

### No assets enriched

- Expected when all target fields are already populated.
- Confirm target fields and overwrite mode.

### Overwrite concerns

- Ensure `force_overwrite` is not enabled unintentionally.
- Compare before/after for changed keys only.

### Low-confidence metadata

- Re-run with richer contextual input or manually review flagged entries.

## Example

Input asset (missing metadata):

```json
{
  "id": "KR-SOLID-022",
  "name": "Devotional -solidarity",
  "file_path": "/assets/kr-solidarity/devotional/...png"
}
```

Output patch intent:

```json
{
  "id": "KR-SOLID-022",
  "alt_text": "Devotional solidarity composition with layered symbolic framing.",
  "political_significance": "Frames collective resistance through spiritual iconography in diaspora context.",
  "cultural_context": "KR Solidarity canon-aligned devotional motif."
}
```

## Related Skills

- `manifest-reconciler`
- `asset-token-replacer`
- `asset-placement-strategy`

Last Updated: 2026-03-08 | Version: 1.1.0
