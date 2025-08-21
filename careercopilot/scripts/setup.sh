#!/bin/bash

# =============================================================================
# Setup Script for CareerCopilot Security Tools
# One-time setup to prepare the security environment
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

clear
banner "
╔══════════════════════════════════════════════════════════════════════════════╗
║                        🔧 SECURITY TOOLS SETUP                             ║
║                       CareerCopilot Initial Configuration                   ║
╚══════════════════════════════════════════════════════════════════════════════╝
"

log "Setting up CareerCopilot security tools..."

# Create necessary directories
log "Creating directory structure..."
mkdir -p backups
mkdir -p logs
success "Directory structure created"

# Ensure scripts are executable
log "Making scripts executable..."
chmod +x scripts/*.sh
success "Scripts are now executable"

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    log "Creating .gitignore file..."
    cat > .gitignore << 'EOF'
# Environment variables
.env
.env.local
.env.production
frontend/.env
backend/.env

# Dependencies
node_modules/
__pycache__/
*.pyc

# Build outputs
dist/
build/
.next/

# Logs
logs/
*.log

# Security
security-audit-*.txt
backups/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Temporary files
*.tmp
*.temp
EOF
    success ".gitignore created"
else
    log "Checking .gitignore for security patterns..."
    
    # Add missing patterns
    patterns=(".env" "frontend/.env" "backend/.env" "security-audit-*.txt" "backups/")
    for pattern in "${patterns[@]}"; do
        if ! grep -q "$pattern" .gitignore; then
            echo "$pattern" >> .gitignore
            info "Added $pattern to .gitignore"
        fi
    done
    
    success ".gitignore updated"
fi

# Check for GitHub CLI
log "Checking prerequisites..."
if command -v gh >/dev/null 2>&1; then
    success "GitHub CLI (gh) is installed"
    if gh auth status >/dev/null 2>&1; then
        success "GitHub CLI is authenticated"
    else
        warning "GitHub CLI is not authenticated. Run: gh auth login"
    fi
else
    warning "GitHub CLI not installed. Install with: brew install gh"
fi

# Check for Node.js
if command -v node >/dev/null 2>&1; then
    success "Node.js is available"
else
    warning "Node.js not found. Some tests may be skipped."
fi

# Create initial security report
log "Running initial security status check..."
./scripts/security-manager.sh &
sleep 2
kill $! 2>/dev/null || true

echo ""
banner "╔══════════════════════════════════════════════════════════════════════════════╗"
banner "║                           🎉 SETUP COMPLETE! 🎉                            ║"
banner "╚══════════════════════════════════════════════════════════════════════════════╝"

echo ""
success "Security tools are ready to use!"

echo ""
info "Next steps:"
echo "1. Run: ./scripts/security-manager.sh"
echo "2. Choose option 6 to check current security status"
echo "3. If you need to rotate API keys, choose option 1"

echo ""
info "Available commands:"
echo "• ./scripts/security-manager.sh     - Interactive menu"
echo "• ./scripts/rotate-api-keys.sh      - Rotate API keys"
echo "• ./scripts/verify-rotation.sh      - Verify rotation"
echo "• ./scripts/security-audit.sh       - Run security audit"
echo "• ./scripts/update-github-secrets.sh - Update GitHub secrets"

echo ""
warning "Important reminders:"
echo "• Never commit .env files to git"
echo "• Enable 2FA on all service accounts"
echo "• Monitor API usage and billing"
echo "• Run security audits monthly"

echo ""
log "🛡️  Your CareerCopilot project is now secured! Happy coding!"
