#!/bin/bash
# Deploy CareerCopilot to Staging Environment
# Usage: ./scripts/deploy-staging.sh

set -e

echo "🚀 Deploying CareerCopilot to Staging Environment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "firebase.json" ]; then
    echo -e "${RED}Error: Please run this script from the CareerCopilot root directory${NC}"
    exit 1
fi

echo -e "${BLUE}1. Switching to staging environment...${NC}"
./scripts/switch-to-development.sh

echo -e "${BLUE}2. Installing dependencies...${NC}"
yarn install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Dependency installation failed${NC}"
    exit 1
fi

echo -e "${BLUE}3. Building frontend for staging...${NC}"
yarn build:frontend
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build completed${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

echo -e "${BLUE}4. Running linting...${NC}"
yarn lint
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Linting issues found (continuing with deployment)${NC}"
fi

echo -e "${BLUE}5. Running tests...${NC}"
yarn test --passWithNoTests
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Some tests failed (continuing with staging deployment)${NC}"
fi

echo -e "${BLUE}6. Deploying to Firebase (Staging)...${NC}"
firebase deploy --only hosting,functions
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Application deployed to staging${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo -e "${BLUE}7. Deployment summary...${NC}"
echo "Environment: Staging"
echo "Frontend URL: https://careercopilot-staging.web.app"
echo "Firebase Project: careercopilot-staging"
echo ""
echo -e "${GREEN}🎉 Staging deployment completed successfully!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Test the staging deployment"
echo "  2. If everything looks good, deploy to production with: ./scripts/deploy-production.sh"
