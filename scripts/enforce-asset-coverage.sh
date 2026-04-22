#!/bin/bash
set -euo pipefail

ROOT="/Users/okgoogle13/Projects/careercopilot"
cd "$ROOT"

REPORT=".claude/wireframes/placement_report.json"
MANIFEST="frontend/public/assets/kr-solidarity-manifest.json"
WIREFRAMES=".claude/wireframes"
RUNNER=".claude/skills/asset-placement-strategy/scripts/run_asset_placement.py"

BATCH_SIZE="${1:-20}"
TARGET_USED="${2:-30}"

echo "[1/4] Current coverage"
python3 - <<'PY'
import json
r=json.load(open('.claude/wireframes/placement_report.json'))
print('total_assets=', r.get('total_assets'))
print('used_assets=', len(r.get('used_assets',[])))
print('unused_assets=', len(r.get('unused_assets',[])))
PY

echo "[2/4] Expanding slots (batch=${BATCH_SIZE}, target_used=${TARGET_USED})"
node scripts/asset-slot-expander.js \
  --manifest "$MANIFEST" \
  --wireframes "$WIREFRAMES" \
  --report "$REPORT" \
  --batch-size "$BATCH_SIZE" \
  --target-used "$TARGET_USED" \
  --prefer-sparse-only true

echo "[3/4] Re-running asset placement"
python3 "$RUNNER" --wireframes-dir "$WIREFRAMES" --manifest "$MANIFEST"

echo "[4/4] Updated coverage"
python3 - <<'PY'
import json
r=json.load(open('.claude/wireframes/placement_report.json'))
print('total_assets=', r.get('total_assets'))
print('used_assets=', len(r.get('used_assets',[])))
print('unused_assets=', len(r.get('unused_assets',[])))
print('all_assets_accounted_for=', r.get('compliance',{}).get('all_assets_accounted_for'))
PY
