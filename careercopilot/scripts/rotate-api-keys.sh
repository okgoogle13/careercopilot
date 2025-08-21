#!/bin/bash
set -e

# =============================================================================
# API Key Rotation Script
# Automates the process of rotating compromised API keys across all services
# =============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

# Function to open URLs (cross-platform)
open_url() {
    if command -v open >/dev/null 2>&1; then
        open "$1"
    elif command -v xdg-open >/dev/null 2>&1; then
        xdg-open "$1"
    elif command -v start >/dev/null 2>&1; then
        start "$1"
    else
        info "Please open this URL manually: $1"
    fi
}

# Function to prompt for API keys with validation
prompt_for_key() {
    local service_name="$1"
    local env_var_name="$2"
    local pattern="$3"
    local description="$4"
    
    while true; do
        echo ""
        echo -e "${CYAN}🔑 Enter $service_name API Key${NC}"
        if [ -n "$description" ]; then
            info "$description"
        fi
        echo -n "Key: "
        read -s new_key
        echo ""
        
        # Validate key format
        if [[ ! "$new_key" =~ $pattern ]]; then
            warning "Invalid key format for $service_name. Expected pattern: $pattern"
            continue
        fi
        
        # Confirm key
        echo -n "Confirm key: "
        read -s confirm_key
        echo ""
        
        if [ "$new_key" = "$confirm_key" ]; then
            echo "$env_var_name=$new_key" >> frontend/.env.tmp
            log "✅ $service_name API key added successfully"
            break
        else
            warning "API keys don't match. Please try again."
        fi
    done
}

# Function to backup existing environment files
backup_env_files() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="backups/env_$timestamp"
    
    log "Creating backup of existing environment files..."
    mkdir -p "$backup_dir"
    
    if [ -f "frontend/.env" ]; then
        cp "frontend/.env" "$backup_dir/.env.frontend"
        success "Frontend .env backed up to $backup_dir"
    fi
    
    if [ -f "backend/.env" ]; then
        cp "backend/.env" "$backup_dir/.env.backend"
        success "Backend .env backed up to $backup_dir"
    fi
    
    echo "$backup_dir" > .last_backup_location
}

# Function to validate project structure
validate_project() {
    log "Validating project structure..."
    
    if [ ! -d "scripts" ] && [ ! -f "firestore.rules" ] && [ ! -f "package.json" ] && [ ! -f "frontend/package.json" ]; then
        error "Not in a valid careercopilot project directory"
        exit 1
    fi
    
    if [ ! -d "frontend" ]; then
        mkdir -p frontend
        info "Created frontend directory"
    fi
    
    if [ ! -d "backend" ]; then
        mkdir -p backend
        info "Created backend directory"
    fi
    
    success "Project structure validated"
}

# Main script banner
clear
banner "
╔══════════════════════════════════════════════════════════════════════════════╗
║                           🔄 API KEY ROTATION                               ║
║                         CareerCopilot Security Tool                         ║
╚══════════════════════════════════════════════════════════════════════════════╝
"

# Validate environment
validate_project

# Create backup
backup_env_files

# Start the rotation process
log "🔄 Beginning API key rotation..."

# Create temporary environment file
echo "# Rotated API Keys - $(date)" > frontend/.env.tmp

echo ""
echo -e "${RED}🚨 CRITICAL: Revoke old keys FIRST before proceeding!${NC}"
echo ""
echo "I will now open the admin consoles for each service."
echo "Please revoke/delete the old keys before entering new ones."
echo ""
read -p "Press Enter to continue..."

# 1. Firebase
echo ""
banner "════════════════════════════════════════════════════════"
banner "                    1. FIREBASE API KEY"
banner "════════════════════════════════════════════════════════"

echo "Opening Firebase Console..."
info "Project: careercopilot-staging"
info "Go to: Project Settings → General → Your apps → Web apps → Config"
open_url "https://console.firebase.google.com/project/careercopilot-staging/settings/general"

echo ""
warning "Actions required in Firebase Console:"
echo "1. Delete/regenerate the web API key"
echo "2. Review and tighten Security Rules"
echo "3. Enable Firebase App Check if not already enabled"
echo ""
read -p "Press Enter when you've revoked the old key and are ready to enter the new one..."

