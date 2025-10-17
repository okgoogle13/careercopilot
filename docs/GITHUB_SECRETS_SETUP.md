# GitHub Secrets Setup Guide

This document provides comprehensive instructions for setting up all required secrets for the CareerCopilot CI/CD workflows.

## Overview

The project uses **GitHub Secrets** for CI/CD workflows and **Google Cloud Secret Manager** for application runtime secrets. This guide focuses on GitHub Secrets setup.

## Required GitHub Secrets

### 1. CI Workflow Secrets (`ci.yml`)

#### Testcontainers Cloud
- **`TC_CLOUD_TOKEN`** - Testcontainers Cloud authentication token
  - **Purpose**: Enables containerized testing in CI environment
  - **How to get**: Sign up at https://testcontainers.cloud
  - **Required for**: Backend integration tests

#### Google Cloud Authentication (CI)
- **`GCP_WORKLOAD_IDENTITY_PROVIDER`** - Workload Identity Federation provider
  - **Format**: `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_NAME/providers/PROVIDER_NAME`
  - **Purpose**: Secure authentication to GCP for Docker image building
  - **Required for**: Building and pushing Docker images to Artifact Registry

- **`GCP_SERVICE_ACCOUNT`** - Service account email for CI
  - **Format**: `github-actions-ci@PROJECT_ID.iam.gserviceaccount.com`
  - **Purpose**: Service account impersonated by GitHub Actions for CI operations

#### API Keys (Staging Environment)
- **`GEMINI_API_KEY_STAGING`** - Gemini AI API key for staging
  - **Purpose**: AI-powered features testing in CI
  - **How to get**: https://makersuite.google.com/app/apikey

#### Code Coverage
- **`CODECOV_TOKEN`** - Codecov upload token
  - **Purpose**: Upload test coverage reports
  - **How to get**: https://codecov.io (optional)

### 2. Deployment Workflow Secrets (`deploy.yml`)

#### Staging Environment
- **`GCP_STAGING_WIF_PROVIDER`** - Workload Identity Federation provider for staging
  - **Format**: `projects/STAGING_PROJECT_NUMBER/locations/global/workloadIdentityPools/github-staging/providers/github-staging`
  - **Purpose**: Secure authentication for staging deployments

- **`GCP_STAGING_WIF_SA_EMAIL`** - Service account for staging deployments
  - **Format**: `github-actions-staging@staging-project-id.iam.gserviceaccount.com`
  - **Permissions**: Firebase Hosting Admin, Cloud Run Admin

- **`GCP_STAGING_PROJECT_ID`** - GCP project ID for staging
  - **Example**: `careercopilot-staging`

#### Production Environment
- **`GCP_PROD_WIF_PROVIDER`** - Workload Identity Federation provider for production
  - **Format**: `projects/PROD_PROJECT_NUMBER/locations/global/workloadIdentityPools/github-prod/providers/github-prod`

- **`GCP_PROD_WIF_SA_EMAIL`** - Service account for production deployments
  - **Format**: `github-actions-prod@careercopilot-468811.iam.gserviceaccount.com`
  - **Permissions**: Firebase Hosting Admin, Cloud Run Admin

- **`GCP_PROJECT_ID`** - GCP project ID for production
  - **Value**: `careercopilot-468811`

### 3. Auto-generated Secrets

- **`GITHUB_TOKEN`** - Automatically provided by GitHub Actions
  - **No setup required** - Available in all workflows

## Setup Instructions

### Option 1: Using GitHub CLI (Recommended)

```bash
# Install GitHub CLI if not already installed
# https://cli.github.com/

# Login to GitHub
gh auth login

# Set secrets one by one
gh secret set TC_CLOUD_TOKEN --body "your-testcontainers-token"
gh secret set GEMINI_API_KEY_STAGING --body "your-gemini-api-key"
gh secret set CODECOV_TOKEN --body "your-codecov-token"

# GCP Workload Identity Federation secrets
gh secret set GCP_WORKLOAD_IDENTITY_PROVIDER --body "projects/123456789/locations/global/workloadIdentityPools/github-ci/providers/github-ci"
gh secret set GCP_SERVICE_ACCOUNT --body "github-actions-ci@careercopilot-468811.iam.gserviceaccount.com"

# Staging secrets
gh secret set GCP_STAGING_WIF_PROVIDER --body "projects/987654321/locations/global/workloadIdentityPools/github-staging/providers/github-staging"
gh secret set GCP_STAGING_WIF_SA_EMAIL --body "github-actions-staging@careercopilot-staging.iam.gserviceaccount.com"
gh secret set GCP_STAGING_PROJECT_ID --body "careercopilot-staging"

# Production secrets
gh secret set GCP_PROD_WIF_PROVIDER --body "projects/123456789/locations/global/workloadIdentityPools/github-prod/providers/github-prod"
gh secret set GCP_PROD_WIF_SA_EMAIL --body "github-actions-prod@careercopilot-468811.iam.gserviceaccount.com"
gh secret set GCP_PROJECT_ID --body "careercopilot-468811"
```

