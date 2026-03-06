#!/bin/bash

# dev-server-helper.sh
# Quietly starts the frontend dev server without opening a browser.

# Navigate to frontend directory if not already there
cd "$(dirname "$0")/.."

echo "Starting Career Copilot dev server quietly..."
echo "Mode: Headless (no-open)"

# Check if yarn or npm is available
if command -v pnpm &> /dev/null; then
    pnpm run dev:quiet
elif command -v yarn &> /dev/null; then
    yarn dev:quiet
else
    npm run dev:quiet
fi
