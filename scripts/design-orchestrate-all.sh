#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "== stage:path-integrity =="
python3 scripts/check_runtime_asset_paths.py
python3 scripts/kr/manifest-reconciler-mcp.py >/tmp/manifest-reconcile.json
python3 - <<'PY'
import json,sys
data=json.load(open('/tmp/manifest-reconcile.json'))
issues=data.get('issues',[])
orphans=sum(i.get('count',0) for i in issues if i.get('type')=='orphaned_disk_files')
broken=sum(i.get('count',0) for i in issues if i.get('type')=='missing_files')
print(json.dumps({"orphans":orphans,"broken_refs":broken},indent=2))
if orphans>0 or broken>0:
    sys.exit(1)
PY

echo "== stage:hero-render-check =="
python3 scripts/check_hero_render_presence.py

echo "== stage:token-compliance =="
python3 scripts/design-validation/validate-tokens.py

echo "== stage:visual-compliance =="
python3 scripts/check_visual_compliance.py

echo "== pipeline-gate: PASS =="
