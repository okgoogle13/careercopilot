#!/bin/bash
# M3 Token Consistency Verification Script
# Verifies that all M3 components use consistent design tokens

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

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_header "M3 Token Consistency Verification"

# Check if design tokens file exists
TOKENS_FILE="frontend/src/styles/m3-design-tokens.css"
if [ ! -f "$TOKENS_FILE" ]; then
    print_error "Design tokens file not found: $TOKENS_FILE"
    exit 1
fi

print_success "Design tokens file found"

# Extract all token names from the CSS file
print_header "Step 1: Extracting Design Tokens"
TOKEN_COUNT=$(grep -oE '--md-sys-[a-z-]+:[^;]+' "$TOKENS_FILE" | wc -l | tr -d ' ')
print_success "Found $TOKEN_COUNT design tokens"

# Check for common token categories
print_header "Step 2: Verifying Token Categories"

CATEGORIES=("color" "spacing" "shape" "typography" "motion" "elevation")

for category in "${CATEGORIES[@]}"; do
    COUNT=$(grep -cE "--md-sys-$category-" "$TOKENS_FILE" || echo "0")
    if [ "$COUNT" -gt 0 ]; then
        print_success "$category tokens: $COUNT found"
    else
        print_warning "$category tokens: none found"
    fi
done

# Check component CSS files for token usage
print_header "Step 3: Verifying Component Token Usage"

COMPONENT_DIR="frontend/src/components/m3-expressive"
if [ ! -d "$COMPONENT_DIR" ]; then
    print_error "M3 components directory not found: $COMPONENT_DIR"
    exit 1
fi

# Find all CSS files
CSS_FILES=$(find "$COMPONENT_DIR" -name "*.css" -type f)

TOTAL_CSS_FILES=$(echo "$CSS_FILES" | wc -l | tr -d ' ')
print_success "Found $TOTAL_CSS_FILES component CSS files"

# Check each CSS file for token usage
print_header "Step 4: Checking Token Usage in Components"

MISSING_TOKENS=0
HARDCODED_VALUES=0

while IFS= read -r css_file; do
    if [ -f "$css_file" ]; then
        # Check for hardcoded values (common anti-patterns)
        HARDCODED=$(grep -cE "(#[0-9a-fA-F]{3,6}|rgb\(|rgba\(|[0-9]+px|[0-9]+rem)" "$css_file" || echo "0")
        if [ "$HARDCODED" -gt 0 ]; then
            print_warning "$(basename "$css_file"): $HARDCODED potential hardcoded values"
            HARDCODED_VALUES=$((HARDCODED_VALUES + HARDCODED))
        fi
        
        # Check for token usage
        TOKEN_USAGE=$(grep -cE "--md-sys-" "$css_file" || echo "0")
        if [ "$TOKEN_USAGE" -eq 0 ] && [ -s "$css_file" ]; then
            print_warning "$(basename "$css_file"): No design tokens found"
            MISSING_TOKENS=$((MISSING_TOKENS + 1))
        fi
    fi
done <<< "$CSS_FILES"

# Summary
print_header "Verification Summary"

if [ "$MISSING_TOKENS" -eq 0 ] && [ "$HARDCODED_VALUES" -eq 0 ]; then
    print_success "All components use design tokens consistently!"
    echo ""
    echo "Token Statistics:"
    echo "  • Total tokens: $TOKEN_COUNT"
    echo "  • Component CSS files: $TOTAL_CSS_FILES"
    echo "  • Components with tokens: $TOTAL_CSS_FILES"
    echo ""
    exit 0
else
    print_warning "Some inconsistencies found:"
    echo "  • Components missing tokens: $MISSING_TOKENS"
    echo "  • Potential hardcoded values: $HARDCODED_VALUES"
    echo ""
    echo "Recommendation: Review components and replace hardcoded values with design tokens"
    exit 1
fi

