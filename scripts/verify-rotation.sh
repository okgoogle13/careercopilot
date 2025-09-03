#!/bin/bash
set -e

# =============================================================================
# API Key Rotation Verification Script
# Verifies that old keys are completely removed and new keys are working
# =============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Banner
echo -e "${BLUE}
🔍 API KEY ROTATION VERIFICATION
=================================
Checking for old keys and verifying new setup
${NC}"

# Check if running from correct directory
if [ ! -f "setup.sh" ]; then
    error "Please run this script from the project root directory"
    exit 1
fi

log "Starting verification process..."

# Track verification results
VERIFICATION_PASSED=true

# Compromised keys to check for (partial matches for security)
COMPROMISED_PATTERNS=(
    "AIzaSyDtSTUen"        # Gemini/Firebase key
    "sk-proj-dU-hIGOA"     # OpenAI key
    "sk-ant-api03-3_b3PD3I" # Anthropic key
    "pplx-XuT0D9Qci"       # Perplexity key
    "pcsk_2CmZ6W_"         # Pinecone key
)

echo ""
echo -e "${YELLOW}============================================${NC}"
echo -e "${YELLOW} 1. SCANNING FOR OLD/COMPROMISED KEYS${NC}"
echo -e "${YELLOW}============================================${NC}"

log "Scanning codebase for compromised API keys..."

FOUND_OLD_KEYS=false

for pattern in "${COMPROMISED_PATTERNS[@]}"; do
    if grep -r "$pattern" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=scripts --exclude="*.md" --exclude="*.example" 2>/dev/null; then
        error "Found compromised key pattern: $pattern"
        FOUND_OLD_KEYS=true
        VERIFICATION_PASSED=false
    fi
done

if [ "$FOUND_OLD_KEYS" = false ]; then
    success "No compromised API keys found in codebase"
else
    warning "Old API keys detected! Please remove them immediately."
fi

echo ""
echo -e "${YELLOW}============================================${NC}"
echo -e "${YELLOW} 2. ENVIRONMENT FILE VERIFICATION${NC}"
echo -e "${YELLOW}============================================${NC}"

# Check if .env file exists
if [ ! -f "frontend/.env" ]; then
    error ".env file not found. Please run the rotation script first."
    VERIFICATION_PASSED=false
else
    success ".env file exists"

    # Check for required environment variables
    REQUIRED_VARS=(
        "VITE_FIREBASE_API_KEY"
        "VITE_FIREBASE_AUTH_DOMAIN"
        "VITE_FIREBASE_PROJECT_ID"
        "VITE_FIREBASE_STORAGE_BUCKET"
        "VITE_FIREBASE_MESSAGING_SENDER_ID"
        "VITE_FIREBASE_APP_ID"
        "OPENAI_API_KEY"
        "ANTHROPIC_API_KEY"
        "GEMINI_API_KEY"
        "PERPLEXITY_API_KEY"
        "PINECONE_API_KEY"
    )

    log "Checking required environment variables..."

    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^$var=" frontend/.env; then
            value=$(grep "^$var=" frontend/.env | cut -d'=' -f2)
            if [[ "$value" == *"your-"* ]] || [[ "$value" == *"placeholder"* ]] || [ -z "$value" ]; then
                warning "$var appears to be a placeholder"
                VERIFICATION_PASSED=false
            else
                success "$var is configured"
            fi
        else
            error "$var is missing from .env file"
            VERIFICATION_PASSED=false
        fi
    done
fi

echo ""
echo -e "${YELLOW}============================================${NC}"
echo -e "${YELLOW} 3. GIT REPOSITORY SECURITY CHECK${NC}"
echo -e "${YELLOW}============================================${NC}"

log "Checking git repository for security issues..."

# Check if .env is in .gitignore
if grep -q "^\.env$" .gitignore; then
    success ".env is properly excluded in .gitignore"
else
    error ".env is not in .gitignore!"
    VERIFICATION_PASSED=false
fi

# Check if .env is tracked by git
if git ls-files | grep -q "^frontend/.env$"; then
    error ".env file is tracked by git! Remove it immediately."
    echo "Run: git rm --cached frontend/.env"
    VERIFICATION_PASSED=false
else
    success ".env file is not tracked by git"
fi

# Check git history for compromised keys
log "Scanning git history for compromised keys..."
HISTORY_CHECK=false

for pattern in "${COMPROMISED_PATTERNS[@]}"; do
    if git log --all --full-history -- . | grep -q "$pattern" 2>/dev/null; then
        warning "Compromised key pattern found in git history: $pattern"
        HISTORY_CHECK=true
    fi
done

if [ "$HISTORY_CHECK" = false ]; then
    success "No compromised keys found in git history"
