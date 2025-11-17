#!/bin/bash
#
# GitHub Secrets Setup Script
# Automates the setup of required GitHub secrets for CI/CD workflows
#
# Usage: ./scripts/setup-github-secrets-comprehensive.sh [--interactive|--from-env|--validate|--help]
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
MODE="${1:---interactive}"

# Check if gh CLI is installed
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        echo -e "${RED}❌ GitHub CLI (gh) is not installed${NC}"
        echo "Install it from: https://cli.github.com/"
        exit 1
    fi

    # Check if authenticated
    if ! gh auth status &> /dev/null; then
        echo -e "${YELLOW}⚠️  Not authenticated with GitHub${NC}"
        echo "Run: gh auth login"
        exit 1
    fi

    echo -e "${GREEN}✅ GitHub CLI is installed and authenticated${NC}"
}

# Print help message
print_help() {
    cat << EOF
${BLUE}GitHub Secrets Setup Script${NC}

Usage: $0 [OPTIONS]

Options:
  --interactive    Interactive mode - prompts for each secret (default)
  --from-env       Read secrets from environment variables
  --validate       Only validate existing secrets (no changes)
  --help           Display this help message

Modes:
  1. Interactive: Prompts you to enter each secret value
  2. From Environment: Reads secrets from environment variables
  3. Validate: Checks if all required secrets are set

Required Secrets:
  CI Workflow:
    - TC_CLOUD_TOKEN
    - GEMINI_API_KEY_STAGING
    - CODECOV_TOKEN (optional)
    - GCP_WORKLOAD_IDENTITY_PROVIDER
    - GCP_SERVICE_ACCOUNT

  Deployment Workflow:
    - GCP_STAGING_WIF_PROVIDER
    - GCP_STAGING_WIF_SA_EMAIL
    - GCP_STAGING_PROJECT_ID
    - GCP_PROD_WIF_PROVIDER
    - GCP_PROD_WIF_SA_EMAIL
    - GCP_PROJECT_ID

Examples:
  # Interactive setup
  $0 --interactive

  # Setup from environment
  export TC_CLOUD_TOKEN="your-token"
  export GEMINI_API_KEY_STAGING="your-key"
  $0 --from-env

  # Validate existing secrets
  $0 --validate

Documentation:
  See docs/GITHUB_SECRETS_SETUP.md for detailed setup instructions.

EOF
}

