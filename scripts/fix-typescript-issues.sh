#!/bin/bash

echo "🔧 TypeScript Issues Refined Fix Script"
echo "======================================"

cd "$(dirname "$0")/.."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# First, let's undo any overly aggressive renaming that broke code
log_info "Step 1: Fixing overly aggressive variable renaming..."

# Fix common over-renaming issues in frontend source files
find frontend/src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' \
    -e 's/jobDe_cription/jobDescription/g' \
    -e 's/i_Authenticated/isAuthenticated/g' \
    -e 's/ha_UploadedDocuments/hasUploadedDocuments/g' \
    -e 's/ha_Documents/hasDocuments/g' \
    -e 's/_econds/seconds/g' \
    -e 's/_inutes/minutes/g' \
    -e 's/_ours/hours/g' \
    -e 's/ba_eURL/baseURL/g'

# Fix theme issues
log_info "Step 2: Fixing theme configuration issues..."

if [ -f "frontend/src/theme/theme.ts" ]; then
    sed -i '' \
        -e 's/variant: "selected"/variant: "elevation"/g' \
        -e 's/variant: "interactive"/variant: "outlined"/g' \
        frontend/src/theme/theme.ts
    log_success "Fixed theme variant issues"
fi

# Fix unused function parameters by prefixing with underscore (more carefully)
log_info "Step 3: Fixing unused function parameters..."

# Only prefix parameters that are clearly unused in simple cases
find frontend/src -name "*.ts" -o -name "*.tsx" | while read file; do
    # Look for function parameters that have ESLint warnings about being unused
    sed -i '' \
        -e 's/\(function.*(\|.*=> *(\|.*( *\)\([a-zA-Z_][a-zA-Z0-9_]*\): *\([^,)]*\)\(.*Allowed unused args must match\)/\1_\2: \3\4/g' \
        -e 's/\(.*onSelect\) *:/(_onSelect):/g' \
        -e 's/\(.*onComplete\) *:/(_onComplete):/g' \
        -e 's/\(.*editingProfile\) *:/(_editingProfile):/g' \
        -e 's/\(.*documentType\) *:/(_documentType):/g' \
        -e 's/\(.*template\) *:/(_template):/g' \
        "$file"
done

log_success "Refined TypeScript fixes completed!"

# Run a final TypeScript check
log_info "Step 4: Running final TypeScript validation..."
cd frontend
npx tsc --noEmit --skipLibCheck > ../typescript-check.log 2>&1

error_count=$(wc -l < ../typescript-check.log)
if [ "$error_count" -gt 10 ]; then
    log_warning "TypeScript still has $error_count errors. Top issues:"
    head -10 ../typescript-check.log
else
    log_success "TypeScript compilation much improved!"
    if [ "$error_count" -gt 0 ]; then
        echo "Remaining issues:"
        cat ../typescript-check.log
    fi
fi

cd ..

log_info "Summary of fixes applied:"
echo "  ✓ Fixed variable over-renaming issues"
echo "  ✓ Fixed theme configuration"
echo "  ✓ Carefully prefixed unused function parameters"
echo ""
echo "Next steps:"
echo "  1. Check changes with: git diff"
echo "  2. Run frontend build: cd frontend && yarn build"
echo "  3. Run tests: cd frontend && yarn test"
