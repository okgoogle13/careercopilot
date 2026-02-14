#!/bin/bash
# Secure Gemini API Key Setup Script
# This script configures a new Gemini API key across all required locations

set -e

echo "🔐 Secure Gemini API Key Configuration"
echo "======================================="
echo ""

# Check if new API key is provided
if [ -z "$1" ]; then
    echo "❌ ERROR: No API key provided"
    echo ""
    echo "Usage: ./setup-gemini-key.sh <NEW_GEMINI_API_KEY>"
    echo ""
    echo "Example: ./setup-gemini-key.sh AIzaSyABC123..."
    exit 1
fi

NEW_KEY="$1"

# Validate API key format
if [[ ! "$NEW_KEY" =~ ^AIza[0-9A-Za-z_-]{35}$ ]]; then
    echo "⚠️  WARNING: API key format doesn't match expected pattern (AIza + 35 chars)"
    read -p "Continue anyway? (y/N): " confirm
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        echo "Aborted."
        exit 1
    fi
fi

echo "1️⃣ Storing in macOS Keychain..."
security delete-generic-password -a "gemini-key" -s "careercopilot" 2>/dev/null || true
security add-generic-password -a "gemini-key" -s "careercopilot" -w "$NEW_KEY"
echo "   ✅ Stored in Keychain"

echo ""
echo "2️⃣ Creating .env file..."
cat > /Users/okgoogle13/Desktop/careercopilot/.env << EOF
# CareerCopilot Environment Configuration
# Generated: $(date)
# CRITICAL: This file is git-ignored. Never commit it.

GEMINI_API_KEY=$NEW_KEY
EOF
chmod 600 /Users/okgoogle13/Desktop/careercopilot/.env
echo "   ✅ Created .env with restricted permissions (600)"

echo ""
echo "3️⃣ Updating .env.local..."
cat > /Users/okgoogle13/Desktop/careercopilot/.env.local << EOF
# CareerCopilot Local Environment Configuration
# GEMINI_API_KEY is loaded from keychain via .zshrc
# This file is git-ignored for security
EOF
chmod 600 /Users/okgoogle13/Desktop/careercopilot/.env.local
echo "   ✅ Cleared .env.local"

echo ""
echo "4️⃣ Reloading shell environment..."
export GEMINI_API_KEY="$NEW_KEY"
echo "   ✅ Environment variable set for current session"

echo ""
echo "5️⃣ Testing API key..."
python3 << PYEOF
import os
import google.generativeai as genai

api_key = os.getenv('GEMINI_API_KEY')
try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content('Say hello in exactly 3 words')
    print(f"   ✅ API Key Valid: {response.text.strip()}")
except Exception as e:
    print(f"   ❌ API Key Test Failed: {str(e)[:100]}")
    exit(1)
PYEOF

echo ""
echo "6️⃣ Storing in GitHub Secrets (requires gh CLI)..."
if command -v gh &> /dev/null; then
    gh secret set GEMINI_API_KEY --body "$NEW_KEY" 2>/dev/null && echo "   ✅ Stored in GitHub Secrets" || echo "   ⚠️  Failed to store in GitHub Secrets (manual setup required)"
else
    echo "   ⚠️  gh CLI not installed - manual GitHub Secrets setup required"
    echo "      Visit: https://github.com/okgoogle13/careercopilot/settings/secrets/actions"
fi

echo ""
echo "7️⃣ Storing in Google Secret Manager (requires gcloud CLI)..."
if command -v gcloud &> /dev/null; then
    echo -n "$NEW_KEY" | gcloud secrets create gemini-api-key --data-file=- 2>/dev/null && echo "   ✅ Stored in Google Secret Manager" || \
    echo -n "$NEW_KEY" | gcloud secrets versions add gemini-api-key --data-file=- 2>/dev/null && echo "   ✅ Updated in Google Secret Manager" || \
    echo "   ⚠️  Failed to store in Google Secret Manager (manual setup required)"
else
    echo "   ⚠️  gcloud CLI not installed - manual Google Secret Manager setup required"
fi

echo ""
echo "✅ SETUP COMPLETE!"
echo "=================="
echo ""
echo "📋 Next Steps:"
echo "1. Restart your terminal or run: source ~/.zshrc"
echo "2. Verify MCP sidekicks work: /tmp/check-api-keys.sh"
echo "3. Commit changes (excluding .env files)"
echo ""
echo "🔒 Security Reminders:"
echo "- .env and .env.local are git-ignored"
echo "- API key is stored in macOS Keychain"
echo "- Never share or commit API keys"
echo "- Rotate keys regularly"
echo ""
