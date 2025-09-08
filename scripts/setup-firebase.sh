#!/bin/bash
set -e

# ============================================================================
# Firebase Projects Setup Script
# Creates staging and production Firebase projects for CareerCopilot
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
║              🔥 FIREBASE SETUP FOR CAREERCOPILOT            ║
╚══════════════════════════════════════════════════════════════╝
${NC}"

# Check Firebase CLI
if ! command -v firebase &> /dev/null; then
    error "Firebase CLI not found. Install with: npm install -g firebase-tools"
    exit 1
fi

# Login check
if ! firebase projects:list &> /dev/null; then
    warning "Not logged into Firebase. Running login..."
    firebase login
fi

log "Setting up Firebase projects..."

# Function to create project if it doesn't exist
setup_project() {
    local project_id="$1"
    local display_name="$2"

    log "Setting up project: $project_id"

    # Check if project exists
    if firebase projects:list | grep -q "$project_id"; then
        info "Project $project_id already exists"
    else
        log "Creating project $project_id..."
        firebase projects:create "$project_id" --display-name "$display_name"
    fi

    # Set as active project
    firebase use "$project_id"

    # Initialize if needed
    if [ ! -f "firebase.json" ]; then
        log "Initializing Firebase in project..."
        firebase init --project "$project_id"
    fi

    log "Enabling required services for $project_id..."

    # Enable Authentication
    info "🔐 Setting up Authentication..."
    echo "Go to: https://console.firebase.google.com/project/$project_id/authentication/providers"
    echo "1. Enable Email/Password sign-in method"
    echo "2. Enable Google sign-in method (optional)"
    echo "3. Add authorized domains for your app"

    # Enable Firestore
    info "🗄️  Setting up Firestore..."
    echo "Go to: https://console.firebase.google.com/project/$project_id/firestore"
    echo "1. Create database in production mode"
    echo "2. Choose region: us-central1"

    # Enable Storage
    info "📁 Setting up Storage..."
    echo "Go to: https://console.firebase.google.com/project/$project_id/storage"
    echo "1. Get started with Cloud Storage"
    echo "2. Start in production mode"
    echo "3. Choose region: us-central1"

    # Enable Hosting
    info "🌐 Setting up Hosting..."
    echo "Go to: https://console.firebase.google.com/project/$project_id/hosting"
    echo "1. Get started with Firebase Hosting"
    echo "2. Note the hosting URL for later"

    echo
    warning "After setting up in console, generate service account:"
    echo "1. Go to: https://console.firebase.google.com/project/$project_id/settings/serviceaccounts/adminsdk"
    echo "2. Click 'Generate new private key'"
    echo "3. Save as firebase-$project_id-key.json"
    echo
}

# Set up staging project
setup_project "careercopilot-staging" "CareerCopilot Staging"

echo
read -p "Press Enter after setting up staging project in console..."

# Set up production project
setup_project "careercopilot-prod" "CareerCopilot Production"

echo
read -p "Press Enter after setting up production project in console..."

log "Creating aliases for easy switching..."
firebase use --add careercopilot-staging --alias staging
firebase use --add careercopilot-prod --alias production

# Deploy security rules
log "Deploying Firestore security rules..."
firebase use staging
firebase deploy --only firestore:rules

firebase use production
firebase deploy --only firestore:rules

echo -e "${GREEN}
✅ Firebase setup complete!

Next steps:
1. Download service account keys from both projects
2. Add keys to GitHub secrets:
   - firebase-careercopilot-staging-key.json → FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT_STAGING
   - firebase-careercopilot-prod-key.json → FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT

3. Test deployment:
   git push origin develop

Project URLs:
📊 Staging: https://console.firebase.google.com/project/careercopilot-staging
🚀 Production: https://console.firebase.google.com/project/careercopilot-prod
${NC}"
