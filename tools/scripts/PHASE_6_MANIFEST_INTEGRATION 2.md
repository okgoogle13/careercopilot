# Phase 6: Manifest Integration

kr-solidarity v3.0.0 Asset Integration, Manifest Updates, and Production Deployment.

**Status:** ✅ Complete
**Date:** 2026-02-11

---

## Overview

Phase 6 integrates assets from Phases 3-4 into the production manifest and prepares for deployment.

✅ **Add new assets** - Integrate Phase 3-4 asset packages
✅ **Backfill existing assets** - Add metadata to 12 existing kr-solidarity assets
✅ **Validate manifest** - Integrity checks before production
✅ **Generate deployment plan** - Go-live checklist and procedures
✅ **Integration testing** - Verify component compatibility
✅ **Rollback procedures** - Safety measures for rollback

---

## Architecture

### Backend (Python/FastAPI)

**File:** `backend/app/api/endpoints/manifest_integration.py` (450 lines)

**API Endpoints:**

```
POST   /api/manifest-integration/add-assets              - Add to manifest
GET    /api/manifest-integration/validate                - Validate integrity
POST   /api/manifest-integration/recalculate-summary     - Recalculate stats
POST   /api/manifest-integration/backfill                - Backfill asset
POST   /api/manifest-integration/integration-test/{id}   - Run test
POST   /api/manifest-integration/deployment-plan         - Generate plan
GET    /api/manifest-integration/export                  - Export manifest
POST   /api/manifest-integration/import                  - Import manifest
```

**Pydantic Models:** `backend/app/schemas/manifest_integration.py` (165 lines)

```python
class ManifestAssetEntry(BaseModel):
    id: str                          # KR-SOLID-XXX
    name: str
    category: str
    file_path: str
    priority: str                    # CRITICAL, HIGH, MEDIUM
    status: str                      # ready, needs-review, approved
    intended_context: str
    specs: AssetSpecification
    review_decision: Optional[str]   # From Phase 5
    review_feedback: Optional[str]

class ManifestUpdateRequest(BaseModel):
    assets_to_add: List[ManifestAssetEntry]
    assets_to_update: Optional[List[ManifestAssetEntry]]
    updated_by: str
    version_bump: str                # major, minor, patch

class ManifestValidationResult(BaseModel):
    valid: bool
    total_assets: int
    by_category: Dict[str, int]
    by_priority: Dict[str, int]
    errors: List[str]
    warnings: List[str]
    checks_passed: Dict[str, bool]

class ManifestDeploymentPlan(BaseModel):
    manifest_version: str
    total_new_assets: int
    deployment_timestamp: datetime
    tests_required: List[str]
    rollback_plan: str
    go_live_checklist: List[str]
    estimated_deployment_time_minutes: float
```

### CLI Script (Python)

**File:** `scripts/integrate_manifest.py` (420 lines)

**Commands:**

```bash
# Integrate asset packages
python integrate_manifest.py /path/to/asset-packages/

# Backfill existing 12 assets
python integrate_manifest.py --backfill

# Validate manifest
python integrate_manifest.py --validate

# Generate deployment plan
python integrate_manifest.py --deployment-plan
```

---

## Workflow

### 1. Process Asset Packages

**Input:** Phase 3-4 output
```
./asset-packages/KR-SOLID-013/
├── metadata.json
├── manifest-entry.json
├── context.md
└── usage.md
```

**Command:**
```bash
python integrate_manifest.py ./asset-packages/
```

**Process:**
1. Find all asset packages in directory
2. Load metadata.json from each
3. Extract manifest entry data
4. Check for duplicates
5. Add to manifest.json
6. Recalculate summary statistics
7. Save manifest

**Output:**
```
✅ Added: KR-SOLID-013 (Street Protest Art)
✅ Added: KR-SOLID-014 (First Nations Solidarity)
✅ Added: KR-SOLID-015 (Resistance Portrait)
✅ Integration complete: 3 assets added
   Total assets: 15
   By category: {'street': 2, 'portrait': 1, ...}
   By priority: {'CRITICAL': 1, 'HIGH': 1, 'MEDIUM': 1}
```

