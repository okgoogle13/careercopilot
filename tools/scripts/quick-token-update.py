#!/usr/bin/env python3
"""
Northcote Token Migration Script
Automatically updates old token names to new contemporary Australian naming.
"""

import os
import sys
from pathlib import Path
from typing import List, Tuple, Dict

TOKEN_MAPPINGS = {
    "[DEPRECATED_STYLE] Night": "Asphalt Black",
    "[DEPRECATED_STYLE]-night": "asphalt-black",
    "specimen_night": "asphalt_black",
    "Parchment": "Paper White",
    "parchment": "paper-white",
    "[DEPRECATED_STYLE] Crimson": "[DEPRECATED_STYLE] Red",
    "[DEPRECATED_STYLE]-crimson": "[DEPRECATED_STYLE]-red",
    "waratah_crimson": "waratah_red",
    "Eucalypt Smoke": "Concrete Grey",
    "eucalypt-smoke": "concrete-grey",
    "eucalypt_smoke": "concrete_grey",
    "Flannel Flower": "Concrete Grey",
    "flannel-flower": "concrete-grey",
    "flannel_flower": "concrete_grey",
    "#141218": "#1A1714",
    "#E6E0E9": "#F5F0E8"
}

SCAN_PATTERNS = [
    "**/*.md",
    "**/*.css",
    "**/*.json",
    "**/*.tsx",
    "**/*.ts",
    "**/*.jsx",
    "**/*.js"
]

EXCLUDE_DIRS = [
    "node_modules",
    ".git",
    "dist",
    "build",
    ".next",
    "__pycache__",
    "venv",
    ".venv"
]

def find_files(root_dir: str = ".") -> List[Path]:
    root = Path(root_dir)
    files: List[Path] = []
    for pattern in SCAN_PATTERNS:
        for file_path in root.glob(pattern):
            if any(excluded in file_path.parts for excluded in EXCLUDE_DIRS):
                continue
            if file_path.is_file():
                files.append(file_path)
    return files

def scan_file(file_path: Path):
    matches = []
    try:
        content = file_path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, PermissionError):
        return matches

    lines = content.split("\n")
    for line_num, line in enumerate(lines, 1):
        for old_token, new_token in TOKEN_MAPPINGS.items():
            if old_token in line:
                matches.append((line_num, old_token, new_token, line.strip()))
    return matches

def update_file(file_path: Path, dry_run: bool = True) -> int:
    try:
        content = file_path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, PermissionError):
        return 0

    original_content = content
    for old_token, new_token in TOKEN_MAPPINGS.items():
        content = content.replace(old_token, new_token)

    if not dry_run and content != original_content:
        file_path.write_text(content, encoding="utf-8")
    return 0 if content == original_content else 1

def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Migrate Northcote design tokens from [DEPRECATED_STYLE] [DEPRECATED_STYLE] to Contemporary Australian naming"
    )
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without applying them")
    parser.add_argument("--apply", action="store_true", help="Apply all changes")
    parser.add_argument("--root", default=".", help="Root directory to scan")

    args = parser.parse_args()

    if not args.dry_run and not args.apply:
        print("⚠️  Please specify --dry-run or --apply")
        sys.exit(1)

    print("🔍 Scanning for old token references...\n")
    files = find_files(args.root)
    print(f"📁 Found {len(files)} files to check\n")

    all_matches: Dict[Path, list] = {}
    for file_path in files:
        matches = scan_file(file_path)
        if matches:
            all_matches[file_path] = matches

    if not all_matches:
        print("✅ No old token references found!")
        return

    print(f"📝 Found references in {len(all_matches)} files:\n")
    for file_path, matches in all_matches.items():
        print(f"  {file_path}:")
        for line_num, old_token, new_token, line_content in matches[:3]:
            print(f"    Line {line_num}: {old_token} → {new_token}")
        if len(matches) > 3:
            print(f"    ... and {len(matches) - 3} more")
        print()

    if args.apply:
        print("🔧 Applying changes...\n")
        updated_files = 0
        for file_path in all_matches.keys():
            changed = update_file(file_path, dry_run=False)
            if changed:
                print(f"  ✓ Updated: {file_path}")
                updated_files += 1
        print(f"\n✅ Updated {updated_files} files")
    else:
        print("💡 Run with --apply to make these changes")
        print("   Example: python scripts/quick-token-update.py --apply")

if __name__ == "__main__":
    main()
