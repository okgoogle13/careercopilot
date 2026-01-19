# AWS SES Setup Guide for CareerCopilot

This document is the **single source of truth** for the email service configuration, setup, security, and integration details.

---

## Overview

CareerCopilot uses AWS Simple Email Service (SES) for email notifications after migrating from SendGrid. The current configuration provides:

- **Service**: AWS SES (us-east-1 region)
- **Sender**: Verified Gmail address
- **Limit**: 62,000 emails/month (free tier)
- **Cost**: $0/month

---

## 1. Domain Verification & Authentication

### 1.1 Email Identity Status

| Identity           | Type          | Status      | Region    |
| ------------------ | ------------- | ----------- | --------- |
| `[verified-gmail]` | Email Address | ✅ Verified | us-east-1 |

### 1.2 Required DNS Records

**Not applicable** - Using email address verification (no domain setup required).

### 1.3 Authentication Configuration

| Method    | Status | Notes                    |
| --------- | ------ | ------------------------ |
| **SPF**   | N/A    | Email-based verification |
| **DKIM**  | N/A    | Email-based verification |
| **DMARC** | N/A    | Email-based verification |

### 1.4 Production Access

- **Sandbox Status**: Pending production access request
- **Current Limits**: 200 emails/day (sandbox mode)
- **Requested Limits**: 62,000 emails/month (full free tier)

---

## 2. Security & Secrets Management

### 2.1 Required Credentials

| Secret                  | Format        | Source         |
| ----------------------- | ------------- | -------------- |
| `AWS_ACCESS_KEY_ID`     | 20 characters | AWS IAM User   |
| `AWS_SECRET_ACCESS_KEY` | 40 characters | AWS IAM User   |
| `SES_SENDER_EMAIL`      | email address | Verified Gmail |
| `AWS_REGION`            | string        | `us-east-1`    |

### 2.2 Google Cloud Secret Manager Setup

**Script**: `./scripts/setup-aws-ses-secrets.sh`

```bash
# Interactive setup for production secrets
chmod +x scripts/setup-aws-ses-secrets.sh
./scripts/setup-aws-ses-secrets.sh
```

**Secret Names**:

- `aws-access-key-id`
- `aws-secret-access-key`
- `ses-sender-email`

**Service Account Access**:

```bash
# Grant Cloud Run access to secrets
SERVICE_ACCOUNT="$(gcloud run services describe backend --region=us-central1 --format='value(spec.template.spec.serviceAccountName)')"

gcloud secrets add-iam-policy-binding aws-access-key-id \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding aws-secret-access-key \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding ses-sender-email \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor"
```

### 2.3 GitHub Secrets Setup

**Script**: `./scripts/setup-aws-ses-github-secrets.sh`

```bash
# Interactive setup for CI/CD secrets
chmod +x scripts/setup-aws-ses-github-secrets.sh
./scripts/setup-aws-ses-github-secrets.sh
```

**Secret Names**:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `SES_SENDER_EMAIL`
- `AWS_REGION`

### 2.4 Secret Validation

**Command**: `python3 scripts/production-secrets-validator.py`

**Expected Output**:

```
✅ aws-access-key-id: Valid
✅ aws-secret-access-key: Valid
✅ ses-sender-email: Valid
```

---

## 3. Application Integration

### 3.1 Migration Summary

| Aspect              | Previous                   | Current                 |
| ------------------- | -------------------------- | ----------------------- |
| **Provider**        | SendGrid                   | AWS SES                 |
| **Cost**            | $19.95/month (or 3k limit) | $0/month (62k limit)    |
| **Domain Required** | Yes                        | No (Gmail verification) |
| **Library**         | `sendgrid`                 | `boto3`                 |

### 3.2 Implementation Details

**Email Service Module**: `backend/app/services/email_service.py`

- AWS SES client initialization
- HTML email support
- Error handling for SES exceptions
- Environment-based configuration

**Configuration Module**: `backend/app/core/secure_config.py`

- Loads AWS credentials from Secret Manager
- Environment fallback for local development
- Type-safe configuration management

