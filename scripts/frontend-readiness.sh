#!/usr/bin/env bash
# Simple frontend readiness check: install, build, and verify dist
set -euo pipefail
ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"
# Install workspace dependencies (yarn 4 workspaces)
yarn install --immutable || yarn install
# Build frontend
yarn build:frontend
# Verify output
if [ -f "frontend/dist/index.html" ]; then
  echo "Build OK: frontend/dist/index.html found"
  exit 0
else
  echo "Build failed: frontend/dist/index.html not found" >&2
  exit 2
fi
