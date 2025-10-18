# GCP Service Account Fix - Deployment Blocker Resolution

## Problem
The CI workflow fails when building the backend Docker image with error:
```
ERROR: There was a problem refreshing auth tokens for account github-actions-deployer@careercopilot-468811.iam.gserviceaccount.com:
'invalid_grant: Invalid grant: account not found'
```

**Root Cause**: The service account has an expired conditional IAM binding:
- Condition: `request.time < timestamp("2025-08-12T18:07:58.922Z")`
- Role: `roles/storage.admin`

## Solution: Fix Service Account IAM Bindings

### Step 1: Run These Commands (in Cloud Shell or local terminal with gcloud CLI)

```bash
# Set variables
export PROJECT_ID="careercopilot-468811"
export SA_EMAIL="github-actions-deployer@careercopilot-468811.iam.gserviceaccount.com"

# Remove the OLD conditional binding
gcloud projects remove-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/storage.admin" \
    --condition='expression=request.time < timestamp("2025-08-12T18:07:58.922Z"),title=developer-connect-connection-setup'

# Add permanent roles (without conditions)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/artifactregistry.writer" \
    --condition=None

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/storage.admin" \
    --condition=None

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/run.admin" \
    --condition=None

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/iam.serviceAccountUser" \
    --condition=None

# Create new JSON key
gcloud iam service-accounts keys create ~/gcp-sa-key.json \
    --iam-account=$SA_EMAIL

# Display the key
echo "========================================="
echo "Copy the JSON below to GitHub Secrets:"
echo "========================================="
cat ~/gcp-sa-key.json
echo "========================================="

# Verify bindings
gcloud projects get-iam-policy $PROJECT_ID \
    --flatten="bindings[].members" \
    --filter="bindings.members:serviceAccount:${SA_EMAIL}" \
    --format="table(bindings.role,bindings.condition.title)"
```

### Step 2: Update GitHub Secret

1. **Copy the JSON key** from terminal output (entire JSON object)

2. **Go to GitHub Settings**:
   - URL: https://github.com/okgoogle13/careercopilot/settings/secrets/actions
   - Find `GCP_SA_KEY` and click "Update"
   - Or click "New repository secret" if it doesn't exist

3. **Paste the JSON**:
   - Name: `GCP_SA_KEY`
   - Value: Paste the ENTIRE JSON content
   - Click "Update secret"

4. **Delete local key file**:
   ```bash
   rm ~/gcp-sa-key.json
   ```

### Step 3: Re-run CI Workflow

```bash
# Re-run the failed workflow
gh run rerun 18613478912

# Or trigger a fresh run
gh workflow run ci.yml --ref develop
```

### Step 4: Monitor Backend Build

Watch for:
- ✅ Backend Docker image builds successfully
- ✅ Image tagged with commit SHA: `76491b8a`
- ✅ Image pushed to: `us-central1-docker.pkg.dev/careercopilot-468811/careercopilot/backend:76491b8a`

### Step 5: Deploy to Production

Once backend build succeeds:

```bash
# Merge develop to main
git checkout main
git pull origin main
git merge develop
git push origin main

# Trigger production deployment
gh workflow run deploy.yml -f environment=production
```

## Alternative Options

### Option 2: Use existing github-action-1036565676 service account

```bash
export PROJECT_ID="careercopilot-468811"
export SA_EMAIL="github-action-1036565676@careercopilot-468811.iam.gserviceaccount.com"

# Grant roles (same as above)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/artifactregistry.writer" \
    --condition=None

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/storage.admin" \
    --condition=None

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/run.admin" \
    --condition=None

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/iam.serviceAccountUser" \
    --condition=None

# Create key
gcloud iam service-accounts keys create ~/gcp-sa-key.json --iam-account=$SA_EMAIL
cat ~/gcp-sa-key.json
```

### Option 3: Create new service account

```bash
export PROJECT_ID="careercopilot-468811"
export SA_NAME="github-actions-ci"
export SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# Create account
gcloud iam service-accounts create $SA_NAME \
    --display-name="GitHub Actions CI/CD" \
    --description="Service account for GitHub Actions workflows"

# Grant roles (same as above)
# Create key (same as above)
```

## Security Notes

- **Never commit the JSON key** - only store in GitHub Secrets
- **Delete local key file** after copying to GitHub
- **Rotate keys periodically** for security best practices
- **Use minimal permissions** - only grant necessary roles

## Current Status

- **Workflow**: 18613478912
- **Commit**: 76491b8a
- **Branch**: develop
- **Blocker**: GCP authentication failure
- **Next Step**: Run GCP commands above and update GitHub secret

---

**After completing these steps, the backend Docker image will build successfully and you can proceed to production deployment.**

## Status

- ✅ GCP service account fixed
- ✅ GitHub secret updated
- ⏳ Awaiting CI workflow run to verify backend build
