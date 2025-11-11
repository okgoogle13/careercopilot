#!/usr/bin/env python3
"""
Migrate MUI Grid components from v5 API to v7 API.

In MUI v7, the Grid component API changed:
- Removed: item prop
- Changed: xs, sm, md, lg, xl props → size prop with responsive object
- Kept: container, spacing, and other props

Example:
  Before: <Grid item xs={12} sm={6} md={4}>
  After:  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
"""

import re
import sys
from pathlib import Path
from typing import List, Tuple

def migrate_grid_component(content: str) -> Tuple[str, int]:
    """Migrate Grid components from v5 to v7 API."""
    changes_count = 0

    # Pattern to match Grid components with breakpoint props
    # Matches: <Grid item? xs={...} sm={...} md={...} ...>
    pattern = r'<Grid\s+(?:item\s+)?((?:(?:xs|sm|md|lg|xl)=\{[^\}]+\}\s*)+)([^>]*)>'

    def replace_grid(match):
        nonlocal changes_count
        breakpoints_str = match.group(1)
        rest_props = match.group(2)

        # Extract all breakpoint props
        breakpoint_pattern = r'(xs|sm|md|lg|xl)=\{([^\}]+)\}'
        breakpoints = re.findall(breakpoint_pattern, breakpoints_str)

        if not breakpoints:
            return match.group(0)

        # Build size object
        size_parts = [f'{bp}: {value}' for bp, value in breakpoints]
        size_obj = '{{ ' + ', '.join(size_parts) + ' }}'

        # Remove trailing spaces from rest_props
        rest_props = rest_props.strip()

        # Build new Grid tag
        if rest_props:
            result = f'<Grid size={size_obj} {rest_props}>'
        else:
            result = f'<Grid size={size_obj}>'

        changes_count += 1
        return result

    # Apply the replacement
    new_content = re.sub(pattern, replace_grid, content)

    return new_content, changes_count

def process_file(file_path: Path) -> bool:
    """Process a single file and return True if changes were made."""
    try:
        content = file_path.read_text(encoding='utf-8')
        new_content, changes = migrate_grid_component(content)

        if changes > 0:
            file_path.write_text(new_content, encoding='utf-8')
            print(f"✓ {file_path.relative_to(Path.cwd())}: {changes} Grid components migrated")
            return True

        return False
    except Exception as e:
        print(f"✗ {file_path}: Error - {e}", file=sys.stderr)
        return False

def main():
    """Main entry point."""
    frontend_src = Path('/workspaces/careercopilot/frontend/src')

    if not frontend_src.exists():
        print(f"Error: {frontend_src} does not exist", file=sys.stderr)
        sys.exit(1)

    # Find all TypeScript/TSX files
    tsx_files = list(frontend_src.rglob('*.tsx'))
    ts_files = list(frontend_src.rglob('*.ts'))
    all_files = tsx_files + ts_files

    print(f"Found {len(all_files)} TypeScript files")
    print("Migrating Grid components from v5 to v7 API...\n")

    files_changed = 0
    for file_path in all_files:
        if process_file(file_path):
            files_changed += 1

    print(f"\n{'='*60}")
    print(f"Migration complete!")
    print(f"Files modified: {files_changed}/{len(all_files)}")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
