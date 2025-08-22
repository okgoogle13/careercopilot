# 🚀 CareerCopilot Setup Guide

Complete configuration guide for setting up CareerCopilot in staging and production environments.

## 📋 Required GitHub Secrets Checklist

### 🔥 Firebase Configuration
| Secret Name | Description | Where to Find |
|-------------|-------------|---------------|
| `FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT_STAGING` | Firebase service account JSON for staging | Firebase Console > Project Settings > Service Accounts |
| `FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT` | Firebase service account JSON for production | Firebase Console > Project Settings > Service Accounts |

### ☁️ Google Cloud Platform
| Secret Name | Description | Where to Find |
|-------------|-------------|---------------|
| `GCP_STAGING_PROJECT_ID` | Google Cloud staging project ID | GCP Console > Project selector |
| `GCP_PROJECT_ID` | Google Cloud production project ID | GCP Console > Project selector |
| `GCP_STAGING_SA_KEY` | Staging service account key JSON | GCP Console > IAM > Service Accounts |
| `GCP_SA_KEY` | Production service account key JSON | GCP Console > IAM > Service Accounts |

### 🧠 AI Service API Keys
| Secret Name | Description | Where to Get |
|-------------|-------------|--------------|
| `GEMINI_API_KEY` | Google Gemini API key | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `OPENAI_API_KEY` | OpenAI API key | [OpenAI API Keys](https://platform.openai.com/api-keys) |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | [Anthropic Console](https://console.anthropic.com/) |
| `PERPLEXITY_API_KEY` | Perplexity API key | [Perplexity API](https://docs.perplexity.ai/) |

### 📊 Vector Database & Services
| Secret Name | Description | Where to Get |
|-------------|-------------|--------------|
| `PINECONE_API_KEY` | Pinecone vector database API key | [Pinecone Console](https://app.pinecone.io/) |
| `PINECONE_ENVIRONMENT` | Pinecone environment name | Pinecone Console > Environment |
| `PINECONE_INDEX_NAME` | Pinecone index name | `careercopilot-index` |
| `SENDGRID_API_KEY` | SendGrid email service API key | [SendGrid API Keys](https://app.sendgrid.com/settings/api_keys) |

### 🔐 OAuth Configuration
| Secret Name | Description | Where to Get |
|-------------|-------------|--------------|
| `GOOGLE_OAUTH_CLIENT_ID_STAGING` | Google OAuth client ID for staging | [Google Cloud Console > APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials) |
| `GOOGLE_OAUTH_CLIENT_SECRET_STAGING` | Google OAuth client secret for staging | Google Cloud Console > APIs & Services > Credentials |
| `GOOGLE_OAUTH_CLIENT_ID_PROD` | Google OAuth client ID for production | Google Cloud Console > APIs & Services > Credentials |
| `GOOGLE_OAUTH_CLIENT_SECRET_PROD` | Google OAuth client secret for production | Google Cloud Console > APIs & Services > Credentials |

---

## 🔧 Step-by-Step Setup Instructions

### 1. 🔥 Firebase Project Setup

#### Create Projects
```bash
# Create staging project
firebase projects:create careercopilot-staging

# Create production project  
firebase projects:create careercopilot-prod
```

#### Configure Authentication
1. Go to Firebase Console > Authentication > Sign-in method
2. Enable **Email/Password** provider
3. Enable **Google** provider (optional)
4. Configure authorized domains

#### Generate Service Account Keys
```bash
# For staging
firebase admin:generate-service-account-key --project careercopilot-staging

# For production
firebase admin:generate-service-account-key --project careercopilot-prod
```

### 2. ☁️ Google Cloud Setup

#### Enable Required APIs
```bash
# Set project
gcloud config set project careercopilot-staging

# Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable firestore.googleapis.com
```

#### Create Service Accounts
```bash
# Create staging service account
gcloud iam service-accounts create careercopilot-staging \
    --description="CareerCopilot staging service account" \
    --display-name="CareerCopilot Staging"

# Create production service account
gcloud iam service-accounts create careercopilot-prod \
    --description="CareerCopilot production service account" \
    --display-name="CareerCopilot Production"
```

#### Grant Permissions
```bash
# Staging permissions
gcloud projects add-iam-policy-binding careercopilot-staging \
    --member="serviceAccount:careercopilot-staging@careercopilot-staging.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding careercopilot-staging \
    --member="serviceAccount:careercopilot-staging@careercopilot-staging.iam.gserviceaccount.com" \
    --role="roles/cloudbuild.builds.builder"

gcloud projects add-iam-policy-binding careercopilot-staging \
    --member="serviceAccount:careercopilot-staging@careercopilot-staging.iam.gserviceaccount.com" \
    --role="roles/datastore.user"
```

#### Create Service Account Keys
```bash
# Generate staging key
gcloud iam service-accounts keys create staging-key.json \
    --iam-account=careercopilot-staging@careercopilot-staging.iam.gserviceaccount.com

# Generate production key
gcloud iam service-accounts keys create prod-key.json \
    --iam-account=careercopilot-prod@careercopilot-prod.iam.gserviceaccount.com
```

### 3. 🧠 AI Services Setup

#### Google Gemini
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Copy the key (starts with `AIzaSy`)

#### OpenAI
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create new secret key
3. Copy the key (starts with `sk-`)

#### Anthropic Claude
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create new API key
3. Copy the key (starts with `sk-ant-`)

#### Perplexity
1. Go to [Perplexity API Docs](https://docs.perplexity.ai/)
2. Sign up and create API key
3. Copy the key

### 4. 📊 Vector Database Setup

#### Pinecone
1. Go to [Pinecone Console](https://app.pinecone.io/)
2. Create new index named `careercopilot-index`
3. Set dimensions: `1536` (for OpenAI embeddings)
4. Set metric: `cosine`
5. Copy API key and environment name

### 5. 📧 Email Service Setup

#### SendGrid
1. Go to [SendGrid](https://app.sendgrid.com/)
2. Create account and verify email
3. Go to Settings > API Keys
4. Create new API key with Mail Send permissions
5. Copy the key (starts with `SG.`)

---

## 🚀 Quick Setup Script

Run this script to add all secrets to GitHub:

```bash
#!/bin/bash

# Set your repository
REPO="okgoogle13/careercopilot"

# Add Firebase secrets
gh secret set FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT_STAGING --body "$(cat staging-firebase-key.json)" --repo $REPO
gh secret set FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT --body "$(cat prod-firebase-key.json)" --repo $REPO

# Add GCP secrets
gh secret set GCP_STAGING_PROJECT_ID --body "careercopilot-staging" --repo $REPO
gh secret set GCP_PROJECT_ID --body "careercopilot-prod" --repo $REPO
gh secret set GCP_STAGING_SA_KEY --body "$(cat staging-key.json)" --repo $REPO
gh secret set GCP_SA_KEY --body "$(cat prod-key.json)" --repo $REPO

# Add AI service keys (replace with your actual keys)
gh secret set GEMINI_API_KEY --body "YOUR_GEMINI_KEY" --repo $REPO
gh secret set OPENAI_API_KEY --body "YOUR_OPENAI_KEY" --repo $REPO  
gh secret set ANTHROPIC_API_KEY --body "YOUR_ANTHROPIC_KEY" --repo $REPO
gh secret set PERPLEXITY_API_KEY --body "YOUR_PERPLEXITY_KEY" --repo $REPO

# Add database and service keys
gh secret set PINECONE_API_KEY --body "YOUR_PINECONE_KEY" --repo $REPO
gh secret set PINECONE_ENVIRONMENT --body "YOUR_PINECONE_ENV" --repo $REPO
gh secret set PINECONE_INDEX_NAME --body "careercopilot-index" --repo $REPO
gh secret set SENDGRID_API_KEY --body "YOUR_SENDGRID_KEY" --repo $REPO

# Add OAuth secrets  
gh secret set GOOGLE_OAUTH_CLIENT_ID_STAGING --body "YOUR_STAGING_OAUTH_ID" --repo $REPO
gh secret set GOOGLE_OAUTH_CLIENT_SECRET_STAGING --body "YOUR_STAGING_OAUTH_SECRET" --repo $REPO
gh secret set GOOGLE_OAUTH_CLIENT_ID_PROD --body "YOUR_PROD_OAUTH_ID" --repo $REPO
gh secret set GOOGLE_OAUTH_CLIENT_SECRET_PROD --body "YOUR_PROD_OAUTH_SECRET" --repo $REPO

echo "✅ All secrets added to GitHub repository!"
```

---

## ✅ Verification Checklist

- [ ] Firebase projects created (staging & production)
- [ ] Firebase authentication enabled
- [ ] Google Cloud projects configured
- [ ] Service accounts created with proper permissions
- [ ] AI service API keys obtained
- [ ] Pinecone index created and configured
- [ ] SendGrid account set up
- [ ] All GitHub secrets added
- [ ] Deployment pipeline tested

---

## 🔒 Security Best Practices

1. **Rotate API keys regularly** using the provided rotation scripts
2. **Use different keys for staging and production**
3. **Monitor API usage and set billing alerts**
4. **Implement proper Firebase security rules**
5. **Regular security audits** with `./scripts/security-audit.sh`

---

## 🆘 Troubleshooting

### Common Issues

**Firebase deployment fails:**
- Check service account permissions
- Verify project IDs match
- Ensure Firebase CLI is authenticated

**Cloud Run deployment fails:**
- Check service account has Cloud Run Admin role
- Verify container registry permissions
- Check resource quotas

**API keys not working:**
- Verify keys are correctly copied (no extra spaces)
- Check API quotas and billing
- Ensure services are enabled

### Getting Help

1. Check the logs in GitHub Actions
2. Run `./scripts/security-audit.sh` for configuration issues
3. Use `./scripts/verify-rotation.sh` to validate setup
4. Check Firebase and Google Cloud Console for errors

---

*This guide will be updated as new services are added to CareerCopilot.*