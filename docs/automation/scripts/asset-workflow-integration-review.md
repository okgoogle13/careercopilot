# Asset Workflow Integration Review

**Date**: Feb 11, 2026
**Workflow**: PNG Validation → Packaging → Categorization → Placement Suggestion
**Status**: ✅ Integration Ready with Recommendations

---

## 1. Skill Integration Matrix

### 1.1 asset-generation-validator

**Purpose**: Validate PNG compliance across 6 dimensions
**Input**: PNG file path
**Output**: JSON with scores, violations, decision (PACKAGE|REGENERATE)

| Aspect | Status | Notes |
|--------|--------|-------|
| Input Format | ✅ Clear | PNG path required; optional IDF JSON for metadata |
| Output Schema | ✅ Clear | Standard JSON with dimensions, scores, correction_prompt |
| Decision Logic | ✅ Clear | Binary: score ≥90 → PACKAGE, <90 → REGENERATE |
| Integration | ✅ Ready | Output JSON feeds directly to asset-packager |

**Config Required**: None; operates on file paths

---

### 1.2 asset-packager

**Purpose**: Generate production bundle (context.md, tokens.json, usage.md) + copy PNG
**Input**: Validation JSON + PNG path + metadata
**Output**: Directory structure + production file copy

| Aspect | Status | Notes |
|--------|--------|-------|
| Input Format | ⚠️ Clarify | Expects validated_png path; unclear if needs full JSON or just score |
| Output Locations | ✅ Clear | `/assets/ASSET-[N]-[slug]/` + `/frontend/public/assets/{category}/` |
| File Naming | ✅ Clear | `ASSET-[N]-[kebab-case-name]` for metadata dir; `kerala-rage-*` for production |
| Metadata | ⚠️ Clarify | Requires IDF data (colors, kr-motifs, dimensions, mode); unclear source |
| Git Integration | ✅ Clear | Auto-commits to git repo |

**Config Required**:
```json
{
  "asset_id": "ASSET-N",
  "asset_name": "Descriptive Name",
  "category": "kr-motifs|textures|patterns|backgrounds",
  "validated_png": "/path/to/png",
  "compliance_score": 92,
  "idf_data": {
    "colors": {"primary": "#D4A84B", "background": "#1A1714"},
    "kr-motifs": ["baru", "leaf"],
    "dimensions": {"width": 1024, "height": 1024},
    "mode": "kr-dark",
    "purpose": "Background texture"
  }
}
```

---

### 1.3 kerala-rage-asset-cataloger

**Purpose**: Analyze assets and generate categorization manifest
**Input**: Packaged asset directory or manifest
**Output**: JSON categorization with category, variance, recommendations

| Aspect | Status | Notes |
|--------|--------|-------|
| Input Format | ⚠️ Uncertain | Skill description vague on input; likely ingests asset directories |
| Output Schema | ✅ Clear | JSON with asset, category, variance, recommendations |
| Categories | ✅ Clear | Variances, backgrounds, hero-banners, uncategorized, etc. |
| Integration | ⚠️ Clarify | Output feeds to asset-placement-strategy; unclear if auto-triggered |

**Assumption**: Ingests directories from `/assets/ASSET-*` and outputs categorization manifest

---

### 1.4 asset-placement-strategy

**Purpose**: Suggest [DEPRECATED_STYLE] placement based on asset category + wireframe
**Input**: Categorized assets + wireframe specs
**Output**: Placement suggestions (anchor points, [DEPRECATED_STYLE] drift, z-index)

| Aspect | Status | Notes |
|--------|--------|-------|
| Input Format | ⚠️ Clarify | Needs wireframe format spec; accepts markdown annotations? |
| Output Schema | ⚠️ Clarify | Produces markdown suggestions or structured JSON? |
| Wireframe Link | ✅ Conceptual | Should reference `wireframe-annotator` output or hifi notes |
| Archetype Mapping | ⚠️ Clarify | How to specify Seed/Pebble/Lens/Stone mapping per asset? |

**Assumption**: Takes categorized asset manifest + wireframe markdown → outputs placement.md

---

## 2. Directory Structure: Best Practice Layout

```
/careercopilot/
├── assets/
│   ├── uncategorized/              # Incoming, unvalidated assets
│   │   └── [staging-png].png
│   ├── ASSET-1-baru-burst/       # PACKAGED (metadata bundle)
│   │   ├── context.md
│   │   ├── tokens.json
│   │   ├── usage.md
│   │   └── README.md               # Generation params, iteration history
│   ├── ASSET-2-leaf-canopy/
│   │   ├── (same structure)
│   │   └── placement-guide.md       # From asset-placement-strategy
│   └── categorization-manifest.json # From keras-rage-asset-cataloger
│
├── frontend/
│   └── public/
│       └── assets/
│           ├── kr-motifs/          # PRODUCTION (referenced in UI)
│           │   ├── kerala-rage-baru-burst-1024.png
│           │   └── kerala-rage-leaf-canopy-512.png
│           ├── textures/
│           │   ├── texture-kr-dark-lab-grid-512.png
│           │   └── texture-kr-dark-night-garden-2048.jpg
│           └── patterns/
│               └── pattern-[DEPRECATED_STYLE]-tile-256.png
│
├── docs/
│   └── design/
│       ├── assets/
│       │   ├── asset-workflow.md   # This doc
│       │   ├── ASSET-1-baru.md   # Detailed asset specs
│       │   └── placement-reference.md
│       └── wireframes/
│           └── hifi-specs.md
│
└── design-system/
    └── assets/
        ├── kr-atmospheric/        # Design system-specific
        └── kr-[DEPRECATED_STYLE]/
```

