#!/bin/bash
# Batch Validation Script
# Runs all checks for multiple M3 components at once

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Parse component names from arguments
COMPONENTS=("$@")

if [ ${#COMPONENTS[@]} -eq 0 ]; then
    echo "Usage: ./scripts/validate-batch.sh Component1 Component2 Component3"
    echo "Example: ./scripts/validate-batch.sh Input Sidebar Navbar AppShell"
    exit 1
fi

print_header "M3 Expressive Batch Validation"
echo "Components to validate: ${COMPONENTS[*]}"
echo ""

# 1. Token Validation
print_header "Step 1/5: Token System Validation"
python3 ./scripts/validate-design-tokens.py
if [ $? -eq 0 ]; then
    print_success "Design tokens validated"
else
    print_error "Design token validation failed"
    exit 1
fi

# 2. Build
print_header "Step 2/5: Build (yarn build)"
yarn build
if [ $? -eq 0 ]; then
    print_success "Build succeeded"
else
    print_error "Build failed"
    exit 1
fi

# 3. Linting
print_header "Step 3/5: Linting (yarn lint:fix)"
yarn lint:fix
if [ $? -eq 0 ]; then
    print_success "Linting passed"
else
    print_error "Linting failed"
    exit 1
fi

# 4. Component Tests
print_header "Step 4/5: Component Tests"

# Build pattern for multiple components
TEST_PATTERN="M3("
for i in "${!COMPONENTS[@]}"; do
    component="${COMPONENTS[$i]}"
    pascal_component="$(echo $component | sed 's/^./\U&/')"

    if [ $i -gt 0 ]; then
        TEST_PATTERN="${TEST_PATTERN}|"
    fi
    TEST_PATTERN="${TEST_PATTERN}${pascal_component}"
done
TEST_PATTERN="${TEST_PATTERN})"

echo "Running tests matching: ${TEST_PATTERN}"
yarn test --testPathPattern="${TEST_PATTERN}" --passWithNoTests

if [ $? -eq 0 ]; then
    print_success "All component tests passed"
else
    print_error "Component tests failed"
    exit 1
fi

# 5. Summary
print_header "Validation Summary"

echo "✅ All validations passed!"
echo ""
echo "Checked components:"
for component in "${COMPONENTS[@]}"; do
    echo "  • M3${component^}"
done
echo ""
echo "Ready for:"
echo "  • Pull request submission"
echo "  • Code review"
echo "  • Deployment"

print_header "Next Steps"
echo "1. Review generated components"
echo "2. Submit pull request with all changes"
echo "3. Reference M3Button as migration example"
echo "4. See docs at: .claude/docs/CURSOR_AI_M3_MIGRATION_PROMPT.md"
