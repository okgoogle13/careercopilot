import json
import os
import sys
from pathlib import Path
from datetime import datetime

def integrate_manifests(packages_dir):
    root_dir = Path(packages_dir).parent
    manifest_path = root_dir / 'frontend/public/assets/kerala-rage-kr-solidarity-manifest.json'
    
    if not manifest_path.exists():
        print(f"Error: Global manifest not found at {manifest_path}")
        return

    with open(manifest_path, 'r') as f:
        global_manifest = json.load(f)

    existing_ids = {asset['id'] for asset in global_manifest.get('assets', [])}
    new_entries = 0
    updated_entries = 0

    packages_path = Path(packages_dir)
    for pkg_dir in sorted(packages_path.iterdir()):
        if not pkg_dir.is_dir() or not pkg_dir.name.startswith('KR-SOLID-'):
            continue
        
        manifest_file = pkg_dir / 'PACKAGING_MANIFEST.json'
        if not manifest_file.exists():
            continue
            
        with open(manifest_file, 'r') as f:
            pkg_manifest = json.load(f)
            
        asset_id = pkg_manifest.get('asset_id')
        if not asset_id:
            continue
            
        # Prepare the entry for the global manifest
        entry = {
            "id": asset_id,
            "name": pkg_manifest.get('asset_name', asset_id),
            "category": pkg_manifest.get('deployment_info', {}).get('category', 'uncategorized'),
            "layer": "ui-kit", # Default layer for these assets
            "aspect_ratio": "1:1",
            "file_path": pkg_manifest.get('deployment_info', {}).get('canonical_path', ''),
            "priority": pkg_manifest.get('deployment_info', {}).get('priority', 'MEDIUM'),
            "semantics": {
                "functional_role": "reference-asset",
                "semantic_weight": "cultural",
                "layering_role": "base"
            },
            "usage_rules": {
                "scale_suitability": ["hero", "section"],
                "small_ui_safe": True
            },
            "layering_compatibility": {
                "can_overlay_with": ["substrate"],
                "cannot_overlay_with": []
            }
        }

        # Find if it exists
        existing_idx = None
        for i, asset in enumerate(global_manifest['assets']):
            if asset['id'] == asset_id:
                existing_idx = i
                break
        
        if existing_idx is not None:
            global_manifest['assets'][existing_idx] = entry
            updated_entries += 1
        else:
            global_manifest['assets'].append(entry)
            new_entries += 1

    # Update summary
    global_manifest['total_assets'] = len(global_manifest['assets'])
    global_manifest['last_updated'] = datetime.now().strftime('%Y-%m-%d')
    
    # Sort assets by ID
    global_manifest['assets'].sort(key=lambda x: x['id'])

    with open(manifest_path, 'w') as f:
        json.dump(global_manifest, f, indent=2)

    print(f"Integration complete.")
    print(f"Total Assets: {global_manifest['total_assets']}")
    print(f"New Entries: {new_entries}")
    print(f"Updated Entries: {updated_entries}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/integrate_manifest.py <packages_dir>")
        sys.exit(1)
        
    if '--validate' in sys.argv:
        print("Validation only mode is not yet implemented in Python integrating script, but validation logic is in JS script")
        sys.exit(0)
        
    packages_dir = sys.argv[1]
    # Filter out any flags if present
    if packages_dir.startswith('--'):
        sys.exit(0)
        
    integrate_manifests(packages_dir)
