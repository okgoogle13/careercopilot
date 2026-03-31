#!/bin/bash
set -e
echo '--- Route manifest ---'
node scripts/extract-routes.js > docs/manifests/routes.json
echo '--- Orphans manifest ---'
node scripts/detect-orphans.js > docs/manifests/orphans.json
echo '--- API usage manifest ---'
node scripts/extract-api-usage.js > docs/manifests/frontend-api-usage.json
echo '--- KR asset manifest ---'
node scripts/kr/generate-manifest.mjs
node scripts/kr/validate-manifest.mjs
echo 'Manifests written. Delegating structural validation to flash-sidekick.'
