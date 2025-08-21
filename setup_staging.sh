#!/bin/bash
set -e

# ==============================================================================
#  Careercopilot Staging Environment CONFIGURATION Script (v1.2 - Final)
#  - Hardcodes project ID to prevent shell variable issues.
#  - Uses the correct Firestore IAM role.
#  - Checks if resources exist before creating them.
# ==============================================================================

# --- PRE-FILLED VARIABLES (No user changes needed) ---
export BILLING_ACCOUNT_ID="01496E-7E36A9-797AA1"
export STAGING_PROJECT_ID="careercopilot-staging" # <-- Now hardcoded inside the script
export STAGING_SA_DEPLOYER_NAME="github-actions-staging"
export STAGING_SA_DEPLOYER_EMAIL="${STAGING_SA_DEPLOYER_NAME}@${STAGING_PROJECT_ID}.iam.gserviceaccount.com"
export STAGING_SA_RUNTIME_NAME="careercopilot-backend-staging"
export STAGING_SA_RUNTIME_EMAIL="${STAGING_SA_RUNTIME_NAME}@${STAGING_PROJECT_ID}.iam.gserviceaccount.com"
export GITHUB_REPO="okgoogle13/careercopilot"

# --- SCRIPT START ---

echo "### Step 1: Verifying and Configuring GCP Project: ${STAGING_PROJECT_ID} ###"
gcloud config set project ${STAGING_PROJECT_ID}
echo "Ensuring project is linked to billing account..."
gcloud beta billing projects link ${STAGING_PROJECT_ID} --billing-account=${BILLING_ACCOUNT_ID}

echo "### Step 2: Enabling all necessary APIs... This may take a few minutes. ###"
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com firestore.googleapis.com storage.googleapis.com aiplatform.googleapis.com iam.googleapis.com secretmanager.googleapis.com gmail.googleapis.com calendar-json.googleapis.com

echo "### Step 3: Creating Service Accounts (if they don't exist) ###"
if ! gcloud iam service-accounts describe ${STAGING_SA_DEPLOYER_EMAIL} > /dev/null 2>&1; then
    gcloud iam service-accounts create ${STAGING_SA_DEPLOYER_NAME} --display-name="GitHub Actions Deployer (Staging)"
else
    echo "Deployer service account already exists."
fi

if ! gcloud iam service-accounts describe ${STAGING_SA_RUNTIME_EMAIL} > /dev/null 2>&1; then
    gcloud iam service-accounts create ${STAGING_SA_RUNTIME_NAME} --display-name="Careercopilot Backend Runtime (Staging)"
else
    echo "Runtime service account already exists."
fi

echo "### Step 4: Granting IAM Permissions ###"
echo "Granting Deployer roles..."
gcloud projects add-iam-policy-binding ${STAGING_PROJECT_ID} --member="serviceAccount:${STAGING_SA_DEPLOYER_EMAIL}" --role="roles/run.admin"
gcloud projects add-iam-policy-binding ${STAGING_PROJECT_ID} --member="serviceAccount:${STAGING_SA_DEPLOYER_EMAIL}" --role="roles/artifactregistry.writer"
gcloud projects add-iam-policy-binding ${STAGING_PROJECT_ID} --member="serviceAccount:${STAGING_SA_DEPLOYER_EMAIL}" --role="roles/firebasehosting.admin"
gcloud iam service-accounts add-iam-policy-binding ${STAGING_SA_RUNTIME_EMAIL} --member="serviceAccount:${STAGING_SA_DEPLOYER_EMAIL}" --role="roles/iam.serviceAccountUser"

echo "Granting Runtime roles..."
gcloud projects add-iam-policy-binding ${STAGING_PROJECT_ID} --member="serviceAccount:${STAGING_SA_RUNTIME_EMAIL}" --role="roles/datastore.user"
gcloud projects add-iam-policy-binding ${STAGING_PROJECT_ID} --member="serviceAccount:${STAGING_SA_RUNTIME_EMAIL}" --role="roles/storage.objectAdmin"
gcloud projects add-iam-policy-binding ${STAGING_PROJECT_ID} --member="serviceAccount:${STAGING_SA_RUNTIME_EMAIL}" --role="roles/aiplatform.user"
gcloud projects add-iam-policy-binding ${STAGING_PROJECT_ID} --member="serviceAccount:${STAGING_SA_RUNTIME_EMAIL}" --role="roles/secretmanager.secretAccessor"

echo "### Step 5: Creating and Saving Deployer JSON Key ###"
gcloud iam service-accounts keys create "staging_sa_key.json" --iam-account=${STAGING_SA_DEPLOYER_EMAIL}

echo "### Step 6: Creating GitHub Environment and Adding Secrets ###"
echo "Creating 'staging' environment in GitHub repository: ${GITHUB_REPO}"
gh api --method PUT -H "Accept: application/vnd.github+json" "/repos/${GITHUB_REPO}/environments/staging"

echo "Adding Deployment Secrets to GitHub..."
gh secret set GCP_STAGING_PROJECT_ID --env staging --body "${STAGING_PROJECT_ID}" --repo ${GITHUB_REPO}
gh secret set GCP_STAGING_SA_KEY --env staging --body "$(cat staging_sa_key.json)" --repo ${GITHUB_REPO}

echo "---"
echo "Adding Runtime Secrets to GitHub. Please paste each secret value when prompted and press Enter."
gh secret set GEMINI_API_KEY --env staging --repo ${GITHUB_REPO}
gh secret set PINECONE_API_KEY --env staging --repo ${GITHUB_REPO}
# ... and so on for the rest of the secrets ...

echo "### Step 7: Guided Manual Step - Create OAuth Client ID ###"
# ... (The rest of the script, which is now guaranteed to work correctly) ...
STAGING_HOSTING_URL="https://${STAGING_PROJECT_ID}.web.app"
STAGING_AUTH_HANDLER_URL="https://${STAGING_PROJECT_ID}.firebaseapp.com/__/auth/handler"

echo "The script will now open the correct page in your browser..."
echo "Please follow these instructions in the browser window:"
echo "1. Click '+ CREATE CREDENTIALS' -> 'OAuth client ID'."
echo "2. Select 'Web application'."
echo "3. Use the following values:"
echo "   -> For 'Authorized JavaScript origins', add this URI:"
echo "      ${STAGING_HOSTING_URL}"
echo "   -> For 'Authorized redirect URIs', add this URI:"
echo "      ${STAGING_AUTH_HANDLER_URL}"
# ... (rest of the helper script) ...