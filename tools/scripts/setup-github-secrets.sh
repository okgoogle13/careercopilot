#!/bin/bash
# ======================================================
# GitHub Secrets Setup Script
# ======================================================
# Adds required secrets for Docker build workflow
# ======================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

REPO="okgoogle13/careercopilot"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  GitHub Secrets Configuration          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if gh CLI is authenticated
if ! gh auth status &>/dev/null; then
    echo -e "${RED}Error: GitHub CLI not authenticated${NC}"
    echo "Run: gh auth login"
    exit 1
fi

echo -e "${YELLOW}Repository: ${NC}$REPO"
echo ""

# ============================================
# GCP Secrets
# ============================================
echo -e "${BLUE}Setting up GCP secrets...${NC}"

read -p "Enter your GCP Project ID (or press Enter to skip): " GCP_PROJECT_ID
if [ ! -z "$GCP_PROJECT_ID" ]; then
    echo "$GCP_PROJECT_ID" | gh secret set GCP_PROJECT_ID -R $REPO
    echo -e "${GREEN}✓ GCP_PROJECT_ID set${NC}"
    
    echo ""
    echo -e "${YELLOW}Now we need the GCP Service Account Key (JSON)${NC}"
    echo "You can:"
    echo "1. Create one at: https://console.cloud.google.com/iam-admin/serviceaccounts"
    echo "2. Grant 'Storage Admin' role for Container Registry access"
    echo ""
    read -p "Enter path to service account JSON file: " SA_KEY_PATH
    
    if [ -f "$SA_KEY_PATH" ]; then
        gh secret set GCP_SA_KEY -R $REPO < "$SA_KEY_PATH"
        echo -e "${GREEN}✓ GCP_SA_KEY set${NC}"
    else
        echo -e "${RED}File not found: $SA_KEY_PATH${NC}"
        echo -e "${YELLOW}You'll need to add this manually${NC}"
    fi
else
    echo -e "${YELLOW}Skipping GCP setup${NC}"
fi

# ============================================
# Docker Hub Secrets
# ============================================
echo ""
echo -e "${BLUE}Setting up Docker Hub secrets...${NC}"

read -p "Enter your Docker Hub username (or press Enter to skip): " DOCKERHUB_USERNAME
if [ ! -z "$DOCKERHUB_USERNAME" ]; then
    echo "$DOCKERHUB_USERNAME" | gh secret set DOCKERHUB_USERNAME -R $REPO
    echo -e "${GREEN}✓ DOCKERHUB_USERNAME set${NC}"
    
    echo ""
    echo -e "${YELLOW}Create a Docker Hub access token at:${NC}"
    echo "https://hub.docker.com/settings/security"
    echo ""
    read -s -p "Enter Docker Hub access token: " DOCKERHUB_TOKEN
    echo ""
    
    if [ ! -z "$DOCKERHUB_TOKEN" ]; then
        echo "$DOCKERHUB_TOKEN" | gh secret set DOCKERHUB_TOKEN -R $REPO
        echo -e "${GREEN}✓ DOCKERHUB_TOKEN set${NC}"
    else
        echo -e "${RED}No token provided${NC}"
    fi
else
    echo -e "${YELLOW}Skipping Docker Hub setup${NC}"
fi

# ============================================
# Verify
# ============================================
echo ""
echo -e "${BLUE}Verifying secrets...${NC}"
gh secret list -R $REPO

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}GitHub Secrets configuration complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
