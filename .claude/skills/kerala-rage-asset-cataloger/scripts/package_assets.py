#!/usr/bin/env python3
"""
Kerala Rage Asset Packager - Manifest Integration v2.0
Standardizes naming, PNG format, validates sizes, organizes by category.
"""

import os
import shutil
import json
import re
from pathlib import Path
from datetime import datetime
from PIL import Image


def resolve_manifest_path(project_root):
    """
    Resolve manifest path with canonical-first precedence and legacy fallback.
    Supports override via KERALA_RAGE_MANIFEST_PATH.
    """
    override = os.getenv("KERALA_RAGE_MANIFEST_PATH")
    if override:
        override_path = Path(override)
        if override_path.exists():
            return override_path

    candidates = [
        project_root / "frontend" / "public" / "assets" / "kerala-rage-kr-solidarity-manifest.json",
        project_root / "assets" / "kerala-rage-kr-solidarity-manifest.json",  # legacy location
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return candidates[0]


def resolve_asset_source(project_root, rel_path):
    """
    Resolve manifest file_path entries to an existing on-disk source asset.
    Canonical assets live under frontend/public/assets/.
    """
    candidates = [
        project_root / "frontend" / "public" / rel_path,
        project_root / rel_path,  # legacy location fallback
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return candidates[0]


def load_manifest(path):
    """Load manifest JSON."""
    with open(path, 'r') as f:
        return json.load(f)

def parse_size_spec(spec):
    """
    Extract size constraints from usage_specs.
    Returns (width, height, is_min) or None.
    """
    if not spec:
        return None

    spec_str = str(spec).lower()

    # "400px+" → minimum width, no downscale
    if '+' in spec_str:
        match = re.search(r'(\d+)px', spec_str)
        if match:
            return (int(match.group(1)), None, True)

    # "320px width" → exact width
    if 'width' in spec_str:
        match = re.search(r'(\d+)px', spec_str)
        if match:
            return (int(match.group(1)), 10000, False)

    # "160px" or "diameter" → bounding box
    match = re.search(r'(\d+)px', spec_str)
    if match:
        size = int(match.group(1))
        return (size, size, False)

    return None

def process_image(src, dest, size_constraint=None):
    """Convert to PNG max quality, apply size constraints."""
    try:
        with Image.open(src) as img:
            orig_size = img.size

            # Apply size constraint
            if size_constraint:
                width, height, is_min = size_constraint

                if is_min:
                    # Minimum size check
                    if img.width < width:
                        print(f"    ⚠️  Below min width: {img.width}px < {width}px")
                else:
                    # Max constraint - resize if exceeds
                    if img.width > width or (height and img.height > height):
                        img.thumbnail((width, height), Image.LANCZOS)
                        print(f"    ↓ Resized: {orig_size} → {img.size}")

            # Convert to RGBA for transparency
            if img.mode != 'RGBA':
                img = img.convert('RGBA')

            # Save PNG max quality
            img.save(dest, 'PNG', optimize=True, compress_level=1)
            return True
    except Exception as e:
        print(f"    ❌ Error: {e}")
        return False

def generate_standard_name(asset):
    """Generate ASSET-N_kebab-slug.png from manifest entry."""
    asset_id = asset['id']
    name = asset['name']
    slug = re.sub(r'[^a-zA-Z0-9]+', '-', name.lower()).strip('-')
    return f"{asset_id}_{slug}.png"

def main():
    # Paths
    PROJECT_ROOT = Path("/Users/okgoogle13/Projects/careercopilot")
    MANIFEST_PATH = resolve_manifest_path(PROJECT_ROOT)
    OUTPUT_DIR = Path("packaged_assets")

    print("🎨 Kerala Rage Asset Packager v2.0")
    print(f"   Manifest: {MANIFEST_PATH}\n")

    if not MANIFEST_PATH.exists():
        print("❌ Manifest not found")
        print("   Checked:")
        print(f"   - {PROJECT_ROOT / 'frontend' / 'public' / 'assets' / 'kerala-rage-kr-solidarity-manifest.json'}")
        print(f"   - {PROJECT_ROOT / 'assets' / 'kerala-rage-kr-solidarity-manifest.json'}")
        return

    manifest = load_manifest(MANIFEST_PATH)

    # Create timestamped package
    timestamp = datetime.now().strftime("%Y%m%d-%H%M")
    pkg_dir = OUTPUT_DIR / f"kerala-rage-assets_{timestamp}"
    pkg_dir.mkdir(parents=True, exist_ok=True)

    processed = 0

    for asset in manifest.get('assets', []):
        asset_id = asset['id']
        category = asset.get('category', 'uncategorized')

        # Source path
        rel_path = asset['file_path'].lstrip('/')
        src = resolve_asset_source(PROJECT_ROOT, rel_path)

        if not src.exists():
            print(f"⚠️  {asset_id}: Missing {src.name}")
            continue

        # Generate standard name
        std_name = generate_standard_name(asset)

        # Category directory
        cat_dir = pkg_dir / category
        cat_dir.mkdir(exist_ok=True)
        dest = cat_dir / std_name

        # Size constraint from usage_specs
        usage_specs = asset.get('usage_specs', {})
        size_spec = usage_specs.get('size') if usage_specs else None
        size_constraint = parse_size_spec(size_spec)

        print(f"📦 {asset_id}: {asset['name']}")
        if process_image(src, dest, size_constraint):
            processed += 1

    # Audit manifest
    audit = {
        "package_timestamp": datetime.now().isoformat(),
        "source_manifest_version": manifest.get('version'),
        "total_processed": processed,
        "asset_ids": [a['id'] for a in manifest['assets']]
    }

    with open(pkg_dir / "package_audit.json", 'w') as f:
        json.dump(audit, f, indent=2)

    # Create ZIP
    shutil.make_archive(OUTPUT_DIR / f"kerala-rage-assets_{timestamp}", 'zip', pkg_dir)

    print(f"\n✅ Complete: {processed} assets")
    print(f"   Package: {OUTPUT_DIR / f'kerala-rage-assets_{timestamp}.zip'}")

if __name__ == "__main__":
    main()
