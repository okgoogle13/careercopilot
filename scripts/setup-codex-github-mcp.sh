#!/usr/bin/env bash
set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Configuring Codex GitHub MCP...${NC}"

# Remove existing github mcp if it exists to ensure clean state
if codex mcp list | grep -q "github"; then
    echo "Removing existing 'github' MCP server..."
    codex mcp remove github
fi

# Add GitHub MCP (Remote)
echo "Adding 'github' MCP server..."
# Using the standard GitHub Copilot MCP URL
codex mcp add github --url "https://api.githubcopilot.com/mcp/"

# Authenticate
echo -e "${YELLOW}Authenticating with GitHub...${NC}"
echo "You will interpret a prompt to authenticate in your browser."
codex mcp login github

# Verify
echo -e "${GREEN}Verifying configuration...${NC}"
codex mcp list
echo ""
echo "GitHub MCP details:"
codex mcp get github

echo -e "${GREEN}Setup complete!${NC}"
