#!/usr/bin/env python3
# scripts/build-m3-tokens.py
"""
Build Kerala Rage design tokens into CSS variables and Tailwind configuration.
DTCG (W3C) Compliant "Gold Standard" implementation.
"""
import json
import os
import shutil
import subprocess
import sys
import re
from typing import Any

# Define I/O paths (Kerala Rage locations)
TOKEN_SOURCE_FILE = 'frontend/src/design/tokens/tokens.json'
MOTION_SOURCE_FILE = 'frontend/src/design/tokens/motion-tokens.json'
CSS_OUTPUT_FILE = 'frontend/src/design/styles/design-tokens.css'
TAILWIND_CONFIG_PATCH = 'frontend/src/design/tokens/solidarity-tokens.ts'

# CSS Variable Configuration
CSS_VAR_PREFIX = 'kr'
CSS_SELECTOR = ':root[data-theme="solidarity"]'

# Legacy Mapping for Backward Compatibility
LEGACY_SHAPE_ALIASES = {
    'pebble01': 'march-open-01',
    'stone01': 'megaphone-base-01',
    'slab01': 'placard-base-01',
    'pebbleSurge01': 'march-surge-01',
    'pebbleSurge01-expanded': 'march-surge-01-expanded',
    'scaffoldSlab01': 'scaffold-frame-01',
    'scaffoldSlab01-focus': 'scaffold-frame-01-focus',
    'radius-pebble': 'radius-march-open',
    'radius-stone': 'radius-megaphone-base',
    'radius-slab': 'radius-placard-base',
}

LEGACY_SHADOW_ALIASES = {
    'elevation1Pebble': 'elevation-1-strike',
    'elevation2Stone': 'elevation-2-placard',
}

LEGACY_COLOR_ALIASES = {
    'concrete-grey': 'concrete-grey-base',
    'ink-gold': 'ink-gold-base',
    'asphalt-black': 'asphalt-black-base',
    'paper-white': 'paper-white-base',
    'solidarity-red': 'solidarity-red-base',
    'concrete-grey-dark': 'concrete-grey-steps-0',
    'concrete-grey-lightest': 'concrete-grey-steps-4',
    'asphalt-black-light': 'asphalt-black-steps-3',
}

def to_kebab_case(name):
    """Normalize camelCase or PascalCase to kebab-case, preserving leading hyphens."""
    if not isinstance(name, str): return str(name)
    if '-' in name and name.islower(): return name
    name = re.sub('(.)([A-Z][a-z]+)', r'\1-\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1-\2', name).lower()

def load_tokens(path):
    """Loads a Kerala Rage JSON tokens file."""
    if not os.path.exists(path):
        print(f"⚠️  Warning: Token source file not found at {path}")
        return None
    with open(path, 'r') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError as e:
            print(f"❌ Error: Invalid JSON in {path}. {e}")
            sys.exit(1)

def parse_value(val: Any) -> str:
    """Converts DTCG values (including structured color objects) into CSS-ready strings."""
    if isinstance(val, list):
        return " ".join([parse_value(x) for x in val])
    if isinstance(val, dict):
        # Handle RGB Color Object: { "channels": [r, g, b], "colorSpace": "srgb", "alpha": 1 }
        if 'channels' in val and 'colorSpace' in val:
            r, g, b = [int(c * 255) for c in val['channels']]
            a = val.get('alpha', 1)
            if a < 1:
                return f"rgba({r}, {g}, {b}, {a:.3f})"
            return f"#{r:02x}{g:02x}{b:02x}".upper()
        # Handle Dimension Object: { "unit": "ms", "value": 800 }
        if 'unit' in val and 'value' in val:
            return f"{val['value']}{val['unit']}"
        return str(val)
    return str(val)

def resolve_values(node):
    """Recursively extracts $value from DTCG nodes and parses them."""
    if isinstance(node, dict):
        if '$value' in node:
            return parse_value(resolve_aliases(node['$value'], node)) # Simplified; recursion handled via aliases
        return {k: resolve_values(v) for k, v in node.items() if not k.startswith('$')}
    elif isinstance(node, list):
        return [resolve_values(x) for x in node]
    return node

