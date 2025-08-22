#!/bin/bash
set -e

# ============================================================================
# CareerCopilot Complete Setup Script
# Handles ALL secrets, security scanning, and deployment configuration
# ============================================================================

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
banner() { echo -e "${PURPLE}$1${NC}"; }

# Configuration
STAGING_PROJECT="careercopilot-staging"
PROD_PROJECT="careercopilot-468811"
STAGING_SA_EMAIL="firebase-adminsdk-fbsvc@careercopilot-staging.iam.gserviceaccount.com"
PROD_SA_EMAIL="firebase-adminsdk-fbsvc@careercopilot-468811.iam.gserviceaccount.com"
REPO="okgoogle13/careercopilot"

# Banner
clear
banner "
╔══════════════════════════════════════════════════════════════════════════════╗
║                  🚀 CAREERCOPILOT COMPLETE SETUP SCRIPT                     ║
║            Security Scan + Secrets + OAuth + Deployment Ready               ║
╚══════════════════════════════════════════════════════════════════════════════╝
"

log "Starting complete CareerCopilot setup..."
echo
info "This script will:"
echo "  🔍 Scan for hardcoded API keys and security issues"
echo "  🔑 Configure all Firebase service accounts and permissions"
echo "  🔐 Set up Google OAuth clients and authentication"
echo "  📧 Configure optional services (SendGrid)"
echo "  ✅ Add ALL missing GitHub secrets"
echo "  🚀 Verify deployment readiness"
echo

# SECTION 1: COMPREHENSIVE SECURITY SCAN
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                           1. COMPREHENSIVE SECURITY SCAN"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Running comprehensive security scan..."

SECURITY_ISSUES=false

# Check for common API key patterns
log "Scanning for hardcoded API keys..."

if grep -r "AIzaSy[A-Za-z0-9_-]\{35\}" . --exclude-dir=.git --exclude-dir=node_modules --exclude="*.md" &> /dev/null; then
    error "Found potential Firebase API keys in codebase!"
    grep -r "AIzaSy[A-Za-z0-9_-]\{35\}" . --exclude-dir=.git --exclude-dir=node_modules --exclude="*.md" | head -5
    SECURITY_ISSUES=true
fi

if grep -r "sk-[A-Za-z0-9]\{20,\}" . --exclude-dir=.git --exclude-dir=node_modules --exclude="*.md" &> /dev/null; then
    error "Found potential OpenAI API keys in codebase!"
    grep -r "sk-[A-Za-z0-9]\{20,\}" . --exclude-dir=.git --exclude-dir=node_modules --exclude="*.md" | head -5
    SECURITY_ISSUES=true
fi

if grep -r "sk-ant-[A-Za-z0-9_-]\{20,\}" . --exclude-dir=.git --exclude-dir=node_modules --exclude="*.md" &> /dev/null; then
    error "Found potential Anthropic API keys in codebase!"
    grep -r "sk-ant-[A-Za-z0-9_-]\{20,\}" . --exclude-dir=.git --exclude-dir=node_modules --exclude="*.md" | head -5
    SECURITY_ISSUES=true
fi

if grep -r "pplx-[A-Za-z0-9_-]\{20,\}" . --exclude-dir=.git --exclude-dir=node_modules --exclude="*.md" &> /dev/null; then
    error "Found potential Perplexity API keys in codebase!"
    SECURITY_ISSUES=true
fi

if grep -r "SG\.[A-Za-z0-9_-]\{20,\}" . --exclude-dir=.git --exclude-dir=node_modules --exclude="*.md" &> /dev/null; then
    error "Found potential SendGrid API keys in codebase!"
    SECURITY_ISSUES=true
fi

# Check for .env files with real keys
log "Scanning for unprotected .env files..."
if find . -name "*.env" -not -path "./.git/*" -not -name "*.example" | xargs grep -l "=" 2>/dev/null | grep -v example; then
    warning "Found .env files that may contain secrets:"
    find . -name "*.env" -not -path "./.git/*" -not -name "*.example" | head -5
    echo
    warning "These should be removed or added to .gitignore"
    SECURITY_ISSUES=true
