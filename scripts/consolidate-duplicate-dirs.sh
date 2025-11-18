#!/bin/bash
# Consolidate Duplicate Component Directories
# Specifically handles the Ksc/KSC duplicate issue

set -e

echo "🔧 Component Directory Consolidation Tool"
echo "========================================="
echo ""

COMPONENTS_DIR="./frontend/src/components"
BACKUP_DIR="./backups/component-consolidation-$(date +%Y%m%d-%H%M%S)"

# Create backup
echo "📦 Creating backup at: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"
cp -r "$COMPONENTS_DIR" "$BACKUP_DIR/"
echo "✅ Backup created"
echo ""

# Function to consolidate two directories
consolidate_dirs() {
    local source_dir="$1"
    local target_dir="$2"
    local dir_name="$3"

    echo "🔄 Consolidating: $source_dir -> $target_dir"

    if [ ! -d "$source_dir" ]; then
        echo "⚠️  Source directory not found: $source_dir"
        return 1
    fi

    if [ ! -d "$target_dir" ]; then
        echo "📁 Creating target directory: $target_dir"
        mkdir -p "$target_dir"
    fi

    # Move files from source to target
    echo "  Moving files..."
    if [ "$(ls -A "$source_dir")" ]; then
        mv "$source_dir"/* "$target_dir/" 2>/dev/null || true
    fi

    # Remove empty source directory
    if [ -d "$source_dir" ] && [ ! "$(ls -A "$source_dir")" ]; then
        echo "  Removing empty source directory..."
        rmdir "$source_dir"
    fi

    echo "✅ Consolidated $dir_name"
    echo ""
}

# Function to update imports in files
update_imports() {
    local old_path="$1"
    local new_path="$2"

    echo "🔍 Updating imports: $old_path -> $new_path"

    # Find all TypeScript/JavaScript files
    find ./frontend/src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
        -exec sed -i.bak "s|from ['\"].*${old_path}|from '${new_path}|g" {} \;

    # Also update relative imports
    find ./frontend/src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
        -exec sed -i.bak "s|from ['\"]\\.\\./${old_path}|from '../${new_path}|g" {} \;

    # Clean up backup files
    find ./frontend/src -name "*.bak" -delete

    echo "✅ Import updates complete"
    echo ""
}

# Main consolidation tasks
echo "🎯 Phase 1: Consolidate Ksc/KSC Directories"
echo "-------------------------------------------"

KSC_LOWER="$COMPONENTS_DIR/features/Ksc"
KSC_UPPER="$COMPONENTS_DIR/features/KSC"
KSC_TARGET="$COMPONENTS_DIR/features/ksc"

# Check which directories exist
if [ -d "$KSC_LOWER" ] && [ -d "$KSC_UPPER" ]; then
    echo "⚠️  Found both Ksc and KSC directories - consolidating to lowercase 'ksc'"

    # Create target directory if needed
    mkdir -p "$KSC_TARGET"

    # Move contents from both to target
    if [ "$(ls -A "$KSC_LOWER")" ]; then
        mv "$KSC_LOWER"/* "$KSC_TARGET/" 2>/dev/null || true
    fi
    if [ "$(ls -A "$KSC_UPPER")" ]; then
        mv "$KSC_UPPER"/* "$KSC_TARGET/" 2>/dev/null || true
    fi

    # Remove old directories
    [ -d "$KSC_LOWER" ] && [ ! "$(ls -A "$KSC_LOWER")" ] && rmdir "$KSC_LOWER"
    [ -d "$KSC_UPPER" ] && [ ! "$(ls -A "$KSC_UPPER")" ] && rmdir "$KSC_UPPER"

    echo "✅ Consolidated Ksc/KSC to ksc"

    # Update imports
    update_imports "features/Ksc" "@/components/features/ksc"
    update_imports "features/KSC" "@/components/features/ksc"

elif [ -d "$KSC_LOWER" ]; then
    echo "📁 Found only Ksc - renaming to lowercase 'ksc'"
    mv "$KSC_LOWER" "$KSC_TARGET"
    update_imports "features/Ksc" "@/components/features/ksc"

elif [ -d "$KSC_UPPER" ]; then
    echo "📁 Found only KSC - renaming to lowercase 'ksc'"
    mv "$KSC_UPPER" "$KSC_TARGET"
    update_imports "features/KSC" "@/components/features/ksc"
else
    echo "ℹ️  No Ksc/KSC directories found to consolidate"
fi

echo ""
echo "🎯 Phase 2: Standardize Other PascalCase Directories"
echo "----------------------------------------------------"

# Standardize Analysis -> analysis
if [ -d "$COMPONENTS_DIR/features/Analysis" ]; then
    echo "📁 Renaming Analysis -> analysis"
    mv "$COMPONENTS_DIR/features/Analysis" "$COMPONENTS_DIR/features/analysis"
    update_imports "features/Analysis" "@/components/features/analysis"
fi

# Standardize Documents -> documents
if [ -d "$COMPONENTS_DIR/Documents" ]; then
    echo "📁 Renaming Documents -> documents"
    mv "$COMPONENTS_DIR/Documents" "$COMPONENTS_DIR/documents"
    update_imports "Documents" "@/components/documents"
fi

# Note: Button directory is a proper component directory, so we keep PascalCase
# Only category directories should be kebab-case

echo ""
echo "🎯 Phase 3: Verification"
echo "------------------------"

# Check for any remaining issues
echo "Checking for PascalCase category directories..."
PASCALCASE_DIRS=$(find "$COMPONENTS_DIR" -mindepth 1 -maxdepth 2 -type d | while read dir; do
    dirname=$(basename "$dir")
    parent=$(basename "$(dirname "$dir")")

    # Skip component-level directories (they should be PascalCase)
    # Only flag category-level directories
    if [[ $dirname =~ ^[A-Z] ]] && [[ $parent == "components" || $parent == "features" ]]; then
        echo "$dir"
    fi
done)

if [ -n "$PASCALCASE_DIRS" ]; then
    echo "⚠️  Remaining PascalCase category directories:"
    echo "$PASCALCASE_DIRS"
else
    echo "✅ No PascalCase category directories found"
fi

echo ""
echo "🎯 Phase 4: TypeScript Compilation Check"
echo "----------------------------------------"

cd frontend
echo "Running TypeScript compiler to check for import errors..."
if npx tsc --noEmit; then
    echo "✅ TypeScript compilation successful"
else
    echo "⚠️  TypeScript errors found - please review"
    echo "   Backup available at: $BACKUP_DIR"
fi
cd ..

echo ""
echo "========================================="
echo "✅ Consolidation Complete!"
echo ""
echo "Summary:"
echo "  - Backup location: $BACKUP_DIR"
echo "  - Consolidated duplicate directories"
echo "  - Updated all imports"
echo "  - Standardized category directory names"
echo ""
echo "Next steps:"
echo "  1. Review TypeScript compilation results"
echo "  2. Run tests: yarn test"
echo "  3. Commit changes if everything looks good"
echo "  4. If issues arise, restore from backup"
echo ""
