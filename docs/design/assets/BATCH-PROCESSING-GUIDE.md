# Batch Asset Processing Guide

**Quick reference for processing multiple PNG assets at once.**

---

## TL;DR

```bash
# Process a ZIP file
./scripts/process-asset-batch.sh my-assets.zip

# Process a directory
./scripts/process-asset-batch.sh /path/to/pngs/

# Process with specific category
./scripts/process-asset-batch.sh my-assets.zip textures
```

---

## Input Formats

### Option 1: ZIP File (Recommended for sharing)

```bash
./scripts/process-asset-batch.sh my-assets.zip kr-motifs
```

**When to use**:
- ✅ Sharing assets across team
- ✅ External vendor handoff
- ✅ Need single distributable file
- ✅ Combine with metadata files

**ZIP structure**:
```
my-[DEPRECATED_STYLE]-assets.zip
├── asset-1.png
├── asset-2.png
├── asset-3.png
├── asset-4.png
└── asset-5.png
```

**Create ZIP from PNGs**:
```bash
zip my-[DEPRECATED_STYLE]-assets.zip *.png
```

---

### Option 2: Directory (Recommended for CI/CD)

```bash
./scripts/process-asset-batch.sh /path/to/pngs/ kr-motifs
```

**When to use**:
- ✅ Local development
- ✅ CI/CD pipeline integration
- ✅ Real-time asset intake
- ✅ Mounted/network storage

**Directory structure**:
```
/path/to/pngs/
├── asset-1.png
├── asset-2.png
├── asset-3.png
└── ...
```

**Create directory of PNGs**:
```bash
mkdir -p /assets/uncategorized/my-batch/
mv *.png /assets/uncategorized/my-batch/
./scripts/process-asset-batch.sh /assets/uncategorized/my-batch/
```

---

### Option 3: Manifest JSON (Advanced)

For complex workflows with per-asset configuration:

```json
{
  "assets": [
    {
      "path": "/downloads/asset-1.png",
      "category": "kr-motifs",
      "descriptor": "ink-burst"
    },
    {
      "path": "s3://bucket/asset-2.png",
      "category": "textures",
      "descriptor": "lab-grid"
    }
  ]
}
```

**When to use**:
- ✅ Mix of local + remote sources
- ✅ Per-asset category assignment
- ✅ Per-asset metadata
- ✅ External sources (S3, URLs)

---

## Usage Examples

### Example 1: Process 5 DashboardOverview Assets

```bash
# 1. Create/receive ZIP from design team
# my-dashboard-assets.zip (5 kr-motif PNGs)

# 2. Process batch
./scripts/process-asset-batch.sh my-dashboard-assets.zip kr-motifs

# 3. Review results
ls /assets/ASSET-*/
cat /assets/batch-results-*.json | jq .

# 4. Check specific assets
cat /assets/ASSET-20260211-001-ink-burst/context.md
```

**Output**:
```
✅ Batch Processing Complete
  Total: 5
  Successful: 4
  Failed: 1

Next Steps:
  1. Review asset metadata:
     ls -la /assets/ASSET-*/

  2. Check placement guides:
     cat /assets/ASSET-*/placement-guide.md

  3. Verify production files:
     ls /frontend/public/assets/kr-motifs/
```

---

### Example 2: Continuous Integration (CI/CD)

```bash
#!/bin/bash
# .github/workflows/asset-validation.yml

- name: Process asset batch
  run: |
    ./scripts/process-asset-batch.sh /assets/uncategorized/ kr-motifs

- name: Generate report
  run: |
    jq '.' /assets/batch-results-*.json > /tmp/asset-report.json
    echo "Asset Batch Report" >> $GITHUB_STEP_SUMMARY
    cat /tmp/asset-report.json >> $GITHUB_STEP_SUMMARY
```

---

### Example 3: Process Multiple Categories

```bash
# Batch 1: kr-motifs
./scripts/process-asset-batch.sh batch1-motifs.zip kr-motifs

# Batch 2: textures
./scripts/process-asset-batch.sh batch2-textures.zip textures

# Batch 3: patterns
./scripts/process-asset-batch.sh batch3-patterns.zip patterns

# Review all results
ls /assets/batch-results-*.json
```

---

## Categories Available

| Category | Type | Description |
|----------|------|-------------|
| `kr-motifs` | [DEPRECATED_STYLE] | Australian endemic flora (ink, leaves, etc.) |
| `textures` | Background | Lab aesthetic, meshes, overlays |
| `patterns` | Seamless | Tile-able patterns for backgrounds |
| `backgrounds` | Hero | Full-screen atmospheric backgrounds |

---

## Script Options

