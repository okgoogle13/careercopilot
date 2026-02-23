#!/bin/bash
#
# Setup AWS SES Secrets in GitHub
# Adds AWS SES credentials as GitHub repository secrets for CI/CD
#

set -e

REPO="okgoogle13/careercopilot"

echo "================================================"
echo "AWS SES GitHub Secrets Setup"
echo "================================================"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) is not installed"
    echo "Install from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "Not authenticated with GitHub. Logging in..."
    gh auth login
fi

echo "This script will add AWS SES credentials to GitHub Secrets for repository: $REPO"
echo ""
echo "You'll need:"
echo "1. AWS Access Key ID (20 characters)"
echo "2. AWS Secret Access Key (40 characters)"
echo "3. SES Sender Email (your verified Gmail)"
echo ""

# Prompt for AWS Access Key ID
read -p "Enter AWS Access Key ID: " AWS_ACCESS_KEY_ID
if [ -z "$AWS_ACCESS_KEY_ID" ]; then
    echo "❌ Error: AWS Access Key ID cannot be empty"
    exit 1
fi

# Prompt for AWS Secret Access Key (hidden input)
read -sp "Enter AWS Secret Access Key: " AWS_SECRET_ACCESS_KEY
echo ""
if [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "❌ Error: AWS Secret Access Key cannot be empty"
    exit 1
fi

# Prompt for SES Sender Email
read -p "Enter SES Sender Email (e.g., your-email@gmail.com): " SES_SENDER_EMAIL
if [ -z "$SES_SENDER_EMAIL" ]; then
    echo "❌ Error: SES Sender Email cannot be empty"
    exit 1
fi

# Prompt for AWS Region (with default)
read -p "Enter AWS Region [us-east-1]: " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}

echo ""
echo "Creating GitHub Secrets..."
echo ""

# Create secrets using gh CLI
echo "Creating AWS_ACCESS_KEY_ID..."
echo "$AWS_ACCESS_KEY_ID" | gh secret set AWS_ACCESS_KEY_ID --repo="$REPO"

echo "Creating AWS_SECRET_ACCESS_KEY..."
echo "$AWS_SECRET_ACCESS_KEY" | gh secret set AWS_SECRET_ACCESS_KEY --repo="$REPO"

echo "Creating SES_SENDER_EMAIL..."
echo "$SES_SENDER_EMAIL" | gh secret set SES_SENDER_EMAIL --repo="$REPO"

echo "Creating AWS_REGION..."
echo "$AWS_REGION" | gh secret set AWS_REGION --repo="$REPO"

echo ""
echo "✅ GitHub Secrets created successfully!"
echo ""
echo "Secrets added:"
echo "  - AWS_ACCESS_KEY_ID"
echo "  - AWS_SECRET_ACCESS_KEY"
echo "  - SES_SENDER_EMAIL"
echo "  - AWS_REGION"
echo ""
echo "You can view secrets at: https://github.com/$REPO/settings/secrets/actions"
echo ""
echo "Next steps:"
echo "1. Verify secrets are set: gh secret list --repo=$REPO"
echo "2. Update your CI/CD workflows to use these secrets if needed"
echo ""
