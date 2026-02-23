#!/bin/bash

# This script validates and builds the design token system.
# It should be run after the 'design-token-generator' skill
# has updated 'frontend/src/design/tokens/tokens.json'.
#
# Usage: ./scripts/update-design-system.sh

set -e

echo "🚀 Starting Design System update..."

# Ensure python3 is available
if ! command -v python3 &> /dev/null
then
    echo "Error: python3 is not found. Please install python3."
    exit 1
fi

# Ensure pip dependencies are installed
if ! python3 -c "import wcag_contrast_ratio" &> /dev/null
then
    echo "Warning: 'wcag_contrast_ratio' not found. Attempting to install..."
    pip install wcag_contrast_ratio
fi


# Step 1: Validate the new tokens
echo ""
echo "[Step 1/2] Validating design tokens..."
python3 scripts/design-validation/validate-tokens.py

# Check if validation passed
if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Design token validation failed. Build aborted."
  exit 1
fi
echo "✅ Token validation successful."

# Step 2: Build the frontend assets
echo ""
echo "[Step 2/2] Building frontend token assets..."
python3 scripts/build-m3-tokens.py

echo ""
echo "✨ Design System update complete."
echo "New assets created:"
echo "  - frontend/src/design/styles/design-tokens.css"
echo "  - frontend/tailwind-m3-patch.js"
echo ""
echo "Remember to import 'design-tokens.css' in your app and merge the patch into 'tailwind.config.js'."
