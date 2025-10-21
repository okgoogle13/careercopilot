# AWS SES Quick Start Guide

**🎯 Goal**: Set up AWS SES for free email notifications using your Gmail

**⏱️ Time**: ~15 minutes

---

## Prerequisites

- [ ] AWS Account (free)
- [ ] Gmail address
- [ ] `gcloud` CLI installed
- [ ] `gh` CLI installed (optional)

---

## 5-Step Setup

### 1️⃣ AWS Setup (5 min)

**Verify Gmail:**
```
1. AWS Console → SES → Verified identities
2. Create identity → Email address → Enter your Gmail
3. Check Gmail → Click verification link
```

**Create IAM User:**
```
1. AWS Console → IAM → Users → Create user
2. Username: careercopilot-ses-user
3. Attach policy: AmazonSESFullAccess
4. Create access key → Download .csv
```

---

### 2️⃣ Add to Google Secret Manager (3 min)

```bash
./scripts/setup-aws-ses-secrets.sh
```

**Enter when prompted:**
- AWS Access Key ID (from .csv)
- AWS Secret Access Key (from .csv)
- SES Sender Email (your Gmail)

---

### 3️⃣ Add to GitHub Secrets (2 min) - Optional

```bash
./scripts/setup-aws-ses-github-secrets.sh
```

Same credentials as above.

---

### 4️⃣ Update Requirements (1 min)

```bash
pip-compile backend/requirements.in
```

---

### 5️⃣ Deploy & Test (5 min)

```bash
# Deploy to staging
./scripts/deploy.sh staging

# Verify secrets loaded
python3 scripts/production-secrets-validator.py
```

---

## Quick Commands

```bash
# Setup GCP secrets (interactive)
./scripts/setup-aws-ses-secrets.sh

# Setup GitHub secrets (interactive)
./scripts/setup-aws-ses-github-secrets.sh

# Validate all secrets
python3 scripts/production-secrets-validator.py

# Update requirements
pip-compile backend/requirements.in

# Deploy
./scripts/deploy.sh staging
```

---

## What You Need from AWS

After creating IAM user:
- ✅ **Access Key ID**: 20 characters (e.g., `AKIAIOSFODNN7EXAMPLE`)
- ✅ **Secret Access Key**: 40 characters (e.g., `wJalrXUt...`)
- ✅ **Sender Email**: Your verified Gmail

---

## Troubleshooting

**Email not sending?**
```
1. Check AWS SES → Verified identities (must show "Verified")
2. Verify credentials are correct in Secret Manager
3. Check you're in us-east-1 region
4. If sandbox mode, request production access
```

**"Access Denied" error?**
```
1. IAM user needs AmazonSESFullAccess policy
2. Regenerate access key if needed
```

---

## Cost

| Item | Cost |
|------|------|
| AWS SES | **FREE** (62k emails/month) |
| Gmail | **FREE** |
| Total | **$0/month** |

---

## Full Documentation

- **Complete Setup**: [docs/AWS_SES_SETUP.md](docs/AWS_SES_SETUP.md)
- **Migration Summary**: [AWS_SES_MIGRATION_SUMMARY.md](AWS_SES_MIGRATION_SUMMARY.md)
- **AWS SES Docs**: https://docs.aws.amazon.com/ses/

---

## Help

Stuck? Check the troubleshooting section in [docs/AWS_SES_SETUP.md](docs/AWS_SES_SETUP.md#troubleshooting)
