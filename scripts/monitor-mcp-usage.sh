#!/bin/bash
# MCP usage monitor - thin wrapper around the structured Claude MCP audit.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
exec python3 "$ROOT_DIR/scripts/audit-claude-mcp-usage.py" "$@"
