# Workflow Secrets Mapping and Validation

## Overview

This document maps all GitHub secrets required by the CI/CD workflows to their current configurations. All secrets are properly set up and ready to use.

**Last Updated**: 2025-10-17
**Status**: ✅ All Required Secrets Configured

---

## Secrets Mapping Table

| Workflow Requirement | GitHub Secret Name | Environment | Status | Notes |
|---------------------|-------------------|-------------|--------|-------|
| **CI Workflow** | | | | |
| CI GCP Authentication | `GCP_SA_KEY` | Repository | ✅ Set | Used for Docker image building/pushing |
| AI Testing Key | `GEMINI_API_KEY_STAGING` | Staging Env | ✅ Set | Gemini API for backend tests |
| Container Testing | `TC_CLOUD_TOKEN` | Repository | ✅ Set | Testcontainers Cloud token |
| Code Coverage | `CODECOV_TOKEN` | Repository | ✅ Set | Optional - for codecov.io uploads |
| **Staging Deployment** | | | | |
| Staging GCP Auth | `GCP_STAGING_SA_KEY` | Staging Env | ✅ Set | Service account for staging Cloud Run |
| Staging Firebase | `FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT_STAGING` | Staging Env | ✅ Set | Firebase Hosting deployment |
| Staging Project ID | `GCP_STAGING_PROJECT_ID` | Staging Env | ✅ Set | Project: careercopilot-staging |
| **Production Deployment** | | | | |
| Production GCP Auth | `GCP_SA_KEY` | Repository | ✅ Set | Service account for production Cloud Run |
| Production Firebase | `FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT` | Repository | ✅ Set | Firebase Hosting deployment |
| Production Project ID | `GCP_PROJECT_ID` | Production Env | ✅ Set | Project: careercopilot-468811 |

---

## Secret Details

### CI Workflow Secrets

#### `GCP_SA_KEY` (Repository Level)
- **Purpose**: Authenticates to Google Cloud for building and pushing Docker images to Artifact Registry
- **Format**: JSON service account key
- **Permissions Required**:
  - `roles/artifactregistry.writer` - Push Docker images
  - `roles/storage.objectViewer` - Read from Cloud Storage (if needed)
