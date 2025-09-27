#!/bin/bash
# Frontend Deployment Readiness Script

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting frontend deployment readiness check...${NC}"

# Check if in the correct directory
if [[ ! -f "package.json" ]]; then
    echo -e "${RED}❌ Error: Please run this script from the frontend root directory${NC}"
    exit 1
fi

# 1. Check Node.js version
REQUIRED_NODE="16.0.0"
CURRENT_NODE=$(node -v | cut -d 'v' -f 2)
if [ "$(printf '%s\n' "$REQUIRED_NODE" "$CURRENT_NODE" | sort -V | head -n1)" = "$REQUIRED_NODE" ]; then
    echo -e "${GREEN}✓ Node.js version $CURRENT_NODE is compatible${NC}"
else
    echo -e "${RED}❌ Error: Node.js $REQUIRED_NODE or higher is required (found $CURRENT_NODE)${NC}"
    exit 1
fi

# 2. Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Dependencies not installed. Running 'yarn install'...${NC}"
    yarn install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error: Failed to install dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${GREEN}✓ Dependencies are already installed${NC}"
fi

# 3. Check for outdated packages
echo -e "\n${YELLOW}🔍 Checking for outdated packages...${NC}"
yarn outdated || echo -e "${YELLOW}⚠️  Some packages are outdated. Consider updating them.${NC}"

# 4. Run TypeScript type checking
echo -e "\n${YELLOW}🔍 Running TypeScript type checking...${NC}"
npx tsc --noEmit
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ TypeScript type checking passed${NC}"
else
    echo -e "${RED}❌ Error: TypeScript type checking failed${NC}"
    exit 1
fi

# 5. Run ESLint
echo -e "\n${YELLOW}🔍 Running ESLint...${NC}"
yarn lint
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ ESLint check passed${NC}"
else
    echo -e "${RED}❌ Error: ESLint check failed${NC}"
    exit 1
fi

# 6. Run Prettier
echo -e "\n${YELLOW}🔍 Running Prettier check...${NC}"
yarn format:check
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Prettier check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Code formatting issues found. Running formatter...${NC}"
    yarn format
    echo -e "${YELLOW}✓ Code formatting fixed. Please review the changes and commit them.${NC}"
fi

# 7. Run tests
echo -e "\n${YELLOW}🔍 Running tests...${NC}"
yarn test --watchAll=false
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Tests passed${NC}"
else
    echo -e "${RED}❌ Error: Tests failed${NC}"
    exit 1
fi

# 8. Build the application
echo -e "\n${YELLOW}🏗️  Building the application...${NC}"
yarn build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build completed successfully${NC}"
else
    echo -e "${RED}❌ Error: Build failed${NC}"
    exit 1
fi

echo -e "\n${GREEN}🎉 Frontend is ready for deployment!${NC}"
echo -e "${YELLOW}You can now proceed with the deployment using 'yarn deploy'${NC}"
