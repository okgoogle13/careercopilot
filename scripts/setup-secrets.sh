#!/bin/bash
set -e

# ============================================================================
# Unified Secrets Management Script for CareerCopilot
# Handles GitHub Secrets, GCP Secret Manager, and AWS SES setup
# ============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default configuration
PLATFORM="${1:-all}"
ENVIRONMENT="${2:-production}"
MODE="${3:-interactive}"
PROJECT_ID="careercopilot-468811"
REPO="okgoogle13/careercopilot"

# Logging functions
log() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"; }
warning() { echo -e "${YELLOW}⚠️  WARNING:${NC} $1"; }
error() { echo -e "${RED}❌ ERROR:${NC} $1"; }
success() { echo -e "${GREEN}✅ SUCCESS:${NC} $1"; }
info() { echo -e "${BLUE}ℹ️  INFO:${NC} $1"; }
header() { echo -e "${PURPLE}$1${NC}"; }

# Banner
banner() {
    clear
    header "
╔══════════════════════════════════════════════════════════════════════════════╗
║                🚀 CAREERCOPILOT UNIFIED SECRETS SETUP                        ║
║              Single Script for All Secrets Management                        ║
╚══════════════════════════════════════════════════════════════════════════════╝
"
    echo "Platform: $PLATFORM | Environment: $ENVIRONMENT | Mode: $MODE"
    echo ""
}

# Help message
show_help() {
    cat << EOF
${CYAN}Unified Secrets Management Script${NC}

Usage: $0 [PLATFORM] [ENVIRONMENT] [MODE]

Platforms:
  github      - GitHub repository secrets (CI/CD)
  gcp         - Google Cloud Secret Manager (production)
  aws-ses     - AWS SES credentials (email service)
  all         - All platforms (default)

Environments:
  development - Local development setup
  staging     - Staging environment
  production  - Production environment (default)

Modes:
  interactive - Interactive prompts (default)
  from-env    - Read from environment variables
  validate    - Validate existing secrets only
  help        - Show this help message

Examples:
  $0                          # All platforms, production, interactive
  $0 github production        # GitHub secrets only, production, interactive
  $0 gcp staging from-env     # GCP secrets, staging, from environment
  $0 aws-ses all interactive  # AWS SES secrets, all environments

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
    
    success "Prerequisites check passed"
}

