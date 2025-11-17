#!/usr/bin/env python3
"""
Migrate Material-UI Grid to Grid2 for MUI v6+ compatibility.
This script fixes the deprecated 'item' prop issue.
"""

import re
import sys
from pathlib import Path
from typing import List, Tuple

def find_files_with_grid(src_dir: Path) -> List[Path]:
    """Find all TypeScript/TSX files that use Grid/Grid2."""
    files = []
    for pattern in ['**/*.tsx', '**/*.ts']:
        for file in src_dir.glob(pattern):
            try:
                content = file.read_text()
                # Find files that use Grid or Grid2 components
                if ('<Grid2' in content or '<Grid' in content) and '__tests__' not in str(file):
                    files.append(file)
            except Exception as e:
                print(f"Error reading {file}: {e}", file=sys.stderr)
    return sorted(files)

def migrate_grid_import(content: str) -> Tuple[str, bool]:
    """
    Migrate Grid import statement to Grid2.
    Returns (modified_content, was_modified).
    """
    modified = False

    # Check if Grid2 is already imported
    has_grid2_import = "import Grid2 from '@mui/material/Unstable_Grid2'" in content

    # Check if Grid2 is used in the file
    uses_grid2 = '<Grid2' in content

    # If Grid2 is used but not imported, add the import
    if uses_grid2 and not has_grid2_import:
        # Find the first import from @mui/material and add Grid2 import after it
        lines = content.split('\n')
        new_lines = []
        grid2_added = False

        for line in lines:
            new_lines.append(line)
            if not grid2_added and "@mui/material" in line and "import" in line:
                # Add Grid2 import after this line
                new_lines.append("import Grid2 from '@mui/material/Unstable_Grid2';")
                grid2_added = True
                modified = True

        content = '\n'.join(new_lines)

    # Pattern 1: import { Grid } from '@mui/material';
    if re.search(r"import\s*{\s*Grid\s*}\s*from\s*['\"]@mui/material['\"];", content):
        content = re.sub(
            r"import\s*{\s*Grid\s*}\s*from\s*['\"]@mui/material['\"];",
            "import Grid2 from '@mui/material/Unstable_Grid2';",
            content
        )
        modified = True

    # Pattern 2: import { ..., Grid, ... } from '@mui/material';
    elif re.search(r"import\s*{[^}]*\bGrid\b[^}]*}\s*from\s*['\"]@mui/material['\"];", content):
        # Remove Grid from the import list
        content = re.sub(
            r"(\bGrid\b\s*,\s*)",  # Grid,
            "",
            content
        )
        content = re.sub(
            r"(,\s*\bGrid\b)",  # , Grid
            "",
            content
        )

        # Add Grid2 import if not already present
        if not has_grid2_import and uses_grid2:
            # Add Grid2 import after the MUI material import
            lines = content.split('\n')
            new_lines = []
            grid2_added = False

            for i, line in enumerate(lines):
                new_lines.append(line)
                if not grid2_added and "@mui/material" in line and "import" in line:
                    # Add Grid2 import after this line
                    new_lines.append("import Grid2 from '@mui/material/Unstable_Grid2';")
                    grid2_added = True

            content = '\n'.join(new_lines)

        modified = True

    return content, modified

def migrate_grid_usage(content: str) -> Tuple[str, int]:
    """
    Replace <Grid with <Grid2 and </Grid> with </Grid2>.
    Remove 'container' and 'item' props.
    Returns (modified_content, num_replacements).
    """
    replacements = 0

    # Replace <Grid with <Grid2 (opening tags)
    pattern = r'<Grid(\s)'
    matches = len(re.findall(pattern, content))
    content = re.sub(pattern, r'<Grid2\1', content)
    replacements += matches

    # Replace </Grid> with </Grid2> (closing tags)
    pattern = r'</Grid>'
    matches = len(re.findall(pattern, content))
    content = re.sub(pattern, '</Grid2>', content)
    replacements += matches

    # Remove 'container' prop
    content = re.sub(r'\s+container\s+', ' ', content)
    content = re.sub(r'\s+container>', '>', content)

    # Remove 'item' prop
    content = re.sub(r'\s+item\s+', ' ', content)
    content = re.sub(r'\s+item>', '>', content)
    content = re.sub(r'\s+item=["\'][^"\']*["\']', '', content)

    # Clean up double spaces
    content = re.sub(r'  +', ' ', content)

    return content, replacements

def migrate_file(file_path: Path) -> Tuple[bool, int]:
    """
    Migrate a single file.
    Returns (success, num_replacements).
    """
    try:
        content = file_path.read_text()
        original_content = content

        # Step 1: Migrate imports
        content, import_modified = migrate_grid_import(content)

        # Step 2: Migrate usage
        content, replacements = migrate_grid_usage(content)

        # Only write if content changed
        if content != original_content:
            file_path.write_text(content)
            return True, replacements

        return False, 0

    except Exception as e:
        print(f"Error migrating {file_path}: {e}", file=sys.stderr)
        return False, 0

def main():
    """Main migration function."""
    src_dir = Path('/workspaces/careercopilot/frontend/src')

    if not src_dir.exists():
        print(f"Error: {src_dir} does not exist", file=sys.stderr)
        sys.exit(1)

    print("=== MUI Grid to Grid2 Migration ===\n")

    files = find_files_with_grid(src_dir)
    print(f"Found {len(files)} files with Grid usage\n")

    total_files_modified = 0
    total_replacements = 0

    for file in files:
        relative_path = file.relative_to(src_dir.parent)
        success, replacements = migrate_file(file)

        if success:
            print(f"✓ {relative_path} ({replacements} replacements)")
            total_files_modified += 1
            total_replacements += replacements
        else:
            print(f"  {relative_path} (no changes)")

    print(f"\n=== Migration Complete ===")
    print(f"Modified: {total_files_modified} files")
    print(f"Total replacements: {total_replacements}")
    print(f"\nNext steps:")
    print(f"1. Review changes: git diff")
    print(f"2. Test build: cd frontend && yarn build")
    print(f"3. Test application for layout issues")

if __name__ == '__main__':
    main()