**Notification Flow**: `backend/app/genkit_flows/notifier.py`

- Uses email service for job opportunity notifications
- Maintains existing HTML email templates
- Improved error logging and tracking

### 3.3 Environment Variables

| Variable                | Required      | Example                                    |
| ----------------------- | ------------- | ------------------------------------------ |
| `AWS_ACCESS_KEY_ID`     | Yes           | `AKIAIOSFODNN7EXAMPLE`                     |
| `AWS_SECRET_ACCESS_KEY` | Yes           | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION`            | No (defaults) | `us-east-1`                                |
| `SES_SENDER_EMAIL`      | Yes           | `your-email@gmail.com`                     |

### 3.4 Usage in Code

```python
from backend.app.services.email_service import send_email

result = send_email(
    to_email="user@example.com",
    subject="Job Opportunity Notification",
    html_content="<h1>New Job Found!</h1><p>Details...</p>"
)
```

---

## 4. Operational Context

### 4.1 Current Configuration

- **Sender**: Verified Gmail address
- **Region**: us-east-1 (N. Virginia)
- **Monthly Limit**: 62,000 emails (free tier)
- **Daily Limit**: 2,000 emails (sandbox mode until production access)

### 4.2 Monitoring

**AWS SES Console** → Account dashboard → Sending statistics

- Track delivery rates
- Monitor bounce/complaint rates
- Watch quota usage

### 4.3 Security Best Practices

1. **Credential Rotation**: Every 6-12 months
2. **Access Monitoring**: Regular AWS Console reviews
3. **Usage Alerts**: Set up CloudWatch alarms for quota limits
4. **No Hardcoded Values**: All credentials in Secret Manager

---

## 5. Troubleshooting

### 5.1 Common Issues

| Issue                          | Cause                     | Solution                              |
| ------------------------------ | ------------------------- | ------------------------------------- |
| "Email address not verified"   | Gmail not verified in SES | Verify email in AWS SES Console       |
| "Access Denied"                | Invalid IAM credentials   | Regenerate access key, update secrets |
| "Daily sending limit exceeded" | Sandbox mode              | Request production access             |
| Email not received             | Spam filter               | Check junk folder, verify recipient   |

### 5.2 Debug Commands

```bash
# Validate secrets
python3 scripts/production-secrets-validator.py

# Check AWS SES verification
aws ses get-identity-verification-attributes --identities your-email@gmail.com

# Test email locally (with .env.local)
python3 -c "
import os
from backend.app.services.email_service import send_email
result = send_email('test@example.com', 'Test', '<h1>Test</h1>')
print(result)
"
```

---

## 6. Setup Scripts Reference

### 6.1 Quick Setup Commands

```bash
# 1. Setup Google Cloud secrets
./scripts/setup-aws-ses-secrets.sh

# 2. Setup GitHub secrets (optional)
./scripts/setup-aws-ses-github-secrets.sh

# 3. Validate configuration
python3 scripts/production-secrets-validator.py

# 4. Update dependencies
pip-compile backend/requirements.in

# 5. Deploy and test
./scripts/deploy.sh staging
```

### 6.2 Script Details

| Script                            | Purpose                     | Platform         |
| --------------------------------- | --------------------------- | ---------------- |
| `setup-aws-ses-secrets.sh`        | Google Cloud Secret Manager | Production       |
| `setup-aws-ses-github-secrets.sh` | GitHub Secrets              | CI/CD            |
| `production-secrets-validator.py` | Validate all secrets        | All environments |

---

## 7. Migration History

- **Date**: 2025-01-06
- **From**: SendGrid (6.12.4) → AWS SES (boto3)
- **Reason**: Cost optimization and higher free tier limits
- **Status**: ✅ Complete - Ready for production deployment

---

## 8. Support & References

- **AWS SES Documentation**: https://docs.aws.amazon.com/ses/
- **boto3 SES Reference**: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ses.html
- **Migration Summary**: `AWS_SES_MIGRATION_SUMMARY.md`
- **Quick Start**: `AWS_SES_QUICK_START.md`
