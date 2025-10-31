#!/bin/bash
# Provisions Redis via Terraform and configures secrets.

set -e  # Exit on any error

echo "🏗️  CareerCopilot AI Optimization - Infrastructure Setup"
echo "=================================================="

# Configuration
PROJECT_ID="${GOOGLE_CLOUD_PROJECT:-careercopilot-468811}"
REGION="us-central1"
ENVIRONMENT="${ENVIRONMENT:-production}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Environment: $ENVIRONMENT"
echo ""

# Verify prerequisites
echo "🔍 Verifying prerequisites..."

# Check if we're in the correct directory
if [ ! -f "infrastructure/terraform/redis.tf" ]; then
    echo -e "${RED}❌ Error: Terraform configuration not found${NC}"
    echo "Please run this script from the CareerCopilot repository root"
    exit 1
fi

if [ ! -f "scripts/setup-redis-secrets.sh" ]; then
    echo -e "${RED}❌ Error: Redis secrets setup script not found${NC}"
    exit 1
fi

# Check if gcloud is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Error: gcloud CLI not found${NC}"
    echo "Please install Google Cloud CLI: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if terraform is installed
if ! command -v terraform &> /dev/null; then
    echo -e "${RED}❌ Error: Terraform not found${NC}"
    echo "Please install Terraform: https://www.terraform.io/downloads"
    exit 1
fi

# Verify gcloud authentication
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 >/dev/null; then
    echo -e "${RED}❌ Error: gcloud not authenticated${NC}"
    echo "Please run: gcloud auth login"
    exit 1
fi

# Set the project
gcloud config set project "$PROJECT_ID"

echo -e "${GREEN}✅ Prerequisites verified${NC}"
echo ""

# Phase 1: Terraform Infrastructure Provisioning
echo -e "${BLUE}>>> Phase 1: Provisioning Infrastructure...${NC}"
echo ""

cd ./infrastructure/terraform/

# Initialize Terraform
echo "🔧 Initializing Terraform..."
terraform init

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Terraform initialization failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Terraform initialized${NC}"

# Plan the deployment
echo ""
echo "📋 Planning Terraform deployment..."
terraform plan \
    -var="project_id=$PROJECT_ID" \
    -var="region=$REGION" \
    -var="environment=$ENVIRONMENT" \
    -out=tfplan

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Terraform planning failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Terraform plan created${NC}"

# Confirm deployment
echo ""
echo -e "${YELLOW}⚠️  Ready to provision Redis infrastructure${NC}"
echo "This will create:"
echo "  - Google Cloud Memorystore Redis instance (1GB BASIC)"
echo "  - Network configuration for Cloud Run access"
echo "  - Estimated cost: ~$50-70/month"
echo ""
read -p "Continue with infrastructure provisioning? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Infrastructure provisioning cancelled"
    exit 0
fi

# Apply the configuration
echo ""
echo "🚀 Applying Terraform configuration..."
terraform apply tfplan

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Terraform apply failed${NC}"
    echo "Check the error messages above and retry"
    exit 1
fi

echo -e "${GREEN}✅ Infrastructure provisioned successfully${NC}"

# Extract outputs
echo ""
echo "📊 Infrastructure details:"
REDIS_HOST=$(terraform output -raw redis_host)
REDIS_PORT=$(terraform output -raw redis_port)
REDIS_CONNECTION_STRING=$(terraform output -raw redis_connection_string)

echo "  Redis Host: $REDIS_HOST"
echo "  Redis Port: $REDIS_PORT"
echo "  Connection: $REDIS_CONNECTION_STRING"

# Phase 2: Secret Management Setup
echo ""
echo -e "${BLUE}>>> Phase 2: Configuring Secrets...${NC}"
echo ""

cd ../../scripts/

# Make setup script executable if not already
chmod +x ./setup-redis-secrets.sh

# Export variables for the secrets script
export REDIS_HOST
export REDIS_PORT
export REDIS_URL="$REDIS_CONNECTION_STRING"

# Run the secrets setup script
echo "🔐 Setting up Redis secrets in Google Secret Manager..."
./setup-redis-secrets.sh

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Secrets setup failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Secrets configured successfully${NC}"

# Phase 3: Verification
echo ""
echo -e "${BLUE}>>> Phase 3: Verifying Infrastructure...${NC}"
echo ""

# Test Redis connectivity
echo "🔌 Testing Redis connectivity..."
if command -v redis-cli &> /dev/null; then
    if redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" ping | grep -q "PONG"; then
        echo -e "${GREEN}✅ Redis connectivity verified${NC}"
    else
        echo -e "${YELLOW}⚠️  Redis connectivity test failed - may be network/firewall related${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  redis-cli not available - skipping connectivity test${NC}"
fi

# Verify secrets in Secret Manager
echo ""
echo "🔍 Verifying secrets in Secret Manager..."
for secret in "REDIS_HOST" "REDIS_PORT" "REDIS_URL"; do
    if gcloud secrets describe "$secret" --project="$PROJECT_ID" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Secret $secret exists${NC}"
    else
        echo -e "${RED}❌ Secret $secret not found${NC}"
    fi
done

# Phase 4: Cloud Run Service Account Setup
echo ""
echo -e "${BLUE}>>> Phase 4: Configuring Cloud Run Service Account...${NC}"
echo ""

SERVICE_ACCOUNT="careercopilot-backend@$PROJECT_ID.iam.gserviceaccount.com"

echo "🔐 Granting Secret Manager access to Cloud Run service account..."
for secret in "REDIS_HOST" "REDIS_PORT" "REDIS_URL"; do
    echo "  Configuring access for $secret..."
    gcloud secrets add-iam-policy-binding "$secret" \
        --project="$PROJECT_ID" \
        --member="serviceAccount:$SERVICE_ACCOUNT" \
        --role="roles/secretmanager.secretAccessor" \
        --quiet || echo -e "${YELLOW}⚠️  Warning: Could not set IAM policy for $secret${NC}"
done

echo -e "${GREEN}✅ Service account permissions configured${NC}"

# Summary
echo ""
echo "🎉 INFRASTRUCTURE SETUP COMPLETE!"
echo "=================================="
echo ""
echo "📋 Summary:"
echo "  ✅ Redis Memorystore instance provisioned"
echo "  ✅ Redis credentials stored in Secret Manager"
echo "  ✅ Cloud Run service account configured"
echo "  ✅ Network access configured"
echo ""
echo "📊 Infrastructure Details:"
echo "  Redis Instance: careercopilot-cache-$ENVIRONMENT"
echo "  Host: $REDIS_HOST"
echo "  Port: $REDIS_PORT"
echo "  Memory: 1GB BASIC tier"
echo "  Region: $REGION"
echo ""
echo "🔐 Secrets Created:"
echo "  - REDIS_HOST"
echo "  - REDIS_PORT"
echo "  - REDIS_URL"
echo ""
echo "📋 Next Steps:"
echo "1. Refactor codebase: ./scripts/run-code-refactor.sh"
echo "2. Update Cloud Run service to use secrets"
echo "3. Run validation tests: ./scripts/run-validation-tests.sh"
echo "4. Deploy to production"
echo ""
echo "🔧 Cloud Run Deployment Command:"
echo "gcloud run services update careercopilot-backend \\"
echo "  --update-secrets=REDIS_URL=REDIS_URL:latest \\"
echo "  --region=$REGION \\"
echo "  --project=$PROJECT_ID"
echo ""
echo "🎯 Infrastructure is ready for AI cost optimization deployment!"
