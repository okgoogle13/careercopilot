#!/bin/bash
# Critical TypeScript Error Fixes - Pass 3
# Targets the most impactful remaining errors

set -e

cd "$(dirname "$0")/.."

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }

echo "🔧 Critical TypeScript Error Fixes - Pass 3"
echo "==========================================="
echo ""

# Fix 1: DocumentTypeSelector - More "outlined" → "outline" fixes
log_info "Fix 1: DocumentTypeSelector Button variants..."
if [ -f "frontend/src/components/features/Documents/DocumentTypeSelector.tsx" ]; then
    sed -i 's/variant="outlined"/variant="outline"/g' frontend/src/components/features/Documents/DocumentTypeSelector.tsx
    log_success "  Fixed DocumentTypeSelector.tsx"
fi

# Fix 2: ResumeBuilder - These are using MUI Button, need "outlined"
log_info "Fix 2: ResumeBuilder MUI Button imports..."
if [ -f "frontend/src/components/features/Documents/ResumeBuilder.tsx" ]; then
    # Check if using MUI Button or custom Button
    if grep -q "from '@mui/material'" frontend/src/components/features/Documents/ResumeBuilder.tsx; then
        sed -i 's/variant="outline"/variant="outlined"/g' frontend/src/components/features/Documents/ResumeBuilder.tsx
        log_success "  Fixed ResumeBuilder.tsx for MUI Button"
    fi
fi

# Fix 3: InterviewPrep - MUI Button variants
log_info "Fix 3: InterviewPrep Button variants..."
if [ -f "frontend/src/components/features/opportunities/InterviewPrep.tsx" ]; then
    sed -i 's/variant="outline"/variant="outlined"/g' frontend/src/components/features/opportunities/InterviewPrep.tsx
    log_success "  Fixed InterviewPrep.tsx"
fi

# Fix 4: CareerIntelligence - Custom Button
log_info "Fix 4: CareerIntelligence Button variant..."
if [ -f "frontend/src/components/features/opportunities/CareerIntelligence.tsx" ]; then
    sed -i 's/variant="outlined"/variant="outline"/g' frontend/src/components/features/opportunities/CareerIntelligence.tsx
    log_success "  Fixed CareerIntelligence.tsx"
fi

# Fix 5: MUITest - Card variant
log_info "Fix 5: MUITest Card variant..."
if [ -f "frontend/src/components/features/demo/MUITest.tsx" ]; then
    sed -i 's/variant="outline"/variant="outlined"/g' frontend/src/components/features/demo/MUITest.tsx
    log_success "  Fixed MUITest.tsx Card variant"
fi

# Fix 6: JobInput - onChange signature
log_info "Fix 6: JobInput Tabs onChange..."
if [ -f "frontend/src/components/features/opportunities/JobInput.tsx" ]; then
    # MUI Tabs uses onChange with (event, value) signature
    sed -i 's/onChange={setJobSource}/onChange={(_, value) => setJobSource(value)}/g' frontend/src/components/features/opportunities/JobInput.tsx
    log_success "  Fixed JobInput.tsx Tabs onChange"
fi

# Fix 7: Icon fontSize - convert to sx prop
log_info "Fix 7: Converting Icon fontSize to sx prop..."
FILES_WITH_ICON_FONTSIZE=(
    "frontend/src/components/layout/AppLayout.tsx"
    "frontend/src/components/layout/PageHeader.tsx"
)

for file in "${FILES_WITH_ICON_FONTSIZE[@]}"; do
    if [ -f "$file" ]; then
        # This is complex - convert <Icon fontSize="..." /> to <Icon sx={{ fontSize: "..." }} />
        # Using perl for more complex regex
        perl -i -pe 's/<(\w+Icon)\s+fontSize="([^"]+)"\s*\/>/<$1 sx={{ fontSize: "$2" }} \/>/g' "$file"
        perl -i -pe 's/<(\w+Icon)([^>]*)\s+fontSize="([^"]+)"([^>]*)>/<$1$2 sx={{ fontSize: "$3" }}$4>/g' "$file"
        log_success "  Fixed Icon fontSize in $(basename $file)"
    fi
done

echo ""
log_success "✅ Critical fixes applied!"
echo ""
log_info "Remaining issues require manual intervention:"
echo "  - Storybook Meta/StoryObj exports (library version issue)"
echo "  - Dialog/Popover children wrapping (needs fragments)"
echo "  - UI component forwardRef implementations"
echo "  - AnimatedComponents prop structure"
echo ""