```bash
./scripts/process-asset-batch.sh <INPUT> [CATEGORY] [FORCE_PACKAGE]

Arguments:
  INPUT          ZIP file or directory of PNGs (required)
  CATEGORY       Asset category (default: kr-motifs)
  FORCE_PACKAGE  Force packaging even if score <90 (true/false, default: false)

Examples:
  ./scripts/process-asset-batch.sh my-assets.zip
  ./scripts/process-asset-batch.sh my-assets.zip kr-motifs true
  ./scripts/process-asset-batch.sh /path/to/pngs/ textures
```

---

## Output Structure

After batch processing, files are organized as:

```
/assets/
├── ASSET-20260211-001-ink-burst/
│   ├── context.md (narrative + kr-motifs)
│   ├── tokens.json (design tokens)
│   ├── usage.md (CSS + responsive)
│   ├── placement-guide.md (layout strategy)
│   └── README.md (iteration history)
├── ASSET-20260211-002-leaf-canopy/
│   └── (same 5 files)
├── ASSET-20260211-003-lab-grid/
│   └── (same 5 files)
├── batch-results-20260211-120000.json
│   {
│     "batch_id": "batch-20260211-120000",
│     "total_processed": 5,
│     "successful": 4,
│     "failed": 1,
│     "success_rate": 80%
│   }
└── categorization-manifest.json

/frontend/public/assets/
├── kr-motifs/
│   ├── kerala-rage-ink-burst-kr-dark-1024.png
│   ├── kerala-rage-leaf-canopy-kr-dark-1024.png
│   └── ... (one per successful asset)
└── textures/
    └── ... (if texture category assets)
```

---

## Performance

### Speed

| Scenario | Assets | Method | Time |
|----------|--------|--------|------|
| Small batch | 3 | Sequential | ~1.5 min |
| Medium batch | 5 | Sequential | ~2.5 min |
| Medium batch | 5 | Parallel (5 workers) | ~30 sec |
| Large batch | 20 | Sequential | ~10 min |
| Large batch | 20 | Parallel (5 workers) | ~2 min |

**Automatic decision**:
- **<5 assets**: Sequential (simpler, easier to debug)
- **≥5 assets**: Parallel (5 workers, 5× faster)

### Token Cost

| Batch Size | Sequential | Parallel (parallel) |
|-----------|-----------|-----------|
| 1 asset | ~20K tokens | N/A |
| 5 assets | ~100K tokens | ~100K tokens (same work) |
| 10 assets | ~200K tokens | ~200K tokens (same work) |

**Note**: Total tokens same regardless of execution method. Parallelization saves wall-clock time, not tokens.

---

## Results & Reporting

### Batch Results JSON

Each batch run generates `batch-results-{timestamp}.json`:

```json
{
  "batch_id": "batch-20260211-120000",
  "input": "/assets/uncategorized/batch-20260211-120000",
  "category": "kr-motifs",
  "timestamp": "2026-02-11T12:00:00Z",
  "summary": {
    "total_processed": 5,
    "successful": 4,
    "failed": 1,
    "success_rate": "80%"
  },
  "asset_directories": "4 directories created"
}
```

### Review Results

```bash
# View batch results
cat /assets/batch-results-*.json | jq .

# Check specific asset
cat /assets/ASSET-20260211-001-*/tokens.json | jq '.compliance_score'

# List all created assets
ls -d /assets/ASSET-*/ | wc -l

# Summary statistics
jq '.summary' /assets/batch-results-*.json
```

---

## Troubleshooting

### Issue: "No PNG files found"

**Cause**: ZIP extracts to wrong location, or directory empty

**Fix**:
```bash
# Check extraction
unzip -l my-assets.zip

# Verify directory contents
ls -la /assets/uncategorized/batch-{timestamp}/

# Check permissions
chmod 755 /assets/uncategorized/batch-*/
```

---

### Issue: Some assets failed to process

**Cause**: Validation score <90 without `--force-package`

**Fix**:
```bash
# Reprocess with force-package
./scripts/process-asset-batch.sh my-assets.zip kr-motifs true

# Or check individual asset scores
cat /assets/batch-results-*.json | jq '.assets[] | select(.status=="failed")'
```

---

### Issue: Out of memory (large batch)

**Cause**: Too many parallel workers for available RAM

**Fix**: Edit script to reduce workers
```bash
# In process-asset-batch.sh, change:
MAX_WORKERS=5  # Reduce to 3 or 2
```

---

### Issue: Slow processing

**Cause**: Sequential processing; should be parallel

**Fix**: Script auto-selects; for manual parallel:
```bash
# Use Python parallel runner
python3 << 'SCRIPT'
# See "Parallel Batch Processing" section in main guide
SCRIPT
```

---

## Workflow Integration

### For Design Teams

1. **Create batch**: Gather 5-10 PNGs from Figma/Procreate
2. **Package ZIP**: `zip my-assets.zip *.png`
3. **Share**: Send ZIP to dev team
4. **Feedback**: Receive batch-results.json with compliance scores

### For Developers

