#!/bin/bash
# migrate-to-design-system.sh
# Purpose: Migrate UI and Electric components to a unified design-system

set -e

# Base directories
BASE_DIR="frontend/src/components"
DESIGN_SYSTEM_DIR="$BASE_DIR/design-system"
UI_DIR="$BASE_DIR/ui"
ELECTRIC_DIR="$BASE_DIR/electric"
BACKUP_DIR="$BASE_DIR/_backup_$(date +%Y%m%d_%H%M%S)"

# Create necessary directories
mkdir -p "$DESIGN_SYSTEM_DIR"
mkdir -p "$BACKUP_DIR"

echo "🚀 Starting migration to unified design system..."
echo "Backup will be saved to: $BACKUP_DIR"

# Function to create a backup
backup_component() {
  local src=$1
  local dest="$BACKUP_DIR/$(basename $src)"
  if [ -e "$src" ]; then
    echo "🔒 Backing up $src to $dest"
    cp -r "$src" "$dest"
  fi
}

# Function to migrate a component
migrate_component() {
  local src=$1
  local dest=$2

  if [ -d "$src" ]; then
    echo "🔄 Migrating $(basename $src) to $dest"

    # Create destination directory if it doesn't exist
    mkdir -p "$(dirname "$dest")"

    # Copy component files (excluding tests and stories for now)
    find "$src" -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" \) \
      -not -path "*/node_modules/*" \
      -not -path "*/__tests__/*" \
      -not -name "*.stories.*" \
      -not -name "*.test.*" | while read -r file; do

      # Create the target directory structure
      rel_path="${file#$src/}"
      target_dir="$(dirname "$dest/$(basename "$src")/$rel_path")"
      mkdir -p "$target_dir"

      # Copy and update the file
      cp "$file" "$target_dir/$(basename "$file")"

      # Update imports in the file using perl for better regex support
      perl -i -pe 's|@/components/(ui|electric)/|@/components/design-system/|g' "$target_dir/$(basename "$file")"
    done
  fi
}

# Backup original directories
backup_component "$UI_DIR"
backup_component "$ELECTRIC_DIR"

# Migrate Electric components (preferred)
echo "\n🔌 Migrating Electric components..."
for comp in "$ELECTRIC_DIR"/*; do
  if [ -d "$comp" ]; then
    comp_name=$(basename "$comp")
    # Remove 'Electric' prefix and convert to kebab-case
    new_name=$(echo "$comp_name" | sed -E 's/Electric//' | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]')
    migrate_component "$comp" "$DESIGN_SYSTEM_DIR/$new_name"
  fi
done

# Migrate unique UI components that don't exist in Electric
echo "\n🎨 Migrating unique UI components..."
for comp in "$UI_DIR"/*; do
  if [ -d "$comp" ]; then
    comp_name=$(basename "$comp")
    # Skip M3 prefixed components as we're using Electric's versions
    if [[ ! "$comp_name" =~ ^M3 ]] && [ ! -d "$DESIGN_SYSTEM_DIR/$comp_name" ]; then
      migrate_component "$comp" "$DESIGN_SYSTEM_DIR/$comp_name"
    fi
  fi
done

# Update imports in all files
echo "\n🔄 Updating imports across the codebase..."
find "frontend/src" -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/_legacy/*" \
  -not -path "*/.next/*" | while read -r file; do

  # Make a backup of the file
  cp "$file" "${file}.bak"

  # Update import paths (handle both single and double quotes)
  perl -i -pe 's|@/components/(ui|electric)/|@/components/design-system/|g' "$file"

  # Update component names (ElectricButton -> Button, etc.)
  perl -i -pe 's/import \{ ?Electric([A-Za-z]+) ?\}/import { \1 }/g' "$file"
  perl -i -pe 's/import \{ ?Electric([A-Za-z]+) ?as ([^}]+)\}/import { \1 as \2 }/g' "$file"
  perl -i -pe 's/<Electric([A-Za-z]+)([ >])/<\1\2/g' "$file"
  perl -i -pe 's/<\/Electric([A-Za-z]+)>/<\/\1>/g' "$file"

  # Clean up backup if no changes were made
  if cmp -s "$file" "${file}.bak"; then
    rm "${file}.bak"
  fi
done

# Create an index file for the design system
echo "\n📄 Creating design system index file..."
cat > "$DESIGN_SYSTEM_DIR/index.ts" << 'EOL'
// Design System Entry Point
// Re-export all components for cleaner imports

// Core Components
export * from './alert';
export * from './avatar';
export * from './badge';
export * from './button';
export * from './card';
export * from './dialog';
// Add more exports as needed

// Hooks & Utilities
export * from './hooks';
EOL

echo "\n✅ Migration complete!"
echo "A backup of your original components has been saved to: $BACKUP_DIR"
echo "\nNext steps:"
echo "1. Review the changes in the design-system directory"
echo "2. Test your application thoroughly"
echo "3. Once verified, you can safely remove the old ui/ and electric/ directories"
echo "4. Update your documentation to reference the new component paths"

echo "\nTo remove the old directories after verification, run:"
echo "rm -rf $UI_DIR $ELECTRIC_DIR"
