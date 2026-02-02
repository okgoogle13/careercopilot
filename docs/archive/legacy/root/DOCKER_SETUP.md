# 🐳 CareerCopilot Docker Setup Guide

## Overview

This guide covers multi-platform Docker setup for CareerCopilot, ensuring compatibility between:
- **Chromebook** (Linux/Debian, Intel x86_64)
- **Intel iMac** (macOS, Intel x86_64)
- **Apple Silicon Mac** *(future-proofed, ARM64)*

## Quick Start

### 1. Prerequisites

Ensure you have Docker installed on your system:

**Chromebook/Linux:**
```bash
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER  # Add yourself to docker group
# Log out and back in for group changes to take effect
```

**iMac (Docker Desktop):**
- Download and install [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
- Ensure it's running before executing commands

### 2. Environment Setup

Export your API keys (already in `~/.bashrc` on Chromebook):
```bash
export GEMINI_API_KEY="your-api-key-here"
export GITHUB_TOKEN="your-github-token-here"
```

### 3. Build the Docker Image

**Option A: Using the Helper Script (Recommended)**

```bash
# For local development on current platform
./scripts/docker-build.sh local

# For Intel iMac specifically
./scripts/docker-build.sh intel

# For both Intel and Apple Silicon
./scripts/docker-build.sh multi
```

**Option B: Using docker-compose**

```bash
docker-compose build
```

### 4. Start the Development Environment

```bash
docker-compose up -d
```

### 5. Enter the Container

```bash
docker-compose exec careercopilot bash
```

You now have a fully isolated development environment with:
- ✅ Node.js 18+ (Yarn Berry v4)
- ✅ Python 3 + venv (for MCP Sidekick)
- ✅ Playwright browsers pre-installed
- ✅ All dependencies installed

## Working with the Container

### Run Development Server

```bash
# Inside container
cd frontend
yarn dev
# Access at http://localhost:5173
```

### Run Tests

```bash
# Inside container
cd frontend
yarn test              # Unit tests (Vitest)
npx playwright test    # E2E tests
```

### Run Flash Sidekick

```bash
# Inside container
.venv/bin/python3 servers/flash_sidekick.py
```

## Multi-Platform Builds

### For iMac Users

If building on Chromebook for your iMac:

```bash
./scripts/docker-build.sh intel
```

This creates an `linux/amd64` image compatible with your Intel iMac.

### Push to Registry

To share images across machines:

**Google Container Registry (GCR):**
```bash
export DOCKER_REGISTRY="gcr.io/your-project-id/careercopilot"
./scripts/docker-build.sh push
```

**Docker Hub:**
```bash
export DOCKER_REGISTRY="yourusername/careercopilot"
./scripts/docker-build.sh push
```

Then on your iMac:
```bash
docker pull gcr.io/your-project-id/careercopilot:latest
# or
docker pull yourusername/careercopilot:latest
```

## GitHub Actions CI/CD

The workflow `.github/workflows/docker-publish.yml` automatically:
- Builds for both `linux/amd64` and `linux/arm64`
- Pushes to GCR on `main` branch commits
- Supports manual pushes to Docker Hub via `workflow_dispatch`

### Required GitHub Secrets

1. **For GCR:**
   - `GCP_PROJECT_ID`: Your GCP project ID
   - `GCP_SA_KEY`: Service account JSON key with Container Registry permissions

2. **For Docker Hub:**
   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_TOKEN`: Access token from Docker Hub

### Trigger Manual Build

Go to Actions → Docker Build & Push → Run workflow

## Troubleshooting

### Issue: `yarn install` fails in container

**Solution:** Ensure you're using the updated `Dockerfile` with Corepack enabled.

### Issue: Native module errors (e.g., `bcrypt`, `sharp`)

**Solution:** These are excluded via volume mounts in `docker-compose.yml`. The container installs its own versions.

### Issue: Cannot access localhost:5173 from host

**Solution:** Ensure port mapping is correct in `docker-compose.yml` and container is running:
```bash
docker-compose ps
```

### Issue: Python venv not working

**Solution:** The container creates its own `.venv`. Never mount your local `.venv` into the container.

## Architecture Reference

```
Chromebook (linux/amd64)  ───┐
                             ├──► Docker Image (multi-arch)
Intel iMac (linux/amd64)  ───┤
                             │
Apple Silicon (linux/arm64) ─┘
```

## File Structure

```
careercopilot-1/
├── Dockerfile                      # Multi-platform image definition
├── docker-compose.yml              # Orchestration config
├── .dockerignore                   # Build context exclusions
├── scripts/
│   └── docker-build.sh            # Build helper script
└── .github/
    └── workflows/
        └── docker-publish.yml     # CI/CD automation
```

## Best Practices

1. **Always use the helper script** for cross-platform builds
2. **Never mount** `.venv` or `node_modules` from host to container
3. **Use volume exclusions** in `docker-compose.yml` for platform-specific binaries
4. **Push to registry** for sharing images across machines
5. **Check architecture** before deploying: `docker inspect careercopilot-dev:latest | grep Architecture`

## Next Steps

- [ ] Set up GCP service account for GCR pushes
- [ ] Configure Docker Hub tokens for CI/CD
- [ ] Test iMac deployment with pulled image
- [ ] Document production deployment strategy