def get_by_path(node: Any, path: str) -> Any:
    """Resolve a dot-separated path from a nested dictionary with normalization."""
    parts = path.split('.')
    current = node
    for part in parts:
        if not isinstance(current, dict):
            return None

        target = to_kebab_case(part)
        found = False
        for k in current.keys():
            if to_kebab_case(k) == target:
                current = current[k]
                found = True
                break
        if not found:
            return None
    return current

def resolve_aliases(node: Any, root: dict[str, Any]) -> Any:
    """Resolve token aliases like {sys.color.inkGold.base} into concrete values."""
    if isinstance(node, dict):
        return {k: resolve_aliases(v, root) for k, v in node.items()}
    if isinstance(node, list):
        return [resolve_aliases(item, root) for item in node]
    if isinstance(node, str):
        pattern = r"\{([^}]+)\}"
        def replace_match(match):
            alias_path = match.group(1).strip()
            # Canonicalize path: remove sys. prefix if root was unwrapped
            if alias_path.startswith('sys.'):
                alias_path = alias_path[4:]

            val = get_by_path(root, alias_path)
            if val is None:
                return match.group(0) # Keep original if not found

            # If the resolved value is still a DTCG node with $value, resolve it
            if isinstance(val, dict) and '$value' in val:
                return parse_value(resolve_aliases(val['$value'], root))
            return parse_value(val)

        if isinstance(node, str) and '{' in node:
            return re.sub(pattern, replace_match, node)
        return node
    return node

def flatten_dict(d, parent_key='', sep='-'):
    """Recursive flatten designed for DTCG tokens."""
    items = []
    if not isinstance(d, dict):
        return []

    for k, v in d.items():
        if k.startswith('$'): continue
        new_key = parent_key + sep + to_kebab_case(k) if parent_key else to_kebab_case(k)

        if isinstance(v, dict):
            if '$value' in v:
                val = v['$value']
                if isinstance(val, dict):
                    items.extend(flatten_dict(val, new_key, sep))
                else:
                    items.append((new_key, val))
            else:
                items.extend(flatten_dict(v, new_key, sep))
        else:
            items.append((new_key, v))

    return items

def generate_css_variables(tokens):
    """Generates CSS variables for Kerala Rage tokens."""
    print(f"🎨 Generating CSS variables at {CSS_OUTPUT_FILE}...")
    os.makedirs(os.path.dirname(CSS_OUTPUT_FILE), exist_ok=True)

    lines = [
        "/* kr-solidarity DESIGN TOKENS (GOLD STANDARD) */",
        f"/* Generated from {TOKEN_SOURCE_FILE} */",
        "",
        f"{CSS_SELECTOR} {{"
    ]

    categories = ['color', 'morphology', 'spacing', 'motion', 'shadow', 'type']
    for cat in categories:
        cat_tokens = tokens.get(cat, {})
        if not cat_tokens: continue

        lines.append(f"  /* --- {cat.capitalize()} --- */")
        flat = flatten_dict(cat_tokens)

        # Determine variable mapping based on category
        var_type = cat
        if cat == 'morphology': var_type = 'shape'
        if cat == 'spacing': var_type = 'space'

        for name, value in flat:
            # Handle multi-line values or special cases if needed
            lines.append(f"  --{CSS_VAR_PREFIX}-{var_type}-{name}: {value};")
        lines.append("")

    lines.append("}")

    # Add Legacy Aliases
    lines.extend([
        "",
        "/* ===== LEGACY COMPATIBILITY LAYER ===== */",
        ":root {"
    ])

    for legacy, canonical in LEGACY_SHAPE_ALIASES.items():
        lines.append(f"  --sys-shape-{legacy}: var(--{CSS_VAR_PREFIX}-shape-{canonical});")
    for legacy, canonical in LEGACY_SHADOW_ALIASES.items():
        lines.append(f"  --sys-shadow-{legacy}: var(--{CSS_VAR_PREFIX}-shadow-{canonical});")
    for legacy, canonical in LEGACY_COLOR_ALIASES.items():
        lines.append(f"  --color-{legacy}: var(--{CSS_VAR_PREFIX}-color-{canonical});")

    lines.append("}")

    with open(CSS_OUTPUT_FILE, 'w') as f:
        f.write("\n".join(lines) + "\n")
    print(f"✅ Generated {len(lines)} lines of CSS.")
    return True

