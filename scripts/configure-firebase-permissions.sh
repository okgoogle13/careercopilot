#!/bin/bash
set -e

# ============================================================================
# Firebase Service Account Permissions Configuration
# Configures existing service accounts with proper deployment permissions
# ============================================================================

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

echo -e "${BLUE}
╔══════════════════════════════════════════════════════════════╗
║          🔐 CONFIGURE FIREBASE SERVICE ACCOUNT PERMISSIONS   ║
╚══════════════════════════════════════════════════════════════╝
${NC}"

# Check gcloud CLI
if ! command -v gcloud &> /dev/null; then
    error "Google Cloud CLI not found. Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project IDs and service account emails
echo
info "Please provide your project details:"
echo -n "Staging project ID: "
read -r STAGING_PROJECT
echo -n "Production project ID: "
read -r PROD_PROJECT
echo -n "Staging service account email: "
read -r STAGING_SA_EMAIL
echo -n "Production service account email: "
read -r PROD_SA_EMAIL

echo
log "Configuring permissions for:"
echo "  Staging: $STAGING_SA_EMAIL in $STAGING_PROJECT"
echo "  Production: $PROD_SA_EMAIL in $PROD_PROJECT"
echo

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
        echo -e "${RED}❌${NC}"
        warning "Failed to add $role"
    fi
}

# Configure staging permissions
log "Configuring staging service account permissions..."
gcloud config set project "$STAGING_PROJECT"

add_role "$STAGING_PROJECT" "$STAGING_SA_EMAIL" "roles/firebase.admin" "Firebase Admin"
add_role "$STAGING_PROJECT" "$STAGING_SA_EMAIL" "roles/firebasehosting.admin" "Firebase Hosting Admin"
add_role "$STAGING_PROJECT" "$STAGING_SA_EMAIL" "roles/run.admin" "Cloud Run Admin"
add_role "$STAGING_PROJECT" "$STAGING_SA_EMAIL" "roles/cloudbuild.builds.builder" "Cloud Build Builder"
add_role "$STAGING_PROJECT" "$STAGING_SA_EMAIL" "roles/storage.admin" "Storage Admin"
add_role "$STAGING_PROJECT" "$STAGING_SA_EMAIL" "roles/iam.serviceAccountUser" "Service Account User"
add_role "$STAGING_PROJECT" "$STAGING_SA_EMAIL" "roles/artifactregistry.admin" "Artifact Registry Admin"
add_role "$STAGING_PROJECT" "$STAGING_SA_EMAIL" "roles/source.admin" "Source Repository Admin"

echo
log "Configuring production service account permissions..."
gcloud config set project "$PROD_PROJECT"

add_role "$PROD_PROJECT" "$PROD_SA_EMAIL" "roles/firebase.admin" "Firebase Admin"
add_role "$PROD_PROJECT" "$PROD_SA_EMAIL" "roles/firebasehosting.admin" "Firebase Hosting Admin"
add_role "$PROD_PROJECT" "$PROD_SA_EMAIL" "roles/run.admin" "Cloud Run Admin"
add_role "$PROD_PROJECT" "$PROD_SA_EMAIL" "roles/cloudbuild.builds.builder" "Cloud Build Builder"
add_role "$PROD_PROJECT" "$PROD_SA_EMAIL" "roles/storage.admin" "Storage Admin"
add_role "$PROD_PROJECT" "$PROD_SA_EMAIL" "roles/iam.serviceAccountUser" "Service Account User"
add_role "$PROD_PROJECT" "$PROD_SA_EMAIL" "roles/artifactregistry.admin" "Artifact Registry Admin"
add_role "$PROD_PROJECT" "$PROD_SA_EMAIL" "roles/source.admin" "Source Repository Admin"

echo
log "Generating fresh service account keys..."

# Generate staging key
echo -n "Generating staging key... "
gcloud config set project "$STAGING_PROJECT"
if gcloud iam service-accounts keys create "firebase-staging-key.json" \
    --iam-account="$STAGING_SA_EMAIL" \
    --quiet &> /dev/null; then
    echo -e "${GREEN}✅${NC}"
    echo "  📁 Saved as: firebase-staging-key.json"
else
    echo -e "${RED}❌${NC}"
    error "Failed to generate staging key"
fi

# Generate production key
echo -n "Generating production key... "
gcloud config set project "$PROD_PROJECT"
if gcloud iam service-accounts keys create "firebase-prod-key.json" \
    --iam-account="$PROD_SA_EMAIL" \
    --quiet &> /dev/null; then
    echo -e "${GREEN}✅${NC}"
    echo "  📁 Saved as: firebase-prod-key.json"
else
    echo -e "${RED}❌${NC}"
    error "Failed to generate production key"
fi

echo
log "Adding keys to GitHub secrets..."

REPO="okgoogle13/careercopilot"

# Add staging Firebase service account
if [ -f "firebase-staging-key.json" ]; then
    echo -n "Adding FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT_STAGING... "
    if gh secret set FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT_STAGING \
        --body "$(cat firebase-staging-key.json)" \
        --repo "$REPO" &> /dev/null; then
        echo -e "${GREEN}✅${NC}"
    else
        echo -e "${RED}❌${NC}"
    fi
fi

# Add production Firebase service account
if [ -f "firebase-prod-key.json" ]; then
    echo -n "Adding FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT... "
    if gh secret set FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT \
        --body "$(cat firebase-prod-key.json)" \
        --repo "$REPO" &> /dev/null; then
        echo -e "${GREEN}✅${NC}"
    else
        echo -e "${RED}❌${NC}"
    fi
fi

# Add staging GCP service account (same key, different secret name)
if [ -f "firebase-staging-key.json" ]; then
    echo -n "Adding GCP_STAGING_SA_KEY... "
    if gh secret set GCP_STAGING_SA_KEY \
        --body "$(cat firebase-staging-key.json)" \
        --repo "$REPO" &> /dev/null; then
        echo -e "${GREEN}✅${NC}"
    else
        echo -e "${RED}❌${NC}"
    fi
fi

echo
warning "🗑️  Clean up local key files for security:"
echo "rm firebase-staging-key.json firebase-prod-key.json"

echo
log "Verifying GitHub secrets..."
gh secret list --repo "$REPO" | grep -E "(FIREBASE_SERVICE_ACCOUNT|GCP.*SA_KEY)"

echo -e "${GREEN}
✅ Configuration complete!

Next steps:
1. Delete local JSON files: rm firebase-*-key.json
2. Test deployment: git push origin develop
3. Monitor: https://github.com/$REPO/actions

Required APIs (enable if needed):
- Cloud Run API
- Cloud Build API
- Artifact Registry API
- Firebase Hosting API
${NC}"
