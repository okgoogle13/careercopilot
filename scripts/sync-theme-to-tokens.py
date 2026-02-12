#!/usr/bin/env python3
"""
Sync Theme Colors to Design Tokens

This script resolves the theme/token color mismatch by syncing colors from
theme.ts (source of truth) to design-system/tokens.json.

Usage:
    python3 scripts/sync-theme-to-tokens.py
"""

import json
import os
import sys
from pathlib import Path

# [DEPRECATED] This script is disabled to prevent regression during ExpressiveStack migration.
# The source of truth for tokens is now frontend/src/design/tokens/tokens.json
print("⚠️  WARNING: sync-theme-to-tokens.py is DEPRECATED.")
print("The ExpressiveStack migration is in progress. This script would overwrite new tokens with old values.")
print("Abort.")
sys.exit(0)


# Color mapping from theme.ts (Dark Mode)
THEME_COLORS = {
    # Primary palette (Purple)
    "primary": "#A78BFA",
    "primary_light": "#C084FC",
    "primary_dark": "#7C3AED",
    "primary_contrast": "#1E1B4B",

    # Secondary palette (Light Purple)
    "secondary": "#C9C3DC",
    "secondary_light": "#D8D4E6",  # Derived lighter
    "secondary_dark": "#474459",
    "secondary_contrast": "#312E41",

    # Tertiary palette (Pink)
    "tertiary": "#F472B6",
    "tertiary_light": "#F9A8D4",  # Derived lighter
    "tertiary_dark": "#EC4899",
    "tertiary_contrast": "#831843",

    # Error palette
    "error": "#FFB4AB",
    "error_light": "#FFC9C2",  # Derived lighter
    "error_dark": "#93000A",
    "error_contrast": "#690005",

    # Success palette (keeping existing, adjusting to dark mode)
    "success": "#86EFAC",  # Dark mode green
    "success_light": "#BBF7D0",
    "success_dark": "#22C55E",

    # Warning palette (keeping existing, adjusting to dark mode)
    "warning": "#FDE047",  # Dark mode yellow
    "warning_light": "#FEF08A",
    "warning_dark": "#FACC15",

    # Info palette (keeping existing, adjusting to dark mode)
    "info": "#67E8F9",  # Dark mode cyan
    "info_light": "#A5F3FC",
    "info_dark": "#06B6D4",

    # Text colors (Dark Mode)
    "text_primary": "#F8FAFC",
    "text_secondary": "#E2E8F0",
    "text_disabled": "#928F99",

    # Background colors (Dark Mode)
    "bg_default": "#131318",
    "bg_paper": "#1E1E23",
    "bg_elevated": "#262629",

    # Divider and actions (Dark Mode)
    "divider": "#48464F",
    "action_active": "rgba(248, 250, 252, 0.54)",
    "action_hover": "rgba(248, 250, 252, 0.04)",
    "action_selected": "rgba(248, 250, 252, 0.08)",
    "action_disabled": "rgba(248, 250, 252, 0.26)",
}

def sync_tokens():
    """Sync theme colors to tokens.json"""

    # Paths
    project_root = Path(__file__).parent.parent
    tokens_file = project_root / "design-system" / "tokens.json"

    print("🔄 Syncing theme colors to design tokens...")
    print(f"📁 Token file: {tokens_file}")

    # Read existing tokens
    if not tokens_file.exists():
        print(f"❌ Error: {tokens_file} not found")
        sys.exit(1)

    with open(tokens_file, 'r') as f:
        tokens = json.load(f)

    print(f"✓ Loaded existing tokens (version: {tokens.get('version', 'unknown')})")

    # Backup original
    backup_file = tokens_file.with_suffix('.json.backup')
    with open(backup_file, 'w') as f:
        json.dump(tokens, f, indent=2)
    print(f"✓ Created backup: {backup_file}")

    # Update color section
    original_color_count = len(tokens.get('color', {}))
    tokens['color'] = THEME_COLORS
    tokens['version'] = "1.1.0-dark-mode"
    tokens['description'] = "M3 Design System Token Definition (Dark Mode - Synced from theme.ts)"

    print(f"✓ Updated {len(THEME_COLORS)} color tokens (was {original_color_count})")

    # Write updated tokens
    with open(tokens_file, 'w') as f:
        json.dump(tokens, f, indent=2)

    print(f"✓ Saved updated tokens to {tokens_file}")

    # Print summary
    print("\n📊 Color Sync Summary:")
    print("=" * 60)
    print(f"Primary:   {THEME_COLORS['primary']} (Purple - Dark Mode)")
    print(f"Secondary: {THEME_COLORS['secondary']} (Light Purple)")
    print(f"Tertiary:  {THEME_COLORS['tertiary']} (Pink)")
    print(f"Error:     {THEME_COLORS['error']} (Soft Red)")
    print(f"Success:   {THEME_COLORS['success']} (Bright Green)")
    print(f"Warning:   {THEME_COLORS['warning']} (Bright Yellow)")
    print(f"Info:      {THEME_COLORS['info']} (Bright Cyan)")
    print("=" * 60)

    print("\n✅ Theme/token color mismatch RESOLVED!")
    print("\n📋 Next steps:")
    print("  1. Run: ./scripts/update-design-system.sh")
    print("  2. Run: python3 scripts/validate-design-tokens.py")
    print("  3. Commit changes")

    return True

if __name__ == "__main__":
    try:
        success = sync_tokens()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
