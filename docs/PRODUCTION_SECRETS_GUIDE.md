# 🔐 Production Secrets Management Guide

## Overview

CareerCopilot uses **Google Cloud Secret Manager** for secure production secrets management with automatic fallback to environment variables for local development. This guide covers the complete secrets management workflow.

## 🏗️ Architecture

### Secrets Flow
```
Production Environment:
Google Cloud Secret Manager → Backend Application

Development Environment:
Local .env files → Environment Variables → Backend Application

Fallback Chain:
Secret Manager → Environment Variables → Default Values → Error
```

### Key Components

1. **`scripts/setup-production-secrets.py`** - Interactive secrets setup
2. **`scripts/production-secrets-validator.py`** - Secrets validation and deployment readiness
3. **`backend/app/core/secret_manager.py`** - Secret Manager integration
4. **`backend/app/core/secure_config.py`** - Secure configuration management

## 🚀 Quick Start

### Production Deployment
```bash
# 1. Validate current secrets status
python3 scripts/production-secrets-validator.py

# 2. Set up missing secrets interactively
python3 scripts/setup-production-secrets.py

# 3. Generate deployment checklist
python3 scripts/production-secrets-validator.py --checklist

# 4. Deploy with confidence
gcloud run deploy careercopilot-backend --source .
```

### Local Development
```bash
# 1. Set up local environment
./setup-api-keys.sh

# 2. Test configuration
python3 scripts/test-configuration.py

# 3. Run development server
cd backend && python -m uvicorn app.main:app --reload
```

## 📋 Required Secrets

### Critical Secrets (Required for Production)
| Secret ID | Description | Format | Environment Variable |
|-----------|-------------|--------|---------------------|
| `openai-api-key` | OpenAI API Key | `sk-proj-...` | `OPENAI_API_KEY` |
| `anthropic-api-key` | Anthropic Claude API Key | `sk-ant-api03-...` | `ANTHROPIC_API_KEY` |
| `gemini-api-key` | Google Gemini API Key | `AIzaSy...` | `GEMINI_API_KEY` |
| `jwt-secret-key` | JWT Secret Key | Min 32 chars | `JWT_SECRET_KEY` |
| `database-url` | Database Connection | `postgresql://...` | `DATABASE_URL` |
| `firebase-credentials-json` | Firebase Admin SDK | JSON string | `FIREBASE_CREDENTIALS_JSON` |
| `firebase-project-id` | Firebase Project ID | `project-name` | `FIREBASE_PROJECT_ID` |
| `firebase-storage-bucket` | Firebase Storage Bucket | `project.appspot.com` | `FIREBASE_STORAGE_BUCKET` |

### Optional Secrets
| Secret ID | Description | Format | Environment Variable |
|-----------|-------------|--------|---------------------|
| `redis-password` | Redis Password | Min 8 chars | `REDIS_PASSWORD` |
| `sendgrid-api-key` | SendGrid API Key | `SG.xxx...` | `SENDGRID_API_KEY` |
| `perplexity-api-key` | Perplexity API Key | `pplx-...` | `PERPLEXITY_API_KEY` |

## 🔧 Commands Reference

### Setup Commands
```bash
# Interactive production secrets setup
python3 scripts/setup-production-secrets.py

# Setup specific project
python3 scripts/setup-production-secrets.py --project-id your-project-id

# Validate only (no setup)
python3 scripts/setup-production-secrets.py --validate
```

### Validation Commands
```bash
# Basic validation
python3 scripts/production-secrets-validator.py

# JSON output for CI/CD
python3 scripts/production-secrets-validator.py --json

# Generate deployment checklist
python3 scripts/production-secrets-validator.py --checklist

# Generate environment template
python3 scripts/production-secrets-validator.py --env-template
```

### Configuration Commands
```bash
# Test complete configuration
python3 scripts/test-configuration.py

# Interactive local setup
./setup-api-keys.sh

# Firebase configuration
python3 scripts/setup-firebase-config.py
```

## 🔒 Security Best Practices

### Secret Manager Security
1. **Use separate projects** for different environments
2. **Enable audit logging** for secret access
3. **Rotate secrets regularly** (quarterly minimum)
4. **Use service accounts** with minimal permissions
5. **Never log secret values** in application logs

### Local Development Security
1. **Never commit** `.env` files with real secrets
2. **Use development-specific** API keys when possible
3. **Set file permissions** on sensitive files (`chmod 600`)
4. **Use encrypted drives** for development machines

