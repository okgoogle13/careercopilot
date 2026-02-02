# Docker Registry Regional Consistency Guide

## Issue: Mismatched Artifact Registry Hostname

When using Docker with Google Cloud Artifact Registry, ensure regional consistency between:
1. Docker authentication hostname
2. Image tag/repository hostname
3. Artifact Registry location

## Current Configuration: us-central1

All services should use `us-central1` region consistently:

### 1. Artifact Registry Setup
```bash
# Create repository in us-central1
gcloud artifacts repositories create careercopilot \
    --repository-format=docker \
    --location=us-central1 \
    --description="CareerCopilot Docker images"
```

### 2. Docker Authentication
```bash
# Configure Docker authentication for us-central1
gcloud auth configure-docker us-central1-docker.pkg.dev
```

### 3. GitHub Workflow Docker Authentication
```yaml
- name: Configure Docker for Artifact Registry
  run: |
    gcloud auth configure-docker us-central1-docker.pkg.dev
```

### 4. Image Tag Format
All Docker images should use the `us-central1` hostname:
```bash
# Correct format
us-central1-docker.pkg.dev/PROJECT_ID/careercopilot/IMAGE_NAME:TAG

# Example
us-central1-docker.pkg.dev/careercopilot-468811/careercopilot/backend:latest
```

### 5. GitHub Workflow Example
```yaml
- name: Build and Push Docker Image
  run: |
    docker build -t us-central1-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/careercopilot/backend:${{ github.sha }} ./backend
    docker push us-central1-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/careercopilot/backend:${{ github.sha }}
```

## Common Mistakes to Avoid

❌ **Wrong**: Mixing regions
```yaml
# Authentication for us-central1 but pushing to australia
- run: gcloud auth configure-docker us-central1-docker.pkg.dev
- run: docker push australia-southeast1-docker.pkg.dev/project/image:tag
```

❌ **Wrong**: Using gcr.io (deprecated)
```yaml
- run: docker push gcr.io/project/image:tag
```

❌ **Wrong**: Using us-docker.pkg.dev (multi-region) with regional resources
```yaml
- run: gcloud auth configure-docker us-docker.pkg.dev  # Multi-region
- run: docker push us-central1-docker.pkg.dev/project/image:tag  # Regional
```

✅ **Correct**: Consistent regional configuration
```yaml
- run: gcloud auth configure-docker us-central1-docker.pkg.dev
- run: docker push us-central1-docker.pkg.dev/project/image:tag
```

## Required Service Account Permissions

Ensure service accounts have these permissions:
- `roles/artifactregistry.writer`
- `roles/artifactregistry.reader`

## Verification Commands

```bash
# Check authentication
gcloud auth list

# Check configured Docker credential helpers
cat ~/.docker/config.json

# Test Docker authentication
docker pull us-central1-docker.pkg.dev/PROJECT_ID/careercopilot/test:latest
```
