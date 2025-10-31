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

# Get the API keys
echo "=== Setting up Gemini API Keys for Staging and Production ==="

# Staging Key
read -s -p "Enter your STAGING Gemini API key (input will be hidden): " STAGING_KEY
echo ""

# Production Key
read -s -p "Enter your PRODUCTION Gemini API key (input will be hidden): " PROD_KEY
echo ""

# Set the secrets
gh secret set GEMINI_API_KEY_STAGING --body "$STAGING_KEY"
gh secret set GEMINI_API_KEY_PRODUCTION --body "$PROD_KEY"

echo "✅ Gemini API keys have been set as GitHub secrets"
echo "- Staging: GEMINI_API_KEY_STAGING"
echo "- Production: GEMINI_API_KEY_PRODUCTION"
echo ""
echo "These secrets will be used in the CI/CD pipeline based on the environment."
