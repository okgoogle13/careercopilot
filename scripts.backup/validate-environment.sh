#!/bin/bash
# Validate CareerCopilot Environment Configuration
# Usage: ./scripts/validate-environment.sh [staging|production]

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Default to checking current environment if no parameter provided
TARGET_ENV=${1:-"current"}

echo "🔍 Validating CareerCopilot Environment Configuration..."

# Check if we're in the right directory
if [ ! -f "firebase.json" ]; then
    echo -e "${RED}❌ Error: Please run this script from the CareerCopilot root directory${NC}"
    exit 1
fi

# Initialize validation results
VALIDATION_PASSED=true
WARNINGS=0
ERRORS=0

echo -e "${BLUE}Environment Validation Report${NC}"
echo "================================"

# 1. Firebase CLI Configuration
echo -e "${BLUE}1. Firebase CLI Configuration${NC}"
CURRENT_PROJECT=$(firebase use 2>/dev/null || echo "not-set")
if [ "$CURRENT_PROJECT" == "not-set" ]; then
    echo -e "${RED}❌ Firebase CLI not configured${NC}"
    ERRORS=$((ERRORS + 1))
    VALIDATION_PASSED=false
else
    echo -e "${GREEN}✅ Active project: $CURRENT_PROJECT${NC}"
fi

# 2. Frontend Environment Configuration
echo -e "${BLUE}2. Frontend Environment Configuration${NC}"
if [ -f "frontend/.env" ]; then
    FRONTEND_PROJECT=$(grep "VITE_FIREBASE_PROJECT_ID" frontend/.env | cut -d'=' -f2 | tr -d '"' 2>/dev/null || echo "not-found")
    FRONTEND_ENVIRONMENT=$(grep "VITE_ENVIRONMENT" frontend/.env | cut -d'=' -f2 | tr -d '"' 2>/dev/null || echo "not-specified")

    if [ "$FRONTEND_PROJECT" == "not-found" ]; then
        echo -e "${RED}❌ Frontend Firebase project ID not configured${NC}"
        ERRORS=$((ERRORS + 1))
        VALIDATION_PASSED=false
    else
        echo -e "${GREEN}✅ Frontend project: $FRONTEND_PROJECT${NC}"
        echo -e "${GREEN}✅ Frontend environment: $FRONTEND_ENVIRONMENT${NC}"
    fi
else
    echo -e "${RED}❌ Frontend .env file not found${NC}"
    ERRORS=$((ERRORS + 1))
    VALIDATION_PASSED=false
fi

# 3. Backend Environment Configuration
echo -e "${BLUE}3. Backend Environment Configuration${NC}"
if [ -f "backend/.env" ]; then
    BACKEND_PROJECT=$(grep "GCP_PROJECT_ID" backend/.env | cut -d'=' -f2 | tr -d '"' 2>/dev/null || echo "not-found")
    BACKEND_CREDS=$(grep "GOOGLE_APPLICATION_CREDENTIALS" backend/.env | cut -d'=' -f2 | tr -d '"' 2>/dev/null || echo "not-found")

    if [ "$BACKEND_PROJECT" == "not-found" ]; then
        echo -e "${RED}❌ Backend GCP project ID not configured${NC}"
        ERRORS=$((ERRORS + 1))
        VALIDATION_PASSED=false
    else
        echo -e "${GREEN}✅ Backend project: $BACKEND_PROJECT${NC}"
    fi

    if [ "$BACKEND_CREDS" == "not-found" ]; then
        echo -e "${RED}❌ Backend credentials path not configured${NC}"
        ERRORS=$((ERRORS + 1))
        VALIDATION_PASSED=false
    else
        # Check if credentials file exists
        if [ -f "$BACKEND_CREDS" ]; then
            echo -e "${GREEN}✅ Backend credentials: $BACKEND_CREDS${NC}"
        else
            echo -e "${RED}❌ Backend credentials file not found: $BACKEND_CREDS${NC}"
            ERRORS=$((ERRORS + 1))
            VALIDATION_PASSED=false
        fi
    fi
