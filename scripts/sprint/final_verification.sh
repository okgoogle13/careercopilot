#!/bin/bash
set -e
echo '=== FINAL VERIFICATION ==='
echo '--- TypeScript ---'
npx tsc --noEmit && echo 'TS: PASS' || echo 'TS: FAIL'
echo '--- Literal color sweep ---'
bash scripts/sprint/sweep_literal_colors.sh
echo '--- Re-generate manifests ---'
bash scripts/sprint/generate_manifests.sh
echo '--- KR manifest validation ---'
node scripts/kr/validate-manifest.mjs && echo 'KR Manifest: PASS'
echo '--- New orphans check ---'
node scripts/detect-orphans.js | tee docs/manifests/orphans-final.json
echo '=== COMPLETE. Pass outputs to migration-audit and compliance-dashboard. ==='