### 2. Backfill Existing Assets

**Input:** Existing 12 kr-solidarity assets

**Existing Assets:**
```
KR-SOLID-001: Shiva Statue (devotional, CRITICAL)
KR-SOLID-002: Tipu Sultan Portrait (portrait, HIGH)
KR-SOLID-003: Bhagat Singh Portrait (portrait, HIGH)
KR-SOLID-004: Kerala Elephant Symbol (symbol, CRITICAL)
KR-SOLID-005: Kerala Landscape (symbol, HIGH)
KR-SOLID-006: [DEPRECATED_STYLE] Paint Splash (abstract, MEDIUM)
KR-SOLID-007: Anti-Colonial Graffiti (street, CRITICAL)
KR-SOLID-008: Melbourne Laneway Texture (texture, CRITICAL)
KR-SOLID-009: First Nations Placard (street, CRITICAL)
KR-SOLID-010: Mythic Mural (abstract, MEDIUM)
KR-SOLID-011: Typography Pressure (abstract, MEDIUM)
KR-SOLID-012: Street Poster (portrait, HIGH)
```

**Command:**
```bash
python integrate_manifest.py --backfill
```

**Process:**
1. Load existing asset definitions
2. Find each in current manifest
3. Update with backfill metadata
4. Add backfilled_at timestamp
5. Save manifest

**Output:**
```
✅ Backfilled: KR-SOLID-001 (Shiva Statue)
✅ Backfilled: KR-SOLID-002 (Tipu Sultan Portrait)
... (12 assets total)
✅ Backfill complete: 12 assets updated
```

### 3. Validate Manifest

**Command:**
```bash
python integrate_manifest.py --validate
```

**Validation Checks:**
1. ✅ Asset count > 0
2. ✅ All IDs unique (no duplicates)
3. ✅ All required fields present
4. ✅ Valid categories (devotional, portrait, symbol, street, abstract, texture)
5. ✅ Valid priorities (CRITICAL, HIGH, MEDIUM)
6. ✅ Summary statistics accurate

**Output:**
```
✅ Validating manifest...
  • Total assets: 24
  • Unique IDs: ✅
  • Required fields: 24/24 complete
  • Valid categories: ✅
  • Valid priorities: ✅
  • Summary accuracy: ✅

✅ MANIFEST VALID
```

### 4. Generate Deployment Plan

**Command:**
```bash
python integrate_manifest.py --deployment-plan
```

**Output:**
```
📋 Generating deployment plan...

  📊 DEPLOYMENT SUMMARY
     Version: 3.0.1
     Total assets: 24
     Summary: {'total_assets': 24, 'by_category': {...}, 'by_priority': {...}}

  🧪 REQUIRED TESTS
     1. Manifest validation (no errors)
     2. Asset file integrity (all paths exist)
     3. Component integration tests (all assets)
     4. Visual regression tests (desktop + mobile)
     5. Performance tests (load time < 2s)
     6. Accessibility audit (WCAG AA)
     7. Cross-browser compatibility

  🔄 ROLLBACK PROCEDURE
     1. Keep backup of previous manifest.json
     2. If issues: revert manifest.json to backup
     3. Clear frontend cache (CDN purge)
     4. Monitor error rates for 1 hour
     5. Post-mortem if needed

  ✅ GO-LIVE CHECKLIST
     [ ] All tests passing
     [ ] Validation report generated
     [ ] Backup of current manifest saved
     [ ] CDN cache invalidation ready
     [ ] Team notified of window
     [ ] Monitoring dashboards active
     [ ] Rollback procedure documented
     [ ] Post-deployment checks planned

  ⏱️  ESTIMATED TIME: 5 minutes
```

---

## Manifest Structure

### File: `frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`

**Version 3.0.1 Example:**

