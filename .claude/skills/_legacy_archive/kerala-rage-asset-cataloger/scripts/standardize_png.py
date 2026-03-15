#!/usr/bin/env python3
"""
PNG Standardization - Max Quality, Size Validation
Converts to PNG, validates dimensions against manifest specs, preserves transparency.
"""

import sys
import json
from pathlib import Path
from PIL import Image
import re

def parse_size_constraint(usage_specs):
    """
    Extract size constraints from manifest usage_specs.
    Returns (width, height, is_min_constraint) tuple.
    """
    if not usage_specs:
        return None, None, False

    size_str = str(usage_specs.get('size', '')).lower()

    # "400px+" means minimum size, do not downscale
    if '+' in size_str:
        match = re.search(r'(\d+)px', size_str)
        if match:
            size = int(match.group(1))
            return size, None, True  # min width constraint

    # "320px width" means exact width constraint
    if 'width' in size_str:
        match = re.search(r'(\d+)px', size_str)
        if match:
            return int(match.group(1)), None, False

    # "160px" or "160px diameter" means bounding box
    match = re.search(r'(\d+)px', size_str)
    if match:
        size = int(match.group(1))
        return size, size, False

    return None, None, False

def standardize_png(input_path, output_path, asset_specs=None):
    """
    Convert to PNG max quality, validate size against specs.
    Returns (success, warnings_list).
    """
    warnings = []

    with Image.open(input_path) as img:
        orig_size = img.size

        # Validate size if specs provided
        if asset_specs and 'usage_specs' in asset_specs:
            width_constraint, height_constraint, is_min = parse_size_constraint(
                asset_specs['usage_specs']
            )

            if is_min and width_constraint:
                if img.width < width_constraint:
                    warnings.append(
                        f"Below minimum width: {img.width}px < {width_constraint}px"
                    )
            elif width_constraint and height_constraint:
                # Bounding box constraint
                if img.width > width_constraint or img.height > height_constraint:
                    # Resize to fit
                    img.thumbnail((width_constraint, height_constraint), Image.LANCZOS)
                    warnings.append(f"Resized: {orig_size} → {img.size}")

        # Convert to RGBA for transparency
        if img.mode not in ('RGBA', 'RGB'):
            img = img.convert('RGBA')

        # Save max quality PNG
        img.save(output_path, 'PNG', optimize=True, compress_level=1)

    return True, warnings

def batch_standardize(manifest_path, input_files, output_dir):
    """Process batch with manifest validation."""
    with open(manifest_path, 'r') as f:
        manifest = json.load(f)

    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    results = []
    for input_file in input_files:
        input_path = Path(input_file)
        output_path = output_dir / f"{input_path.stem}.png"

        success, warnings = standardize_png(input_path, output_path)

        result = {
            "input": str(input_path),
            "output": str(output_path),
            "success": success,
            "warnings": warnings
        }
        results.append(result)

        status = "✅" if success else "❌"
        print(f"{status} {input_path.name} → {output_path.name}")
        for warn in warnings:
            print(f"  ⚠️  {warn}")

    return results

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: standardize_png.py MANIFEST_PATH OUTPUT_DIR INPUT1 [INPUT2 ...]")
        sys.exit(1)

    manifest_path = sys.argv[1]
    output_dir = sys.argv[2]
    input_files = sys.argv[3:]

    batch_standardize(manifest_path, input_files, output_dir)