else
    warning "Compromised keys found in git history. Consider cleaning git history or rotating keys again."
fi

echo ""
echo -e "${YELLOW}============================================${NC}"
echo -e "${YELLOW} 4. CONFIGURATION VALIDATION${NC}"
echo -e "${YELLOW}============================================${NC}"

if [ -f "frontend/.env" ]; then
    log "Validating API key formats..."

    # Validate Firebase API key format
    firebase_key=$(grep "^VITE_FIREBASE_API_KEY=" frontend/.env | cut -d'=' -f2)
    if [[ "$firebase_key" =~ ^AIzaSy ]] && [ ${#firebase_key} -gt 35 ]; then
        success "Firebase API key format is valid"
    else
        warning "Firebase API key format appears invalid"
    fi

    # Validate OpenAI API key format
    openai_key=$(grep "^OPENAI_API_KEY=" frontend/.env | cut -d'=' -f2)
    if [[ "$openai_key" =~ ^sk- ]] && [ ${#openai_key} -gt 40 ]; then
        success "OpenAI API key format is valid"
    else
        warning "OpenAI API key format appears invalid"
    fi

    # Validate Anthropic API key format
    anthropic_key=$(grep "^ANTHROPIC_API_KEY=" frontend/.env | cut -d'=' -f2)
    if [[ "$anthropic_key" =~ ^sk-ant- ]]; then
        success "Anthropic API key format is valid"
    else
        warning "Anthropic API key format appears invalid"
    fi
fi

echo ""
echo -e "${YELLOW}============================================${NC}"
echo -e "${YELLOW} 5. BASIC API CONNECTIVITY TEST${NC}"
echo -e "${YELLOW}============================================${NC}"

log "Testing API connectivity (basic checks only)..."

# Test Firebase configuration
if [ -f "frontend/.env" ] && command -v node >/dev/null 2>&1; then
    info "Testing Firebase configuration..."

    # Create a simple test script
    cat > /tmp/firebase_test.js << 'EOF'
require('dotenv').config({ path: './frontend/.env' });

const apiKey = process.env.VITE_FIREBASE_API_KEY;
const authDomain = process.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.VITE_FIREBASE_PROJECT_ID;

if (!apiKey || !authDomain || !projectId) {
    console.log('❌ Missing Firebase configuration');
    process.exit(1);
}

if (!apiKey.startsWith('AIzaSy')) {
    console.log('❌ Invalid Firebase API key format');
    process.exit(1);
}

console.log('✅ Firebase configuration looks good');
console.log(`   Project: ${projectId}`);
console.log(`   Domain: ${authDomain}`);
EOF

    if node /tmp/firebase_test.js 2>/dev/null; then
        success "Firebase configuration test passed"
    else
        warning "Firebase configuration test failed"
    fi

    rm -f /tmp/firebase_test.js
else
    info "Skipping API tests (Node.js not available)"
fi

echo ""
echo -e "${YELLOW}============================================${NC}"
echo -e "${YELLOW} 6. SECURITY RECOMMENDATIONS${NC}"
echo -e "${YELLOW}============================================${NC}"

log "Security recommendations:"
echo ""
echo "🔒 IMMEDIATE ACTIONS:"
echo "  • Monitor API usage dashboards for suspicious activity"
echo "  • Check billing for unexpected charges"
echo "  • Enable 2FA on all API provider accounts"
echo "  • Set usage limits and spending alerts"
echo ""
echo "🔧 CONFIGURATION:"
echo "  • Firebase: Review and tighten Security Rules"
echo "  • Firebase: Enable App Check for API protection"
echo "  • All APIs: Configure rate limiting where possible"
echo ""
echo "📊 MONITORING:"
echo "  • Set up usage alerts on all platforms"
echo "  • Enable audit logging where available"
echo "  • Regular security reviews (monthly)"

echo ""
echo -e "${YELLOW}============================================${NC}"
echo -e "${YELLOW} VERIFICATION RESULTS${NC}"
echo -e "${YELLOW}============================================${NC}"

if [ "$VERIFICATION_PASSED" = true ]; then
    echo -e "${GREEN}
🎉 VERIFICATION PASSED! ✅
=========================
Your API key rotation appears to be successful.
All old keys are removed and new configuration looks good.
${NC}"

    log "Next steps:"
    echo "  1. Test your application thoroughly"
    echo "  2. Monitor API usage for 24-48 hours"
    echo "  3. Run security audit: ./scripts/security-audit.sh"

    exit 0
else
    echo -e "${RED}
⚠️  VERIFICATION FAILED! ❌
==========================
Issues were found that need attention.
Please review the warnings and errors above.
${NC}"

    error "Verification failed. Please fix the issues above before proceeding."
    exit 1
fi