# GitHub secrets setup
setup_github_secrets() {
    header "════════════════════════════════════════════════════════════════════════════════"
    header "                        GITHUB SECRETS SETUP"
    header "════════════════════════════════════════════════════════════════════════════════"
    
    log "Setting up GitHub repository secrets..."
    
    # Function to add secret safely
    add_github_secret() {
        local secret_name="$1"
        local secret_value="$2"
        local description="$3"
        
        if [ -z "$secret_value" ] || [ "$secret_value" = "YOUR_KEY_HERE" ]; then
            warning "Skipping $secret_name - no value provided"
            return
        fi
        
        echo -n "Adding $secret_name... "
        if gh secret set "$secret_name" --body "$secret_value" --repo "$REPO" &> /dev/null; then
            echo -e "${GREEN}✅${NC}"
        else
            echo -e "${RED}❌${NC}"
            error "Failed to add $secret_name"
        fi
    }
    
    # Function to prompt for secret
    prompt_github_secret() {
        local secret_name="$1"
        local description="$2"
        local example="$3"
        
        if [ "$MODE" = "from-env" ]; then
            local env_value="${!secret_name}"
            if [ -n "$env_value" ]; then
                add_github_secret "$secret_name" "$env_value" "$description"
                return
            fi
        fi
        
        if [ "$MODE" = "interactive" ]; then
            echo
            info "$description"
            [ -n "$example" ] && echo "Example format: $example"
            echo -n "Enter $secret_name (or press Enter to skip): "
            read -r secret_value
            [ -n "$secret_value" ] && add_github_secret "$secret_name" "$secret_value" "$description"
        fi
    }
    
    # Function to add secret from file
    add_github_secret_from_file() {
        local secret_name="$1"
        local file_path="$2"
        local description="$3"
        
        if [ ! -f "$file_path" ]; then
            warning "Skipping $secret_name - file not found: $file_path"
            return
        fi
        
        echo -n "Adding $secret_name from file... "
        if gh secret set "$secret_name" --body "$(cat "$file_path")" --repo "$REPO" &> /dev/null; then
            echo -e "${GREEN}✅${NC}"
        else
            echo -e "${RED}❌${NC}"
            error "Failed to add $secret_name from file"
        fi
    }
    
    # Firebase Service Accounts
    case $ENVIRONMENT in
        staging|production|all)
            add_github_secret_from_file "FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT_STAGING" \
                "./firebase-staging-key.json" "Firebase service account for staging"
            add_github_secret_from_file "FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT" \
                "./firebase-prod-key.json" "Firebase service account for production"
            ;;
    esac
    
    # GCP Configuration
    if [ "$ENVIRONMENT" = "staging" ] || [ "$ENVIRONMENT" = "all" ]; then
        add_github_secret "GCP_STAGING_PROJECT_ID" "careercopilot-staging" "GCP staging project ID"
        add_github_secret_from_file "GCP_STAGING_SA_KEY" \
            "./gcp-staging-key.json" "GCP staging service account key"
    fi
    
    if [ "$ENVIRONMENT" = "production" ] || [ "$ENVIRONMENT" = "all" ]; then
        add_github_secret "GCP_PROJECT_ID" "careercopilot-468811" "GCP production project ID"
        add_github_secret_from_file "GCP_SA_KEY" \
            "./gcp-prod-key.json" "GCP production service account key"
    fi
    
    # AI Service Keys
    prompt_github_secret "GEMINI_API_KEY" \
        "Google Gemini API key from https://makersuite.google.com/app/apikey" \
        "AIzaSy..."
    
    prompt_github_secret "OPENAI_API_KEY" \
        "OpenAI API key from https://platform.openai.com/api-keys" \
        "sk-..."
    
    prompt_github_secret "ANTHROPIC_API_KEY" \
        "Anthropic Claude API key from https://console.anthropic.com/" \
        "sk-ant-..."
    
    prompt_github_secret "PERPLEXITY_API_KEY" \
        "Perplexity API key from https://docs.perplexity.ai/" \
        "pplx-..."
    
    # Testcontainers
    prompt_github_secret "TC_CLOUD_TOKEN" \
        "Testcontainers Cloud token from https://testcontainers.cloud" \
        "tcc-..."
    
    # Code Coverage (optional)
    prompt_github_secret "CODECOV_TOKEN" \
        "Codecov token from https://codecov.io (optional)" \
        "uuid-..."
    
    # OAuth Configuration
    if [ "$ENVIRONMENT" = "staging" ] || [ "$ENVIRONMENT" = "all" ]; then
        prompt_github_secret "GOOGLE_OAUTH_CLIENT_ID_STAGING" \
            "Google OAuth client ID for staging" \
            "xxxxx.apps.googleusercontent.com"
        
        prompt_github_secret "GOOGLE_OAUTH_CLIENT_SECRET_STAGING" \
            "Google OAuth client secret for staging" \
            "GOCSPX-..."
    fi
    
    if [ "$ENVIRONMENT" = "production" ] || [ "$ENVIRONMENT" = "all" ]; then
        prompt_github_secret "GOOGLE_OAUTH_CLIENT_ID_PROD" \
            "Google OAuth client ID for production" \
            "xxxxx.apps.googleusercontent.com"
        
        prompt_github_secret "GOOGLE_OAUTH_CLIENT_SECRET_PROD" \
            "Google OAuth client secret for production" \
            "GOCSPX-..."
    fi
}

