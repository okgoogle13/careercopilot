# Multi-platform Dockerfile for CareerCopilot
# Supports: linux/amd64 (Intel iMac, Chromebook) and linux/arm64 (Apple Silicon)
# Base: Playwright image with Node.js 20 and browsers pre-installed

FROM mcr.microsoft.com/playwright:v1.42.1-jammy

# Set working directory
WORKDIR /app

# Install Python 3 and venv (required for Flash Sidekick MCP server)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Enable Corepack for Yarn Berry (v4)
RUN corepack enable && corepack prepare yarn@4.10.3 --activate

# Copy Yarn configuration
COPY .yarnrc.yml ./

# Copy package manager files (for better layer caching)
COPY package.json yarn.lock ./
COPY frontend/package.json ./frontend/
COPY functions/package.json ./functions/

# Install dependencies using Yarn Berry
RUN yarn install

# Copy the rest of the application source
COPY . .

# Create Python virtual environment and install Sidekick dependencies
RUN python3 -m venv .venv && \
    .venv/bin/pip install --upgrade pip && \
    .venv/bin/pip install google-generativeai

# Expose ports
# 5173: Vite dev server (frontend)
# 5001: Firebase Functions emulator
EXPOSE 5173 5001

# Default command (can be overridden in docker-compose)
CMD ["/bin/bash"]
