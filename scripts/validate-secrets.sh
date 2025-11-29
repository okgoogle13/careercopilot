#!/bin/bash
set -e

# ============================================================================
# Unified Secrets Validation Script for CareerCopilot
# Validates GitHub Secrets, GCP Secret Manager, and permissions
# ============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PLATFORM="${1:-all}"
ENVIRONMENT="${2:-production}"
PROJECT_ID="careercopilot-468811"
REPO="okgoogle13/careercopilot"
VALIDATION_ERRORS=0
VALIDATION_WARNINGS=0

# Logging functions
log() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"; }
warning() { echo -e "${YELLOW}⚠️  WARNING:${NC} $1"; ((VALIDATION_WARNINGS++)); }
error() { echo -e "${RED}❌ ERROR:${NC} $1"; ((VALIDATION_ERRORS++)); }
success() { echo -e "${GREEN}✅ SUCCESS:${NC} $1"; }
info() { echo -e "${BLUE}ℹ️  INFO:${NC} $1"; }
header() { echo -e "${PURPLE}$1${NC}"; }

# Banner
banner() {
    clear
    header "
╔══════════════════════════════════════════════════════════════════════════════╗
║                🔍 CAREERCOPILOT SECRETS VALIDATION                           ║
║              Comprehensive Secrets Health Check                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
"
    echo "Platform: $PLATFORM | Environment: $ENVIRONMENT"
    echo ""
}

# Help message
show_help() {
    cat << EOF
${CYAN}Secrets Validation Script${NC}

Usage: $0 [PLATFORM] [ENVIRONMENT]

Platforms:
  github      - GitHub repository secrets validation
  gcp         - Google Cloud Secret Manager validation
  all         - All platforms (default)

Environments:
  development - Development environment
  staging     - Staging environment
  production  - Production environment (default)

Examples:
  $0                          # All platforms, production
  $0 github staging            # GitHub secrets, staging
  $0 gcp production           # GCP secrets, production

EOF
}

# Check prerequisites
check_prerequisites() {
    local missing_tools=()
    
    case $PLATFORM in
        github|all)
            if ! command -v gh &> /dev/null; then
                missing_tools+=("GitHub CLI (gh)")
            elif ! gh auth status &> /dev/null; then
                error "GitHub CLI not authenticated. Run: gh auth login"
                exit 1
            fi
            ;;
        gcp|all)
            if ! command -v gcloud &> /dev/null; then
                missing_tools+=("Google Cloud SDK (gcloud)")
            fi
            ;;
    esac
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        error "Missing required tools:"
        for tool in "${missing_tools[@]}"; do
            echo "  - $tool"
        done
        exit 1
    fi
}

