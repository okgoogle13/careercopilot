#!/bin/bash
# GCP Secret Manager Setup Script
# This script creates and configures secrets for the CareerCopilot application

set -e

PROJECT_ID="careercopilot-468811"
SERVICE_ACCOUNT_EMAIL="careercopilot@appspot.gserviceaccount.com"

echo "🔐 Setting up GCP Secret Manager for CareerCopilot"
echo "Project: $PROJECT_ID"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed"
    echo "Please install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Verify project access
echo "Verifying GCP project access..."
gcloud config set project $PROJECT_ID

echo ""
echo "📋 Required Secrets:"
echo "1. JWT_SECRET_KEY - For authentication tokens"
echo "2. DB_PASSWORD - For database connection"
echo "3. GEMINI_API_KEY - For AI services (optional if using Vertex AI)"
echo ""

# Function to create or update a secret
create_secret() {
    local SECRET_NAME=$1
    local SECRET_VALUE=$2
    local DESCRIPTION=$3
    
    echo "Creating secret: $SECRET_NAME"
    
    # Check if secret exists
    if gcloud secrets describe $SECRET_NAME --project=$PROJECT_ID &>/dev/null; then
        echo "  ✓ Secret $SECRET_NAME already exists, adding new version..."
        echo -n "$SECRET_VALUE" | gcloud secrets versions add $SECRET_NAME \
            --data-file=- \
            --project=$PROJECT_ID
    else
        echo "  → Creating new secret..."
        echo -n "$SECRET_VALUE" | gcloud secrets create $SECRET_NAME \
            --data-file=- \
            --replication-policy="automatic" \
            --project=$PROJECT_ID \
            --labels="app=careercopilot,environment=production"
        
        # Grant access to App Engine service account
        echo "  → Granting access to App Engine service account..."
        gcloud secrets add-iam-policy-binding $SECRET_NAME \
            --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
            --role="roles/secretmanager.secretAccessor" \
            --project=$PROJECT_ID
    fi
    
    echo "  ✅ $SECRET_NAME configured"
}

# Generate JWT secret if not provided
echo ""
read -p "Do you want to generate a new JWT_SECRET_KEY? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    JWT_SECRET=$(openssl rand -hex 32)
    echo "Generated JWT_SECRET_KEY: ${JWT_SECRET:0:16}... (truncated)"
    create_secret "JWT_SECRET_KEY" "$JWT_SECRET" "JWT secret for authentication tokens"
else
    echo "⚠️  Skipping JWT_SECRET_KEY (you can create it manually)"
fi

# Generate DB password if not provided
echo ""
read -p "Do you want to generate a new DB_PASSWORD? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    DB_PASS=$(openssl rand -hex 16)
    echo "Generated DB_PASSWORD: ${DB_PASS:0:8}... (truncated)"
    create_secret "DB_PASSWORD" "$DB_PASS" "Database password"
else
    echo "⚠️  Skipping DB_PASSWORD (you can create it manually)"
fi

# GEMINI_API_KEY (optional - can use Vertex AI instead)
echo ""
read -p "Do you have a GEMINI_API_KEY to add? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter GEMINI_API_KEY: " GEMINI_KEY 
    create_secret "GEMINI_API_KEY" "$GEMINI_KEY" "Gemini API key for AI services"
else
    echo "ℹ️  Skipping GEMINI_API_KEY (will use Vertex AI default credentials)"
fi

echo ""
echo "✅ GCP Secret Manager setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update backend/app.yaml to reference these secrets"
echo "2. Deploy to App Engine: gcloud app deploy"
echo "3. Verify secrets are accessible in production logs"
echo ""
echo "🔍 To view configured secrets:"
echo "gcloud secrets list --project=$PROJECT_ID --filter='labels.app=careercopilot'"
echo ""
echo "🔑 To access a secret value:"
echo "gcloud secrets versions access latest --secret=JWT_SECRET_KEY --project=$PROJECT_ID"

