#!/bin/bash
# Component Structure Audit Script
# Analyzes frontend components for migration readiness

echo "=== CAREERCOPILOT COMPONENT STRUCTURE AUDIT ==="
echo "Analyzing components for migration automation readiness..."
echo ""

COMPONENTS_DIR="./frontend/src/components"

# Count total components
echo "📊 COMPONENT INVENTORY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Total .tsx files (excluding tests and stories)
TOTAL_COMPONENT_FILES=$(find $COMPONENTS_DIR -name "*.tsx" ! -name "*.test.tsx" ! -name "*.stories.tsx" | wc -l)
echo "Total component files (.tsx): $TOTAL_COMPONENT_FILES"

# Total .ts files (excluding tests)
TOTAL_TS_FILES=$(find $COMPONENTS_DIR -name "*.ts" ! -name "*.test.ts" | wc -l)
echo "Total TypeScript files (.ts): $TOTAL_TS_FILES"

# Component directories
COMPONENT_DIRS=$(find $COMPONENTS_DIR -mindepth 1 -maxdepth 3 -type d ! -name "__tests__" ! -name "__mocks__" ! -name "node_modules" | wc -l)
echo "Component directories: $COMPONENT_DIRS"

echo ""
echo "📁 STRUCTURE ANALYSIS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Components with index files
WITH_INDEX=$(find $COMPONENTS_DIR -mindepth 2 -name "index.ts" -o -name "index.tsx" | wc -l)
echo "✓ With index.ts/tsx: $WITH_INDEX"

# Components with tests
WITH_TESTS=$(find $COMPONENTS_DIR -name "*.test.tsx" | wc -l)
echo "✓ With tests: $WITH_TESTS"

# Components with Storybook
WITH_STORIES=$(find $COMPONENTS_DIR -name "*.stories.tsx" | wc -l)
echo "✓ With Storybook: $WITH_STORIES"

# Components with CSS files
WITH_CSS=$(find $COMPONENTS_DIR -name "*.css" -o -name "*.module.css" | wc -l)
echo "✓ With CSS files: $WITH_CSS"

echo ""
echo "⚠️  NAMING CONSISTENCY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for mixed case directories
echo "Directories (checking for case inconsistencies):"
find $COMPONENTS_DIR -mindepth 1 -maxdepth 2 -type d ! -name "__tests__" ! -name "__mocks__" | while read dir; do
    dirname=$(basename "$dir")
    # Check if starts with uppercase
    if [[ $dirname =~ ^[A-Z] ]]; then
        echo "  ⚠️  PascalCase: $dirname"
    fi
done

echo ""
echo "🎯 MIGRATION READINESS SCORE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Calculate readiness percentages
if [ $TOTAL_COMPONENT_FILES -gt 0 ]; then
    INDEX_PCT=$((WITH_INDEX * 100 / COMPONENT_DIRS))
    TEST_PCT=$((WITH_TESTS * 100 / TOTAL_COMPONENT_FILES))
    STORY_PCT=$((WITH_STORIES * 100 / TOTAL_COMPONENT_FILES))

    echo "Index files coverage: ${INDEX_PCT}%"
    echo "Test coverage: ${TEST_PCT}%"
    echo "Storybook coverage: ${STORY_PCT}%"

    OVERALL_SCORE=$(( (INDEX_PCT + TEST_PCT + STORY_PCT) / 3 ))
    echo ""
    echo "Overall Readiness Score: ${OVERALL_SCORE}%"

    if [ $OVERALL_SCORE -ge 70 ]; then
        echo "Status: ✅ READY for migration automation"
    elif [ $OVERALL_SCORE -ge 40 ]; then
        echo "Status: ⚠️  PARTIALLY READY - improvements needed"
    else
        echo "Status: ❌ NOT READY - significant preparation required"
    fi
fi

echo ""
echo "🔍 DETAILED COMPONENT BREAKDOWN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create detailed component inventory
find $COMPONENTS_DIR -name "*.tsx" ! -name "*.test.tsx" ! -name "*.stories.tsx" | while read component; do
    dir=$(dirname "$component")
    filename=$(basename "$component" .tsx)

    # Check for associated files
    has_index=""
    has_test=""
    has_story=""

    [ -f "$dir/index.ts" ] || [ -f "$dir/index.tsx" ] && has_index="✓"
    [ -f "$dir/$filename.test.tsx" ] && has_test="✓"
    [ -f "$dir/$filename.stories.tsx" ] && has_story="✓"

    # Show incomplete components
    if [ -z "$has_index" ] || [ -z "$has_test" ] || [ -z "$has_story" ]; then
        rel_path=${component#./frontend/src/components/}
        printf "%-50s [I:%1s T:%1s S:%1s]\n" "$rel_path" "$has_index" "$has_test" "$has_story"
    fi
done | head -30

echo ""
echo "=== AUDIT COMPLETE ==="
