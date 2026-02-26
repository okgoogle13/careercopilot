---
name: kerala-rage-asset-cataloger
description: Analyzes uncategorized kerala-rage assets against the kr-solidarity manifest to generate executable triage plans with gap analysis and compliance validation.
metadata:
  version: 1.1.0
  mode_support: solidarity-only
---

# kerala-rage Asset Cataloger

**Manifest-driven triage and gap analysis for kerala-rage kr-solidarity assets.**

## Purpose

Analyze assets in `assets/uncategorized/` against the canonical manifest and generate an executable JSON action plan for cataloging, cleanup, and manual review.

## Supported Mode

`kerala-rage-solidarity` is the only supported mode.

## Process

1. **Gap Analysis**: Load the manifest and detect unresolved IDs.
2. **Visual Triage**: Classify uncategorized assets as manifest match, duplicate, variant, candidate, or discard.
3. **Action Mapping**: Produce executable move/delete instructions.
4. **Output Generation**: Write structured JSON for downstream automation.

## When To Use

- Triage `assets/uncategorized/` batches.
- Fill documented manifest gaps.
- Detect duplicates before catalog ingestion.
- Validate candidate assets against solidarity compliance rules.
- Generate deterministic action plans for scripted execution.

## Triage Categories

### 1. MANIFEST_MATCH (Priority: CRITICAL)

Visually fulfills a documented missing manifest slot.

```json
{
  "asset": "assets/uncategorized/phase3-015.png",
  "status": "MANIFEST_MATCH",
  "target_id": "KR-SOLID-015",
  "target_category": "ui-kit",
  "proposed_name": "kr-solidarity__ui-kit__navigation-compass__v1.png",
  "visual_description": "Brass compass motif with solidarity-compatible linework",
  "confidence": "HIGH",
  "instruction": "mv assets/uncategorized/phase3-015.png assets/kr-solidarity/ui-kit/kr-solidarity__ui-kit__navigation-compass__v1.png"
}
```

### 2. DUPLICATE (Priority: REMOVE)

Visually identical to an existing canonical file.

```json
{
  "asset": "assets/uncategorized/phase3-002.png",
  "status": "DUPLICATE",
  "visual_description": "Identical to existing canonical symbol asset",
  "confidence": "HIGH",
  "instruction": "rm assets/uncategorized/phase3-002.png"
}
```

### 3. VARIANT (Priority: MEDIUM)

Useful alternative with meaningful, intentional differences.

```json
{
  "asset": "assets/uncategorized/phase3-003.png",
  "status": "VARIANT",
  "target_category": "symbol",
  "proposed_name": "kr-solidarity__cultural__lyrebird-display__v2.png",
  "visual_description": "Alternate pose and composition; preserves motif intent",
  "confidence": "HIGH",
  "instruction": "mv assets/uncategorized/phase3-003.png assets/kr-solidarity/symbol/kr-solidarity__cultural__lyrebird-display__v2.png"
}
```

### 4. NEW_CANDIDATE (Priority: LOW)

Novel asset with potential value that does not map to existing manifest entries.

```json
{
  "asset": "assets/uncategorized/phase3-042.png",
  "status": "NEW_CANDIDATE",
  "target_category": "abstract",
  "proposed_name": "kr-solidarity__atmospheric__lyrebird-street-mural__v1.png",
  "visual_description": "Solidarity-aligned atmospheric composition featuring endemic motif",
  "confidence": "MEDIUM",
  "instruction": "mv assets/uncategorized/phase3-042.png assets/kr-solidarity/abstract/kr-solidarity__atmospheric__lyrebird-street-mural__v1.png"
}
```

### 5. DISCARD (Priority: REMOVE)

Low-quality or non-compliant asset with no clear production use.

```json
{
  "asset": "assets/uncategorized/phase3-005.png",
  "status": "DISCARD",
  "visual_description": "Low resolution screenshot with UI chrome and compression artifacts",
  "confidence": "HIGH",
  "instruction": "rm assets/uncategorized/phase3-005.png"
}
```

## Manifest Integration

- **Primary manifest**: `frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`
- **Gap source**: `references/doc008-gaps.md`
- **Compatibility note**: legacy `ASSET-*` aliases are informational only; canonical IDs are `KR-SOLID-*` / `KR-UI-*`.

## Naming Convention

Pattern: `kr-solidarity__{layer}__{slug}__v{N}.{ext}`

Use the manifest category/layer and keep slugs semantic, short, and deterministic.

## Compliance Rules (Solidarity)

- `PASS`: Contemporary Australian framing, solidarity-forward composition, endemic motifs, readable hierarchy.
- `CONDITIONAL`: Usable core subject but weak hierarchy/palette fit; requires remix.
- `FAIL`: Off-mode visuals (clinical/lab, colonial nostalgia, generic cyberpunk), poor quality, or noncompliant palette/typography.

See: `references/mode-compliance.md` for full matrix and prompt template.

## Required Output

Write: `assets/asset_triage_plan.json`

```json
{
  "metadata": {
    "analysis_date": "ISO-8601",
    "total_assets_analyzed": 49
  },
  "summary": {
    "MANIFEST_MATCH": 8,
    "DUPLICATE": 12,
    "VARIANT": 6,
    "NEW_CANDIDATE": 15,
    "DISCARD": 8
  },
  "triage_actions": [],
  "manifest_gaps_filled": [],
  "manifest_gaps_remaining": [],
  "manual_review_required": []
}
```

## Confidence Calibration

- `HIGH`: Clear structural match to manifest entry or duplicate, no material ambiguity.
- `MEDIUM`: Plausible match with one uncertainty (framing, quality, or category fit).
- `LOW`: Ambiguous asset identity or weak signal quality; requires manual review.

## Execution Phases

- `HIGH` confidence:
  `jq -r '.triage_actions[] | select(.confidence == "HIGH") | .instruction' assets/asset_triage_plan.json | bash`
- `MEDIUM/LOW` confidence: route to review queue before execution.

## Troubleshooting

### Manifest file not found

- Verify path: `frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`.
- Use absolute path in scripts when running outside repo root.

### Malformed manifest JSON

- Validate JSON syntax before running scripts.
- Re-run after fixing trailing commas, bad escapes, or broken object shape.

### Empty uncategorized directory

- Expected behavior: graceful exit with `No assets to catalog`.
- Confirm you passed actual input files and correct working directory.

### Non-image or unsupported files in batch

- Only image files are analyzed.
- Unsupported files are skipped with warnings.

### Ambiguous matches / low confidence

- Keep out of automation path.
- Use manual review with `references/doc008-gaps.md` and `references/mode-compliance.md`.

## Scripts And References

- **Scripts**: `scripts/catalog_assets.py`, `scripts/standardize_png.py`, `scripts/flash_batch.py`, `scripts/package_assets.py`
- **References**: `references/doc008-gaps.md`, `references/asset-inventory.md`, `references/mode-compliance.md`
- **Workflows**: `MANIFEST-WORKFLOW.md`, `INTEGRATION.md`

## Related Skills

- `vision-scorer-mcp`: deterministic visual scoring gate.
- `manifest-reconciler`: manifest gap/orphan verification.
- `batch-processor`: parallel packaging and deployment routing.

---

_Curatorial precision for kerala-rage kr-solidarity design assets_
