#!/bin/bash
set -e

# =============================================================================
# API Key Rotation Script
# Automates the process of rotating compromised API keys
# =============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠️  WARNING:${NC} $1"
}

error() {
    echo -e "${RED}❌ ERROR:${NC} $1"
}

info() {
    echo -e "${BLUE}ℹ️  INFO:${NC} $1"
}

# Banner
echo -e "${RED}
🚨 API KEY ROTATION SCRIPT 🚨
===============================
This script helps rotate all compromised API keys
${NC}"

# Check if running from correct directory
if [ ! -f "setup.sh" ]; then
    error "Please run this script from the project root directory"
    exit 1
fi

log "Starting API key rotation process..."

# Create backup of current environment
if [ -f "frontend/.env" ]; then
    warning "Backing up existing .env file"
    cp frontend/.env frontend/.env.backup.$(date +%Y%m%d_%H%M%S)
fi

# Function to open URLs based on OS
open_url() {
    if command -v xdg-open > /dev/null; then
        xdg-open "$1"
    elif command -v open > /dev/null; then
        open "$1"
    else
        echo "Please open this URL manually: $1"
    fi
}

# Function to prompt for new API key
prompt_for_key() {
    local service_name=$1
    local env_var_name=$2
    local validation_pattern=$3
    
    echo ""
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE} $service_name API Key Rotation${NC}"
    echo -e "${BLUE}============================================${NC}"
    
    while true; do
        echo -n "Enter your new $service_name API key: "
        read -s new_key
        echo
        
        if [[ -z "$new_key" ]]; then
            warning "API key cannot be empty. Please try again."
            continue
        fi
        
        if [[ -n "$validation_pattern" ]] && ! [[ "$new_key" =~ $validation_pattern ]]; then
            warning "Invalid API key format. Please check and try again."
            continue
        fi
        
        echo -n "Confirm the API key (type again): "
        read -s confirm_key
        echo
        
        if [ "$new_key" = "$confirm_key" ]; then
            echo "$env_var_name=$new_key" >> frontend/.env.tmp
            log "✅ $service_name API key added successfully"
            break
        else
            warning "API keys don't match. Please try again."
        fi
    done
}

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
echo -e "${YELLOW}1. FIREBASE API KEY ROTATION${NC}"
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

prompt_for_key "Firebase" "VITE_FIREBASE_API_KEY" "^AIzaSy"

# Add other Firebase config
echo ""
echo "Please provide other Firebase configuration details:"
echo -n "Firebase Auth Domain (e.g., project-id.firebaseapp.com): "
read auth_domain
echo "VITE_FIREBASE_AUTH_DOMAIN=$auth_domain" >> frontend/.env.tmp

echo -n "Firebase Project ID: "
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
echo -e "${YELLOW}2. OPENAI API KEY ROTATION${NC}"
echo "Opening OpenAI Platform..."
open_url "https://platform.openai.com/api-keys"

echo ""
warning "Actions required in OpenAI Platform:"
echo "1. Delete the compromised key: sk-proj-dU-hIGOAQDp..."
echo "2. Create a new secret key"
echo "3. Set usage limits and monitoring"
echo ""
read -p "Press Enter when you've revoked the old key and are ready to enter the new one..."

prompt_for_key "OpenAI" "OPENAI_API_KEY" "^sk-"

# 3. Anthropic
echo ""
echo -e "${YELLOW}3. ANTHROPIC API KEY ROTATION${NC}"
echo "Opening Anthropic Console..."
open_url "https://console.anthropic.com/"

echo ""
warning "Actions required in Anthropic Console:"
echo "1. Delete the compromised key: sk-ant-api03-3_b3PD3I..."
echo "2. Generate a new API key"
echo "3. Configure usage limits"
echo ""
read -p "Press Enter when you've revoked the old key and are ready to enter the new one..."

prompt_for_key "Anthropic" "ANTHROPIC_API_KEY" "^sk-ant-"

# 4. Google/Gemini
echo ""
echo -e "${YELLOW}4. GOOGLE/GEMINI API KEY ROTATION${NC}"
echo "Opening Google Cloud Console..."
open_url "https://console.cloud.google.com/apis/credentials"

echo ""
warning "Actions required in Google Cloud Console:"
echo "1. Delete the compromised API key: AIzaSyDtSTUen..."
echo "2. Create a new API key"
echo "3. Restrict the key to necessary APIs only"
echo "4. Set quotas and monitoring"
echo ""
read -p "Press Enter when you've revoked the old key and are ready to enter the new one..."

prompt_for_key "Google/Gemini" "GEMINI_API_KEY" "^AIzaSy"

# 5. Perplexity
echo ""
echo -e "${YELLOW}5. PERPLEXITY API KEY ROTATION${NC}"
echo "Opening Perplexity Settings..."
open_url "https://www.perplexity.ai/settings/api"

echo ""
warning "Actions required in Perplexity:"
echo "1. Revoke the compromised key: pplx-XuT0D9Qci..."
echo "2. Generate a new API key"
echo ""
read -p "Press Enter when you've revoked the old key and are ready to enter the new one..."

prompt_for_key "Perplexity" "PERPLEXITY_API_KEY" "^pplx-"

# 6. Pinecone
echo ""
echo -e "${YELLOW}6. PINECONE API KEY ROTATION${NC}"
echo "Opening Pinecone Console..."
open_url "https://app.pinecone.io/"

echo ""
warning "Actions required in Pinecone Console:"
echo "1. Delete the compromised key: pcsk_2CmZ6W_..."
echo "2. Create a new API key"
echo "3. Configure usage limits"
echo ""
read -p "Press Enter when you've revoked the old key and are ready to enter the new one..."

prompt_for_key "Pinecone" "PINECONE_API_KEY" "^pcsk_"

# Add optional environment variables
echo ""
echo -e "${BLUE}Adding optional environment variables...${NC}"
echo "VITE_ENV=development" >> frontend/.env.tmp
echo "VITE_DEBUG_FIREBASE=false" >> frontend/.env.tmp

# Finalize the environment file
if [ -f "frontend/.env.tmp" ]; then
    mv frontend/.env.tmp frontend/.env
    log "✅ New .env file created successfully"
else
    error "Failed to create new .env file"
    exit 1
fi

# Security reminders
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}   API KEY ROTATION COMPLETED! ✅${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

log "🔒 Security checklist:"
echo "  ✅ All old API keys should be revoked"
echo "  ✅ New API keys configured in .env"
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

echo ""
warning "IMPORTANT: Keep your .env file secure and never commit it to version control!"

log "🎉 API key rotation process completed!"