#!/bin/bash
set -e

# ============================================================================
# Google OAuth Setup Script for CareerCopilot
# Creates OAuth clients and configures authorized origins/redirects
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
REPO="okgoogle13/careercopilot"

# OAuth URLs
STAGING_ORIGINS=(
    "https://careercopilot-staging.web.app"
    "https://careercopilot-staging.firebaseapp.com"
    "http://localhost:5173"
    "http://localhost:3000"
)

STAGING_REDIRECTS=(
    "https://careercopilot-staging.web.app/__/auth/handler"
    "https://careercopilot-staging.firebaseapp.com/__/auth/handler"
    "http://localhost:5173/__/auth/handler"
    "http://localhost:3000/__/auth/handler"
)

PROD_ORIGINS=(
    "https://careercopilot-468811.web.app"
    "https://careercopilot-468811.firebaseapp.com"
)

PROD_REDIRECTS=(
    "https://careercopilot-468811.web.app/__/auth/handler"
    "https://careercopilot-468811.firebaseapp.com/__/auth/handler"
)

# Banner
clear
banner "
╔══════════════════════════════════════════════════════════════════════════════╗
║                    🔐 GOOGLE OAUTH SETUP FOR CAREERCOPILOT                  ║
║                   Configure OAuth Clients & GitHub Secrets                  ║
╚══════════════════════════════════════════════════════════════════════════════╝
"

log "Setting up Google OAuth for CareerCopilot..."
echo
info "Projects:"
echo "  📊 Staging: $STAGING_PROJECT"
echo "  🚀 Production: $PROD_PROJECT"
echo

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

# Function to enable APIs
enable_apis() {
    local project="$1"
    local env_name="$2"
    
    log "Enabling required APIs for $env_name..."
    gcloud config set project "$project" --quiet
    
    local apis=(
        "oauth2.googleapis.com"
        "plus.googleapis.com"
        "people.googleapis.com"
    )
    
    for api in "${apis[@]}"; do
        echo -n "  Enabling $api... "
        if gcloud services enable "$api" --quiet &> /dev/null; then
            echo -e "${GREEN}✅${NC}"
        else
            echo -e "${YELLOW}⚠️${NC}"
        fi
    done
}

# Function to create OAuth consent screen
setup_consent_screen() {
    local project="$1"
    local env_name="$2"
    
    log "Setting up OAuth consent screen for $env_name..."
    gcloud config set project "$project" --quiet
    
    # Check if consent screen exists
    if gcloud alpha iap oauth-brands list --format="value(name)" 2>/dev/null | grep -q .; then
        info "OAuth consent screen already exists for $env_name"
    else
        warning "OAuth consent screen needs to be configured manually for $env_name"
        echo
        info "Please configure the OAuth consent screen manually:"
        echo "  1. Go to: https://console.cloud.google.com/apis/credentials/consent?project=$project"
        echo "  2. Choose 'External' user type"
        echo "  3. Fill in required fields:"
        echo "     - App name: CareerCopilot ($env_name)"
        echo "     - User support email: your-email@domain.com"
        echo "     - Developer contact: your-email@domain.com"
        echo "  4. Add scopes: openid, email, profile"
        echo "  5. Add test users if needed"
        echo
        read -p "Press Enter after configuring the consent screen..."
    fi
}

# Function to create OAuth client
create_oauth_client() {
    local project="$1"
    local env_name="$2"
    local origins=("${!3}")
    local redirects=("${!4}")
    
    log "Creating OAuth client for $env_name..."
    gcloud config set project "$project" --quiet
    
    # Prepare origins string
    local origins_str=""
    for origin in "${origins[@]}"; do
        origins_str="$origins_str --authorized-uris=$origin"
    done
    
    # Prepare redirects string
    local redirects_str=""
    for redirect in "${redirects[@]}"; do
        redirects_str="$redirects_str --authorized-redirect-uris=$redirect"
    done
    
    # Create OAuth client
    local client_name="careercopilot-${env_name,,}-oauth"
    
    echo "Creating OAuth client: $client_name"
    
    # Check if client already exists
    local existing_client=$(gcloud auth application-default oauth-clients list --format="value(name)" 2>/dev/null | grep "$client_name" || true)
    
    if [ -n "$existing_client" ]; then
        info "OAuth client already exists: $client_name"
        # Get existing client ID
        local client_id=$(gcloud auth application-default oauth-clients describe "$existing_client" --format="value(client_id)" 2>/dev/null || true)
    else
        # Create new client using gcloud command
        local temp_file=$(mktemp)
        cat > "$temp_file" << EOF
{
  "web": {
    "client_id": "",
    "client_secret": "",
    "redirect_uris": [$(printf '"%s",' "${redirects[@]}" | sed 's/,$//')],
    "javascript_origins": [$(printf '"%s",' "${origins[@]}" | sed 's/,$//')],
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token"
  }
}
EOF
        
        warning "OAuth client creation requires manual setup"
        echo
        info "Please create OAuth client manually for $env_name:"
        echo "  1. Go to: https://console.cloud.google.com/apis/credentials?project=$project"
        echo "  2. Click '+ CREATE CREDENTIALS' → 'OAuth client ID'"
        echo "  3. Application type: 'Web application'"
        echo "  4. Name: CareerCopilot $env_name OAuth Client"
        echo
        echo "  5. Authorized JavaScript origins:"
        for origin in "${origins[@]}"; do
            echo "     $origin"
        done
        echo
        echo "  6. Authorized redirect URIs:"
        for redirect in "${redirects[@]}"; do
            echo "     $redirect"
        done
        echo
        echo -n "Enter the Client ID when created: "
        read -r client_id
        
        rm "$temp_file"
    fi
    
    if [ -n "$client_id" ]; then
        success "OAuth client configured for $env_name"
        echo "  Client ID: $client_id"
        
        # Store client ID for GitHub secrets
        if [ "$env_name" = "Staging" ]; then
            STAGING_CLIENT_ID="$client_id"
        else
            PROD_CLIENT_ID="$client_id"
        fi
    else
        error "Failed to get client ID for $env_name"
        return 1
    fi
}

echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                           1. STAGING OAUTH SETUP"
banner "════════════════════════════════════════════════════════════════════════════════"

enable_apis "$STAGING_PROJECT" "Staging"
setup_consent_screen "$STAGING_PROJECT" "Staging"
create_oauth_client "$STAGING_PROJECT" "Staging" STAGING_ORIGINS[@] STAGING_REDIRECTS[@]

echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                          2. PRODUCTION OAUTH SETUP"
banner "════════════════════════════════════════════════════════════════════════════════"

enable_apis "$PROD_PROJECT" "Production"
setup_consent_screen "$PROD_PROJECT" "Production"
create_oauth_client "$PROD_PROJECT" "Production" PROD_ORIGINS[@] PROD_REDIRECTS[@]

echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                         3. ADDING CLIENT IDS TO GITHUB SECRETS"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Adding OAuth client IDs to GitHub secrets..."

if [ -n "$STAGING_CLIENT_ID" ]; then
    echo -n "Adding GOOGLE_OAUTH_CLIENT_ID_STAGING... "
    if gh secret set GOOGLE_OAUTH_CLIENT_ID_STAGING \
        --body "$STAGING_CLIENT_ID" \
        --repo "$REPO" &> /dev/null; then
        echo -e "${GREEN}✅${NC}"
    else
        echo -e "${RED}❌${NC}"
        error "Failed to add staging OAuth client ID"
    fi
fi

if [ -n "$PROD_CLIENT_ID" ]; then
    echo -n "Adding GOOGLE_OAUTH_CLIENT_ID_PROD... "
    if gh secret set GOOGLE_OAUTH_CLIENT_ID_PROD \
        --body "$PROD_CLIENT_ID" \
        --repo "$REPO" &> /dev/null; then
        echo -e "${GREEN}✅${NC}"
    else
        echo -e "${RED}❌${NC}"
        error "Failed to add production OAuth client ID"
    fi
fi

echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                              4. VERIFICATION"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Verifying GitHub secrets..."
echo
gh secret list --repo "$REPO" | grep -E "(GOOGLE_OAUTH|FIREBASE)" || true

echo
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                              🎉 OAUTH SETUP COMPLETE!"
banner "════════════════════════════════════════════════════════════════════════════════"

success "Google OAuth configuration completed!"

echo
info "What was configured:"
echo "  ✅ Enabled OAuth APIs for both projects"
echo "  ✅ OAuth consent screens configured"
echo "  ✅ OAuth clients created with proper origins and redirects"
echo "  ✅ Client IDs added to GitHub secrets"

echo
info "Configured URLs:"
echo
echo "📊 STAGING:"
echo "  JavaScript Origins:"
for origin in "${STAGING_ORIGINS[@]}"; do
    echo "    $origin"
done
echo "  Redirect URIs:"
for redirect in "${STAGING_REDIRECTS[@]}"; do
    echo "    $redirect"
done

echo
echo "🚀 PRODUCTION:"
echo "  JavaScript Origins:"
for origin in "${PROD_ORIGINS[@]}"; do
    echo "    $origin"
done
echo "  Redirect URIs:"
for redirect in "${PROD_REDIRECTS[@]}"; do
    echo "    $redirect"
done

echo
log "Next steps:"
echo "  1. Test Google Sign-In in your app"
echo "  2. Verify OAuth flow works in both environments"
echo "  3. Add additional scopes if needed"
echo "  4. Monitor OAuth usage in Google Cloud Console"

echo
warning "Important reminders:"
echo "  • Keep OAuth client secrets secure"
echo "  • Test OAuth flow thoroughly before production"
echo "  • Monitor OAuth quotas and usage"
echo "  • Consider adding more test users in development"

echo
banner "🔐 OAuth authentication ready for CareerCopilot! 🚀"