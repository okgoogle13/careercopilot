#!/usr/bin/env python3
"""
Component M3 Migration Script

Automatically migrates a component to use M3 design tokens by:
1. Replacing hardcoded colors with CSS variables
2. Replacing hardcoded spacing with spacing tokens
3. Replacing hardcoded border radius with shape tokens
4. Adding motion tokens to animations/transitions

Usage:
    python3 scripts/migrate-component-m3.py <component-path>
    python3 scripts/migrate-component-m3.py frontend/src/components/ui/button.tsx
"""

import re
import sys
import os
import json
from pathlib import Path

# Color mappings (hex → token)
COLOR_MAP = {
    # Legacy generic colors mapped to nearest KR Solidarity equivalents
    '#A78BFA': 'var(--sys-color-inkGold)',
    '#C084FC': 'var(--sys-color-inkGold)',
    '#7C3AED': 'var(--sys-color-inkGold)',
    '#C9C3DC': 'var(--sys-color-concreteGrey)',
    '#F472B6': 'var(--sys-color-solidaritySmokeOrange)',
    '#EC4899': 'var(--sys-color-solidaritySmokeOrange)',
    '#FFB4AB': 'var(--sys-color-kr-charcoalRed)',
    '#86EFAC': 'var(--sys-color-kr-activistSmokeGreen)',
    '#BBF7D0': 'var(--sys-color-kr-activistSmokeGreen)',
    '#22C55E': 'var(--sys-color-kr-activistSmokeGreen)',
    '#FDE047': 'var(--sys-color-stencilYellow)',
    '#FEF08A': 'var(--sys-color-stencilYellow)',
    '#FACC15': 'var(--sys-color-stencilYellow)',
    '#67E8F9': 'var(--sys-color-protestMetalBlue)',
    '#A5F3FC': 'var(--sys-color-protestMetalBlue)',
    '#06B6D4': 'var(--sys-color-protestMetalBlue)',
    '#60a5fa': 'var(--sys-color-protestMetalBlue)',
    '#F8FAFC': 'var(--sys-color-paperWhite)',
    '#E2E8F0': 'var(--sys-color-worker-ash)',
    '#928F99': 'var(--sys-color-concreteGrey)',

    # Hardcoded KR Solidarity hexes to semantic tokens
    '#1A1714': 'var(--sys-color-charcoalBackground)',
    '#F14714': 'var(--sys-color-solidarityRed)',
    '#F14844': 'var(--sys-color-kr-charcoalRed)',
    '#48DA8B': 'var(--sys-color-kr-activistSmokeGreen)',
    '#48F0E5': 'var(--sys-color-signalGreen)',
    '#DAF674': 'var(--sys-color-inkGold)',
    '#F6E748': 'var(--sys-color-stencilYellow)',
    '#DAF6B3': 'var(--sys-color-worker-ash)',
    '#DA8B48': 'var(--sys-color-solidaritySmokeOrange)',
    '#48B3DA': 'var(--sys-color-protestMetalBlue)',
    '#D81E05': 'var(--sys-color-aboriginalFlagRed)',
    '#FCD116': 'var(--sys-color-aboriginalFlagYellow)',
    '#000000': 'var(--sys-color-aboriginalFlagBlack)',
    '#A39B8F': 'var(--sys-color-concreteGrey)',
    '#B8733D': 'var(--sys-color-ochreEarth)',
    '#F5F0E8': 'var(--sys-color-paperWhite)',
}

# Spacing mappings (px → token)
SPACING_MAP = {
    '4px': 'var(--sys-space-xs)',
    '8px': 'var(--sys-space-sm)',
    '12px': 'var(--sys-space-sm)',  # Close enough to 8px
    '16px': 'var(--sys-space-md)',
    '24px': 'var(--sys-space-lg)',
    '32px': 'var(--sys-space-xl)',
    '48px': 'var(--sys-space-2xl)',
    '64px': 'var(--sys-space-3xl)',
}

