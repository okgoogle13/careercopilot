#!/bin/bash

# TypeScript Validation Script
# Comprehensive TypeScript type checking and validation for frontend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
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

# Configuration
FRONTEND_DIR="frontend"
VERBOSE=false
FIX_ISSUES=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --verbose)
            VERBOSE=true
            shift
            ;;
        --fix)
            FIX_ISSUES=true
            shift
            ;;
        -h|--help)
            echo "TypeScript Validation Script"
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --verbose    Enable verbose output"
            echo "  --fix        Attempt to fix auto-fixable TypeScript issues"
            echo "  -h, --help   Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

log_info "Starting TypeScript validation..."

# Ensure we're in the project root
if [[ ! -d "$FRONTEND_DIR" ]]; then
    log_error "Frontend directory not found. Make sure you're in the project root."
    exit 1
fi

cd "$FRONTEND_DIR"

# Check if TypeScript is properly configured
log_info "Checking TypeScript configuration..."

if [[ ! -f "tsconfig.json" ]]; then
    log_error "tsconfig.json not found"
    exit 1
fi

if [[ ! -f "package.json" ]]; then
    log_error "package.json not found"
    exit 1
fi

# Verify TypeScript is installed
if ! command -v tsc &> /dev/null && ! npx tsc --version &> /dev/null; then
    log_error "TypeScript compiler not found"
    exit 1
fi

# Get TypeScript version
TS_VERSION=$(npx tsc --version 2>/dev/null || echo "unknown")
log_info "Using $TS_VERSION"

# Validate tsconfig.json syntax
log_info "Validating tsconfig.json syntax..."
if npx tsc --showConfig > /dev/null 2>&1; then
    log_success "tsconfig.json is valid"
else
    log_error "tsconfig.json has syntax errors"
    exit 1
fi

# Check for strict mode
log_info "Checking TypeScript strict mode configuration..."
if grep -q '"strict": true' tsconfig.json; then
    log_success "Strict mode is enabled"
else
    log_warning "Strict mode is not enabled - consider enabling for better type safety"
fi

# Check for important compiler options
IMPORTANT_OPTIONS=("noEmit" "skipLibCheck" "forceConsistentCasingInFileNames" "moduleResolution")
for option in "${IMPORTANT_OPTIONS[@]}"; do
    if grep -q "\"$option\"" tsconfig.json; then
        log_success "$option is configured"
    else
        log_warning "$option is not explicitly configured"
    fi
done

# Run type checking
log_info "Running TypeScript type checking..."

if [[ "$VERBOSE" == true ]]; then
    TYPE_CHECK_OUTPUT=$(npx tsc --noEmit --pretty 2>&1)
    TYPE_CHECK_STATUS=$?
else
    TYPE_CHECK_OUTPUT=$(npx tsc --noEmit 2>&1)
    TYPE_CHECK_STATUS=$?
fi

if [[ $TYPE_CHECK_STATUS -eq 0 ]]; then
    log_success "Type checking passed - no TypeScript errors found"
else
    log_error "Type checking failed"
    echo "$TYPE_CHECK_OUTPUT"

    # Count errors and warnings
    ERROR_COUNT=$(echo "$TYPE_CHECK_OUTPUT" | grep -c "error TS" || echo "0")
    log_error "Found $ERROR_COUNT TypeScript errors"

    # If fix flag is set, attempt some basic fixes
    if [[ "$FIX_ISSUES" == true ]]; then
        log_info "Attempting to fix auto-fixable issues..."

        # Run ESLint with TypeScript rules to fix some issues
        if yarn lint:fix; then
            log_success "ESLint fixes applied"

            # Re-run type checking to see if any errors were resolved
            log_info "Re-running type checking after fixes..."
            if npx tsc --noEmit; then
                log_success "Type checking now passes after auto-fixes"
                exit 0
            else
                log_warning "Some TypeScript errors remain after auto-fixes"
            fi
        else
            log_warning "ESLint fixes could not be applied"
        fi
    fi

    exit 1
