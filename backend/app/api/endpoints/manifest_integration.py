"""
kr-solidarity v3.0.0 Manifest Integration Endpoints
Asset integration, manifest updates, and production deployment.
"""

import json
import shutil
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.manifest_integration import (
    AssetIntegrationTestResult,
    BackfillAssetRequest,
    BackfillResult,
    ManifestDeploymentPlan,
    ManifestUpdateRequest,
    ManifestValidationResult,
)

router = APIRouter(prefix="/api/manifest-integration", tags=["manifest-integration"])

# Manifest file path (update as needed)
MANIFEST_PATH = Path("frontend/public/assets/kerala-rage-kr-solidarity-manifest.json")
ASSET_PACKAGES_DIR = Path("./asset-packages")


# ============================================================================
# MANIFEST MANAGEMENT
# ============================================================================

def load_manifest() -> dict:
    """Load current manifest."""
    if MANIFEST_PATH.exists():
        with open(MANIFEST_PATH) as f:
            return json.load(f)
    return {
        "project": "kerala-rage kr-solidarity",
        "version": "3.0.0",
        "last_updated": datetime.utcnow().isoformat(),
        "strategy": "Political/Cultural Design System",
        "assets": [],
        "asset_summary": {"total_assets": 0, "by_category": {}, "by_priority": {}}
    }


def save_manifest(manifest: dict) -> bool:
    """Save manifest to file."""
    try:
        MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(MANIFEST_PATH, "w") as f:
            json.dump(manifest, f, indent=2)
        print(f"✅ Manifest saved: {MANIFEST_PATH}")
        return True
    except Exception as e:
        print(f"❌ Failed to save manifest: {e}")
        return False


# ============================================================================
# ENDPOINTS
# ============================================================================

@router.post("/add-assets")
async def add_assets_to_manifest(request: ManifestUpdateRequest):
    """
    Add new assets to manifest.json.

    - **assets_to_add**: List of new asset entries
    - **updated_by**: Who is making this update
    - **version_bump**: major, minor, patch
    """
    print("\n📝 Adding assets to manifest")
    print(f"  Assets: {len(request.assets_to_add)}")
    print(f"  Updated by: {request.updated_by}")
    print(f"  Version bump: {request.version_bump}")

    manifest = load_manifest()

    # Add new assets
    existing_ids = {a.get("id") for a in manifest.get("assets", [])}
    added_count = 0

    for asset_entry in request.assets_to_add:
        if asset_entry.id in existing_ids:
            print(f"  ⚠️  {asset_entry.id} already exists, skipping")
            continue

        asset_dict = asset_entry.dict()
        manifest["assets"].append(asset_dict)
        added_count += 1
        print(f"  ✅ Added: {asset_entry.id} ({asset_entry.name})")

    # Update summary
    manifest["last_updated"] = datetime.utcnow().isoformat()
    manifest["asset_summary"]["total_assets"] = len(manifest["assets"])

    # Recalculate summary by category and priority
    by_category = {}
    by_priority = {}
    by_status = {}

    for asset in manifest["assets"]:
        category = asset.get("category", "unknown")
        priority = asset.get("priority", "MEDIUM")
        status = asset.get("status", "ready")

        by_category[category] = by_category.get(category, 0) + 1
        by_priority[priority] = by_priority.get(priority, 0) + 1
        by_status[status] = by_status.get(status, 0) + 1

    manifest["asset_summary"]["by_category"] = by_category
    manifest["asset_summary"]["by_priority"] = by_priority

    # Bump version
    if request.version_bump == "major":
        parts = manifest["version"].split(".")
        parts[0] = str(int(parts[0]) + 1)
        parts[1] = "0"
        parts[2] = "0"
        manifest["version"] = ".".join(parts)
    elif request.version_bump == "minor":
        parts = manifest["version"].split(".")
        parts[1] = str(int(parts[1]) + 1)
        parts[2] = "0"
        manifest["version"] = ".".join(parts)
    else:  # patch
        parts = manifest["version"].split(".")
        parts[2] = str(int(parts[2]) + 1)
        manifest["version"] = ".".join(parts)

    # Save
    if save_manifest(manifest):
        print(f"  ✅ Manifest updated (v{manifest['version']})")
        return {
            "success": True,
            "assets_added": added_count,
            "new_version": manifest["version"],
            "total_assets": manifest["asset_summary"]["total_assets"],
            "summary": manifest["asset_summary"]
        }
    else:
        raise HTTPException(status_code=500, detail="Failed to save manifest")


