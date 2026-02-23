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
from pathlib import Path

# Color mappings (hex → token)
COLOR_MAP = {
    '#A78BFA': 'var(--sys-color-primary)',
    '#C084FC': 'var(--sys-color-primary-light)',
    '#7C3AED': 'var(--sys-color-primary-dark)',
    '#C9C3DC': 'var(--sys-color-secondary)',
    '#F472B6': 'var(--sys-color-tertiary)',
    '#EC4899': 'var(--sys-color-tertiary-dark)',
    '#FFB4AB': 'var(--sys-color-error)',
    '#86EFAC': 'var(--sys-color-success)',
    '#BBF7D0': 'var(--sys-color-success-light)',
    '#22C55E': 'var(--sys-color-success-dark)',
    '#FDE047': 'var(--sys-color-warning)',
    '#FEF08A': 'var(--sys-color-warning-light)',
    '#FACC15': 'var(--sys-color-warning-dark)',
    '#67E8F9': 'var(--sys-color-info)',
    '#A5F3FC': 'var(--sys-color-info-light)',
    '#06B6D4': 'var(--sys-color-info-dark)',
    '#60a5fa': 'var(--sys-color-info-light)',  # Common variant
    '#F8FAFC': 'var(--sys-color-text-primary)',
    '#E2E8F0': 'var(--sys-color-text-secondary)',
    '#928F99': 'var(--sys-color-text-disabled)',
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
    '0px': 'var(--sys-shape-radius-none)',
    '4px': 'var(--sys-shape-radius-sm)',
    '8px': 'var(--sys-shape-radius-md)',
    '0.5rem': 'var(--sys-shape-radius-md)',
    '0.25rem': 'var(--sys-shape-radius-sm)',
    '12px': 'var(--sys-shape-radius-lg)',
    '16px': 'var(--sys-shape-radius-xl)',
    '9999px': 'var(--sys-shape-radius-full)',
    '50%': 'var(--sys-shape-radius-full)',
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


def migrate_component(file_path):
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

    if total_changes == 0:
        print(f"  ℹ️  No hardcoded values found (already M3 compliant)")
        return True

    # Write updated content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✅ Migration complete: {total_changes} change(s) made")
    return True


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/migrate-component-m3.py <component-path>")
        print("Example: python3 scripts/migrate-component-m3.py frontend/src/components/ui/button.tsx")
        sys.exit(1)

    file_path = sys.argv[1]

    success = migrate_component(file_path)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
