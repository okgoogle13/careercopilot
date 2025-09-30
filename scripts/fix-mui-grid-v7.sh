#!/bin/bash
# Fix Material-UI Grid v7 compatibility issues
# In MUI v7, Grid no longer supports the 'item' prop - use Grid2 instead

set -e

echo "🔧 Fixing Material-UI Grid v7 compatibility issues..."

cd /Applications/careercopilot/frontend

# Find all TypeScript/TSX files with Grid item usage
FILES=$(find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "Grid item" || true)

if [ -z "$FILES" ]; then
  echo "✅ No Grid item issues found!"
  exit 0
fi

echo "Found $(echo "$FILES" | wc -l | tr -d ' ') files with Grid item usage"

# For each file, replace Grid with Grid2 and update imports
for file in $FILES; do
  echo "Processing: $file"

  # Check if file imports Grid from @mui/material
  if grep -q "import.*Grid.*from '@mui/material'" "$file"; then
    # Replace Grid import with Grid2
    sed -i '' "s/import { Grid }/import { Grid2 }/g" "$file"
    sed -i '' "s/import { \(.*\), Grid, \(.*\) }/import { \1, Grid2, \2 }/g" "$file"
    sed -i '' "s/import { \(.*\), Grid }/import { \1, Grid2 }/g" "$file"
    sed -i '' "s/import { Grid, \(.*\) }/import { Grid2, \1 }/g" "$file"
    sed -i '' "s/from '@mui\/material\/Grid'/from '@mui\/material\/Grid2'/g" "$file"

    # Replace Grid usage with Grid2
    sed -i '' "s/<Grid /<Grid2 /g" "$file"
    sed -i '' "s/<\/Grid>/<\/Grid2>/g" "$file"

    echo "  ✅ Updated imports and usage in $file"
  fi
done

echo ""
echo "✅ Grid v7 migration complete!"
echo "📝 Please review changes and run: yarn type-check"