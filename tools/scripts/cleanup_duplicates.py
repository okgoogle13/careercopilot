#!/usr/bin/env python3
import os
import shutil
import re
import argparse

# Patterns for common macOS/Sync duplicates
PATTERNS = [
    re.compile(r'.* \d+\.[a-zA-Z0-9]+$'),  # file 2.png, file 12.tsx
    re.compile(r'.* copy\.[a-zA-Z0-9]+$'), # file copy.png
    re.compile(r'.* \d+$'),                # folder 2
    re.compile(r'.* copy$')                 # folder copy
]

def is_duplicate(name):
    for pattern in PATTERNS:
        if pattern.match(name):
            return True
    return False

def cleanup_duplicates(root_dir, dry_run=True):
    total_files_removed = 0
    total_dirs_removed = 0
    total_size_recovered = 0

    print(f"{' [DRY RUN] ' if dry_run else ' [EXECUTION] '} Scanning: {root_dir}")
    print("-" * 60)

    # We use topdown=True so we can modify dirs in-place to skip them
    for root, dirs, files in os.walk(root_dir, topdown=True):
        # Skip search/system directories for speed and safety
        dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '.venv', '__pycache__', '.next']]

        # Check files
        for name in files:
            if is_duplicate(name):
                filepath = os.path.join(root, name)
                try:
                    size = os.path.getsize(filepath)
                    total_size_recovered += size
                    total_files_removed += 1
                    if dry_run:
                        print(f"File (Dry-run): {filepath} ({size/1024:.1f} KB)")
                    else:
                        os.remove(filepath)
                        print(f"Removed File: {filepath}")
                except Exception as e:
                    print(f"Error handling file {filepath}: {e}")

        # Check directories
        for name in dirs:
            if is_duplicate(name):
                dirpath = os.path.join(root, name)
                try:
                    # Calculate directory size
                    dir_size = 0
                    for d_root, d_dirs, d_files in os.walk(dirpath):
                        for f in d_files:
                            dir_size += os.path.getsize(os.path.join(d_root, f))

                    total_size_recovered += dir_size
                    total_dirs_removed += 1

                    if dry_run:
                        print(f"Dir  (Dry-run): {dirpath} ({dir_size/1024:.1f} KB)")
                    else:
                        shutil.rmtree(dirpath)
                        print(f"Removed Dir:  {dirpath}")
                except Exception as e:
                    print(f"Error handling dir {dirpath}: {e}")

    print("-" * 60)
    print(f"Summary:")
    print(f"  Files identified/removed: {total_files_removed}")
    print(f"  Dirs identified/removed:  {total_dirs_removed}")
    print(f"  Total space recovery:     {total_size_recovered / (1024*1024):.2f} MB")

    if dry_run and (total_files_removed > 0 or total_dirs_removed > 0):
        print("\nTo actually delete these files, run:")
        print(f"python3 {os.path.basename(__file__)} --execute")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Cleanup macOS/Sync duplicate files and folders")
    parser.add_argument("--execute", action="store_true", help="Actually perform deletion")
    parser.add_argument("--path", default=".", help="Root directory to scan (default: current)")

    args = parser.parse_args()

    root_path = os.path.abspath(args.path)
    cleanup_duplicates(root_path, dry_run=not args.execute)
