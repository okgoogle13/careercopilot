#!/usr/bin/env bash
# token-enforcement: repo-native grep-based token compliance scan (MIG-005 gate)
# Usage: ./run-token-enforcement.sh /route-path
# Emits JSON to stdout; exits 0 on pass, 1 on violations
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
FRONTEND_SRC="$REPO_ROOT/frontend/src"
CONTROL_DIR="$REPO_ROOT/docs/project/active/frontend-source-of-truth-migration/control"

TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  echo "Usage: $0 /route-path" >&2
  exit 1
fi

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
export REPO_ROOT CONTROL_DIR TARGET

# --- Build scan directory list ---
SCAN_DIRS=()

ROUTE_SCAN_ROOTS=$(python3 - <<'PYEOF'
import json
import os
from pathlib import Path

repo_root = Path(os.environ["REPO_ROOT"])
control_dir = Path(os.environ["CONTROL_DIR"])
target = os.environ["TARGET"]

paths = []
try:
    with (control_dir / "route-matrix.json").open() as f:
        route_matrix = json.load(f)
    route_row = next(
        (
            row for row in route_matrix.get("rows", [])
            if row.get("current_route") == target or row.get("target_route") == target
        ),
        None,
    )
    if route_row:
        paired_runtime_surface = route_row.get("paired_runtime_surface")
        if paired_runtime_surface:
            runtime_path = repo_root / paired_runtime_surface
            paths.append(str(runtime_path))
            components_dir = runtime_path.parent / "components"
            if components_dir.exists():
                paths.append(str(components_dir))
except Exception:
    pass

print("\n".join(dict.fromkeys(paths)))
PYEOF
)

while IFS= read -r scan_root; do
  [[ -n "$scan_root" ]] && [[ -e "$scan_root" ]] && SCAN_DIRS+=("$scan_root")
done <<< "$ROUTE_SCAN_ROOTS"

if [[ ${#SCAN_DIRS[@]} -eq 0 ]]; then
  for dir in "$FRONTEND_SRC/features" "$FRONTEND_SRC/pages" "$FRONTEND_SRC/screens" "$FRONTEND_SRC/components"; do
    [[ -d "$dir" ]] && SCAN_DIRS+=("$dir")
  done
fi

if [[ ${#SCAN_DIRS[@]} -eq 0 ]]; then
  # Fall back to scanning all of frontend/src
  SCAN_DIRS=("$FRONTEND_SRC")
fi

INCLUDE_EXTS=(--include="*.tsx" --include="*.ts" --include="*.css" --include="*.scss")

# --- Run grep scans ---
run_grep() {
  local pattern="$1"
  grep -rn -E "$pattern" "${SCAN_DIRS[@]}" "${INCLUDE_EXTS[@]}" 2>/dev/null | head -100 || true
}

HARDCODED_COLORS=$(run_grep '#[0-9a-fA-F]{3,8}\b|rgb\s*\(|rgba\s*\(|hsl\s*\(|hsla\s*\(')
DEPRECATED_TOKENS=$(run_grep 'labWrenMetalBlue|GumLeafGreen|WattleGold|inkGreen')
BANNED_ARCHETYPES=$(run_grep '\b(Jar|Cabinet|Seed|Leaf)\b')
FORBIDDEN_FONTS=$(run_grep "font-family\s*:\s*['\"]?(Inter|Roboto|Arial)['\"]?")
SCAN_DIRS_STR=$(IFS='|'; echo "${SCAN_DIRS[*]}")

# Export for Python subprocess
export HARDCODED_COLORS DEPRECATED_TOKENS BANNED_ARCHETYPES FORBIDDEN_FONTS
export TARGET TIMESTAMP SCAN_DIRS_STR

# --- Parse hits into JSON violations and emit report ---
python3 - <<'PYEOF'
import sys, json, os

def parse_hits(raw, rule_id, severity, vtype):
    violations = []
    for line in raw.strip().splitlines():
        if not line.strip():
            continue
        parts = line.split(":", 2)
        if len(parts) < 3:
            continue
        filepath, lineno, content = parts[0], parts[1], parts[2].strip()
        violations.append({
            "rule": rule_id,
            "type": vtype,
            "severity": severity,
            "file": f"{filepath}:{lineno}",
            "value": content[:120],
            "remediation": "Replace with canonical --sys-color-*, --sys-shape-*, or --sys-type-* token"
        })
    return violations

violations = []
violations += parse_hits(os.environ.get("HARDCODED_COLORS",""), "BR-TOKEN-001", "critical", "hardcoded-color")
violations += parse_hits(os.environ.get("DEPRECATED_TOKENS",""), "BR-TOKEN-002", "high", "deprecated-token")
violations += parse_hits(os.environ.get("BANNED_ARCHETYPES",""), "BR-TOKEN-003", "high", "banned-archetype")
violations += parse_hits(os.environ.get("FORBIDDEN_FONTS",""), "BR-TOKEN-004", "high", "forbidden-font")

status = "fail" if violations else "pass"
route = os.environ.get("TARGET", "")
timestamp = os.environ.get("TIMESTAMP", "")
scan_dirs = [d for d in os.environ.get("SCAN_DIRS_STR", "").split("|") if d]

result = {
    "gate": "token-enforcement",
    "route": route,
    "timestamp": timestamp,
    "status": status,
    "files_scanned": scan_dirs,
    "violation_count": len(violations),
    "violations": violations,
    "canonical_sources": [
        "frontend/src/design/tokens/tokens.json",
        "frontend/src/design/styles/design-tokens.css"
    ],
    "recheck_command": f".claude/skills/token-enforcement/scripts/run-token-enforcement.sh {route}",
    "next_gate": "migration-audit" if status == "pass" else None
}
print(json.dumps(result, indent=2))
sys.exit(0 if status == "pass" else 1)
PYEOF
