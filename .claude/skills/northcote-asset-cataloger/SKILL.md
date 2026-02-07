---
name: northcote-asset-cataloger
description: Visual triage analyst for Northcote Curio design system. Analyzes uncategorized assets against northcote-curio-manifest.json to generate executable action plans (move/delete/variant). Performs gap analysis, duplicate detection, and mode compliance validation. Outputs structured JSON for automated batch processing.
version: 1.0.0
tags: []
---

# Northcote Asset Cataloger

**Manifest-driven triage and gap analysis for Northcote Curio assets.**

## Purpose

Perform comprehensive visual analysis of assets in `assets/uncategorized/` against the canonical manifest to generate an executable action plan in JSON format.

## Process

1. **Gap Analysis**: Load the manifest and identify "Missing" IDs (e.g., ASSET-7 to ASSET-19).
2. **Visual Triage**: Analyze uncategorized assets for manifest matches, duplicates, or variants.
3. **Action Mapping**: Assign triage categories (MATCH, DUPLICATE, VARIANT, etc.) and generate shell instructions.
4. **Output Generation**: Produce `assets/asset_triage_plan.json` for automated batch processing.

## When to Use

- Triage uncategorized assets (`assets/uncategorized/` folder)
- Fill manifest gaps (ASSET-7 to ASSET-19)
- Identify duplicates before adding to canonical library
- Validate new asset batches against design system rules
- Generate automation-ready action plans

## Triage Categories

### 1. MANIFEST_MATCH (Priority: CRITICAL)

Visually fulfills documented "Missing" slot in manifest.

**Output**: Move instruction with correct naming

```json
{
  "asset": "assets/uncategorized/phase3-015.png",
  "status": "MANIFEST_MATCH",
  "target_id": "ASSET-15",
  "target_category": "ui",
  "proposed_name": "northcote-ui-compass-rose.png",
  "visual_description": "Brass compass with Victorian engravings",
  "confidence": "HIGH",
  "instruction": "mv assets/uncategorized/phase3-015.png assets/ui/northcote-ui-compass-rose.png"
}
```

### 2. DUPLICATE (Priority: REMOVE)

Visually identical to existing canonical file.

**Output**: Delete instruction

```json
{
  "asset": "assets/uncategorized/phase3-002.png",
  "status": "DUPLICATE",
  "visual_description": "Identical to assets/fauna/northcote-sentry-kookaburra.png",
  "confidence": "HIGH",
  "instruction": "rm assets/uncategorized/phase3-002.png"
}
```

### 3. VARIANT (Priority: MEDIUM)

Useful alternative with meaningful differences.

**Output**: Move with `-variant-N` suffix

```json
{
  "asset": "assets/uncategorized/phase3-003.png",
  "status": "VARIANT",
  "target_category": "specimens",
  "proposed_name": "northcote-specimen-banksia-pod-variant-2.png",
  "visual_description": "Different angle, 2048px vs 1024px existing",
  "confidence": "HIGH",
  "instruction": "mv assets/uncategorized/phase3-003.png assets/specimens/northcote-specimen-banksia-pod-variant-2.png"
}
```

### 4. NEW_CANDIDATE (Priority: LOW)

Novel asset with value, not matching manifest/existing.

**Output**: Move to category with descriptive name

```json
{
  "asset": "assets/uncategorized/phase3-042.png",
  "status": "NEW_CANDIDATE",
  "target_category": "fauna",
  "proposed_name": "northcote-fauna-lyrebird-display.png",
  "visual_description": "Victorian lyrebird illustration, warm sepia, no existing lyrebird",
  "confidence": "MEDIUM",
  "instruction": "mv assets/uncategorized/phase3-042.png assets/fauna/northcote-fauna-lyrebird-display.png"
}
```

### 5. DISCARD (Priority: REMOVE)

Low quality, noise, test artifacts, no clear use.

**Output**: Delete with reason

```json
{
  "asset": "assets/uncategorized/phase3-005.png",
  "status": "DISCARD",
  "visual_description": "Low res (120×80px) screenshot with browser UI, compression artifacts",
  "confidence": "HIGH",
  "instruction": "rm assets/uncategorized/phase3-005.png"
}
```

## Manifest Integration

**Source**: `/Users/okgoogle13/Desktop/careercopilot/assets/northcote-curio-manifest.json`

**Gap Analysis**: Load manifest, filter `status: "Missing"`, match ASSET-7 through ASSET-19 against uncategorized assets.

## Naming Convention

**Pattern**: `northcote-{category}-{descriptive-name}[-variant-N].png`

**Categories**: fauna, plates, specimens, textures, ui, mockups

## Mode Compliance

**Gallery**: ✅ Botanicals, fauna, warm tones | ❌ Technical diagrams
**Laboratory**: ✅ Diagrams, instruments, cool tones | ❌ Flowers, fauna

## Required Output

Save to: `assets/asset_triage_plan.json`

**Schema**:

```json
{
  "metadata": {
    "analysis_date": "ISO 8601",
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

## Execution Phases

**HIGH confidence**: `jq -r '.triage_actions[] | select(.confidence == "HIGH") | .instruction' | bash`
**Manual review**: Extract MEDIUM/LOW confidence to separate queue

## Scripts & References

**Scripts**: catalog_assets.py, standardize_png.py, flash_batch.py, package_assets.py
**References**: doc008-gaps.md, asset-inventory.md, mode-compliance.md
**Integration**: MANIFEST-WORKFLOW.md, INTEGRATION.md

---

_Curatorial precision for Victorian naturalist design assets_
