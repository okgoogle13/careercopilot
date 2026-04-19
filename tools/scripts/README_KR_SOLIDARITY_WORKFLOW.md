# kr-solidarity v3.0.0 Asset Workflow

Complete political/cultural asset analysis pipeline for the **kr-solidarity design system**.

## Quick Start

### Setup (One Time)
```bash
# Install dependencies
pip install google-generativeai Pillow

# Set Gemini API key
export GEMINI_API_KEY="your-gemini-api-key-here"
```

### Process Single Image
```bash
python orchestrate_kr_solidarity_workflow.py /path/to/image.png
```

**Output:**
- `./asset-packages/KR-SOLID-XXX/metadata.json` – Complete metadata
- `./asset-packages/KR-SOLID-XXX/manifest-entry.json` – Ready for manifest
- `./asset-packages/KR-SOLID-XXX/context.md` – Documentation
- `./asset-packages/KR-SOLID-XXX/usage.md` – Integration guide
- `./workflow-report.json` – Processing summary

### Batch Process Directory
```bash
# Process all images in a directory
python orchestrate_kr_solidarity_workflow.py ./assets/

# Process a ZIP file
python orchestrate_kr_solidarity_workflow.py ./assets.zip
```

---

## Architecture: 4-Phase Pipeline

### Phase 1: Analysis & Validation

#### 1a. Analyze Political Asset
```python
from analyze_political_asset import analyze_political_asset

analysis = analyze_political_asset("/path/to/image.png")
# Returns: PoliticalAssetAnalysis
# - category: devotional, portrait, symbol, street, abstract, texture
# - political_significance: cultural-anchor, resistance-history, activist, devotional, solidarity
# - text_content: Text visible in image
# - detected_symbols: Cultural/political symbols found
# - style: screenprint, wheat-paste, etching, painting, photograph, mixed
# - color_palette: Dict with hex codes
# - intended_context: How asset will be used
# - historical_reference: Historical figure/movement if applicable
# - confidence: 0.0-1.0 analysis confidence
```

**Script:** `analyze_political_asset.py`
- Uses Gemini 2.0 Flash Vision API
- Extracts political/cultural metadata
- Graceful fallback with safe defaults on error
- CLI: `python analyze_political_asset.py <image_path>`

#### 1b. Validate Governance
```python
from validate_kr_solidarity_governance import validate_governance

validation = validate_governance(analysis)
# Returns: GovernanceValidation
# - passed: bool
# - violations: List[str]  (hard stops)
# - warnings: List[str]    (flags for review)
# - approval_level: auto-approved, human-review, rejected
# - score: 0-100
```

**Governance Rules:**

| Rule | Violations | Warnings |
|------|-----------|----------|
| **Forbidden Imagery** | ❌ Contains: crown, monarchy, passport, visa, ID card, border, police badge, corporate logo, trademark, state seal, military insignia, weapons | — |
| **First Nations** | — | Aboriginal imagery without approved text (ALWAYS WAS ALWAYS WILL BE, TREATY NOW, SOVEREIGNTY, LAND BACK) |
| **Devotional** | — | Reverence check: style should be screenprint/painting/etching/photograph |
| **Resistance** | — | Historical accuracy: requires historical_reference |
| **Street Art** | — | Should include text/slogan; should specify in-situ context |

**Scoring:**
- Violations = Hard stop (score 0, approval = rejected)
- Each warning = -5 to -10 points

**Script:** `validate_kr_solidarity_governance.py`
- CLI: `python validate_kr_solidarity_governance.py <image_path>`

---

### Phase 2: Scoring

```python
from score_cultural_significance import score_asset

score = score_asset(analysis, validation)
# Returns: CulturalSignificanceScore
# - overall_score: 0-100 weighted (final number)
# - political_representation: 25% weight
# - governance_compliance: 30% weight
# - cultural_appropriateness: 25% weight
# - aesthetic_quality: 20% weight
# - approval_status: approved, conditional-approval, needs-review, rejected
# - recommendations: List[str] for improvement
```

**Scoring Dimensions:**

#### Political Representation (25%)
- Base: Political significance category (resistance-history: 100 → cultural-anchor: 95 → activist: 90 → devotional: 85 → solidarity: 80)
- Boost: +10 for historical reference
- Boost: +5 per detected symbol (max 15)
- Penalty: -5 for weak/missing context

**Example:**
- Tipu Sultan portrait (resistance-history) = 100 base
- + 10 (historical reference) + 10 (symbols: tiger, turban) = 120 → capped at 100

#### Governance Compliance (30%)
- Base: Governance validation score
- Violations: -50 (hard stops)
- Warnings: -5 each
- Bonus: +10 for auto-approved status

#### Cultural Appropriateness (25%)
- Base: 85
- Boost: +5-10 for text content
- Category checks: +5-10 for devotional reverence, street art context, etc.
- Palette check: +5 for ≥3 colors

#### Aesthetic Quality (20%)
- Style prestige: screenprint (95) → wheat-paste (90) → etching (85) → photography (75)
- Confidence boost: +5-10 for ≥0.85 analysis confidence
- Completeness: +8 for complete metadata (≥4/5 fields)

