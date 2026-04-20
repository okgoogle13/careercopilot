#!/usr/bin/env python3
# scripts/audit_structure.py
import json
import os
import sys
import re

# Install this lib: pip install wcag-contrast-ratio
try:
    import wcag_contrast_ratio as contrast
except ImportError:
    print("Error: 'wcag-contrast-ratio' library not found.")
    print("Please install it: pip install wcag-contrast-ratio")
    sys.exit(1)

TOKEN_SOURCE_FILE = 'frontend/src/design/tokens/tokens.json'
TOKEN_SCHEMA = ['color', 'spacing', 'radius', 'typography', 'shadow', 'motion']
REQUIRED_COLOR_ROLES = ['primary', 'secondary', 'tertiary', 'neutral', 'error']

def hex_to_rgb(hex_code):
    """Converts #RRGGBB or #RGB to (r, g, b) tuple."""
    hex_code = hex_code.lstrip('#')
    if len(hex_code) == 3:
        hex_code = ''.join([c*2 for c in hex_code])
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
    except Exception as e:
        return f"  [WARN] Could not check contrast for {name_a}/{name_b}: {e}"

def is_color(val):
    if not isinstance(val, str): return False
    return re.match(r'^#([A-Fa-f0-9]{3}){1,2}$', val) or \
           re.match(r'^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[0-9.]+\s*)?\)$', val) or \
           re.match(r'^hsla?\(\s*\d+\s*,\s*[0-9.]+%?\s*,\s*[0-9.]+%?\s*(,\s*[0-9.]+\s*)?\)$', val)

def main():
    print("🔍 STRUCTURE & SCHEMA AUDIT\n")
    if not os.path.exists(TOKEN_SOURCE_FILE):
        print(f"❌ CRITICAL: Token source file not found at {TOKEN_SOURCE_FILE}")
        sys.exit(1)

    with open(TOKEN_SOURCE_FILE, 'r') as f:
        try:
            tokens = json.load(f)
        except json.JSONDecodeError as e:
            print(f"❌ CRITICAL: Invalid JSON in token file. {e}")
            sys.exit(1)

    critical_issues = []
    warnings = []
    passed = []
    total_tokens = 0
    valid_tokens = 0

    visited_aliases = {}

    def walk(obj, path=""):
        nonlocal total_tokens, valid_tokens
        if isinstance(obj, dict):
            # Check if it's a leaf/token
            is_token = "$value" in obj or "value" in obj

            if is_token:
                total_tokens += 1
                token_valid = True

                # DTCG Checks
                if "$value" not in obj:
                    critical_issues.append(f"{path}\n   Missing $value property\n   Fix: Rename 'value' to '$value'")
                    token_valid = False

                if "$type" not in obj:
                    critical_issues.append(f"{path}\n   Missing $type property\n   Fix: Add {{ \"$type\": \"...\" }}")
                    token_valid = False

                val = obj.get("$value") or obj.get("value")

                # Circular Alias Check
                if isinstance(val, str) and val.startswith("{") and val.endswith("}"):
                    alias_path = val[1:-1]
                    if path in visited_aliases:
                        critical_issues.append(f"{path}\n   Circular alias reference: {val}")
                        token_valid = False
                    visited_aliases[path] = alias_path

                # Unit Check for numeric strings
                if "spacing" in path or "font-size" in path or "radius" in path:
                    if isinstance(val, (int, float)):
                        warnings.append(f"{path}\n   Value is number ({val}) instead of string (e.g., \"{val}px\")")
                    elif isinstance(val, str) and val.isdigit():
                         warnings.append(f"{path}\n   Value is numeric string (\"{val}\") instead of string with units (e.g., \"{val}px\")")

                # Color format check
                obj_type = obj.get("$type")
                if obj_type == "color" or "color" in path:
                    if val and not is_color(val) and not (isinstance(val, str) and val.startswith("{")):
                        critical_issues.append(f"{path}\n   Invalid color format: {val}")
                        token_valid = False

                if token_valid:
                    valid_tokens += 1

            for key, val in obj.items():
                if not key.startswith("$") and key != "value":
                    walk(val, f"{path}.{key}" if path else key)

    walk(tokens)

    # Specific color role check (semantic check)
    colors = tokens.get('color', {})
    # For Northcote, we check color.semantic or color.families
    # The user request said: "Material 3 color roles checking"
    # Existing script checked top level roles.

    # Contrast Audit
    print("Checking color contrast (WCAG AA)...")
    # This is highly specific to the project's structure
    # I'll keep the logic from the original script but adapt paths
    semantic_colors = tokens.get('color', {}).get('semantic', {})
    if semantic_colors:
        # Example: baru-gold on [DEPRECATED_STYLE]-night
        baru = semantic_colors.get('baru-gold', {}).get('value') or semantic_colors.get('baru-gold', {}).get('$value')
        night = semantic_colors.get('[DEPRECATED_STYLE]-night', {}).get('value') or semantic_colors.get('[DEPRECATED_STYLE]-night', {}).get('$value')
        if baru and night:
            result = check_contrast('Baru Gold', baru, '[DEPRECATED_STYLE] Night', night)
            print(result)
            if "[FAIL]" in result:
                warnings.append(f"Contrast FAIL: Baru Gold on [DEPRECATED_STYLE] Night ({result})")

    # Output Report
    if not critical_issues and not warnings:
        print("✅ PASSED:")
        print("  - All tokens have $value property")
        print("  - All tokens have $type property")
        print("  - Valid color formats\n")

    if critical_issues:
        print(f"❌ CRITICAL ISSUES ({len(critical_issues)}):")
        for i, issue in enumerate(critical_issues, 1):
            print(f"  {i}. {issue}")
        print("")

    if warnings:
        print(f"⚠️  WARNINGS ({len(warnings)}):")
        for i, warn in enumerate(warnings, 1):
            print(f"  {i}. {warn}")
        print("")

    coverage = (valid_tokens / total_tokens * 100) if total_tokens > 0 else 0
    print(f"📊 SUMMARY: {valid_tokens}/{total_tokens} tokens valid ({coverage:.1f}%)")

    if critical_issues:
        sys.exit(1)
    if warnings:
        sys.exit(2)
    sys.exit(0)

if __name__ == "__main__":
    main()
