#!/usr/bin/env python3

"""
kr-solidarity v3.0.0 Manifest Integration
Integrate Phase 3-4 assets into manifest.json and validate for production.

Usage:
    # Process single asset package
    python integrate_manifest.py /path/to/asset-packages/KR-SOLID-001/

    # Process all asset packages
    python integrate_manifest.py /path/to/asset-packages/

    # Backfill existing 12 assets
    python integrate_manifest.py --backfill

    # Validate manifest
    python integrate_manifest.py --validate

    # Generate deployment plan
    python integrate_manifest.py --deployment-plan
"""

import json
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional
import argparse


# ============================================================================
# CONSTANTS
# ============================================================================

MANIFEST_PATH = Path("./frontend/public/assets/kr-solidarity-manifest.json")

# Existing 12 kr-solidarity assets (v3.0.0)
EXISTING_ASSETS = [
    {"id": "KR-SOLID-001", "name": "Shiva Statue", "category": "devotional", "priority": "CRITICAL"},
    {"id": "KR-SOLID-002", "name": "Tipu Sultan Portrait", "category": "portrait", "priority": "HIGH"},
    {"id": "KR-SOLID-003", "name": "Bhagat Singh Portrait", "category": "portrait", "priority": "HIGH"},
    {"id": "KR-SOLID-004", "name": "Kerala Elephant Symbol", "category": "symbol", "priority": "CRITICAL"},
    {"id": "KR-SOLID-005", "name": "Kerala Landscape", "category": "symbol", "priority": "HIGH"},
    {"id": "KR-SOLID-006", "name": "[DEPRECATED_STYLE] Paint Splash", "category": "abstract", "priority": "MEDIUM"},
    {"id": "KR-SOLID-007", "name": "Anti-Colonial Graffiti", "category": "street", "priority": "CRITICAL"},
    {"id": "KR-SOLID-008", "name": "Melbourne Laneway Texture", "category": "texture", "priority": "CRITICAL"},
    {"id": "KR-SOLID-009", "name": "First Nations Placard", "category": "street", "priority": "CRITICAL"},
    {"id": "KR-SOLID-010", "name": "Mythic Mural", "category": "abstract", "priority": "MEDIUM"},
    {"id": "KR-SOLID-011", "name": "Typography Pressure", "category": "abstract", "priority": "MEDIUM"},
    {"id": "KR-SOLID-012", "name": "Street Poster", "category": "portrait", "priority": "HIGH"},
]


# ============================================================================
# MANIFEST OPERATIONS
# ============================================================================

def load_manifest() -> dict:
    """Load manifest from file."""
    if MANIFEST_PATH.exists():
        with open(MANIFEST_PATH, 'r') as f:
            return json.load(f)
    return {
        "project": "kerala-rage kr-solidarity",
        "version": "3.0.0",
        "last_updated": datetime.now().isoformat(),
        "strategy": "Final Canon Alignment (Path B)",
        "assets": [],
        "asset_summary": {"total_assets": 0, "by_category": {}, "by_priority": {}}
    }


def save_manifest(manifest: dict) -> bool:
    """Save manifest to file."""
    try:
        MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(MANIFEST_PATH, 'w') as f:
            json.dump(manifest, f, indent=2)
        print(f"✅ Manifest saved: {MANIFEST_PATH}")
        return True
    except Exception as e:
        print(f"❌ Failed to save manifest: {e}")
        return False