# Validate GitHub secrets
validate_github_secrets() {
    header "════════════════════════════════════════════════════════════════════════════════"
    header "                      GITHUB SECRETS VALIDATION"
    header "════════════════════════════════════════════════════════════════════════════════"
    
    log "Validating GitHub repository secrets..."
    
    # Define required secrets based on environment
    local required_secrets=()
    local optional_secrets=()
    
    # Base secrets for all environments
    required_secrets+=("GCP_PROJECT_ID")
    
    if [ "$ENVIRONMENT" = "staging" ] || [ "$ENVIRONMENT" = "all" ]; then
        required_secrets+=("GCP_STAGING_PROJECT_ID")
        required_secrets+=("GCP_STAGING_SA_KEY")
        required_secrets+=("FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT_STAGING")
        optional_secrets+=("GOOGLE_OAUTH_CLIENT_ID_STAGING" "GOOGLE_OAUTH_CLIENT_SECRET_STAGING")
    fi
    
    if [ "$ENVIRONMENT" = "production" ] || [ "$ENVIRONMENT" = "all" ]; then
        required_secrets+=("GCP_SA_KEY")
        required_secrets+=("FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT")
        optional_secrets+=("GOOGLE_OAUTH_CLIENT_ID_PROD" "GOOGLE_OAUTH_CLIENT_SECRET_PROD")
    fi
    
    # AI service secrets
    required_secrets+=("GEMINI_API_KEY" "OPENAI_API_KEY" "ANTHROPIC_API_KEY")
    optional_secrets+=("PERPLEXITY_API_KEY" "CODECOV_TOKEN" "TC_CLOUD_TOKEN")
    
    # AWS SES secrets
    optional_secrets+=("AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY" "SES_SENDER_EMAIL" "AWS_REGION")
    
    # Get all secrets from repository
    local existing_secrets
    existing_secrets=$(gh secret list --repo $REPO 2>/dev/null || echo "")
    
    echo -e "${CYAN}Required Secrets:${NC}"
    for secret in "${required_secrets[@]}"; do
        if echo "$existing_secrets" | grep -q "^$secret$"; then
            echo "  ✅ $secret"
        else
            echo "  ❌ $secret (missing)"
        fi
    done
    
    echo -e "${CYAN}Optional Secrets:${NC}"
    for secret in "${optional_secrets[@]}"; do
        if echo "$existing_secrets" | grep -q "^$secret$"; then
            echo "  ✅ $secret"
        else
            echo "  ⚠️  $secret (missing - optional)"
        fi
    done
    
    # Validate secret formats
    echo -e "${CYAN}Secret Format Validation:${NC}"
    
    # Check GCP project ID format
    if echo "$existing_secrets" | grep -q "^GCP_PROJECT_ID$"; then
        local gcp_project_id
        gcp_project_id=$(gh secret view GCP_PROJECT_ID --repo $REPO 2>/dev/null || echo "")
        if [[ "$gcp_project_id" =~ ^[a-z0-9\-]+$ ]]; then
            echo "  ✅ GCP_PROJECT_ID format valid"
        else
            echo "  ❌ GCP_PROJECT_ID format invalid"
        fi
    fi
    
    # Check API key formats
    for api_key in "GEMINI_API_KEY" "OPENAI_API_KEY" "ANTHROPIC_API_KEY"; do
        if echo "$existing_secrets" | grep -q "^$api_key$"; then
            local key_value
            key_value=$(gh secret view "$api_key" --repo $REPO 2>/dev/null || echo "")
            case $api_key in
                GEMINI_API_KEY)
                    if [[ "$key_value" =~ ^AIzaSy ]]; then
                        echo "  ✅ $api_key format valid"
                    else
                        echo "  ❌ $api_key format invalid"
                    fi
                    ;;
                OPENAI_API_KEY)
                    if [[ "$key_value" =~ ^sk- ]]; then
                        echo "  ✅ $api_key format valid"
                    else
                        echo "  ❌ $api_key format invalid"
                    fi
                    ;;
                ANTHROPIC_API_KEY)
                    if [[ "$key_value" =~ ^sk-ant- ]]; then
                        echo "  ✅ $api_key format valid"
                    else
                        echo "  ❌ $api_key format invalid"
                    fi
                    ;;
            esac
        fi
    done
}

