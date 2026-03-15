#!/usr/bin/env python3
"""
Flash Sidekick MCP Wrapper - Batch Visual Analysis
Routes 20+ images to Gemini Flash for token-efficient cataloging.
"""

import json
import sys
from pathlib import Path

def prepare_batch_payload(image_paths, manifest_path):
    """
    Generate Flash Sidekick batch analysis request.
    Each image gets analyzed for: subject, mode, category, compliance.
    """
    payload = {
        "operation": "batch_visual_catalog",
        "manifest_reference": str(manifest_path),
        "images": [
            {
                "path": str(p),
                "filename": Path(p).name
            }
            for p in image_paths
        ],
        "analysis_requirements": [
            "subject_identification",
            "mode_classification (gallery/laboratory/both)",
            "category_assignment (plate/fauna/texture/[DEPRECATED_STYLE]/ui)",
            "doc008_gap_matching",
            "size_estimation",
            "color_palette_extraction"
        ]
    }
    return payload

def should_use_flash_sidekick(image_count):
    """Determine if batch warrants MCP routing."""
    return image_count >= 20

def main():
    if len(sys.argv) < 3:
        print("Usage: flash_batch.py MANIFEST_PATH IMAGE1 [IMAGE2 ...]")
        sys.exit(1)

    manifest_path = sys.argv[1]
    image_paths = sys.argv[2:]

    if should_use_flash_sidekick(len(image_paths)):
        print(f"📤 Routing {len(image_paths)} images to Flash Sidekick MCP")
        payload = prepare_batch_payload(image_paths, manifest_path)
        print(json.dumps(payload, indent=2))
        print("\n💡 Call: flash-sidekick:batch_file_analysis with above payload")
    else:
        print(f"⚠️  Only {len(image_paths)} images. Use direct cataloging for <20.")
        sys.exit(1)

if __name__ == "__main__":
    main()