### Option 2: Using GitHub Web UI

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the secret name and value
5. Click **Add secret**
6. Repeat for all required secrets

### Option 3: Automated Setup Script

Run the provided setup script:

```bash
./scripts/setup-github-secrets.sh
```

## Environment-Specific Secrets

### Staging Environment Configuration

Create a staging environment in GitHub:
1. Go to **Settings** → **Environments**
2. Click **New environment**
3. Name it `staging`
4. Add environment-specific secrets:
   - `GEMINI_API_KEY_STAGING`
   - `GCP_STAGING_WIF_PROVIDER`
   - `GCP_STAGING_WIF_SA_EMAIL`
   - `GCP_STAGING_PROJECT_ID`

### Production Environment Configuration

Create a production environment in GitHub:
1. Go to **Settings** → **Environments**
2. Click **New environment**
3. Name it `production`
4. Add protection rules:
   - ✅ Required reviewers (recommended: 1-2 reviewers)
   - ✅ Wait timer (optional: 5 minutes)
5. Add environment-specific secrets:
   - `GEMINI_API_KEY` (production key)
   - `GCP_PROD_WIF_PROVIDER`
   - `GCP_PROD_WIF_SA_EMAIL`
   - `GCP_PROJECT_ID`

## Workload Identity Federation Setup

For secure, keyless authentication to Google Cloud, set up Workload Identity Federation:

### 1. Create Workload Identity Pool

```bash
# For CI (image building)
gcloud iam workload-identity-pools create github-ci \
  --location=global \
  --project=careercopilot-468811

# For Staging deployments
gcloud iam workload-identity-pools create github-staging \
  --location=global \
  --project=careercopilot-staging

# For Production deployments
gcloud iam workload-identity-pools create github-prod \
  --location=global \
  --project=careercopilot-468811
```

### 2. Create Workload Identity Provider

```bash
# For CI
gcloud iam workload-identity-pools providers create-oidc github-ci \
  --location=global \
  --workload-identity-pool=github-ci \
  --issuer-uri=https://token.actions.githubusercontent.com \
  --attribute-mapping=google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.actor=assertion.actor \
  --project=careercopilot-468811

# For Staging
gcloud iam workload-identity-pools providers create-oidc github-staging \
  --location=global \
  --workload-identity-pool=github-staging \
  --issuer-uri=https://token.actions.githubusercontent.com \
  --attribute-mapping=google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.actor=assertion.actor \
  --project=careercopilot-staging

# For Production
gcloud iam workload-identity-pools providers create-oidc github-prod \
  --location=global \
  --workload-identity-pool=github-prod \
  --issuer-uri=https://token.actions.githubusercontent.com \
  --attribute-mapping=google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.actor=assertion.actor \
  --project=careercopilot-468811
```

### 3. Create Service Accounts

```bash
# CI service account
gcloud iam service-accounts create github-actions-ci \
  --display-name="GitHub Actions CI" \
  --project=careercopilot-468811

# Staging service account
gcloud iam service-accounts create github-actions-staging \
  --display-name="GitHub Actions Staging" \
  --project=careercopilot-staging

# Production service account
gcloud iam service-accounts create github-actions-prod \
  --display-name="GitHub Actions Production" \
  --project=careercopilot-468811
```

### 4. Grant IAM Permissions

```bash
# CI permissions (Artifact Registry)
gcloud projects add-iam-policy-binding careercopilot-468811 \
  --member="serviceAccount:github-actions-ci@careercopilot-468811.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

# Staging permissions
gcloud projects add-iam-policy-binding careercopilot-staging \
  --member="serviceAccount:github-actions-staging@careercopilot-staging.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding careercopilot-staging \
  --member="serviceAccount:github-actions-staging@careercopilot-staging.iam.gserviceaccount.com" \
  --role="roles/firebase.admin"

# Production permissions
gcloud projects add-iam-policy-binding careercopilot-468811 \
  --member="serviceAccount:github-actions-prod@careercopilot-468811.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding careercopilot-468811 \
  --member="serviceAccount:github-actions-prod@careercopilot-468811.iam.gserviceaccount.com" \
  --role="roles/firebase.admin"
```

### 5. Allow GitHub to Impersonate Service Accounts

Replace `YOUR_GITHUB_ORG/YOUR_REPO` with your repository path (e.g., `myorg/careercopilot`).

```bash
# CI
gcloud iam service-accounts add-iam-policy-binding \
  github-actions-ci@careercopilot-468811.iam.gserviceaccount.com \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-ci/attribute.repository/YOUR_GITHUB_ORG/YOUR_REPO" \
  --project=careercopilot-468811

# Staging
gcloud iam service-accounts add-iam-policy-binding \
  github-actions-staging@careercopilot-staging.iam.gserviceaccount.com \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/STAGING_PROJECT_NUMBER/locations/global/workloadIdentityPools/github-staging/attribute.repository/YOUR_GITHUB_ORG/YOUR_REPO" \
  --project=careercopilot-staging

# Production
gcloud iam service-accounts add-iam-policy-binding \
  github-actions-prod@careercopilot-468811.iam.gserviceaccount.com \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-prod/attribute.repository/YOUR_GITHUB_ORG/YOUR_REPO" \
  --project=careercopilot-468811
```

