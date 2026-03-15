#!/bin/bash
# Batch Process Components Coordinator
# Wrapper for invoking the batch-processor skill via the design workflow script logic.

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

MANIFEST_PATH=""

# Helper Functions
print_header() {
    echo -e "${BLUE}==============================================${NC}"
    echo -e "${BLUE}   Design Automation: Batch Component Processor${NC}"
    echo -e "${BLUE}==============================================${NC}"
}

usage() {
    echo "Usage: $0 --manifest <path/to/manifest.json>"
    exit 1
}

# Parse Args
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --manifest) MANIFEST_PATH="$2"; shift ;;
        *) echo "Unknown parameter: $1"; usage ;;
    esac
    shift
done

if [ -z "$MANIFEST_PATH" ]; then
    echo -e "${RED}Error: Manifest path is required.${NC}"
    usage
fi

if [ ! -f "$MANIFEST_PATH" ]; then
    echo -e "${RED}Error: Manifest file not found at $MANIFEST_PATH${NC}"
    exit 1
fi

print_header
echo -e "${GREEN}Loading batch manifest from: $MANIFEST_PATH${NC}"

# Read components from JSON using python (simpler than installing jq if not present)
# Assumes python3 is available
COMPONENTS=$(python3 -c "import sys, json; print(' '.join([c['name'] for c in json.load(open('$MANIFEST_PATH'))['components']]))")
MODES=$(python3 -c "import sys, json; print(' '.join([c['mode'] for c in json.load(open('$MANIFEST_PATH'))['components']]))")

IFS=' ' read -r -a COMP_ARRAY <<< "$COMPONENTS"
IFS=' ' read -r -a MODE_ARRAY <<< "$MODES"

total=${#COMP_ARRAY[@]}
echo -e "Found ${GREEN}$total${NC} components in batch."

# Iterate and Simulate Batch Processing
# In a real agentic environment, this script would invoke the agent or the automate_design_workflow.py
# in parallel or via a job queue. Here, we sequence them to demonstrate the flow the agent would manage.

echo -e "\n${BLUE}--- Starting Stage 1: Structure (Parallel Execution Simulated) ---${NC}"

for i in "${!COMP_ARRAY[@]}"; do
    comp="${COMP_ARRAY[$i]}"
    mode="${MODE_ARRAY[$i]}"
    echo -e "Queueing structure gen for: ${GREEN}$comp${NC} ($mode)"

    # Call the python workflow coordinator in structure mode
    # Note: We use 'scripts/automate_design_workflow.py' which we saw earlier
    python3 scripts/automate_design_workflow.py --component "$comp" --stage structure --mode "$mode" --auto-approve &
done

# Wait for background jobs (Parallel simulation)
wait

echo -e "\n${BLUE}--- Aggregated Gate 1: Batch Validation ---${NC}"
echo -e "${GREEN}All components have completed Stage 1.${NC}"
read -p "Approved to proceed with Stage 2 (Visuals & Build)? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Batch processing aborted by user.${NC}"
    exit 1
fi

echo -e "\n${BLUE}--- Starting Stage 2: Visuals & Build (Parallel Execution Simulated) ---${NC}"

for i in "${!COMP_ARRAY[@]}"; do
    comp="${COMP_ARRAY[$i]}"
    mode="${MODE_ARRAY[$i]}"
    echo -e "Queueing visuals/build for: ${GREEN}$comp${NC} ($mode)"

    python3 scripts/automate_design_workflow.py --component "$comp" --stage visuals --mode "$mode" &
done

wait

echo -e "\n${BLUE}==============================================${NC}"
echo -e "${GREEN}Batch Processing Complete.${NC}"
echo -e "All components are ready for review."
