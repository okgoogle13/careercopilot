#!/bin/bash
# scripts/run_full_audit.sh
# Master token audit orchestrator

set +e  # Don't exit on failure, run all checks

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 FULL TOKEN AUDIT${NC}"
echo -e "${BLUE}====================${NC}"

EXIT_CODE=0

echo -e "\n[1/5] Structure & Schema..."
python3 scripts/audit_structure.py
CODE=$?
[ $CODE -gt $EXIT_CODE ] && EXIT_CODE=$CODE

echo -e "\n[2/5] Palette Compliance..."
python3 scripts/validate_palette_mcp.py
CODE=$?
[ $CODE -gt $EXIT_CODE ] && EXIT_CODE=$CODE

echo -e "\n[3/5] Tailwind Integration..."
python3 scripts/audit_tailwind.py
CODE=$?
[ $CODE -gt $EXIT_CODE ] && EXIT_CODE=$CODE

echo -e "\n[4/5] Mode Parity..."
python3 scripts/check_mode_parity.py
CODE=$?
[ $CODE -gt $EXIT_CODE ] && EXIT_CODE=$CODE

echo -e "\n[5/5] Hardcoded Values..."
bash scripts/analyze-m3-styling-consistency.sh
CODE=$?
[ $CODE -gt $EXIT_CODE ] && EXIT_CODE=$CODE

echo -e "\n${BLUE}====================${NC}"
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed${NC}"
elif [ $EXIT_CODE -eq 1 ]; then
    echo -e "${RED}❌ Critical failures detected${NC}"
else
    echo -e "${YELLOW}⚠️  Warnings found - review recommended${NC}"
fi

exit $EXIT_CODE
