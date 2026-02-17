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

# Function to display help
show_help() {
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  list                  List all secrets"
    echo "  get SECRET_NAME       Get a secret value"
    echo "  set SECRET_NAME       Set a new secret value"
    echo "  delete SECRET_NAME    Delete a secret"
    echo "  grant-access SECRET_NAME EMAIL  Grant access to a secret"
    echo ""
    echo "Options:
  --help, -h     Show this help message"
}

# Function to list all secrets
list_secrets() {
    echo "Available secrets in project $PROJECT_ID:"
    gcloud secrets list --project="$PROJECT_ID"
}

# Function to get a secret value
get_secret() {
    local secret_name=$1

    echo "Retrieving secret: $secret_name"
    gcloud secrets versions access latest --secret="$secret_name" --project="$PROJECT_ID"
}

# Function to set a secret value
set_secret() {
    local secret_name=$1
    local secret_value

    # If no value provided, prompt for it
    if [ -z "$2" ]; then
        read -s -p "Enter value for $secret_name: " secret_value
        echo ""
    else
        secret_value="$2"
    fi

    # Check if secret exists
    if gcloud secrets describe "$secret_name" --project="$PROJECT_ID" >/dev/null 2>&1; then
        echo "Updating existing secret: $secret_name"
        echo -n "$secret_value" | gcloud secrets versions add "$secret_name" --data-file=- --project="$PROJECT_ID"
    else
        echo "Creating new secret: $secret_name"
        echo -n "$secret_value" | gcloud secrets create "$secret_name" --data-file=- --project="$PROJECT_ID"

        # Make it available to Firebase Functions
        echo "Making secret available to Firebase Functions..."
        firebase functions:secrets:set "$secret_name" --project="$PROJECT_ID"
    fi

    # Grant access to Cloud Functions service account
    CLOUD_FUNCTIONS_SA="${PROJECT_ID}@appspot.gserviceaccount.com"
    echo "Granting access to Cloud Functions service account..."
    gcloud secrets add-iam-policy-binding "$secret_name" \
        --member="serviceAccount:${CLOUD_FUNCTIONS_SA}" \
        --role="roles/secretmanager.secretAccessor" \
        --project="$PROJECT_ID"
}

# Function to delete a secret
delete_secret() {
    local secret_name=$1

    read -p "Are you sure you want to delete secret '$secret_name'? This cannot be undone. [y/N] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Deleting secret: $secret_name"
        gcloud secrets delete "$secret_name" --project="$PROJECT_ID"
    else
        echo "Operation cancelled"
        exit 0
    fi
}

# Function to grant access to a secret
grant_access() {
    local secret_name=$1
    local member=$2

    echo "Granting $member access to secret: $secret_name"
    gcloud secrets add-iam-policy-binding "$secret_name" \
        --member="$member" \
        --role="roles/secretmanager.secretAccessor" \
        --project="$PROJECT_ID"
}

# Main script
if [ $# -lt 1 ]; then
    show_help
    exit 1
fi

case "$1" in
    list)
        list_secrets
        ;;
    get)
        if [ -z "$2" ]; then
            echo "Error: Secret name not provided"
            show_help
            exit 1
        fi
        get_secret "$2"
        ;;
    set)
        if [ -z "$2" ]; then
            echo "Error: Secret name not provided"
            show_help
            exit 1
        fi
        set_secret "$2" "$3"
        ;;
    delete)
        if [ -z "$2" ]; then
            echo "Error: Secret name not provided"
            show_help
            exit 1
        fi
        delete_secret "$2"
        ;;
    grant-access)
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo "Error: Secret name and member email are required"
            show_help
            exit 1
        fi
        grant_access "$2" "$3"
        ;;
    --help|-h)
        show_help
        ;;
    *)
        echo "Error: Unknown command: $1"
        show_help
        exit 1
        ;;
esac

echo "\nDone!"
