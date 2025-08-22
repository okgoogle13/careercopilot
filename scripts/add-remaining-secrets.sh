#!/bin/bash

# Quick script to add the remaining required secrets
# Run this after you've obtained the necessary keys and files

REPO="okgoogle13/careercopilot"

echo "🔧 Adding remaining CareerCopilot secrets..."

# Function to add secret with prompt
add_secret_prompt() {
    local secret_name="$1"
    local description="$2"
    
    echo
    echo "📝 $description"
    echo -n "Enter $secret_name (or press Enter to skip): "
    read -r secret_value
    
    if [ -n "$secret_value" ]; then
        echo -n "Adding $secret_name... "
        if gh secret set "$secret_name" --body "$secret_value" --repo "$REPO" &> /dev/null; then
            echo "✅"
        else
            echo "❌ Failed"
        fi
    else
        echo "⏭️  Skipped $secret_name"
    fi
}

# Add missing OAuth client IDs
add_secret_prompt "GOOGLE_OAUTH_CLIENT_ID_STAGING" \
    "Google OAuth Client ID for staging (format: xxxxx.apps.googleusercontent.com)"

add_secret_prompt "GOOGLE_OAUTH_CLIENT_ID_PROD" \
    "Google OAuth Client ID for production (format: xxxxx.apps.googleusercontent.com)"

# Add SendGrid API key
add_secret_prompt "SENDGRID_API_KEY" \
    "SendGrid API key for email services (format: SG.xxxxx)"

echo
echo "📁 For Firebase service accounts, use these commands with your JSON files:"
echo
echo "# Staging Firebase service account:"
echo "gh secret set FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT_STAGING --body \"\$(cat firebase-staging-key.json)\" --repo $REPO"
echo
echo "# Production Firebase service account:"
echo "gh secret set FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT --body \"\$(cat firebase-prod-key.json)\" --repo $REPO"
echo
echo "# Staging GCP service account:"
echo "gh secret set GCP_STAGING_SA_KEY --body \"\$(cat gcp-staging-key.json)\" --repo $REPO"

echo
echo "✅ Run 'gh secret list --repo $REPO' to verify all secrets are set"