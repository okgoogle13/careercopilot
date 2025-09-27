#!/bin/bash
# Comprehensive CareerCopilot Deployment Script
# Usage: ./scripts/deploy.sh [staging|production|all]

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Help function
show_help() {
    echo "CareerCopilot Deployment Script"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  staging       Deploy to staging environment"
    echo "  production    Deploy to production environment"
    echo "  functions     Deploy only Firebase Functions"
    echo "  frontend      Deploy only frontend"
    echo "  backend       Deploy only backend services"
    echo "  all           Deploy everything (frontend + functions + backend)"
    echo ""
    echo "Options:"
    echo "  --skip-tests  Skip running tests"
    echo "  --skip-lint   Skip linting"
    echo "  --help        Show this help message"
    echo ""
}

# Parse arguments
ENVIRONMENT=""
SKIP_TESTS=false
SKIP_LINT=false

for arg in "$@"; do
    case $arg in
        staging|production|functions|frontend|backend|all)
            ENVIRONMENT="$arg"
            ;;
        --skip-tests)
            SKIP_TESTS=true
            ;;
        --skip-lint)
            SKIP_LINT=true
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown argument: $arg${NC}"
            show_help
            exit 1
            ;;
    esac
done

if [ -z "$ENVIRONMENT" ]; then
    echo -e "${RED}Error: Please specify deployment target${NC}"
    show_help
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "$ROOT_DIR/firebase.json" ]; then
    echo -e "${RED}Error: Please run this script from the CareerCopilot root directory${NC}"
    exit 1
fi

cd "$ROOT_DIR"

echo "🚀 CareerCopilot Deployment"
echo "Environment: $ENVIRONMENT"
echo "Skip Tests: $SKIP_TESTS"
echo "Skip Lint: $SKIP_LINT"
echo ""

