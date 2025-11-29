#!/bin/bash

# CareerCopilot Secure Credential Setup
# This script sets up secure environment-based credential management

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root for security reasons"
   exit 1
fi

log "Setting up secure credential management for CareerCopilot"

# Create secure credentials directory
SECURE_DIR="$HOME/.careercopilot"
mkdir -p "$SECURE_DIR"
chmod 700 "$SECURE_DIR"

# Create secure environment file
ENV_FILE="$SECURE_DIR/credentials.env"
if [[ ! -f "$ENV_FILE" ]]; then
    log "Creating secure environment file: $ENV_FILE"
    cat > "$ENV_FILE" << 'EOF'
# CareerCopilot Secure Credentials
# This file should be kept secure and never committed to version control

# AI Service API Keys
export OPENAI_API_KEY=""
export ANTHROPIC_API_KEY=""
export GEMINI_API_KEY=""

# Firebase Configuration
export FIREBASE_PROJECT_ID="careercopilot-468811"
export GOOGLE_CLOUD_PROJECT="careercopilot-468811"
export GOOGLE_APPLICATION_CREDENTIALS_JSON=""

# Database Credentials
export DB_PASSWORD=""
export REDIS_PASSWORD=""

# Security Keys
export JWT_SECRET_KEY=""

# Instructions:
# 1. Fill in your actual API keys and credentials above
# 2. Source this file before running the application: source ~/.careercopilot/credentials.env
# 3. Or add to your shell profile: echo "source ~/.careercopilot/credentials.env" >> ~/.bashrc
EOF
    chmod 600 "$ENV_FILE"
    success "Created secure credentials file at $ENV_FILE"
    warn "Please edit $ENV_FILE and add your actual credentials"
else
    log "Credentials file already exists at $ENV_FILE"
fi

# Create loading script
LOAD_SCRIPT="$SECURE_DIR/load-credentials.sh"
cat > "$LOAD_SCRIPT" << 'EOF'
#!/bin/bash
# CareerCopilot Credential Loader
# Source this script to load credentials into your environment

CRED_FILE="$HOME/.careercopilot/credentials.env"

if [[ -f "$CRED_FILE" ]]; then
    source "$CRED_FILE"
    echo "✅ CareerCopilot credentials loaded"
else
    echo "❌ Credentials file not found: $CRED_FILE"
    echo "Run setup-secure-credentials.sh first"
    exit 1
fi

# Verify required credentials
missing_creds=()
[[ -z "${OPENAI_API_KEY:-}" ]] && missing_creds+=("OPENAI_API_KEY")
[[ -z "${ANTHROPIC_API_KEY:-}" ]] && missing_creds+=("ANTHROPIC_API_KEY")
[[ -z "${GEMINI_API_KEY:-}" ]] && missing_creds+=("GEMINI_API_KEY")

if [[ ${#missing_creds[@]} -gt 0 ]]; then
    echo "⚠️  Missing credentials: ${missing_creds[*]}"
    echo "Please edit $CRED_FILE and add the missing credentials"
fi
EOF
chmod 700 "$LOAD_SCRIPT"
success "Created credential loader at $LOAD_SCRIPT"

# Create production deployment helper
DEPLOY_SCRIPT="$SECURE_DIR/deploy-production.sh"
cat > "$DEPLOY_SCRIPT" << 'EOF'
#!/bin/bash
# CareerCopilot Production Deployment with Secure Credentials

set -euo pipefail

# Load credentials
source "$HOME/.careercopilot/load-credentials.sh"

# Check Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

cd /Applications/careercopilot

echo "🚀 Starting production deployment with secure credentials..."

# Export credentials for Docker Compose
export OPENAI_API_KEY
export ANTHROPIC_API_KEY
export GEMINI_API_KEY
export FIREBASE_PROJECT_ID
export GOOGLE_CLOUD_PROJECT
export GOOGLE_APPLICATION_CREDENTIALS_JSON
export DB_PASSWORD
export REDIS_PASSWORD
export JWT_SECRET_KEY

# Build and deploy
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up -d

echo "✅ Production deployment completed"
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:8000"
echo "📊 Grafana: http://localhost:3000"
EOF
chmod 700 "$DEPLOY_SCRIPT"
success "Created production deployment script at $DEPLOY_SCRIPT"

# Update shell profile
SHELL_PROFILE=""
if [[ -f "$HOME/.bashrc" ]]; then
    SHELL_PROFILE="$HOME/.bashrc"
elif [[ -f "$HOME/.zshrc" ]]; then
    SHELL_PROFILE="$HOME/.zshrc"
fi

if [[ -n "$SHELL_PROFILE" ]]; then
    if ! grep -q "careercopilot/load-credentials.sh" "$SHELL_PROFILE"; then
        log "Adding credential loader to $SHELL_PROFILE"
        echo "" >> "$SHELL_PROFILE"
        echo "# CareerCopilot Credentials" >> "$SHELL_PROFILE"
        echo "alias load-careercopilot='source ~/.careercopilot/load-credentials.sh'" >> "$SHELL_PROFILE"
        success "Added 'load-careercopilot' alias to $SHELL_PROFILE"
    fi
fi

# Create README
README_FILE="$SECURE_DIR/README.md"
cat > "$README_FILE" << 'EOF'
# CareerCopilot Secure Credentials

This directory contains secure credentials for the CareerCopilot application.

## Files

- `credentials.env` - Environment variables with your API keys
- `load-credentials.sh` - Script to load credentials into environment
- `deploy-production.sh` - Production deployment with secure credentials

## Usage

1. Edit `credentials.env` and add your actual API keys
2. Load credentials: `source load-credentials.sh`
3. Deploy: `./deploy-production.sh`

## Security

- All files in this directory have restricted permissions (600/700)
- Never commit these files to version control
- Keep credentials updated and rotate regularly
- Use different credentials for development/staging/production

## Credential Sources

- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/
- Google/Gemini: https://aistudio.google.com/app/apikey
- Firebase: https://console.firebase.google.com/

## Environment Variables

The application expects these environment variables:
- OPENAI_API_KEY
- ANTHROPIC_API_KEY
- GEMINI_API_KEY
- FIREBASE_PROJECT_ID
- GOOGLE_CLOUD_PROJECT
- GOOGLE_APPLICATION_CREDENTIALS_JSON
- DB_PASSWORD
- REDIS_PASSWORD
- JWT_SECRET_KEY
EOF

success "Setup complete! 🎉"
log ""
log "Next steps:"
log "1. Edit ~/.careercopilot/credentials.env with your actual API keys"
log "2. Load credentials: source ~/.careercopilot/load-credentials.sh"
log "3. Deploy production: ~/.careercopilot/deploy-production.sh"
log ""
warn "Remember: Keep your credentials secure and never commit them to version control!"
