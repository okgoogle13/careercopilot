#!/bin/bash

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Clean up previous builds
rm -rf lib/

# Install correct TypeScript version
echo "Installing TypeScript 4.9.5..."
npm install typescript@4.9.5 --save-dev --save-exact

# Install other dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building project..."
npm run build

# Deploy using the local Firebase CLI
echo "Deploying to Firebase..."
cd ..
npx firebase deploy --only functions
