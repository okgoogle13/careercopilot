
import json
import os
from pathlib import Path

def prune_manifest():
    manifest_path = Path('frontend/public/assets/kerala-rage-kr-solidarity-manifest.json')
    if not manifest_path.exists():
        print("Manifest not found.")
        return

    with open(manifest_path, 'r') as f:
        manifest = json.load(f)

    original_count = len(manifest['assets'])
    remaining_assets = []
    purged_ids = []

    for asset in manifest['assets']:
        file_path = asset.get('file_path')
        if not file_path:
            # Keep reserved gaps as they don't have file paths usually or are marked as such
            if asset.get('priority') == 'RESERVED' or 'Reserved' in asset.get('name', ''):
                remaining_assets.append(asset)
            continue

        # Check if file exists relative to frontend/public
        full_path = Path('frontend/public') / file_path.lstrip('/')
        if full_path.exists():
            remaining_assets.append(asset)
        else:
            purged_ids.append(asset['id'])

    manifest['assets'] = remaining_assets
    manifest['total_assets'] = len(remaining_assets)
    manifest['last_updated'] = "2026-02-24" # Fixed for now or use datetime

    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)

    print(f"Pruning complete.")
    print(f"Original Assets: {original_count}")
    print(f"Remaining Assets: {len(remaining_assets)}")
    print(f"Purged Assets: {len(purged_ids)}")
    
    # Optionally clean up asset-packages
    # But let's just do the manifest for now as requested.

if __name__ == "__main__":
    prune_manifest()
