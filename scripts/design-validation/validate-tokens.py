#!/usr/bin/env python3
"""
Enhanced Design Token Validator
Validates DTCG compliance, Kashmir Rage palette rules, circular references,
and consistency between tokens.json and generated CSS variables.

Exit codes:
  0 = All validations passed
  1 = One or more validations failed
"""
import json
import sys
import re
from pathlib import Path
from typing import Dict, List, Tuple, Set

# Configuration
TOKENS_FILE = Path("frontend/src/design/tokens/tokens.json")
CSS_FILE = Path("frontend/src/design/styles/design-tokens.css")

# Kerala Rage semantic color tokens that MUST exist
REQUIRED_SEMANTIC_COLORS = {
    "charcoalBackground": "#1A1A1A",
    "solidarityRed": "#F14714",
    "kr-charcoalRed": "#F14844",
    "kr-activistSmokeGreen": "#48DA8B",
    "signalGreen": "#48F0E5",
    "inkGold": "#DAF674",
    "stencilYellow": "#F6E748",
    "worker-ash": "#DAF6B3",
}

# Required typography families
REQUIRED_FONTS = {
    "primary": "Work Sans",
    "display": "Fraunces",
    "mono": "JetBrains Mono",
}

# Expected structure for each color token
EXPECTED_COLOR_STRUCTURE = ["base", "steps", "usage"]


