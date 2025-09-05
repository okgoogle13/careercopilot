#!/bin/bash
# Test Deployment Scripts
# Usage: ./scripts/test-deployment.sh

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🧪 Testing CareerCopilot Deployment Scripts"
echo ""

# Check if we're in the right directory
if [ ! -f "firebase.json" ]; then
    echo -e "${RED}Error: Please run this script from the CareerCopilot root directory${NC}"
    exit 1
fi

echo -e "${BLUE}1. Testing dependency installation...${NC}"
yarn install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Dependency installation failed${NC}"
    exit 1
fi

echo -e "${BLUE}2. Testing linting...${NC}"
yarn lint:ci || {
    echo -e "${YELLOW}⚠️  Linting issues found (continuing with test)${NC}"
}

echo -e "${BLUE}3. Testing frontend build...${NC}"
yarn build:frontend
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"

    # Check if dist directory exists
    if [ -d "frontend/dist" ]; then
        echo -e "${GREEN}✅ Frontend dist directory created${NC}"
        ls -la frontend/dist/ | head -5
    else
        echo -e "${RED}❌ Frontend dist directory not found${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

echo -e "${BLUE}4. Testing functions build...${NC}"
yarn build:functions
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Functions build successful${NC}"

    # Check if lib directory exists
    if [ -d "functions/lib" ]; then
        echo -e "${GREEN}✅ Functions lib directory created${NC}"
        ls -la functions/lib/ | head -5
    else
        echo -e "${RED}❌ Functions lib directory not found${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Functions build failed${NC}"
    exit 1
fi

echo -e "${BLUE}5. Testing Firebase configuration...${NC}"
if firebase use --add 2>/dev/null; then
    echo -e "${GREEN}✅ Firebase configuration is valid${NC}"
else
    echo -e "${YELLOW}⚠️  Firebase configuration needs setup${NC}"
    echo -e "${YELLOW}    Run: firebase login && firebase use --add${NC}"
fi

echo -e "${BLUE}6. Testing deployment script permissions...${NC}"
if [ -x "scripts/deploy.sh" ]; then
    echo -e "${GREEN}✅ Main deployment script is executable${NC}"
else
    echo -e "${RED}❌ Main deployment script is not executable${NC}"
    echo -e "${YELLOW}    Run: chmod +x scripts/deploy.sh${NC}"
    exit 1
fi

echo -e "${BLUE}7. Testing deployment script help...${NC}"
./scripts/deploy.sh --help
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment script help works${NC}"
else
    echo -e "${RED}❌ Deployment script help failed${NC}"
    exit 1
fi

echo -e "${BLUE}8. Checking project structure...${NC}"
required_dirs=(
    "frontend/src"
    "functions/src"
    "backend/app"
    "docs"
    "scripts"
)

for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅ $dir exists${NC}"
    else
        echo -e "${RED}❌ $dir missing${NC}"
        exit 1
    fi
done

echo -e "${BLUE}9. Checking package.json workspace configuration...${NC}"
if grep -q "careercopilot-frontend" package.json && grep -q "functions" package.json; then
    echo -e "${GREEN}✅ Workspace configuration is correct${NC}"
else
    echo -e "${RED}❌ Workspace configuration needs updating${NC}"
    exit 1
fi

echo -e "${BLUE}10. Clean up test artifacts...${NC}"
yarn clean
echo -e "${GREEN}✅ Test artifacts cleaned${NC}"

echo ""
echo -e "${GREEN}🎉 All deployment tests passed!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "  1. Configure Firebase projects: firebase use --add"
echo "  2. Set up environment secrets for staging/production"
echo "  3. Test actual deployment: ./scripts/deploy.sh staging"
echo "  4. Configure CI/CD pipeline secrets"
echo ""
echo -e "${BLUE}📖 Available deployment commands:${NC}"
echo "  ./scripts/deploy.sh staging      # Deploy to staging"
echo "  ./scripts/deploy.sh production   # Deploy to production"
echo "  ./scripts/deploy.sh frontend     # Deploy only frontend"
echo "  ./scripts/deploy.sh functions    # Deploy only functions"
echo "  ./scripts/deploy.sh all          # Deploy everything"
