#!/bin/bash
# Purpose: Lists frontend files and folders to identify structural flaws and redundant components.
# Usage: ./scripts/audit-frontend-structure.sh [path_to_frontend]

# Default to 'frontend/src' if no argument provided
TARGET_DIR="${1:-frontend/src}"

if [ ! -d "$TARGET_DIR" ]; then
  echo "Error: Directory '$TARGET_DIR' not found."
  echo "Usage: $0 [path_to_frontend]"
  exit 1
fi

echo "========================================================"
echo "Frontend Structure Audit: $TARGET_DIR"
echo "========================================================"

echo ""
echo "--- 1. High-Level Folder Structure (Depth 2) ---"
echo "Check for: Inconsistent naming (camelCase vs kebab-case), vague folder names (e.g., 'utils' inside 'components')."
find "$TARGET_DIR" -maxdepth 2 -type d -not -path '*/.*' -not -path '*/node_modules*' | sort | sed 's/[^/]*\//  /g'

echo ""
echo "--- 2. Potential Redundant/Empty Directories ---"
echo "Check for: Folders that served a purpose once but are now empty."
find "$TARGET_DIR" -type d -empty -not -path '*/.*'

echo ""
echo "--- 3. Component Files ( Grouped by Directory ) ---"
echo "Check for: "
echo "  - Components defined outside of their domain folders"
echo "  - Duplicate naming (e.g., UserProfile.tsx vs UserProfileCard.tsx)"
echo "  - Mixed file extensions (.js mixed with .tsx)"
find "$TARGET_DIR" -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" -o -name "*.css" -o -name "*.module.css" \) -not -path "*/node_modules/*" -not -path "*/dist/*" | sort

echo ""
echo "--- 4. 'Todo' or 'Deprecated' Markers in Comments ---"
echo "Check for: Files explicitly marked for deletion or refactoring."
grep -rE "TODO|FIXME|DEPRECATED" "$TARGET_DIR" --include=*.{ts,tsx,js,jsx} | cut -c 1-100

echo ""
echo "========================================================"
echo "Audit Complete."