prompt_for_key "Firebase" "VITE_FIREBASE_API_KEY" "^AIzaSy" "Should start with 'AIzaSy' and be ~39 characters"

# Add other Firebase config
echo ""
echo "Please provide other Firebase configuration details:"
echo -n "Firebase Auth Domain (e.g., careercopilot-staging.firebaseapp.com): "
read auth_domain
echo "VITE_FIREBASE_AUTH_DOMAIN=$auth_domain" >> frontend/.env.tmp

echo -n "Firebase Project ID (careercopilot-staging): "
read project_id
echo "VITE_FIREBASE_PROJECT_ID=$project_id" >> frontend/.env.tmp

echo -n "Firebase Storage Bucket: "
read storage_bucket
echo "VITE_FIREBASE_STORAGE_BUCKET=$storage_bucket" >> frontend/.env.tmp

echo -n "Firebase Messaging Sender ID: "
read messaging_id
echo "VITE_FIREBASE_MESSAGING_SENDER_ID=$messaging_id" >> frontend/.env.tmp

echo -n "Firebase App ID: "
read app_id
echo "VITE_FIREBASE_APP_ID=$app_id" >> frontend/.env.tmp

# 2. OpenAI
echo ""
banner "════════════════════════════════════════════════════════"
banner "                    2. OPENAI API KEY"
banner "════════════════════════════════════════════════════════"

echo "Opening OpenAI Platform..."
open_url "https://platform.openai.com/api-keys"

echo ""
warning "Actions required in OpenAI Platform:"
echo "1. Delete any compromised keys"
echo "2. Create a new secret key"
echo "3. Set usage limits and monitoring"
echo "4. Configure spending limits"
echo ""
read -p "Press Enter when you've revoked the old key and are ready to enter the new one..."

prompt_for_key "OpenAI" "OPENAI_API_KEY" "^sk-" "Should start with 'sk-' and be ~50+ characters"

# 3. Anthropic
echo ""
banner "════════════════════════════════════════════════════════"
banner "                   3. ANTHROPIC API KEY"
banner "════════════════════════════════════════════════════════"

echo "Opening Anthropic Console..."
open_url "https://console.anthropic.com/"

echo ""
warning "Actions required in Anthropic Console:"
echo "1. Delete any compromised keys"
echo "2. Generate a new API key"
echo "3. Configure usage limits"
echo ""
read -p "Press Enter when you've revoked the old key and are ready to enter the new one..."

prompt_for_key "Anthropic" "ANTHROPIC_API_KEY" "^sk-ant-" "Should start with 'sk-ant-api' and be ~100+ characters"

# 4. Google/Gemini
echo ""
banner "════════════════════════════════════════════════════════"
banner "                  4. GOOGLE/GEMINI API KEY"
banner "════════════════════════════════════════════════════════"

echo "Opening Google Cloud Console..."
open_url "https://console.cloud.google.com/apis/credentials?project=careercopilot-staging"

echo ""
warning "Actions required in Google Cloud Console:"
echo "1. Delete any compromised API keys"
echo "2. Create a new API key"
echo "3. Restrict the key to necessary APIs only (Gemini, Firebase)"
echo "4. Set quotas and monitoring"
echo ""
read -p "Press Enter when you've revoked the old key and are ready to enter the new one..."

prompt_for_key "Google/Gemini" "GEMINI_API_KEY" "^AIzaSy" "Should start with 'AIzaSy' and be ~39 characters"

# 5. Perplexity (Optional)
echo ""
banner "════════════════════════════════════════════════════════"
banner "                  5. PERPLEXITY API KEY"
banner "════════════════════════════════════════════════════════"

echo -n "Do you use Perplexity AI API? (y/n): "
read use_perplexity

if [ "$use_perplexity" = "y" ] || [ "$use_perplexity" = "Y" ]; then
    echo "Opening Perplexity Settings..."
    open_url "https://www.perplexity.ai/settings/api"

    echo ""
    warning "Actions required in Perplexity:"
    echo "1. Revoke any compromised keys"
    echo "2. Generate a new API key"
    echo ""
    read -p "Press Enter when you've revoked the old key and are ready to enter the new one..."

    prompt_for_key "Perplexity" "PERPLEXITY_API_KEY" "^pplx-" "Should start with 'pplx-'"
fi