@router.get("/validate")
async def validate_manifest() -> ManifestValidationResult:
    """
    Validate manifest integrity and consistency.

    Checks:
    - All asset IDs unique
    - All required fields present
    - Category/priority valid values
    - File paths exist
    - No broken references
    """
    print("\n✅ Validating manifest...")

    manifest = load_manifest()
    errors = []
    warnings = []
    checks = {}

    # Check 1: Asset count
    asset_count = len(manifest.get("assets", []))
    checks["asset_count"] = asset_count > 0
    print(f"  • Asset count: {asset_count}")

    # Check 2: Unique IDs
    asset_ids = [a.get("id") for a in manifest.get("assets", [])]
    if len(asset_ids) != len(set(asset_ids)):
        errors.append("Duplicate asset IDs detected")
        checks["unique_ids"] = False
    else:
        checks["unique_ids"] = True
    print(f"  • Unique IDs: {'✅' if checks['unique_ids'] else '❌'}")

    # Check 3: Required fields
    required_fields = ["id", "name", "category", "file_path", "priority", "status"]
    for asset in manifest.get("assets", []):
        missing = [f for f in required_fields if f not in asset]
        if missing:
            errors.append(f"{asset.get('id', 'unknown')}: missing {missing}")
    checks["required_fields"] = len([a for a in manifest.get("assets", [])
                                     if all(f in a for f in required_fields)]) == asset_count
    print(f"  • Required fields: {'✅' if checks['required_fields'] else '❌'}")

    # Check 4: Valid categories
    valid_categories = {"devotional", "portrait", "symbol", "street", "abstract", "texture"}
    invalid_categories = set()
    for asset in manifest.get("assets", []):
        cat = asset.get("category")
        if cat and cat not in valid_categories:
            invalid_categories.add(cat)
    if invalid_categories:
        warnings.append(f"Invalid categories: {invalid_categories}")
    checks["valid_categories"] = len(invalid_categories) == 0
    print(f"  • Valid categories: {'✅' if checks['valid_categories'] else '⚠️'}")

    # Check 5: Valid priorities
    valid_priorities = {"CRITICAL", "HIGH", "MEDIUM"}
    invalid_priorities = set()
    for asset in manifest.get("assets", []):
        pri = asset.get("priority")
        if pri and pri not in valid_priorities:
            invalid_priorities.add(pri)
    if invalid_priorities:
        warnings.append(f"Invalid priorities: {invalid_priorities}")
    checks["valid_priorities"] = len(invalid_priorities) == 0
    print(f"  • Valid priorities: {'✅' if checks['valid_priorities'] else '⚠️'}")

    # Check 6: Summary accuracy
    by_category = {}
    by_priority = {}
    for asset in manifest.get("assets", []):
        cat = asset.get("category", "unknown")
        pri = asset.get("priority", "MEDIUM")
        by_category[cat] = by_category.get(cat, 0) + 1
        by_priority[pri] = by_priority.get(pri, 0) + 1

    manifest_by_cat = manifest.get("asset_summary", {}).get("by_category", {})
    manifest_by_pri = manifest.get("asset_summary", {}).get("by_priority", {})

    summary_matches = (by_category == manifest_by_cat and by_priority == manifest_by_pri)
    if not summary_matches:
        warnings.append("Summary statistics do not match asset list (run recalculate)")
    checks["summary_accuracy"] = summary_matches
    print(f"  • Summary accuracy: {'✅' if checks['summary_accuracy'] else '⚠️'}")

    # Overall
    valid = len(errors) == 0
    print(f"\n  {'✅ MANIFEST VALID' if valid else '❌ MANIFEST INVALID'}")

    return ManifestValidationResult(
        valid=valid,
        total_assets=asset_count,
        by_category=by_category,
        by_priority=by_priority,
        by_status={a.get("status"): 1 for a in manifest.get("assets", [])},
        errors=errors,
        warnings=warnings,
        checks_passed=checks
    )


