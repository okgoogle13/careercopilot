#!/bin/bash
# Add API keys to macOS Keychain for CareerCopilot

echo "Setting up macOS Keychain for CareerCopilot secrets..."

# Function to add/update password
set_secret() {
  local label=$1
  local account=$2
  local value=$3
  security add-generic-password -U -a "$account" -s "careercopilot" -l "$label" -w "$value"
}

# GitHub Token
read -sp "Enter GitHub Personal Access Token: " GITHUB_TOKEN; echo
if [ -n "$GITHUB_TOKEN" ]; then
  set_secret "GitHub Token" "github-token" "$GITHUB_TOKEN"
fi

# Gemini API Key
read -sp "Enter Gemini API Key: " GEMINI_API_KEY; echo
if [ -n "$GEMINI_API_KEY" ]; then
  set_secret "Gemini API Key" "gemini-key" "$GEMINI_API_KEY"
fi

# OpenAI API Key
read -sp "Enter OpenAI API Key: " OPENAI_API_KEY; echo
if [ -n "$OPENAI_API_KEY" ]; then
  set_secret "OpenAI API Key" "openai-key" "$OPENAI_API_KEY"
fi

# Anthropic API Key
read -sp "Enter Anthropic API Key: " ANTHROPIC_API_KEY; echo
if [ -n "$ANTHROPIC_API_KEY" ]; then
  set_secret "Anthropic API Key" "anthropic-key" "$ANTHROPIC_API_KEY"
fi

# Perplexity API Key
read -sp "Enter Perplexity API Key: " PERPLEXITY_API_KEY; echo
if [ -n "$PERPLEXITY_API_KEY" ]; then
  set_secret "Perplexity API Key" "perplexity-key" "$PERPLEXITY_API_KEY"
fi

echo "✓ Secrets stored in Keychain"
