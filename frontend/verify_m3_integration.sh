#!/bin/bash
# M3 Design Token Integration Verification Script
# Run this script to verify all M3 changes are working correctly

echo "================================================"
echo "🎨 M3 Design Token Integration Verification"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check 1: Verify design tokens file exists
echo "📋 Step 1: Checking design tokens..."
if [ -f "src/theme/design-tokens.css" ]; then
    if grep -q "sys-space-xl" src/theme/design-tokens.css; then
        echo -e "${GREEN}✓${NC} M3 spacing tokens found"
    else
        echo -e "${RED}✗${NC} M3 spacing tokens missing"
    fi
else
    echo -e "${RED}✗${NC} design-tokens.css not found"
fi

# Check 2: Verify M3 utilities in index.css
echo ""
echo "📋 Step 2: Checking M3 utility classes..."
if [ -f "src/index.css" ]; then
    utilities_count=0
    
    if grep -q "shadow-elevation-1" src/index.css; then
        echo -e "${GREEN}✓${NC} Elevation utilities found"
        ((utilities_count++))
    fi
    
    if grep -q "rounded-pebble" src/index.css; then
        echo -e "${GREEN}✓${NC} Organic shape utilities found"
        ((utilities_count++))
    fi
    
    if grep -q "ease-spring" src/index.css; then
        echo -e "${GREEN}✓${NC} Motion easing utilities found"
        ((utilities_count++))
    fi
    
    if grep -q "text-headline-large" src/index.css; then
        echo -e "${GREEN}✓${NC} Typography utilities found"
        ((utilities_count++))
    fi
    
    if grep -q "p-space-xl" src/index.css; then
        echo -e "${GREEN}✓${NC} Spacing utilities found"
        ((utilities_count++))
    fi
    
    echo -e "${GREEN}$utilities_count/5${NC} M3 utility categories implemented"
else
    echo -e "${RED}✗${NC} index.css not found"
fi

# Check 3: Verify ApplicationCard component updated
echo ""
echo "📋 Step 3: Checking ApplicationCard component..."
if [ -f "src/components/shared/ApplicationCard.tsx" ]; then
    if grep -q "rounded-pebble" src/components/shared/ApplicationCard.tsx; then
        echo -e "${GREEN}✓${NC} ApplicationCard uses organic shape (pebble)"
    else
        echo -e "${YELLOW}⚠${NC} ApplicationCard still using generic rounded corners"
    fi
    
    if grep -q "p-space-xl" src/components/shared/ApplicationCard.tsx; then
        echo -e "${GREEN}✓${NC} ApplicationCard uses M3 spacing"
    else
        echo -e "${YELLOW}⚠${NC} ApplicationCard still using ad-hoc padding"
    fi
    
    if grep -q "M3 Compliant" src/components/shared/ApplicationCard.tsx; then
        echo -e "${GREEN}✓${NC} ApplicationCard has JSDoc documentation"
    else
        echo -e "${YELLOW}⚠${NC} ApplicationCard missing JSDoc"
    fi
else
    echo -e "${RED}✗${NC} ApplicationCard.tsx not found"
fi

# Check 4: Verify Storybook story exists
echo ""
echo "📋 Step 4: Checking Storybook story..."
if [ -f "src/components/shared/ApplicationCard.stories.tsx" ]; then
    echo -e "${GREEN}✓${NC} ApplicationCard Storybook story created"
    story_count=$(grep -c "export const" src/components/shared/ApplicationCard.stories.tsx || echo "0")
    echo -e "${GREEN}$story_count${NC} stories defined"
else
    echo -e "${RED}✗${NC} ApplicationCard.stories.tsx not found"
fi

# Check 5: Documentation
echo ""
echo "📋 Step 5: Checking documentation..."
docs_count=0

if [ -f "../docs/M3_APPLICATIONCARD_AUDIT.md" ]; then
    echo -e "${GREEN}✓${NC} M3 audit document created"
    ((docs_count++))
fi

if [ -f "../docs/M3_FINAL_SPRINT_SUMMARY.md" ]; then
    echo -e "${GREEN}✓${NC} Final sprint summary created"
    ((docs_count++))
fi

echo -e "${GREEN}$docs_count/2${NC} documentation files present"

# Final summary
echo ""
echo "================================================"
echo "📊 Verification Summary"
echo "================================================"
echo ""
echo "Next Steps:"
echo "  1. Start Storybook: ${YELLOW}yarn storybook${NC}"
echo "  2. Navigate to: Shared → ApplicationCard"
echo "  3. Verify organic pebble shape on card corners"
echo "  4. Test hover state for elevation change"
echo "  5. Check all story variants render correctly"
echo ""
echo "For detailed audit results, see:"
echo "  ${YELLOW}docs/M3_APPLICATIONCARD_AUDIT.md${NC}"
echo ""
echo "For complete summary, see:"
echo "  ${YELLOW}docs/M3_FINAL_SPRINT_SUMMARY.md${NC}"
echo ""
echo "================================================"
