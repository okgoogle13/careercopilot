#!/bin/bash
# Script to securely update the GitHub PAT in macOS Keychain

echo "Updating GitHub Personal Access Token in macOS Keychain..."
echo "Service: careercopilot, Account: github-token"
echo ""

# Read token securely
read -sp "Enter your new GitHub Personal Access Token: " GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo "Error: Token cannot be empty."
    exit 1
fi

# Validation (optional but recommended)
if [[ ! $GITHUB_TOKEN =~ ^(ghp_|github_pat_) ]]; then
    echo "Warning: Token format doesn't look like a standard GitHub PAT (ghp_... or github_pat_...)"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
fi

# Save to Keychain
# Account: github-token, Service: careercopilot
security add-generic-password -a "github-token" -s "careercopilot" -l "GitHub Token" -w "$GITHUB_TOKEN" 2>/dev/null || \
security update-generic-password -a "github-token" -s "careercopilot" -w "$GITHUB_TOKEN"

if [ $? -eq 0 ]; then
    echo "✅ Token securely saved in macOS Keychain."
    echo "Testing token..."
    if curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user > /dev/null 2>&1; then
        echo "✅ Token validated successfully!"
    else
        echo "❌ Token validation failed. Please check your token scopes (repo, workflow, read:org)."
    fi
else
    echo "❌ Failed to save token to Keychain."
    exit 1
fi
