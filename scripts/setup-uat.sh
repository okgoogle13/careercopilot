#!/bin/bash

# Automated UAT Setup Script
# Initializes testing environment for Career Copilot

set -e  # Exit on error

echo "🚀 Setting up Automated UAT Environment..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Skip Playwright setup
echo -e "${BLUE}[1/5]${NC} Playwright is disabled, skipping Playwright setup..."
cd frontend

# Step 2: Create test directories
echo -e "${BLUE}[2/5]${NC} Creating test directory structure..."
mkdir -p tests/e2e
mkdir -p tests/fixtures
mkdir -p tests/visual
mkdir -p playwright-report
mkdir -p test-results

# Step 3: Install additional testing tools
echo -e "${BLUE}[3/5]${NC} Installing testing utilities..."
npm install -D @axe-core/playwright  # Accessibility testing
npm install -D lighthouse  # Performance testing

# Step 4: Setup Python testing (backend)
echo -e "${BLUE}[4/5]${NC} Setting up backend testing..."
cd ../backend
pip install pytest pytest-asyncio pytest-cov httpx
pip install pytest-mock  # For mocking

# Step 5: Create .env.test file
echo -e "${BLUE}[5/5]${NC} Creating test environment file..."
cat > ../.env.test << EOF
# Test Environment Variables
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK_AUTH=true
FIRESTORE_EMULATOR_HOST=localhost:8080
ENABLE_GENKIT_FLOWS=true
ENV=test
EOF

cd ..

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Start backend: cd backend && uvicorn app.main:app --reload"
echo "  2. Start frontend: cd frontend && npm run dev"
echo "  3. Run tests: Playwright E2E is disabled in this repository"
echo ""
echo "View test report:"
echo "  Playwright report is disabled in this repository"
echo ""