# Validate GCP Secret Manager
validate_gcp_secrets() {
    header "════════════════════════════════════════════════════════════════════════════════"
    header "                    GCP SECRET MANAGER VALIDATION"
    header "════════════════════════════════════════════════════════════════════════════════"
    
    log "Validating Google Cloud Secret Manager..."
    gcloud config set project $PROJECT_ID
    
    # Define required secrets
    local required_secrets=("gemini-api-key" "jwt-secret-key")
    local optional_secrets=("openai-api-key" "anthropic-api-key" "database-url" "aws-access-key-id" "aws-secret-access-key" "ses-sender-email")
    
    echo -e "${CYAN}Required Secrets:${NC}"
    for secret_id in "${required_secrets[@]}"; do
        if gcloud secrets describe "$secret_id" --project=$PROJECT_ID &>/dev/null; then
            echo "  ✅ $secret_id"
            
            # Check if secret has versions
            local versions
            versions=$(gcloud secrets versions list "$secret_id" --project=$PROJECT_ID --limit=1 2>/dev/null | grep -v "NAME" | wc -l)
            if [ "$versions" -gt 0 ]; then
                echo "    └─ ✅ Has $versions version(s)"
            else
                echo "    └─ ❌ No versions found"
            fi
        else
            echo "  ❌ $secret_id (missing)"
        fi
    done
    
    echo -e "${CYAN}Optional Secrets:${NC}"
    for secret_id in "${optional_secrets[@]}"; do
        if gcloud secrets describe "$secret_id" --project=$PROJECT_ID &>/dev/null; then
            echo "  ✅ $secret_id"
        else
            echo "  ⚠️  $secret_id (missing - optional)"
        fi
    done
    
    # Validate service account permissions
    echo -e "${CYAN}Service Account Permissions:${NC}"
    
    local service_account
    service_account="$(gcloud run services describe backend --region=us-central1 --format='value(spec.template.spec.serviceAccountName)' 2>/dev/null || echo "careercopilot-backend@$PROJECT_ID.iam.gserviceaccount.com")"
    
    echo "  Service Account: $service_account"
    
    # Check if service account exists
    if gcloud iam service-accounts describe "$service_account" &>/dev/null; then
        echo "  ✅ Service account exists"
    else
        echo "  ❌ Service account not found"
    fi
    
    # Check permissions on a sample secret
    for secret_id in "${required_secrets[@]}"; do
        if gcloud secrets describe "$secret_id" --project=$PROJECT_ID &>/dev/null; then
            local policy
            policy=$(gcloud secrets get-iam-policy "$secret_id" --project=$PROJECT_ID --format=json 2>/dev/null || echo "")
            if echo "$policy" | grep -q "$service_account"; then
                echo "  ✅ Service account has access to secrets"
                break
            fi
        fi
    done
    
    # Test secret access
    echo -e "${CYAN}Secret Access Test:${NC}"
    for secret_id in "${required_secrets[@]}"; do
        if gcloud secrets describe "$secret_id" --project=$PROJECT_ID &>/dev/null; then
            if gcloud secrets versions access latest --secret="$secret_id" --project=$PROJECT_ID &>/dev/null; then
                echo "  ✅ Can access $secret_id"
                break
            else
                echo "  ❌ Cannot access $secret_id"
            fi
        fi
    done
}

