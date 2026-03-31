#!/usr/bin/env python3
"""
Enhanced Design Token Validator
Validates DTCG compliance, Kerala Rage palette rules, circular references,
and consistency between tokens.json and generated CSS variables.

Exit codes:
  0 = All validations passed
  1 = One or more validations failed
"""
import json
import sys
import re
from pathlib import Path
from typing import Dict, List, Tuple, Set, Any

# Configuration
TOKENS_FILE = Path("frontend/src/design/tokens/tokens.json")
CSS_FILE = Path("frontend/src/design/styles/design-tokens.css")
CSS_VAR_PREFIX = "kr"

# Kerala Rage semantic color tokens that MUST exist
REQUIRED_SEMANTIC_COLORS = {
    "charcoalBackground": "#1A1714",
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


def parse_validation_color(val: Any) -> str:
    """Converts a token color $value (string or object) to a hex string for validation."""
    if isinstance(val, str):
        return val.upper()
    if isinstance(val, dict) and 'channels' in val:
        r, g, b = [int(c * 255) for c in val['channels']]
        return f"#{r:02x}{g:02x}{b:02x}".upper()
    return str(val).upper()

def is_color_token(node: Dict) -> bool:
    """Return True when node matches the expected color token leaf shape."""
    if not isinstance(node, dict):
        return False
    base = node.get("base")
    steps = node.get("steps")
    usage = node.get("usage")

    # Check for DTCG structured color in base
    if isinstance(base, dict) and "$value" in base:
        val = base["$value"]
        if isinstance(val, (str, dict)):
             return True
    return False


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


def to_kebab_case(name: str) -> str:
    """Normalize camelCase or PascalCase to kebab-case, preserving leading hyphens."""
    if not isinstance(name, str): return str(name)
    if '-' in name and name.islower(): return name
    name = re.sub('(.)([A-Z][a-z]+)', r'\1-\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1-\2', name).lower()

def validate_dtcg_structure(tokens: Dict, path: str = "sys") -> Tuple[List[str], List[str]]:
    """Validate DTCG compliance ($value, $type fields)."""
    errors = []
    warnings = []

    def traverse(node: Dict, current_path: str = ""):
        if isinstance(node, dict):
            if "$value" in node:
                # It's a token leaf
                if "$type" not in node:
                    warnings.append(
                        f"Missing $type for token at {current_path} (recommended for DTCG)"
                    )
            else:
                # It's a group; recurse
                for key, value in node.items():
                    if not key.startswith("$"):
                        new_path = f"{current_path}.{key}" if current_path else key
                        if isinstance(value, dict):
                            traverse(value, new_path)

    traverse(tokens.get("sys", tokens), path)
    return errors, warnings


def validate_semantic_colors(tokens: Dict) -> Tuple[List[str], List[str]]:
    """Validate that all required Kerala Rage semantic colors exist."""
    errors = []
    warnings = []
    sys_colors = tokens.get("sys", {}).get("color", {})

    for color_name, expected_hex in REQUIRED_SEMANTIC_COLORS.items():
        if color_name not in sys_colors:
            errors.append(f"Missing required semantic color: {color_name}")
        else:
            color_token = sys_colors[color_name]
            # Check for base, steps, usage structure
            for structure in EXPECTED_COLOR_STRUCTURE:
                if structure not in color_token:
                    warnings.append(
                        f"Color '{color_name}' missing secondary structure: {structure}"
                    )
            # Verify base value matches
            base_node = color_token.get("base", {})
            if "$value" in base_node:
                base_value = parse_validation_color(base_node["$value"])
                if base_value != expected_hex.upper():
                    errors.append(
                        f"Color '{color_name}' base value mismatch: got {base_value}, expected {expected_hex}"
                    )
            else:
                errors.append(f"Color '{color_name}' missing $value in base")

    return errors, warnings


def validate_typography(tokens: Dict) -> Tuple[List[str], List[str]]:
    """Validate required typography families."""
    errors = []
    warnings = []
    sys_type = tokens.get("sys", {}).get("type", {})
    font_families = sys_type.get("fontFamilies", {})

    for font_key, expected_name in REQUIRED_FONTS.items():
        if font_key not in font_families:
            errors.append(f"Missing required font family: {font_key}")
        else:
            actual_node = font_families[font_key].get("$value", "")
            if isinstance(actual_node, list):
                actual_name = " ".join([str(x) for x in actual_node])
            else:
                actual_name = str(actual_node)

            if actual_name != expected_name:
                errors.append(
                    f"Font '{font_key}' name mismatch: got '{actual_name}', expected '{expected_name}'"
                )

    return errors, warnings


def validate_circular_references(tokens: Dict) -> Tuple[List[str], List[str]]:
    """Check for circular references in token aliases."""
    errors = []
    warnings = []
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
    return errors, warnings


def validate_css_generation(tokens: Dict, css_vars: Dict[str, str]) -> Tuple[List[str], List[str]]:
    """Verify that all token colors are present in CSS variables."""
    errors = []
    warnings = []
    sys_colors = tokens.get("sys", {}).get("color", {})

    for color_name, color_token in sys_colors.items():
        if not is_color_token(color_token):
            # Skip non-color groups such as semantic aliases.
            continue
        # Normalize name to kebab-case for CSS matching
        kebab_name = to_kebab_case(color_name)
        css_var_name = f"--{CSS_VAR_PREFIX}-color-{kebab_name}-base"

        if css_var_name not in css_vars:
            warnings.append(
                f"Missing CSS variable: {css_var_name} (token exist but not in CSS yet)"
            )
        else:
            css_value = css_vars[css_var_name].upper()
            base_node = color_token.get("base", {})
            if "$value" in base_node:
                expected_base = parse_validation_color(base_node["$value"])
                if expected_base != css_value:
                    errors.append(
                        f"CSS variable mismatch: {css_var_name} = {css_value}, expected {expected_base}"
                    )

        # Check tonal steps
        steps = color_token.get("steps", {}).get("$value", [])
        for i, step_hex in enumerate(steps):
            css_step_var = f"--{CSS_VAR_PREFIX}-color-{kebab_name}-steps-{i}"
            if css_step_var not in css_vars:
                errors.append(
                    f"Missing CSS tonal step: {css_step_var} (step {i} for {color_name})"
                )
            else:
                css_step_value = css_vars[css_step_var].upper()
                expected_step = parse_validation_color(step_hex)
                if expected_step != css_step_value:
                    errors.append(
                        f"CSS step mismatch: {css_step_var} = {css_step_value}, expected {expected_step}"
                    )

        # Check usage metadata (usually just one variable or space separated)
        css_usage_var = f"--{CSS_VAR_PREFIX}-color-{kebab_name}-usage"
        if css_usage_var not in css_vars:
            errors.append(
                f"Missing CSS usage metadata: {css_usage_var}"
            )

    return errors, warnings


def main():
    """Run all validation checks."""
    print("🔍 Validating Design Tokens...\n")

    if not TOKENS_FILE.exists():
        print(f"⚠️  {TOKENS_FILE} not found. Skipping validation.")
        return 0

    tokens = load_tokens(TOKENS_FILE)
    css_vars = load_css_variables(CSS_FILE)

    all_errors = []
    all_warnings = []

    # 1. DTCG Structure Validation
    print("1️⃣  Checking DTCG Compliance...")
    dtcg_errors, dtcg_warnings = validate_dtcg_structure(tokens)
    if dtcg_errors:
        print("   ❌ DTCG Compliance Failures (CRITICAL):")
        for err in dtcg_errors:
            print(f"      - {err}")
        all_errors.extend(dtcg_errors)
    if dtcg_warnings:
        print("   ⚠️  DTCG Structure Warnings (SOFT):")
        for wrn in dtcg_warnings:
            print(f"      - {wrn}")
        all_warnings.extend(dtcg_warnings)

    if not dtcg_errors and not dtcg_warnings:
        print("   ✅ DTCG compliance passed")

    # 2. Semantic Colors Validation
    print("\n2️⃣  Checking Kerala Rage Semantic Colors...")
    color_errors, color_warnings = validate_semantic_colors(tokens)
    if color_errors:
        print("   ❌ Semantic Color Failures (CRITICAL):")
        for err in color_errors:
            print(f"      - {err}")
        all_errors.extend(color_errors)
    if color_warnings:
        print("   ⚠️  Semantic Color Warnings (SOFT):")
        for wrn in color_warnings:
            print(f"      - {wrn}")
        all_warnings.extend(color_warnings)

    if not color_errors and not color_warnings:
        print("   ✅ All required semantic colors present")

    # 3. Typography Validation
    print("\n3️⃣  Checking Typography System...")
    typo_errors, typo_warnings = validate_typography(tokens)
    if typo_errors:
        print("   ❌ Typography Failures (CRITICAL):")
        for err in typo_errors:
            print(f"      - {err}")
        all_errors.extend(typo_errors)
    if typo_warnings:
        print("   ⚠️  Typography Warnings (SOFT):")
        for wrn in typo_warnings:
            print(f"      - {wrn}")
        all_warnings.extend(typo_warnings)

    if not typo_errors and not typo_warnings:
        print("   ✅ Typography system valid")

    # 4. Circular References
    print("\n4️⃣  Checking for Circular References...")
    circ_errors, circ_warnings = validate_circular_references(tokens)
    if circ_errors:
        print("   ❌ Circular Reference Failures (CRITICAL):")
        for err in circ_errors:
            print(f"      - {err}")
        all_errors.extend(circ_errors)
    if circ_warnings:
        print("   ⚠️  Circular Reference Warnings (SOFT):")
        for wrn in circ_warnings:
            print(f"      - {wrn}")
        all_warnings.extend(circ_warnings)

    if not circ_errors and not circ_warnings:
        print("   ✅ No circular references detected")

    # 5. CSS Generation Consistency
    print("\n5️⃣  Checking CSS Variable Consistency...")
    if not css_vars:
        print("   ⚠️  No CSS variables found. Run: python3 scripts/build-m3-tokens.py")
        all_warnings.append("CSS file not generated or empty")
    else:
        css_errors, css_warnings = validate_css_generation(tokens, css_vars)
        if css_errors:
            print("   ❌ CSS Generation Failures (CRITICAL):")
            for err in css_errors:
                print(f"      - {err}")
            all_errors.extend(css_errors)
        if css_warnings:
            print("   ⚠️  CSS Generation Warnings (SOFT):")
            for wrn in css_warnings:
                print(f"      - {wrn}")
            all_warnings.extend(css_warnings)

        if not css_errors and not css_warnings:
            print("   ✅ CSS variables complete and consistent")

    # Summary
    print("\n" + "=" * 60)
    if all_errors:
        print(f"❌ Validation Failed ({len(all_errors)} critical error{'s' if len(all_errors) > 1 else ''})")
        if all_warnings:
            print(f"⚠️  ({len(all_warnings)} soft warning{'s' if len(all_warnings) > 1 else ''} also detected)")
        return 1

    if all_warnings:
        print(f"✨ Design Tokens Valid (with {len(all_warnings)} soft warning{'s' if len(all_warnings) > 1 else ''})")
        print("✓ Commits UNLOCKED - Warnings do not block development.")
    else:
        print("✨ All Design Tokens Valid!")

    print(f"✓ Source: {TOKENS_FILE}")
    print(f"✓ CSS Output: {CSS_FILE}")
    print(f"✓ Tokens Count: {len(tokens.get('sys', {}).get('color', {}))}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
