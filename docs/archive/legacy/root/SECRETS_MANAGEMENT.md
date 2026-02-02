# 🔐 CareerCopilot Secrets Management Guide

This document is the **single source of truth** for all secrets management across GitHub, Google Cloud Secret Manager, and application runtime configuration.

---

## 🏗️ Architecture Overview

### Secrets Flow

```
Development Environment:
Local .env files → Environment Variables → Backend Application

Production Environment:
Google Cloud Secret Manager → Backend Application

CI/CD Environment:
GitHub Secrets → GitHub Actions → GCP Deployment
```

### Key Components

1. **`./scripts/setup-secrets.sh`** - Unified secrets setup for all platforms
2. **`./scripts/validate-secrets.sh`** - Comprehensive validation and health checks
3. **`./scripts/production-secrets-validator.py`** - Python validator for production
4. **`backend/app/core/secret_manager.py`** - Secret Manager integration
5. **`backend/app/core/secure_config.py`** - Secure configuration management

---

## 🚀 Quick Start

### Production Deployment

```bash
# 1. Validate current secrets status
./scripts/validate-secrets.sh

# 2. Set up missing secrets interactively
./scripts/setup-secrets.sh all production

# 3. Final validation
./scripts/validate-secrets.sh all production

# 4. Deploy with confidence
./scripts/deploy.sh production
```

### Local Development

```bash
# 1. Set up local environment
./scripts/setup-secrets.sh

# 2. Test configuration
python3 scripts/test-configuration.py

# 3. Run development server
cd backend && python -m uvicorn app.main:app --reload
```

### Quick Reference

```bash
# Show all available commands
./scripts/secrets-quick-reference.sh

# Platform-specific setup
./scripts/setup-secrets.sh github production    # GitHub secrets only
./scripts/setup-secrets.sh gcp production       # GCP secrets only
./scripts/setup-secrets.sh aws-ses all           # AWS SES credentials
```

---

## 📋 Required Secrets

### Critical Secrets (Required for Production)

| Secret ID               | Description              | Format             | Environment Variable    |
| ----------------------- | ------------------------ | ------------------ | ----------------------- |
| `gemini-api-key`        | Google Gemini API Key    | `AIzaSy...`        | `GEMINI_API_KEY`        |
| `anthropic-api-key`     | Anthropic Claude API Key | `sk-ant-api03-...` | `ANTHROPIC_API_KEY`     |
| `openai-api-key`        | OpenAI API Key           | `sk-proj-...`      | `OPENAI_API_KEY`        |
| `jwt-secret-key`        | JWT Secret Key           | Min 32 chars       | `JWT_SECRET_KEY`        |
| `database-url`          | Database Connection      | `postgresql://...` | `DATABASE_URL`          |
| `aws-access-key-id`     | AWS Access Key ID        | 20 chars           | `AWS_ACCESS_KEY_ID`     |
| `aws-secret-access-key` | AWS Secret Access Key    | 40 chars           | `AWS_SECRET_ACCESS_KEY` |
| `ses-sender-email`      | SES Verified Email       | email address      | `SES_SENDER_EMAIL`      |

### GitHub Secrets (CI/CD)

| Secret                                           | Purpose                  | Environment |
| ------------------------------------------------ | ------------------------ | ----------- |
| `GCP_PROJECT_ID`                                 | Production GCP project   | Repository  |
| `GCP_STAGING_PROJECT_ID`                         | Staging GCP project      | Staging Env |
| `FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT`         | Production Firebase      | Repository  |
| `FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT_STAGING` | Staging Firebase         | Staging Env |
| `TC_CLOUD_TOKEN`                                 | Testcontainers Cloud     | Repository  |
| `CODECOV_TOKEN`                                  | Code coverage (optional) | Repository  |

### Optional Secrets

