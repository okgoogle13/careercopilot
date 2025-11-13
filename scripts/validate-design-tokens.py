#!/usr/bin/env python3
# scripts/validate-design-tokens.py
import json
import os
import sys

# Install this lib: pip install wcag-contrast-ratio
try:
    import wcag_contrast_ratio as contrast
except ImportError:
    print("Error: 'wcag-contrast-ratio' library not found.")
    print("Please install it: pip install wcag-contrast-ratio")
    sys.exit(1)

TOKEN_SOURCE_FILE = 'design-system/tokens.json'
# A simple schema to ensure the generator skill didn't miss anything
TOKEN_SCHEMA = [
    'color', 'shape', 'spacing', 'elevation', 'typography'
]
COLOR_SCHEMA = [
    'surface', 'primary', 'container', 'onPrimary', 'onSurface', 'onContainer'
]

def hex_to_rgb(hex_code):
    """Converts #RRGGBB to (r, g, b) tuple."""
    hex_code = hex_code.lstrip('#')
    if len(hex_code) != 6:
        raise ValueError(f"Invalid hex code: {hex_code}")
    return tuple(int(hex_code[i:i+2], 16) / 255.0 for i in (0, 2, 4))

def check_contrast(name_a, color_a, name_b, color_b):
    """Checks contrast and returns an error message if it fails."""
    try:
        rgb_a = hex_to_rgb(color_a)
        rgb_b = hex_to_rgb(color_b)
        ratio = contrast.rgb(rgb_a, rgb_b)

        if ratio < 4.5:
            return f"  [FAIL] {name_a} ({color_a}) on {name_b} ({color_b}) - Ratio: {ratio:.2f} (Needs 4.5:1)"
        return f"  [PASS] {name_a} on {name_b} - Ratio: {ratio:.2f}"
    except ValueError as e:
        return f"  [FAIL] Invalid color code: {e}"
    except Exception as e:
        return f"  [FAIL] Error checking {name_a}/{name_b}: {e}"


def main():
    print(f"Validating design tokens from {TOKEN_SOURCE_FILE}...")
    if not os.path.exists(TOKEN_SOURCE_FILE):
        print(f"Error: Token source file not found at {TOKEN_SOURCE_FILE}")
        print("Run the 'design-token-generator' skill first.")
        sys.exit(1)

    with open(TOKEN_SOURCE_FILE, 'r') as f:
        try:
            tokens = json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error: Invalid JSON in token file. {e}")
            sys.exit(1)

    errors = []

    # 1. Validate Schema Structure
    print("Checking token schema...")
    for key in TOKEN_SCHEMA:
        if key not in tokens:
            errors.append(f"  [FAIL] Missing top-level key: '{key}'")

    for key in COLOR_SCHEMA:
        if key not in tokens.get('color', {}):
             errors.append(f"  [FAIL] Missing required color token: 'color.{key}'")

    if not errors:
        print("  [PASS] Token schema is valid.")

    # 2. Validate Color Contrast
    print("\nChecking color contrast (WCAG AA)...")
    colors = tokens.get('color', {})
    contrast_errors = []

    # Define pairs to check
    pairs_to_check = {
        'onPrimary': 'primary',
        'onSurface': 'surface',
        'onContainer': 'container',
        # Add optional pairs
        'onSecondary': 'secondary',
    }

    for fg_key, bg_key in pairs_to_check.items():
        if fg_key in colors and bg_key in colors:
            result = check_contrast(fg_key, colors[fg_key], bg_key, colors[bg_key])
            print(result)
            if "[FAIL]" in result:
                contrast_errors.append(result)
        else:
            if fg_key not in colors:
                print(f"  [WARN] Optional token 'color.{fg_key}' missing, skipping check.")
            if bg_key not in colors:
                print(f"  [WARN] Optional token 'color.{bg_key}' missing, skipping check.")


    errors.extend(contrast_errors)

    # 3. Final Report
    if errors:
        print("\n❌ Validation Failed. See errors above.")
        sys.exit(1)
    else:
        print("\n✅ All validations passed.")
        print("✨ Design token system is valid and compliant.")

if __name__ == "__main__":
    main()