# Validate AWS SES configuration
validate_aws_ses() {
    header "════════════════════════════════════════════════════════════════════════════════"
    header "                       AWS SES VALIDATION"
    header "════════════════════════════════════════════════════════════════════════════════"
    
    log "Validating AWS SES configuration..."
    
    # Check AWS SES secrets in GitHub
    local aws_secrets=("AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY" "SES_SENDER_EMAIL" "AWS_REGION")
    local github_secrets
    github_secrets=$(gh secret list --repo $REPO 2>/dev/null || echo "")
    
    echo -e "${CYAN}GitHub AWS SES Secrets:${NC}"
    for secret in "${aws_secrets[@]}"; do
        if echo "$github_secrets" | grep -q "^$secret$"; then
            echo "  ✅ $secret"
        else
            echo "  ❌ $secret (missing)"
        fi
    done
    
    # Check AWS SES secrets in GCP
    local aws_gcp_secrets=("aws-access-key-id" "aws-secret-access-key" "ses-sender-email")
    
    echo -e "${CYAN}GCP AWS SES Secrets:${NC}"
    for secret_id in "${aws_gcp_secrets[@]}"; do
        if gcloud secrets describe "$secret_id" --project=$PROJECT_ID &>/dev/null; then
            echo "  ✅ $secret_id"
        else
            echo "  ❌ $secret_id (missing)"
        fi
    done
    
    # Validate AWS credentials format
    if echo "$github_secrets" | grep -q "^AWS_ACCESS_KEY_ID$"; then
        local access_key
        access_key=$(gh secret view AWS_ACCESS_KEY_ID --repo $REPO 2>/dev/null || echo "")
        if [ ${#access_key} -eq 20 ]; then
            echo "  ✅ AWS_ACCESS_KEY_ID format valid (20 chars)"
        else
            echo "  ❌ AWS_ACCESS_KEY_ID format invalid (${#access_key} chars, expected 20)"
        fi
    fi
    
    if echo "$github_secrets" | grep -q "^AWS_SECRET_ACCESS_KEY$"; then
        local secret_key
        secret_key=$(gh secret view AWS_SECRET_ACCESS_KEY --repo $REPO 2>/dev/null || echo "")
        if [ ${#secret_key} -eq 40 ]; then
            echo "  ✅ AWS_SECRET_ACCESS_KEY format valid (40 chars)"
        else
            echo "  ❌ AWS_SECRET_ACCESS_KEY format invalid (${#secret_key} chars, expected 40)"
        fi
    fi
    
    if echo "$github_secrets" | grep -q "^SES_SENDER_EMAIL$"; then
        local sender_email
        sender_email=$(gh secret view SES_SENDER_EMAIL --repo $REPO 2>/dev/null || echo "")
        if [[ "$sender_email" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]; then
            echo "  ✅ SES_SENDER_EMAIL format valid"
        else
            echo "  ❌ SES_SENDER_EMAIL format invalid"
        fi
    fi
}

# Generate validation report
generate_report() {
    header "════════════════════════════════════════════════════════════════════════════════"
    header "                        VALIDATION REPORT"
    header "════════════════════════════════════════════════════════════════════════════════"
    
    echo "Platform: $PLATFORM"
    echo "Environment: $ENVIRONMENT"
    echo "Timestamp: $(date)"
    echo ""
    
    if [ $VALIDATION_ERRORS -eq 0 ]; then
        success "✅ All critical validations passed"
    else
        error "❌ $VALIDATION_ERRORS validation error(s) found"
    fi
    
    if [ $VALIDATION_WARNINGS -gt 0 ]; then
        warning "⚠️  $VALIDATION_WARNINGS warning(s) found"
    fi
    
    echo ""
    
    # Overall status
    if [ $VALIDATION_ERRORS -eq 0 ]; then
        if [ $VALIDATION_WARNINGS -eq 0 ]; then
            success "🎉 Secrets configuration is HEALTHY"
            echo "Ready for deployment!"
        else
            warning "⚠️  Secrets configuration is mostly healthy with warnings"
            echo "Review warnings before deployment."
        fi
    else
        error "❌ Secrets configuration has CRITICAL issues"
        echo "Fix errors before deployment."
    fi
    
    echo ""
    info "Recommendations:"
    if [ $VALIDATION_ERRORS -gt 0 ]; then
        echo "  1. Fix missing required secrets"
        echo "  2. Run: ./scripts/setup-secrets.sh $PLATFORM $ENVIRONMENT"
    fi
    if [ $VALIDATION_WARNINGS -gt 0 ]; then
        echo "  3. Review optional secrets for completeness"
    fi
    echo "  4. Test deployment after fixing issues"
}

# Main execution
main() {
    # Handle help
    if [ "$1" = "help" ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
        show_help
        exit 0
    fi
    
    banner
    check_prerequisites
    
    case $PLATFORM in
        github)
            validate_github_secrets
            ;;
        gcp)
            validate_gcp_secrets
            ;;
        all)
            validate_github_secrets
            echo
            validate_gcp_secrets
            echo
            validate_aws_ses
            ;;
        *)
            error "Unknown platform: $PLATFORM"
            echo "Valid platforms: github, gcp, all"
            exit 1
            ;;
    esac
    
    echo
    generate_report
    
    # Exit with error code if validation failed
    if [ $VALIDATION_ERRORS -gt 0 ]; then
        exit 1
    fi
}

# Run main function with all arguments
main "$@"
