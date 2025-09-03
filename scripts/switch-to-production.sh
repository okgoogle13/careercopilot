#!/bin/bash
# Switch CareerCopilot to Production Environment
# Usage: ./scripts/switch-to-production.sh

set -e

echo "🚀 Switching CareerCopilot to Production Environment..."

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

# Confirmation prompt
echo -e "${RED}⚠️  WARNING: You are switching to PRODUCTION environment!${NC}"
echo -e "${YELLOW}This will affect live user data and services.${NC}"
read -p "Are you sure you want to continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo -e "${BLUE}Operation cancelled.${NC}"
    exit 0
fi

echo -e "${BLUE}1. Switching Firebase CLI to production project...${NC}"
firebase use careercopilot-468811
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Firebase CLI now using careercopilot-468811 (PRODUCTION)${NC}"
else
    echo -e "${RED}❌ Failed to switch Firebase project${NC}"
    exit 1
fi

echo -e "${BLUE}2. Configuring frontend environment...${NC}"
cd frontend
if [ -f ".env.production" ]; then
    cp .env.production .env
    echo -e "${GREEN}✅ Frontend configured for production environment${NC}"
else
    echo -e "${RED}❌ .env.production not found${NC}"
    exit 1
fi
cd ..

echo -e "${BLUE}3. Configuring backend environment...${NC}"
cd backend
if [ -f "../.env.production" ]; then
    cp ../.env.production .env
    echo -e "${GREEN}✅ Backend configured for production environment${NC}"
else
    echo -e "${RED}❌ .env.production not found${NC}"
    exit 1
fi
cd ..

echo -e "${BLUE}4. Validating environment configuration...${NC}"
echo "Current Firebase project: $(firebase use)"
echo "Frontend environment: $(grep VITE_FIREBASE_PROJECT_ID frontend/.env 2>/dev/null || echo 'Not configured')"
echo "Backend environment: $(grep GCP_PROJECT_ID backend/.env 2>/dev/null || echo 'Not configured')"

echo -e "${GREEN}🚀 Production environment activated!${NC}"
echo -e "${RED}⚠️  IMPORTANT REMINDERS:${NC}"
echo "  1. You are now connected to LIVE production data"
echo "  2. All changes will affect real users"
echo "  3. Use staging environment for testing: ./scripts/switch-to-development.sh"
echo "  4. Deploy with: firebase deploy"
echo ""
echo -e "${BLUE}Production deployment commands:${NC}"
echo "  Frontend: npm run build && firebase deploy --only hosting"
echo "  Backend: Deploy to your production server"