- **Used In**: [.github/workflows/ci.yml](../.github/workflows/ci.yml#L686-690)

#### `GEMINI_API_KEY_STAGING` (Staging Environment)
- **Purpose**: Gemini AI API key for testing AI-powered features in CI
- **Format**: String starting with `AIzaSy...`
- **Used In**:
  - [.github/workflows/ci.yml](../.github/workflows/ci.yml#L240) - Backend tests environment
  - [.github/workflows/ci.yml](../.github/workflows/ci.yml#L297) - Docker test container
  - [.github/workflows/ci.yml](../.github/workflows/ci.yml#L470) - E2E tests
  - [.github/workflows/ci.yml](../.github/workflows/ci.yml#L562) - Performance tests

#### `TC_CLOUD_TOKEN` (Repository Level)
- **Purpose**: Testcontainers Cloud authentication for running containerized tests
- **Format**: String token from testcontainers.cloud
- **Used In**: [.github/workflows/ci.yml](../.github/workflows/ci.yml#L276)
- **Optional**: Can run tests locally without this, but needed for CI

#### `CODECOV_TOKEN` (Repository Level)
- **Purpose**: Upload test coverage reports to codecov.io
- **Format**: UUID string
- **Used In**: [.github/workflows/ci.yml](../.github/workflows/ci.yml#L324)
- **Optional**: Set `fail_ci_if_error: false`, so workflow continues if missing

---

### Staging Deployment Secrets

#### `GCP_STAGING_SA_KEY` (Staging Environment)
- **Purpose**: Authenticates to Google Cloud for staging deployments
- **Format**: JSON service account key
- **Permissions Required**:
  - `roles/run.admin` - Deploy to Cloud Run
  - `roles/firebase.admin` - Deploy Firebase Hosting
  - `roles/artifactregistry.reader` - Pull Docker images
- **Used In**: [.github/workflows/deploy.yml](../.github/workflows/deploy.yml#L142-146)

#### `FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT_STAGING` (Staging Environment)
- **Purpose**: Firebase Hosting deployment for staging frontend
- **Format**: JSON service account key (Firebase-specific)
- **Used In**: [.github/workflows/deploy.yml](../.github/workflows/deploy.yml#L153)
- **Note**: This is separate from `GCP_STAGING_SA_KEY` for security isolation

#### `GCP_STAGING_PROJECT_ID` (Staging Environment)
- **Purpose**: Identifies the GCP project for staging environment
- **Format**: String (e.g., `careercopilot-staging`)
- **Used In**: [.github/workflows/deploy.yml](../.github/workflows/deploy.yml#L193)

---

### Production Deployment Secrets

#### `GCP_SA_KEY` (Repository Level - Reused)
- **Purpose**: Authenticates to Google Cloud for production deployments
- **Format**: JSON service account key
- **Permissions Required**:
  - `roles/run.admin` - Deploy to Cloud Run
  - `roles/firebase.admin` - Deploy Firebase Hosting
  - `roles/artifactregistry.reader` - Pull Docker images
- **Used In**: [.github/workflows/deploy.yml](../.github/workflows/deploy.yml#L273-277)
- **Note**: Same key used for CI and production deployment

#### `FIREBASE_SERVICE_ACCOUNT_CAREERCOPILOT` (Repository Level)
- **Purpose**: Firebase Hosting deployment for production frontend
- **Format**: JSON service account key (Firebase-specific)
- **Used In**: [.github/workflows/deploy.yml](../.github/workflows/deploy.yml#L284)

#### `GCP_PROJECT_ID` (Production Environment)
- **Purpose**: Identifies the GCP project for production environment
- **Format**: String (`careercopilot-468811`)
- **Used In**:
  - [.github/workflows/deploy.yml](../.github/workflows/deploy.yml#L325) - Cloud Run deployment
  - [.github/workflows/deploy.yml](../.github/workflows/deploy.yml#L376) - Rollback (if needed)
  - [.github/workflows/deploy.yml](../.github/workflows/deploy.yml#L386) - Rollback traffic routing

---

## Additional API Keys (Not Used in Workflows)

These secrets exist in your repository but are **not currently used** by GitHub Actions workflows. They are likely used by the application at runtime:

| Secret Name | Environment | Purpose | Status |
|------------|-------------|---------|--------|
| `ANTHROPIC_API_KEY` | Both | Claude AI API | ✅ Set (not used in workflows) |
| `OPENAI_API_KEY` | Both | OpenAI GPT API | ✅ Set (not used in workflows) |
| `PERPLEXITY_API_KEY` | Both | Perplexity AI | ✅ Set (not used in workflows) |
| `PINECONE_API_KEY` | Both | Vector database | ✅ Set (not used in workflows) |
| `PINECONE_ENVIRONMENT` | Both | Pinecone config | ✅ Set (not used in workflows) |
| `PINECONE_INDEX_NAME` | Both | Pinecone index | ✅ Set (not used in workflows) |
| `SERP_API_KEY` | Both | Search API | ✅ Set (not used in workflows) |
| `GOOGLE_OAUTH_CLIENT_ID_STAGING` | Staging | OAuth config | ✅ Set (runtime, not CI/CD) |
| `GOOGLE_OAUTH_CLIENT_SECRET_STAGING` | Staging | OAuth config | ✅ Set (runtime, not CI/CD) |
| `GOOGLE_OAUTH_CLIENT_ID_PROD` | Production | OAuth config | ✅ Set (runtime, not CI/CD) |
| `GOOGLE_OAUTH_CLIENT_SECRET_PROD` | Production | OAuth config | ✅ Set (runtime, not CI/CD) |

**Note**: These secrets are accessed by the application at runtime through Google Cloud Secret Manager or environment variables, not directly by GitHub Actions.

---

## Validation Checklist

### Pre-Flight Checks

Before running workflows, verify:

- [x] All required secrets are set in GitHub
- [x] Service account keys have correct permissions
- [x] GCP projects are accessible
- [x] Artifact Registry is enabled
- [x] Cloud Run API is enabled
- [x] Firebase Hosting is configured

### Quick Validation Commands

```bash
# Check if secrets are referenced correctly in workflows
grep -r "secrets\." .github/workflows/

# Validate YAML syntax
python3 -c "
import yaml
for f in ['.github/workflows/ci.yml', '.github/workflows/deploy.yml', '.github/workflows/auto-fix.yml']:
    with open(f) as file:
        yaml.safe_load(file)
        print(f'✅ {f}')
"

# List GitHub secrets (requires repo access)
gh secret list

# Trigger a test workflow
gh workflow run ci.yml --ref develop
```

---

## Troubleshooting

### Common Issues

#### 1. "Permission denied" when pushing Docker images

**Symptom**: CI workflow fails at "Build and push Docker image" step

**Solution**:
- Verify `GCP_SA_KEY` service account has `roles/artifactregistry.writer`
- Check Artifact Registry is enabled: `gcloud services enable artifactregistry.googleapis.com`
- Verify repository exists: `gcloud artifacts repositories list --project=careercopilot-468811`

#### 2. "Failed to deploy to Firebase Hosting"

**Symptom**: Deploy workflow fails at "Deploy Frontend to Staging/Production" step

**Solution**:
- Verify Firebase service account keys are valid JSON
- Check service account has `roles/firebase.admin`
- Ensure Firebase project ID matches: `staging` uses `careercopilot-staging`, `production` uses `careercopilot-468811`

#### 3. "Invalid credentials" in gcloud commands

**Symptom**: Any gcloud command fails with authentication errors

**Solution**:
- Regenerate service account key in GCP Console
- Update GitHub secret with new key
- Ensure JSON is properly formatted (no extra whitespace)

#### 4. "Secret not found"

**Symptom**: Workflow fails with "secret `SECRET_NAME` not found"

**Solution**:
- Check secret is set at correct level (repository vs environment)
- Verify environment name matches workflow (staging vs production)
- Use `gh secret list` to confirm secret exists

---

## Security Best Practices

### Current Setup (Service Account Keys)

✅ **Pros**:
- Simple to set up and use
- Works immediately with existing infrastructure
- All secrets already configured

⚠️ **Cons**:
- Service account keys are long-lived credentials
- Need to rotate keys periodically
- If leaked, provide full access until revoked

### Recommended: Migrate to Workload Identity Federation

For improved security, consider migrating to Workload Identity Federation (WIF):

**Benefits**:
- No service account keys to manage
- Short-lived tokens (1 hour)
- Automatic rotation
- Better audit trail
- Zero trust security model

**Migration Guide**: See [docs/GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md#workload-identity-federation-setup) for detailed WIF setup instructions.

**Timeline**: Can be done later without disrupting current workflows.

---

## Maintenance

### Secret Rotation Schedule

Rotate service account keys every:
- **Production**: 90 days
- **Staging**: 180 days
- **CI/CD**: 180 days

### Rotation Process

1. **Generate new service account key**:
   ```bash
   gcloud iam service-accounts keys create new-key.json \
     --iam-account=SA_EMAIL@PROJECT_ID.iam.gserviceaccount.com \
     --project=PROJECT_ID
   ```

2. **Update GitHub secret**:
   ```bash
   gh secret set SECRET_NAME < new-key.json
   ```

3. **Test workflow**:
   ```bash
   gh workflow run ci.yml --ref develop
   ```

4. **Delete old key** (after confirming new key works):
   ```bash
   gcloud iam service-accounts keys delete OLD_KEY_ID \
     --iam-account=SA_EMAIL@PROJECT_ID.iam.gserviceaccount.com \
     --project=PROJECT_ID
   ```

---

## Testing Workflows

### Manual Workflow Triggers

```bash
# Trigger CI workflow
gh workflow run ci.yml --ref develop

# Trigger deployment to staging
gh workflow run deploy.yml --ref develop -f environment=staging

# Trigger deployment to production
gh workflow run deploy.yml --ref main -f environment=production

# Check workflow status
gh run list --workflow=ci.yml --limit=5

# View workflow logs
gh run view --log
```

### Expected Workflow Behavior

#### CI Workflow (`ci.yml`)
1. **changes** job - Detects which paths changed
2. **codeql** job - Security scanning (if relevant paths changed)
3. **frontend** job - Frontend tests (if frontend changed)
4. **backend-static-checks** job - Linting, formatting, security (if backend changed)
5. **backend-tests** job - Integration tests with Testcontainers (if backend changed)
6. **functions** job - Firebase Functions tests (if functions changed)
7. **test-firestore-rules** job - Firestore rules tests (if rules changed)
8. **e2e-tests** job - End-to-end Playwright tests (if frontend or backend changed)
9. **quality-gate** job - Validates all tests passed
10. **build-and-push-backend** job - Builds and pushes Docker image (on main/develop)

#### Deploy Workflow (`deploy.yml`)
1. **pre-deploy-checks** job - Determines staging vs production
2. **deploy-staging** or **deploy-production** job:
   - Prepares frontend artifact
   - Authenticates to GCP
   - Deploys frontend to Firebase Hosting
   - Verifies backend Docker image exists
   - Deploys backend to Cloud Run
   - Performs health checks
   - (Production only) Rolls back on failure

---

## Summary

✅ **All required GitHub secrets are properly configured**
✅ **Workflows updated to use service account key authentication**
✅ **YAML syntax validated**
✅ **Ready for testing and deployment**

### Next Steps

1. **Push changes to remote**:
   ```bash
   git push origin develop
   ```

2. **Monitor the first CI run**:
   - Go to: https://github.com/okgoogle13/careercopilot/actions
   - Watch for any authentication or permission issues

3. **Test staging deployment** (after CI passes):
   ```bash
   gh workflow run deploy.yml --ref develop -f environment=staging
   ```

4. **Verify staging deployment**:
   - Frontend: https://careercopilot-staging.web.app
   - Backend: Check workflow logs for Cloud Run URL

5. **Test production deployment** (when ready):
   - Merge to `main` branch to trigger automatic deployment
   - Or manually trigger: `gh workflow run deploy.yml --ref main -f environment=production`

---

**For questions or issues, see**:
- [GitHub Secrets Setup Guide](GITHUB_SECRETS_SETUP.md)
- [Project Commands Reference](../CLAUDE.md)
- [Deployment Documentation](DEPLOYMENT.md)

**Maintained By**: CareerCopilot DevOps Team
