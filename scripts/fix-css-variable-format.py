#!/usr/bin/env python3
"""
Fix CSS variable format in design tokens.

Converts JSON objects in CSS variables to proper CSS syntax.

Current problematic format:
  --sys-color-primary: {'DEFAULT': '#D4A84B', 'container': '#8B7A35', ...};

Target format:
  --sys-color-primary-default: #D4A84B;
  --sys-color-primary-container: #8B7A35;
"""

import json
import subprocess
from pathlib import Path
from typing import Dict, Any

def load_tokens() -> Dict[str, Any]:
    """Load design tokens from DTCG JSON file."""
    tokens_path = Path("frontend/src/design/tokens/tokens.json")

    if not tokens_path.exists():
        print(f"❌ Tokens file not found: {tokens_path}")
        return {}

    try:
        with open(tokens_path, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ Error parsing tokens.json: {e}")
        return {}

def extract_color_tokens(tokens: Dict[str, Any]) -> Dict[str, str]:
    """Extract color tokens in flat format."""
    colors = {}

    def traverse(obj, prefix=""):
        if isinstance(obj, dict):
            if "$value" in obj and "$type" in obj:
                # This is a token
                value = obj["$value"]
                if isinstance(value, str) and value.startswith("#"):
                    # It's a color
                    colors[prefix] = value
                elif isinstance(value, dict):
                    # It's a group (like tonal palette)
                    for step, hex_val in value.items():
                        key = f"{prefix}-{step.lower()}"
                        colors[key] = hex_val
            else:
                # Recurse into nested objects
                for key, val in obj.items():
                    new_prefix = f"{prefix}-{key}" if prefix else key
                    traverse(val, new_prefix)

    # Start with sys/color namespace
    if "sys" in tokens and "color" in tokens["sys"]:
        traverse(tokens["sys"]["color"], "sys-color")

    return colors

def generate_css_variables(colors: Dict[str, str]) -> str:
    """Generate CSS custom properties from color tokens."""
    lines = [
        ":root {",
        "  /* Design tokens generated from tokens.json (DTCG format) */",
        "",
    ]

    # Group by base color (e.g., all primary variants together)
    groups = {}
    for name, value in sorted(colors.items()):
        base = name.rsplit("-", 1)[0] if "-" in name else name
        if base not in groups:
            groups[base] = []
        groups[base].append((name, value))

    # Generate CSS with grouped comments
    current_group = None
    for base in sorted(groups.keys()):
        items = groups[base]
        if current_group != base:
            current_group = base
            lines.append(f"\n  /* {base.replace('-', ' ').title()} */")

        for name, value in items:
            css_var_name = f"--{name}".replace("_", "-")
            lines.append(f"  {css_var_name}: {value};")

    lines.extend([
        "",
        "}",
    ])

    return "\n".join(lines)

def update_css_file(css_content: str) -> bool:
    """Write generated CSS to design-tokens.css file."""
    css_path = Path("frontend/src/styles/design-tokens.css")

    try:
        # Create backup
        backup_path = css_path.with_suffix(".css.backup")
        if css_path.exists():
            css_path.read_text()  # Verify readable
            with open(backup_path, 'w') as f:
                f.write(css_path.read_text())
            print(f"✅ Created backup: {backup_path.relative_to(Path.cwd())}")

        # Write new CSS
        css_path.write_text(css_content)
        print(f"✅ Updated: {css_path.relative_to(Path.cwd())}")
        return True

    except Exception as e:
        print(f"❌ Error writing CSS file: {e}")
        if backup_path.exists():
            print(f"   Restoring from backup...")
            css_path.write_text(backup_path.read_text())
        return False

def verify_css_format(css_content: str) -> Tuple[bool, List[str]]:
    """Verify CSS format is valid (no JSON objects)."""
    issues = []

    if "{'" in css_content or ':"' in css_content:
        issues.append("Found JSON-like syntax in CSS")

    if "var(" not in css_content and "--" not in css_content:
        issues.append("No CSS variables found")

    # Check for valid CSS syntax
    import re
    if not re.search(r"--[\w-]+:\s*#[\da-f]{6}", css_content, re.IGNORECASE):
        issues.append("CSS variables don't match expected format")

    return len(issues) == 0, issues

def main():
    """Generate and write CSS variables from design tokens."""
    print("🔧 Fixing CSS variable format...\n")

    # Load tokens
    print("📖 Loading design tokens...")
    tokens = load_tokens()
    if not tokens:
        print("❌ Failed to load tokens")
        return False

    # Extract color tokens
    print("🎨 Extracting color tokens...")
    colors = extract_color_tokens(tokens)
    print(f"✅ Found {len(colors)} color tokens")

    if not colors:
        print("❌ No color tokens found")
        return False

    # Generate CSS
    print("✍️  Generating CSS variables...")
    css_content = generate_css_variables(colors)
    print(f"✅ Generated {len(colors)} CSS variables")

    # Verify format
    print("🔍 Verifying CSS format...")
    is_valid, issues = verify_css_format(css_content)
    if issues:
        print(f"❌ CSS format issues found:")
        for issue in issues:
            print(f"   - {issue}")
        return False
    else:
        print("✅ CSS format is valid")

    # Update file
    print("💾 Writing to design-tokens.css...")
    if not update_css_file(css_content):
        return False

    print("\n✅ CSS variables successfully regenerated!\n")

    # Create git commit
    print("📝 Creating git commit...\n")
    try:
        subprocess.run(["git", "add", "frontend/src/styles/design-tokens.css"], check=True)
        subprocess.run(
            ["git", "commit", "-m", """refactor: fix CSS variable format from JSON to valid CSS

Regenerated design-tokens.css from tokens.json (DTCG source):
- Convert JSON objects to flat CSS custom properties
- Pattern: --sys-color-{role}-{step}: {hex-value}
- Fixes tool compatibility issues
- Maintains 100% DTCG compliance"""],
            check=True,
        )
        print("✅ Commit created successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error creating commit: {e}")
        return False

if __name__ == "__main__":
    from typing import Tuple
    success = main()
    exit(0 if success else 1)
