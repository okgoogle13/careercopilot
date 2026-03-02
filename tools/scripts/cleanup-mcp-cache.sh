#!/bin/bash
# MCP Cache Cleanup Script
# This script removes all cached MCP configurations and forces VS Code to reload from disk

echo "🧹 Cleaning MCP caches..."

# Stop any running VS Code instances (optional - user can do this manually)
echo "⚠️  Please close all VS Code/Antigravity windows before continuing."
read -p "Press Enter when ready..."

# Clean VS Code caches
echo "Cleaning VS Code globalStorage..."
rm -rf ~/.config/Code/User/globalStorage/*/mcp* 2>/dev/null
rm -rf ~/.config/Code/CachedData/*/mcp* 2>/dev/null

# Clean Antigravity caches
echo "Cleaning Antigravity globalStorage..."
rm -rf ~/.config/Antigravity/User/globalStorage/*/mcp* 2>/dev/null
rm -rf ~/.config/Antigravity/CachedData/*/mcp* 2>/dev/null

# Clean node/npm caches that might have stale package info
echo "Cleaning NPM cache..."
npm cache clean --force 2>/dev/null

# Clean any workspace storage that might have MCP state
echo "Cleaning workspace storage..."
find ~/.config/Code/User/workspaceStorage -name "*mcp*" -delete 2>/dev/null
find ~/.config/Antigravity/User/workspaceStorage -name "*mcp*" -delete 2>/dev/null

# Display current global MCP config
echo ""
echo "✅ Cache cleanup complete!"
echo ""
echo "📋 Current global MCP configuration:"
cat ~/.config/Code/User/mcp.json
echo ""
echo "🔄 Next steps:"
echo "1. Open VS Code/Antigravity"
echo "2. Reload the window (Ctrl+Shift+P → 'Developer: Reload Window')"
echo "3. Check MCP server status"