| Secret                     | Description       | Purpose             |
| -------------------------- | ----------------- | ------------------- |
| `perplexity-api-key`       | Perplexity AI API | Search augmentation |
| `redis-password`           | Redis password    | Caching (if used)   |
| `GOOGLE_OAUTH_CLIENT_ID_*` | OAuth clients     | Authentication      |

---

## 🔧 Platform Configuration

### GitHub Secrets Setup

**Automated Setup:**

```bash
./scripts/setup-secrets.sh github production
```

**Manual Setup:**

```bash
# Install GitHub CLI
brew install gh

# Login to GitHub
gh auth login

# Set secrets
gh secret set GEMINI_API_KEY --body "your-key"
gh secret set GCP_PROJECT_ID --body "careercopilot-468811"
```

**Environment-Specific Secrets:**

- **Repository Level**: Base secrets for all environments
- **Staging Environment**: Staging-specific secrets
- **Production Environment**: Production secrets with protection rules

### Google Cloud Secret Manager Setup

**Automated Setup:**

```bash
./scripts/setup-secrets.sh gcp production
```

**Manual Setup:**

```bash
# Set project
gcloud config set project careercopilot-468811

# Create secret
echo -n "your-secret-value" | gcloud secrets create SECRET_NAME \
  --data-file=- \
  --replication-policy=automatic

# Grant access to Cloud Run
SERVICE_ACCOUNT="careercopilot-backend@careercopilot-468811.iam.gserviceaccount.com"
gcloud secrets add-iam-policy-binding SECRET_NAME \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor"
```

### AWS SES Configuration

**Setup for Both Platforms:**

```bash
./scripts/setup-secrets.sh aws-ses all
```

**Manual Verification:**

```bash
# Check AWS SES verification
aws ses get-identity-verification-attributes --identities your-email@gmail.com

# Test email sending
python3 -c "
from backend.app.services.email_service import send_email
result = send_email('test@example.com', 'Test', '<h1>Test</h1>')
print(result)
"
```

---

## 🔒 Security Best Practices

### 1. Never Commit Secrets

```bash
# .gitignore (already configured)
.env*
*.key
*.json
firebase-*-key.json
gcp-*-key.json
```

### 2. Use Environment-Specific Secrets

- **Development**: Local `.env` files
- **Staging**: GitHub staging environment + GCP staging project
- **Production**: GitHub production environment + GCP production project

### 3. Principle of Least Privilege

```bash
# Example: Minimal Cloud Run permissions
gcloud projects add-iam-policy-binding careercopilot-468811 \
  --member="serviceAccount:careercopilot-backend@careercopilot-468811.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# NOT: roles/secretmanager.admin (too broad)
```

### 4. Regular Rotation

| Secret Type          | Rotation Frequency |
| -------------------- | ------------------ |
| API Keys             | Every 90 days      |
| Database Passwords   | Every 180 days     |
| JWT Secrets          | Every 365 days     |
| Service Account Keys | Every 90 days      |

### 5. Monitoring and Auditing

```bash
# Check secret access logs
gcloud logging read "resource.type=secret_manager_secret" --limit=50

# Monitor GitHub secret usage
gh secret list --repo okgoogle13/careercopilot

# Validate no hardcoded secrets
grep -r "sk-" . --exclude-dir=.git --exclude-dir=node_modules
```

---

## 🚨 Incident Response

### If Secrets Are Compromised

1. **Immediate Revocation**:

   ```bash
   # GitHub
   gh secret delete SECRET_NAME

   # GCP
   gcloud secrets versions delete VERSION_ID --secret=SECRET_NAME
   ```

2. **Generate New Secrets**:

   ```bash
   ./scripts/setup-secrets.sh all production --from-env
   ```

3. **Update All Environments**:

   ```bash
   ./scripts/validate-secrets.sh all production
   ```

4. **Audit Access Logs**:
   ```bash
   gcloud logging read "resource.type=secret_manager_secret" --limit=100
   ```

### If Secrets Are Accidentally Committed

1. **Remove from Repository**:

   ```bash
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch path/to/secret' \
     --prune-empty --tag-name-filter cat -- --all
   ```

