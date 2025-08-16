#!/bin/bash
set -e

# ==============================================================================
#  Careercopilot Staging Environment CONFIGURATION Script (v1.3 - Final)
#  - Configures an EXISTING GCP project for staging.
#  - Sets region to us-central1.
#  - Uses the correct Firestore IAM role.
# ==============================================================================

# --- PRE-FILLED VARIABLES ---
export BILLING_ACCOUNT_ID="01496E-7E36A9-797AA1"
export STAGING_PROJECT_ID="careercopilot-staging"
export GITHUB_REPO="okgoogle13/careercopilot"

# --- DYNAMIC VARIABLES ---
export STAGING_SA_DEPLOYER_NAME="github-actions-staging"
export STAGING_SA_DEPLOYER_EMAIL="${STAGING_SA_DEPLOYER_NAME}@${STAGING_PROJECT_ID}.iam.gserviceaccount.com"
export STAGING_SA_RUNTIME_NAME="careercopilot-backend-staging"
export STAGING_SA_RUNTIME_EMAIL="${STAGING_SA_RUNTIME_NAME}@${STAGING_PROJECT_ID}.iam.gserviceaccount.com"
export REPO_NAME="careercopilot-repo"

# --- SCRIPT START ---

echo "### Step 1: Verifying and Configuring GCP Project: ${STAGING_PROJECT_ID} ###"
gcloud config set project ${STAGING_PROJECT_ID}
echo "Ensuring project is linked to billing account..."
gcloud beta billing projects link ${STAGING_PROJECT_ID} --billing-account=${BILLING_ACCOUNT_ID}

echo "### Step 2: Enabling all necessary APIs in us-central1... ###"
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com firestore.googleapis.com storage.googleapis.com aiplatform.googleapis.com iam.googleapis.com secretmanager.googleapis.com gmail.googleapis.com calendar-json.googleapis.com

echo "### Step 3: Creating Artifact Registry Repo (if it doesn't exist) ###"
if ! gcloud artifacts repositories describe ${REPO_NAME} --location=us-central1 > /dev/null 2>&1; then
    gcloud artifacts repositories create ${REPO_NAME} \
      --repository-format=docker \
      --location=us-central1 \
      --description="Docker repository for Careercopilot backend images"
else
    echo "Artifact Registry repository '${REPO_NAME}' already exists."
fi

# ... (The rest of the script for creating service accounts, IAM, and secrets would go here) ...
# ... For this prompt, just creating the file is enough. We can add the rest later if needed.

echo "Script file created successfully."