# 6. Pinecone (Optional)
echo ""
banner "════════════════════════════════════════════════════════"
banner "                    6. PINECONE API KEY"
banner "════════════════════════════════════════════════════════"

echo -n "Do you use Pinecone vector database? (y/n): "
read use_pinecone

if [ "$use_pinecone" = "y" ] || [ "$use_pinecone" = "Y" ]; then
    echo "Opening Pinecone Console..."
    open_url "https://app.pinecone.io/"

    echo ""
    warning "Actions required in Pinecone Console:"
    echo "1. Delete any compromised keys"
    echo "2. Create a new API key"
    echo "3. Configure usage limits"
    echo ""
    read -p "Press Enter when you've revoked the old key and are ready to enter the new one..."

    prompt_for_key "Pinecone" "PINECONE_API_KEY" "^pcsk_" "Should start with 'pcsk_'"
fi

# Add environment configuration
echo ""
echo -e "${BLUE}Adding environment configuration...${NC}"
echo "VITE_ENV=development" >> frontend/.env.tmp
echo "VITE_DEBUG_FIREBASE=false" >> frontend/.env.tmp
echo "VITE_API_BASE_URL=http://localhost:8000" >> frontend/.env.tmp

# Backend environment variables
echo ""
echo -e "${BLUE}Creating backend environment file...${NC}"
echo "# Backend Environment Variables - $(date)" > backend/.env.tmp
echo "ENVIRONMENT=development" >> backend/.env.tmp
echo "DEBUG=false" >> backend/.env.tmp
echo "CORS_ORIGINS=http://localhost:3000,https://careercopilot-staging.web.app" >> backend/.env.tmp

# Copy API keys to backend as well
if grep -q "OPENAI_API_KEY" frontend/.env.tmp; then
    grep "OPENAI_API_KEY" frontend/.env.tmp >> backend/.env.tmp
fi
if grep -q "ANTHROPIC_API_KEY" frontend/.env.tmp; then
    grep "ANTHROPIC_API_KEY" frontend/.env.tmp >> backend/.env.tmp
fi
if grep -q "GEMINI_API_KEY" frontend/.env.tmp; then
    grep "GEMINI_API_KEY" frontend/.env.tmp >> backend/.env.tmp
fi

# Finalize the environment files
if [ -f "frontend/.env.tmp" ]; then
    mv frontend/.env.tmp frontend/.env
    log "✅ Frontend .env file created successfully"
else
    error "Failed to create frontend .env file"
    exit 1
fi

if [ -f "backend/.env.tmp" ]; then
    mv backend/.env.tmp backend/.env
    log "✅ Backend .env file created successfully"
else
    warning "Backend .env file creation failed"
fi

# Update .gitignore to ensure .env files are ignored
echo ""
log "Updating .gitignore to protect environment files..."

if [ ! -f ".gitignore" ]; then
    touch .gitignore
fi

# Add .env patterns if not already present
grep -q "\.env$" .gitignore || echo ".env" >> .gitignore
grep -q "\.env\.local$" .gitignore || echo ".env.local" >> .gitignore
grep -q "\.env\.production$" .gitignore || echo ".env.production" >> .gitignore
grep -q "frontend/\.env" .gitignore || echo "frontend/.env" >> .gitignore
grep -q "backend/\.env" .gitignore || echo "backend/.env" >> .gitignore

success ".gitignore updated to protect environment files"

# Security reminders
echo ""
banner "╔══════════════════════════════════════════════════════════════════════════════╗"
banner "║                        API KEY ROTATION COMPLETED! ✅                       ║"
banner "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

log "🔒 Security checklist:"
echo "  ✅ All old API keys should be revoked"
echo "  ✅ New API keys configured in .env files"
echo "  ✅ .gitignore updated to protect .env files"
echo "  📋 Still needed:"
echo "     • Monitor usage for suspicious activity"
echo "     • Review billing for unexpected charges"
echo "     • Enable 2FA on all accounts"
echo "     • Set usage limits and alerts"
echo "     • Run the verification script"

echo ""
info "Next steps:"
echo "1. Run: ./scripts/verify-rotation.sh"
echo "2. Test your application with new keys"
echo "3. Run: ./scripts/security-audit.sh"
echo "4. Update GitHub Secrets for CI/CD"

echo ""
warning "IMPORTANT: Keep your .env files secure and never commit them to version control!"

log "🎉 API key rotation process completed!"