```json
{
  "project": "kerala-rage kr-solidarity",
  "version": "3.0.1",
  "last_updated": "2026-02-11T12:34:56Z",
  "strategy": "Final Canon Alignment (Path B)",
  "assets": [
    {
      "id": "KR-SOLID-001",
      "name": "Shiva Statue",
      "category": "devotional",
      "file_path": "/assets/kr-solidarity/devotional/kr-solidarity__devotional__shiva-statue__v1.png",
      "priority": "CRITICAL",
      "status": "ready",
      "intended_context": "Deep-time grounding, spiritual anchor for core views",
      "specs": {
        "aspect_ratio": "1:1",
        "style": "screenprint",
        "halo": "muted gold"
      },
      "reviewed_by": "alice@example.com",
      "review_decision": "approved",
      "review_feedback": "Excellent cultural representation...",
      "created_at": "2026-02-11T10:00:00Z"
    },
    {
      "id": "KR-SOLID-013",
      "name": "Street Protest Art",
      "category": "street",
      "file_path": "/assets/kr-solidarity/street/kr-solidarity__street__protest-art__v1.png",
      "priority": "CRITICAL",
      "status": "ready",
      "intended_context": "Melbourne laneway protest context, core activism",
      "specs": {
        "aspect_ratio": "1:1",
        "style": "screenprint",
        "text_content": "NO PRIDE IN GENOCIDE",
        "symbols": ["resistance", "solidarity"],
        "color_palette": {"primary": "#D4A84B", "secondary": "#C45C4B"}
      },
      "reviewed_by": "bob@example.com",
      "review_decision": "conditional-approval",
      "review_feedback": "Strong political message, monitor cultural feedback",
      "created_at": "2026-02-11T11:30:00Z"
    }
  ],
  "asset_summary": {
    "total_assets": 24,
    "by_category": {
      "devotional": 1,
      "portrait": 4,
      "symbol": 2,
      "abstract": 5,
      "street": 4,
      "texture": 1,
      "other": 7
    },
    "by_priority": {
      "CRITICAL": 8,
      "HIGH": 8,
      "MEDIUM": 8
    },
    "by_status": {
      "ready": 22,
      "needs-review": 2,
      "approved": 22,
      "conditional": 2,
      "rejected": 0
    }
  },
  "governance": {
    "naming_convention": "kr-solidarity__[category]__[asset-name]__[variant].png",
    "resolution_min": "2048px on shortest edge",
    "forbidden_imagery": [
      "monarchy symbols",
      "bureaucracy (passports, visas, IDs)",
      "corporate stock aesthetics",
      "state authority icons",
      "Aboriginal art styles (excl. placards in situ)"
    ]
  }
}
```

---

## API Usage Examples

### Example 1: Add Assets to Manifest

```bash
curl -X POST http://localhost:8000/api/manifest-integration/add-assets \
  -H "Content-Type: application/json" \
  -d '{
    "assets_to_add": [
      {
        "id": "KR-SOLID-013",
        "name": "Street Protest Art",
        "category": "street",
        "file_path": "/assets/kr-solidarity/street/...",
        "priority": "CRITICAL",
        "status": "ready",
        "intended_context": "Melbourne laneway protest",
        "specs": {
          "aspect_ratio": "1:1",
          "style": "screenprint",
          "text_content": "NO PRIDE IN GENOCIDE"
        }
      }
    ],
    "updated_by": "alice@example.com",
    "version_bump": "minor"
  }'
```

**Response:**
```json
{
  "success": true,
  "assets_added": 1,
  "new_version": "3.0.1",
  "total_assets": 13,
  "summary": {
    "by_category": {"street": 2, "portrait": 3, ...},
    "by_priority": {"CRITICAL": 5, "HIGH": 4, "MEDIUM": 3}
  }
}
```

### Example 2: Validate Manifest

```bash
curl http://localhost:8000/api/manifest-integration/validate
```

**Response:**
```json
{
  "valid": true,
  "total_assets": 24,
  "by_category": {
    "devotional": 1,
    "portrait": 4,
    "symbol": 2,
    "street": 4,
    "abstract": 5,
    "texture": 1
  },
  "by_priority": {
    "CRITICAL": 8,
    "HIGH": 8,
    "MEDIUM": 8
  },
  "errors": [],
  "warnings": [],
  "checks_passed": {
    "asset_count": true,
    "unique_ids": true,
    "required_fields": true,
    "valid_categories": true,
    "valid_priorities": true,
    "summary_accuracy": true
  }
}
```

