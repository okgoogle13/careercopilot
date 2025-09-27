#!/bin/bash
set -e

# ============================================================================
# GitHub Secrets Setup Script
# Automates the process of adding required secrets to GitHub repository
# ============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Repository configuration
REPO="okgoogle13/careercopilot"

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠️  WARNING:${NC} $1"
}

error() {
    echo -e "${RED}❌ ERROR:${NC} $1"
}

success() {
    echo -e "${GREEN}✅ SUCCESS:${NC} $1"
}

info() {
    echo -e "${BLUE}ℹ️  INFO:${NC} $1"
}

banner() {
    echo -e "${PURPLE}$1${NC}"
}

# Banner
clear
banner "
╔══════════════════════════════════════════════════════════════════════════════╗
║                    🚀 CAREERCOPILOT SECRETS SETUP                          ║
║                   Configure GitHub Repository Secrets                       ║
╚══════════════════════════════════════════════════════════════════════════════╝
"

# Check prerequisites
log "Checking prerequisites..."

if ! command -v gh &> /dev/null; then
    error "GitHub CLI (gh) is not installed. Please install it first:"
    echo "  macOS: brew install gh"
    echo "  Linux: See https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
    exit 1
fi

if ! gh auth status &> /dev/null; then
    error "GitHub CLI is not authenticated. Please run: gh auth login"
    exit 1
fi

success "Prerequisites check passed"

# Function to safely add secret
add_secret() {
    local secret_name="$1"
    local secret_value="$2"
    local description="$3"

    if [ -z "$secret_value" ] || [ "$secret_value" = "YOUR_KEY_HERE" ] || [ "$secret_value" = "" ]; then
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

# Function to add secret from file
add_secret_from_file() {
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

# Function to prompt for secret
prompt_for_secret() {
    local secret_name="$1"
    local description="$2"
    local example="$3"

    echo
    info "$description"
    if [ -n "$example" ]; then
        echo "Example format: $example"
    fi
    echo -n "Enter $secret_name (or press Enter to skip): "
    read -r secret_value

    if [ -n "$secret_value" ]; then
        add_secret "$secret_name" "$secret_value" "$description"
    else
        warning "Skipped $secret_name"
    fi
}

echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                            FIREBASE CONFIGURATION"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Setting up Firebase service account keys..."

add_secret_from_file "FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT_STAGING" \
    "./firebase-staging-key.json" \
    "Firebase service account for staging"

add_secret_from_file "FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT" \
    "./firebase-prod-key.json" \
    "Firebase service account for production"

echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                          GOOGLE CLOUD CONFIGURATION"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Setting up Google Cloud Platform secrets..."

# Project IDs
add_secret "GCP_STAGING_PROJECT_ID" "careercopilot-staging" "GCP staging project ID"
add_secret "GCP_PROJECT_ID" "careercopilot-prod" "GCP production project ID"

# Service account keys
add_secret_from_file "GCP_STAGING_SA_KEY" \
    "./gcp-staging-key.json" \
    "GCP staging service account key"

add_secret_from_file "GCP_SA_KEY" \
    "./gcp-prod-key.json" \
    "GCP production service account key"

echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                              AI SERVICE KEYS"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Setting up AI service API keys..."

prompt_for_secret "GEMINI_API_KEY" \
    "Google Gemini API key from https://makersuite.google.com/app/apikey" \
    "AIzaSy..."

prompt_for_secret "OPENAI_API_KEY" \
    "OpenAI API key from https://platform.openai.com/api-keys" \
    "sk-..."

prompt_for_secret "ANTHROPIC_API_KEY" \
    "Anthropic Claude API key from https://console.anthropic.com/" \
    "sk-ant-..."

prompt_for_secret "PERPLEXITY_API_KEY" \
    "Perplexity API key from https://docs.perplexity.ai/" \
    "pplx-..."

echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                          DATABASE & SERVICES"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Setting up database and service configurations..."

# PINECONE CONFIGURATION REMOVED - No longer using Pinecone vector database
# Pinecone has been replaced with local FAISS and Vertex AI Vector Search

prompt_for_secret "SENDGRID_API_KEY" \
    "SendGrid email service API key from https://app.sendgrid.com/settings/api_keys" \
    "SG...."

echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                            OAUTH CONFIGURATION"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Setting up OAuth client credentials..."

prompt_for_secret "GOOGLE_OAUTH_CLIENT_ID_STAGING" \
    "Google OAuth client ID for staging environment" \
    "xxxxx.apps.googleusercontent.com"

prompt_for_secret "GOOGLE_OAUTH_CLIENT_SECRET_STAGING" \
    "Google OAuth client secret for staging environment" \
    "GOCSPX-..."

prompt_for_secret "GOOGLE_OAUTH_CLIENT_ID_PROD" \
    "Google OAuth client ID for production environment" \
    "xxxxx.apps.googleusercontent.com"

prompt_for_secret "GOOGLE_OAUTH_CLIENT_SECRET_PROD" \
    "Google OAuth client secret for production environment" \
    "GOCSPX-..."

echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                              SETUP COMPLETE"
banner "════════════════════════════════════════════════════════════════════════════════"

success "GitHub secrets setup completed!"

echo
log "Next steps:"
echo "  1. Verify all secrets are set: gh secret list --repo $REPO"
echo "  2. Create Firebase projects if not done already"
echo "  3. Test deployment pipeline: git push origin develop"
echo "  4. Run security audit: ./scripts/security-audit.sh"

echo
info "Setup guide: https://github.com/$REPO/blob/develop/SETUP_GUIDE.md"
warning "Remember to keep your API keys secure and rotate them regularly!"

echo
banner "🎉 Ready to deploy CareerCopilot! 🚀"
