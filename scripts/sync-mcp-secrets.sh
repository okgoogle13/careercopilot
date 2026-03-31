#!/usr/bin/env bash
# ============================================================================
# CareerCopilot MCP Secret Sync Utility
# Centralizes local environment variables from Google Secret Manager
# ============================================================================

set -euo pipefail

# Configuration
PROJECT_ID="careercopilot-468811"
ENV_FILE=".env.mcp"
BACKUP_DIR="scripts/backups"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔐 CareerCopilot Secret Sync${NC}"
echo "=============================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Error: gcloud CLI is not installed.${NC}"
    exit 1
fi

# Create backup of current .env.mcp if it exists
if [ -f "$ENV_FILE" ]; then
    mkdir -p "$BACKUP_DIR"
    cp "$ENV_FILE" "$BACKUP_DIR/.env.mcp.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Header for the environment file
cat > "$ENV_FILE" << EOF
# ============================================================================
# CareerCopilot MCP Secrets (Generated from Google Cloud)
# Generated at: $(date)
# ============================================================================
GOOGLE_CLOUD_PROJECT="${PROJECT_ID}"
GCP_PROJECT_ID="${PROJECT_ID}"
EOF

# List of secrets to sync (GCP_NAME:ENV_NAME)
SECRETS=(
    "GEMINI_API_KEY:GEMINI_API_KEY"
    "GOOGLE_CLOUD_PROJECT:GOOGLE_CLOUD_PROJECT"
    "GITHUB_TOKEN:GITHUB_TOKEN"
    "OPENAI_API_KEY:OPENAI_API_KEY"
    "ANTHROPIC_API_KEY:ANTHROPIC_API_KEY"
    "PERPLEXITY_API_KEY:PERPLEXITY_API_KEY"
    "SENTRY_DSN:SENTRY_DSN"
    "SENTRY_ORG:SENTRY_ORG"
    "SENTRY_ACCESS_TOKEN:SENTRY_ACCESS_TOKEN"
    "SENTRY_AUTH_TOKEN:SENTRY_AUTH_TOKEN"
)

echo -e "Syncing from project: ${YELLOW}${PROJECT_ID}${NC}..."

# Fetch each secret
for item in "${SECRETS[@]}"; do
    gcp_name="${item%%:*}"
    env_name="${item#*:}"

    echo -n "  → Fetching ${env_name}... "

    # Attempt to fetch the secret value
    if VALUE=$(gcloud secrets versions access latest --secret="$gcp_name" --project="$PROJECT_ID" 2>/dev/null); then
        echo -e "${GREEN}SUCCESS${NC}"
        # Write to the .env.mcp file
        # Check if value needs quoting
        if [[ "$VALUE" =~ [[:space:]] ]]; then
            echo "${env_name}=\"${VALUE}\"" >> "$ENV_FILE"
        else
            echo "${env_name}=${VALUE}" >> "$ENV_FILE"
        fi
    else
        echo -e "${RED}FAILED${NC} (Secret not found in GCP)"
    fi
done

# Special fallback mapping for compatibility
if grep -q "GITHUB_TOKEN" "$ENV_FILE"; then
    echo "GITHUB_PERSONAL_ACCESS_TOKEN=\${GITHUB_TOKEN}" >> "$ENV_FILE"
    echo "GH_TOKEN=\${GITHUB_TOKEN}" >> "$ENV_FILE"
fi

echo ""
echo -e "${GREEN}✅ Sync complete! Generated ${ENV_FILE}${NC}"
echo "--------------------------------------------------"
echo -e "To load these secrets into your current session, run:"
echo -e "  ${BLUE}export \$(grep -v '^#' ${ENV_FILE} | xargs)${NC}"
echo ""
echo -e "${YELLOW}NOTE:${NC} Ensure ${ENV_FILE} is in your .gitignore!"
