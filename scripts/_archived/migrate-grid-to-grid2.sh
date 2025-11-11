#!/bin/bash
# Script to migrate Material-UI Grid to Grid2
# This fixes the deprecated 'item' prop issue in MUI v6+

set -euo pipefail

echo "=== MUI Grid to Grid2 Migration Script ==="
echo ""

# Get the list of files with Grid usage
FILES=$(grep -rl "from '@mui/material'" frontend/src --include="*.tsx" --include="*.ts" | xargs grep -l "Grid" | sort -u)

echo "Found $(echo "$FILES" | wc -l) files with Grid imports"
echo ""

# Counters
updated_files=0

for file in $FILES; do
  # Check if file contains Grid import
  if grep -q "^import.*Grid.*from '@mui/material'" "$file"; then
    echo "Processing: $file"

    # Create backup
    cp "$file" "$file.bak"

    # Replace Grid import with Grid2
    # Handle various import patterns:
    # 1. Grid alone
    sed -i "s/^import { Grid } from '@mui\/material';/import Grid2 from '@mui\/material\/Unstable_Grid2';/g" "$file"

    # 2. Grid with other imports - replace Grid with Grid2 import and keep others
    # Pattern: import { ..., Grid, ... } from '@mui/material';
    if grep -q "import {.*Grid.*} from '@mui/material'" "$file"; then
      # Remove Grid from the import list
      sed -i "s/\(import {[^}]*\),\s*Grid\s*,\([^}]*} from '@mui\/material'\)/\1,\2/g" "$file"
      sed -i "s/\(import {\s*\)Grid\s*,\s*\([^}]*} from '@mui\/material'\)/\1\2/g" "$file"
      sed -i "s/\(import {[^}]*\),\s*Grid\s*\(} from '@mui\/material'\)/\1\2/g" "$file"

      # Add Grid2 import at the top after existing MUI imports
      sed -i "/from '@mui\/material'/a import Grid2 from '@mui/material/Unstable_Grid2';" "$file"
    fi

    # Replace all <Grid with <Grid2
    sed -i 's/<Grid\([ >]\)/<Grid2\1/g' "$file"

    # Replace all </Grid> with </Grid2>
    sed -i 's/<\/Grid>/<\/Grid2>/g' "$file"

    # Replace all Grid props patterns
    # Handle container prop
    sed -i 's/\(<Grid2[^>]*\)container/\1/g' "$file"

    # The item prop is removed - just delete it
    sed -i 's/\(<Grid2[^>]*\)item[= ]/\1/g' "$file"
    sed -i 's/\(<Grid2[^>]*\)item>/\1>/g' "$file"

    # Clean up any double spaces
    sed -i 's/  */ /g' "$file"

    # Remove backup if changes were successful
    if [ -f "$file.bak" ]; then
      rm "$file.bak"
    fi

    ((updated_files++))
  fi
done

echo ""
echo "=== Migration Complete ==="
echo "Updated $updated_files files"
echo ""
echo "Next steps:"
echo "1. Review the changes with 'git diff'"
echo "2. Run 'yarn build' to verify"
echo "3. Test the application for layout issues"
