#!/bin/bash
# ======================================================
# CareerCopilot: Multi-Platform Docker Build Helper
# ======================================================
# Automatically detects architecture and builds for:
# - Current platform (for local development)
# - Intel iMac (linux/amd64)
# - Apple Silicon (linux/arm64) [optional]
# ======================================================

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  CareerCopilot Docker Build Helper    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"

# Detect current architecture
ARCH=$(uname -m)
case $ARCH in
    x86_64)
        CURRENT_PLATFORM="linux/amd64"
        ARCH_NAME="Intel/AMD (x86_64)"
        ;;
    arm64|aarch64)
        CURRENT_PLATFORM="linux/arm64"
        ARCH_NAME="Apple Silicon/ARM (arm64)"
        ;;
    *)
        echo -e "${RED}Unknown architecture: $ARCH${NC}"
        exit 1
        ;;
esac

echo -e "${BLUE}Current Platform:${NC} $ARCH_NAME"
echo ""

# Parse command line arguments
BUILD_MODE=${1:-local}

case $BUILD_MODE in
    local)
        echo -e "${YELLOW}Building for current platform only...${NC}"
        docker buildx build \
            --platform $CURRENT_PLATFORM \
            --load \
            -t careercopilot-dev:latest \
            .
        echo -e "${GREEN}✓ Local build complete!${NC}"
        echo -e "${GREEN}Run: docker-compose up -d${NC}"
        ;;

    intel)
        echo -e "${YELLOW}Building for Intel iMac (linux/amd64)...${NC}"
        docker buildx build \
            --platform linux/amd64 \
            --load \
            -t careercopilot-dev:latest \
            -t careercopilot-dev:amd64 \
            .
        echo -e "${GREEN}✓ Intel iMac build complete!${NC}"
        ;;

    multi)
        echo -e "${YELLOW}Building for multiple platforms (amd64 + arm64)...${NC}"
        docker buildx build \
            --platform linux/amd64,linux/arm64 \
            --load \
            -t careercopilot-dev:latest \
            .
        echo -e "${GREEN}✓ Multi-platform build complete!${NC}"
        ;;

    push)
        # Check if DOCKER_REGISTRY is set
        REGISTRY=${DOCKER_REGISTRY:-""}
        if [ -z "$REGISTRY" ]; then
            echo -e "${RED}Error: DOCKER_REGISTRY environment variable not set${NC}"
            echo -e "${YELLOW}Example: export DOCKER_REGISTRY=gcr.io/your-project${NC}"
            echo -e "${YELLOW}Or:      export DOCKER_REGISTRY=yourusername/careercopilot${NC}"
            exit 1
        fi

        echo -e "${YELLOW}Building and pushing to $REGISTRY...${NC}"
        docker buildx build \
            --platform linux/amd64,linux/arm64 \
            --push \
            -t $REGISTRY:latest \
            -t $REGISTRY:$(date +%Y%m%d-%H%M%S) \
            .
        echo -e "${GREEN}✓ Images pushed to registry!${NC}"
        echo -e "${GREEN}Pull with: docker pull $REGISTRY:latest${NC}"
        ;;

    *)
        echo -e "${RED}Unknown build mode: $BUILD_MODE${NC}"
        echo ""
        echo "Usage: $0 [MODE]"
        echo ""
        echo "Modes:"
        echo "  local   - Build for current platform only (default)"
        echo "  intel   - Build for Intel iMac (linux/amd64)"
        echo "  multi   - Build for both Intel and Apple Silicon"
        echo "  push    - Build and push to registry (requires DOCKER_REGISTRY env var)"
        echo ""
        echo "Examples:"
        echo "  $0 local"
        echo "  $0 intel"
        echo "  DOCKER_REGISTRY=gcr.io/my-project/careercopilot $0 push"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}Build complete!${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
