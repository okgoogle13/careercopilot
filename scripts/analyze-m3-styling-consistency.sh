#!/bin/bash
# M3 Styling Consistency Analyzer
# Analyzes all M3 component CSS files for consistency with design tokens

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

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header "M3 Styling Consistency Analysis"

COMPONENT_DIR="frontend/src/components/m3-expressive"
TOKENS_FILE="frontend/src/styles/m3-design-tokens.css"

if [ ! -d "$COMPONENT_DIR" ]; then
    print_error "M3 components directory not found: $COMPONENT_DIR"
    exit 1
fi

if [ ! -f "$TOKENS_FILE" ]; then
    print_error "Design tokens file not found: $TOKENS_FILE"
    exit 1
fi

# Find all CSS files
CSS_FILES=$(find "$COMPONENT_DIR" -name "*.css" -type f | sort)

TOTAL_FILES=$(echo "$CSS_FILES" | wc -l | tr -d ' ')
print_success "Found $TOTAL_FILES component CSS files"

# Analysis categories
HARDCODED_COLORS=0
HARDCODED_SPACING=0
HARDCODED_SHADOWS=0
MISSING_TOKENS=0
INCONSISTENT_PATTERNS=0

print_header "Step 1: Checking for Hardcoded Values"

while IFS= read -r css_file; do
    if [ -f "$css_file" ]; then
        filename=$(basename "$css_file")
        
        # Check for hardcoded colors
        hardcoded_colors=$(grep -oE "(#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\))" "$css_file" 2>/dev/null | wc -l | tr -d ' ' || echo "0")
        if [ "$hardcoded_colors" -gt 0 ]; then
            print_warning "$filename: $hardcoded_colors hardcoded color(s) found"
            HARDCODED_COLORS=$((HARDCODED_COLORS + hardcoded_colors))
        fi
        
        # Check for hardcoded spacing (px values that should be tokens)
        hardcoded_spacing=$(grep -oE "[0-9]+px" "$css_file" 2>/dev/null | grep -vE "(0px|1px|2px)" | wc -l | tr -d ' ' || echo "0")
        if [ "$hardcoded_spacing" -gt 0 ]; then
            print_warning "$filename: $hardcoded_spacing hardcoded spacing value(s) found"
            HARDCODED_SPACING=$((HARDCODED_SPACING + hardcoded_spacing))
        fi
        
        # Check for hardcoded shadows (box-shadow with hardcoded values)
        hardcoded_shadows=$(grep -cE "box-shadow:\s*[0-9]" "$css_file" 2>/dev/null || echo "0")
        if [ "$hardcoded_shadows" -gt 0 ]; then
            print_warning "$filename: $hardcoded_shadows hardcoded shadow(s) found"
            HARDCODED_SHADOWS=$((HARDCODED_SHADOWS + hardcoded_shadows))
        fi
        
        # Check for missing token usage
        token_usage=$(grep -cE "--md-sys-" "$css_file" 2>/dev/null || echo "0")
        if [ "$token_usage" -eq 0 ] && [ -s "$css_file" ]; then
            print_warning "$filename: No design tokens found"
            MISSING_TOKENS=$((MISSING_TOKENS + 1))
        fi
    fi
done <<< "$CSS_FILES"

print_header "Step 2: Token Usage Analysis"

# Count token categories used
COLOR_TOKENS=$(grep -rhE "--md-sys-color-" "$COMPONENT_DIR" --include="*.css" | wc -l | tr -d ' ')
SPACING_TOKENS=$(grep -rhE "--md-sys-spacing-" "$COMPONENT_DIR" --include="*.css" | wc -l | tr -d ' ')
SHAPE_TOKENS=$(grep -rhE "--md-sys-shape-" "$COMPONENT_DIR" --include="*.css" | wc -l | tr -d ' ')
TYPOGRAPHY_TOKENS=$(grep -rhE "--md-sys-typescale-" "$COMPONENT_DIR" --include="*.css" | wc -l | tr -d ' ')
ELEVATION_TOKENS=$(grep -rhE "--md-sys-elevation-" "$COMPONENT_DIR" --include="*.css" | wc -l | tr -d ' ')
MOTION_TOKENS=$(grep -rhE "--md-sys-motion-" "$COMPONENT_DIR" --include="*.css" | wc -l | tr -d ' ')

print_success "Token Usage Statistics:"
echo "  • Color tokens: $COLOR_TOKENS"
echo "  • Spacing tokens: $SPACING_TOKENS"
echo "  • Shape tokens: $SHAPE_TOKENS"
echo "  • Typography tokens: $TYPOGRAPHY_TOKENS"
echo "  • Elevation tokens: $ELEVATION_TOKENS"
echo "  • Motion tokens: $MOTION_TOKENS"

print_header "Step 3: Consistency Check"

# Check for common patterns
print_success "Checking common styling patterns..."

# Check border-radius consistency
BORDER_RADIUS_PATTERNS=$(grep -rhE "border-radius:" "$COMPONENT_DIR" --include="*.css" | grep -vE "--md-sys-shape" | wc -l | tr -d ' ')
if [ "$BORDER_RADIUS_PATTERNS" -gt 0 ]; then
    print_warning "Found $BORDER_RADIUS_PATTERNS border-radius values not using shape tokens"
    INCONSISTENT_PATTERNS=$((INCONSISTENT_PATTERNS + BORDER_RADIUS_PATTERNS))
fi

# Check transition consistency
TRANSITION_PATTERNS=$(grep -rhE "transition:" "$COMPONENT_DIR" --include="*.css" | grep -vE "--md-sys-motion" | wc -l | tr -d ' ')
if [ "$TRANSITION_PATTERNS" -gt 0 ]; then
    print_warning "Found $TRANSITION_PATTERNS transition values not using motion tokens"
    INCONSISTENT_PATTERNS=$((INCONSISTENT_PATTERNS + TRANSITION_PATTERNS))
fi

print_header "Analysis Summary"

echo "════════════════════════════════════════"
echo "Issues Found:"
echo "════════════════════════════════════════"
echo "  • Hardcoded colors: $HARDCODED_COLORS"
echo "  • Hardcoded spacing: $HARDCODED_SPACING"
echo "  • Hardcoded shadows: $HARDCODED_SHADOWS"
echo "  • Files missing tokens: $MISSING_TOKENS"
echo "  • Inconsistent patterns: $INCONSISTENT_PATTERNS"
echo ""

TOTAL_ISSUES=$((HARDCODED_COLORS + HARDCODED_SPACING + HARDCODED_SHADOWS + MISSING_TOKENS + INCONSISTENT_PATTERNS))

if [ "$TOTAL_ISSUES" -eq 0 ]; then
    print_success "Perfect! All components use design tokens consistently!"
    exit 0
elif [ "$TOTAL_ISSUES" -lt 10 ]; then
    print_warning "Minor inconsistencies found. Review recommended."
    exit 0
else
    print_error "Significant inconsistencies found. Review required."
    echo ""
    echo "Recommendations:"
    echo "  1. Replace hardcoded colors with --md-sys-color-* tokens"
    echo "  2. Replace hardcoded spacing with --md-sys-spacing-* tokens"
    echo "  3. Replace hardcoded shadows with --md-sys-elevation-* tokens"
    echo "  4. Review components with missing tokens"
    exit 1
fi

