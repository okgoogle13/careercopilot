#!/bin/bash
set -e

# =============================================================================
# Master Security Script
# Orchestrates the complete API key rotation and security verification process
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

# Function to run a script with error handling
run_script() {
    local script_name="$1"
    local description="$2"
    local optional="$3"
    
    if [ ! -f "scripts/$script_name" ]; then
        if [ "$optional" = "optional" ]; then
            warning "Optional script $script_name not found, skipping..."
            return 0
        else
            error "Required script $script_name not found!"
            return 1
        fi
    fi
    
    if [ ! -x "scripts/$script_name" ]; then
        chmod +x "scripts/$script_name"
    fi
    
    echo ""
    banner "═══════════════════════════════════════════════════════════════════════════════"
    banner "                         $description"
    banner "═══════════════════════════════════════════════════════════════════════════════"
    
    if "./scripts/$script_name"; then
        success "$description completed successfully"
        return 0
    else
        error "$description failed"
        return 1
    fi
}

# Function to show menu
show_menu() {
    clear
    banner "
╔══════════════════════════════════════════════════════════════════════════════╗
║                        🛡️  CAREERCOPILOT SECURITY                           ║
║                         Master Security Management                          ║
╚══════════════════════════════════════════════════════════════════════════════╝
"
    
    echo ""
    echo "Choose an option:"
    echo ""
    echo "1. 🔄 Full Security Rotation (Recommended)"
    echo "2. 🔑 API Key Rotation Only"
    echo "3. 🔍 Security Verification Only"
    echo "4. 🛡️  Security Audit Only"
    echo "5. 🔐 Update GitHub Secrets Only"
    echo "6. 📋 Show Security Status"
    echo "7. 🚨 Emergency Key Revocation"
    echo "8. ❓ Help & Documentation"
    echo "9. 🚪 Exit"
    echo ""
    echo -n "Enter your choice (1-9): "
}

# Function to show security status
show_security_status() {
    clear
    banner "
╔══════════════════════════════════════════════════════════════════════════════╗
║                           🔍 SECURITY STATUS                                ║
╚══════════════════════════════════════════════════════════════════════════════╝
"
    
    echo ""
    log "Checking current security status..."
    
    # Check environment files
    echo ""
    echo "📁 Environment Files:"
    if [ -f "frontend/.env" ]; then
        success "Frontend .env exists"
        # Count configured variables
        env_vars=$(grep -c "=" frontend/.env 2>/dev/null || echo "0")
        info "  Contains $env_vars environment variables"
    else
        error "Frontend .env missing"
    fi
    
    if [ -f "backend/.env" ]; then
        success "Backend .env exists"
    else
        warning "Backend .env missing (may be optional)"
    fi
    
    # Check .gitignore
    echo ""
    echo "📋 Git Security:"
    if [ -f ".gitignore" ]; then
        if grep -q "\.env" .gitignore; then
            success ".env files protected in .gitignore"
        else
            error ".env files NOT protected in .gitignore"
        fi
    else
        error ".gitignore file missing"
    fi
    
    # Check for tracked sensitive files
    if [ -d ".git" ]; then
        if git ls-files | grep -q "\.env"; then
            error "Environment files are tracked in git!"
        else
            success "No environment files tracked in git"
        fi
    fi
    
    # Check Firestore rules
    echo ""
    echo "🔥 Firebase Security:"
    if [ -f "firestore.rules" ]; then
        success "Firestore security rules exist"
        if grep -q "request.auth != null" firestore.rules; then
            success "Authentication required in Firestore rules"
        else
            warning "Firestore rules may be too permissive"
        fi
    else
        error "Firestore security rules missing"
    fi
    
    # Check for API keys in code
    echo ""
    echo "🔑 API Key Security:"
    if find . -name "*.py" -o -name "*.js" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "AIzaSy\|sk-\|pplx-" 2>/dev/null | grep -v ".env" >/dev/null; then
        error "Hardcoded API keys detected in source code!"
    else
        success "No hardcoded API keys found"
    fi
    
    echo ""
    echo "Press Enter to continue..."
    read
}

# Function to show help
show_help() {
    clear
    banner "
╔══════════════════════════════════════════════════════════════════════════════╗
║                              📖 HELP & DOCUMENTATION                        ║
╚══════════════════════════════════════════════════════════════════════════════╝
"
    
    echo ""
    echo "🔄 FULL SECURITY ROTATION:"
    echo "   Complete process including key rotation, verification, audit, and GitHub secrets update"
    echo "   Recommended when you suspect API keys have been compromised"
    echo ""
    echo "🔑 API KEY ROTATION:"
    echo "   Interactive process to replace all API keys across services"
    echo "   Opens service consoles and guides you through the rotation process"
    echo ""
    echo "🔍 SECURITY VERIFICATION:"
    echo "   Verifies that old keys are removed and new configuration is correct"
    echo "   Checks .env files, git security, and basic API connectivity"
    echo ""
    echo "🛡️  SECURITY AUDIT:"
    echo "   Comprehensive security assessment with scoring"
    echo "   Checks dependencies, Firebase rules, API security, and more"
    echo ""
    echo "🔐 UPDATE GITHUB SECRETS:"
    echo "   Updates repository secrets for CI/CD with new API keys"
    echo "   Requires GitHub CLI (gh) to be installed and authenticated"
    echo ""
    echo "📁 SCRIPT LOCATIONS:"
    echo "   All scripts are in the 'scripts/' directory:"
    echo "   • rotate-api-keys.sh     - API key rotation"
    echo "   • verify-rotation.sh     - Security verification"
    echo "   • security-audit.sh      - Comprehensive audit"
    echo "   • update-github-secrets.sh - GitHub secrets update"
    echo ""
    echo "🚨 EMERGENCY PROCEDURES:"
    echo "   If keys are actively being misused:"
    echo "   1. Immediately revoke all compromised keys in their respective consoles"
    echo "   2. Run the full security rotation"
    echo "   3. Monitor billing and usage for 24-48 hours"
    echo "   4. Consider changing passwords and enabling 2FA on all accounts"
    echo ""
    echo "Press Enter to continue..."
    read
}

