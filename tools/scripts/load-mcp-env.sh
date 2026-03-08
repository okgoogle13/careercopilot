#!/bin/bash
# Script to load secrets from macOS Keychain into the current environment.
# Usage: source tools/scripts/load-mcp-env.sh

# GitHub PAT
GITHUB_SEC=$(security find-generic-password -a "github-token" -s "careercopilot" -w 2>/dev/null)
if [ -n "$GITHUB_SEC" ]; then
    export GITHUB_TOKEN="$GITHUB_SEC"
    export GITHUB_PERSONAL_ACCESS_TOKEN="$GITHUB_SEC"
    export CODEX_GITHUB_PERSONAL_ACCESS_TOKEN="$GITHUB_SEC"
    echo "✅ GitHub PAT loaded from Keychain."
else
    echo "⚠️  GitHub PAT not found in Keychain."
fi

# Gemini API Key
GEMINI_SEC=$(security find-generic-password -a "gemini-key" -s "careercopilot" -w 2>/dev/null)
if [ -n "$GEMINI_SEC" ]; then
    export GEMINI_API_KEY="$GEMINI_SEC"
    echo "✅ Gemini API Key loaded from Keychain."
else
    echo "⚠️  Gemini API Key not found in Keychain."
fi

# Anthropic API Key
ANTHROPIC_SEC=$(security find-generic-password -a "anthropic-key" -s "careercopilot" -w 2>/dev/null)
if [ -n "$ANTHROPIC_SEC" ]; then
    export ANTHROPIC_API_KEY="$ANTHROPIC_SEC"
    echo "✅ Anthropic API Key loaded from Keychain."
fi

# Perplexity API Key
PERPLEXITY_SEC=$(security find-generic-password -a "perplexity-key" -s "careercopilot" -w 2>/dev/null)
if [ -n "$PERPLEXITY_SEC" ]; then
    export PERPLEXITY_API_KEY="$PERPLEXITY_SEC"
    echo "✅ Perplexity API Key loaded from Keychain."
fi