2. **Force Push**:

   ```bash
   git push origin --force --all
   ```

3. **Rotate All Secrets**:
   ```bash
   ./scripts/setup-secrets.sh all production
   ```

---

## 🔍 Validation and Monitoring

### Pre-Deployment Checklist

- [ ] All required secrets are set
- [ ] No hardcoded credentials in code
- [ ] Environment validation passes
- [ ] Service accounts have minimal permissions
- [ ] API keys are valid and not expired
- [ ] Secret access logs are clean

### Automated Validation

```bash
# Comprehensive validation
./scripts/validate-secrets.sh all production

# Platform-specific validation
./scripts/validate-secrets.sh github staging
./scripts/validate-secrets.sh gcp production

# Generate deployment readiness report
./scripts/validate-secrets.sh all production --report
```

### Monitoring Commands

```bash
# Check secret access patterns
gcloud logging read "resource.type=secret_manager_secret" --format="table(timestamp,severity,protoPayload.methodName)"

# Monitor GitHub Actions secret usage
gh run list --limit=10 --json=databaseId,headBranch,conclusion

# Validate no secrets in code
git grep -i "sk-\|aiza\|gocsp" -- :!*.md :!*.txt
```

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. "Permission denied" accessing secrets

**Cause**: Service account lacks proper permissions  
**Solution**:

```bash
SERVICE_ACCOUNT="careercopilot-backend@careercopilot-468811.iam.gserviceaccount.com"
gcloud secrets add-iam-policy-binding SECRET_NAME \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor"
```

#### 2. "Secret not found" in GitHub Actions

**Cause**: Secret not set at correct environment level  
**Solution**:

```bash
# Check repository level
gh secret list --repo okgoogle13/careercopilot

# Check environment level
gh secret list --repo okgoogle13/careercopilot --env staging
```

#### 3. AWS SES email not sending

**Cause**: Gmail not verified or sandbox mode  
**Solution**:

```bash
# Check verification status
aws ses get-identity-verification-attributes --identities your-email@gmail.com

# Request production access (if still in sandbox)
aws ses request-production-access
```

#### 4. "Invalid credentials" error

**Cause**: Expired or rotated API keys  
**Solution**:

```bash
# Validate all secrets
./scripts/validate-secrets.sh all production

# Update specific secret
./scripts/setup-secrets.sh gcp production --from-env
```

### Debug Commands

```bash
# Test secret access
gcloud secrets versions access latest --secret=gemini-api-key

# Validate GitHub authentication
gh auth status

# Test AWS credentials
aws sts get-caller-identity

# Check Firebase configuration
python3 scripts/test-configuration.py
```

---

## 📚 Additional Resources

### Documentation

- **AWS SES Setup**: `docs/AWS_SES_SETUP.md`
- **GitHub Actions**: `.github/workflows/`
- **Firebase Security**: Firebase Console → Security Rules
- **GCP IAM**: Google Cloud Console → IAM & Admin

### External References

- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [GCP Secret Manager](https://cloud.google.com/secret-manager/docs)
- [AWS SES Developer Guide](https://docs.aws.amazon.com/ses/)

### Scripts Reference

- **Setup Commands**: `./scripts/secrets-quick-reference.sh`
- **Validation**: `./scripts/validate-secrets.sh --help`
- **Production Setup**: `./scripts/setup-secrets.sh --help`

---

## 📞 Emergency Contacts

| Service      | Action                  | Contact                  |
| ------------ | ----------------------- | ------------------------ |
| GitHub       | Revoke secrets          | GitHub Security Settings |
| Google Cloud | Revoke credentials      | GCP Console → IAM        |
| AWS          | Revoke access keys      | AWS IAM Console          |
| Firebase     | Revoke service accounts | Firebase Console         |

---

**Last Updated**: 2025-01-29  
**Maintained By**: CareerCopilot DevOps Team  
**Version**: 2.0 (Consolidated)
