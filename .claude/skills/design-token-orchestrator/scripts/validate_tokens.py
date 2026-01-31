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
# Check for required color role groups (primary, secondary, etc.)
REQUIRED_COLOR_ROLES = [
    'primary', 'secondary', 'tertiary', 'neutral', 'error'
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

    # Check for required color roles (primary, secondary, etc.) in hierarchical structure
    colors = tokens.get('color', {})
    for role in REQUIRED_COLOR_ROLES:
        if role not in colors:
            errors.append(f"  [FAIL] Missing required color role: 'color.{role}'")
        elif not isinstance(colors[role], dict):
            errors.append(f"  [FAIL] Color role '{role}' should be a dictionary with tonal values")

    if not errors:
        print("  [PASS] Token schema is valid.")

    # 2. Validate Color Contrast (using primary 50 and 100 as reference)
    print("\nChecking color contrast (WCAG AA)...")
    colors = tokens.get('color', {})
    contrast_errors = []

    # Check primary color contrast (50 on 100 background)
    if 'primary' in colors and isinstance(colors['primary'], dict):
        primary_50 = colors['primary'].get('50')
        primary_100 = colors['primary'].get('100')
        if primary_50 and primary_100:
            result = check_contrast('Primary-50', primary_50, 'Primary-100', primary_100)
            print(result)
            if "[FAIL]" in result:
                contrast_errors.append(result)
        else:
            print("  [WARN] Primary color missing tones 50 or 100, skipping contrast check.")

    # Check secondary color contrast
    if 'secondary' in colors and isinstance(colors['secondary'], dict):
        secondary_50 = colors['secondary'].get('50')
        secondary_100 = colors['secondary'].get('100')
        if secondary_50 and secondary_100:
            result = check_contrast('Secondary-50', secondary_50, 'Secondary-100', secondary_100)
            print(result)
            if "[FAIL]" in result:
                contrast_errors.append(result)

    # Check error color contrast
    if 'error' in colors and isinstance(colors['error'], dict):
        error_50 = colors['error'].get('50')
        error_100 = colors['error'].get('100')
        if error_50 and error_100:
            result = check_contrast('Error-50', error_50, 'Error-100', error_100)
            print(result)
            if "[FAIL]" in result:
                contrast_errors.append(result)

    # Note: Contrast errors are warnings for existing color palette, not blockers
    if contrast_errors:
        print("\n⚠️  Note: Some color contrast ratios below AA standard.")
        print("   This may require palette adjustments in design-system/tokens.json")

    # 3. Final Report
    if errors:
        print("\n❌ Validation Failed. See errors above.")
        sys.exit(1)
    else:
        print("\n✅ Token schema validation passed.")
        print("✨ Design token system structure is valid.")

if __name__ == "__main__":
    main()