# GCP Secret Manager setup
setup_gcp_secrets() {
    header "════════════════════════════════════════════════════════════════════════════════"
    header "                    GCP SECRET MANAGER SETUP"
    header "════════════════════════════════════════════════════════════════════════════════"
    
    log "Setting up Google Cloud Secret Manager secrets..."
    gcloud config set project $PROJECT_ID
    
    # Function to create/update secret
    set_gcp_secret() {
        local secret_id="$1"
        local secret_value="$2"
        local description="$3"
        
        if [ -z "$secret_value" ] || [ "$secret_value" = "YOUR_KEY_HERE" ]; then
            warning "Skipping $secret_id - no value provided"
            return
        fi
        
        if gcloud secrets describe "$secret_id" --project=$PROJECT_ID &>/dev/null; then
            echo "Updating existing secret: $secret_id"
            echo -n "$secret_value" | gcloud secrets versions add "$secret_id" --data-file=- --project=$PROJECT_ID
        else
            echo "Creating new secret: $secret_id"
            echo -n "$secret_value" | gcloud secrets create "$secret_id" --data-file=- --project=$PROJECT_ID --replication-policy=automatic
        fi
        
        # Grant access to Cloud Run service account
        local service_account="$(gcloud run services describe backend --region=us-central1 --format='value(spec.template.spec.serviceAccountName)' 2>/dev/null || echo "careercopilot-backend@$PROJECT_ID.iam.gserviceaccount.com")"
        
        gcloud secrets add-iam-policy-binding "$secret_id" \
            --member="serviceAccount:$service_account" \
            --role="roles/secretmanager.secretAccessor" \
            --project=$PROJECT_ID &>/dev/null
    }
    
    # Function to prompt for GCP secret
    prompt_gcp_secret() {
        local secret_id="$1"
        local description="$2"
        local example="$3"
        
        if [ "$MODE" = "from-env" ]; then
            local env_var="${secret_id^^}" # Convert to uppercase and replace - with _
            env_var="${env_var//-/_}"
            local env_value="${!env_var}"
            if [ -n "$env_value" ]; then
                set_gcp_secret "$secret_id" "$env_value" "$description"
                return
            fi
        fi
        
        if [ "$MODE" = "interactive" ]; then
            echo
            info "$description"
            [ -n "$example" ] && echo "Example format: $example"
            echo -n "Enter $secret_id (or press Enter to skip): "
            read -s secret_value
            echo
            [ -n "$secret_value" ] && set_gcp_secret "$secret_id" "$secret_value" "$description"
        fi
    }
    
    # Core application secrets
    prompt_gcp_secret "gemini-api-key" \
        "Google Gemini API key for production" \
        "AIzaSy..."
    
    prompt_gcp_secret "openai-api-key" \
        "OpenAI API key for production" \
        "sk-proj-..."
    
    prompt_gcp_secret "anthropic-api-key" \
        "Anthropic Claude API key for production" \
        "sk-ant-api03-..."
    
    prompt_gcp_secret "jwt-secret-key" \
        "JWT secret key (minimum 32 characters)" \
        "your-super-secure-jwt-key-256-bits"
    
    prompt_gcp_secret "database-url" \
        "Database connection URL" \
        "postgresql://user:pass@host:5432/db"
    
    # AWS SES secrets
    prompt_gcp_secret "aws-access-key-id" \
        "AWS Access Key ID for SES" \
        "AKIAIOSFODNN7EXAMPLE"
    
    prompt_gcp_secret "aws-secret-access-key" \
        "AWS Secret Access Key for SES" \
        "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
    
    prompt_gcp_secret "ses-sender-email" \
        "SES verified sender email (your Gmail)" \
        "your-email@gmail.com"
    
    # Optional secrets
    prompt_gcp_secret "perplexity-api-key" \
        "Perplexity API key (optional)" \
        "pplx-..."
    
    prompt_gcp_secret "redis-password" \
        "Redis password (optional)" \
        "your-secure-redis-password"
}

# AWS SES setup (integrates both GitHub and GCP)
setup_aws_ses_secrets() {
    header "════════════════════════════════════════════════════════════════════════════════"
    header "                        AWS SES SECRETS SETUP"
    header "════════════════════════════════════════════════════════════════════════════════"
    
    log "Setting up AWS SES credentials for both GitHub and GCP..."
    
    # Get AWS credentials
    local aws_access_key_id aws_secret_access_key ses_sender_email
    
    if [ "$MODE" = "from-env" ]; then
        aws_access_key_id="$AWS_ACCESS_KEY_ID"
        aws_secret_access_key="$AWS_SECRET_ACCESS_KEY"
        ses_sender_email="$SES_SENDER_EMAIL"
    else
        echo
        info "AWS SES Credentials Required"
        echo "1. AWS Access Key ID (20 characters)"
        echo "2. AWS Secret Access Key (40 characters)"  
        echo "3. SES Sender Email (your verified Gmail)"
        echo
        
        read -p "Enter AWS Access Key ID: " aws_access_key_id
        read -sp "Enter AWS Secret Access Key: " aws_secret_access_key
        echo
        read -p "Enter SES Sender Email: " ses_sender_email
    fi
    
    # Validate inputs
    if [ -z "$aws_access_key_id" ] || [ -z "$aws_secret_access_key" ] || [ -z "$ses_sender_email" ]; then
        error "All AWS SES credentials are required"
        return 1
    fi
    
    # Add to GitHub Secrets
    if [ "$PLATFORM" = "all" ] || [ "$PLATFORM" = "github" ]; then
        echo "Adding AWS SES secrets to GitHub..."
        echo -n "Adding AWS_ACCESS_KEY_ID... "
        if gh secret set AWS_ACCESS_KEY_ID --body "$aws_access_key_id" --repo "$REPO" &> /dev/null; then
            echo -e "${GREEN}✅${NC}"
        else
            echo -e "${RED}❌${NC}"
        fi
        
        echo -n "Adding AWS_SECRET_ACCESS_KEY... "
        if gh secret set AWS_SECRET_ACCESS_KEY --body "$aws_secret_access_key" --repo "$REPO" &> /dev/null; then
            echo -e "${GREEN}✅${NC}"
        else
            echo -e "${RED}❌${NC}"
        fi
        
        echo -n "Adding SES_SENDER_EMAIL... "
        if gh secret set SES_SENDER_EMAIL --body "$ses_sender_email" --repo "$REPO" &> /dev/null; then
            echo -e "${GREEN}✅${NC}"
        else
            echo -e "${RED}❌${NC}"
        fi
        
        echo -n "Adding AWS_REGION... "
        if gh secret set AWS_REGION --body "us-east-1" --repo "$REPO" &> /dev/null; then
            echo -e "${GREEN}✅${NC}"
        else
            echo -e "${RED}❌${NC}"
        fi
    fi
    
    # Add to GCP Secret Manager
    if [ "$PLATFORM" = "all" ] || [ "$PLATFORM" = "gcp" ]; then
        echo "Adding AWS SES secrets to GCP Secret Manager..."
        gcloud config set project $PROJECT_ID
        
        # Create/update secrets
        for secret_id in aws-access-key-id aws-secret-access-key ses-sender-email; do
            local secret_value
            case $secret_id in
                aws-access-key-id) secret_value="$aws_access_key_id" ;;
                aws-secret-access-key) secret_value="$aws_secret_access_key" ;;
                ses-sender-email) secret_value="$ses_sender_email" ;;
            esac
            
            if gcloud secrets describe "$secret_id" --project=$PROJECT_ID &>/dev/null; then
                echo "Updating existing secret: $secret_id"
                echo -n "$secret_value" | gcloud secrets versions add "$secret_id" --data-file=- --project=$PROJECT_ID
            else
                echo "Creating new secret: $secret_id"
                echo -n "$secret_value" | gcloud secrets create "$secret_id" --data-file=- --project=$PROJECT_ID --replication-policy=automatic
            fi
            
            # Grant access to Cloud Run service account
            local service_account="$(gcloud run services describe backend --region=us-central1 --format='value(spec.template.spec.serviceAccountName)' 2>/dev/null || echo "careercopilot-backend@$PROJECT_ID.iam.gserviceaccount.com")"
            
            gcloud secrets add-iam-policy-binding "$secret_id" \
                --member="serviceAccount:$service_account" \
                --role="roles/secretmanager.secretAccessor" \
                --project=$PROJECT_ID &>/dev/null
        done
    fi
    
    success "AWS SES secrets setup completed"
}

