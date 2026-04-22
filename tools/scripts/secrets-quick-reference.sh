#!/bin/bash
# ============================================================================
# Secrets Management Quick Reference for CareerCopilot
# Fast commands for common secrets operations
# ============================================================================

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}CareerCopilot Secrets Quick Reference${NC}"
echo "=================================="
echo ""

# Quick setup commands
echo -e "${BLUE}Setup Commands:${NC}"
echo "  ./scripts/setup-secrets.sh                    # All platforms, production, interactive"
echo "  ./scripts/setup-secrets.sh github production  # GitHub secrets only"
echo "  ./scripts/setup-secrets.sh gcp staging        # GCP secrets for staging"
echo "  ./scripts/setup-secrets.sh aws-ses all        # AWS SES credentials"
echo ""

# Validation commands
echo -e "${BLUE}Validation Commands:${NC}"
echo "  ./scripts/validate-secrets.sh                 # Validate all secrets"
echo "  ./scripts/validate-secrets.sh github staging  # Validate GitHub staging secrets"
echo "  ./scripts/validate-secrets.sh gcp production  # Validate GCP production secrets"
echo ""

# Environment-based setup
echo -e "${BLUE}Environment Setup:${NC}"
echo "  ./scripts/setup-secrets.sh all development    # Development environment"
echo "  ./scripts/setup-secrets.sh all staging        # Staging environment"
echo "  ./scripts/setup-secrets.sh all production     # Production environment"
echo ""

# Mode variations
echo -e "${BLUE}Setup Modes:${NC}"
echo "  ./scripts/setup-secrets.sh all prod interactive  # Interactive prompts"
echo "  ./scripts/setup-secrets.sh all prod from-env      # From environment variables"
echo "  ./scripts/setup-secrets.sh all prod validate       # Validate only"
echo ""

# Legacy scripts (still available for specific tasks)
echo -e "${YELLOW}Specialized Scripts:${NC}"
echo "  ./scripts/setup-aws-ses-secrets.sh          # AWS SES to GCP only"
echo "  ./scripts/setup-aws-ses-github-secrets.sh   # AWS SES to GitHub only"
echo "  ./scripts/production-secrets-validator.py    # Python validator"
echo ""

# Help
echo -e "${BLUE}Help:${NC}"
echo "  ./scripts/setup-secrets.sh help              # Show detailed help"
echo "  ./scripts/validate-secrets.sh help           # Show validation help"
echo ""

echo -e "${GREEN}Examples:${NC}"
echo "  # Quick production setup"
echo "  ./scripts/setup-secrets.sh"
echo ""
echo "  # Validate staging secrets"
echo "  ./scripts/validate-secrets.sh all staging"
echo ""
echo "  # Setup AWS SES for all environments"
echo "  ./scripts/setup-secrets.sh aws-ses all"
echo ""