### Example 3: Backfill Asset

```bash
curl -X POST http://localhost:8000/api/manifest-integration/backfill \
  -H "Content-Type: application/json" \
  -d '{
    "asset_id": "KR-SOLID-001",
    "category": "devotional",
    "political_significance": "devotional",
    "style": "screenprint",
    "intended_context": "Deep-time grounding",
    "priority": "CRITICAL",
    "backfilled_by": "system"
  }'
```

**Response:**
```json
{
  "success": true,
  "asset_id": "KR-SOLID-001",
  "message": "Metadata backfilled for KR-SOLID-001",
  "metadata_created": true,
  "manifest_updated": true,
  "validation_status": "pending"
}
```

### Example 4: Integration Test

```bash
curl -X POST http://localhost:8000/api/manifest-integration/integration-test/KR-SOLID-013
```

**Response:**
```json
{
  "asset_id": "KR-SOLID-013",
  "test_name": "component_integration",
  "passed": true,
  "error_message": null,
  "execution_time_ms": 145.3
}
```

### Example 5: Generate Deployment Plan

```bash
curl -X POST http://localhost:8000/api/manifest-integration/deployment-plan \
  -H "Content-Type: application/json" \
  -d '{
    "assets_to_add": [...],
    "updated_by": "alice@example.com"
  }'
```

**Response:**
```json
{
  "manifest_version": "3.0.1",
  "total_new_assets": 3,
  "total_updated_assets": 0,
  "deployment_timestamp": "2026-02-11T12:34:56Z",
  "tests_required": [
    "Manifest validation (no errors)",
    "Asset file integrity (all paths exist)",
    "Component integration tests (all assets)",
    "Visual regression tests (desktop + mobile)",
    "Performance tests (load time < 2s)",
    "Accessibility audit (WCAG AA)",
    "Cross-browser compatibility"
  ],
  "rollback_plan": "1. Keep backup...",
  "go_live_checklist": [
    "[ ] All tests passing",
    "[ ] Validation report generated",
    ...
  ],
  "estimated_deployment_time_minutes": 5.0
}
```

---

## Pre-Deployment Checklist

### Phase 6: Manifest Integration

- [ ] All Phase 3-4 asset packages processed
- [ ] Existing 12 assets backfilled with metadata
- [ ] Manifest validation passing (no errors)
- [ ] Review decisions from Phase 5 integrated
- [ ] Version bumped appropriately
- [ ] Summary statistics recalculated

### Quality Assurance

- [ ] Manifest syntax valid (JSON)
- [ ] All asset paths correct
- [ ] No duplicate asset IDs
- [ ] All required fields present
- [ ] Categories and priorities valid

### Component Integration

- [ ] Assets render in components
- [ ] No console errors
- [ ] Images load correctly
- [ ] Responsive on mobile/desktop
- [ ] Accessibility tests pass (WCAG AA)

### Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Performance tests pass (<2s load)
- [ ] Visual regression tests pass

### Deployment Readiness

- [ ] Backup of previous manifest created
- [ ] Rollback procedure documented
- [ ] Team notified of deployment window
- [ ] Monitoring dashboards prepared
- [ ] Post-deployment checks planned

---

## Deployment Procedure

### Pre-Deployment (30 min before)

1. **Create backup**
   ```bash
   cp frontend/public/assets/kerala-rage-kr-solidarity-manifest.json \
      frontend/public/assets/kerala-rage-kr-solidarity-manifest.backup.json
   ```

2. **Validate new manifest**
   ```bash
   python integrate_manifest.py --validate
   ```

3. **Run integration tests**
   ```bash
   # Component integration tests
   cd frontend && yarn test:integration
   ```

4. **Check monitoring**
   - Open error tracking (Sentry, etc.)
   - Prepare dashboards
   - Alert team

### Deployment (5 minutes)

1. **Update manifest**
   ```bash
   # Already done by integrate_manifest.py
   ```

