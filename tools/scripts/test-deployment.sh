#!/bin/bash

# Test Deployment Readiness Script
# Validates all configurations and dependencies without deploying

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
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Test results tracking
FAILED_TESTS=0
TOTAL_TESTS=0

# Test helper functions
run_test() {
    local test_name="$1"
    local test_command="$2"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    log_info "Running test: $test_name"

    if eval "$test_command" > /dev/null 2>&1; then
        log_success "✓ $test_name"
        return 0
    else
        log_error "✗ $test_name"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Main validation checks
main() {
    log_info "Starting deployment readiness validation..."
    echo

    # Change to root directory
    cd "$ROOT_DIR"

    # 1. TypeScript compilation
    run_test "TypeScript compilation" "yarn build"

    # 2. Linting
    run_test "Linting check" "yarn lint"

    # 3. Frontend tests
    run_test "Frontend tests" "yarn test --passWithNoTests"

    # 4. Backend tests
    run_test "Backend tests" "pytest backend/app/tests/ -v"

    # 5. Production secrets validation
    run_test "Production secrets" "python3 scripts/production-secrets-validator.py"

    # 6. Configuration validation
    run_test "Configuration validation" "python3 scripts/test-configuration.py"

    # 7. Firebase configuration
    run_test "Firebase configuration" "python3 scripts/setup-firebase-config.py --validate"

    # 8. Genkit verification
    run_test "Genkit integration" "python3 verify_genkit.py"

    echo
    log_info "Test Results:"
    log_info "Total tests: $TOTAL_TESTS"
    log_info "Failed tests: $FAILED_TESTS"

    if [ $FAILED_TESTS -eq 0 ]; then
        log_success "✓ All tests passed! Deployment is ready."
        exit 0
    else
        log_error "✗ $FAILED_TESTS test(s) failed. Fix issues before deployment."
        exit 1
    fi
}

# Run main function
main "$@"