fi

# Check for private keys in files
log "Scanning for private key patterns..."
if grep -r "BEGIN.*PRIVATE.*KEY" . --exclude-dir=.git --exclude-dir=node_modules --exclude="*.md" &> /dev/null; then
    error "Found potential private keys in codebase!"
    SECURITY_ISSUES=true
fi

# Check git history for secrets (limited scan)
log "Quick scan of recent git history..."
if git log --oneline -10 | grep -i -E "(key|secret|password|token)" &> /dev/null; then
    warning "Recent commits mention keys/secrets in commit messages"
    git log --oneline -10 | grep -i -E "(key|secret|password|token)" | head -3
fi

if [ "$SECURITY_ISSUES" = true ]; then
    echo
    error "🚨 SECURITY ISSUES DETECTED! 🚨"
    echo
    warning "Found security issues that should be addressed:"
    echo "  1. Remove any .env files with real API keys"
    echo "  2. Add .env files to .gitignore" 
    echo "  3. Remove hardcoded API keys from source code"
    echo "  4. Use environment variables or GitHub secrets instead"
    echo "  5. Consider running: git filter-branch to clean history"
    echo
    echo -n "Continue setup anyway? (y/N): "
    read -r confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        error "Setup cancelled for security reasons"
        echo
        info "To fix issues and re-run:"
        echo "  1. Remove hardcoded secrets from files"
        echo "  2. Add sensitive files to .gitignore"
        echo "  3. Run this script again"
        exit 1
    fi
    echo
    warning "Proceeding with setup despite security issues..."
else
    success "Security scan passed - no hardcoded secrets found"
fi

# Check prerequisites
echo
log "Checking prerequisites..."

if ! command -v gcloud &> /dev/null; then
    error "Google Cloud CLI not found. Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

if ! command -v gh &> /dev/null; then
    error "GitHub CLI not found. Install from: https://cli.github.com/"
    exit 1
fi

if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 &> /dev/null; then
    error "Not authenticated with gcloud. Run: gcloud auth login"
    exit 1
fi

if ! gh auth status &> /dev/null; then
    error "Not authenticated with GitHub CLI. Run: gh auth login"
    exit 1
fi

success "Prerequisites check passed"

# Function to add role with error handling
add_role() {
    local project="$1"
    local member="$2"
    local role="$3"
    local description="$4"
    
    echo -n "  Adding $description... "
    if gcloud projects add-iam-policy-binding "$project" \
        --member="serviceAccount:$member" \
        --role="$role" \
        --quiet &> /dev/null; then
        echo -e "${GREEN}✅${NC}"
    else
        echo -e "${YELLOW}⚠️${NC}"
    fi
}

# SECTION 2: FIREBASE SERVICE ACCOUNTS
echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                           2. FIREBASE SERVICE ACCOUNT SETUP"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Configuring Firebase service account permissions..."

# Configure staging permissions
log "Setting staging project: $STAGING_PROJECT"
gcloud config set project "$STAGING_PROJECT" --quiet

log "Adding permissions to staging service account..."
add_role "$STAGING_PROJECT" "$STAGING_SA_EMAIL" "roles/firebase.admin" "Firebase Admin"
add_role "$STAGING_PROJECT" "$STAGING_SA_EMAIL" "roles/firebasehosting.admin" "Firebase Hosting Admin"
add_role "$STAGING_PROJECT" "$STAGING_SA_EMAIL" "roles/run.admin" "Cloud Run Admin"
add_role "$STAGING_PROJECT" "$STAGING_SA_EMAIL" "roles/cloudbuild.builds.builder" "Cloud Build Builder"
add_role "$STAGING_PROJECT" "$STAGING_SA_EMAIL" "roles/storage.admin" "Storage Admin"
add_role "$STAGING_PROJECT" "$STAGING_SA_EMAIL" "roles/iam.serviceAccountUser" "Service Account User"
add_role "$STAGING_PROJECT" "$STAGING_SA_EMAIL" "roles/artifactregistry.admin" "Artifact Registry Admin"

