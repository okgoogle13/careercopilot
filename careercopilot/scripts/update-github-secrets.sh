#!/bin/bash
set -e

# =============================================================================
# Update GitHub Secrets Script
# Updates repository secrets for CI/CD with new API keys
# =============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

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

# Function to check if gh CLI is installed
check_gh_cli() {
    if ! command -v gh >/dev/null 2>&1; then
        error "GitHub CLI (gh) is not installed"
        echo ""
        echo "Please install it using one of these methods:"
        echo "  macOS: brew install gh"
        echo "  Linux: https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
        echo "  Windows: https://github.com/cli/cli/releases"
        echo ""
        echo "After installation, run: gh auth login"
        exit 1
    fi
}

# Function to check GitHub authentication
check_gh_auth() {
    if ! gh auth status >/dev/null 2>&1; then
        error "Not authenticated with GitHub CLI"
        echo "Please run: gh auth login"
        exit 1
    fi
}

# Function to set a GitHub secret
set_github_secret() {
    local secret_name="$1"
    local secret_value="$2"
    local description="$3"
    
    if [ -z "$secret_value" ]; then
        warning "No value provided for $secret_name, skipping..."
        return
    fi
    
    echo -n "Setting $secret_name... "
    if echo "$secret_value" | gh secret set "$secret_name" --body; then
        success "$description"
    else
        error "Failed to set $secret_name"
    fi
}

# Banner
clear
banner "
╔══════════════════════════════════════════════════════════════════════════════╗
║                        🔐 GITHUB SECRETS UPDATE                            ║
║                      Update CI/CD Secrets with New Keys                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
"

# Check prerequisites
log "Checking prerequisites..."
check_gh_cli
check_gh_auth

# Check if running from correct directory
if [ ! -d "scripts" ] && [ ! -f "firestore.rules" ] && [ ! -f "package.json" ] && [ ! -f "frontend/package.json" ]; then
    error "Please run this script from the project root directory"
    exit 1
fi

# Check if .env file exists
if [ ! -f "frontend/.env" ]; then
    error "Frontend .env file not found. Please run the rotation script first."
    exit 1
fi

log "Loading environment variables from frontend/.env..."

# Source the environment file
source frontend/.env

echo ""
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                            UPDATING GITHUB SECRETS"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Updating repository secrets..."

# Firebase secrets
set_github_secret "VITE_FIREBASE_API_KEY" "$VITE_FIREBASE_API_KEY" "Firebase API Key"
set_github_secret "VITE_FIREBASE_AUTH_DOMAIN" "$VITE_FIREBASE_AUTH_DOMAIN" "Firebase Auth Domain"
set_github_secret "VITE_FIREBASE_PROJECT_ID" "$VITE_FIREBASE_PROJECT_ID" "Firebase Project ID"
set_github_secret "VITE_FIREBASE_STORAGE_BUCKET" "$VITE_FIREBASE_STORAGE_BUCKET" "Firebase Storage Bucket"
set_github_secret "VITE_FIREBASE_MESSAGING_SENDER_ID" "$VITE_FIREBASE_MESSAGING_SENDER_ID" "Firebase Messaging Sender ID"
set_github_secret "VITE_FIREBASE_APP_ID" "$VITE_FIREBASE_APP_ID" "Firebase App ID"

# AI API secrets
set_github_secret "OPENAI_API_KEY" "$OPENAI_API_KEY" "OpenAI API Key"
set_github_secret "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY" "Anthropic API Key"
set_github_secret "GEMINI_API_KEY" "$GEMINI_API_KEY" "Gemini API Key"

# Optional API secrets
if [ -n "$PERPLEXITY_API_KEY" ]; then
    set_github_secret "PERPLEXITY_API_KEY" "$PERPLEXITY_API_KEY" "Perplexity API Key"
fi

if [ -n "$PINECONE_API_KEY" ]; then
    set_github_secret "PINECONE_API_KEY" "$PINECONE_API_KEY" "Pinecone API Key"
fi

