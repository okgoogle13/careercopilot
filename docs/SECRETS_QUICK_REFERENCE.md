# 🔐 Secrets Management Quick Reference

Fast commands for common secrets operations.

---

## 🚀 Setup Commands

### All Platforms
```bash
./scripts/setup-secrets.sh                    # All platforms, production, interactive
./scripts/setup-secrets.sh all staging        # All platforms, staging
./scripts/setup-secrets.sh all development    # All platforms, development
```

### Platform-Specific
```bash
./scripts/setup-secrets.sh github production  # GitHub secrets only
./scripts/setup-secrets.sh gcp production     # GCP secrets only
./scripts/setup-secrets.sh aws-ses all        # AWS SES credentials
```

### Environment-Specific
```bash
./scripts/setup-secrets.sh all development    # Development environment
./scripts/setup-secrets.sh all staging        # Staging environment
./scripts/setup-secrets.sh all production     # Production environment
```

### Setup Modes
```bash
./scripts/setup-secrets.sh all prod interactive  # Interactive prompts (default)
./scripts/setup-secrets.sh all prod from-env      # From environment variables
./scripts/setup-secrets.sh all prod validate       # Validate only
```

---

## 🔍 Validation Commands

### Comprehensive Validation
```bash
./scripts/validate-secrets.sh                 # Validate all secrets
./scripts/validate-secrets.sh all production  # Validate production secrets
./scripts/validate-secrets.sh all staging     # Validate staging secrets
```

### Platform-Specific Validation
```bash
./scripts/validate-secrets.sh github staging  # Validate GitHub staging secrets
./scripts/validate-secrets.sh gcp production  # Validate GCP production secrets
./scripts/validate-secrets.sh aws-ses all     # Validate AWS SES secrets
```

---

## 🛠️ Specialized Scripts

### AWS SES (Email Service)
```bash
./scripts/setup-aws-ses-secrets.sh          # AWS SES to GCP Secret Manager
./scripts/setup-aws-ses-github-secrets.sh   # AWS SES to GitHub Secrets
```

### Production Validation
```bash
python3 scripts/production-secrets-validator.py    # Python validator
python3 scripts/production-secrets-validator.py --checklist  # Generate checklist
```

### Local Development
```bash
./scripts/setup-secrets.sh                # Interactive local setup
python3 scripts/test-configuration.py   # Validate local config
```

---

## 📋 Common Workflows

### New Developer Setup
```bash
# 1. Local development setup
./scripts/setup-secrets.sh

# 2. Validate local configuration
python3 scripts/test-configuration.py

# 3. Start development server
cd backend && python -m uvicorn app.main:app --reload
```

### Production Deployment
```bash
# 1. Validate all secrets
./scripts/validate-secrets.sh all production

# 2. Set up any missing secrets
./scripts/setup-secrets.sh all production

# 3. Final validation
./scripts/validate-secrets.sh all production

# 4. Deploy
./scripts/deploy.sh production
```

### Staging Deployment
```bash
# 1. Setup staging secrets
./scripts/setup-secrets.sh all staging

# 2. Validate staging
./scripts/validate-secrets.sh all staging

# 3. Deploy staging
./scripts/deploy.sh staging
```

### AWS SES Setup
```bash
# 1. Setup AWS SES for all platforms
./scripts/setup-secrets.sh aws-ses all

# 2. Validate AWS SES configuration
./scripts/validate-secrets.sh aws-ses all

# 3. Test email sending
python3 -c "from backend.app.services.email_service import send_email; print(send_email('test@example.com', 'Test', '<h1>Test</h1>'))"
```

---

## 🔧 Environment Variables

### For from-env Mode
```bash
# GitHub Secrets
export GEMINI_API_KEY="your-gemini-key"
export OPENAI_API_KEY="your-openai-key"
export ANTHROPIC_API_KEY="your-anthropic-key"

# AWS SES
export AWS_ACCESS_KEY_ID="your-aws-key"
export AWS_SECRET_ACCESS_KEY="your-aws-secret"
export SES_SENDER_EMAIL="your-email@gmail.com"

# GCP Project
export GCP_PROJECT_ID="careercopilot-468811"
export GCP_STAGING_PROJECT_ID="careercopilot-staging"

# Run setup from environment
./scripts/setup-secrets.sh all production from-env
```

---

## 🚨 Emergency Commands

### Revoke All GitHub Secrets
```bash
gh secret delete GEMINI_API_KEY
gh secret delete OPENAI_API_KEY
gh secret delete ANTHROPIC_API_KEY
gh secret delete AWS_ACCESS_KEY_ID
gh secret delete AWS_SECRET_ACCESS_KEY
gh secret delete SES_SENDER_EMAIL
```

### Revoke GCP Secrets
```bash
gcloud secrets delete gemini-api-key --quiet
gcloud secrets delete openai-api-key --quiet
gcloud secrets delete anthropic-api-key --quiet
gcloud secrets delete aws-access-key-id --quiet
gcloud secrets delete aws-secret-access-key --quiet
gcloud secrets delete ses-sender-email --quiet
```

### Quick Health Check
```bash
./scripts/validate-secrets.sh all production
```

---

## 📞 Help Commands

```bash
./scripts/setup-secrets.sh help              # Setup help
./scripts/validate-secrets.sh help           # Validation help
./scripts/secrets-quick-reference.sh         # Show this reference
```

---

## 🔗 Related Documentation

- **Complete Guide**: `docs/SECRETS_MANAGEMENT.md`
- **AWS SES Setup**: `docs/AWS_SES_SETUP.md`
- **GitHub Actions**: `.github/workflows/`
- **Project Index**: `CLAUDE.md`
