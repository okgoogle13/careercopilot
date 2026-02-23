#!/bin/bash
# ======================================================
# Re-authenticate GitHub CLI with proper scopes
# ======================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  GitHub CLI Re-authentication          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Backup existing token
OLD_TOKEN="$GITHUB_TOKEN"

echo -e "${YELLOW}Temporarily clearing GITHUB_TOKEN environment variable...${NC}"
unset GITHUB_TOKEN

echo ""
echo -e "${BLUE}Starting GitHub authentication...${NC}"
echo -e "${YELLOW}When prompted:${NC}"
echo "  1. Select 'GitHub.com'"
echo "  2. Select 'HTTPS' protocol"
echo "  3. Select 'Login with a web browser' (recommended)"
echo "  4. Or 'Paste an authentication token' if you prefer"
echo ""
echo -e "${YELLOW}Press Enter to continue...${NC}"
read

# Run authentication with required scopes
gh auth login --scopes "repo,workflow,admin:repo_hook" --web

echo ""
echo -e "${GREEN}✓ Authentication complete!${NC}"
echo ""

# Verify new permissions
echo -e "${BLUE}Verifying access to repository secrets...${NC}"
if gh secret list -R okgoogle13/careercopilot &>/dev/null; then
    echo -e "${GREEN}✓ Secret management access confirmed!${NC}"
else
    echo -e "${YELLOW}⚠ Could not verify access. You may need to try again.${NC}"
fi

echo ""
echo -e "${GREEN}You can now run:${NC}"
echo -e "  ${BLUE}./scripts/setup-github-secrets.sh${NC}"