# Border radius mappings (px → token)
RADIUS_MAP = {
    # Basic tokens
    '0px': 'var(--sys-shape-radius-none)',
    '2px': 'var(--sys-shape-radius-xs)',
    '4px': 'var(--sys-shape-radius-sm)',
    '8px': 'var(--sys-shape-radius-md)',
    '0.5rem': 'var(--sys-shape-radius-md)',
    '0.25rem': 'var(--sys-shape-radius-sm)',
    '12px': 'var(--sys-shape-radius-lg)',
    '16px': 'var(--sys-shape-radius-xl)',
    '20px': 'var(--sys-shape-radius-xl)',
    '32px': 'var(--sys-shape-radius-xxl)',
    '48px': 'var(--sys-shape-radius-xxxl)',
    '9999px': 'var(--sys-shape-radius-full)',
    '50%': 'var(--sys-shape-radius-full)',

    # KR Solidarity v6.1 Semantic Shapes
    '8px 2px 8px 2px': 'var(--shape-blockRiot01)',
    '12px 0 8px 20px': 'var(--shape-blockRiot01-pressed)',
    '20px 4px 12px 2px': 'var(--shape-blockRiot02)',
    '32px 2px 2px 2px': 'var(--shape-blockRiot03)',
    '20px 8px 12px 32px': 'var(--shape-pebbleSurge01)',
}

# Animation duration mappings (ms → token)
DURATION_MAP = {
    '100ms': 'var(--sys-motion-duration-short2)',
    '150ms': 'var(--sys-motion-duration-short3)',
    '200ms': 'var(--sys-motion-duration-short4)',
    '250ms': 'var(--sys-motion-duration-medium1)',
    '300ms': 'var(--sys-motion-duration-medium2)',
    '0.3s': 'var(--sys-motion-duration-medium2)',
    '400ms': 'var(--sys-motion-duration-medium4)',
    '500ms': 'var(--sys-motion-duration-long2)',
    '0.5s': 'var(--sys-motion-duration-long2)',
}

# Easing curve mappings
EASING_MAP = {
    'ease-in-out': 'var(--sys-motion-easing-standard)',
    'ease-in': 'var(--sys-motion-easing-standardAccelerate)',
    'ease-out': 'var(--sys-motion-easing-standardDecelerate)',
}


def migrate_colors(content):
    """Replace hardcoded hex colors with design tokens."""
    changes = 0
    for hex_color, token in COLOR_MAP.items():
        # Case insensitive replacement
        pattern = re.compile(re.escape(hex_color), re.IGNORECASE)
        new_content = pattern.sub(token, content)
        if new_content != content:
            changes += content.count(hex_color) + content.count(hex_color.lower())
        content = new_content
    return content, changes


def migrate_spacing(content):
    """Replace hardcoded spacing values with design tokens."""
    changes = 0

    # Pattern for padding/margin/gap with px values
    props = ['padding', 'margin', 'gap', 'paddingTop', 'paddingRight',
             'paddingBottom', 'paddingLeft', 'marginTop', 'marginRight',
             'marginBottom', 'marginLeft']

    for prop in props:
        for px_value, token in SPACING_MAP.items():
            # Match: padding: '16px' or padding: "16px"
            pattern = rf"({prop}:\s*['\"]){re.escape(px_value)}(['\"])"
            replacement = rf"\1{token}\2"
            new_content = re.sub(pattern, replacement, content)
            if new_content != content:
                changes += len(re.findall(pattern, content))
            content = new_content

    return content, changes


def migrate_border_radius(content):
    """Replace hardcoded border radius values with design tokens."""
    changes = 0

    radius_props = ['borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius',
                    'borderBottomLeftRadius', 'borderBottomRightRadius']

    for prop in radius_props:
        for radius_value, token in RADIUS_MAP.items():
            # Match: borderRadius: '12px' or borderRadius: "12px" or borderRadius: "9999px"
            pattern = rf"({prop}:\s*['\"]){re.escape(radius_value)}(['\"])"
            replacement = rf"\1{token}\2"
            new_content = re.sub(pattern, replacement, content)
            if new_content != content:
                changes += len(re.findall(pattern, content))
            content = new_content

    return content, changes


def migrate_animations(content):
    """Replace hardcoded animation durations and easing with design tokens."""
    changes = 0

    # Migrate durations in transition/animation properties
    for duration_value, token in DURATION_MAP.items():
        # Match: transition: '0.3s' or transition: "300ms"
        pattern = rf"(transition:\s*['\"][^'\"]*){re.escape(duration_value)}"
        replacement = rf"\1{token}"
        new_content = re.sub(pattern, replacement, content)
        if new_content != content:
            changes += len(re.findall(pattern, content))
        content = new_content

    # Migrate easing curves
    for easing_value, token in EASING_MAP.items():
        pattern = rf"{re.escape(easing_value)}"
        new_content = re.sub(pattern, token, content)
        if new_content != content:
            changes += content.count(easing_value)
        content = new_content

    return content, changes


