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

echo -e "${BLUE}2. Building frontend for staging...${NC}"
cd frontend
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build completed${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi
cd ..

echo -e "${BLUE}3. Running tests...${NC}"
# Add test commands here when available
echo -e "${YELLOW}⚠️  Test suite not yet implemented${NC}"

echo -e "${BLUE}4. Deploying to Firebase Hosting (Staging)...${NC}"
firebase deploy --only hosting
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend deployed to staging${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo -e "${BLUE}5. Deployment summary...${NC}"
echo "Environment: Staging"
echo "Frontend URL: https://careercopilot-staging.web.app"
echo "Firebase Project: careercopilot-staging"
echo ""
echo -e "${GREEN}🎉 Staging deployment completed successfully!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Test the staging deployment"
echo "  2. If everything looks good, deploy to production with: ./scripts/deploy-production.sh"