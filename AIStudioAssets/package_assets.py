#!/usr/bin/env python3
"""
Northcote Curio Collection - Asset Packaging Automation
Standardizes naming and organizes assets for audit and compliance.
"""

import os
import shutil
import json
from pathlib import Path
from datetime import datetime

# Asset mapping configuration based on visual audit
# Format: { "Source Filename": { "asset_id": "ASSET-XX", "slug": "slug-name", "type": "type", "res": "1024x1024" } }
MAPPING = {
    "Asset-1-wallpaper.png": {
        "id": "ASSET-01",
        "slug": "multi-specimen-plate",
        "type": "wallpaper",
        "res": "1792x1024"
    },
    "Asset-2-Sentry.png": {
        "id": "ASSET-02",
        "slug": "kookaburra",
        "type": "sentry-mascot",
        "res": "1024x1024"
    },
    "Asset-3-Parchment.jpg": {
        "id": "ASSET-03",
        "slug": "scientific-grid",
        "type": "parchment-texture",
        "res": "1024x1024"
    },
    "Generated Image February 02, 2026 - 11_43AM.jpeg": {
        "id": "ASSET-04",
        "slug": "banksia-serrata",
        "type": "sentinel-pod",
        "res": "1024x1024"
    },
    "Generated Image February 02, 2026 - 11_54AM.jpeg": {
        "id": "ASSET-05",
        "slug": "aboriginal-grinding-stone",
        "type": "arrernte",
        "res": "1024x1024"
    },
    "Generated Image February 02, 2026 - 11_43AM (1).jpeg": {
        "id": "ASSET-05-V1",
        "slug": "lithic-pendant",
        "type": "rejected-v1",
        "res": "1024x1024"
    },
    "Generated Image February 02, 2026 - 12_46PM.jpeg": {
        "id": "ASSET-06",
        "slug": "radiolaria-hexacontium",
        "type": "bone-cage",
        "res": "1024x1024"
    },
    "Generated Image February 02, 2026 - 1_03PM (3).jpeg": {
        "id": "ASSET-07",
        "slug": "aseroe-rubra",
        "type": "starfish-cage",
        "res": "1024x1024"
    },
    "Generated Image February 02, 2026 - 1_03PM (2).jpeg": {
        "id": "ASSET-08",
        "slug": "pteropus-wing",
        "type": "natures-clockwork",
        "res": "1024x1024"
    },
    "Generated Image February 02, 2026 - 1_03PM (1).jpeg": {
        "id": "ASSET-09",
        "slug": "platygyra-coral",
        "type": "organic-labyrinth",
        "res": "1024x1024"
    },
    "Generated Image February 02, 2026 - 1_03PM.jpeg": {
        "id": "ASSET-10",
        "slug": "coelopleurus-test",
        "type": "imperial-crown",
        "res": "1024x1024"
    }
}

def create_directory_structure(base_dir):
    """Create organized directory structure"""
    base_path = Path(base_dir)
    base_path.mkdir(parents=True, exist_ok=True)

    # Create folders for unique Asset IDs (stripped of variants for folder names)
    asset_ids = {info["id"].split('-V')[0] for info in MAPPING.values()}
    for asset_id in asset_ids:
        (base_path / asset_id).mkdir(exist_ok=True)

    return base_path

def process_assets(source_dir, target_dir):
    """Rename and organize assets"""
    source = Path(source_dir)
    target = Path(target_dir)

    if not source.exists():
        print(f"❌ Source directory '{source_dir}' not found")
        return []

    create_directory_structure(target)

    processed = []

    for filename, info in MAPPING.items():
        source_file = source / filename
        if not source_file.exists():
            print(f"⚠️  Missing: {filename}")
            continue

        ext = source_file.suffix
        new_name = f"northcote-curio_asset-{info['id'].lower()}_{info['slug']}_{info['type']}_{info['res']}{ext}"

        # Determine folder (e.g. ASSET-05-V1 goes into ASSET-05)
        folder_name = info['id'].split('-V')[0]
        target_path = target / folder_name / new_name

        shutil.copy2(source_file, target_path)
        print(f"✅ Processed: {filename} -> {target_path.relative_to(target)}")
        processed.append({
            "asset_id": info["id"],
            "original": filename,
            "new_name": new_name,
            "path": str(target_path.relative_to(target))
        })

    return processed

def generate_manifest(target_dir, processed_data):
    """Generate collection-level manifest"""
    manifest = {
        "collection": "Northcote Curio Collection",
        "timestamp": datetime.now().isoformat(),
        "total_assets": len(processed_data),
        "assets": processed_data
    }

    manifest_path = Path(target_dir) / "collection-manifest.json"
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)

    print(f"\n📋 Manifest generated: {manifest_path}")

def create_package(target_dir):
    """Create final ZIP package"""
    timestamp = datetime.now().strftime("%Y%m%d-%H%M")
    zip_name = f"northcote-curio-assets_{timestamp}"
    shutil.make_archive(zip_name, 'zip', target_dir)
    print(f"📦 ZIP Package created: {zip_name}.zip")

def main():
    source_dir = "."
    target_dir = "northcote-curio-assets"

    print("🎨 Northcote Curio Asset Packaging Strategy Executing...")
    processed = process_assets(source_dir, target_dir)

    if processed:
        generate_manifest(target_dir, processed)
        create_package(target_dir)
        print("\n✨ Packaging Complete.")
    else:
        print("❌ No assets were processed.")

if __name__ == "__main__":
    main()
