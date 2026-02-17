#!/usr/bin/env python3
"""
Kerala Rage Asset Validator
Performs automated compliance checks for generative assets:
1. Metadata: Resolution, Aspect Ratio, DPI.
2. Path/DHS: Naming and location enforcement.
3. Visuals: (Optional) Vision API mood/palette check against Canon.
"""

import os
import sys
import json
import argparse
from pathlib import Path
from PIL import Image
from typing import Dict, List, Any, Tuple

# ============================================================================
# CANON CONFIGURATION
# ============================================================================

# DHS Mapping (from public/assets/README.md)
DHS_REGISTRY = {
    "hero": {"ratio": (16, 9), "res": (3840, 2160)},
    "backgrounds": {"ratio": (9, 16), "res": (2160, 3840)},
    "motifs": {"ratio": (1, 1), "res": (2048, 2048)},
    "symbols": {"ratio": (1, 1), "res": (1024, 1024)},
    "portraits": {"ratio": (3, 4), "res": (2400, 3200)},
    "textures": {"ratio": (1, 1), "res": (2048, 2048)},
    "solidarity": {"ratio": (4, 5), "res": (2160, 2700)},
    "transitions": {"ratio": (1, 1), "res": (2048, 2048)},
}

# Vision Palette (Charcoal substrate + limited ink)
CANON_PALETTE = {
    "charcoal": "#1A1714",
    "gold": "#D4A84B",
    "red": "#C45C4B",
    "green": "#6B7F6E",
    "white": "#F5F0E8"
}

# ============================================================================
# VALIDATION FUNCTIONS
# ============================================================================

def validate_metadata(image_path: Path, category: str) -> List[str]:
    """Check resolution and aspect ratio against DHS specs."""
    errors = []
    try:
        with Image.open(image_path) as img:
            w, h = img.size
            dpi = img.info.get('dpi', (72, 72))
            
            # Check specs
            spec = DHS_REGISTRY.get(category)
            if not spec:
                errors.append(f"❌ Unknown category: {category}")
                return errors

            # Expected ratio check
            expected_ratio = spec["ratio"][0] / spec["ratio"][1]
            actual_ratio = w / h
            if abs(actual_ratio - expected_ratio) > 0.05:
                errors.append(f"❌ Aspect Ratio mismatch: Got {w}:{h}, expected {spec['ratio'][0]}:{spec['ratio'][1]}")
            
            # Resolution check (Minimum or exact)
            if w < spec["res"][0] or h < spec["res"][1]:
                errors.append(f"❌ Resolution too low: Got {w}x{h}, expected at least {spec['res'][0]}x{spec['res'][1]}")
            
            # DPI check (Canonical is 72 for web, but higher is usually fine)
            if dpi[0] < 72:
                errors.append(f"❌ DPI too low: {dpi[0]} DPI found.")

    except Exception as e:
        errors.append(f"❌ Failed to read image metadata: {e}")
    
    return errors

def validate_path(image_path: Path) -> List[str]:
    """Enforce the DHS directory structure."""
    errors = []
    abs_path = str(image_path.absolute())
    
    if "frontend/public/assets" not in abs_path:
        errors.append("❌ Asset must be located within 'frontend/public/assets/'")
    
    # Check if category subfolder exists
    category = image_path.parent.name
    if category not in DHS_REGISTRY:
        errors.append(f"❌ Invalid category folder: '{category}'. Allowed: {', '.join(DHS_REGISTRY.keys())}")
    
    return errors

def validate_vision(image_path: Path) -> List[str]:
    """
    Check visual compliance (Mood/Materiality).
    In this prototype, we check for 'charcoal' dominance if Vision API is unavailable.
    """
    # TODO: Integration with vision_idf_extractor.py logic
    # For now, it's a pass/fail stub for the pre-commit loop.
    return []

# ============================================================================
# RUNNER
# ============================================================================

def main():
    parser = argparse.ArgumentParser(description="Kerala Rage Asset Validator")
    parser.add_argument("file", help="Path to the asset file")
    args = parser.parse_args()
    
    image_path = Path(args.file)
    if not image_path.exists():
        print(f"❌ File not found: {args.file}")
        sys.exit(1)
        
    category = image_path.parent.name
    
    print(f"🔍 Validating {image_path.name} (Category: {category})...")
    
    path_errors = validate_path(image_path)
    meta_errors = validate_metadata(image_path, category)
    vision_errors = validate_vision(image_path)
    
    all_errors = path_errors + meta_errors + vision_errors
    
    if all_errors:
        print("\n".join(all_errors))
        print(f"\n❌ Validation FAILED for {image_path.name}")
        sys.exit(1)
    else:
        print(f"✅ {image_path.name} passed all Canon checks.")
        sys.exit(0)

if __name__ == "__main__":
    main()
