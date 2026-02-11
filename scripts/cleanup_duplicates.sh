#!/bin/bash

# cleanup_duplicates.sh - Systematically find and remove macOS " 2.*" duplicate files.

DRY_RUN=true
TARGET_DIR="."

usage() {
    echo "Usage: $0 [--delete] [target_directory]"
    echo "  --delete    Actually delete the files (default is dry-run)"
    echo "  --help      Show this help message"
    exit 1
}

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --delete) DRY_RUN=false ;;
        --help) usage ;;
        *) TARGET_DIR="$1" ;;
    esac
    shift
done

echo "Scanning for duplicate files (* 2.*) in $TARGET_DIR..."
echo "Excluding .git, node_modules, and .venv..."

# Find duplicate files
# Note: Using -print0 and read -d '' to safely handle filenames with spaces
find "$TARGET_DIR" -type f -name "* 2.*" \
    -not -path "*/.git/*" \
    -not -path "*/node_modules/*" \
    -not -path "*/.venv/*" \
    -print0 | while IFS= read -r -d '' file; do
    
    if [ "$DRY_RUN" = true ]; then
        echo "[DRY-RUN] Would delete: $file"
    else
        echo "Deleting: $file"
        rm "$file"
    fi
done

if [ "$DRY_RUN" = true ]; then
    echo "----------------------------------------------------"
    echo "Scan complete. No files were deleted."
    echo "Run with --delete to actually remove these files."
else
    echo "----------------------------------------------------"
    echo "Cleanup complete. Files have been deleted."
fi