**Approval Status Logic:**
- ≥90: `approved` → Production ready
- 75-89: `conditional-approval` → Monitor cultural feedback
- 60-74: `needs-review` → Schedule human review
- <60: `rejected` → Recommend revisions

**Script:** `score_cultural_significance.py`
- CLI: `python score_cultural_significance.py <image_path>`

---

### Phase 3: Packaging

```python
from package_kr_solidarity_asset import package_asset, export_package

package = package_asset(analysis, validation, score, image_path)
# Returns: AssetPackage with:
# - asset_id: KR-SOLID-XXX (auto-generated)
# - manifest_entry: Dict ready for manifest.json
# - metadata: Complete metadata object
# - context_md: Political/cultural documentation
# - usage_md: Integration guide

# Export to files
files = export_package(package, output_dir="./asset-packages")
# Creates: metadata.json, manifest-entry.json, context.md, usage.md
```

**Generated Files:**

1. **manifest-entry.json** – Add directly to `frontend/public/assets/kr-solidarity-manifest.json`:
```json
{
  "id": "KR-SOLID-013",
  "name": "Asset Name",
  "category": "street",
  "file_path": "/assets/kr-solidarity/street/...",
  "priority": "CRITICAL|HIGH|MEDIUM",
  "status": "ready|needs-review",
  "intended_context": "...",
  "specs": {
    "aspect_ratio": "1:1",
    "style": "screenprint",
    "text_content": "...",
    "symbols": ["..."],
    "color_palette": {"primary": "#HEX", ...}
  }
}
```

2. **context.md** – Political/cultural significance documentation with scoring table

3. **usage.md** – Step-by-step integration guide including:
   - File placement instructions
   - Manifest integration
   - React component example
   - CSS token setup

4. **metadata.json** – Complete metadata object:
```json
{
  "asset_id": "KR-SOLID-013",
  "analysis": {...},
  "governance": {...},
  "scoring": {...},
  "recommendations": [...]
}
```

**Script:** `package_kr_solidarity_asset.py`
- CLI: `python package_kr_solidarity_asset.py <image_path> [asset_name]`

---

### Phase 4: Orchestration

```bash
# Single file
python orchestrate_kr_solidarity_workflow.py /path/to/image.png

# Directory (recursive)
python orchestrate_kr_solidarity_workflow.py /path/to/assets/

# ZIP archive
python orchestrate_kr_solidarity_workflow.py /path/to/assets.zip
```

**Output:**
- `./asset-packages/` – All generated packages
- `./workflow-report.json` – Batch processing summary

**Report Example:**
```json
{
  "workflow_id": "workflow-20260211-120000",
  "total_assets": 12,
  "successful": 11,
  "failed": 1,
  "success_rate": "91.7%",
  "average_score": "82.3/100",
  "approval_distribution": {
    "approved": 9,
    "conditional-approval": 2,
    "needs-review": 0,
    "rejected": 0
  },
  "total_time_seconds": 45.2,
  "average_time_per_asset": 3.8
}
```

**Features:**
- ✅ Parallel processing (4 concurrent workers)
- ✅ Supports single files, directories, ZIP archives
- ✅ Progress tracking with live updates
- ✅ Per-asset error handling with stage tracking
- ✅ Comprehensive reporting with statistics

---

## File Structure

```
scripts/
├── analyze_political_asset.py              # Phase 1a: Analysis
├── validate_kr_solidarity_governance.py    # Phase 1b: Validation
├── score_cultural_significance.py          # Phase 2: Scoring
├── package_kr_solidarity_asset.py          # Phase 3: Packaging
├── orchestrate_kr_solidarity_workflow.py   # Phase 4: Orchestration
└── README_KR_SOLIDARITY_WORKFLOW.md        # This file
```

---

## Usage Examples

### Example 1: Single File Analysis
```bash
python orchestrate_kr_solidarity_workflow.py ./shiva-statue.png
```

**Output:**
```
📸 Processing: shiva-statue.png
🔍 Analyzing political asset: shiva-statue.png
✅ Analysis complete
   Category: devotional
   Significance: devotional
   Text: 'OM'

🔐 Validating governance for: devotional / devotional
✅ Passed governance check (approval: auto-approved, score: 100.0/100)

🎯 Scoring cultural significance for: devotional / devotional
✅ OVERALL SCORE: 89.3/100 [CONDITIONAL-APPROVAL]

📦 Packaging kr-solidarity asset...
📝 Generated manifest entry, metadata, and documentation

✅ SUCCESS: KR-SOLID-013
   Score: 89.3/100
   Status: conditional-approval
   Time: 2.3s

📁 Files exported to: ./asset-packages/KR-SOLID-013/
   - metadata.json
   - manifest-entry.json
   - context.md
   - usage.md
```

### Example 2: Batch Process Directory
```bash
python orchestrate_kr_solidarity_workflow.py ./political-assets/
```

