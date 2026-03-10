#!/bin/bash

# This script validates and builds the Kerala Rage design token system.
# Source of truth: frontend/src/design/tokens/tokens.json
#
# Usage: ./scripts/update-design-system.sh

set -e

echo "🚀 Starting Kerala Rage Design System update..."

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


# Step 1: Validate the Kerala Rage tokens
echo ""
echo "[Step 1/2] Validating Kerala Rage tokens..."
python3 scripts/design-validation/validate-tokens.py

# Check if validation passed
if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Design token validation failed. Build aborted."
  exit 1
fi
echo "✅ Token validation successful."

# Step 2: Build the frontend assets using the M3 builder
echo ""
echo "[Step 2/2] Building frontend token assets..."
python3 scripts/build-m3-tokens.py

echo ""
echo "✨ Kerala Rage Design System update complete."
echo "New assets generated:"
echo "  - frontend/src/design/styles/design-tokens.css"
echo "  - frontend/tailwind-m3-patch.ts"
echo ""
echo "Note: The designer canonical source is: frontend/src/design/tokens/tokens.json"
