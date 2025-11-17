#!/bin/bash
#
# Setup AWS SES Secrets for CareerCopilot
# Adds AWS SES credentials to Google Cloud Secret Manager
#

set -e

PROJECT_ID="careercopilot-468811"
REGION="us-east-1"

echo "================================================"
echo "AWS SES Secrets Setup for CareerCopilot"
echo "================================================"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set the project
echo "Setting GCP project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

echo ""
echo "You'll need to provide the following AWS credentials:"
echo "1. AWS Access Key ID (20 characters, e.g., AKIAIOSFODNN7EXAMPLE)"
echo "2. AWS Secret Access Key (40 characters)"
echo "3. SES Sender Email (your verified Gmail address)"
echo ""

# Prompt for AWS Access Key ID
read -p "Enter AWS Access Key ID: " AWS_ACCESS_KEY_ID
if [ -z "$AWS_ACCESS_KEY_ID" ]; then
    echo "❌ Error: AWS Access Key ID cannot be empty"
    exit 1
fi

# Prompt for AWS Secret Access Key (hidden input)
read -sp "Enter AWS Secret Access Key: " AWS_SECRET_ACCESS_KEY
echo ""
if [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "❌ Error: AWS Secret Access Key cannot be empty"
    exit 1
fi

# Prompt for SES Sender Email
read -p "Enter SES Sender Email (e.g., your-email@gmail.com): " SES_SENDER_EMAIL
if [ -z "$SES_SENDER_EMAIL" ]; then
    echo "❌ Error: SES Sender Email cannot be empty"
    exit 1
fi

echo ""
echo "Creating secrets in Google Cloud Secret Manager..."
echo ""

# Create or update aws-access-key-id
if gcloud secrets describe aws-access-key-id --project=$PROJECT_ID &>/dev/null; then
    echo "Secret 'aws-access-key-id' already exists. Creating new version..."
    echo -n "$AWS_ACCESS_KEY_ID" | gcloud secrets versions add aws-access-key-id --data-file=- --project=$PROJECT_ID
else
    echo "Creating secret 'aws-access-key-id'..."
    echo -n "$AWS_ACCESS_KEY_ID" | gcloud secrets create aws-access-key-id --data-file=- --project=$PROJECT_ID --replication-policy=automatic
fi

# Create or update aws-secret-access-key
if gcloud secrets describe aws-secret-access-key --project=$PROJECT_ID &>/dev/null; then
    echo "Secret 'aws-secret-access-key' already exists. Creating new version..."
    echo -n "$AWS_SECRET_ACCESS_KEY" | gcloud secrets versions add aws-secret-access-key --data-file=- --project=$PROJECT_ID
else
    echo "Creating secret 'aws-secret-access-key'..."
    echo -n "$AWS_SECRET_ACCESS_KEY" | gcloud secrets create aws-secret-access-key --data-file=- --project=$PROJECT_ID --replication-policy=automatic
fi

# Create or update ses-sender-email
if gcloud secrets describe ses-sender-email --project=$PROJECT_ID &>/dev/null; then
    echo "Secret 'ses-sender-email' already exists. Creating new version..."
    echo -n "$SES_SENDER_EMAIL" | gcloud secrets versions add ses-sender-email --data-file=- --project=$PROJECT_ID
else
    echo "Creating secret 'ses-sender-email'..."
    echo -n "$SES_SENDER_EMAIL" | gcloud secrets create ses-sender-email --data-file=- --project=$PROJECT_ID --replication-policy=automatic
fi

echo ""
echo "✅ Secrets created successfully in Google Cloud Secret Manager!"
echo ""
echo "Next steps:"
echo "1. Grant Cloud Run service account access to these secrets:"
echo ""
echo "   For each secret, run:"
echo "   gcloud secrets add-iam-policy-binding SECRET_NAME \\"
echo "     --member='serviceAccount:YOUR-SERVICE-ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com' \\"
echo "     --role='roles/secretmanager.secretAccessor' \\"
echo "     --project=$PROJECT_ID"
echo ""
echo "2. Optionally, add to GitHub Secrets for CI/CD testing:"
echo "   gh secret set AWS_ACCESS_KEY_ID"
echo "   gh secret set AWS_SECRET_ACCESS_KEY"
echo "   gh secret set SES_SENDER_EMAIL"
echo "   gh secret set AWS_REGION --body 'us-east-1'"
echo ""
echo "3. Verify secrets are accessible:"
echo "   python3 scripts/production-secrets-validator.py"
echo ""
