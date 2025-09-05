#!/bin/bash
# Deploy CareerCopilot to Production Environment
# Usage: ./scripts/deploy-production.sh

set -e

echo "🚀 Deploying CareerCopilot to Production Environment..."

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

# Safety checks
echo -e "${RED}⚠️  PRODUCTION DEPLOYMENT WARNING ⚠️${NC}"
echo -e "${YELLOW}You are about to deploy to the LIVE production environment!${NC}"
echo -e "${YELLOW}This will affect real users and live data.${NC}"
echo ""
echo -e "${BLUE}Pre-deployment checklist:${NC}"
echo "  ✓ Have you tested everything in staging?"
echo "  ✓ Are all tests passing?"
echo "  ✓ Have you backed up production data?"
echo "  ✓ Is the team aware of this deployment?"
echo ""
read -p "Are you sure you want to deploy to PRODUCTION? (type 'DEPLOY' to continue): " confirm
if [ "$confirm" != "DEPLOY" ]; then
    echo -e "${BLUE}Deployment cancelled for safety.${NC}"
    exit 0
fi

echo -e "${BLUE}1. Switching to production environment...${NC}"
./scripts/switch-to-production.sh

echo -e "${BLUE}2. Installing dependencies...${NC}"
yarn install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Dependency installation failed${NC}"
    exit 1
fi

echo -e "${BLUE}3. Building frontend for production...${NC}"
yarn build:frontend
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend production build completed${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

echo -e "${BLUE}4. Running linting and type checks...${NC}"
yarn lint
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Linting failed${NC}"
    exit 1
fi

echo -e "${BLUE}5. Running tests...${NC}"
yarn test --passWithNoTests
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Tests failed${NC}"
    exit 1
fi

echo -e "${BLUE}6. Final confirmation before deployment...${NC}"
read -p "Last chance to cancel. Deploy to PRODUCTION now? (yes/no): " final_confirm
if [ "$final_confirm" != "yes" ]; then
    echo -e "${BLUE}Deployment cancelled.${NC}"
    exit 0
fi

echo -e "${BLUE}7. Deploying to Firebase (Production)...${NC}"
firebase deploy --only hosting,functions
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Application deployed to production${NC}"
else
    echo -e "${RED}❌ Production deployment failed${NC}"
    exit 1
fi

echo -e "${BLUE}8. Deployment summary...${NC}"
echo "Environment: Production"
echo "Frontend URL: https://careercopilot-468811.web.app"
echo "Firebase Project: careercopilot-468811"
echo "Deployment Time: $(date)"
echo ""
echo -e "${GREEN}🎉 PRODUCTION DEPLOYMENT COMPLETED!${NC}"
echo -e "${BLUE}Post-deployment tasks:${NC}"
echo "  1. Monitor application logs for errors"
echo "  2. Test critical user flows"
echo "  3. Check analytics for any anomalies"
echo "  4. Notify team of successful deployment"
echo ""
echo -e "${YELLOW}Remember to switch back to development: ./scripts/switch-to-development.sh${NC}"
