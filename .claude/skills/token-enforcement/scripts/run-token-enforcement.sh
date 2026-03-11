#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
KIT_ROOT="$REPO_ROOT/careercopilot-migration-kit-v3"

if [ ! -d "$KIT_ROOT" ]; then
  echo "Missing migration kit: $KIT_ROOT" >&2
  exit 1
fi

cd "$KIT_ROOT"

echo "[token-enforcement] running lint"
npm run lint

echo "[token-enforcement] running design-audit"
npm run design-audit
