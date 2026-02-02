#!/usr/bin/env bash
set -euo pipefail

# Script to rename all .md files to lowercase (excluding /archive/ directories)
# This ensures compliance with scripts/check-docs.sh

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Converting all .md filenames to lowercase (excluding /archive/)..."

# Find all .md files, exclude /archive/ paths, and rename to lowercase
find "$ROOT/docs" -type f -name "*.md" | grep -v "/archive/" | while read -r file; do
  dir=$(dirname "$file")
  base=$(basename "$file")
  lower=$(echo "$base" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr ':' '-')

  if [ "$base" != "$lower" ]; then
    newpath="$dir/$lower"
    echo "Renaming: $file -> $newpath"
    mv "$file" "$newpath"
  fi
done

echo "✅ Filename conversion complete!"
