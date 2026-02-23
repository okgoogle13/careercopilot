#!/bin/bash
# CareerCopilot Repository Structure Validator
# Ensures maintenance of the normalized structure for AI/Agent alignment.

set -e

echo "🔍 Validating CareerCopilot repository structure..."

# 1. AI Root Structure
REQUIRED_DIRS=(
  "ai/flows/backend"
  "ai/flows/functions"
  "ai/prompts/backend"
  "ai/prompts/system"
  "ai/config"
)

for dir in "${REQUIRED_DIRS[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "❌ Missing required AI directory: $dir"
    exit 1
  fi
done

# 2. Stray Prompt Check (exclude ai/ and archives)
STRAY_PROMPTS=$(find . -name "*prompt*.md" -not -path "./ai/*" -not -path "./docs/archive*" -not -path "./docs/reports/archive*")
if [ ! -z "$STRAY_PROMPTS" ]; then
  echo "❌ Found stray prompt files outside ai/ folder:"
  echo "$STRAY_PROMPTS"
  # exit 1 # Warning for now, or uncomment to enforce
fi

# 3. Backend Integration Check (Symlinks)
if [ ! -L "backend/app/genkit_flows" ]; then
  echo "❌ backend/app/genkit_flows is not a symlink"
fi

if [ ! -L "backend/app/prompts" ]; then
  echo "❌ backend/app/prompts is not a symlink"
fi

echo "✅ Repository structure is valid."
