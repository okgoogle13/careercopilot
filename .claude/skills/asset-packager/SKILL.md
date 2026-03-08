---
name: asset-packager
description: Package validated KR assets into production-ready bundles (context.md, tokens.json, usage.md) with deterministic file outputs and compliance-safe metadata.
metadata:
  version: 1.1.0
  tags:
    - assets
    - packaging
    - automation
    - compliance
---

# Asset Packager

## Purpose

Create a standard production bundle for a validated asset:
- `context.md`
- `tokens.json`
- `usage.md`
- copied production PNG in the correct asset category path

This skill standardizes packaging and removes repetitive manual formatting.

## When to Use

- After an asset passes validation threshold (recommended: >= 90).
- When a new PNG must be integrated into the canonical asset structure.
- When downstream teams need both human-readable context and machine-readable token metadata.

## Scope

This skill covers:
- Bundle file generation from validated inputs.
- Compliance-safe metadata transformation.
- Deterministic naming and path conventions.

This skill does not cover:
- Image generation.
- Visual scoring itself.
- Automatic git commit/push (optional and manual by default).

## Inputs

Required fields:

```json
{
  "asset_id": "ASSET-3",
  "asset_name": "Solidarity Mesh Tile",
  "validated_png": "frontend/tmp/asset-3-validated.png",
  "compliance_score": 92,
  "idf_data": {
    "colors": {
      "background": "#1A1714",
      "primary": "#F14714",
      "accent": "#DAF674"
    },
    "kr_motifs": ["anchor-signal", "solidarity-grid"],
    "dimensions": { "width": 512, "height": 512 },
    "mode": "solidarity-dark",
    "purpose": "seamless background texture"
  }
}
```

Validation rules:
- `asset_id` must match `ASSET-[number]`.
- `validated_png` must exist.
- `compliance_score` should be numeric.
- Metadata must not include banned flora/endemic terms.

## Outputs

For each packaged asset directory (`assets/ASSET-[N]-[slug]/`):

1. `context.md`
- Narrative intent.
- Motif rationale.
- Mode context.
- UI placement guidance.

2. `tokens.json`
- Asset id/name.
- Color/tone metadata.
- Dimensions and format.
- Compliance score.
- Semantic tags.

3. `usage.md`
- CSS usage pattern.
- Responsive behavior.
- Recommended/avoid contexts.

4. Production PNG copy
- Copied to the appropriate category folder under `frontend/public/assets/...`.

## Process

1. Validate input contract.
2. Normalize metadata to canon-safe vocabulary.
3. Create target folder: `assets/ASSET-[N]-[slug]/`.
4. Generate `context.md`.
5. Generate `tokens.json`.
6. Generate `usage.md`.
7. Copy PNG to production category path.
8. Emit packaging summary report.

## Compliance Rules

- Use semantic KR Solidarity vocabulary only.
- Enforce zero-flora policy in generated content.
- Prefer semantic token names over ad hoc color labels.
- Do not emit deprecated token names.

## Usage Example

```bash
# Example invocation via local automation wrapper
./scripts/package-asset.sh \
  --asset-id ASSET-3 \
  --asset-name "Solidarity Mesh Tile" \
  --png frontend/tmp/asset-3-validated.png \
  --score 92 \
  --category patterns
```

Expected result (summary):
- Created: `assets/ASSET-3-solidarity-mesh-tile/{context.md,tokens.json,usage.md}`
- Copied: `frontend/public/assets/patterns/solidarity-mesh-tile-512.png`

## Edge Cases & Fallbacks

- Missing PNG path: fail fast with file-not-found error.
- Invalid asset id format: fail with required pattern.
- Unknown category: route to `frontend/public/assets/misc/` and mark warning.
- Partial metadata: generate files with explicit `TODO_REQUIRED_FIELD` markers.

## Troubleshooting

### Generated files exist but metadata is incomplete
- Confirm IDF payload includes dimensions, colors, and purpose.
- Re-run with full validation output.

### Output copied to wrong category
- Validate category mapping rules in packaging wrapper.
- Use explicit category flag.

### Content includes non-canonical language
- Run brand/compliance enforcement before packaging.
- Replace deprecated vocabulary and regenerate bundle files.

## Best Practices

- Keep generated bundle deterministic (same inputs -> same outputs).
- Include compliance score and timestamp in `tokens.json` metadata.
- Prefer manual review before any commit step.
- Keep commit actions outside this skill unless explicitly requested.

## Related Skills

- `auto-validator` for pre-packaging compliance scoring.
- `asset-metadata-enricher` for improved semantic metadata.
- `manifest-reconciler` for post-packaging registry consistency.