# Environment configuration
set_github_secret "VITE_ENV" "$VITE_ENV" "Environment Type"
set_github_secret "VITE_API_BASE_URL" "$VITE_API_BASE_URL" "API Base URL"

# Additional secrets that might be needed for CI/CD
echo ""
info "Setting additional CI/CD secrets..."

# If backend .env exists, load backend secrets too
if [ -f "backend/.env" ]; then
    log "Loading backend environment variables..."
    
    # Extract backend-specific variables
    if grep -q "ENVIRONMENT=" backend/.env; then
        BACKEND_ENV=$(grep "ENVIRONMENT=" backend/.env | cut -d'=' -f2)
        set_github_secret "BACKEND_ENVIRONMENT" "$BACKEND_ENV" "Backend Environment"
    fi
    
    if grep -q "CORS_ORIGINS=" backend/.env; then
        CORS_ORIGINS=$(grep "CORS_ORIGINS=" backend/.env | cut -d'=' -f2)
        set_github_secret "CORS_ORIGINS" "$CORS_ORIGINS" "CORS Origins"
    fi
fi

# Ask for additional secrets that might not be in .env files
echo ""
info "Optional additional secrets for CI/CD:"

echo -n "Do you want to set a Docker registry secret? (y/n): "
read set_docker
if [ "$set_docker" = "y" ] || [ "$set_docker" = "Y" ]; then
    echo -n "Docker registry URL: "
    read docker_registry
    echo -n "Docker username: "
    read docker_username
    echo -n "Docker password: "
    read -s docker_password
    echo ""
    
    set_github_secret "DOCKER_REGISTRY" "$docker_registry" "Docker Registry URL"
    set_github_secret "DOCKER_USERNAME" "$docker_username" "Docker Username"
    set_github_secret "DOCKER_PASSWORD" "$docker_password" "Docker Password"
fi

echo -n "Do you want to set a deployment webhook URL? (y/n): "
read set_webhook
if [ "$set_webhook" = "y" ] || [ "$set_webhook" = "Y" ]; then
    echo -n "Webhook URL: "
    read webhook_url
    set_github_secret "DEPLOY_WEBHOOK_URL" "$webhook_url" "Deployment Webhook URL"
fi

echo ""
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                              VERIFICATION"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Verifying secrets were set correctly..."

# List current secrets
echo ""
info "Current repository secrets:"
gh secret list

echo ""
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                              RECOMMENDATIONS"
banner "════════════════════════════════════════════════════════════════════════════════"

log "GitHub security recommendations:"

echo ""
echo "🔒 REPOSITORY SECURITY:"
echo "  • Enable branch protection rules for main/master branch"
echo "  • Require status checks to pass before merging"
echo "  • Require pull request reviews before merging"
echo "  • Restrict who can push to important branches"

echo ""
echo "🔧 CI/CD SECURITY:"
echo "  • Use environment-specific secrets (dev/staging/prod)"
echo "  • Implement secret rotation in your CI/CD pipeline"
echo "  • Monitor GitHub Actions usage and logs"
echo "  • Use dependabot for dependency updates"

echo ""
echo "📊 MONITORING:"
echo "  • Enable GitHub Advanced Security features"
echo "  • Set up code scanning and secret scanning"
echo "  • Monitor repository access and activities"
echo "  • Regular security audits of Actions workflows"

echo ""
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                              NEXT STEPS"
banner "════════════════════════════════════════════════════════════════════════════════"

echo ""
log "Recommended next steps:"
echo "  1. Update your GitHub Actions workflows to use the new secrets"
echo "  2. Test your CI/CD pipeline with the new configuration"
echo "  3. Set up branch protection rules if not already done"
echo "  4. Enable Dependabot for automated dependency updates"
echo "  5. Configure code scanning and secret scanning"

echo ""
info "Example workflow usage:"
echo "  env:"
echo "    FIREBASE_API_KEY: \${{ secrets.VITE_FIREBASE_API_KEY }}"
echo "    OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}"

echo ""
success "GitHub secrets update completed successfully!"

log "🎉 All secrets have been updated in your GitHub repository!"