2. **Deploy frontend**
   ```bash
   ./scripts/deploy.sh staging  # Test first
   ./scripts/deploy.sh production
   ```

3. **Purge CDN cache**
   ```bash
   gcloud cdn-cache purge --path "/assets/*"
   ```

4. **Monitor errors**
   - Watch error tracking
   - Check user feedback
   - Monitor performance

### Post-Deployment (1 hour)

1. **Sanity checks**
   - Assets load in all browsers
   - No console errors
   - Performance metrics normal
   - User feedback positive

2. **Document issues**
   - Record any problems
   - Log response times
   - Note user feedback

3. **Celebrate! 🎉**
   - Assets deployed successfully
   - Ready for production use

### Rollback (if needed)

1. **Revert manifest**
   ```bash
   cp frontend/public/assets/kerala-rage-kr-solidarity-manifest.backup.json \
      frontend/public/assets/kerala-rage-kr-solidarity-manifest.json
   ```

2. **Redeploy frontend**
   ```bash
   ./scripts/deploy.sh production
   ```

3. **Purge cache**
   ```bash
   gcloud cdn-cache purge --path "/assets/*"
   ```

4. **Investigate**
   - Root cause analysis
   - Fix issues
   - Plan retry

---

## Version Bumping

**Semantic Versioning:**

- **MAJOR** (3.0.0 → 4.0.0): Breaking changes, design system overhaul
- **MINOR** (3.0.0 → 3.1.0): New assets, new categories, backward compatible
- **PATCH** (3.0.0 → 3.0.1): Bug fixes, metadata updates, no new assets

**Example:**
```bash
# Add 3 new assets (backward compatible)
python integrate_manifest.py ./asset-packages/
# Version: 3.0.0 → 3.0.1 (patch)

# Add new category (minor feature)
# Version: 3.0.1 → 3.1.0 (minor)

# Complete redesign
# Version: 3.1.0 → 4.0.0 (major)
```

---

## Integration with Other Phases

### Phase 5 → Phase 6
```
Review decisions (Phase 5)
    ↓
Add to asset metadata
    ↓
Include in manifest entry
    ↓
Track reviewer info + feedback
```

### Phase 6 → Phase 7+
```
Manifest ready for deployment
    ↓
Frontend components use assets
    ↓
Monitor performance + feedback
    ↓
Iterate and refine
```

---

## Troubleshooting

### Issue: Manifest won't save

**Cause:** Permission denied or invalid JSON
**Fix:**
```bash
# Check permissions
ls -la frontend/public/assets/
chmod 755 frontend/public/assets/

# Validate JSON syntax
python -m json.tool frontend/public/assets/kerala-rage-kr-solidarity-manifest.json
```

### Issue: Assets not loading

**Cause:** Incorrect file paths
**Fix:**
```bash
# Verify asset files exist
ls -la frontend/public/assets/kr-solidarity/*/

# Check manifest paths
grep file_path frontend/public/assets/kerala-rage-kr-solidarity-manifest.json
```

### Issue: Validation fails

**Cause:** Missing required fields, duplicate IDs, invalid categories
**Fix:**
```bash
# Run validation
python integrate_manifest.py --validate

# Check error messages for specific issues
```

### Issue: Duplicate assets in manifest

**Cause:** Multiple integrations of same package
**Fix:**
```bash
# Find duplicates
jq '.assets | map(.id) | group_by(.) | map(select(length > 1))' \
   frontend/public/assets/kerala-rage-kr-solidarity-manifest.json

# Remove manually or reset manifest
```

---

## Files Created

```
backend/app/api/endpoints/
└── manifest_integration.py              (450 lines)

backend/app/schemas/
└── manifest_integration.py              (165 lines)

scripts/
└── integrate_manifest.py                (420 lines)
```

**Total: Phase 6 = 1,035 lines**

---

## Summary

✅ **Complete manifest integration system** for kr-solidarity assets

**Features:**
- Add Phase 3-4 assets to manifest
- Backfill existing 12 assets
- Validate manifest integrity
- Generate deployment plans
- Integration testing
- Rollback procedures

**Ready to:** Deploy assets to production and monitor performance

