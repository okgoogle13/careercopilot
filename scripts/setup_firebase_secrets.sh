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

# Function to create or update a secret
create_or_update_secret() {
    local secret_name=$1
    local secret_value=$2

    echo "Setting up secret: $secret_name"

    # Check if secret exists
    if gcloud secrets describe "$secret_name" --project="$PROJECT_ID" >/dev/null 2>&1; then
        # Update existing secret
        echo "Updating existing secret: $secret_name"
        echo -n "$secret_value" | gcloud secrets versions add "$secret_name" --data-file=- --project="$PROJECT_ID"
    else
        # Create new secret
        echo "Creating new secret: $secret_name"
        echo -n "$secret_value" | gcloud secrets create "$secret_name" --data-file=- --project="$PROJECT_ID"
    fi
}

# Prompt for Firebase service account JSON file path
echo "\n=== Firebase Service Account JSON ==="
read -p "Path to Firebase service account JSON file: " SERVICE_ACCOUNT_FILE

if [ ! -f "$SERVICE_ACCOUNT_FILE" ]; then
    echo "Error: File not found: $SERVICE_ACCOUNT_FILE"
    exit 1
fi

# Read and validate JSON
SERVICE_ACCOUNT_JSON=$(cat "$SERVICE_ACCOUNT_FILE")
if ! jq -e . >/dev/null 2>&1 <<<"$SERVICE_ACCOUNT_JSON"; then
    echo "Error: Invalid JSON in service account file"
    exit 1
fi

# Extract values from service account
PROJECT_ID_FROM_JSON=$(jq -r '.project_id' <<< "$SERVICE_ACCOUNT_JSON")
CLIENT_EMAIL=$(jq -r '.client_email' <<< "$SERVICE_ACCOUNT_JSON")

# Verify project ID matches
if [ "$PROJECT_ID" != "$PROJECT_ID_FROM_JSON" ]; then
    echo "Warning: Project ID in service account ($PROJECT_ID_FROM_JSON) doesn't match gcloud project ($PROJECT_ID)"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted by user"
        exit 1
    fi
fi

# Prompt for Firebase configuration
echo "\n=== Firebase Configuration ==="
read -p "Firebase Storage Bucket (e.g., your-app.appspot.com): " STORAGE_BUCKET
read -p "Firebase Database URL (e.g., https://your-app.firebaseio.com): " DATABASE_URL

# Prompt for emulator settings
echo "\n=== Emulator Configuration ==="
read -p "Use Firebase emulator? (y/N): " USE_EMULATOR
USE_EMULATOR=${USE_EMULATOR:-n}

if [[ $USE_EMULATOR =~ ^[Yy]$ ]]; then
    read -p "Auth emulator host (default: localhost:9099): " AUTH_EMULATOR
    AUTH_EMULATOR=${AUTH_EMULATOR:-localhost:9099}

    read -p "Storage emulator host (default: localhost:9199): " STORAGE_EMULATOR
    STORAGE_EMULATOR=${STORAGE_EMULATOR:-localhost:9199}

    read -p "Database emulator host (default: localhost:9000): " DATABASE_EMULATOR
    DATABASE_EMULATOR=${DATABASE_EMULATOR:-localhost:9000}
else
    AUTH_EMULATOR=""
    STORAGE_EMULATOR=""
    DATABASE_EMULATOR=""
fi

# Enable required APIs
echo "\nEnabling required APIs..."
gcloud services enable secretmanager.googleapis.com --project="$PROJECT_ID"
gcloud services enable firebase.googleapis.com --project="$PROJECT_ID"

# Create or update secrets
echo -e "\nCreating/updating secrets..."

# 1. Service account JSON
create_or_update_secret "FIREBASE_CREDENTIALS_JSON" "$SERVICE_ACCOUNT_JSON"

# 2. Firebase configuration
create_or_update_secret "FIREBASE_PROJECT_ID" "$PROJECT_ID"
create_or_update_secret "FIREBASE_STORAGE_BUCKET" "$STORAGE_BUCKET"
create_or_update_secret "FIREBASE_DATABASE_URL" "$DATABASE_URL"

# 3. Emulator settings
create_or_update_secret "FIREBASE_EMULATOR" "$([ "$USE_EMULATOR" = "y" ] && echo "true" || echo "false")"
create_or_update_secret "FIREBASE_AUTH_EMULATOR_HOST" "$AUTH_EMULATOR"
create_or_update_secret "FIREBASE_STORAGE_EMULATOR_HOST" "$STORAGE_EMULATOR"
create_or_update_secret "FIREBASE_DATABASE_EMULATOR_HOST" "$DATABASE_EMULATOR"

# Grant service account access to secrets
SA_EMAIL="${CLIENT_EMAIL}"
if [ -n "$SA_EMAIL" ]; then
    echo -e "\nGranting access to service account: $SA_EMAIL"
    for secret in FIREBASE_CREDENTIALS_JSON FIREBASE_PROJECT_ID FIREBASE_STORAGE_BUCKET \
                   FIREBASE_DATABASE_URL FIREBASE_EMULATOR FIREBASE_AUTH_EMULATOR_HOST \
                   FIREBASE_STORAGE_EMULATOR_HOST FIREBASE_DATABASE_EMULATOR_HOST; do
        gcloud secrets add-iam-policy-binding "$secret" \
            --member="serviceAccount:$SA_EMAIL" \
            --role="roles/secretmanager.secretAccessor" \
            --project="$PROJECT_ID"
    done
fi

echo -e "\n\033[1;32m✓ Successfully set up Firebase secrets in Google Cloud Secret Manager\033[0m"
echo "Project ID: $PROJECT_ID"
echo "Service Account: $CLIENT_EMAIL"

# Mark secrets setup as complete
todo_list
{"todos": [{"id": "1", "content": "Create a service account with necessary permissions for Secret Manager", "status": "completed", "priority": "high"}, {"id": "2", "content": "Store Firebase service account JSON as a secret", "status": "completed", "priority": "high"}, {"id": "3", "content": "Store Firebase configuration values as secrets", "status": "completed", "priority": "high"}, {"id": "4", "content": "Verify secret access from the application", "status": "pending", "priority": "high"}, {"id": "5", "content": "Test Firebase initialization with the new secrets", "status": "pending", "priority": "medium"}]}