# Function for emergency key revocation
emergency_revocation() {
    clear
    banner "
╔══════════════════════════════════════════════════════════════════════════════╗
║                         🚨 EMERGENCY KEY REVOCATION                         ║
╚══════════════════════════════════════════════════════════════════════════════╝
"
    
    echo ""
    error "EMERGENCY PROTOCOL ACTIVATED"
    echo ""
    warning "This will help you quickly revoke compromised keys across all services."
    echo ""
    echo "Press Ctrl+C at any time to exit."
    echo ""
    read -p "Press Enter to continue with emergency revocation..."
    
    # Open all consoles quickly
    echo ""
    log "Opening all service consoles for immediate key revocation..."
    
    # Firebase
    echo "🔥 Opening Firebase Console..."
    open "https://console.firebase.google.com/project/careercopilot-staging/settings/general" 2>/dev/null || true
    
    # OpenAI
    echo "🤖 Opening OpenAI Platform..."
    open "https://platform.openai.com/api-keys" 2>/dev/null || true
    
    # Anthropic
    echo "🧠 Opening Anthropic Console..."
    open "https://console.anthropic.com/" 2>/dev/null || true
    
    # Google Cloud
    echo "☁️  Opening Google Cloud Console..."
    open "https://console.cloud.google.com/apis/credentials?project=careercopilot-staging" 2>/dev/null || true
    
    # GitHub
    echo "🐙 Opening GitHub Repository Settings..."
    open "https://github.com/okgoogle13/careercopilot/settings/secrets/actions" 2>/dev/null || true
    
    echo ""
    warning "IMMEDIATE ACTIONS REQUIRED:"
    echo "1. 🔥 Firebase: Delete/regenerate API keys"
    echo "2. 🤖 OpenAI: Revoke compromised keys immediately"
    echo "3. 🧠 Anthropic: Delete old API keys"
    echo "4. ☁️  Google: Revoke compromised API keys"
    echo "5. 🐙 GitHub: Update repository secrets"
    echo ""
    echo "After revoking all keys, run the full rotation process."
    echo ""
    read -p "Press Enter when you've completed the revocation process..."
}

# Main menu loop
while true; do
    show_menu
    read choice
    
    case $choice in
        1)
            # Full Security Rotation
            clear
            banner "
╔══════════════════════════════════════════════════════════════════════════════╗
║                          🔄 FULL SECURITY ROTATION                          ║
╚══════════════════════════════════════════════════════════════════════════════╝
"
            echo ""
            warning "This will perform a complete security rotation process:"
            echo "1. API Key Rotation"
            echo "2. Security Verification"
            echo "3. Security Audit"
            echo "4. GitHub Secrets Update"
            echo ""
            echo -n "Are you sure you want to continue? (y/n): "
            read confirm
            
            if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
                # Run all scripts in sequence
                run_script "rotate-api-keys.sh" "API KEY ROTATION" || continue
                run_script "verify-rotation.sh" "SECURITY VERIFICATION" || continue
                run_script "security-audit.sh" "SECURITY AUDIT" || continue
                run_script "update-github-secrets.sh" "GITHUB SECRETS UPDATE" "optional"
                
                echo ""
                banner "╔══════════════════════════════════════════════════════════════════════════════╗"
                banner "║                     🎉 FULL ROTATION COMPLETED! 🎉                          ║"
                banner "╚══════════════════════════════════════════════════════════════════════════════╝"
                echo ""
                success "All security processes completed successfully!"
                echo ""
                read -p "Press Enter to continue..."
            fi
            ;;
        2)
            # API Key Rotation Only
            run_script "rotate-api-keys.sh" "API KEY ROTATION"
            read -p "Press Enter to continue..."
            ;;
        3)
            # Security Verification Only
            run_script "verify-rotation.sh" "SECURITY VERIFICATION"
            read -p "Press Enter to continue..."
            ;;
        4)
            # Security Audit Only
            run_script "security-audit.sh" "SECURITY AUDIT"
            read -p "Press Enter to continue..."
            ;;
        5)
            # Update GitHub Secrets Only
            run_script "update-github-secrets.sh" "GITHUB SECRETS UPDATE"
            read -p "Press Enter to continue..."
            ;;
        6)
            # Show Security Status
            show_security_status
            ;;
        7)
            # Emergency Key Revocation
            emergency_revocation
            ;;
        8)
            # Help & Documentation
            show_help
            ;;
        9)
            # Exit
            echo ""
            log "Goodbye! Stay secure! 🛡️"
            exit 0
            ;;
        *)
            error "Invalid choice. Please enter a number between 1-9."
            sleep 2
            ;;
    esac
done
