#!/bin/bash
# Pre-Migration Validation Script
#
# Validates that the codebase is ready for M3 migration automation
# Checks structure, tests, types, and other requirements

set -e

echo "🔍 Pre-Migration Validation"
echo "============================"
echo ""

COMPONENTS_DIR="./frontend/src/components"
REQUIRED_READINESS_SCORE=70
REQUIRED_TEST_COVERAGE=40
REQUIRED_INDEX_COVERAGE=80

VALIDATION_PASSED=true

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    local status=$1
    local message=$2

    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✅ PASS${NC} - $message"
    elif [ "$status" = "FAIL" ]; then
        echo -e "${RED}❌ FAIL${NC} - $message"
        VALIDATION_PASSED=false
    elif [ "$status" = "WARN" ]; then
        echo -e "${YELLOW}⚠️  WARN${NC} - $message"
    else
        echo "ℹ️  INFO - $message"
    fi
}

echo "📊 Validation Checks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check 1: Component Manifest exists
echo "1️⃣  Component Manifest"
if [ -f "component-manifest.json" ]; then
    print_status "PASS" "Component manifest exists"

    # Extract readiness score
    READINESS_SCORE=$(node -pe "JSON.parse(require('fs').readFileSync('component-manifest.json', 'utf8')).readinessScore")

    if [ "$READINESS_SCORE" -ge "$REQUIRED_READINESS_SCORE" ]; then
        print_status "PASS" "Readiness score: ${READINESS_SCORE}% (required: ${REQUIRED_READINESS_SCORE}%)"
    else
        print_status "FAIL" "Readiness score: ${READINESS_SCORE}% (required: ${REQUIRED_READINESS_SCORE}%)"
    fi
else
    print_status "FAIL" "Component manifest not found - run: node scripts/generate-component-manifest.ts"
fi
echo ""

# Check 2: Directory Naming Consistency
echo "2️⃣  Directory Naming Consistency"
PASCALCASE_DIRS=$(find "$COMPONENTS_DIR" -mindepth 1 -maxdepth 2 -type d | while read dir; do
    dirname=$(basename "$dir")
    parent=$(basename "$(dirname "$dir")")

    if [[ $dirname =~ ^[A-Z] ]] && [[ $parent == "components" || $parent == "features" ]]; then
        echo "$dir"
    fi
done)

if [ -z "$PASCALCASE_DIRS" ]; then
    print_status "PASS" "No PascalCase category directories"
else
    print_status "FAIL" "Found PascalCase category directories:"
    echo "$PASCALCASE_DIRS"
fi

# Check for duplicate directories
if [ -d "$COMPONENTS_DIR/features/Ksc" ] && [ -d "$COMPONENTS_DIR/features/KSC" ]; then
    print_status "FAIL" "Duplicate directories: Ksc and KSC both exist"
elif [ -d "$COMPONENTS_DIR/features/Ksc" ] || [ -d "$COMPONENTS_DIR/features/KSC" ]; then
    print_status "WARN" "Found uppercase Ksc/KSC directory - should be lowercase 'ksc'"
else
    print_status "PASS" "No duplicate directories found"
fi
echo ""

# Check 3: Component Structure
echo "3️⃣  Component Structure"
TOTAL_COMPONENTS=$(find "$COMPONENTS_DIR" -name "*.tsx" ! -name "*.test.tsx" ! -name "*.stories.tsx" | wc -l)
WITH_INDEX=$(find "$COMPONENTS_DIR" -name "index.ts" -o -name "index.tsx" | wc -l)

INDEX_PERCENTAGE=$((WITH_INDEX * 100 / TOTAL_COMPONENTS))

if [ "$INDEX_PERCENTAGE" -ge "$REQUIRED_INDEX_COVERAGE" ]; then
    print_status "PASS" "Index files: ${INDEX_PERCENTAGE}% (required: ${REQUIRED_INDEX_COVERAGE}%)"
else
    print_status "FAIL" "Index files: ${INDEX_PERCENTAGE}% (required: ${REQUIRED_INDEX_COVERAGE}%)"
fi
echo ""

# Check 4: Test Coverage
echo "4️⃣  Test Coverage"
WITH_TESTS=$(find "$COMPONENTS_DIR" -name "*.test.tsx" | wc -l)
TEST_PERCENTAGE=$((WITH_TESTS * 100 / TOTAL_COMPONENTS))

