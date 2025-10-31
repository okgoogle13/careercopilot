#!/bin/bash

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) is not installed. Please install it first:"
    echo "https://cli.github.com/"
    exit 1
fi

# Check if already authenticated
if ! gh auth status &> /dev/null; then
    echo "Please authenticate with GitHub first:"
    gh auth login
fi

# Get the API key
read -s -p "Enter your Gemini API key: " GEMINI_API_KEY
echo ""

# Set the secret
gh secret set GEMINI_API_KEY --body "$GEMINI_API_KEY"

echo "✅ Gemini API key has been set as a GitHub secret"