---

## 3. File Naming Conventions

### Production Files (in `/frontend/public/assets/`)

**Pattern**: `[prefix]-[descriptor]-[variant]-[size].png`

**Examples**:
- `kerala-rage-baru-burst-1024.png` (kr-motif)
- `texture-kr-dark-lab-grid-512.png` (texture)
- `pattern-[DEPRECATED_STYLE]-tile-256.png` (pattern)
- `background-hero-kr-dark-night-2048.jpg` (hero banner)

**Rules**:
- ✅ Prefix identifies category: `kerala-rage-` (kr-motifs), `texture-` (textures), `pattern-` (patterns), `background-` (backgrounds)
- ✅ Descriptor is kebab-case (2-4 words max)
- ✅ Variant specifies mode or style: `kr-dark`, `kr-light`, `hero`, `tile`
- ✅ Size is pixel dimension (width or max dimension)
- ✅ Lowercase throughout, no underscores

### Metadata Directories (in `/assets/`)

**Pattern**: `ASSET-[N]-[kebab-case-name]/`

**Examples**:
- `ASSET-1-baru-burst/`
- `ASSET-2-leaf-canopy/`
- `ASSET-3-lab-grid-mesh/`

**Rules**:
- ✅ All caps `ASSET-`
- ✅ Sequential number `[N]`
- ✅ Kebab-case name derived from kr-motifs or purpose
- ✅ Contains: context.md, tokens.json, usage.md

---

## 4. Integration Points: Input/Output Chaining

```
PNG File (unvalidated)
    ↓
    ├─→ asset-generation-validator
    │       ├─ Input: /path/to/png
    │       └─ Output: {asset_id, score, decision, correction_prompt}
    │
    ├─→ [IF DECISION == PACKAGE] asset-packager
    │       ├─ Input: validation output + png path + IDF metadata
    │       ├─ Output: /assets/ASSET-[N]-[slug]/ + /frontend/public/assets/{cat}/
    │       └─ Git commit: "feat(assets): Add Asset [N] [name] - [score]/100"
    │
    ├─→ kerala-rage-asset-cataloger
    │       ├─ Input: /assets/ASSET-[N]-*/
    │       └─ Output: categorization-manifest.json + category label
    │
    └─→ asset-placement-strategy
            ├─ Input: categorization manifest + wireframe specs
            └─ Output: placement-guide.md + archetype mappings
```

---

## 5. Critical Clarifications Needed

Before full automation, verify:

1. **asset-packager IDF Source**: Who generates `idf_data`?
   - Option A: Extracted from PNG by vision API (add to validator?)
   - Option B: Provided separately (manual or generated)
   - Option C: Inferred from filename/context

2. **korean-rage-asset-cataloger Input Format**:
   - Does it ingest `/assets/ASSET-*/` directories directly?
   - Or does it need a manifest JSON input?

3. **asset-placement-strategy Wireframe Format**:
   - Accepts Markdown annotations?
   - Needs Figma JSON export?
   - Custom spec format?

4. **Git Commit User**:
   - Credentials auto-available during asset-packager?
   - Or should commits be deferred to manual review?

---

## 6. Recommended Workflow Phases

### Phase 1: Manual Validation (Current)
- Developer places PNG in `/assets/uncategorized/`
- Calls asset-generation-validator manually
- Reviews score + corrections
- Confirms PACKAGE decision

### Phase 2: Automated Packaging
- asset-packager auto-runs on high-scorers (≥90)
- Creates metadata bundle + production copy
- Auto-commits to git (with user context)

### Phase 3: Categorization
- korean-rage-asset-cataloger analyzes packaged assets
- Outputs categorization manifest
- Enables filtering/grouping in design tools

### Phase 4: Placement (Semi-Manual)
- Developer reads hifi wireframe + annotated specs
- Feeds wireframe to asset-placement-strategy
- Reviews suggestions + integrates into component

---

## 7. Risk Assessment

| Risk | Probability | Mitigation |
|------|-------------|-----------|
| Inconsistent IDF metadata | High | Define IDF template; auto-validate structure |
| Git commit failures | Medium | Cache commits; log for manual review |
| Validator false positives | Medium | Review low-scoring assets manually; allow override |
| Placement suggestions misaligned with design intent | High | Include wireframe context; human review required |

---

## 8. Automation Readiness Checklist

- [ ] Clarify asset-packager IDF source
- [ ] Confirm kerala-rage-asset-cataloger input format
- [ ] Test wireframe format with asset-placement-strategy
- [ ] Document archetype mapping rules (Seed/Pebble/Lens/Stone per asset type)
- [ ] Set up git hooks for asset commits
- [ ] Create IDF template + validation schema
- [ ] Run pilot with 3-5 sample assets
- [ ] Integrate into CI/CD (optional)

---

## 9. Estimated Token Cost

| Step | Cost | Notes |
|------|------|-------|
| Validation (1 asset) | 5K | Vision API + compliance scoring |
| Packaging (1 asset) | 8K | Narrative generation + metadata |
| Categorization (5 assets) | 12K | Bulk analysis + manifest |
| Placement (1 wireframe) | 10K | Wireframe parsing + suggestions |
| **Total (5-asset batch)** | **~50K** | Reasonable for high-quality output |

---

_Integration review complete. Ready for pilot test with sample PNG._