if [ "$TEST_PERCENTAGE" -ge "$REQUIRED_TEST_COVERAGE" ]; then
    print_status "PASS" "Test coverage: ${TEST_PERCENTAGE}% (required: ${REQUIRED_TEST_COVERAGE}%)"
else
    print_status "FAIL" "Test coverage: ${TEST_PERCENTAGE}% (required: ${REQUIRED_TEST_COVERAGE}%)"
fi

# Check if tests actually pass
echo "   Running test suite..."
cd frontend
if yarn test --passWithNoTests > /dev/null 2>&1; then
    print_status "PASS" "All tests passing"
else
    print_status "FAIL" "Some tests failing"
fi
cd ..
echo ""

# Check 5: TypeScript Compilation
echo "5️⃣  TypeScript Compilation"
cd frontend
if npx tsc --noEmit 2>&1 | tee /tmp/tsc-output.txt; then
    print_status "PASS" "TypeScript compilation successful"
else
    ERROR_COUNT=$(grep -c "error TS" /tmp/tsc-output.txt || echo "0")
    print_status "FAIL" "TypeScript compilation failed with $ERROR_COUNT errors"
fi
cd ..
echo ""

# Check 6: Linting
echo "6️⃣  ESLint"
cd frontend
if yarn lint > /dev/null 2>&1; then
    print_status "PASS" "No linting errors"
else
    print_status "WARN" "Linting errors found - run 'yarn lint:fix'"
fi
cd ..
echo ""

# Check 7: Build Process
echo "7️⃣  Build Process"
cd frontend
if yarn build > /dev/null 2>&1; then
    print_status "PASS" "Production build successful"
else
    print_status "FAIL" "Production build failed"
fi
cd ..
echo ""

# Check 8: Dependencies
echo "8️⃣  Dependencies"
if [ -f "package.json" ]; then
    # Check for outdated dependencies
    OUTDATED_COUNT=$(yarn outdated 2>/dev/null | grep -c "^" || echo "0")

    if [ "$OUTDATED_COUNT" -lt 10 ]; then
        print_status "PASS" "Dependencies up to date ($OUTDATED_COUNT outdated)"
    else
        print_status "WARN" "Many outdated dependencies ($OUTDATED_COUNT) - consider updating"
    fi
else
    print_status "FAIL" "package.json not found"
fi
echo ""

# Check 9: Git Status
echo "9️⃣  Git Status"
if git diff --quiet 2>/dev/null; then
    print_status "PASS" "Working directory clean"
else
    print_status "WARN" "Uncommitted changes in working directory"
fi
echo ""

# Check 10: Migration Skills
echo "🔟 Migration Skills"
SKILLS_DIR=".claude/skills/frontend-migration"
if [ -d "$SKILLS_DIR" ]; then
    SKILL_COUNT=$(find "$SKILLS_DIR" -name "*.md" | wc -l)

    if [ "$SKILL_COUNT" -ge 8 ]; then
        print_status "PASS" "Migration skills present ($SKILL_COUNT found)"
    else
        print_status "WARN" "Not all migration skills found ($SKILL_COUNT/8)"
    fi

    # Check if skills are implemented (not just placeholders)
    IMPLEMENTED_SKILLS=0
    for skill in "$SKILLS_DIR"/*.md; do
        if [ $(wc -l < "$skill") -gt 10 ]; then
            IMPLEMENTED_SKILLS=$((IMPLEMENTED_SKILLS + 1))
        fi
    done

    if [ "$IMPLEMENTED_SKILLS" -eq 0 ]; then
        print_status "INFO" "Migration skills are placeholders - waiting for implementation"
    else
        print_status "INFO" "$IMPLEMENTED_SKILLS/$SKILL_COUNT skills implemented"
    fi
else
    print_status "FAIL" "Migration skills directory not found"
fi
echo ""

# Final Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
if [ "$VALIDATION_PASSED" = true ]; then
    echo -e "${GREEN}✅ VALIDATION PASSED${NC}"
    echo ""
    echo "Codebase is ready for M3 migration automation!"
    echo ""
    exit 0
else
    echo -e "${RED}❌ VALIDATION FAILED${NC}"
    echo ""
    echo "Please address the failing checks before proceeding with migration."
    echo ""
    echo "Quick fixes:"
    echo "  - Run: ./scripts/consolidate-duplicate-dirs.sh"
    echo "  - Run: ./scripts/standardize-component-structure.sh"
    echo "  - Run: node scripts/generate-component-manifest.ts"
    echo "  - Generate missing tests with jest-test-scaffolder skill"
    echo ""
    exit 1
fi
