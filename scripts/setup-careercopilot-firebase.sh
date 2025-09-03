#!/bin/bash
set -e

# ============================================================================
# CareerCopilot Firebase Service Account Configuration
# Configures specific service accounts with deployment permissions
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
║                    🚀 CAREERCOPILOT FIREBASE SETUP                         ║
║                 Configure Service Accounts & GitHub Secrets                 ║
╚══════════════════════════════════════════════════════════════════════════════╝
"

log "Configuring CareerCopilot Firebase deployment..."
echo
info "Projects:"
echo "  📊 Staging: $STAGING_PROJECT"
echo "  🚀 Production: $PROD_PROJECT"
echo
info "Service Accounts:"
echo "  📊 Staging: $STAGING_SA_EMAIL"
echo "  🚀 Production: $PROD_SA_EMAIL"
echo

# Security scan for hardcoded secrets
log "Running security scan for hardcoded API keys..."

SECURITY_ISSUES=false

# Check for common API key patterns
if grep -r "AIzaSy[A-Za-z0-9_-]\{35\}" . --exclude-dir=.git --exclude-dir=node_modules --exclude="*.md" &> /dev/null; then
    error "Found potential Firebase API keys in codebase!"
    SECURITY_ISSUES=true
fi

if grep -r "sk-[A-Za-z0-9]\{20,\}" . --exclude-dir=.git --exclude-dir=node_modules --exclude="*.md" &> /dev/null; then
    error "Found potential OpenAI API keys in codebase!"
    SECURITY_ISSUES=true
fi

if grep -r "sk-ant-[A-Za-z0-9_-]\{20,\}" . --exclude-dir=.git --exclude-dir=node_modules --exclude="*.md" &> /dev/null; then
    error "Found potential Anthropic API keys in codebase!"
    SECURITY_ISSUES=true
fi

# Check for .env files with real keys
if find . -name "*.env" -not -path "./.git/*" -not -name "*.example" | xargs grep -l "=" 2>/dev/null | grep -v example; then
    warning "Found .env files that may contain secrets:"
    find . -name "*.env" -not -path "./.git/*" -not -name "*.example" | head -5
    echo
    warning "These should be removed or added to .gitignore"
    SECURITY_ISSUES=true
fi

if [ "$SECURITY_ISSUES" = true ]; then
    echo
    error "🚨 SECURITY ISSUES DETECTED! 🚨"
    echo
    warning "Please fix security issues before proceeding:"
    echo "  1. Remove any .env files with real API keys"
    echo "  2. Add .env files to .gitignore"
    echo "  3. Use environment variables or GitHub secrets instead"
    echo "  4. Run: git rm --cached any-committed-env-files"
    echo
    echo -n "Continue anyway? (y/N): "
    read -r confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        error "Setup cancelled for security reasons"
        exit 1
    fi
fi

success "Security scan completed"

# Check prerequisites
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
        warning "Role $role may already exist or failed to add"
    fi
}

echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                           1. CONFIGURING STAGING PERMISSIONS"
banner "════════════════════════════════════════════════════════════════════════════════"

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
add_role "$STAGING_PROJECT" "$STAGING_SA_EMAIL" "roles/source.admin" "Source Repository Admin"

success "Staging permissions configured"

echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                         2. CONFIGURING PRODUCTION PERMISSIONS"
banner "════════════════════════════════════════════════════════════════════════════════"

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
add_role "$PROD_PROJECT" "$PROD_SA_EMAIL" "roles/source.admin" "Source Repository Admin"

success "Production permissions configured"

echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                           3. GENERATING FRESH SERVICE ACCOUNT KEYS"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Generating fresh service account keys..."

# Generate staging key
echo -n "Generating staging key... "
gcloud config set project "$STAGING_PROJECT" --quiet
if gcloud iam service-accounts keys create "firebase-staging-key.json" \
    --iam-account="$STAGING_SA_EMAIL" \
    --quiet &> /dev/null; then
    echo -e "${GREEN}✅${NC}"
    echo "  📁 Saved as: firebase-staging-key.json"
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
    echo "  📁 Saved as: firebase-prod-key.json"
else
    echo -e "${RED}❌${NC}"
    error "Failed to generate production key"
    exit 1
fi

success "Fresh keys generated successfully"

echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                           4. ADDING KEYS TO GITHUB SECRETS"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Adding service account keys to GitHub repository secrets..."

# Add staging Firebase service account
echo -n "Adding FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT_STAGING... "
if gh secret set FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT_STAGING \
    --body "$(cat firebase-staging-key.json)" \
    --repo "$REPO" &> /dev/null; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
    error "Failed to add staging Firebase secret"
fi

# Add staging GCP service account (same key, different name)
echo -n "Adding GCP_STAGING_SA_KEY... "
if gh secret set GCP_STAGING_SA_KEY \
    --body "$(cat firebase-staging-key.json)" \
    --repo "$REPO" &> /dev/null; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
    error "Failed to add staging GCP secret"
fi

# Add production Firebase service account
echo -n "Adding FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT... "
if gh secret set FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT \
    --body "$(cat firebase-prod-key.json)" \
    --repo "$REPO" &> /dev/null; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
    error "Failed to add production Firebase secret"
fi

# Update production project ID (correcting the project ID)
echo -n "Updating GCP_PROJECT_ID... "
if gh secret set GCP_PROJECT_ID \
    --body "$PROD_PROJECT" \
    --repo "$REPO" &> /dev/null; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
    error "Failed to update production project ID"
fi

success "GitHub secrets configured successfully"

echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                               5. CLEANUP & VERIFICATION"
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
log "Verifying GitHub secrets..."
echo
gh secret list --repo "$REPO" | grep -E "(FIREBASE_SERVICE_ACCOUNT|GCP.*SA_KEY|GCP.*PROJECT)" || true

echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                                  🎉 SETUP COMPLETE!"
banner "════════════════════════════════════════════════════════════════════════════════"

success "CareerCopilot Firebase configuration completed successfully!"

echo
info "What was configured:"
echo "  ✅ Staging service account permissions"
echo "  ✅ Production service account permissions"
echo "  ✅ Fresh service account keys generated"
echo "  ✅ GitHub secrets added:"
echo "     - FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT_STAGING"
echo "     - FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT"
echo "     - GCP_STAGING_SA_KEY"
echo "     - GCP_PROJECT_ID (updated)"

echo
log "Next steps:"
echo "  1. Test deployment: git push origin develop"
echo "  2. Monitor deployment: https://github.com/$REPO/actions"
echo "  3. Check staging deployment: https://careercopilot-staging.web.app"
echo "  4. Run security audit: ./scripts/security-audit.sh"

echo
warning "Important: Enable required APIs if you haven't already:"
echo "  • Cloud Run API"
echo "  • Cloud Build API"
echo "  • Artifact Registry API"
echo "  • Firebase Hosting API"

echo
banner "🚀 Ready to deploy CareerCopilot! 🎉"