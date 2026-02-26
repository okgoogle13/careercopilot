#!/usr/bin/env python3
"""
Flash Sidekick MCP Wrapper - Batch Visual Analysis
Routes 20+ images to Flash Sidekick for token-efficient cataloging.
"""

import json
import sys
from pathlib import Path
from typing import Any

SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}


def prepare_batch_payload(image_paths: list[Path], manifest_path: Path) -> dict[str, Any]:
    """Generate Flash Sidekick batch analysis request payload."""
    return {
        "operation": "batch_visual_catalog",
        "manifest_reference": str(manifest_path),
        "mode": "kerala-rage-solidarity",
        "images": [{"path": str(path), "filename": path.name} for path in image_paths],
        "analysis_requirements": [
            "subject_identification",
            "solidarity_mode_compliance",
            "category_assignment (abstract/devotional/resistance/cultural/texture/ui-kit)",
            "doc008_gap_matching",
            "size_estimation",
            "color_token_alignment (--sys-color-*)",
        ],
    }


def should_use_flash_sidekick(image_count: int) -> bool:
    """Determine if batch warrants MCP routing."""
    return image_count >= 20


def validate_inputs(manifest_path: Path, raw_image_paths: list[str]) -> tuple[list[Path], list[dict[str, str]]]:
    """Validate manifest and image inputs; return valid image paths and skipped records."""
    if not manifest_path.exists():
        raise FileNotFoundError(f"Manifest not found: {manifest_path}")

    valid_paths: list[Path] = []
    skipped: list[dict[str, str]] = []

    for raw_path in raw_image_paths:
        candidate = Path(raw_path)
        if not candidate.exists():
            skipped.append({"path": raw_path, "reason": "missing_file"})
            continue
        if candidate.suffix.lower() not in SUPPORTED_EXTENSIONS:
            skipped.append({"path": raw_path, "reason": "unsupported_extension"})
            continue
        valid_paths.append(candidate)

    return valid_paths, skipped


def main() -> None:
    if len(sys.argv) < 3:
        print("Usage: flash_batch.py MANIFEST_PATH IMAGE1 [IMAGE2 ...]")
        sys.exit(1)

    manifest_path = Path(sys.argv[1])
    image_args = sys.argv[2:]

    try:
        valid_images, skipped = validate_inputs(manifest_path, image_args)
    except FileNotFoundError as exc:
        print(f"Error: {exc}")
        sys.exit(1)

    if not valid_images:
        print("No valid images supplied for Flash batch analysis.")
        if skipped:
            print(json.dumps({"skipped": skipped}, indent=2))
        sys.exit(1)

    if not should_use_flash_sidekick(len(valid_images)):
        print(f"Only {len(valid_images)} valid images. Use direct cataloging for <20.")
        if skipped:
            print(json.dumps({"skipped": skipped}, indent=2))
        sys.exit(1)

    payload = prepare_batch_payload(valid_images, manifest_path)
    if skipped:
        payload["skipped"] = skipped

    print(f"Routing {len(valid_images)} images to Flash Sidekick MCP")
    print(json.dumps(payload, indent=2))
    print("\nCall: flash-sidekick:batch_file_analysis with above payload")


if __name__ == "__main__":
    main()