def load_asset_package(package_dir: Path) -> Optional[dict]:
    """Load asset from package directory."""
    metadata_file = package_dir / "metadata.json"
    if not metadata_file.exists():
        return None

    try:
        with open(metadata_file, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Failed to load package: {e}")
        return None


def extract_manifest_entry(metadata: dict) -> Optional[dict]:
    """Extract manifest entry from metadata."""
    try:
        asset_id = metadata.get("asset_id")
        name = metadata.get("name")
        category = metadata.get("analysis", {}).get("category")
        file_path = metadata.get("asset_path")
        priority = metadata.get("specifications", {}).get("priority", "MEDIUM")
        status = metadata.get("specifications", {}).get("manifest_status", "ready")
        intended_context = metadata.get("analysis", {}).get("intended_context", "")

        if not all([asset_id, name, category, file_path]):
            return None

        specs = {
            "aspect_ratio": metadata.get("specifications", {}).get("dimensions", {}).get("aspect_ratio", "unknown"),
            "style": metadata.get("analysis", {}).get("style", "mixed"),
        }

        if metadata.get("analysis", {}).get("text_content"):
            specs["text_content"] = metadata.get("analysis", {}).get("text_content")

        if metadata.get("analysis", {}).get("color_palette"):
            specs["color_palette"] = metadata.get("analysis", {}).get("color_palette")

        if metadata.get("analysis", {}).get("detected_symbols"):
            specs["symbols"] = metadata.get("analysis", {}).get("detected_symbols")

        entry = {
            "id": asset_id,
            "name": name,
            "category": category,
            "file_path": file_path,
            "priority": priority,
            "status": status,
            "intended_context": intended_context,
            "specs": specs
        }

        return entry

    except Exception as e:
        print(f"❌ Failed to extract entry: {e}")
        return None


# ============================================================================
# OPERATIONS
# ============================================================================

def integrate_asset_packages(packages_dir: Path) -> int:
    """Integrate asset packages into manifest."""
    print(f"\n📦 Integrating asset packages from {packages_dir}")

    if not packages_dir.exists():
        print(f"❌ Directory not found: {packages_dir}")
        return 0

    manifest = load_manifest()
    existing_ids = {a.get("id") for a in manifest.get("assets", [])}

    packages = sorted([d for d in packages_dir.iterdir() if d.is_dir()])
    added_count = 0

    for package_dir in packages:
        metadata = load_asset_package(package_dir)
        if not metadata:
            print(f"⚠️  {package_dir.name}: No metadata found")
            continue

        entry = extract_manifest_entry(metadata)
        if not entry:
            print(f"⚠️  {package_dir.name}: Could not extract manifest entry")
            continue

        asset_id = entry.get("id")
        if asset_id in existing_ids:
            print(f"⚠️  {asset_id} already in manifest, skipping")
            continue

        manifest["assets"].append(entry)
        added_count += 1
        print(f"✅ Added: {asset_id} ({entry.get('name')})")

    # Recalculate summary
    manifest["last_updated"] = datetime.now().isoformat()
    manifest["asset_summary"]["total_assets"] = len(manifest["assets"])

    by_category = {}
    by_priority = {}
    for asset in manifest["assets"]:
        cat = asset.get("category", "unknown")
        pri = asset.get("priority", "MEDIUM")
        by_category[cat] = by_category.get(cat, 0) + 1
        by_priority[pri] = by_priority.get(pri, 0) + 1

    manifest["asset_summary"]["by_category"] = by_category
    manifest["asset_summary"]["by_priority"] = by_priority

    if added_count > 0:
        save_manifest(manifest)
        print(f"\n✅ Integration complete: {added_count} assets added")
        print(f"   Total assets: {manifest['asset_summary']['total_assets']}")
        print(f"   By category: {by_category}")
        print(f"   By priority: {by_priority}")

    return added_count


def validate_manifest() -> bool:
    """Validate manifest integrity."""
    print(f"\n✅ Validating manifest...")

    manifest = load_manifest()
    errors = []
    warnings = []

    # Check 1: Asset count
    asset_count = len(manifest.get("assets", []))
    print(f"  • Total assets: {asset_count}")

    # Check 2: Unique IDs
    asset_ids = [a.get("id") for a in manifest.get("assets", [])]
    duplicates = [id for id in asset_ids if asset_ids.count(id) > 1]
    if duplicates:
        errors.append(f"Duplicate IDs: {set(duplicates)}")
    print(f"  • Unique IDs: {'✅' if not duplicates else '❌'}")

    # Check 3: Required fields
    required = ["id", "name", "category", "file_path", "priority", "status"]
    for asset in manifest.get("assets", []):
        missing = [f for f in required if f not in asset]
        if missing:
            errors.append(f"{asset.get('id')}: missing {missing}")

    complete_count = sum(1 for a in manifest.get("assets", [])
                        if all(f in a for f in required))
    print(f"  • Required fields: {complete_count}/{asset_count} complete")

    # Check 4: Valid categories
    valid_categories = {"devotional", "portrait", "symbol", "street", "abstract", "texture"}
    invalid = [a.get("id") for a in manifest.get("assets", [])
              if a.get("category") not in valid_categories]
    if invalid:
        warnings.append(f"Invalid categories in: {invalid}")
    print(f"  • Valid categories: {'✅' if not invalid else '❌'}")

    # Check 5: Summary accuracy
    by_category = {}
    by_priority = {}
    for asset in manifest.get("assets", []):
        cat = asset.get("category", "unknown")
        pri = asset.get("priority", "MEDIUM")
        by_category[cat] = by_category.get(cat, 0) + 1
        by_priority[pri] = by_priority.get(pri, 0) + 1

    manifest_cat = manifest.get("asset_summary", {}).get("by_category", {})
    manifest_pri = manifest.get("asset_summary", {}).get("by_priority", {})

    summary_ok = (by_category == manifest_cat and by_priority == manifest_pri)
    print(f"  • Summary accuracy: {'✅' if summary_ok else '❌'}")

    # Report
    print(f"\n  {'✅ MANIFEST VALID' if not errors else '❌ MANIFEST INVALID'}")

    if errors:
        print(f"\n  ❌ ERRORS ({len(errors)}):")
        for err in errors[:5]:
            print(f"     - {err}")
        if len(errors) > 5:
            print(f"     ... and {len(errors) - 5} more")

    if warnings:
        print(f"\n  ⚠️  WARNINGS ({len(warnings)}):")
        for warn in warnings[:5]:
            print(f"     - {warn}")
        if len(warnings) > 5:
            print(f"     ... and {len(warnings) - 5} more")

    return len(errors) == 0


def backfill_existing_assets() -> int:
    """Backfill metadata for existing 12 assets."""
    print(f"\n🔄 Backfilling existing 12 assets...")

    manifest = load_manifest()
    backfilled = 0

    for existing in EXISTING_ASSETS:
        asset_id = existing.get("id")
        asset = None

        # Find in manifest
        for a in manifest.get("assets", []):
            if a.get("id") == asset_id:
                asset = a
                break

        if not asset:
            print(f"⚠️  {asset_id} not found in manifest, skipping")
            continue

        # Update with backfill data
        asset["category"] = existing.get("category")
        asset["priority"] = existing.get("priority")

        if "specs" not in asset:
            asset["specs"] = {}

        # Add backfill metadata
        asset["backfilled_at"] = datetime.now().isoformat()
        asset["backfilled_by"] = "system"

        backfilled += 1
        print(f"✅ Backfilled: {asset_id} ({existing.get('name')})")

    if backfilled > 0:
        manifest["last_updated"] = datetime.now().isoformat()
        save_manifest(manifest)
        print(f"\n✅ Backfill complete: {backfilled} assets updated")

    return backfilled


def generate_deployment_plan():
    """Generate deployment plan."""
    print(f"\n📋 Generating deployment plan...")

    manifest = load_manifest()
    version = manifest.get("version", "3.0.0")
    asset_count = len(manifest.get("assets", []))

    print(f"\n  📊 DEPLOYMENT SUMMARY")
    print(f"     Version: {version}")
    print(f"     Total assets: {asset_count}")
    print(f"     Summary: {manifest.get('asset_summary')}")

    print(f"\n  🧪 REQUIRED TESTS")
    tests = [
        "Manifest validation (no errors)",
        "Asset file integrity (all paths exist)",
        "Component integration tests (all assets)",
        "Visual regression tests (desktop + mobile)",
        "Performance tests (load time < 2s)",
        "Accessibility audit (WCAG AA)",
        "Cross-browser compatibility",
    ]
    for i, test in enumerate(tests, 1):
        print(f"     {i}. {test}")

    print(f"\n  🔄 ROLLBACK PROCEDURE")
    print(f"     1. Keep backup of previous manifest.json")
    print(f"     2. If issues: revert manifest.json to backup")
    print(f"     3. Clear frontend cache (CDN purge)")
    print(f"     4. Monitor error rates for 1 hour")
    print(f"     5. Post-mortem if needed")

    print(f"\n  ✅ GO-LIVE CHECKLIST")
    checklist = [
        "All tests passing",
        "Validation report generated",
        "Backup of current manifest saved",
        "CDN cache invalidation ready",
        "Team notified of window",
        "Monitoring dashboards active",
        "Rollback procedure documented",
        "Post-deployment checks planned",
    ]
    for i, item in enumerate(checklist, 1):
        print(f"     [ ] {item}")

    print(f"\n  ⏱️  ESTIMATED TIME: 5 minutes")


# ============================================================================
# CLI
# ============================================================================

def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="kr-solidarity v3.0.0 Manifest Integration"
    )
    parser.add_argument(
        "path",
        nargs="?",
        help="Asset packages directory or file"
    )
    parser.add_argument(
        "--backfill",
        action="store_true",
        help="Backfill existing 12 assets"
    )
    parser.add_argument(
        "--validate",
        action="store_true",
        help="Validate manifest integrity"
    )
    parser.add_argument(
        "--deployment-plan",
        action="store_true",
        help="Generate deployment plan"
    )

    args = parser.parse_args()

    print(f"\n{'='*80}")
    print(f"kr-solidarity v3.0.0 MANIFEST INTEGRATION")
    print(f"{'='*80}")

    if args.backfill:
        backfill_existing_assets()
    elif args.validate:
        validate_manifest()
    elif args.deployment_plan:
        generate_deployment_plan()
    elif args.path:
        path = Path(args.path)
        if path.is_dir():
            integrate_asset_packages(path)
        else:
            print(f"❌ Path not found: {args.path}")
            return 1
    else:
        parser.print_help()
        return 1

    print(f"\n{'='*80}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
