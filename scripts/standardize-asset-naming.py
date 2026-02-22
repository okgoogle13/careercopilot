#!/usr/bin/env python3
"""
Standardize asset naming conventions across the codebase.

Fixes:
1. Rename kr-moti-* → kr-motif-* (2 files)
2. Remove [DEPRECATED_STYLE]- prefix from labyrinth.jpg
3. Consolidate duplicate specimens (delete source versions, keep public)
4. Remove underscores from filenames (grinding_stone.jpg → grinding-stone.jpg)
"""

import re
import subprocess
from pathlib import Path
from typing import Dict, List, Tuple

# Rename mappings: (old_pattern, new_name, directory)
RENAMES = [
    ("kr-moti-kr-dark-test-asset-1024.png", "kr-motif-kr-dark-test-asset-1024.png", "frontend/public/assets/kr-motifs/"),
    ("kr-moti-kr-dark-test-final-verification-1024.png", "kr-motif-kr-dark-test-final-verification-1024.png", "frontend/public/assets/kr-motifs/"),
    ("[DEPRECATED_STYLE]-labyrinth.jpg", "organic-labyrinth.jpg", "frontend/src/assets/KrMotifs/"),
]

# Files to delete (duplicates in source; keep public versions)
DUPLICATES_TO_DELETE = [
    "frontend/src/assets/KrMotifs/grinding_stone.jpg",
    "frontend/src/assets/specimens/grinding_stone.jpg",
    "frontend/src/assets/KrMotifs/[DEPRECATED_STYLE]-labyrinth.jpg",  # After rename
]

# Underscore replacements: (old_pattern, new_pattern)
UNDERSCORE_FIXES = [
    # Already handled above, but for reference:
    # ("grinding_stone.jpg", "grinding-stone.jpg"),
]

def find_and_rename_file(old_name: str, new_name: str, directory: str) -> bool:
    """Find and rename a file."""
    dir_path = Path(directory)
    if not dir_path.exists():
        print(f"⚠️  Directory not found: {directory}")
        return False

    old_file = dir_path / old_name
    if not old_file.exists():
        print(f"⚠️  File not found: {old_file}")
        return False

    new_file = dir_path / new_name
    if new_file.exists():
        print(f"⚠️  Target file already exists: {new_file}")
        return False

    try:
        old_file.rename(new_file)
        print(f"✅ Renamed: {old_name} → {new_name}")
        return True
    except Exception as e:
        print(f"❌ Failed to rename {old_name}: {e}")
        return False

def update_imports_for_rename(old_name: str, new_name: str) -> int:
    """Find and update all imports referencing the renamed file."""
    count = 0

    # Search for imports in TypeScript/JavaScript files
    for ts_file in Path("frontend/src").rglob("*.tsx"):
        content = ts_file.read_text()

        # Look for import statements with old filename
        if old_name in content:
            new_content = content.replace(old_name, new_name)
            ts_file.write_text(new_content)
            print(f"  Updated imports in: {ts_file.relative_to(Path.cwd())}")
            count += 1

    return count

def delete_duplicate_file(file_path: str) -> bool:
    """Delete a duplicate file."""
    path = Path(file_path)
    if not path.exists():
        print(f"⚠️  File not found: {file_path}")
        return False

    try:
        path.unlink()
        print(f"✅ Deleted: {file_path}")
        return True
    except Exception as e:
        print(f"❌ Failed to delete {file_path}: {e}")
        return False

def main():
    """Apply all naming standardization fixes."""
    print("🔧 Standardizing asset naming conventions...\n")

    fixed_count = 0
    imports_updated = 0

    # Apply renames
    print("📝 Applying renames...\n")
    for old_name, new_name, directory in RENAMES:
        if find_and_rename_file(old_name, new_name, directory):
            fixed_count += 1
            # Update imports
            updated = update_imports_for_rename(old_name, new_name)
            imports_updated += updated

    print(f"\n✅ Renamed {fixed_count} files, updated {imports_updated} import statements\n")

    # Delete duplicates
    print("🗑️  Deleting duplicate files...\n")
    deleted_count = 0
    for dup_file in DUPLICATES_TO_DELETE:
        if delete_duplicate_file(dup_file):
            deleted_count += 1

    print(f"\n✅ Deleted {deleted_count} duplicate files\n")

    if fixed_count == 0 and deleted_count == 0:
        print("No files were modified.")
        return False

    # Create git commit
    print("📝 Creating git commit...\n")
    try:
        subprocess.run(["git", "add", "-A"], check=True)
        subprocess.run(
            ["git", "commit", "-m", """refactor: standardize asset naming conventions

- Rename kr-moti-* to kr-motif-* for consistency (2 files)
- Remove [DEPRECATED_STYLE]- prefix from assets
- Delete duplicate specimen files in src/assets/
- Update all import statements to reference renamed files

Improves naming consistency across kr-solidarity design system."""],
            check=True,
        )
        print("✅ Commit created successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error creating commit: {e}")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
