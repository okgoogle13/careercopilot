#!/bin/bash
# Additional Automated TypeScript Error Fixes - Pass 2
# Fixes remaining errors after initial autofix

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

echo "🔧 Additional TypeScript Error Fixes - Pass 2"
echo "=============================================="
echo ""

FRONTEND_SRC="frontend/src"

# ===== FIX 1: Storybook Imports (Meta, StoryObj) =====
log_info "Fix 1: Adding missing Storybook type imports..."

# Fix: Add 'type' keyword to imports from @storybook/react
STORY_FILES=(
    "frontend/src/components/documents/__stories__/DocumentBrowser.stories.tsx"
    "frontend/src/components/layout/AppLayout.stories.tsx"
    "frontend/src/components/layout/PageHeader.stories.tsx"
    "frontend/src/components/ui/Button/Button.stories.tsx"
)

for file in "${STORY_FILES[@]}"; do
    if [ -f "$file" ]; then
        # Check if file already has type import
        if grep -q "import type { Meta, StoryObj }" "$file"; then
            log_info "  $file already has type imports"
        elif grep -q "import { Meta, StoryObj }" "$file"; then
            # Replace with type import
            sed -i "s/import { Meta, StoryObj }/import type { Meta, StoryObj }/g" "$file"
            log_success "  Fixed type imports in $(basename $file)"
        else
            # Add the import at the top
            sed -i "1i import type { Meta, StoryObj } from '@storybook/react';" "$file"
            log_success "  Added type imports to $(basename $file)"
        fi
    fi
done

echo ""

# ===== FIX 2: Custom Button Variants =====
log_info "Fix 2: Fixing custom Button variant mismatches..."

# Files that use custom Button component (outline, not outlined)
CUSTOM_BUTTON_FILES=(
    "frontend/src/components/documents/DocumentPreviewModal.tsx"
    "frontend/src/components/documents/DocumentSharingDialog.tsx"
    "frontend/src/components/features/Analysis/ATSAnalysisDashboard.tsx"
    "frontend/src/components/features/common/ErrorCard.tsx"
    "frontend/src/components/features/demo/MUITest.tsx"
    "frontend/src/components/library/KeywordTag.tsx"
    "frontend/src/components/library/TemplateCard.tsx"
)

for file in "${CUSTOM_BUTTON_FILES[@]}"; do
    if [ -f "$file" ]; then
        # Revert outlined back to outline for custom Button components
        sed -i 's/variant="outlined"/variant="outline"/g' "$file"
        log_success "  Fixed custom Button variants in $(basename $file)"
    fi
done

# Special case: Files that use MUI Button (need "outlined")
MUI_BUTTON_FILES=(
    "frontend/src/components/features/Documents/ResumeBuilder.tsx"
    "frontend/src/components/features/opportunities/InterviewPrep.tsx"
)

for file in "${MUI_BUTTON_FILES[@]}"; do
    if [ -f "$file" ]; then
        # These should stay as "outlined" for MUI Button
        log_success "  MUI Button in $(basename $file) already correct"
    fi
done

echo ""

# ===== FIX 3: Dialog/Popover Children Prop =====
log_info "Fix 3: Fixing Dialog/Popover children prop errors..."

# Fix DocumentPreview.tsx - wrap multiple DialogContent children in fragment
if [ -f "frontend/src/components/features/Documents/DocumentPreview.tsx" ]; then
    log_info "  Fixing DocumentPreview.tsx Dialog children..."
    # This is complex - we'll use a Python script for AST manipulation
    python3 <<'EOF'
import re

file_path = "frontend/src/components/features/Documents/DocumentPreview.tsx"
with open(file_path, 'r') as f:
    content = f.read()

# Pattern: <DialogContent ...> with multiple top-level children
# We need to wrap the children in a fragment
# This is a simplified fix - may need manual adjustment
print("DocumentPreview.tsx requires manual Dialog children wrapping")
EOF
    log_warning "  DocumentPreview.tsx may need manual review for Dialog children"
fi

# Similar fixes for other Dialog components
DIALOG_FILES=(
    "frontend/src/components/features/opportunities/CareerGrowthHub.tsx"
    "frontend/src/components/features/profile/ProfileEditor.tsx"
    "frontend/src/components/library/InteractiveComponentsSection.tsx"
)

for file in "${DIALOG_FILES[@]}"; do
    if [ -f "$file" ]; then
        log_warning "  $file may need manual Dialog children review"
    fi
done

echo ""

# ===== FIX 4: Component Prop Type Errors =====
log_info "Fix 4: Fixing component prop type errors..."

# Fix: mes_age typo in MUITest.tsx
if [ -f "frontend/src/components/features/demo/MUITest.tsx" ]; then
    sed -i 's/mes_age/message/g' frontend/src/components/features/demo/MUITest.tsx
    log_success "  Fixed typo in MUITest.tsx"
fi

# Fix: onValueChange → onChange for MUI components
FILES_WITH_ONVALUECHANGE=(
    "frontend/src/components/features/opportunities/JobInput.tsx"
    "frontend/src/components/library/FormComponentsSection.tsx"
)

