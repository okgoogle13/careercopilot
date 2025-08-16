#!/bin/bash
set -e

# --- Configuration ---
export STAGING_PROJECT_ID="careercopilot-staging"
export REPO_NAME="careercopilot-repo"
export REPO_LOCATION="us-central1"

# --- Script Start ---
echo "### Configuring Artifact Registry Repository in Project: ${STAGING_PROJECT_ID} ###"

# Step 1: Set the active gcloud project.
echo ""
echo "--> Step 1 of 2: Setting active project to '${STAGING_PROJECT_ID}'..."
gcloud config set project ${STAGING_PROJECT_ID}

# Step 2: Create the Docker repository if it doesn't already exist.
echo "--> Step 2 of 2: Ensuring the Docker repository named '${REPO_NAME}' exists..."
if ! gcloud artifacts repositories describe ${REPO_NAME} --location=${REPO_LOCATION} > /dev/null 2>&1; then
  gcloud artifacts repositories create ${REPO_NAME} \
    --repository-format=docker \
    --location=${REPO_LOCATION} \
    --description="Docker repository for Careercopilot backend images"
  echo "Repository '${REPO_NAME}' was created."
else
  echo "Repository '${REPO_NAME}' already exists. No action taken."
fi

echo ""
echo "✅ Artifact Registry repository '${REPO_NAME}' is successfully configured."
echo "You can now re-run the failed GitHub Actions workflow."