# Step 1: Install dependencies
install_dependencies() {
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    yarn install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Dependency installation failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Step 2: Lint code
lint_code() {
    if [ "$SKIP_LINT" = false ]; then
        echo -e "${BLUE}🔍 Running linting...${NC}"
        yarn lint
        if [ $? -ne 0 ]; then
            if [ "$ENVIRONMENT" = "production" ]; then
                echo -e "${RED}❌ Linting failed - stopping production deployment${NC}"
                exit 1
            else
                echo -e "${YELLOW}⚠️  Linting issues found (continuing with $ENVIRONMENT deployment)${NC}"
            fi
        fi
        echo -e "${GREEN}✅ Linting completed${NC}"
    else
        echo -e "${YELLOW}⏭️  Skipping linting${NC}"
    fi
}

# Step 3: Run tests
run_tests() {
    if [ "$SKIP_TESTS" = false ]; then
        echo -e "${BLUE}🧪 Running tests...${NC}"
        yarn test --passWithNoTests
        if [ $? -ne 0 ]; then
            if [ "$ENVIRONMENT" = "production" ]; then
                echo -e "${RED}❌ Tests failed - stopping production deployment${NC}"
                exit 1
            else
                echo -e "${YELLOW}⚠️  Some tests failed (continuing with $ENVIRONMENT deployment)${NC}"
            fi
        fi
        echo -e "${GREEN}✅ Tests completed${NC}"
    else
        echo -e "${YELLOW}⏭️  Skipping tests${NC}"
    fi
}

# Step 4: Build applications
build_frontend() {
    echo -e "${BLUE}🏗️  Building frontend...${NC}"
    yarn build:frontend
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Frontend build failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Frontend built successfully${NC}"
}

build_functions() {
    echo -e "${BLUE}⚡ Building functions...${NC}"
    yarn build:functions
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Functions build failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Functions built successfully${NC}"
}

# Step 5: Deploy services
deploy_frontend() {
    echo -e "${BLUE}🌐 Deploying frontend...${NC}"
    firebase deploy --only hosting
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Frontend deployment failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Frontend deployed successfully${NC}"
}

deploy_functions() {
    echo -e "${BLUE}⚡ Deploying functions...${NC}"
    firebase deploy --only functions
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Functions deployment failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Functions deployed successfully${NC}"
}

deploy_backend() {
    echo -e "${BLUE}🐍 Backend deployment...${NC}"
    echo -e "${YELLOW}ℹ️  Backend deployment depends on your infrastructure${NC}"
    echo -e "${YELLOW}ℹ️  Consider using Google Cloud Run, App Engine, or your preferred platform${NC}"
    echo -e "${YELLOW}ℹ️  Make sure to run database migrations: cd backend && alembic upgrade head${NC}"

    # Check if backend requirements are up to date
    if [ -f "backend/requirements.txt" ]; then
        echo -e "${BLUE}📋 Backend requirements found${NC}"
        echo -e "${YELLOW}ℹ️  Ensure your production environment has: pip install -r backend/requirements.txt${NC}"
    fi
}

deploy_firestore() {
    echo -e "${BLUE}🔥 Deploying Firestore rules...${NC}"
    firebase deploy --only firestore:rules,firestore:indexes
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Firestore deployment failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Firestore rules deployed successfully${NC}"
}

# Production safety check
production_safety_check() {
    if [ "$ENVIRONMENT" = "production" ]; then
        echo -e "${RED}⚠️  PRODUCTION DEPLOYMENT WARNING ⚠️${NC}"
        echo -e "${YELLOW}You are about to deploy to the LIVE production environment!${NC}"
        echo -e "${YELLOW}This will affect real users and live data.${NC}"
        echo ""
        read -p "Are you sure you want to deploy to PRODUCTION? (type 'DEPLOY' to continue): " confirm
        if [ "$confirm" != "DEPLOY" ]; then
            echo -e "${BLUE}Deployment cancelled for safety.${NC}"
            exit 0
        fi
    fi
}

# Main deployment logic
case $ENVIRONMENT in
    staging)
        production_safety_check
        install_dependencies
        lint_code
        run_tests
        build_frontend
        build_functions
        deploy_frontend
        deploy_functions
        deploy_firestore
        echo -e "${GREEN}🎉 Staging deployment completed!${NC}"
        ;;
    production)
        production_safety_check
        install_dependencies
        lint_code
        run_tests
        build_frontend
        build_functions
        deploy_frontend
        deploy_functions
        deploy_firestore
        echo -e "${GREEN}🎉 Production deployment completed!${NC}"
        ;;
    frontend)
        install_dependencies
        lint_code
        run_tests
        build_frontend
        deploy_frontend
        echo -e "${GREEN}🎉 Frontend deployment completed!${NC}"
        ;;
    functions)
        install_dependencies
        lint_code
        build_functions
        deploy_functions
        echo -e "${GREEN}🎉 Functions deployment completed!${NC}"
        ;;
    backend)
        deploy_backend
        echo -e "${GREEN}🎉 Backend deployment information provided!${NC}"
        ;;
    all)
        production_safety_check
        install_dependencies
        lint_code
        run_tests
        build_frontend
        build_functions
        deploy_frontend
        deploy_functions
        deploy_firestore
        deploy_backend
        echo -e "${GREEN}🎉 Full deployment completed!${NC}"
        ;;
esac

# Deployment summary
echo ""
echo -e "${BLUE}📊 Deployment Summary${NC}"
echo "Target: $ENVIRONMENT"
echo "Time: $(date)"
echo ""

case $ENVIRONMENT in
    staging)
        echo "🌐 Frontend: https://careercopilot-staging.web.app"
        echo "⚡ Functions: https://us-central1-careercopilot-staging.cloudfunctions.net"
        ;;
    production)
        echo "🌐 Frontend: https://careercopilot-468811.web.app"
        echo "⚡ Functions: https://us-central1-careercopilot-468811.cloudfunctions.net"
        ;;
esac

echo ""
echo -e "${BLUE}📝 Post-deployment checklist:${NC}"
echo "  1. ✓ Monitor application logs for errors"
echo "  2. ✓ Test critical user flows"
echo "  3. ✓ Check analytics for anomalies"
echo "  4. ✓ Notify team of deployment"
if [ "$ENVIRONMENT" = "production" ]; then
    echo "  5. ✓ Consider switching back to development: ./scripts/switch-to-development.sh"
fi
