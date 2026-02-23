#!/bin/bash
# simple-migrate.sh
# A more reliable migration script for consolidating UI components

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

echo "🚀 Starting simplified migration..."
echo "Backup will be saved to: $BACKUP_DIR"

# Step 1: Backup original directories
echo "\n🔒 Backing up original directories..."
cp -r "$UI_DIR" "$BACKUP_DIR/"
cp -r "$ELECTRIC_DIR" "$BACKUP_DIR/"

# Step 2: Create design system structure
echo "\n🏗️  Creating design system structure..."
mkdir -p "$DESIGN_SYSTEM_DIR"

# Step 3: Copy Electric components (preferred)
echo "\n🔌 Copying Electric components..."
if [ -d "$ELECTRIC_DIR" ]; then
  for comp in "$ELECTRIC_DIR"/*; do
    if [ -d "$comp" ]; then
      comp_name=$(basename "$comp")
      # Remove 'Electric' prefix and convert to kebab-case
      new_name=$(echo "$comp_name" | sed 's/Electric//' | sed 's/\([a-z0-9]\)\([A-Z]\)/\1-\2/g' | tr '[:upper:]' '[:lower:]')
      echo "  📦 $comp_name -> $new_name"
      cp -r "$comp" "$DESIGN_SYSTEM_DIR/$new_name"
    fi
  done
fi

# Step 4: Copy unique UI components
echo "\n🎨 Copying unique UI components..."
if [ -d "$UI_DIR" ]; then
  for comp in "$UI_DIR"/*; do
    if [ -d "$comp" ]; then
      comp_name=$(basename "$comp")
      # Skip M3 prefixed components and already copied components
      if [[ ! "$comp_name" =~ ^M3 ]] && [ ! -d "$DESIGN_SYSTEM_DIR/$comp_name" ]; then
        echo "  📦 $comp_name"
        cp -r "$comp" "$DESIGN_SYSTEM_DIR/"
      fi
    fi
  done
fi

echo "\n✅ Migration complete!"
echo "A backup of your original components has been saved to: $BACKUP_DIR"
echo "\nNext steps:"
echo "1. Manually update imports in your codebase to use the new paths"
echo "2. Test your application thoroughly"
echo "3. Once verified, you can remove the old directories:"
echo "   rm -rf $UI_DIR $ELECTRIC_DIR"
echo "\nTo update imports, you can use your IDE's find and replace with these patterns:"
echo "- Replace: @/components/ui/ -> @/components/design-system/"
echo "- Replace: @/components/electric/ -> @/components/design-system/"
echo "- Replace: import { Electric(.*) } -> import { \1 }"
echo "- Replace: <Electric(.*)> -> <\1>"
echo "- Replace: </Electric(.*)> -> </\1>"
