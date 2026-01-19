#!/bin/bash

# Frontend Deployment Readiness Check Script
# Validates TypeScript, builds, linting, testing, and bundle optimization

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
SKIP_TESTS=false
SKIP_BUILD=false
SKIP_LINT=false
BUNDLE_ANALYZE=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --skip-lint)
            SKIP_LINT=true
            shift
            ;;
        --bundle-analyze)
            BUNDLE_ANALYZE=true
            shift
            ;;
        -h|--help)
            echo "Frontend Deployment Readiness Check"
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --skip-tests     Skip running tests"
            echo "  --skip-build     Skip build validation"
            echo "  --skip-lint      Skip linting checks"
            echo "  --bundle-analyze Enable bundle analysis"
            echo "  -h, --help       Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

log_info "Starting Frontend Deployment Readiness Check..."

# Ensure we're in the project root
if [[ ! -d "$FRONTEND_DIR" ]]; then
    log_error "Frontend directory not found. Make sure you're in the project root."
    exit 1
fi

cd "$FRONTEND_DIR"

# Check if package.json exists
if [[ ! -f "package.json" ]]; then
    log_error "package.json not found in frontend directory"
    exit 1
fi

# 1. Check Node.js and npm versions
log_info "Checking Node.js and package manager versions..."
node --version
npm --version
if command -v yarn &> /dev/null; then
    yarn --version
fi

# 2. Install dependencies if needed
log_info "Checking dependencies..."
if [[ ! -d "node_modules" ]] || [[ "package.json" -nt "node_modules" ]]; then
    log_info "Installing dependencies..."
    if command -v yarn &> /dev/null; then
        yarn install --frozen-lockfile
    else
        npm ci
    fi
else
    log_success "Dependencies are up to date"
fi

# 3. TypeScript type checking
log_info "Running TypeScript type checking..."
if npm run type-check; then
    log_success "TypeScript type checking passed"
else
    log_error "TypeScript type checking failed"
    exit 1
fi

# 4. Code formatting check
log_info "Checking code formatting..."
if npm run format:check; then
    log_success "Code formatting is correct"
else
    log_warning "Code formatting issues found. Run 'npm run format' to fix."
fi

# 5. Linting (if not skipped)
if [[ "$SKIP_LINT" == false ]]; then
    log_info "Running ESLint checks..."
    if npm run lint:ci; then
        log_success "Linting passed"
    else
        log_error "Linting failed"
        exit 1
    fi
else
    log_warning "Skipping linting checks"
fi

# 6. Tests (if not skipped)
if [[ "$SKIP_TESTS" == false ]]; then
    log_info "Running unit tests..."
    if npm run test; then
        log_success "Unit tests passed"
    else
        log_error "Unit tests failed"
        exit 1
    fi

    # E2E tests (if Playwright is available)
    if command -v npx playwright --version &> /dev/null; then
        log_info "Running E2E tests..."
        if npm run test:e2e; then
            log_success "E2E tests passed"
        else
            log_warning "E2E tests failed or skipped"
        fi
    else
        log_warning "Playwright not available, skipping E2E tests"
    fi
else
    log_warning "Skipping tests"
fi

# 7. Build validation (if not skipped)
if [[ "$SKIP_BUILD" == false ]]; then
    log_info "Running production build..."

    # Clean previous build
    npm run clean 2>/dev/null || true

    # Build for production
    if npm run build; then
        log_success "Production build successful"

        # Check if dist directory exists and has content
        if [[ -d "dist" ]] && [[ -n "$(ls -A dist 2>/dev/null)" ]]; then
            log_success "Build artifacts generated successfully"

            # Display build size info
            log_info "Build size analysis:"
            du -sh dist

            # Count generated files
            FILE_COUNT=$(find dist -type f | wc -l)
            log_info "Generated $FILE_COUNT files"

            # Check for critical files
            if [[ -f "dist/index.html" ]]; then
                log_success "index.html generated"
            else
                log_error "index.html not found in build output"
                exit 1
            fi

            # Find and report JavaScript bundles
            JS_FILES=$(find dist -name "*.js" -type f | head -5)
            if [[ -n "$JS_FILES" ]]; then
                log_success "JavaScript bundles generated:"
                echo "$JS_FILES" | while read -r file; do
                    size=$(du -h "$file" | cut -f1)
                    echo "  - $(basename "$file"): $size"
                done
            fi

        else
            log_error "Build output directory is empty"
            exit 1
        fi

    else
        log_error "Production build failed"
        exit 1
    fi
else
    log_warning "Skipping build validation"
fi

# 8. Bundle analysis (if requested)
if [[ "$BUNDLE_ANALYZE" == true ]]; then
    log_info "Running bundle analysis..."

    # Build with analyze mode if supported
    if npm run build -- --mode=analyze 2>/dev/null; then
        log_success "Bundle analysis build completed"
    else
        log_warning "Bundle analysis mode not supported, running standard build"
    fi

    # Generate bundle analysis report
    if npm run bundle-analysis; then
        log_success "Bundle analysis completed"
    else
        log_warning "Bundle analysis script not available"
    fi
fi

# 9. Security checks (basic)
log_info "Running basic security checks..."

# Check for vulnerable dependencies
if npm audit --audit-level=moderate; then
    log_success "No moderate or high security vulnerabilities found"
else
    log_warning "Security vulnerabilities detected. Run 'npm audit fix' to resolve."
fi

# Check for common security issues in build output
if [[ -d "dist" ]]; then
    # Check for accidentally committed secrets in built files
    if grep -r -E "(api_key|secret|password|token)" dist/ --include="*.js" --include="*.html" 2>/dev/null; then
        log_warning "Potential secrets found in build output. Review carefully."
    else
        log_success "No obvious secrets detected in build output"
    fi
fi

# 10. Environment configuration check
log_info "Checking environment configuration..."

# Check if required environment files exist
ENV_FILES=(".env.example" "../.env.example")
for env_file in "${ENV_FILES[@]}"; do
    if [[ -f "$env_file" ]]; then
        log_success "Found $env_file"
    else
        log_warning "$env_file not found"
    fi
done

# 11. Performance optimization checks
log_info "Checking performance optimizations..."

if [[ -f "vite.config.ts" ]]; then
    # Check for code splitting configuration
    if grep -q "manualChunks" vite.config.ts; then
        log_success "Code splitting configured"
    else
        log_warning "Code splitting not configured"
    fi

    # Check for minification
    if grep -q "minify" vite.config.ts; then
        log_success "Minification configured"
    else
        log_warning "Minification not explicitly configured"
    fi
fi

# Final summary
log_success "Frontend deployment readiness check completed!"

if [[ "$SKIP_BUILD" == false ]] && [[ -d "dist" ]]; then
    log_info "Build artifacts are ready in the 'dist' directory"
    log_info "Total build size: $(du -sh dist | cut -f1)"
fi

log_info "Ready for deployment! 🚀"
