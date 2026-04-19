import os
import json
import shutil
from pathlib import Path

# Setup paths
PROJECT_ROOT = Path("/Users/okgoogle13/Projects/careercopilot")
SRC_IMG1 = "/Users/okgoogle13/.gemini/antigravity/brain/fd033b74-0bce-416c-92b0-a93e25f25a03/textless_protest_tram_1776554332811.png"
SRC_IMG2 = "/Users/okgoogle13/.gemini/antigravity/brain/fd033b74-0bce-416c-92b0-a93e25f25a03/textless_deity_poster_1776554348096.png"

DEST_DIR1 = PROJECT_ROOT / "frontend" / "public" / "assets" / "uncategorized"
DEST_DIR2 = PROJECT_ROOT / "frontend" / "public" / "assets" / "kr-solidarity" / "devotional"

FILE1 = "kr-solidarity__uncategorized__uncategorized--textless-protest-tram--v1.png"
FILE2 = "kr-solidarity__spiritual__devotional--textless-deity-poster--v1.png"

MANIFEST_FILE = PROJECT_ROOT / "frontend" / "public" / "assets" / "kerala-rage-kr-solidarity-manifest.json"
REGISTRY_FILE = PROJECT_ROOT / "frontend" / "public" / "assets" / "kr-solidarity-hero-registry.json"

def main():
    # 1. Copy and rename images
    DEST_DIR1.mkdir(parents=True, exist_ok=True)
    DEST_DIR2.mkdir(parents=True, exist_ok=True)

    if os.path.exists(SRC_IMG1):
        shutil.copy2(SRC_IMG1, DEST_DIR1 / FILE1)
    if os.path.exists(SRC_IMG2):
        shutil.copy2(SRC_IMG2, DEST_DIR2 / FILE2)

    # 2. Update Manifest
    if MANIFEST_FILE.exists():
        with open(MANIFEST_FILE, "r") as f:
            manifest = json.load(f)

        manifest["assets"].extend([
            {
              "id": "KR-SOLID-096",
              "name": "Hero Textless-protest-tram V1",
              "category": "uncategorized",
              "layer": "uncategorized",
              "aspect_ratio": "16:9",
              "file_path": f"/assets/uncategorized/{FILE1}",
              "priority": "HIGH",
              "semantics": {
                "functional_role": "editorial-hero",
                "semantic_weight": "heroic",
                "layering_role": "foreground"
              },
              "usage_rules": {
                "scale_suitability": ["hero-only", "feature"],
                "small_ui_safe": False
              },
              "layering_compatibility": {
                "can_overlay_with": ["substrate", "atmospheric"],
                "cannot_overlay_with": ["resistance", "spiritual", "uncategorized"]
              }
            },
            {
              "id": "KR-SOLID-097",
              "name": "Devotional Textless-deity-poster V1",
              "category": "spiritual",
              "layer": "spiritual",
              "aspect_ratio": "16:9",
              "file_path": f"/assets/kr-solidarity/devotional/{FILE2}",
              "priority": "CRITICAL",
              "semantics": {
                "functional_role": "symbolic-anchor",
                "semantic_weight": "mythic",
                "layering_role": "foreground-dominant"
              },
              "usage_rules": {
                "scale_suitability": ["hero-only", "large-section"],
                "small_ui_safe": False
              },
              "layering_compatibility": {
                "can_overlay_with": ["substrate", "atmospheric"],
                "cannot_overlay_with": ["spiritual", "resistance"]
              }
            }
        ])
        manifest["total_assets"] = len(manifest["assets"])

        with open(MANIFEST_FILE, "w") as f:
            json.dump(manifest, f, indent=2)

    # 3. Update Registry
    if REGISTRY_FILE.exists():
        with open(REGISTRY_FILE, "r") as f:
            registry = json.load(f)

        new_comp1 = {
          "id": "textless-protest-hero",
          "name": "Textless Protest Hero (Uncategorised)",
          "description": "Uncategorised textless protest cinematic tram scene",
          "layers": [
            {
              "type": "uncategorized",
              "asset_id": "KR-SOLID-096",
              "z_index": 1,
              "opacity": 1.0,
              "blend_mode": "normal",
              "position": "cover"
            }
          ],
          "typography": {
            "headline": "Solidarity",
            "supporting": "People Power",
            "pressure_state": {"wght": 900, "wdth": 75},
            "solidarity_state": {"wght": 800, "wdth": 120},
            "melancholy_state": {"wght": 475, "wdth": 97.5}
          },
          "motion": {
            "bezier": [0.34, 1.56, 0.64, 1],
            "scroll_wght_range": [300, 800],
            "transition_duration": 400
          }
        }

        new_comp2 = {
          "id": "textless-deity-hero",
          "name": "Textless Deity Hero",
          "description": "Categorised textless spiritual deity abstract poster",
          "layers": [
            {
              "type": "spiritual",
              "asset_id": "KR-SOLID-097",
              "z_index": 1,
              "opacity": 1.0,
              "blend_mode": "normal",
              "position": "cover"
            }
          ],
          "typography": {
            "headline": "Intersectional Resistance",
            "supporting": "Cultural Roots, Global Struggle",
            "pressure_state": {"wght": 900, "wdth": 75},
            "solidarity_state": {"wght": 800, "wdth": 120},
            "melancholy_state": {"wght": 475, "wdth": 97.5}
          },
          "motion": {
            "bezier": [0.34, 1.56, 0.64, 1],
            "scroll_wght_range": [300, 800],
            "transition_duration": 400
          }
        }

        registry["compositions"].extend([new_comp1, new_comp2])

        with open(REGISTRY_FILE, "w") as f:
            json.dump(registry, f, indent=2)

    print("Successfully processed assets!")

if __name__ == "__main__":
    main()
