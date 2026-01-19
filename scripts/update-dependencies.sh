#!/bin/bash
# Update all dependencies in a controlled manner

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting dependency update process...${NC}"

# Update frontend dependencies
echo -e "\n${GREEN}🔄 Updating frontend dependencies...${NC}"
cd frontend

# Create a backup of package.json
cp package.json package.json.bak

# Update package.json with the latest versions
echo -e "\n${YELLOW}Updating Node.js dependencies...${NC}"
yarn dlx npm-check-updates -u

# Install the updated dependencies
if [ -f "package-lock.json" ]; then
  rm package-lock.json
fi
yarn install

# Run tests to ensure everything still works
echo -e "\n${YELLOW}Running frontend tests...${NC}
yarn test

# Update backend Python dependencies
echo -e "\n${GREEN}🔄 Updating backend dependencies...${NC}"
cd ../backend

# Create a backup of requirements.in
cp requirements.in requirements.in.bak

# Update Python dependencies
echo -e "\n${YELLOW}Updating Python dependencies...${NC}"
pip-compile --upgrade

# Install the updated dependencies
pip install -r requirements.txt

# Run tests to ensure everything still works
echo -e "\n${YELLOW}Running backend tests...${NC}
python -m pytest

# Update development dependencies
echo -e "\n${YELLOW}Updating development dependencies...${NC}"
pip-compile --upgrade requirements-dev.in
pip install -r requirements-dev.txt

echo -e "\n${GREEN}✅ All dependencies have been updated successfully!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Review the changes in package.json and requirements.in"
echo "2. Commit the updated lock files (package-lock.json, requirements.txt, requirements-dev.txt)"
echo "3. Test the application thoroughly before deploying"

# Make the scripts executable
chmod +x /Applications/careercopilot/scripts/check-updates.sh
chmod +x /Applications/careercopilot/scripts/update-dependencies.sh
