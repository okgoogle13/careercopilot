#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Checking docs placement and naming..."

BAD_ROOT_DOCS=$(find "$ROOT/docs" -maxdepth 1 -type f -name "*.md" ! -name "PROJECT_INDEX.md" | wc -l | tr -d ' ')
if [[ "$BAD_ROOT_DOCS" != "0" ]]; then
  echo "FAIL: Found markdown files in docs/ root (only PROJECT_INDEX.md allowed)."
  find "$ROOT/docs" -maxdepth 1 -type f -name "*.md" ! -name "PROJECT_INDEX.md"
  exit 1
fi

BAD_NAMES=$(find "$ROOT/docs" -type f -name "*.md" | grep -v "/archive/" | grep -E " " || true)
if [[ -n "$BAD_NAMES" ]]; then
  echo "FAIL: Found docs with spaces in filename:"
  echo "$BAD_NAMES"
  exit 1
fi

BAD_CASE=$(find "$ROOT/docs" -type f -name "*.md" | grep -v "/archive/" | grep -E "[A-Z]" || true)
if [[ -n "$BAD_CASE" ]]; then
  echo "FAIL: Found docs with uppercase letters in filename (use kebab-case):"
  echo "$BAD_CASE"
  exit 1
fi

echo "Docs check passed."