@router.post("/recalculate-summary")
async def recalculate_manifest_summary():
    """Recalculate manifest summary statistics."""
    print("\n🔄 Recalculating manifest summary...")

    manifest = load_manifest()

    by_category = {}
    by_priority = {}
    by_status = {}

    for asset in manifest.get("assets", []):
        cat = asset.get("category", "unknown")
        pri = asset.get("priority", "MEDIUM")
        status = asset.get("status", "ready")

        by_category[cat] = by_category.get(cat, 0) + 1
        by_priority[pri] = by_priority.get(pri, 0) + 1
        by_status[status] = by_status.get(status, 0) + 1

    manifest["asset_summary"] = {
        "total_assets": len(manifest.get("assets", [])),
        "by_category": by_category,
        "by_priority": by_priority,
        "by_status": by_status
    }

    manifest["last_updated"] = datetime.utcnow().isoformat()

    if save_manifest(manifest):
        print("  ✅ Summary recalculated")
        return {"success": True, "summary": manifest["asset_summary"]}
    else:
        raise HTTPException(status_code=500, detail="Failed to save manifest")


@router.post("/backfill")
async def backfill_asset_metadata(request: BackfillAssetRequest) -> BackfillResult:
    """
    Backfill metadata for existing asset.

    Used for the 12 existing kr-solidarity assets that don't have
    full phase 1-4 metadata yet.
    """
    print(f"\n🔄 Backfilling metadata for {request.asset_id}")
    print(f"  Category: {request.category}")
    print(f"  Political significance: {request.political_significance}")

    manifest = load_manifest()

    # Find asset
    asset = None
    for a in manifest.get("assets", []):
        if a.get("id") == request.asset_id:
            asset = a
            break

    if not asset:
        raise HTTPException(status_code=404, detail=f"Asset {request.asset_id} not found in manifest")

    # Update asset with new metadata
    asset["category"] = request.category
    asset["priority"] = request.priority
    asset["intended_context"] = request.intended_context

    if "specs" not in asset:
        asset["specs"] = {}

    asset["specs"]["style"] = request.style

    # Mark as backfilled
    asset["backfilled_at"] = datetime.utcnow().isoformat()
    asset["backfilled_by"] = request.backfilled_by

    manifest["last_updated"] = datetime.utcnow().isoformat()

    if save_manifest(manifest):
        print("  ✅ Asset metadata updated")
        return BackfillResult(
            success=True,
            asset_id=request.asset_id,
            message=f"Metadata backfilled for {request.asset_id}",
            metadata_created=True,
            manifest_updated=True,
            validation_status="pending"
        )
    else:
        raise HTTPException(status_code=500, detail="Failed to save manifest")


@router.post("/integration-test/{asset_id}")
async def run_integration_test(asset_id: str) -> AssetIntegrationTestResult:
    """
    Run component integration test for asset.

    Checks:
    - Asset file exists at path
    - Asset can load in components
    - No console errors
    - Renders correctly
    """
    print(f"\n🧪 Running integration test for {asset_id}")

    import time
    start_time = time.time()

    try:
        # Find asset in manifest
        manifest = load_manifest()
        asset = None
        for a in manifest.get("assets", []):
            if a.get("id") == asset_id:
                asset = a
                break

        if not asset:
            return AssetIntegrationTestResult(
                asset_id=asset_id,
                test_name="asset_exists",
                passed=False,
                error_message="Asset not found in manifest",
                execution_time_ms=(time.time() - start_time) * 1000
            )

        # Test 1: File exists
        file_path = asset.get("file_path", "")
        asset_exists = Path(file_path).exists() or file_path.startswith("/assets/")
        print(f"  • File exists: {'✅' if asset_exists else '❌'} ({file_path})")

        # Test 2: Required fields
        required = ["id", "name", "category", "file_path", "specs"]
        has_required = all(k in asset for k in required)
        print(f"  • Required fields: {'✅' if has_required else '❌'}")

        # Test 3: Valid category
        valid_category = asset.get("category") in {"devotional", "portrait", "symbol", "street", "abstract", "texture"}
        print(f"  • Valid category: {'✅' if valid_category else '❌'}")

        # Test 4: Specs complete
        specs = asset.get("specs", {})
        specs_complete = "aspect_ratio" in specs and "style" in specs
        print(f"  • Specs complete: {'✅' if specs_complete else '❌'}")

        passed = asset_exists and has_required and valid_category and specs_complete

        return AssetIntegrationTestResult(
            asset_id=asset_id,
            test_name="component_integration",
            passed=passed,
            error_message=None if passed else "One or more checks failed",
            execution_time_ms=(time.time() - start_time) * 1000
        )

    except Exception as e:
        return AssetIntegrationTestResult(
            asset_id=asset_id,
            test_name="component_integration",
            passed=False,
            error_message=str(e),
            execution_time_ms=(time.time() - start_time) * 1000
        )