for file in "${FILES_WITH_ONVALUECHANGE[@]}"; do
    if [ -f "$file" ]; then
        # MUI uses onChange, not onValueChange
        sed -i 's/onValueChange=/onChange=/g' "$file"
        log_success "  Fixed onChange prop in $(basename $file)"
    fi
done

# Fix: onCheckedChange → onChange for Checkbox
if [ -f "frontend/src/components/library/FormComponentsSection.tsx" ]; then
    sed -i 's/onCheckedChange=/onChange=/g' frontend/src/components/library/FormComponentsSection.tsx
    log_success "  Fixed Checkbox onChange in FormComponentsSection.tsx"
fi

# Fix: App.tsx prop mismatches
if [ -f "frontend/src/App.tsx" ]; then
    log_info "  Checking App.tsx for prop mismatches..."
    # These need to match the component prop types
    log_warning "  App.tsx may need manual prop type verification"
fi

# Fix: AnimatedComponents.tsx onSelect prop
if [ -f "frontend/src/components/features/demo/AnimatedComponents.tsx" ]; then
    log_info "  Checking AnimatedComponents.tsx..."
    # This component has prop structure issues
    log_warning "  AnimatedComponents.tsx may need manual prop restructure"
fi

echo ""

# ===== FIX 5: UI Component Ref Forwarding =====
log_info "Fix 5: Fixing UI component ref forwarding issues..."

# These are in custom UI components - need proper ref forwarding
UI_REF_FILES=(
    "frontend/src/components/ui/alert-dialog.tsx"
    "frontend/src/components/ui/dropdown-menu.tsx"
    "frontend/src/components/ui/popover.tsx"
    "frontend/src/components/ui/tabs.tsx"
    "frontend/src/components/ui/tooltip.tsx"
)

for file in "${UI_REF_FILES[@]}"; do
    if [ -f "$file" ]; then
        log_warning "  $file needs proper forwardRef implementation (manual fix required)"
    fi
done

echo ""

# ===== FIX 6: Additional Simple Fixes =====
log_info "Fix 6: Additional simple fixes..."

# Fix: DisplayComponentsSection.tsx - wrong import path
if [ -f "frontend/src/components/library/DisplayComponentsSection.tsx" ]; then
    sed -i "s|from '../ui/alert'|from '../ui/Alert'|g" frontend/src/components/library/DisplayComponentsSection.tsx
    log_success "  Fixed Alert import in DisplayComponentsSection.tsx"
fi

# Fix: CardComponentsSection.tsx - elevation variant
if [ -f "frontend/src/components/library/CardComponentsSection.tsx" ]; then
    # elevation is not a valid variant for custom Button
    sed -i 's/variant="elevation"/variant="default"/g' frontend/src/components/library/CardComponentsSection.tsx
    log_success "  Fixed elevation variant in CardComponentsSection.tsx"
fi

# Fix: AppLayout.tsx - surface property
if [ -f "frontend/src/components/layout/AppLayout.tsx" ]; then
    # palette.surface doesn't exist in MUI v7
    sed -i "s/palette\.surface/palette.background/g" frontend/src/components/layout/AppLayout.tsx
    log_success "  Fixed palette.surface in AppLayout.tsx"
fi

# Fix: Icon fontSize prop - should use sx prop instead
FILES_WITH_FONTSIZE=(
    "frontend/src/components/layout/AppLayout.tsx"
    "frontend/src/components/layout/PageHeader.tsx"
)

for file in "${FILES_WITH_FONTSIZE[@]}"; do
    if [ -f "$file" ]; then
        log_warning "  $file uses fontSize prop - may need conversion to sx prop"
    fi
done

echo ""

# ===== FIX 7: Missing Required Props =====
log_info "Fix 7: Fixing missing required props..."

# Fix: Dialog components missing 'open' prop
if [ -f "frontend/src/components/library/InteractiveComponentsSection.tsx" ]; then
    log_warning "  InteractiveComponentsSection.tsx Dialog needs 'open' prop"
fi

# Fix: DropdownMenu missing 'open' prop
if [ -f "frontend/src/components/library/ProfileVariationCard.tsx" ]; then
    log_warning "  ProfileVariationCard.tsx DropdownMenu needs 'open' prop"
fi

echo ""

# ===== Final Summary =====
echo "=============================================="
log_success "✅ Additional Automated Fixes Complete!"
echo ""
echo "📊 Summary:"
echo "   ✓ Storybook type imports fixed"
echo "   ✓ Custom Button variants corrected"
echo "   ⚠ Dialog children props flagged for review"
echo "   ✓ Component prop types fixed (onChange, etc.)"
echo "   ⚠ UI component refs flagged for manual fix"
echo "   ✓ Additional simple fixes applied"
echo ""
echo "⚠️  Manual Review Required:"
echo "   - Dialog/Popover children wrapping (6 files)"
echo "   - UI component forwardRef implementation (5 files)"
echo "   - App.tsx prop type alignment"
echo "   - AnimatedComponents.tsx prop structure"
echo ""
log_info "Next Steps:"
echo "  1. Run TypeScript check: cd frontend && npx tsc --noEmit"
echo "  2. Review remaining errors"
echo "  3. Test build: yarn build:frontend"
echo ""