else
    echo -e "${RED}❌ Backend .env file not found${NC}"
    ERRORS=$((ERRORS + 1))
    VALIDATION_PASSED=false
fi

# 4. Environment Consistency Check
echo -e "${BLUE}4. Environment Consistency Check${NC}"
if [ "$CURRENT_PROJECT" != "not-set" ] && [ "$FRONTEND_PROJECT" != "not-found" ] && [ "$BACKEND_PROJECT" != "not-found" ]; then
    if [ "$CURRENT_PROJECT" == "$FRONTEND_PROJECT" ] && [ "$FRONTEND_PROJECT" == "$BACKEND_PROJECT" ]; then
        echo -e "${GREEN}✅ All components aligned to: $CURRENT_PROJECT${NC}"
    else
        echo -e "${YELLOW}⚠️  Environment mismatch detected:${NC}"
        echo "   Firebase CLI: $CURRENT_PROJECT"
        echo "   Frontend:     $FRONTEND_PROJECT"
        echo "   Backend:      $BACKEND_PROJECT"
        WARNINGS=$((WARNINGS + 1))
    fi
fi

# 5. Required Files Check
echo -e "${BLUE}5. Required Configuration Files${NC}"
REQUIRED_FILES=(
    "firebase.json"
    ".firebaserc"
    "frontend/.env"
    "backend/.env"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ Missing: $file${NC}"
        ERRORS=$((ERRORS + 1))
        VALIDATION_PASSED=false
    fi
done

# 6. Service Account Keys Check
echo -e "${BLUE}6. Service Account Keys${NC}"
SERVICE_KEYS=(
    "firebase-staging-key.json"
    "firebase-prod-key.json"
)

for key in "${SERVICE_KEYS[@]}"; do
    if [ -f "$key" ]; then
        echo -e "${GREEN}✅ $key exists${NC}"
    else
        echo -e "${YELLOW}⚠️  $key not found${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
done

# 7. Environment-specific validation
if [ "$TARGET_ENV" == "staging" ] || [ "$CURRENT_PROJECT" == "careercopilot-staging" ]; then
    echo -e "${BLUE}7. Staging Environment Validation${NC}"
    if [ "$CURRENT_PROJECT" == "careercopilot-staging" ] && [ "$FRONTEND_PROJECT" == "careercopilot-staging" ]; then
        echo -e "${GREEN}✅ Properly configured for staging${NC}"
    else
        echo -e "${YELLOW}⚠️  Not fully aligned to staging environment${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
fi

if [ "$TARGET_ENV" == "production" ] || [ "$CURRENT_PROJECT" == "careercopilot-468811" ]; then
    echo -e "${BLUE}7. Production Environment Validation${NC}"
    if [ "$CURRENT_PROJECT" == "careercopilot-468811" ] && [ "$FRONTEND_PROJECT" == "careercopilot-468811" ]; then
        echo -e "${GREEN}✅ Properly configured for production${NC}"
        echo -e "${RED}⚠️  WARNING: You are in PRODUCTION mode!${NC}"
    else
        echo -e "${YELLOW}⚠️  Not fully aligned to production environment${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
fi

# Summary
echo ""
echo -e "${BLUE}Validation Summary${NC}"
echo "=================="
if [ "$VALIDATION_PASSED" == true ] && [ "$ERRORS" -eq 0 ]; then
    echo -e "${GREEN}✅ Environment validation PASSED${NC}"
    echo -e "${GREEN}✅ $WARNINGS warnings, $ERRORS errors${NC}"
    exit 0
else
    echo -e "${RED}❌ Environment validation FAILED${NC}"
    echo -e "${RED}❌ $WARNINGS warnings, $ERRORS errors${NC}"
    echo ""
    echo -e "${BLUE}Recommended actions:${NC}"
    if [ "$ERRORS" -gt 0 ]; then
        echo "  1. Fix the errors listed above"
        echo "  2. Run this validation script again"
    fi
    if [ "$WARNINGS" -gt 0 ]; then
        echo "  3. Consider switching environments with:"
        echo "     ./scripts/switch-to-development.sh"
        echo "     ./scripts/switch-to-production.sh"
    fi
    exit 1
fi
