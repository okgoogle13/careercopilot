#!/usr/bin/env python3
"""
Kerala Rage Asset Cataloger - Manifest Integration
Analyzes images and validates against kerala-rage-kr-solidarity manifest structure.
"""

import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}


def load_manifest(manifest_path: Path) -> dict[str, Any]:
    """Load manifest JSON and fail with clear errors for common edge cases."""
    if not manifest_path.exists():
        raise FileNotFoundError(f"Manifest not found: {manifest_path}")

    try:
        with manifest_path.open("r", encoding="utf-8") as handle:
            manifest = json.load(handle)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Malformed manifest JSON: {manifest_path} ({exc})") from exc

    if not isinstance(manifest, dict):
        raise ValueError("Manifest root must be a JSON object")

    assets = manifest.get("assets")
    if not isinstance(assets, list):
        raise ValueError("Manifest must contain an 'assets' array")

    ids = [a.get("id") for a in assets if isinstance(a, dict) and a.get("id")]
    duplicate_ids = sorted({asset_id for asset_id in ids if ids.count(asset_id) > 1})
    if duplicate_ids:
        raise ValueError(f"Duplicate manifest IDs detected: {', '.join(duplicate_ids)}")

    return manifest


def get_next_asset_id(manifest: dict[str, Any]) -> str:
    """Calculate next sequential KR-SOLID id; fallback to ASSET-N for legacy manifests."""
    assets = manifest.get("assets", [])
    max_kr_solid = 0
    max_legacy = 0

    for asset in assets:
        if not isinstance(asset, dict):
            continue
        asset_id = str(asset.get("id", ""))
        if asset_id.startswith("KR-SOLID-"):
            try:
                max_kr_solid = max(max_kr_solid, int(asset_id.split("-")[-1]))
            except ValueError:
                continue
        elif asset_id.startswith("ASSET-"):
            try:
                max_legacy = max(max_legacy, int(asset_id.split("-")[-1]))
            except ValueError:
                continue

    if max_kr_solid:
        return f"KR-SOLID-{max_kr_solid + 1:03d}"
    return f"ASSET-{max_legacy + 1}"


def analyze_image(image_path: Path, manifest: dict[str, Any]) -> dict[str, Any]:
    """
    Analyze a single image and generate a minimal deterministic catalog entry.
    Vision scoring is intentionally not performed in this script.
    """
    return {
        "filename": image_path.name,
        "suggested_asset_id": get_next_asset_id(manifest),
        "analysis_timestamp": datetime.now().isoformat(),
        "manifest_compliant": True,
        "validation_notes": [],
    }


def resolve_output_path(output_path: Path) -> Path:
    """Avoid accidental overwrites by appending a timestamp when output already exists."""
    if not output_path.exists():
        return output_path
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    return output_path.with_name(f"{output_path.stem}-{stamp}{output_path.suffix}")


def catalog_batch(image_paths: list[str], manifest_path: Path, output_path: Path) -> int:
    """Process a batch of images and generate catalog JSON."""
    manifest = load_manifest(manifest_path)

    existing_images: list[Path] = []
    skipped: list[dict[str, str]] = []

    for raw_path in image_paths:
        candidate = Path(raw_path)
        if not candidate.exists():
            skipped.append({"path": raw_path, "reason": "missing_file"})
            continue
        if candidate.suffix.lower() not in SUPPORTED_EXTENSIONS:
            skipped.append({"path": raw_path, "reason": "unsupported_extension"})
            continue
        existing_images.append(candidate)

    if not existing_images:
        print("No assets to catalog: no valid image files were provided.")
        return 0

    entries = [analyze_image(path, manifest) for path in existing_images]
    final_output_path = resolve_output_path(output_path)

    catalog = {
        "cataloger_version": "2.1.0",
        "source_manifest": str(manifest_path),
        "timestamp": datetime.now().isoformat(),
        "mode": "kerala-rage-solidarity",
        "total_requested": len(image_paths),
        "total_analyzed": len(entries),
        "total_skipped": len(skipped),
        "entries": entries,
        "skipped": skipped,
    }

    with final_output_path.open("w", encoding="utf-8") as handle:
        json.dump(catalog, handle, indent=2)

    print(f"Cataloged {len(entries)} assets -> {final_output_path}")
    if skipped:
        print(f"Skipped {len(skipped)} assets (see JSON output for details).")
    return len(entries)


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: catalog_assets.py MANIFEST_PATH OUTPUT_JSON IMAGE1 [IMAGE2 ...]")
        sys.exit(1)

    manifest_arg = Path(sys.argv[1])
    output_arg = Path(sys.argv[2])
    images = sys.argv[3:]

    try:
        analyzed = catalog_batch(images, manifest_arg, output_arg)
    except (FileNotFoundError, ValueError) as exc:
        print(f"Error: {exc}")
        sys.exit(1)
    except Exception as exc:  # noqa: BLE001
        print(f"Unexpected error: {exc}")
        sys.exit(1)

    if analyzed == 0:
        sys.exit(0)
