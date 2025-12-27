#!/bin/bash
# Wrapper script to filter out google.api_core error messages from flash_sidekick.py
# This prevents MCP JSON parsing errors

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_BIN="$SCRIPT_DIR/../.venv/bin/python3"
SIDEKICK_SCRIPT="$SCRIPT_DIR/flash_sidekick_fast.py"

# Run the Python script and filter out the error message
"$PYTHON_BIN" "$SIDEKICK_SCRIPT" 2>&1 | grep -v "^An error occurred:"
