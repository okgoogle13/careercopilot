
import json
import os
import sys

# Configuration
ROOT_DIR = '/Users/okgoogle13/Desktop/careercopilot'
MANIFEST_PATH = os.path.join(ROOT_DIR, 'assets/northcote-[DEPRECATED_STYLE]-manifest.json')

def verify_manifest():
    print(f"Verifying Manifest Integrity: {MANIFEST_PATH}")

    try:
        with open(MANIFEST_PATH, 'r') as f:
            manifest = json.load(f)
            assets = manifest.get('assets', [])
    except Exception as e:
        print(f"ERROR: Could not load manifest: {e}")
        sys.exit(1)

    missing_count = 0
    found_count = 0

    print("\n--- Asset Path Verification ---")

    for asset in assets:
        # Normalize path: remove leading slash if present to join with ROOT_DIR
        relative_path = asset.get('file_path', '').lstrip('/')

        # If path starts with 'assets/', join directly. If not, assume it's relative to project root?
        # The manifest typically stores paths like "/assets/plates/..."
        # So stripping the first slash makes it "assets/plates/..." which works with ROOT_DIR

        full_path = os.path.join(ROOT_DIR, relative_path)

        if os.path.exists(full_path):
            found_count += 1
            # print(f"✅ FOUND: {asset['id']} ({relative_path})")
        else:
            missing_count += 1
            print(f"❌ MISSING: {asset['id']} - Expected at: {relative_path}")
            # Check if it exists in uncategorized?

    print("-" * 30)
    print(f"Total Assets defined: {len(assets)}")
    print(f"Successfully located: {found_count}")
    print(f"Missing Files:        {missing_count}")

    if missing_count == 0:
        print("\n✅ PASSED: All manifest assets are present on disk.")
    else:
        print("\n⚠️ WARNING: Manifest contains broken paths.")

if __name__ == '__main__':
    verify_manifest()
