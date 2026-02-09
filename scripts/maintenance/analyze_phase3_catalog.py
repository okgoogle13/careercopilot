
import json
import os
import re

# Configuration
MANIFEST_PATH = 'assets/northcote-curio-manifest.json'
PHASE3_DIR = 'Curio images phase 3'

# Keywords to match descriptions/filenames against specific Asset IDs
ASSET_KEYWORDS = {
    'ASSET-11': ['obsidian', 'mirror', 'black', 'reflection'],
    'ASSET-12': ['fern', 'fiddlehead', 'spiral', 'botanical'],
    'ASSET-13': ['cicada', 'wing', 'insect', 'transparent'],
    'ASSET-14': ['quartz', 'crystal', 'cluster', 'mineral'],
    'ASSET-15': ['x-ray', 'leaf', 'skeleton', 'veins'],
    # Add more heuristics as needed
}

def analyze_phase3_catalog():
    print(f"Analyzing {PHASE3_DIR} against Manifest...")

    # Load Manifest
    try:
        with open(MANIFEST_PATH, 'r') as f:
            manifest = json.load(f)
            # Assuming manifest has an 'assets' list
            manifest_assets = {a['id']: a for a in manifest.get('assets', [])}
            print(f"Loaded {len(manifest_assets)} definitions from manifest.")
    except Exception as e:
        print(f"Warning: Could not load manifest ({e}). Proceeding with heuristic matching only.")
        manifest_assets = {}

    catalog_report = []

    # Scan Phase 3 Directory
    if not os.path.exists(PHASE3_DIR):
        print(f"Directory not found: {PHASE3_DIR}")
        return

    files = [f for f in os.listdir(PHASE3_DIR) if not f.startswith('.')]
    print(f"Found {len(files)} files in Phase 3 directory.")

    matches_found = 0

    for filename in files:
        lower_name = filename.lower()
        possible_match = None

        # Heuristic Matching
        for asset_id, keywords in ASSET_KEYWORDS.items():
            if any(k in lower_name for k in keywords):
                possible_match = asset_id
                matches_found += 1
                break # Simple first-match wins

        # Get Manifest Details if matched
        manifest_name = "Unknown Specimen"
        if possible_match and possible_match in manifest_assets:
            manifest_name = manifest_assets[possible_match].get('name', 'Unknown')

        catalog_report.append({
            'filename': filename,
            'match_id': possible_match if possible_match else "UNMATCHED",
            'manifest_name': manifest_name
        })

    # Output Summary
    print("\n=== PHASE 3 CANDIDATE MATCHING ===")
    print(f"{'Filename':<50} | {'Asset ID':<10} | {'Manifest Name'}")
    print("-" * 90)

    # Sort: Matched first
    catalog_report.sort(key=lambda x: (x['match_id'] == "UNMATCHED", x['filename']))

    for item in catalog_report:
        print(f"{item['filename'][:47] + '...':<50} | {item['match_id']:<10} | {item['manifest_name']}")

if __name__ == '__main__':
    analyze_phase3_catalog()