def generate_tailwind_patch(tokens):
    """Generates a Tailwind configuration patch."""
    print(f"🌊 Generating Tailwind patch at {TAILWIND_CONFIG_PATCH}...")

    tw_theme = {
        "theme": {
            "extend": {
                "colors": {},
                "borderRadius": {},
                "boxShadow": {},
                "fontSize": {},
                "transitionTimingFunction": {
                    "m3-expressive": "cubic-bezier(0.34, 1.56, 0.64, 1)",
                    "standard": "cubic-bezier(0.2, 0, 0, 1)"
                },
                "transitionDuration": {
                    "short1": "100ms", "short2": "200ms", "medium1": "400ms", "long1": "600ms"
                },
                "fontFamily": {}
            }
        }
    }

    # Populate groups
    mappings = [
        ('color', 'colors', 'color'),
        ('morphology', 'borderRadius', 'shape'),
        ('shadow', 'boxShadow', 'shadow'),
    ]

    for src_cat, tw_path, var_cat in mappings:
        flat = flatten_dict(tokens.get(src_cat, {}))
        for name, _ in flat:
            tw_theme["theme"]["extend"][tw_path][name] = f"var(--{CSS_VAR_PREFIX}-{var_cat}-{name})"

    # Handle font sizes specially (strip 'scale-')
    type_scale = flatten_dict(tokens.get('type', {}).get('scale', {}))
    for name, _ in type_scale:
        clean_name = name.replace('scale-', '')
        tw_theme["theme"]["extend"]["fontSize"][clean_name] = f"var(--{CSS_VAR_PREFIX}-type-scale-{clean_name})"

    # Ensure font families are present (even if empty) to satisfy Tailwind config types
    fonts = tokens.get('type', {}).get('fontFamilies', {})
    if fonts:
        for name, _ in flatten_dict(fonts):
            tw_theme["theme"]["extend"]["fontFamily"][name] = [f"var(--{CSS_VAR_PREFIX}-type-font-{name})"]
    else:
        # Fallback if no fonts are defined
        tw_theme["theme"]["extend"]["fontFamily"] = {}

    patch_content = f"// Kerala Rage Tailwind Patch\n// Auto-generated by scripts/build-m3-tokens.py\nexport default {json.dumps(tw_theme, indent=2)};\n"

    with open(TAILWIND_CONFIG_PATCH, 'w') as f:
        f.write(patch_content)

    # Format with Prettier if possible
    prettier = shutil.which('prettier')
    if prettier:
        try:
            subprocess.run([prettier, '--write', TAILWIND_CONFIG_PATCH], capture_output=True)
        except: pass

    print("✅ Tailwind patch generated.")
    return True

def main():
    print("=" * 60)
    print("Kerala Rage Token Builder: Gold Standard DTCG Edition")
    print("=" * 60)

    raw_tokens = load_tokens(TOKEN_SOURCE_FILE)
    if not raw_tokens: return

    motion_tokens = load_tokens(MOTION_SOURCE_FILE)

    # Unwrap 'sys' if present
    root = raw_tokens.get('sys', raw_tokens)

    # Merge motion
    if motion_tokens:
        root['motion'] = motion_tokens.get('sys', {}).get('motion', motion_tokens.get('motion', motion_tokens))

    # Resolve
    print("🔍 Resolving DTCG references and aliases...")
    resolved = resolve_values(root)
    tokens = resolve_aliases(resolved, resolved)

    # Filter metadata
    if isinstance(tokens, dict):
        tokens = {k: v for k, v in tokens.items() if k not in ['compliance', 'documentation', 'metadata']}

    # Build
    if generate_css_variables(tokens) and generate_tailwind_patch(tokens):
        print("✨ Build successful!")
    else:
        print("❌ Build failed.")
        sys.exit(1)

if __name__ == "__main__":
    main()
