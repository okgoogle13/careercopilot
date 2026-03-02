#!/bin/bash
# Add Grid2 imports to files that use Grid2 but don't have the import

cd /workspaces/careercopilot/frontend

for file in \
  "src/components/career/JobSearch.tsx" \
  "src/components/ui/layout.tsx" \
  "src/pages/DashboardPage.tsx" \
  "src/pages/DocumentsPage.tsx" \
  "src/pages/KscGeneratorPage.tsx" \
  "src/pages/OpportunitiesPage.tsx" \
  "src/pages/SettingsPage.tsx"; do

  if [ -f "$file" ]; then
    # Check if file has @mui/material import and doesn't have Grid2 import
    if grep -q "@mui/material" "$file" && ! grep -q "import Grid2" "$file"; then
      # Find the first line with @mui/material import
      line_num=$(grep -n "from '@mui/material'" "$file" | head -1 | cut -d':' -f1)
      if [ -n "$line_num" ]; then
        sed -i "${line_num}a import Grid2 from '@mui/material/Unstable_Grid2';" "$file"
        echo "✓ Added Grid2 import to $file"
      fi
    else
      echo "  Skipped $file (already has Grid2 import or no MUI imports)"
    fi
  else
    echo "  File not found: $file"
  fi
done

echo ""
echo "Done adding Grid2 imports"