fi

# Check for unused variables and imports (if possible)
log_info "Checking for potential unused code..."

# Use TypeScript compiler to check for unused locals
UNUSED_CHECK_OUTPUT=$(npx tsc --noEmit --noUnusedLocals --noUnusedParameters 2>&1 || true)
if echo "$UNUSED_CHECK_OUTPUT" | grep -q "is declared but never used"; then
    log_warning "Potential unused variables detected:"
    echo "$UNUSED_CHECK_OUTPUT" | grep "is declared but never used" | head -5
else
    log_success "No obvious unused variables detected"
fi

# Check source file structure
log_info "Analyzing TypeScript source structure..."

# Count TypeScript files
TS_FILES=$(find src -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l)
JS_FILES=$(find src -name "*.js" -o -name "*.jsx" 2>/dev/null | wc -l)

log_info "Found $TS_FILES TypeScript files and $JS_FILES JavaScript files"

if [[ $JS_FILES -gt 0 ]]; then
    log_warning "$JS_FILES JavaScript files found - consider migrating to TypeScript"
    if [[ "$VERBOSE" == true ]]; then
        echo "JavaScript files:"
        find src -name "*.js" -o -name "*.jsx" 2>/dev/null | head -5
    fi
fi

# Check for any files in common problematic locations
PROBLEMATIC_PATTERNS=("any" "@ts-ignore" "@ts-nocheck")
for pattern in "${PROBLEMATIC_PATTERNS[@]}"; do
    COUNT=$(grep -r "$pattern" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l || echo "0")
    if [[ $COUNT -gt 0 ]]; then
        log_warning "Found $COUNT occurrences of '$pattern' - consider addressing these"
        if [[ "$VERBOSE" == true ]]; then
            grep -r "$pattern" src/ --include="*.ts" --include="*.tsx" -n 2>/dev/null | head -3
        fi
    fi
done

# Check import/export consistency
log_info "Checking import/export consistency..."

# Look for potential circular dependencies (basic check)
if command -v madge &> /dev/null; then
    log_info "Running circular dependency check with madge..."
    if madge --circular --extensions ts,tsx src/; then
        log_success "No circular dependencies detected"
    else
        log_warning "Potential circular dependencies found"
    fi
else
    log_info "madge not available - skipping circular dependency check"
fi

# Validate type definitions
log_info "Checking type definitions..."

# Check for missing type declarations
MISSING_TYPES=$(npx tsc --noEmit --skipLibCheck false 2>&1 | grep "Cannot find module" || echo "")
if [[ -n "$MISSING_TYPES" ]]; then
    log_warning "Some type declarations may be missing:"
    echo "$MISSING_TYPES" | head -3
else
    log_success "All required type declarations found"
fi

# Performance checks
log_info "Running TypeScript performance checks..."

# Check compilation time
START_TIME=$(date +%s)
npx tsc --noEmit --extendedDiagnostics > /tmp/ts-diagnostics.log 2>&1 || true
END_TIME=$(date +%s)
COMPILE_TIME=$((END_TIME - START_TIME))

log_info "Type checking completed in ${COMPILE_TIME} seconds"

if [[ $COMPILE_TIME -gt 30 ]]; then
    log_warning "Type checking took longer than 30 seconds - consider optimizing"
fi

# Check for large files that might slow compilation
LARGE_FILES=$(find src -name "*.ts" -o -name "*.tsx" | xargs wc -l 2>/dev/null | sort -nr | head -5)
log_info "Largest TypeScript files by line count:"
echo "$LARGE_FILES" | head -3

log_success "TypeScript validation completed successfully!"

# Summary
echo ""
log_info "=== TypeScript Validation Summary ==="
log_info "TypeScript files: $TS_FILES"
log_info "JavaScript files: $JS_FILES"
log_info "Compilation time: ${COMPILE_TIME}s"
log_success "All TypeScript validations passed! ✅"
