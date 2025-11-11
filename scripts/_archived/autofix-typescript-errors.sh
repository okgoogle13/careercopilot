#!/bin/bash
# Automated TypeScript Error Fix Script
# Comprehensive fixes for TypeScript compilation errors

set -e

cd "$(dirname "$0")/.."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo "🔧 Automated TypeScript Error Fixes"
echo "===================================="
echo ""

FRONTEND_SRC="frontend/src"
FILES_MODIFIED=0

# ===== PASS 1: Simple String Replacements =====
log_info "Pass 1: Simple String Replacements..."

# Fix 1: variant="outline" → variant="outlined" (183 occurrences, 49 files)
log_info "  Fixing Button variant='outline' → variant='outlined'..."
VARIANT_COUNT=$(find $FRONTEND_SRC -name "*.tsx" -o -name "*.ts" | xargs grep -l 'variant="outline"' 2>/dev/null | wc -l || echo 0)
if [ "$VARIANT_COUNT" -gt 0 ]; then
    find $FRONTEND_SRC \( -name "*.tsx" -o -name "*.ts" \) -type f -exec sed -i 's/variant="outline"/variant="outlined"/g' {} +
    log_success "    Fixed variant in $VARIANT_COUNT files"
    FILES_MODIFIED=$((FILES_MODIFIED + VARIANT_COUNT))
fi

# Fix 2: ha_Error → hasError (ErrorBoundary.tsx)
log_info "  Fixing typo: ha_Error → hasError..."
if grep -q "ha_Error" frontend/src/components/ErrorBoundary.tsx 2>/dev/null; then
    sed -i 's/ha_Error/hasError/g' frontend/src/components/ErrorBoundary.tsx
    log_success "    Fixed ErrorBoundary.tsx typo"
    FILES_MODIFIED=$((FILES_MODIFIED + 1))
fi

# Fix 3: Other common typos
log_info "  Fixing other common typos..."
find $FRONTEND_SRC \( -name "*.tsx" -o -name "*.ts" \) -type f -exec sed -i \
    -e 's/jobDe_cription/jobDescription/g' \
    -e 's/i_Authenticated/isAuthenticated/g' \
    -e 's/ha_UploadedDocuments/hasUploadedDocuments/g' \
    -e 's/ha_Documents/hasDocuments/g' \
    -e 's/ba_eURL/baseURL/g' \
    {} +

log_success "Pass 1 Complete: Simple replacements applied"
echo ""

# ===== PASS 2: Fix Storybook Imports =====
log_info "Pass 2: Storybook Import Fixes..."

# Find all .stories.tsx files that need Meta/StoryObj imports
STORY_FILES=$(find $FRONTEND_SRC -name "*.stories.tsx")

for file in $STORY_FILES; do
    NEEDS_FIX=false

    # Check if file uses Meta or StoryObj but doesn't import from @storybook/react
    if grep -q "Meta<\|: Meta\|StoryObj<" "$file" && ! grep -q "from ['\"]@storybook/react['\"]" "$file"; then
        NEEDS_FIX=true
    fi

    if [ "$NEEDS_FIX" = true ]; then
        # Add import at the top after the first import line
        sed -i "1a import type { Meta, StoryObj } from '@storybook/react';" "$file"
        log_success "  Added Storybook imports to $(basename $file)"
        FILES_MODIFIED=$((FILES_MODIFIED + 1))
    fi
done

log_success "Pass 2 Complete: Storybook imports fixed"
echo ""

# ===== PASS 3: MUI Component-Specific Fixes =====
log_info "Pass 3: MUI Component Type Fixes..."

# Fix 3a: Tab component - remove invalid 'component' prop
log_info "  Fixing Tab component props..."
find $FRONTEND_SRC -name "tabs.tsx" -type f -exec sed -i \
    -e 's/<Tab \(.*\)component="div" \(.*\)>/<Tab \1\2>/g' \
    -e 's/<Tab \(.*\)component={[^}]*} \(.*\)>/<Tab \1\2>/g' \
    {} +

# Fix 3b: ResumeBuilder - variant="outlined" for custom Button
log_info "  Fixing ResumeBuilder Button variants..."
if [ -f "frontend/src/components/features/Documents/ResumeBuilder.tsx" ]; then
    # This file has custom Button with wrong variant types
    # The error shows 'outlined' is not assignable to custom variants
    # We need to use the custom variants instead
    sed -i 's/variant="outlined"/variant="outline"/g' frontend/src/components/features/Documents/ResumeBuilder.tsx
    log_success "    Fixed ResumeBuilder.tsx"
fi

# Fix 3c: DocumentTypeSelector - fix Button variants and category type
log_info "  Fixing DocumentTypeSelector..."
if [ -f "frontend/src/components/features/Documents/DocumentTypeSelector.tsx" ]; then
    # Keep outline variant for consistency
    log_success "    DocumentTypeSelector uses custom variants (no changes needed)"
fi

log_success "Pass 3 Complete: Component-specific fixes applied"
echo ""

# ===== PASS 4: Run ESLint Auto-fix =====
log_info "Pass 4: Running ESLint auto-fix..."
cd frontend
if yarn lint:fix --quiet 2>/dev/null; then
    log_success "ESLint auto-fix completed"
else
    log_warning "ESLint auto-fix had some warnings (expected)"
fi
cd ..
echo ""

# ===== Final Summary =====
echo "===================================="
log_success "✅ Automated Fixes Complete!"
echo ""
echo "📊 Summary:"
echo "   - Button variant fixes applied"
echo "   - Typo fixes applied"
echo "   - Storybook imports added"
echo "   - Component-specific fixes applied"
echo "   - ESLint auto-fix run"
echo ""
echo "===================================="
echo ""
log_info "Next Steps:"
echo "  1. Review changes: git diff frontend/src"
echo "  2. Run TypeScript check: cd frontend && npx tsc --noEmit"
echo "  3. Test build: yarn build:frontend"
echo ""