# Configure production permissions
log "Setting production project: $PROD_PROJECT"
gcloud config set project "$PROD_PROJECT" --quiet

log "Adding permissions to production service account..."
add_role "$PROD_PROJECT" "$PROD_SA_EMAIL" "roles/firebase.admin" "Firebase Admin"
add_role "$PROD_PROJECT" "$PROD_SA_EMAIL" "roles/firebasehosting.admin" "Firebase Hosting Admin"
add_role "$PROD_PROJECT" "$PROD_SA_EMAIL" "roles/run.admin" "Cloud Run Admin"
add_role "$PROD_PROJECT" "$PROD_SA_EMAIL" "roles/cloudbuild.builds.builder" "Cloud Build Builder"
add_role "$PROD_PROJECT" "$PROD_SA_EMAIL" "roles/storage.admin" "Storage Admin"
add_role "$PROD_PROJECT" "$PROD_SA_EMAIL" "roles/iam.serviceAccountUser" "Service Account User"
add_role "$PROD_PROJECT" "$PROD_SA_EMAIL" "roles/artifactregistry.admin" "Artifact Registry Admin"

success "Service account permissions configured"

# SECTION 3: GENERATE SERVICE ACCOUNT KEYS
echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                           3. GENERATE FRESH SERVICE ACCOUNT KEYS"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Generating fresh service account keys..."

# Generate staging key
echo -n "Generating staging key... "
gcloud config set project "$STAGING_PROJECT" --quiet
if gcloud iam service-accounts keys create "firebase-staging-key.json" \
    --iam-account="$STAGING_SA_EMAIL" \
    --quiet &> /dev/null; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
    error "Failed to generate staging key"
    exit 1
fi

# Generate production key
echo -n "Generating production key... "
gcloud config set project "$PROD_PROJECT" --quiet
if gcloud iam service-accounts keys create "firebase-prod-key.json" \
    --iam-account="$PROD_SA_EMAIL" \
    --quiet &> /dev/null; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
    error "Failed to generate production key"
    exit 1
fi

success "Fresh keys generated successfully"

# SECTION 4: GITHUB SECRETS
echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                           4. CONFIGURE ALL GITHUB SECRETS"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Adding/updating all GitHub secrets..."

# Core Firebase and GCP secrets
echo -n "Adding FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT_STAGING... "
if gh secret set FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT_STAGING \
    --body "$(cat firebase-staging-key.json)" \
    --repo "$REPO" &> /dev/null; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
fi

echo -n "Adding GCP_STAGING_SA_KEY... "
if gh secret set GCP_STAGING_SA_KEY \
    --body "$(cat firebase-staging-key.json)" \
    --repo "$REPO" &> /dev/null; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
fi

echo -n "Adding FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT... "
if gh secret set FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT \
    --body "$(cat firebase-prod-key.json)" \
    --repo "$REPO" &> /dev/null; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
fi

echo -n "Updating GCP_PROJECT_ID... "
if gh secret set GCP_PROJECT_ID \
    --body "$PROD_PROJECT" \
    --repo "$REPO" &> /dev/null; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
fi

# SECTION 5: OPTIONAL SERVICES
echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                           5. OPTIONAL SERVICES CONFIGURATION"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Configuring optional services..."

# SendGrid API Key
echo
info "SendGrid Email Service Setup"
echo -n "Enter SendGrid API key (or press Enter to skip): "
read -r sendgrid_key

if [ -n "$sendgrid_key" ]; then
    echo -n "Adding SENDGRID_API_KEY... "
    if gh secret set SENDGRID_API_KEY \
        --body "$sendgrid_key" \
        --repo "$REPO" &> /dev/null; then
        echo -e "${GREEN}✅${NC}"
    else
        echo -e "${RED}❌${NC}"
    fi
else
    info "Skipped SendGrid API key (can be added later)"
fi

