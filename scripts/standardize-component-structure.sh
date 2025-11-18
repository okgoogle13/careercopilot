#!/bin/bash
# Component Structure Standardization Script
#
# Restructures loose component files into the standard directory structure:
# ComponentName/
#   ComponentName.tsx
#   ComponentName.test.tsx
#   ComponentName.stories.tsx
#   index.ts

set -e

echo "🏗️  Component Structure Standardization Tool"
echo "============================================="
echo ""

COMPONENTS_DIR="./frontend/src/components"
BACKUP_DIR="./backups/component-standardization-$(date +%Y%m%d-%H%M%S)"
DRY_RUN=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --help)
            echo "Usage: $0 [--dry-run] [--help]"
            echo ""
            echo "Options:"
            echo "  --dry-run    Show what would be done without making changes"
            echo "  --help       Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

if [ "$DRY_RUN" = true ]; then
    echo "🔍 DRY RUN MODE - No changes will be made"
    echo ""
fi

# Create backup (only if not dry run)
if [ "$DRY_RUN" = false ]; then
    echo "📦 Creating backup at: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
    cp -r "$COMPONENTS_DIR" "$BACKUP_DIR/"
    echo "✅ Backup created"
    echo ""
fi

# Function to standardize a single component
standardize_component() {
    local component_file="$1"
    local dir=$(dirname "$component_file")
    local filename=$(basename "$component_file" .tsx)
    local parent_dir=$(dirname "$dir")

    # Skip if already in a proper structure (component has its own directory)
    if [ "$(basename "$dir")" = "$filename" ]; then
        return 0
    fi

    # Skip test and story files
    if [[ "$filename" == *.test || "$filename" == *.stories ]]; then
        return 0
    fi

    echo "📁 Standardizing: $filename"

    local new_dir="$parent_dir/$filename"

    if [ "$DRY_RUN" = true ]; then
        echo "   Would create: $new_dir/"
        echo "   Would move: $component_file -> $new_dir/$filename.tsx"

        # Check for associated files
        [ -f "$dir/$filename.test.tsx" ] && echo "   Would move: $filename.test.tsx"
        [ -f "$dir/$filename.stories.tsx" ] && echo "   Would move: $filename.stories.tsx"
        [ -f "$dir/$filename.css" ] && echo "   Would move: $filename.css"

        echo "   Would create: $new_dir/index.ts"
        echo ""
        return 0
    fi

    # Create component directory
    mkdir -p "$new_dir"

    # Move main component file
    mv "$component_file" "$new_dir/$filename.tsx"

    # Move associated files if they exist
    [ -f "$dir/$filename.test.tsx" ] && mv "$dir/$filename.test.tsx" "$new_dir/"
    [ -f "$dir/$filename.stories.tsx" ] && mv "$dir/$filename.stories.tsx" "$new_dir/"
    [ -f "$dir/$filename.css" ] && mv "$dir/$filename.css" "$new_dir/"
    [ -f "$dir/$filename.module.css" ] && mv "$dir/$filename.module.css" "$new_dir/"

    # Create index.ts if it doesn't exist
    if [ ! -f "$new_dir/index.ts" ]; then
        cat > "$new_dir/index.ts" << EOF
export { $filename } from './$filename';
export type { ${filename}Props } from './$filename';
EOF
    fi

    echo "   ✅ Standardized $filename"
    echo ""
}

# Function to add index.ts to components that need it
add_missing_index() {
    local component_dir="$1"
    local component_name=$(basename "$component_dir")

    # Skip if index already exists
    if [ -f "$component_dir/index.ts" ] || [ -f "$component_dir/index.tsx" ]; then
        return 0
    fi

    # Skip if this isn't a component directory
    if [ ! -f "$component_dir/$component_name.tsx" ]; then
        return 0
    fi

    echo "📝 Adding index.ts to: $component_name"

    if [ "$DRY_RUN" = true ]; then
        echo "   Would create: $component_dir/index.ts"
        echo ""
        return 0
    fi

    # Create index.ts
    cat > "$component_dir/index.ts" << EOF
export { $component_name } from './$component_name';
export type { ${component_name}Props } from './$component_name';
EOF

    echo "   ✅ Created index.ts"
    echo ""
}

echo "🎯 Phase 1: Restructure Loose Component Files"
echo "----------------------------------------------"

# Find all loose component files (not in their own directory)
find "$COMPONENTS_DIR" -name "*.tsx" ! -name "*.test.tsx" ! -name "*.stories.tsx" | while read component_file; do
    dir=$(dirname "$component_file")
    filename=$(basename "$component_file" .tsx)

    # Check if component is in its own directory
    if [ "$(basename "$dir")" != "$filename" ]; then
        standardize_component "$component_file"
    fi
done

echo ""
echo "🎯 Phase 2: Add Missing Index Files"
echo "------------------------------------"

# Find all component directories without index files
find "$COMPONENTS_DIR" -mindepth 1 -type d ! -name "__tests__" ! -name "__mocks__" | while read component_dir; do
    add_missing_index "$component_dir"
done

if [ "$DRY_RUN" = false ]; then
    echo ""
    echo "🎯 Phase 3: Verification"
    echo "------------------------"

    # Count components with proper structure
    TOTAL_COMPONENTS=$(find "$COMPONENTS_DIR" -name "*.tsx" ! -name "*.test.tsx" ! -name "*.stories.tsx" | wc -l)
    WITH_INDEX=$(find "$COMPONENTS_DIR" -name "index.ts" -o -name "index.tsx" | wc -l)

    echo "Total components: $TOTAL_COMPONENTS"
    echo "With index files: $WITH_INDEX"

    if [ $WITH_INDEX -ge $((TOTAL_COMPONENTS * 90 / 100)) ]; then
        echo "✅ Structure standardization complete"
    else
        echo "⚠️  Some components may need manual review"
    fi

    echo ""
    echo "🎯 Phase 4: TypeScript Compilation Check"
    echo "----------------------------------------"

    cd frontend
    if npx tsc --noEmit; then
        echo "✅ TypeScript compilation successful"
    else
        echo "⚠️  TypeScript errors found - please review"
        echo "   Backup available at: $BACKUP_DIR"
    fi
    cd ..
fi

echo ""
echo "============================================="
if [ "$DRY_RUN" = true ]; then
    echo "🔍 DRY RUN COMPLETE"
    echo ""
    echo "Run without --dry-run to apply changes"
else
    echo "✅ Standardization Complete!"
    echo ""
    echo "Summary:"
    echo "  - Backup location: $BACKUP_DIR"
    echo "  - Restructured loose component files"
    echo "  - Added missing index.ts files"
    echo ""
    echo "Next steps:"
    echo "  1. Review changes"
    echo "  2. Update imports if needed"
    echo "  3. Run tests: yarn test"
    echo "  4. Commit changes"
fi
echo ""
