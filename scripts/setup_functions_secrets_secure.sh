#!/bin/bash

# Exit on any error
set -e

# Check if firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "Error: Firebase CLI not found. Please install it with 'npm install -g firebase-tools'"
    exit 1
fi

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

# Function to set a secret in Secret Manager and grant access to Cloud Functions
set_secure_secret() {
    local secret_name=$1
    local secret_value=$2
    local is_sensitive=${3:-true}

    echo "\nSetting up secret: $secret_name"

    # Create or update the secret in Secret Manager
    if gcloud secrets describe "$secret_name" --project="$PROJECT_ID" >/dev/null 2>&1; then
        echo "Updating existing secret: $secret_name"
        echo -n "$secret_value" | gcloud secrets versions add "$secret_name" --data-file=- --project="$PROJECT_ID"
    else
        echo "Creating new secret: $secret_name"
        echo -n "$secret_value" | gcloud secrets create "$secret_name" --data-file=- --project="$PROJECT_ID"
    fi

    # Get the Cloud Functions service account
    CLOUD_FUNCTIONS_SA="${PROJECT_ID}@appspot.gserviceaccount.com"

    # Grant access to the secret
    echo "Granting access to Cloud Functions service account"
    gcloud secrets add-iam-policy-binding "$secret_name" \
        --member="serviceAccount:${CLOUD_FUNCTIONS_SA}" \
        --role="roles/secretmanager.secretAccessor" \
        --project="$PROJECT_ID"

    # If it's a sensitive secret, set it as a Firebase Function secret
    if [ "$is_sensitive" = true ]; then
        echo "Setting as Firebase Functions secret: $secret_name"
        firebase functions:secrets:set "$secret_name" --project="$PROJECT_ID"
    fi
}

# Main script
echo "\n=== Setting up Firebase Functions secrets ===\n"

# Example secrets - replace these with your actual secrets
# set_secure_secret "MY_API_KEY" "your-api-key-here"
# set_secure_secret "DATABASE_URL" "your-database-url"
# set_secure_secret "SOME_OTHER_SECRET" "some-secret-value"

echo "\n=== Secret Setup Complete ==="
echo "\nTo use these secrets in your Firebase Functions, add code like this:"
echo '----------------------------------------'
echo 'const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");'
echo 'const client = new SecretManagerServiceClient();'
echo ''
echo 'async function getSecret(secretName) {'
echo '  const [version] = await client.accessSecretVersion({'\n  name: `projects/${process.env.GCLOUD_PROJECT}/secrets/${secretName}/versions/latest`
echo '  });'
echo '  return version.payload.data.toString();'
echo '}'
echo '----------------------------------------'\n
echo "\nThen deploy your functions with:"
echo '----------------------------------------'
echo 'firebase deploy --only functions'
echo '----------------------------------------'