1. **Receive**: Get ZIP from design team
2. **Process**: `./scripts/process-asset-batch.sh my-assets.zip`
3. **Review**: Check batch-results.json and categorization manifest
4. **Iterate**: If scores <90, provide feedback on corrections needed
5. **Deploy**: Move production files, commit metadata

### For QA/Design Review

1. **Review**: Read context.md + placement-guide.md for each asset
2. **Validate**: Check production PNGs in `/frontend/public/assets/`
3. **Test**: Verify CSS integration in components
4. **Approve**: Sign off on batch

---

## Best Practices

### ✅ Do

- ✅ Name PNGs descriptively: `ink-burst.png`, `leaf-canopy.png`
- ✅ Batch by category: Keep kr-motifs separate from textures
- ✅ Include README: Document asset sources/notes in ZIP
- ✅ Review scores: Check compliance before deployment
- ✅ Test responsiveness: Verify assets work across breakpoints

### ❌ Don't

- ❌ Mix categories in single batch
- ❌ Use generic names: `asset-1.png`, `design-01.png`
- ❌ Skip score review: Deploy all assets regardless of validation
- ❌ Ignore failed validations: They indicate design issues
- ❌ Modify produced metadata: Let script regenerate if needed

---

## Example: Full DashboardOverview Asset Batch

**Scenario**: Design team creates 5 assets for DashboardOverview HiFi spec

### Step 1: Design Team Creates Batch

```
Dashboard Assets.zip
├── ink-burst.png (1024×1024, kr-motif)
├── leaf-canopy.png (1024×1024, kr-motif)
├── lab-grid.png (512×512, texture overlay)
├── night-garden.png (2048×2048, hero background)
├── [DEPRECATED_STYLE]-frame.png (1024×1024, accent motif)
└── README.txt
    Assets for DashboardOverview HiFi spec
    - All use asphalt-black background
    - Max 6 labels per asset
    - Organized by [DEPRECATED_STYLE] principle
```

### Step 2: Developer Processes Batch

```bash
./scripts/process-asset-batch.sh "Dashboard Assets.zip" kr-motifs
```

**Output**:
```
✅ Batch Processing Complete
  Total: 5
  Successful: 4
  Failed: 1

batch-results-20260211-043000.json shows:
  - ink-burst: 91/100 ✅ PACKAGE
  - leaf-canopy: 88/100 ⚠️ REGENERATE
  - lab-grid: 94/100 ✅ PACKAGE
  - night-garden: 92/100 ✅ PACKAGE
  - [DEPRECATED_STYLE]-frame: 90/100 ✅ PACKAGE
```

### Step 3: Address Failures

```bash
# Review failed asset
cat /assets/batch-results-*.json | jq '.[] | select(.status=="failed")'

# Get correction prompt for leaf-canopy
cat /assets/ASSET-20260211-002-leaf-canopy/README.md

# Provide feedback to design team:
# "leaf-canopy scored 88 (target 90+).
#  Corrections needed:
#  - Reduce labels to 6 max (currently 7)
#  - Ensure upper-left density ≤20%
#  - Add 60-80% translucency overlay"
```

### Step 4: Integration

```bash
# Production files ready:
ls /frontend/public/assets/kr-motifs/
# kerala-rage-ink-burst-kr-dark-1024.png
# kerala-rage-leaf-canopy-kr-dark-1024.png (if regenerated)
# kerala-rage-lab-grid-kr-dark-512.png
# kerala-rage-night-garden-kr-dark-2048.png
# kerala-rage-[DEPRECATED_STYLE]-frame-kr-dark-1024.png

# Metadata ready:
ls /assets/ASSET-*/context.md
# Each includes narrative, kr-motifs, mode context, purpose
```

### Step 5: Component Integration

```tsx
// Use production file in component
export const DashboardHero = () => {
  return (
    <div
      style={{
        backgroundImage: 'url(/assets/kr-motifs/kerala-rage-ink-burst-kr-dark-1024.png)',
        backgroundSize: 'cover',
        opacity: 0.65  // Solidarity mode
      }}
    >
      {/* Content */}
    </div>
  );
};
```

---

## Next: Automation

Once batch processing is smooth, automate with:

1. **GitHub Actions**: Trigger on ZIP upload to releases
2. **Scheduled jobs**: Nightly batch processing
3. **Design tool webhook**: Auto-export from Figma → process batch
4. **API endpoint**: POST ZIP → returns batch-results.json

---

## Reference

- **Main script**: `scripts/orchestrate-asset-workflow.py` (single asset)
- **Batch script**: `scripts/process-asset-batch.sh` (multiple assets)
- **Integration Review**: `scripts/asset-workflow-integration-review.md`
- **Workflow Guide**: `docs/design/assets/WORKFLOW-QUICK-START.md`
- **Feedback Loop**: `docs/design/assets/FEEDBACK-LOOP-TO-90.md`

---

_Batch Processing Guide | Feb 11, 2026 | Production Ready_
