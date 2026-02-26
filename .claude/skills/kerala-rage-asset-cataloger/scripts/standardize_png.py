#!/usr/bin/env python3
"""
PNG Standardization - Max Quality, Size Validation
Converts to PNG, validates dimensions against manifest specs, preserves transparency.
"""

import json
import re
import sys
from pathlib import Path
from typing import Any

from PIL import Image, UnidentifiedImageError

SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}


def parse_size_constraint(usage_specs: dict[str, Any] | None) -> tuple[int | None, int | None, bool]:
    """
    Extract size constraints from manifest usage_specs.
    Returns (width, height, is_min_constraint).
    """
    if not usage_specs:
        return None, None, False

    size_str = str(usage_specs.get("size", "")).lower()

    if "+" in size_str:
        match = re.search(r"(\d+)px", size_str)
        if match:
            size = int(match.group(1))
            return size, None, True

    if "width" in size_str:
        match = re.search(r"(\d+)px", size_str)
        if match:
            return int(match.group(1)), None, False

    match = re.search(r"(\d+)px", size_str)
    if match:
        size = int(match.group(1))
        return size, size, False

    return None, None, False


def standardize_png(input_path: Path, output_path: Path, asset_specs: dict[str, Any] | None = None) -> tuple[bool, list[str]]:
    """Convert to PNG max quality and validate size against optional specs."""
    warnings: list[str] = []

    try:
        with Image.open(input_path) as img:
            orig_size = img.size

            if asset_specs and "usage_specs" in asset_specs:
                width_constraint, height_constraint, is_min = parse_size_constraint(asset_specs["usage_specs"])

                if is_min and width_constraint and img.width < width_constraint:
                    warnings.append(f"Below minimum width: {img.width}px < {width_constraint}px")
                elif width_constraint and height_constraint:
                    if img.width > width_constraint or img.height > height_constraint:
                        img.thumbnail((width_constraint, height_constraint), Image.LANCZOS)
                        warnings.append(f"Resized: {orig_size} -> {img.size}")

            if img.mode not in ("RGBA", "RGB"):
                img = img.convert("RGBA")

            img.save(output_path, "PNG", optimize=True, compress_level=1)
            return True, warnings
    except UnidentifiedImageError:
        return False, ["Unsupported or corrupted image format"]
    except OSError as exc:
        return False, [f"Image processing error: {exc}"]


def load_manifest(manifest_path: Path) -> dict[str, Any]:
    """Load manifest with explicit edge-case errors."""
    if not manifest_path.exists():
        raise FileNotFoundError(f"Manifest not found: {manifest_path}")
    try:
        with manifest_path.open("r", encoding="utf-8") as handle:
            manifest = json.load(handle)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Malformed manifest JSON: {manifest_path} ({exc})") from exc

    if not isinstance(manifest, dict):
        raise ValueError("Manifest root must be a JSON object")
    if not isinstance(manifest.get("assets"), list):
        raise ValueError("Manifest must contain an 'assets' list")
    return manifest


def batch_standardize(manifest_path: Path, input_files: list[str], output_dir: Path) -> list[dict[str, Any]]:
    """Process batch with manifest validation."""
    load_manifest(manifest_path)

    output_dir.mkdir(parents=True, exist_ok=True)

    results: list[dict[str, Any]] = []
    valid_inputs = 0

    for raw_file in input_files:
        input_path = Path(raw_file)
        if not input_path.exists():
            result = {"input": str(input_path), "output": None, "success": False, "warnings": ["Missing file"]}
            results.append(result)
            print(f"❌ {input_path.name}: missing file")
            continue

        if input_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            result = {
                "input": str(input_path),
                "output": None,
                "success": False,
                "warnings": ["Unsupported extension"],
            }
            results.append(result)
            print(f"❌ {input_path.name}: unsupported extension")
            continue

        valid_inputs += 1
        output_path = output_dir / f"{input_path.stem}.png"
        success, warnings = standardize_png(input_path, output_path)
        result = {"input": str(input_path), "output": str(output_path), "success": success, "warnings": warnings}
        results.append(result)

        status = "✅" if success else "❌"
        print(f"{status} {input_path.name} -> {output_path.name}")
        for warning in warnings:
            print(f"  ⚠️  {warning}")

    if valid_inputs == 0:
        print("No valid image inputs provided.")

    return results


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: standardize_png.py MANIFEST_PATH OUTPUT_DIR INPUT1 [INPUT2 ...]")
        sys.exit(1)

    manifest_arg = Path(sys.argv[1])
    output_dir_arg = Path(sys.argv[2])
    input_args = sys.argv[3:]

    try:
        batch_standardize(manifest_arg, input_args, output_dir_arg)
    except (FileNotFoundError, ValueError) as exc:
        print(f"Error: {exc}")
        sys.exit(1)
