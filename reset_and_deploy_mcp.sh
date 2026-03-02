#!/bin/bash

# Reset and Deploy MCP Configurations
# This script aggressively cleans old configs and installs the new optimized ones.

echo "🛑 STOP! Please close VSCode and Claude Desktop before proceeding to ensure no file locks."
echo "Press Enter to continue..."
# read  <-- Commented out for automation, but user should be aware

echo "🧹 Cleaning up old configurations..."

# Define paths
ANTIGRAVITY_CONFIG="$HOME/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"
CLAUDE_CODE_CONFIG="$HOME/Library/Application Support/Code/User/mcp.json"
CLAUDE_DESKTOP_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"

# Backup and removing existing files (force clean slate)
if [ -f "$ANTIGRAVITY_CONFIG" ]; then
    cp "$ANTIGRAVITY_CONFIG" "${ANTIGRAVITY_CONFIG}.old.bak"
    rm "$ANTIGRAVITY_CONFIG"
    echo "✅ Removed old Antigravity config"
fi

if [ -f "$CLAUDE_CODE_CONFIG" ]; then
    cp "$CLAUDE_CODE_CONFIG" "${CLAUDE_CODE_CONFIG}.old.bak"
    rm "$CLAUDE_CODE_CONFIG"
    echo "✅ Removed old Claude Code config"
fi

if [ -f "$CLAUDE_DESKTOP_CONFIG" ]; then
    cp "$CLAUDE_DESKTOP_CONFIG" "${CLAUDE_DESKTOP_CONFIG}.old.bak"
    rm "$CLAUDE_DESKTOP_CONFIG"
    echo "✅ Removed old Claude Desktop config"
fi

echo "🚀 Deploying new optimized configurations..."

# Copy new files
<<<<<<< HEAD
cp /Users/okgoogle13/Desktop/careercopilot/.claude/config/cline_mcp_settings_optimized.json "$ANTIGRAVITY_CONFIG"
cp /Users/okgoogle13/Desktop/careercopilot/.claude/config/vscode_mcp_optimized.json "$CLAUDE_CODE_CONFIG"
cp /Users/okgoogle13/Desktop/careercopilot/.claude/config/claude_desktop_config_optimized.json "$CLAUDE_DESKTOP_CONFIG"
=======
cp /Users/okgoogle13/Projects/careercopilot/.claude/config/cline_mcp_settings_optimized.json "$ANTIGRAVITY_CONFIG"
cp /Users/okgoogle13/Projects/careercopilot/.claude/config/vscode_mcp_optimized.json "$CLAUDE_CODE_CONFIG"
cp /Users/okgoogle13/Projects/careercopilot/.claude/config/claude_desktop_config_optimized.json "$CLAUDE_DESKTOP_CONFIG"
>>>>>>> restoration-KR-Rage-Figma-v2.0

echo "✅ Antigravity config deployed"
echo "✅ Claude Code config deployed"
echo "✅ Claude Desktop config deployed"

# Permissions fix
<<<<<<< HEAD
chmod +x /Users/okgoogle13/Desktop/careercopilot/servers/flash_sidekick.py
=======
chmod +x /Users/okgoogle13/Projects/careercopilot/servers/flash_sidekick.py
>>>>>>> restoration-KR-Rage-Figma-v2.0

echo " "
echo "🎉 EXECUTION COMPLETE"
echo " "
echo "Please now:"
echo "1. Restart VSCode Window (Cmd+Shift+P -> Reload Window)"
echo "2. Restart Claude Desktop App"
echo "3. Verify 'flash-sidekick' is listed in your MCP tools"