def load_tokens(path: Path) -> Dict:
    """Load tokens from JSON file."""
    try:
        with open(path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ Error: Tokens file not found at {path}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON in {path}: {e}")
        sys.exit(1)


def load_css_variables(path: Path) -> Dict[str, str]:
    """Parse CSS variables from design-tokens.css."""
    css_vars = {}
    try:
        with open(path, "r") as f:
            content = f.read()
            # Match CSS custom property declarations: --var-name: value;
            matches = re.findall(r"--([a-zA-Z0-9_-]+):\s*([^;]+);", content)
            for name, value in matches:
                css_vars[f"--{name}"] = value.strip()
    except FileNotFoundError:
        print(f"❌ Error: CSS file not found at {path}")
        return {}
    return css_vars


def validate_dtcg_structure(tokens: Dict, path: str = "sys") -> List[str]:
    """Validate DTCG compliance ($value, $type fields)."""
    errors = []

    def traverse(node: Dict, current_path: str = ""):
        if isinstance(node, dict):
            if "$value" in node:
                # It's a token leaf
                if "$type" not in node:
                    errors.append(
                        f"Missing $type for token at {current_path} (has $value)"
                    )
            else:
                # It's a group; recurse
                for key, value in node.items():
                    if not key.startswith("$"):
                        new_path = f"{current_path}.{key}" if current_path else key
                        if isinstance(value, dict):
                            traverse(value, new_path)

    traverse(tokens.get("sys", tokens), path)
    return errors


def validate_semantic_colors(tokens: Dict) -> List[str]:
    """Validate that all required Kerala Rage semantic colors exist."""
    errors = []
    sys_colors = tokens.get("sys", {}).get("color", {})

    for color_name, expected_hex in REQUIRED_SEMANTIC_COLORS.items():
        if color_name not in sys_colors:
            errors.append(f"Missing required semantic color: {color_name}")
        else:
            color_token = sys_colors[color_name]
            # Check for base, steps, usage structure
            for structure in EXPECTED_COLOR_STRUCTURE:
                if structure not in color_token:
                    errors.append(
                        f"Color '{color_name}' missing required structure: {structure}"
                    )
            # Verify base value matches
            base_value = (
                color_token.get("base", {}).get("$value", "").upper()
            )
            if base_value != expected_hex.upper():
                errors.append(
                    f"Color '{color_name}' base value mismatch: got {base_value}, expected {expected_hex}"
                )

    return errors


def validate_typography(tokens: Dict) -> List[str]:
    """Validate required typography families."""
    errors = []
    sys_type = tokens.get("sys", {}).get("type", {})
    font_families = sys_type.get("fontFamilies", {})

    for font_key, expected_name in REQUIRED_FONTS.items():
        if font_key not in font_families:
            errors.append(f"Missing required font family: {font_key}")
        else:
            actual_name = font_families[font_key].get("$value", "")
            if actual_name != expected_name:
                errors.append(
                    f"Font '{font_key}' name mismatch: got '{actual_name}', expected '{expected_name}'"
                )

    return errors


def validate_circular_references(tokens: Dict) -> List[str]:
    """Check for circular references in token aliases."""
    errors = []
    visited = set()

    def check_alias(value: str, chain: Set[str]) -> bool:
        """Check if value is a reference and if it creates a cycle."""
        if not isinstance(value, str):
            return False
        # Simple pattern: var(--name) or similar
        if "var(" not in value:
            return False

        var_match = re.search(r"var\(--([^)]+)\)", value)
        if not var_match:
            return False

        var_name = var_match.group(1)
        if var_name in chain:
            return True  # Circular!
        return False

    def traverse(node: Dict, chain: Set[str] = None):
        if chain is None:
            chain = set()

        if isinstance(node, dict):
            if "$value" in node:
                if check_alias(str(node["$value"]), chain):
                    errors.append(f"Circular reference detected: {chain}")
            for key, value in node.items():
                if not key.startswith("$"):
                    new_chain = chain | {key}
                    if isinstance(value, dict):
                        traverse(value, new_chain)

    traverse(tokens.get("sys", {}))
    return errors


def validate_css_generation(tokens: Dict, css_vars: Dict[str, str]) -> List[str]:
    """Verify that all token colors are present in CSS variables."""
    errors = []
    sys_colors = tokens.get("sys", {}).get("color", {})

    for color_name, color_token in sys_colors.items():
        base_value = color_token.get("base", {}).get("$value", "")
        css_var_name = f"--sys-color-{color_name}-base"

        if css_var_name not in css_vars:
            errors.append(
                f"Missing CSS variable: {css_var_name} (base for {color_name})"
            )
        else:
            css_value = css_vars[css_var_name].upper()
            if base_value.upper() != css_value:
                errors.append(
                    f"CSS variable mismatch: {css_var_name} = {css_value}, expected {base_value.upper()}"
                )

        # Check tonal steps
        steps = color_token.get("steps", {}).get("$value", [])
        for i, step_hex in enumerate(steps):
            css_step_var = f"--sys-color-{color_name}-steps-{i}"
            if css_step_var not in css_vars:
                errors.append(
                    f"Missing CSS tonal step: {css_step_var} (step {i} for {color_name})"
                )
            else:
                css_step_value = css_vars[css_step_var].upper()
                if step_hex.upper() != css_step_value:
                    errors.append(
                        f"CSS step mismatch: {css_step_var} = {css_step_value}, expected {step_hex.upper()}"
                    )

        # Check usage metadata
        usage = color_token.get("usage", {}).get("$value", [])
        for i, usage_str in enumerate(usage):
            css_usage_var = f"--sys-color-{color_name}-usage-{i}"
            if css_usage_var not in css_vars:
                errors.append(
                    f"Missing CSS usage metadata: {css_usage_var}"
                )

    return errors


def main():
    """Run all validation checks."""
    print("🔍 Validating Design Tokens...\n")

    if not TOKENS_FILE.exists():
        print(f"⚠️  {TOKENS_FILE} not found. Skipping validation.")
        return 0

    tokens = load_tokens(TOKENS_FILE)
    css_vars = load_css_variables(CSS_FILE)

    all_errors = []

    # 1. DTCG Structure Validation
    print("1️⃣  Checking DTCG Compliance...")
    dtcg_errors = validate_dtcg_structure(tokens)
    if dtcg_errors:
        print("   ❌ DTCG Compliance Failures:")
        for err in dtcg_errors:
            print(f"      - {err}")
        all_errors.extend(dtcg_errors)
    else:
        print("   ✅ DTCG compliance passed")

    # 2. Semantic Colors Validation
    print("\n2️⃣  Checking Kerala Rage Semantic Colors...")
    color_errors = validate_semantic_colors(tokens)
    if color_errors:
        print("   ❌ Semantic Color Failures:")
        for err in color_errors:
            print(f"      - {err}")
        all_errors.extend(color_errors)
    else:
        print("   ✅ All required semantic colors present")

    # 3. Typography Validation
    print("\n3️⃣  Checking Typography System...")
    typo_errors = validate_typography(tokens)
    if typo_errors:
        print("   ❌ Typography Failures:")
        for err in typo_errors:
            print(f"      - {err}")
        all_errors.extend(typo_errors)
    else:
        print("   ✅ Typography system valid")

    # 4. Circular References
    print("\n4️⃣  Checking for Circular References...")
    circ_errors = validate_circular_references(tokens)
    if circ_errors:
        print("   ❌ Circular Reference Failures:")
        for err in circ_errors:
            print(f"      - {err}")
        all_errors.extend(circ_errors)
    else:
        print("   ✅ No circular references detected")

    # 5. CSS Generation Consistency
    print("\n5️⃣  Checking CSS Variable Consistency...")
    if not css_vars:
        print("   ⚠️  No CSS variables found. Run: node scripts/build-m3-tokens.py")
        all_errors.append("CSS file not generated or empty")
    else:
        css_errors = validate_css_generation(tokens, css_vars)
        if css_errors:
            print("   ❌ CSS Generation Failures:")
            for err in css_errors:
                print(f"      - {err}")
            all_errors.extend(css_errors)
        else:
            print("   ✅ CSS variables complete and consistent")

    # Summary
    print("\n" + "=" * 60)
    if all_errors:
        print(f"❌ Validation Failed ({len(all_errors)} error{'s' if len(all_errors) > 1 else ''})")
        return 1
    else:
        print("✨ All Design Tokens Valid!")
        print(f"✓ Source: {TOKENS_FILE}")
        print(f"✓ CSS Output: {CSS_FILE}")
        print(f"✓ Tokens Count: {len(tokens.get('sys', {}).get('color', {}))}")
        return 0


if __name__ == "__main__":
    sys.exit(main())