# Validate existing secrets
validate_secrets() {
    header "════════════════════════════════════════════════════════════════════════════════"
    header "                        SECRETS VALIDATION"
    header "════════════════════════════════════════════════════════════════════════════════"
    
    log "Validating secrets configuration..."
    
    # Validate GitHub secrets
    if [ "$PLATFORM" = "all" ] || [ "$PLATFORM" = "github" ]; then
        echo -e "${CYAN}GitHub Secrets:${NC}"
        local github_secrets=("GCP_PROJECT_ID" "GEMINI_API_KEY" "OPENAI_API_KEY" "ANTHROPIC_API_KEY")
        
        for secret in "${github_secrets[@]}"; do
            if gh secret list --repo $REPO | grep -q "^$secret$"; then
                echo "  ✅ $secret"
            else
                echo "  ❌ $secret (missing)"
            fi
        done
    fi
    
    # Validate GCP secrets
    if [ "$PLATFORM" = "all" ] || [ "$PLATFORM" = "gcp" ]; then
        echo -e "${CYAN}GCP Secret Manager:${NC}"
        local gcp_secrets=("gemini-api-key" "jwt-secret-key" "database-url")
        
        for secret_id in "${gcp_secrets[@]}"; do
            if gcloud secrets describe "$secret_id" --project=$PROJECT_ID &>/dev/null; then
                echo "  ✅ $secret_id"
            else
                echo "  ❌ $secret_id (missing)"
            fi
        done
    fi
    
    # Run production validator if available
    if [ -f "scripts/production-secrets-validator.py" ]; then
        echo
        info "Running comprehensive validation..."
        python3 scripts/production-secrets-validator.py
    fi
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
            setup_github_secrets
            ;;
        gcp)
            setup_gcp_secrets
            ;;
        aws-ses)
            setup_aws_ses_secrets
            ;;
        all)
            setup_github_secrets
            echo
            setup_gcp_secrets
            echo
            setup_aws_ses_secrets
            ;;
        *)
            error "Unknown platform: $PLATFORM"
            echo "Valid platforms: github, gcp, aws-ses, all"
            exit 1
            ;;
    esac
    
    if [ "$MODE" = "validate" ]; then
        echo
        validate_secrets
    fi
    
    echo
    header "════════════════════════════════════════════════════════════════════════════════"
    header "                          SETUP COMPLETE"
    header "════════════════════════════════════════════════════════════════════════════════"
    
    success "Unified secrets setup completed!"
    echo
    log "Next steps:"
    echo "  1. Validate secrets: ./scripts/validate-secrets.sh"
    echo "  2. Test deployment: git push origin develop"
    echo "  3. Monitor logs for any authentication issues"
    echo
    info "For help: $0 help"
}

# Run main function with all arguments
main "$@"