def migrate_expressive(content):
    """Pass 2: Inject expressive motion and substrate noise."""
    changes = 0

    # 1. Inject framer-motion if not present but we are making changes
    has_motion = 'framer-motion' in content

    # 2. Upgrade css transitions to viscous
    pattern_transition = r"transition-all duration-(?:300|500)"
    new_content = re.sub(pattern_transition, "transition-all duration-300 ease-viscous", content)
    if new_content != content:
        changes += len(re.findall(pattern_transition, content))
    content = new_content

    # 3. If we made expressive changes and need framer-motion, we could inject it here
    # For MVP, we'll just track if we applied the viscous easing.
    return content, changes

def migrate_component(file_path, run_expressive=False):
    """Migrate a component file to M3 design tokens."""

    if not os.path.exists(file_path):
        print(f"❌ Error: File not found: {file_path}")
        return False

    print(f"🔄 Migrating: {file_path}")

    # Read file content
    with open(file_path, 'r', encoding='utf-8') as f:
        original_content = f.read()

    content = original_content
    total_changes = 0

    # Apply migrations
    content, color_changes = migrate_colors(content)
    total_changes += color_changes
    if color_changes > 0:
        print(f"  ✓ Replaced {color_changes} hardcoded color(s)")

    content, spacing_changes = migrate_spacing(content)
    total_changes += spacing_changes
    if spacing_changes > 0:
        print(f"  ✓ Replaced {spacing_changes} hardcoded spacing value(s)")

    content, radius_changes = migrate_border_radius(content)
    total_changes += radius_changes
    if radius_changes > 0:
        print(f"  ✓ Replaced {radius_changes} hardcoded border radius value(s)")

    content, animation_changes = migrate_animations(content)
    total_changes += animation_changes
    if animation_changes > 0:
        print(f"  ✓ Replaced {animation_changes} hardcoded animation value(s)")

    if total_changes == 0 and not run_expressive:
        print(f"  ℹ️  No hardcoded values found (already M3 compliant)")
        return True, False

    expressive_changes = 0
    if run_expressive:
        content, expressive_changes = migrate_expressive(content)
        total_changes += expressive_changes
        if expressive_changes > 0:
            print(f"  ✨ Pass 2: Applied {expressive_changes} expressive transforms")

    if total_changes == 0:
        print(f"  ℹ️  No changes needed.")
        return True, False    # Write updated content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✅ Migration complete: {total_changes} change(s) made")
    return True, (expressive_changes > 0)


def main():
    if len(sys.argv) > 1 and sys.argv[1] == '--auto':
        design_level = None
        if len(sys.argv) > 3 and sys.argv[2] == '--design-level':
            design_level = sys.argv[3]

        inventory_path = Path("frontend/component-inventory.json")
        if not inventory_path.exists():
            print("❌ Error: component-inventory.json not found. Run inventory script first.")
            sys.exit(1)

        with open(inventory_path, 'r') as f:
            inventory = json.load(f)

        planned_components = [c for c in inventory.get('components', [])
                              if c.get('expressiveStatus') == 'planned']

        if design_level:
            planned_components = [c for c in planned_components if c.get('designLevel') == design_level]

        if not planned_components:
            level_msg = f" for level '{design_level}'" if design_level else ""
            print(f"ℹ️ No planned components found{level_msg} for expressive transformation.")
            sys.exit(0)

        print(f"🚀 Found {len(planned_components)} components planned for expressive upgrade.")
        upgraded_count = 0
        for comp in planned_components:
            file_path = Path("frontend") / comp['relativePath']
            success, made_expressive = migrate_component(str(file_path), run_expressive=True)
            if made_expressive:
                upgraded_count += 1

        print(f"\n✨ Updated {upgraded_count} components to expressive=done")
        sys.exit(0)

    if len(sys.argv) < 2:
        print("Usage: python3 scripts/migrate-component-m3.py <component-path> | --auto [--design-level <level>]")
        print("Example: python3 scripts/migrate-component-m3.py frontend/src/components/ui/button.tsx")
        print("Example: python3 scripts/migrate-component-m3.py --auto --design-level atom")
        sys.exit(1)

    file_path = sys.argv[1]

    success, _ = migrate_component(file_path, run_expressive=True)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
