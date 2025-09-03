#!/bin/bash
# Switch CareerCopilot to Development/Staging Environment
# Usage: ./scripts/switch-to-development.sh

set -e

echo "🔄 Switching CareerCopilot to Development/Staging Environment..."

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

echo -e "${BLUE}1. Switching Firebase CLI to staging project...${NC}"
firebase use careercopilot-staging
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Firebase CLI now using careercopilot-staging${NC}"
else
    echo -e "${RED}❌ Failed to switch Firebase project${NC}"
    exit 1
fi

echo -e "${BLUE}2. Configuring frontend environment...${NC}"
cd frontend
if [ -f ".env.development" ]; then
    cp .env.development .env
    echo -e "${GREEN}✅ Frontend configured for staging environment${NC}"
else
    echo -e "${YELLOW}⚠️  .env.development not found, keeping current .env${NC}"
fi
cd ..

echo -e "${BLUE}3. Configuring backend environment...${NC}"
cd backend
if [ -f ".env.development" ]; then
    cp .env.development .env
    echo -e "${GREEN}✅ Backend configured for staging environment${NC}"
else
    echo -e "${YELLOW}⚠️  backend/.env.development not found${NC}"
fi
cd ..

echo -e "${BLUE}4. Validating environment configuration...${NC}"
echo "Current Firebase project: $(firebase use)"
echo "Frontend environment: $(grep VITE_FIREBASE_PROJECT_ID frontend/.env 2>/dev/null || echo 'Not configured')"
echo "Backend environment: $(grep GCP_PROJECT_ID backend/.env 2>/dev/null || echo 'Not configured')"

echo -e "${GREEN}🎉 Development environment activated!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Restart your development servers"
echo "  2. Run: cd backend && python -m uvicorn app.main:app --reload --port 8001"
echo "  3. Run: cd frontend && npm run dev"
echo ""
echo -e "${YELLOW}Note: All data will be stored in the staging Firebase project and local SQLite database${NC}"
