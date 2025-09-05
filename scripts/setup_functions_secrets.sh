#!/bin/bash

# Exit on any error
set -e

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "Error: gcloud command not found. Please install Google Cloud SDK first."
    exit 1
fi

# Get project ID from gcloud config
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo "Error: Could not determine project ID. Please set up gcloud with 'gcloud init' or 'gcloud config set project PROJECT_ID'"
    exit 1
fi
echo "Using project: $PROJECT_ID"

# Function to set Firebase Functions secret
set_functions_secret() {
    local secret_name=$1
    local secret_value=$2

    echo "Setting up secret: $secret_name"

    # Check if secret exists in Secret Manager
    if gcloud secrets describe "$secret_name" --project="$PROJECT_ID" >/dev/null 2>&1; then
        echo "Updating existing secret: $secret_name"
        echo -n "$secret_value" | gcloud secrets versions add "$secret_name" --data-file=- --project="$PROJECT_ID"
    else
        echo "Creating new secret: $secret_name"
        echo -n "$secret_value" | gcloud secrets create "$secret_name" --data-file=- --project="$PROJECT_ID"
    fi

    # Grant access to Cloud Functions service account
    CLOUD_FUNCTIONS_SA="${PROJECT_ID}@appspot.gserviceaccount.com"
    gcloud secrets add-iam-policy-binding "$secret_name" \
        --member="serviceAccount:${CLOUD_FUNCTIONS_SA}" \
        --role="roles/secretmanager.secretAccessor" \
        --project="$PROJECT_ID"

    # Set the secret in Firebase Functions
    echo "Setting secret in Firebase Functions: $secret_name"
    firebase functions:secrets:set "$secret_name" --project="$PROJECT_ID"
}

# Main script
echo "Setting up Firebase Functions secrets..."

# Set each secret
set_functions_secret "FIREBASE_CONFIG" "$(cat firebase-config.json 2>/dev/null || echo '{"projectId":"'$PROJECT_ID'"}')"

# Add other secrets as needed
# set_functions_secret "ANOTHER_SECRET" "secret-value"

echo "\nSecrets setup complete. You can now access these secrets in your Firebase Functions using:"
echo "const mySecret = process.env.MY_SECRET_NAME;"

echo "\nTo deploy your functions with the new secrets, run:"
echo "firebase deploy --only functions"
