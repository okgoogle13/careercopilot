#!/bin/bash
# Setup Redis credentials in Google Secret Manager for CareerCopilot application
# This script creates and manages Redis connection secrets for the AI caching layer

set -e  # Exit on any error

# Configuration
PROJECT_ID="${GOOGLE_CLOUD_PROJECT:-careercopilot-468811}"
ENVIRONMENT="${ENVIRONMENT:-production}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔐 Setting up Redis secrets for CareerCopilot"
echo "Project: $PROJECT_ID"
echo "Environment: $ENVIRONMENT"
echo ""

# Function to create or update a secret
create_or_update_secret() {
    local secret_name="$1"
    local secret_value="$2"
    local description="$3"

    echo "📝 Processing secret: $secret_name"

    # Check if secret already exists
    if gcloud secrets describe "$secret_name" --project="$PROJECT_ID" &>/dev/null; then
        echo -e "${YELLOW}Secret $secret_name already exists. Adding new version...${NC}"
        echo "$secret_value" | gcloud secrets versions add "$secret_name" \
            --project="$PROJECT_ID" \
            --data-file=-
    else
        echo -e "${GREEN}Creating new secret: $secret_name${NC}"
        echo "$secret_value" | gcloud secrets create "$secret_name" \
            --project="$PROJECT_ID" \
            --data-file=- \
            --labels="environment=$ENVIRONMENT,service=careercopilot,component=ai-cache"
    fi
    echo "✅ Secret $secret_name configured successfully"
    echo ""
}

# Function to get Terraform output or prompt for manual input
get_redis_info() {
    local info_type="$1"

    # Try to get from Terraform output first
    if command -v terraform &> /dev/null && [ -d "infrastructure/terraform" ]; then
        echo "🔍 Attempting to get Redis info from Terraform..."
        cd infrastructure/terraform

        if terraform show &>/dev/null; then
            case $info_type in
                "host")
                    terraform output -raw redis_host 2>/dev/null
                    ;;
                "port")
                    terraform output -raw redis_port 2>/dev/null
                    ;;
                "connection_string")
                    terraform output -raw redis_connection_string 2>/dev/null
                    ;;
            esac
        fi
        cd - &>/dev/null
    fi
}

# Get Redis connection information
echo "🔍 Gathering Redis connection information..."

REDIS_HOST=$(get_redis_info "host")
REDIS_PORT=$(get_redis_info "port")
REDIS_URL=$(get_redis_info "connection_string")

# If Terraform outputs are not available, prompt for manual input
if [ -z "$REDIS_HOST" ]; then
    echo -e "${YELLOW}Terraform output not available. Please provide Redis connection details manually.${NC}"
    echo ""
    read -p "Enter Redis host/IP address: " REDIS_HOST
fi

if [ -z "$REDIS_PORT" ]; then
    read -p "Enter Redis port (default 6379): " REDIS_PORT
    REDIS_PORT=${REDIS_PORT:-6379}
fi

if [ -z "$REDIS_URL" ]; then
    REDIS_URL="redis://$REDIS_HOST:$REDIS_PORT/0"
fi

# Validate inputs
if [ -z "$REDIS_HOST" ]; then
    echo -e "${RED}Error: Redis host is required${NC}"
    exit 1
fi

echo "📋 Redis Configuration Summary:"
echo "  Host: $REDIS_HOST"
echo "  Port: $REDIS_PORT"
echo "  Connection URL: $REDIS_URL"
echo ""

# Confirm before proceeding
read -p "Proceed with creating these secrets? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operation cancelled"
    exit 0
fi

echo ""
echo "🚀 Creating Redis secrets in Google Secret Manager..."
echo ""

# Create secrets
create_or_update_secret "REDIS_HOST" "$REDIS_HOST" "Redis instance hostname/IP for CareerCopilot AI cache"
create_or_update_secret "REDIS_PORT" "$REDIS_PORT" "Redis instance port for CareerCopilot AI cache"
create_or_update_secret "REDIS_URL" "$REDIS_URL" "Complete Redis connection URL for CareerCopilot AI cache"

# Set up IAM permissions for Cloud Run to access secrets
echo "🔐 Setting up IAM permissions for Cloud Run service..."

# Get the Cloud Run service account (assuming standard naming)
SERVICE_ACCOUNT="careercopilot-backend@$PROJECT_ID.iam.gserviceaccount.com"

# Grant Secret Manager access to the service account
for secret in "REDIS_HOST" "REDIS_PORT" "REDIS_URL"; do
    echo "   Granting access to $secret..."
    gcloud secrets add-iam-policy-binding "$secret" \
        --project="$PROJECT_ID" \
        --member="serviceAccount:$SERVICE_ACCOUNT" \
        --role="roles/secretmanager.secretAccessor" \
        --quiet || echo "   Warning: Could not set IAM policy for $secret"
done

echo ""
echo "✅ Redis secrets setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Update your Cloud Run service to use these secrets as environment variables:"
echo "   REDIS_URL -> secret:REDIS_URL"
echo ""
echo "2. Verify the secrets are accessible:"
echo "   gcloud secrets versions access latest --secret='REDIS_URL' --project='$PROJECT_ID'"
echo ""
echo "3. Test Redis connectivity from your application"
echo ""
echo "🔧 Integration Commands:"
echo "# For local development, export these environment variables:"
echo "export REDIS_HOST='$REDIS_HOST'"
echo "export REDIS_PORT='$REDIS_PORT'"
echo "export REDIS_URL='$REDIS_URL'"
echo ""
echo "# For Cloud Run deployment, add these secret bindings:"
echo "gcloud run services update careercopilot-backend \\"
echo "  --update-secrets=REDIS_URL=REDIS_URL:latest \\"
echo "  --region=us-central1 \\"
echo "  --project=$PROJECT_ID"
echo ""
echo "🎉 Redis caching is ready for CareerCopilot AI cost optimization!"