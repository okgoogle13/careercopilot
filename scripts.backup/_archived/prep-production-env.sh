#!/usr/bin/env bash
# Prepare production env file for frontend hosting using Secret Manager helper
set -euo pipefail
OUTFILE=${1:-frontend/.env.production.local}
if [ -z "${GOOGLE_CLOUD_PROJECT:-}" ]; then
  echo "Please set GOOGLE_CLOUD_PROJECT environment variable" >&2
  exit 1
fi
python3 scripts/fetch-firebase-config.py --output "$OUTFILE"
echo "Wrote production env to $OUTFILE"
