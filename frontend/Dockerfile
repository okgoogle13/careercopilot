# ===== Base Stage =====
# Using Node 20 as per CI standards
FROM node:20-alpine AS base

# Install necessary build tools for some node-modules
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Enable Corepack for Yarn v4 (Berry)
RUN corepack enable && corepack prepare yarn@4.10.3 --activate

# We need the root package manager files because this is a Yarn workspace
# Copy root configuration
COPY .yarnrc.yml ./
COPY package.json yarn.lock ./

# Copy frontend package file
COPY frontend/package.json ./frontend/

# Install dependencies for the whole workspace (optimized for CI/production)
# This uses the root yarn.lock to ensure version consistency
RUN yarn install

# ===== Development Stage =====
FROM base AS development
COPY . .
# Vite dev server port
EXPOSE 5173
# Support hot-reloading for Vite
CMD ["yarn", "workspace", "careercopilot-frontend", "dev", "--host"]

# ===== Build Stage =====
FROM base AS build
COPY . .
# Set build environment variables
ENV NODE_ENV=production
RUN yarn workspace careercopilot-frontend build

# ===== Production Stage =====
# Use a slim image for the final production bundle
FROM node:20-alpine AS production
WORKDIR /app

# Install 'serve' package for static hosting
RUN npm install -g serve

# Copy only the build artifacts from the build stage
COPY --from=build /app/frontend/dist ./dist

# Expose production port
EXPOSE 3000

# Metadata
LABEL maintainer="Antigravity AI"
LABEL project="CareerCopilot"

# Start the static file server
CMD ["serve", "-s", "dist", "-l", "3000"]
