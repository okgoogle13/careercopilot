#!/bin/bash
# update-imports.sh
# Updates imports and component names across the codebase

set -e

BASE_DIR="frontend/src"
DESIGN_SYSTEM="@/components/design-system"

echo "🔄 Updating imports and component names..."

# Function to update a single file
update_file() {
  local file=$1
  local temp_file="${file}.tmp"
  
  # Create a backup
  cp "$file" "${file}.bak"
  
  # Process the file
  perl -p0e '
    # Update import paths
    s|@/components/(ui|electric)/|@/components/design-system/|g;
    
    # Update import statements (remove Electric prefix)
    s/import \{ (\s*)Electric([A-Z][a-zA-Z0-9]*)(\s*)(,|\})/import { \1\2\3\4/g;
    s/import \{ (\s*)Electric([A-Z][a-zA-Z0-9]*)(\s+as\s+[^,}]+)(,|\})/import { \1\2\3\4/g;
    
    # Update type imports
    s/import type \{ (\s*)Electric([A-Z][a-zA-Z0-9]*)(\s*)(,|\})/import type { \1\2\3\4/g;
    
    # Update JSX tags
    s/<(\/?)Electric([A-Z][a-zA-Z0-9]*)(\s|>)/<\1\2\3/g;
  ' "$file" > "$temp_file"
  
  # Only update if changes were made
  if ! cmp -s "$file" "$temp_file"; then
    mv "$temp_file" "$file"
    echo "  ✅ Updated: ${file#$BASE_DIR/}"
  else
    rm "$temp_file"
    # Remove backup if no changes were needed
    rm "${file}.bak"
  fi
}

export -f update_file
export BASE_DIR

echo "📂 Finding and updating files..."
# Find all relevant files and process them
find "$BASE_DIR" -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/.next/*" \
  -not -path "*/_legacy/*" | while read -r file; do
    update_file "$file"
  done

echo "\n🔍 Verifying changes with TypeScript..."
cd frontend
if command -v yarn &> /dev/null; then
  yarn tsc --noEmit
else
  npx tsc --noEmit
fi

echo "\n✅ Import update complete!"
echo "\nNext steps:"
echo "1. Review the TypeScript output above for any remaining issues"
echo "2. Test your application thoroughly"
echo "3. If everything looks good, you can remove the .bak files:"
echo "   find $BASE_DIR -name \"*.bak\" -delete"
