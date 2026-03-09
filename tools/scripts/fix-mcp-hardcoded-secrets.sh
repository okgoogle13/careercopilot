#!/bin/bash
# Fix hardcoded secrets in MCP configuration files

set -e

echo "🔐 Fixing hardcoded secrets in MCP configurations"
echo "=================================================="

# Define config file paths
CLAUDE_DESKTOP_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
ANTIGRAVITY_CONFIG="$HOME/.gemini/antigravity/mcp_config.json"
VSCODE_CONFIG="/Users/okgoogle13/Projects/careercopilot/.claude/config/vscode_mcp_optimized.json"

# Function to fix a config file
fix_config() {
    local config_file="$1"
    local backup_file="${config_file}.backup.$(date +%Y%m%d_%H%M%S)"

    if [ ! -f "$config_file" ]; then
        echo "⚠️  Config file not found: $config_file"
        return
    fi

    echo ""
    echo "Processing: $config_file"

    # Create backup
    cp "$config_file" "$backup_file"
    echo "✅ Created backup: $backup_file"

    # Replace hardcoded GitHub tokens with environment variable
    if grep -q "github_pat_" "$config_file"; then
        sed -i '' 's/"GITHUB_PERSONAL_ACCESS_TOKEN": "github_pat_[^"]*"/"GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"/g' "$config_file"
        echo "✅ Replaced hardcoded GitHub token with \${GITHUB_TOKEN}"
    else
        echo "✓ No hardcoded GitHub tokens found"
    fi

    # Replace hardcoded OpenAI keys with environment variable
    if grep -q "sk-proj-" "$config_file" || grep -q '"sk-[^"]*"' "$config_file"; then
        sed -i '' 's/"OPENAI_API_KEY": "sk-[^"]*"/"OPENAI_API_KEY": "${OPENAI_API_KEY}"/g' "$config_file"
        echo "✅ Replaced hardcoded OpenAI key with \${OPENAI_API_KEY}"
    else
        echo "✓ No hardcoded OpenAI keys found"
    fi

    # Replace hardcoded Anthropic keys with environment variable
    if grep -q "sk-ant-" "$config_file"; then
        sed -i '' 's/"ANTHROPIC_API_KEY": "sk-ant-[^"]*"/"ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}"/g' "$config_file"
        echo "✅ Replaced hardcoded Anthropic key with \${ANTHROPIC_API_KEY}"
    else
        echo "✓ No hardcoded Anthropic keys found"
    fi

    # Replace hardcoded Google/Gemini keys with environment variable
    if grep -q "AIza" "$config_file"; then
        sed -i '' 's/"GEMINI_API_KEY": "AIza[^"]*"/"GEMINI_API_KEY": "${GEMINI_API_KEY}"/g' "$config_file"
        sed -i '' 's/"GOOGLE_API_KEY": "AIza[^"]*"/"GOOGLE_API_KEY": "${GEMINI_API_KEY}"/g' "$config_file"
        echo "✅ Replaced hardcoded Gemini key with \${GEMINI_API_KEY}"
    else
        echo "✓ No hardcoded Gemini keys found"
    fi

    # Replace hardcoded Perplexity keys with environment variable
    if grep -q "pplx-" "$config_file"; then
        sed -i '' 's/"PERPLEXITY_API_KEY": "pplx-[^"]*"/"PERPLEXITY_API_KEY": "${PERPLEXITY_API_KEY}"/g' "$config_file"
        echo "✅ Replaced hardcoded Perplexity key with \${PERPLEXITY_API_KEY}"
    else
        echo "✓ No hardcoded Perplexity keys found"
    fi

}

# Fix all config files
fix_config "$CLAUDE_DESKTOP_CONFIG"
fix_config "$ANTIGRAVITY_CONFIG"
fix_config "$VSCODE_CONFIG"

echo ""
echo "=================================================="
echo "✅ MCP configuration files have been secured!"
echo ""
echo "📝 Next steps:"
echo "   1. Verify secrets are in macOS Keychain (run: security find-generic-password -s careercopilot)"
echo "   2. Restart Claude Desktop and Antigravity"
echo "   3. Test MCP server connections"
echo ""
echo "💾 Backups created with .backup.YYYYMMDD_HHMMSS extension"
