#!/usr/bin/env bash
# Antigravity MCP Wrapper Script
# Manages the unified MCP configuration and server lifecycle.

set -euo pipefail

WORKSPACE_ROOT="/Users/okgoogle13/Desktop/careercopilot"
CONFIG_FILE="$WORKSPACE_ROOT/.antigravity/mcp.json"
CLAUDE_DESKTOP_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"

function show_help() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  validate    Validate the unified mcp.json and environment variables."
    echo "  deploy      Deploy unified mcp.json to Claude Desktop config."
    echo "  health      Run existing health check script."
    echo "  restart-flash Restart the flash-sidekick MCP server."
    echo "  test-perplexity Test the Perplexity MCP server connectivity."
    echo "  help        Show this help message."
}

function validate() {
    echo "🔍 Validating MCP Setup..."
    
    if [ ! -f "$CONFIG_FILE" ]; then
        echo "❌ Error: $CONFIG_FILE not found."
        exit 1
    fi
    echo "✅ Unified mcp.json found at $CONFIG_FILE"

    if [[ -f "$WORKSPACE_ROOT/.env" ]]; then
        # shellcheck source=/dev/null
        source "$WORKSPACE_ROOT/.env"
    fi

    if [ -z "${PERPLEXITY_API_KEY:-}" ]; then
        echo "⚠️  Warning: PERPLEXITY_API_KEY is not set in environment."
    else
        echo "✅ PERPLEXITY_API_KEY detected."
    fi

    if [ -z "${GEMINI_API_KEY:-}" ]; then
        echo "⚠️  Warning: GEMINI_API_KEY is not set in environment."
    else
        echo "✅ GEMINI_API_KEY detected."
    fi

    echo "✅ Validation complete."
}

function deploy() {
    echo "🚀 Deploying unified MCP config to Claude Desktop..."
    
    if [ ! -f "$CONFIG_FILE" ]; then
        echo "❌ Error: Source config $CONFIG_FILE not found."
        exit 1
    fi

    # Create directory if it doesn't exist
    mkdir -p "$(dirname "$CLAUDE_DESKTOP_CONFIG")"

    # Backup existing config
    if [ -f "$CLAUDE_DESKTOP_CONFIG" ]; then
        cp "$CLAUDE_DESKTOP_CONFIG" "${CLAUDE_DESKTOP_CONFIG}.bak"
        echo "📦 Backed up existing Claude Desktop config to ${CLAUDE_DESKTOP_CONFIG}.bak"
    fi

    # Copy unified config
    cp "$CONFIG_FILE" "$CLAUDE_DESKTOP_CONFIG"
    echo "✅ Unified mcp.json deployed to $CLAUDE_DESKTOP_CONFIG"
    echo "💡 Please restart Claude Desktop to apply changes."
}

function restart_flash() {
    echo "🔄 Restarting Flash Sidekick..."
    bash "$WORKSPACE_ROOT/scripts/run_flash_sidekick.sh"
}

case "${1:-}" in
    validate)
        validate
        ;;
    deploy)
        deploy
        ;;
    health)
        bash "$WORKSPACE_ROOT/scripts/check-mcp-health.sh"
        ;;
    restart-flash)
        restart_flash
        ;;
    test-perplexity)
        echo "🧪 Testing Perplexity MCP server..."
        npx -y @perplexity-ai/mcp-server --help
        ;;
    *)
        show_help
        ;;
esac
