#!/bin/bash
# Canonical entry point for KR Solidarity visual audits.
# This script wraps the kr-design-bridge.py orchestrator.

ROUTE=$1

if [ -z "$ROUTE" ]; then
  echo "Usage: bash scripts/run-visual-audit.sh <route>"
  exit 1
fi

echo "[KR Audit] Initializing orchestrator for $ROUTE..."

# Ensure bridge script is executable
chmod +x scripts/kr-design-bridge.py

# Execute orchestrator
python3 scripts/kr-design-bridge.py "$ROUTE"

# --- Next Steps for Agent ---
# 1. Inspect the AX-First output from the bridge.
# 2. If vision escalation is required for specific components (BR-DESIGN-003),
#    use the recommended Playwright subtree capture logic within your turn.
# 3. Finalize scoring according to references/DESIGN_RULES.md.
