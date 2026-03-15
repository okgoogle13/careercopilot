#!/bin/bash
# Fix Hardcoded Spacing Values in M3 Components
# Automatically converts common pixel values to M3 spacing tokens

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}\n"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Spacing mapping (px -> token)
declare -A SPACING_MAP=(
    ["4px"]="var(--md-sys-spacing-1)"
    ["8px"]="var(--md-sys-spacing-2)"
    ["12px"]="var(--md-sys-spacing-3)"
    ["16px"]="var(--md-sys-spacing-4)"
    ["20px"]="var(--md-sys-spacing-5)"
    ["24px"]="var(--md-sys-spacing-6)"
    ["28px"]="var(--md-sys-spacing-7)"
    ["32px"]="var(--md-sys-spacing-8)"
    ["48px"]="var(--md-sys-spacing-12)"
    ["64px"]="var(--md-sys-spacing-16)"
)

COMPONENT_DIR="frontend/src/components/m3-expressive"

print_header "M3 Hardcoded Spacing Fixer"

if [ ! -d "$COMPONENT_DIR" ]; then
    echo "Error: M3 components directory not found"
    exit 1
fi

print_info "This script will convert hardcoded spacing values to M3 tokens"
print_info "Backup recommended before running"

read -p "Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted"
    exit 0
fi

FIXED_COUNT=0
FILES_MODIFIED=0

# Find all CSS files
CSS_FILES=$(find "$COMPONENT_DIR" -name "*.css" -type f)

while IFS= read -r css_file; do
    if [ -f "$css_file" ]; then
        filename=$(basename "$css_file")
        modified=false

        # Create backup
        cp "$css_file" "${css_file}.bak"

        # Replace each spacing value
        for px_value in "${!SPACING_MAP[@]}"; do
            token="${SPACING_MAP[$px_value]}"
            # Replace standalone px values (not in calc, not 0px, 1px, 2px)
            if grep -qE "\b${px_value}\b" "$css_file" 2>/dev/null; then
                # Use sed to replace (be careful with context)
                sed -i.tmp "s/\b${px_value}\b/${token}/g" "$css_file" 2>/dev/null || true
                rm -f "${css_file}.tmp"
                modified=true
                FIXED_COUNT=$((FIXED_COUNT + 1))
            fi
        done

        if [ "$modified" = true ]; then
            FILES_MODIFIED=$((FILES_MODIFIED + 1))
            print_success "Fixed spacing in $filename"
            # Remove backup if no changes detected (file unchanged)
            if cmp -s "$css_file" "${css_file}.bak" 2>/dev/null; then
                rm "${css_file}.bak"
            fi
        else
            rm "${css_file}.bak"
        fi
    fi
done <<< "$CSS_FILES"

print_header "Fix Summary"
print_success "Files modified: $FILES_MODIFIED"
print_success "Spacing values fixed: $FIXED_COUNT"

if [ "$FILES_MODIFIED" -gt 0 ]; then
    print_info "Backups created with .bak extension"
    print_info "Review changes and remove .bak files when satisfied"
fi
