#!/bin/bash
# Setup script for Codex CLI GitHub MCP configuration
# This script helps configure Codex CLI to use GitHub Personal Access Token

set -e  # Exit on error

echo "================================================"
echo "Codex CLI GitHub MCP Setup"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Determine the shell config file
if [ -f "$HOME/.zshrc" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
elif [ -f "$HOME/.bash_profile" ]; then
    SHELL_CONFIG="$HOME/.bash_profile"
else
    SHELL_CONFIG="$HOME/.profile"
fi

echo "Detected shell configuration: $SHELL_CONFIG"
echo ""

# Check if environment variable is already set
if [ -n "$CODEX_GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
    echo -e "${GREEN}✓${NC} Environment variable CODEX_GITHUB_PERSONAL_ACCESS_TOKEN is already set"
    echo "  Current value: ${CODEX_GITHUB_PERSONAL_ACCESS_TOKEN:0:7}..."
    echo ""
    read -p "Do you want to update it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        SKIP_ENV_VAR=true
    fi
fi

# Prompt for GitHub Personal Access Token
if [ -z "$SKIP_ENV_VAR" ]; then
    echo "Step 1: GitHub Personal Access Token"
    echo "-------------------------------------"
    echo "You need a GitHub Personal Access Token (PAT) to use the GitHub MCP server."
    echo ""
    echo "To create one:"
    echo "  1. Go to: https://github.com/settings/personal-access-tokens/new"
    echo "  2. Give it a name: 'Codex CLI MCP Access'"
    echo "  3. Set expiration (recommended: 90 days)"
    echo "  4. Grant permissions: repo, workflow, read:org"
    echo "  5. Generate and copy the token"
    echo ""
    echo -e "${YELLOW}Note: The token will start with 'ghp_' or 'github_pat_'${NC}"
    echo ""
    
    # Read token securely
    read -sp "Enter your GitHub Personal Access Token: " GITHUB_TOKEN
    echo ""
    echo ""
    
    # Validate token format
    if [[ ! $GITHUB_TOKEN =~ ^(ghp_|github_pat_) ]]; then
        echo -e "${RED}✗${NC} Warning: Token doesn't look like a valid GitHub PAT"
        echo "  Expected format: ghp_... or github_pat_..."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Aborted."
            exit 1
        fi
    fi
    
    # Test the token
    echo "Testing token..."
    if curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Token is valid!"
    else
        echo -e "${RED}✗${NC} Token validation failed. Please check your token and try again."
        exit 1
    fi
    echo ""
    
    # Add to shell config
    echo "Step 2: Adding environment variable to $SHELL_CONFIG"
    echo "-----------------------------------------------------"
    
    # Check if already in config
    if grep -q "CODEX_GITHUB_PERSONAL_ACCESS_TOKEN" "$SHELL_CONFIG"; then
        echo -e "${YELLOW}!${NC} Variable already exists in $SHELL_CONFIG"
        echo "  Updating existing entry..."
        # Remove old entry
        sed -i.bak '/CODEX_GITHUB_PERSONAL_ACCESS_TOKEN/d' "$SHELL_CONFIG"
    fi
    
    # Add new entry
    echo "" >> "$SHELL_CONFIG"
    echo "# GitHub Personal Access Token for Codex CLI MCP (added $(date +%Y-%m-%d))" >> "$SHELL_CONFIG"
    echo "export CODEX_GITHUB_PERSONAL_ACCESS_TOKEN=\"$GITHUB_TOKEN\"" >> "$SHELL_CONFIG"
    
    echo -e "${GREEN}✓${NC} Environment variable added to $SHELL_CONFIG"
    echo ""
    
    # Export for current session
    export CODEX_GITHUB_PERSONAL_ACCESS_TOKEN="$GITHUB_TOKEN"
fi

# Create .codex directory if it doesn't exist
echo "Step 3: Creating Codex configuration"
echo "-------------------------------------"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CODEX_DIR="$REPO_ROOT/.codex"
CONFIG_FILE="$CODEX_DIR/config.toml"

if [ ! -d "$CODEX_DIR" ]; then
    mkdir -p "$CODEX_DIR"
    echo -e "${GREEN}✓${NC} Created directory: $CODEX_DIR"
fi

# Check if config already exists
if [ -f "$CONFIG_FILE" ]; then
    echo -e "${YELLOW}!${NC} Configuration file already exists: $CONFIG_FILE"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing configuration."
    else
        # Backup existing config
        cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d-%H%M%S)"
        echo -e "${GREEN}✓${NC} Backed up existing configuration"
        CREATE_CONFIG=true
    fi
else
    CREATE_CONFIG=true
fi

if [ "$CREATE_CONFIG" = true ]; then
    # Create config file
    cat > "$CONFIG_FILE" << 'EOF'
# Codex CLI MCP Server Configuration
# This file configures MCP servers for use with Codex CLI

# GitHub MCP Server Configuration
[mcp_servers.github]
bearer_token_env_var = "CODEX_GITHUB_PERSONAL_ACCESS_TOKEN"
EOF
    echo -e "${GREEN}✓${NC} Created configuration file: $CONFIG_FILE"
fi

echo ""

# Also create global config if user wants
echo "Step 4: Global configuration (optional)"
echo "---------------------------------------"
echo "Would you like to also set up global Codex configuration?"
echo "This will create ~/.config/codex/config.toml"
read -p "Set up global config? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    GLOBAL_CODEX_DIR="$HOME/.config/codex"
    GLOBAL_CONFIG_FILE="$GLOBAL_CODEX_DIR/config.toml"
    
    mkdir -p "$GLOBAL_CODEX_DIR"
    
    if [ -f "$GLOBAL_CONFIG_FILE" ]; then
        cp "$GLOBAL_CONFIG_FILE" "$GLOBAL_CONFIG_FILE.backup.$(date +%Y%m%d-%H%M%S)"
        echo -e "${GREEN}✓${NC} Backed up existing global configuration"
    fi
    
    cp "$CONFIG_FILE" "$GLOBAL_CONFIG_FILE"
    echo -e "${GREEN}✓${NC} Created global configuration: $GLOBAL_CONFIG_FILE"
fi

echo ""
echo "================================================"
echo -e "${GREEN}Setup Complete!${NC}"
echo "================================================"
echo ""
echo "Next steps:"
echo "  1. Reload your shell configuration:"
echo "     source $SHELL_CONFIG"
echo ""
echo "  2. Restart Codex CLI completely"
echo ""
echo "  3. Verify the setup:"
echo "     echo \$CODEX_GITHUB_PERSONAL_ACCESS_TOKEN"
echo ""
echo "  4. Test in Codex CLI:"
echo "     'List available MCP servers'"
echo "     'Show me the latest issues in okgoogle13/careercopilot'"
echo ""
echo "Configuration files created:"
echo "  - $CONFIG_FILE"
if [ -f "$GLOBAL_CONFIG_FILE" ]; then
    echo "  - $GLOBAL_CONFIG_FILE"
fi
echo ""
echo "For troubleshooting, see: docs/guides/CODEX_CLI_SETUP.md"
echo ""
