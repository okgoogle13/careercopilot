#!/bin/bash

echo "🔧 Fixing Import Paths After ESLint Auto-Fix"
echo "==========================================="

cd "$(dirname "$0")/.."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Fixing import paths that were broken during ESLint cleanup...${NC}"

# Fix common import path issues
find frontend/src -name "*.tsx" -o -name "*.ts" | while read file; do
    echo "Checking: $file"

    # Fix StandardizedLoadingStates import
    if grep -q "from './StandardizedLoadingStates'" "$file"; then
        sed -i '' "s|from './StandardizedLoadingStates'|from '../common/StandardizedLoadingStates'|g" "$file"
        echo "  ✅ Fixed StandardizedLoadingStates import"
    fi

    # Fix other common import path issues based on typical project structure
    # Add more fixes as needed based on build errors

done

echo -e "${GREEN}✅ Import path fixes completed${NC}"