### Production Security
1. **Use Google Cloud IAM** for access control
2. **Enable Cloud Audit Logs** for monitoring
3. **Use Cloud KMS** for additional encryption layers
4. **Implement secret rotation** workflows

## 🐳 Docker & Container Deployment

### Environment Variables for Containers
```bash
# Required environment variables for production containers
export GCP_PROJECT_ID=careercopilot-468811
export ENV=production
export USE_SECRET_MANAGER=true

# Optional: Service account key (JSON)
export GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type": "service_account",...}'

# Or: Path to service account file
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
```

### Cloud Run Deployment
```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'careercopilot-backend'
      - '--source=.'
      - '--set-env-vars=GCP_PROJECT_ID=careercopilot-468811,ENV=production,USE_SECRET_MANAGER=true'
      - '--region=us-central1'
```

## 🔍 Troubleshooting

### Common Issues

#### Secret Manager Authentication
```bash
# Error: Could not initialize Secret Manager client
# Solution: Set up authentication
gcloud auth application-default login

# Or set service account credentials
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

#### Permission Denied
```bash
# Error: Permission denied accessing secrets
# Solution: Add Secret Manager roles
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="user:your-email@domain.com" \
  --role="roles/secretmanager.secretAccessor"
```

#### Invalid Secret Format
```bash
# Error: Secret value has invalid format
# Solution: Check secret format requirements
python3 scripts/production-secrets-validator.py --checklist
```

### Validation Failures

#### Missing Critical Secrets
```bash
# 1. Check what's missing
python3 scripts/production-secrets-validator.py

# 2. Set up missing secrets
python3 scripts/setup-production-secrets.py

# 3. Validate again
python3 scripts/production-secrets-validator.py --json
```

#### Environment Variable Conflicts
```bash
# Check environment variables
env | grep -E "(API_KEY|SECRET|TOKEN)"

# Clear conflicting variables
unset OPENAI_API_KEY  # Example

# Re-validate
python3 scripts/test-configuration.py
```

## 📊 Monitoring & Observability

### Secrets Access Monitoring
```bash
# Enable audit logging
gcloud logging sinks create secret-access-logs \
  bigquery.googleapis.com/projects/PROJECT_ID/datasets/audit_logs

# Query secret access
bq query --use_legacy_sql=false '
SELECT
  timestamp,
  protoPayload.authenticationInfo.principalEmail,
  protoPayload.resourceName
FROM `PROJECT_ID.audit_logs.cloudaudit_googleapis_com_data_access`
WHERE protoPayload.serviceName = "secretmanager.googleapis.com"
ORDER BY timestamp DESC
LIMIT 100'
```

### Application Health Checks
```bash
# Check secrets availability in application
curl https://your-app.run.app/health

# Expected response includes secrets validation
{
  "status": "healthy",
  "secrets_validation": {
    "openai-api-key": true,
    "anthropic-api-key": true,
    ...
  }
}
```

## 🔄 Secret Rotation Workflow

### Quarterly Rotation Process
```bash
# 1. Generate new API keys from providers
# 2. Update secrets in Secret Manager
gcloud secrets versions add SECRET_ID --data-file=new-key.txt

# 3. Test new secrets
python3 scripts/production-secrets-validator.py

# 4. Deploy updated application
gcloud run deploy careercopilot-backend --source .

# 5. Verify deployment health
curl https://your-app.run.app/health

# 6. Deactivate old API keys at providers
```

### Automated Rotation (Advanced)
```python
# Example: Automated JWT secret rotation
import secrets
import string

def generate_jwt_secret(length=64):
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(alphabet) for _ in range(length))

# Use with Cloud Scheduler + Cloud Functions for automation
```

## 📚 Additional Resources

- [Google Cloud Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)
- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [OpenAI API Key Management](https://platform.openai.com/api-keys)
- [Anthropic Claude API Setup](https://console.anthropic.com/)
- [Google AI Studio (Gemini)](https://aistudio.google.com/)

---

## 🆘 Support

If you encounter issues:

1. **Check the deployment checklist**: `python3 scripts/production-secrets-validator.py --checklist`
2. **Validate configuration**: `python3 scripts/test-configuration.py`
3. **Review logs**: Check Cloud Run logs for secret access errors
4. **Test locally**: Ensure secrets work in development environment first