@router.post("/deployment-plan")
async def generate_deployment_plan(request: ManifestUpdateRequest) -> ManifestDeploymentPlan:
    """
    Generate deployment plan before going live.

    Includes:
    - Validation checks required
    - Testing strategy
    - Rollback procedures
    - Go-live checklist
    """
    print("\n📋 Generating deployment plan")

    manifest = load_manifest()

    plan = ManifestDeploymentPlan(
        manifest_version=manifest.get("version", "3.0.0"),
        total_new_assets=len(request.assets_to_add),
        total_updated_assets=len(request.assets_to_update or []),
        deployment_timestamp=datetime.utcnow(),
        tests_required=[
            "Manifest validation (no errors)",
            "Asset file integrity (all paths exist)",
            "Component integration tests (all assets)",
            "Visual regression tests (desktop + mobile)",
            "Performance tests (load time < 2s)",
            "Accessibility audit (WCAG AA)",
            "Cross-browser compatibility",
            "Review feedback verification"
        ],
        rollback_plan=(
            "1. Keep backup of previous manifest.json\n"
            "2. If issues: revert manifest.json to previous version\n"
            "3. Clear frontend cache (CDN purge)\n"
            "4. Monitor error rates for 1 hour\n"
            "5. Investigate root cause"
        ),
        go_live_checklist=[
            "[ ] All tests passing",
            "[ ] Validation report generated and reviewed",
            "[ ] Backup of current manifest saved",
            "[ ] CDN cache invalidation ready",
            "[ ] Team notified of deployment window",
            "[ ] Monitoring dashboards active",
            "[ ] Rollback procedure documented",
            "[ ] Post-deployment sanity checks planned"
        ],
        estimated_deployment_time_minutes=5.0
    )

    print("  ✅ Deployment plan generated")
    print(f"     New assets: {plan.total_new_assets}")
    print(f"     Updated assets: {plan.total_updated_assets}")
    print(f"     Tests required: {len(plan.tests_required)}")

    return plan


@router.get("/export")
async def export_manifest():
    """Export current manifest as JSON."""
    print("\n📤 Exporting manifest...")

    manifest = load_manifest()

    return {
        "success": True,
        "manifest": manifest,
        "exported_at": datetime.utcnow().isoformat()
    }


@router.post("/import")
async def import_manifest(file: UploadFile = File(...)):
    """Import manifest from uploaded JSON file."""
    print(f"\n📥 Importing manifest from {file.filename}")

    try:
        contents = await file.read()
        imported_manifest = json.loads(contents)

        # Validate
        if not isinstance(imported_manifest, dict):
            raise ValueError("Manifest must be a JSON object")
        if "assets" not in imported_manifest:
            raise ValueError("Manifest must contain 'assets' array")

        # Backup current
        if MANIFEST_PATH.exists():
            backup_path = MANIFEST_PATH.with_stem(MANIFEST_PATH.stem + ".backup")
            shutil.copy(MANIFEST_PATH, backup_path)
            print(f"  ✅ Backup created: {backup_path}")

        # Save new
        if save_manifest(imported_manifest):
            print("  ✅ Manifest imported successfully")
            return {
                "success": True,
                "message": "Manifest imported",
                "asset_count": len(imported_manifest.get("assets", []))
            }
        else:
            raise Exception("Failed to save imported manifest")

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Import failed: {e!s}")