### 6. Get Workload Identity Provider Resource Names

```bash
# CI
gcloud iam workload-identity-pools providers describe github-ci \
  --location=global \
  --workload-identity-pool=github-ci \
  --format="value(name)" \
  --project=careercopilot-468811

# Staging
gcloud iam workload-identity-pools providers describe github-staging \
  --location=global \
  --workload-identity-pool=github-staging \
  --format="value(name)" \
  --project=careercopilot-staging

# Production
gcloud iam workload-identity-pools providers describe github-prod \
  --location=global \
  --workload-identity-pool=github-prod \
  --format="value(name)" \
  --project=careercopilot-468811
```

Use these resource names as the values for `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_STAGING_WIF_PROVIDER`, and `GCP_PROD_WIF_PROVIDER`.

## Validation

### Verify Secrets Are Set

```bash
# List all secrets (values are hidden)
gh secret list

# Expected output:
# CODECOV_TOKEN
# GCP_PROJECT_ID
# GCP_PROD_WIF_PROVIDER
# GCP_PROD_WIF_SA_EMAIL
# GCP_SERVICE_ACCOUNT
# GCP_STAGING_PROJECT_ID
# GCP_STAGING_WIF_PROVIDER
# GCP_STAGING_WIF_SA_EMAIL
# GCP_WORKLOAD_IDENTITY_PROVIDER
# GEMINI_API_KEY_STAGING
# TC_CLOUD_TOKEN
```

### Test Workflows

```bash
# Trigger CI workflow manually
gh workflow run ci.yml

# Check workflow status
gh run list --workflow=ci.yml --limit 1

# View workflow logs
gh run view --log
```

## Google Cloud Secret Manager (Application Secrets)

Application runtime secrets are managed in Google Cloud Secret Manager and accessed by Cloud Run services. These are **separate** from GitHub Secrets.

### Application Secrets in GCP Secret Manager

These secrets are used by the backend application at runtime:

- `GEMINI_API_KEY` - Production Gemini AI API key
- `SENDGRID_API_KEY` - SendGrid email service API key
- `GOOGLE_OAUTH_CLIENT_ID_STAGING` - OAuth client ID for staging
- `GOOGLE_OAUTH_CLIENT_SECRET_STAGING` - OAuth client secret for staging
- `GOOGLE_OAUTH_CLIENT_ID_PROD` - OAuth client ID for production
- `GOOGLE_OAUTH_CLIENT_SECRET_PROD` - OAuth client secret for production
- `REDIS_URL` - Redis connection URL (production only)

### Create Application Secrets in GCP

```bash
# Example: Create Gemini API key secret
echo -n "your-gemini-api-key" | gcloud secrets create GEMINI_API_KEY \
  --data-file=- \
  --replication-policy=automatic \
  --project=careercopilot-468811

# Grant Cloud Run service account access
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:careercopilot-backend@careercopilot-468811.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --project=careercopilot-468811
```

## Troubleshooting

### Common Issues

1. **"Workload Identity Federation authentication failed"**
   - Verify the WIF provider resource name is correct
   - Check that the service account has the correct permissions
   - Ensure the GitHub repository attribute mapping is correct

2. **"Permission denied" when pushing Docker images**
   - Verify the CI service account has `artifactregistry.writer` role
   - Check that Artifact Registry API is enabled

3. **"Secret not found" errors**
   - Verify all required secrets are set: `gh secret list`
   - Check secret names match exactly (case-sensitive)

4. **Deployment fails with "Image not found"**
   - Ensure CI workflow completed successfully
   - Verify the image was pushed to Artifact Registry
   - Check the commit SHA matches the deployed image tag

### Get Help

- GitHub Actions documentation: https://docs.github.com/en/actions
- Google Cloud Workload Identity Federation: https://cloud.google.com/iam/docs/workload-identity-federation
- CareerCopilot project documentation: `/docs/`

## Security Best Practices

1. **Never commit secrets to the repository**
2. **Use environment-specific secrets** for staging vs production
3. **Enable environment protection rules** for production deployments
4. **Regularly rotate API keys and tokens**
5. **Use Workload Identity Federation** instead of service account keys
6. **Limit service account permissions** to minimum required
7. **Monitor secret access logs** in Google Cloud Console

## Maintenance

### Rotating Secrets

1. Generate new API key/token
2. Update secret in GitHub: `gh secret set SECRET_NAME --body "new-value"`
3. For GCP secrets: Use `gcloud secrets versions add`
4. Test workflows with new secrets
5. Revoke old credentials

### Adding New Secrets

1. Update this documentation
2. Add secret to GitHub Secrets
3. Update workflow files if needed
4. Test in a feature branch first

---

**Last Updated**: 2025-10-17
**Maintained By**: CareerCopilot DevOps Team
