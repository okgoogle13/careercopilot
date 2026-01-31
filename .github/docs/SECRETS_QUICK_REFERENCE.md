# GitHub Secrets - Quick Reference Card

**Repository:** `okgoogle13/careercopilot`  
**Last Updated:** 2026-01-31

---

## 🔍 **Check Existing Secrets**

```bash
# List all repository secrets
gh secret list --repo okgoogle13/careercopilot

# Check specific secrets
gh secret list --repo okgoogle13/careercopilot | grep -E "CHROMATIC|SUPABASE|GEMINI"
```

---

## 🔐 **Set Secrets**

### Interactive (Recommended)
```bash
gh secret set SECRET_NAME --repo okgoogle13/careercopilot
# Prompts for value (hidden input)
```

### From Clipboard (macOS)
```bash
# Copy secret value first, then:
pbpaste | gh secret set SECRET_NAME --repo okgoogle13/careercopilot
```

### From Environment Variable
```bash
export MY_SECRET="value"
gh secret set SECRET_NAME --repo okgoogle13/careercopilot --body "$MY_SECRET"
unset MY_SECRET
```

### From File
```bash
echo "secret-value" > /tmp/secret.txt
gh secret set SECRET_NAME --repo okgoogle13/careercopilot < /tmp/secret.txt
rm /tmp/secret.txt  # Delete immediately!
```

---

## 🗑️ **Delete Secrets**

```bash
gh secret delete SECRET_NAME --repo okgoogle13/careercopilot
```

---

## 🔄 **Update Secrets**

```bash
# Same command as set (overwrites existing)
gh secret set SECRET_NAME --repo okgoogle13/careercopilot
```

---

## 📋 **Required CI/CD Secrets**

### Current Requirements