# Validate existing secrets
validate_secrets() {
    echo -e "${BLUE}📋 Validating GitHub Secrets...${NC}\n"

    local required_secrets=(
        "TC_CLOUD_TOKEN"
        "GEMINI_API_KEY_STAGING"
        "GCP_WORKLOAD_IDENTITY_PROVIDER"
        "GCP_SERVICE_ACCOUNT"
        "GCP_STAGING_WIF_PROVIDER"
        "GCP_STAGING_WIF_SA_EMAIL"
        "GCP_STAGING_PROJECT_ID"
        "GCP_PROD_WIF_PROVIDER"
        "GCP_PROD_WIF_SA_EMAIL"
        "GCP_PROJECT_ID"
    )

    local optional_secrets=(
        "CODECOV_TOKEN"
    )

    local existing_secrets
    existing_secrets=$(gh secret list --json name -q '.[].name' 2>/dev/null || echo "")

    local missing_required=()
    local missing_optional=()
    local found_required=0
    local found_optional=0

    # Check required secrets
    for secret in "${required_secrets[@]}"; do
        if echo "$existing_secrets" | grep -q "^${secret}$"; then
            echo -e "${GREEN}✅ ${secret}${NC}"
            found_required=$((found_required + 1))
        else
            echo -e "${RED}❌ ${secret} (REQUIRED)${NC}"
            missing_required+=("$secret")
        fi
    done

    # Check optional secrets
    for secret in "${optional_secrets[@]}"; do
        if echo "$existing_secrets" | grep -q "^${secret}$"; then
            echo -e "${GREEN}✅ ${secret} (optional)${NC}"
            found_optional=$((found_optional + 1))
        else
            echo -e "${YELLOW}⚠️  ${secret} (optional)${NC}"
            missing_optional+=("$secret")
        fi
    done

    echo ""
    echo -e "${BLUE}Summary:${NC}"
    echo -e "  Required: ${found_required}/${#required_secrets[@]} set"
    echo -e "  Optional: ${found_optional}/${#optional_secrets[@]} set"

    if [ ${#missing_required[@]} -gt 0 ]; then
        echo -e "\n${RED}Missing required secrets:${NC}"
        for secret in "${missing_required[@]}"; do
            echo "  - $secret"
        done
        return 1
    else
        echo -e "\n${GREEN}✅ All required secrets are set!${NC}"
        return 0
    fi
}

# Set a secret with validation
set_secret() {
    local name="$1"
    local value="$2"
    local is_optional="${3:-false}"

    if [ -z "$value" ]; then
        if [ "$is_optional" = "true" ]; then
            echo -e "${YELLOW}⚠️  Skipping optional secret: ${name}${NC}"
            return 0
        else
            echo -e "${RED}❌ Error: Value for ${name} is empty${NC}"
            return 1
        fi
    fi

    echo -n "Setting ${name}... "
    if echo "$value" | gh secret set "$name"; then
        echo -e "${GREEN}✅ Success${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed${NC}"
        return 1
    fi
}

# Interactive mode
interactive_setup() {
    echo -e "${BLUE}🔐 GitHub Secrets Interactive Setup${NC}\n"
    echo "This will guide you through setting up all required secrets."
    echo "Press Enter to skip optional secrets."
    echo ""

    # CI Secrets
    echo -e "${BLUE}=== CI Workflow Secrets ===${NC}\n"

    read -r -p "Enter TC_CLOUD_TOKEN (Testcontainers Cloud token): " TC_CLOUD_TOKEN
    set_secret "TC_CLOUD_TOKEN" "$TC_CLOUD_TOKEN"

    read -r -s -p "Enter GEMINI_API_KEY_STAGING (Gemini AI key for staging): " GEMINI_API_KEY_STAGING
    echo ""
    set_secret "GEMINI_API_KEY_STAGING" "$GEMINI_API_KEY_STAGING"

    read -r -p "Enter CODECOV_TOKEN (optional, press Enter to skip): " CODECOV_TOKEN
    set_secret "CODECOV_TOKEN" "$CODECOV_TOKEN" "true"

    read -r -p "Enter GCP_WORKLOAD_IDENTITY_PROVIDER (WIF provider for CI): " GCP_WORKLOAD_IDENTITY_PROVIDER
    set_secret "GCP_WORKLOAD_IDENTITY_PROVIDER" "$GCP_WORKLOAD_IDENTITY_PROVIDER"

    read -r -p "Enter GCP_SERVICE_ACCOUNT (Service account email for CI): " GCP_SERVICE_ACCOUNT
    set_secret "GCP_SERVICE_ACCOUNT" "$GCP_SERVICE_ACCOUNT"

    # Staging Secrets
    echo -e "\n${BLUE}=== Staging Deployment Secrets ===${NC}\n"

    read -r -p "Enter GCP_STAGING_WIF_PROVIDER: " GCP_STAGING_WIF_PROVIDER
    set_secret "GCP_STAGING_WIF_PROVIDER" "$GCP_STAGING_WIF_PROVIDER"

    read -r -p "Enter GCP_STAGING_WIF_SA_EMAIL: " GCP_STAGING_WIF_SA_EMAIL
    set_secret "GCP_STAGING_WIF_SA_EMAIL" "$GCP_STAGING_WIF_SA_EMAIL"

    read -r -p "Enter GCP_STAGING_PROJECT_ID: " GCP_STAGING_PROJECT_ID
    set_secret "GCP_STAGING_PROJECT_ID" "$GCP_STAGING_PROJECT_ID"

    # Production Secrets
    echo -e "\n${BLUE}=== Production Deployment Secrets ===${NC}\n"

    read -r -p "Enter GCP_PROD_WIF_PROVIDER: " GCP_PROD_WIF_PROVIDER
    set_secret "GCP_PROD_WIF_PROVIDER" "$GCP_PROD_WIF_PROVIDER"

    read -r -p "Enter GCP_PROD_WIF_SA_EMAIL: " GCP_PROD_WIF_SA_EMAIL
    set_secret "GCP_PROD_WIF_SA_EMAIL" "$GCP_PROD_WIF_SA_EMAIL"

    read -r -p "Enter GCP_PROJECT_ID (production): " GCP_PROJECT_ID
    set_secret "GCP_PROJECT_ID" "$GCP_PROJECT_ID"

    echo -e "\n${GREEN}✅ Setup complete!${NC}"
}

# Setup from environment variables
env_setup() {
    echo -e "${BLUE}🔐 Setting up GitHub Secrets from Environment Variables${NC}\n"

    local failed=0

    # CI Secrets
    echo -e "${BLUE}=== CI Workflow Secrets ===${NC}"
    set_secret "TC_CLOUD_TOKEN" "${TC_CLOUD_TOKEN:-}" || failed=1
    set_secret "GEMINI_API_KEY_STAGING" "${GEMINI_API_KEY_STAGING:-}" || failed=1
    set_secret "CODECOV_TOKEN" "${CODECOV_TOKEN:-}" "true"
    set_secret "GCP_WORKLOAD_IDENTITY_PROVIDER" "${GCP_WORKLOAD_IDENTITY_PROVIDER:-}" || failed=1
    set_secret "GCP_SERVICE_ACCOUNT" "${GCP_SERVICE_ACCOUNT:-}" || failed=1

    # Staging Secrets
    echo -e "\n${BLUE}=== Staging Deployment Secrets ===${NC}"
    set_secret "GCP_STAGING_WIF_PROVIDER" "${GCP_STAGING_WIF_PROVIDER:-}" || failed=1
    set_secret "GCP_STAGING_WIF_SA_EMAIL" "${GCP_STAGING_WIF_SA_EMAIL:-}" || failed=1
    set_secret "GCP_STAGING_PROJECT_ID" "${GCP_STAGING_PROJECT_ID:-}" || failed=1

    # Production Secrets
    echo -e "\n${BLUE}=== Production Deployment Secrets ===${NC}"
    set_secret "GCP_PROD_WIF_PROVIDER" "${GCP_PROD_WIF_PROVIDER:-}" || failed=1
    set_secret "GCP_PROD_WIF_SA_EMAIL" "${GCP_PROD_WIF_SA_EMAIL:-}" || failed=1
    set_secret "GCP_PROJECT_ID" "${GCP_PROJECT_ID:-}" || failed=1

    if [ $failed -eq 0 ]; then
        echo -e "\n${GREEN}✅ All secrets set successfully!${NC}"
        return 0
    else
        echo -e "\n${RED}❌ Some secrets failed to set${NC}"
        return 1
    fi
}

# Main script
main() {
    case "$MODE" in
        --help|-h)
            print_help
            exit 0
            ;;
        --validate)
            check_gh_cli
            validate_secrets
            exit $?
            ;;
        --interactive|-i)
            check_gh_cli
            interactive_setup
            echo ""
            validate_secrets
            ;;
        --from-env|-e)
            check_gh_cli
            env_setup
            echo ""
            validate_secrets
            ;;
        *)
            echo -e "${RED}❌ Unknown option: $MODE${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
}

main "$@"
