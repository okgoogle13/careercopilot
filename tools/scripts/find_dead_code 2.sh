#!/bin/bash
# Quick Dead Code Finder
# Finds files that are likely unused based on simple heuristics

echo "=== Finding potentially unused TypeScript/React files ==="
echo ""

# Find .tsx/.ts files that don't have any imports referencing them
echo "Files with no imports (potential dead code):"
for file in $(find frontend/src -name "*.tsx" -o -name "*.ts" | grep -v ".test." | grep -v ".spec."); do
    filename=$(basename "$file" | sed 's/\.[^.]*$//')
    # Check if this filename appears in any import statement
    count=$(grep -r "from.*['\"].*$filename" frontend/src --include="*.ts" --include="*.tsx" | wc -l)
    if [ "$count" -eq "0" ]; then
        echo "  - $file (0 imports found)"
    fi
done

echo ""
echo "=== Finding unused CSS files ==="
for css in $(find frontend/src -name "*.css"); do
    cssname=$(basename "$css")
    count=$(grep -r "$cssname" frontend/src --include="*.tsx" --include="*.ts" | wc -l)
    if [ "$count" -eq "0" ]; then
        echo "  - $css (not imported anywhere)"
    fi
done