| Secret Name                     | Purpose                                          | Where to Get It                                                 |
|----------------------------------|--------------------------------------------------|----------------------------------------------------------------|
| `CHROMATIC_PROJECT_TOKEN`        | Storybook visual regression                      | [chromatic.com/start](https://www.chromatic.com/start)        |
| `SUPABASE_PROJECT_ID`           | Database schema validation                        | [supabase.com/dashboard](https://supabase.com/dashboard/project/_/settings/general) |
| `SUPABASE_ACCESS_TOKEN`         | Supabase CLI operations                           | [supabase.com/account/tokens](https://supabase.com/dashboard/account/tokens) |
| `SUPABASE_ANON_KEY`             | Public API key for RLS tests                     | [supabase.com/settings/api](https://supabase.com/dashboard/project/_/settings/api) |
| `GEMINI_API_KEY_STAGING`        | MCP server testing                               | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

---

## 🎨 **Chromatic Setup**

```bash
# 1. Create Chromatic account
open https://www.chromatic.com/start

# 2. Sign in with GitHub and select repository

# 3. Copy project token, then:
gh secret set CHROMATIC_PROJECT_TOKEN --repo okgoogle13/careercopilot
```

---

## 🗄️ **Supabase Setup**

### Project ID
```bash
# Get from dashboard or CLI
supabase projects list

# Set secret
gh secret set SUPABASE_PROJECT_ID --repo okgoogle13/careercopilot
```

### Access Token
```bash
# Generate from: https://supabase.com/dashboard/account/tokens
gh secret set SUPABASE_ACCESS_TOKEN --repo okgoogle13/careercopilot
```

### Anon Key
```bash
# Get from: https://supabase.com/dashboard/project/_/settings/api
# Copy the "anon" (public) key
gh secret set SUPABASE_ANON_KEY --repo okgoogle13/careercopilot
```

---

## ✅ **Verification Commands**

```bash
# Verify all required secrets exist
REQUIRED_SECRETS=(
  "CHROMATIC_PROJECT_TOKEN"
  "SUPABASE_PROJECT_ID"
  "SUPABASE_ACCESS_TOKEN"
  "SUPABASE_ANON_KEY"
  "GEMINI_API_KEY_STAGING"
)

for secret in "${REQUIRED_SECRETS[@]}"; do
  if gh secret list --repo okgoogle13/careercopilot | grep -q "$secret"; then
    echo "✅ $secret"
  else
    echo "❌ $secret - MISSING"
  fi
done
```

---

## 🛠️ **Automated Setup Script**

Save as `scripts/setup-ci-secrets.sh`:

```bash
#!/bin/bash
# CI/CD Secrets Setup Script

REPO="okgoogle13/careercopilot"

echo "🔐 Setting up CI/CD secrets for $REPO"

# Check gh CLI
if ! command -v gh &> /dev/null; then
    echo "❌ Install GitHub CLI: brew install gh"
    exit 1
fi

# Authenticate
gh auth status || gh auth login

# Show current secrets
echo "📋 Current secrets:"
gh secret list --repo "$REPO"
echo ""

# Chromatic
echo "🎨 CHROMATIC_PROJECT_TOKEN"
echo "   Get from: https://www.chromatic.com/start"
read -sp "   Enter token: " CHROMATIC_TOKEN
echo ""
echo "$CHROMATIC_TOKEN" | gh secret set CHROMATIC_PROJECT_TOKEN --repo "$REPO"
echo "✅ Set"
echo ""

# Supabase Project ID
echo "🗄️  SUPABASE_PROJECT_ID"
read -p "   Enter Project ID: " SUPABASE_PROJECT
echo "$SUPABASE_PROJECT" | gh secret set SUPABASE_PROJECT_ID --repo "$REPO"
echo "✅ Set"
echo ""

# Supabase Access Token
echo "🔑 SUPABASE_ACCESS_TOKEN"
read -sp "   Enter token: " SUPABASE_ACCESS
echo ""
echo "$SUPABASE_ACCESS" | gh secret set SUPABASE_ACCESS_TOKEN --repo "$REPO"
echo "✅ Set"
echo ""

# Supabase Anon Key
echo "🔓 SUPABASE_ANON_KEY"
read -sp "   Enter key: " SUPABASE_ANON
echo ""
echo "$SUPABASE_ANON" | gh secret set SUPABASE_ANON_KEY --repo "$REPO"
echo "✅ Set"
echo ""

# Final verification
echo "✅ Setup complete!"
gh secret list --repo "$REPO"
```

**Usage:**
```bash
chmod +x scripts/setup-ci-secrets.sh
./scripts/setup-ci-secrets.sh
```

---

## 🔒 **Security Best Practices**

### 1. Never Commit Secrets
```bash
# Add to .gitignore
echo "*.secret" >> .gitignore
echo ".env.local" >> .gitignore
```

### 2. Clear Shell History
```bash
# After setting secrets, clear history
history -c
```

### 3. Use Environment-Specific Secrets
```bash
# Staging
gh secret set GEMINI_API_KEY_STAGING --repo okgoogle13/careercopilot

# Production
gh secret set GEMINI_API_KEY_PRODUCTION --repo okgoogle13/careercopilot
```

### 4. Rotate Regularly
```bash
# Set reminder to rotate every 90 days
# Update with new values:
gh secret set SECRET_NAME --repo okgoogle13/careercopilot
```

### 5. Principle of Least Privilege
- Use read-only tokens when possible
- Scope tokens to specific resources
- Use staging/test keys for CI, not production

---

## 🔗 **GitHub CLI Installation**

```bash
# macOS
brew install gh

# Linux (Debian/Ubuntu)
sudo apt install gh

# Linux (Fedora/RHEL)
sudo dnf install gh

# Verify
gh --version

# Authenticate
gh auth login
```

---

## 📞 **Troubleshooting**

### "secret not found"
```bash
# Check exact name
gh secret list --repo okgoogle13/careercopilot

# Names are case-sensitive!
```

### "permission denied"
```bash
# Re-authenticate
gh auth logout
gh auth login

# Ensure you have admin access to the repo
```

### "API rate limit exceeded"
```bash
# Wait 1 hour or authenticate with a different account
gh auth status
```

---

## 🎯 **Common Workflows**

### Bulk Secret Update
```bash
# Update multiple secrets at once
secrets=("SECRET1" "SECRET2" "SECRET3")
for secret in "${secrets[@]}"; do
  read -sp "Enter value for $secret: " value
echo ""
echo "$value" | gh secret set "$secret" --repo okgoogle13/careercopilot
done
```

### Export Secrets (for backup - CAREFUL!)
```bash
# List secrets (values are hidden)
gh secret list --repo okgoogle13/careercopilot > secrets-backup.txt

# NOTE: This only backs up names, not values!
# Values cannot be retrieved via API for security
```

### Sync Secrets Across Repos
```bash
# Copy secret from one repo to another
REPO1="okgoogle13/careercopilot"
REPO2="okgoogle13/other-repo"

# Prompt for value once, set in both
read -sp "Enter GEMINI_API_KEY: " API_KEY
echo ""
echo "$API_KEY" | gh secret set GEMINI_API_KEY --repo "$REPO1"
echo "$API_KEY" | gh secret set GEMINI_API_KEY --repo "$REPO2"
done
```

---

## 📚 **Additional Resources**

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub CLI Manual](https://cli.github.com/manual/gh_secret)
- [Chromatic Documentation](https://www.chromatic.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)

---

**Last Updated:** 2026-01-31 04:03:50  
**Maintainer:** @okgoogle13