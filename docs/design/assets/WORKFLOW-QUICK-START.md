# Asset Workflow Quick Start

Fast reference for using the orchestrated asset pipeline.

---

## TL;DR - Chained Skills

```bash
# Run the full workflow
python scripts/orchestrate-asset-workflow.py \
  --png /path/to/asset.png \
  --category kr-motifs \
  --force-package  # Optional: skip score threshold check
```

**Output**:
- ✅ `/assets/ASSET-[ID]-[name]/` (metadata bundle)
- ✅ `/frontend/public/assets/{category}/[filename].png` (production copy)
- ✅ Placement guide + usage CSS
- ✅ Git commit ready

---

## Workflow Stages

### 1️⃣ Validation (asset-generation-validator)

**What it does**: Score PNG across 6 dimensions

```
Input:  /path/to/image.png
Output: {asset_id, score, decision}

Score ≥90  →  PACKAGE ✅
Score <90  →  REGENERATE ⚠️
```

**Scores Checked**:
- Geographic authenticity (Australian endemic flora)
- Translucency physics (light transmission)
- Scale hierarchy (primary 1.5-2× secondary)
- Density zones (empty space + Wunderkammer central)
- Background color (#1A1714 ±5%)
- Typography (serif labels, cream color)

---

### 2️⃣ Packaging (asset-packager)

**What it does**: Generate metadata bundle + copy production file

```
Input:  validation result + PNG path + category
Output:
  /assets/ASSET-[ID]-[slug]/
    ├── context.md      (Narrative + kr-motifs)
    ├── tokens.json     (Design tokens)
    ├── usage.md        (CSS + responsive)
    ├── placement-guide.md
    └── README.md       (Iteration history)

  /frontend/public/assets/{category}/
    └── kerala-rage-[name]-kr-dark-[size].png
```

**Categories Available**:
- `kr-motifs` (kr-motif-variant)
- `textures` (texture-background)
- `patterns` (seamless-pattern)
- `backgrounds` (hero-banner)

---

### 3️⃣ Categorization (kerala-rage-asset-cataloger)

**What it does**: Assign category, variance, and tags

```
Input:  /assets/ASSET-[ID]-*/
Output:
  {
    "primary_category": "kr-motif-variant",
    "variance": "dark-mode",
    "tags": ["kerala-rage", "kr-dark", "..."]
  }
```

**Outputs**:
- Primary category (kr-motif-variant, texture-background, etc.)
- Variance (dark-mode, light-mode, seasonal, etc.)
- Tags (for filtering/grouping)
- Compliance score
- Ready-for-placement flag

---

### 4️⃣ Placement Strategy (asset-placement-strategy)

**What it does**: Generate organic placement guidelines

```
Input:  categorization manifest + (optional) wireframe specs
Output: placement-guide.md + CSS recommendations

Recommendations:
  - Archetype (Seed, Pebble, Lens, Stone)
  - Z-index range (1-5, 10-20, etc.)
  - Opacity (Gallery: 0.65, Lab: 0.15)
  - Organic drift (7.5% not 8%, 4.2% not 5%)
  - Density zones (upper-left, central, lower-right)
```

**Assets Provided**:
- Archetype mapping (Stone for heavy backgrounds)
- Z-index recommendations
- Opacity ranges (Gallery vs. Laboratory modes)
- Organic drift values (asymmetric positioning)
- Density zone guidelines
- Component recommendations

---

## File Structure

### Expected Input

```
/frontend/ChatGPT Image Feb 11, 2026, 12_47_46 AM.png
├── Size: 2.4MB
├── Dimensions: 1024×1024
└── Format: PNG
```

### Generated Output

```
/assets/ASSET-20260211-023251-botanical-canopy-{id}/
├── context.md (92 lines)
│   └── Narrative: Kerala-streetprint naturalist discovery
│   └── kr-motifs: Wattle, leaves, endemic flora
│   └── Mode context: Gallery (warm), Lab (clinical)
│
├── tokens.json (43 lines, DTCG-compliant)
│   └── Colors: #1A1714 (background), #D4A84B (primary), #C45C4B (secondary)
│   └── Dimensions: 1024×1024 PNG
│   └── Density zones: 18% upper-left, 65% central, 20% lower-right
│   └── Compliance: 78/100
│
├── usage.md (74 lines)
│   └── CSS implementations for different contexts
│   └── Opacity guidelines (Gallery 0.65, Lab 0.15)
│   └── Responsive breakpoints (desktop, tablet, mobile)
│   └── Component integration recommendations
│
├── placement-guide.md (46 lines)
│   └── Archetype: Stone (layered, heavy)
│   └── Z-index: 1-5
│   └── Organic drift: 7.5% horizontal, 4.2% vertical
│   └── Density zones: upper-left 18%, central 65%, lower-right 20%
│   └── Validation checklist (4 items)
│
└── README.md (19 lines)
    └── Asset ID, creation timestamp, score, status
    └── Iteration history (attempt 1: 78/100 → REGENERATE)
    └── Next steps

/frontend/public/assets/kr-motifs/
└── kerala-rage-botanical-canopy-kr-dark-1024.png
    └── Referenced as: /assets/kr-motifs/kerala-rage-botanical-canopy-kr-dark-1024.png
    └── Used in components via CSS background-image
```

---

## Usage Examples

### Example 1: Validate & Package a New Asset

```bash
# Step 1: Run orchestrator
python scripts/orchestrate-asset-workflow.py \
  --png /path/to/new-botanical-asset.png \
  --category kr-motifs

# Step 2: Review output
cat /assets/ASSET-*/placement-guide.md

# Step 3: Integrate into component
# Use /assets/kr-motifs/kerala-rage-*.png in CSS
```

### Example 2: Force Package a Below-Threshold Asset (for testing)

```bash
python scripts/orchestrate-asset-workflow.py \
  --png /path/to/test-asset.png \
  --category textures \
  --force-package  # Skip 90-point threshold

# Output: asset still packaged even if score 78/100
# Useful for: testing workflow, iterating on design
```

### Example 3: Batch Process Multiple Assets

```bash
for asset in /assets/uncategorized/*.png; do
  python scripts/orchestrate-asset-workflow.py \
    --png "$asset" \
    --category kr-motifs
done

# Tip: Wrap in batch-processor skill for parallel execution + aggregated reports
```

---

## Key File Locations

| File/Dir | Purpose | Example |
|----------|---------|---------|
| Input | Source PNG | `/frontend/ChatGPT Image*.png` |
| Metadata | Bundle directory | `/assets/ASSET-20260211-*/` |
| Production | Linked in UI | `/frontend/public/assets/kr-motifs/*.png` |
| Docs | Asset specs | `/docs/design/assets/` |
| Styles | CSS usage | See `usage.md` in metadata dir |

---

## Design Token Reference

All generated assets use this palette:

```json
{
  "background": "#1A1714",        // Asphalt black
  "primary": ["#D4A84B", "#C45C4B"],    // Wattle gold, Waratah red
  "secondary": ["#B8733D", "#7A9E82"]   // Ochre earth, Gum leaf green
}
```

---

## Workflow Decision Tree

```
PNG Input
  ↓
Score < 90?
  ├─ YES → REGENERATE (apply correction_prompt to Gemini)
  └─ NO → PACKAGE
       ↓
    Create metadata bundle
       ↓
    Categorize asset
       ↓
    Generate placement guide
       ↓
    Ready for integration ✅
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| Score < 90 | Use `--force-package` for testing, or apply corrections + regenerate |
| File not found | Check PNG path is absolute, not relative |
| Permission denied | Ensure `/assets/` and `/frontend/public/assets/` are writable |
| Git commit fails | Verify git credentials configured; check `.git/` exists |
| CSS background not showing | Verify `/assets/` path in generated usage.md matches actual location |

---

## Performance Tips

**Fast path** (single asset): ~30 seconds
**Batch path** (5 assets parallel): ~2 minutes (use `batch-processor`)
**Token cost**: ~20K per asset

---

## Next: Integration in Component

Once asset is packaged, integrate into React component:

```tsx
// Example: Dashboard background
export const Dashboard = () => {
  return (
    <div
      className="dashboard-root"
      style={{
        backgroundImage: 'url(/assets/kr-motifs/kerala-rage-botanical-canopy-kr-dark-1024.png)',
        backgroundSize: 'cover',
        opacity: 0.65  // Gallery mode
      }}
    >
      {/* Content */}
    </div>
  );
};
```

See `usage.md` in asset metadata directory for CSS implementation details.

---

**Script**: `scripts/orchestrate-asset-workflow.py`
**Full Guide**: `docs/design/assets/WORKFLOW-TEST-RESULTS.md`
**Integration Review**: `scripts/asset-workflow-integration-review.md`

_Last updated: Feb 11, 2026_