**Output:**
```
🚀 WORKFLOW ORCHESTRATOR
Found 12 images to process
Processing with 4 workers

[1/12] ✅ tipu-sultan.png (2.1s)
[2/12] ✅ bhagat-singh.png (2.3s)
[3/12] ✅ kerala-elephant.png (1.9s)
... [12/12] ✅ street-poster.png (2.0s)

==============================================================================
WORKFLOW REPORT: workflow-20260211-120000
==============================================================================

📊 SUMMARY
  Total Assets: 12
  ✅ Successful: 11
  ❌ Failed: 1
  Success Rate: 91.7%
  Total Time: 24.5s
  Avg Time/Asset: 2.0s
  Average Score: 82.3/100

📈 APPROVAL DISTRIBUTION
  approved: 9
  conditional-approval: 2
  needs-review: 0

📋 Report saved: ./workflow-report.json
```

### Example 3: Check Report
```bash
cat workflow-report.json | jq '.summary_stats'
```

```json
{
  "total_assets": 12,
  "successful": 11,
  "failed": 1,
  "success_rate": "91.7%",
  "total_time_seconds": 24.5,
  "average_time_per_asset": 2.0,
  "average_score": "82.3",
  "approval_distribution": {
    "approved": 9,
    "conditional-approval": 2
  }
}
```

---

## Integration: Adding to Manifest

After successful batch processing:

1. **Copy manifest entries** from individual `manifest-entry.json` files
2. **Combine into manifest.json**:

```bash
# Extract all manifest entries
jq '.manifest_entry' asset-packages/*/metadata.json > new-assets.jsonl

# Manually add to frontend/public/assets/kr-solidarity-manifest.json
# Update asset count and asset_summary
```

3. **Update manifest metadata:**
```json
{
  "version": "3.0.1",
  "last_updated": "2026-02-11",
  "assets": [
    // ... existing assets ...
    // + new KR-SOLID-013, KR-SOLID-014, etc.
  ],
  "asset_summary": {
    "total_assets": 24,  // Updated
    "by_category": {...},
    "by_priority": {...}
  }
}
```

---

## Error Handling

### Common Issues

**Issue: `GEMINI_API_KEY not set`**
```bash
export GEMINI_API_KEY="your-key-here"
```

**Issue: `google-generativeai not installed`**
```bash
pip install google-generativeai Pillow
```

**Issue: Image does not meet minimum resolution**
- ⚠️ Warning in export, but asset still processes
- Recommendation: Upscale to ≥2048px before deployment

**Issue: Governance violation (forbidden keyword)**
- ❌ Hard stop - asset rejected
- Status: `rejected`
- Score: 0/100
- Fix: Remove forbidden imagery or context

---

## Design System Integration

### Governance Rules Context

**kr-solidarity v3.0.0** system enforces political/cultural compliance:

- ✅ **Approved**: Anti-colonial resistance figures, spiritual/devotional, First Nations solidarity, Melbourne activism
- ❌ **Forbidden**: Monarchy symbols, bureaucratic authority (passports, IDs), corporate aesthetics, state authority icons

**First Nations Policy:**
- Aboriginal imagery **only** with approved text:
  - "ALWAYS WAS ALWAYS WILL BE"
  - "TREATY NOW"
  - "SOVEREIGNTY"
  - "LAND BACK"

**Approval Levels:**

| Level | Criteria | Next Step |
|-------|----------|-----------|
| **auto-approved** | No violations, high governance score, reverent style | ✅ Ready for production |
| **conditional-approval** | Warnings present, but passed validation | ⚠️ Monitor feedback |
| **needs-review** | Multiple warnings, edge cases | 🔍 Schedule human review |
| **rejected** | Governance violations | ❌ Revise or discard |

---

## Performance & Scaling

### Batch Processing Performance
- **Single image**: ~2-3 seconds (1 × Gemini API call + phases)
- **Batch (12 images)**: ~25-30 seconds (4 parallel workers)
- **Scaling**: Add workers via `orchestrate_kr_solidarity_workflow.py`:
  ```python
  report = process_batch(source_path, max_workers=8)
  ```

### API Quota
- Gemini 2.0 Flash: Free tier ~500 calls/day
- Batch processing 12 images ≈ 12 API calls
- Production: Use project API quotas

---

## Next Steps

### Phase 5: Human Review Interface (Future)
- Web-based approval dashboard
- Bulk accept/reject functionality
- Override governance flags

### Phase 6: Backfill Existing Assets (Future)
- Generate metadata for current 12 kr-solidarity assets
- Validate component integration
- Update design tokens

---

## References

- **Design System:** `design-system/tokens.json`
- **Current Manifest:** `frontend/public/assets/kr-solidarity-manifest.json`
- **Governance Rules:** See `FORBIDDEN_KEYWORDS` in `validate_kr_solidarity_governance.py`
- **Component Usage:** See `usage.md` in generated asset packages

---

## Support

- **Questions about political significance?** See `context.md` in asset package
- **Integration issues?** See `usage.md` in asset package
- **API errors?** Check `GEMINI_API_KEY` and API quota
- **Batch report?** Check `workflow-report.json` for detailed statistics