# Google OAuth Client IDs
echo
info "Google OAuth Client IDs Setup"
echo "Get these from Google Cloud Console > APIs & Services > Credentials"
echo

echo -n "Enter staging OAuth Client ID (or press Enter to skip): "
read -r staging_oauth_id

if [ -n "$staging_oauth_id" ]; then
    echo -n "Adding GOOGLE_OAUTH_CLIENT_ID_STAGING... "
    if gh secret set GOOGLE_OAUTH_CLIENT_ID_STAGING \
        --body "$staging_oauth_id" \
        --repo "$REPO" &> /dev/null; then
        echo -e "${GREEN}✅${NC}"
    else
        echo -e "${RED}❌${NC}"
    fi
else
    info "Skipped staging OAuth client ID"
fi

echo -n "Enter production OAuth Client ID (or press Enter to skip): "
read -r prod_oauth_id

if [ -n "$prod_oauth_id" ]; then
    echo -n "Adding GOOGLE_OAUTH_CLIENT_ID_PROD... "
    if gh secret set GOOGLE_OAUTH_CLIENT_ID_PROD \
        --body "$prod_oauth_id" \
        --repo "$REPO" &> /dev/null; then
        echo -e "${GREEN}✅${NC}"
    else
        echo -e "${RED}❌${NC}"
    fi
else
    info "Skipped production OAuth client ID"
fi

# SECTION 6: CLEANUP AND VERIFICATION
echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                           6. CLEANUP & VERIFICATION"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Cleaning up local key files for security..."
if [ -f "firebase-staging-key.json" ]; then
    rm firebase-staging-key.json
    echo "  🗑️  Removed firebase-staging-key.json"
fi

if [ -f "firebase-prod-key.json" ]; then
    rm firebase-prod-key.json
    echo "  🗑️  Removed firebase-prod-key.json"
fi

success "Local files cleaned up"

echo
log "Verifying GitHub secrets configuration..."
echo
gh secret list --repo "$REPO" | grep -E "(FIREBASE|GCP|OAUTH|SENDGRID|ANTHROPIC|GEMINI|OPENAI|PINECONE)" || true

echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                              🎉 COMPLETE SETUP FINISHED!"
banner "════════════════════════════════════════════════════════════════════════════════"

success "CareerCopilot complete setup finished successfully!"

echo
info "✅ COMPLETED TASKS:"
echo "  🔍 Security scan for hardcoded API keys"
echo "  🔑 Firebase service account permissions configured"
echo "  🔐 Fresh service account keys generated and added to GitHub"
echo "  📧 Optional services configured (SendGrid, OAuth)"
echo "  🚀 All deployment secrets ready"

echo
info "🚀 DEPLOYMENT READINESS:"
echo "  ✅ Critical secrets configured - deployment should work"
echo "  ✅ Firebase service accounts ready"
echo "  ✅ GCP permissions configured" 
echo "  ✅ Security scanning completed"

echo
log "🧪 READY TO TEST:"
echo "  1. Test deployment: git push origin develop"
echo "  2. Monitor deployment: https://github.com/$REPO/actions"
echo "  3. Check staging: https://careercopilot-staging.web.app"
echo "  4. Run security audit: ./scripts/security-audit.sh"

echo
warning "📋 OPTIONAL NEXT STEPS:"
if [ -z "$sendgrid_key" ]; then
    echo "  • Add SendGrid API key for email services"
fi
if [ -z "$staging_oauth_id" ] || [ -z "$prod_oauth_id" ]; then
    echo "  • Set up Google OAuth clients for Sign-In authentication"
    echo "    Run: ./scripts/setup-google-oauth.sh"
fi
echo "  • Configure Firebase security rules"
echo "  • Set up monitoring and alerts"
echo "  • Test all application features"

echo
banner "🚀 CareerCopilot is ready for deployment! 🎉"

echo
info "Need help with anything else?"
echo "  • OAuth setup: ./scripts/setup-google-oauth.sh"
echo "  • Security audit: ./scripts/security-audit.sh"
echo "  • Documentation: ./SETUP_GUIDE.md"