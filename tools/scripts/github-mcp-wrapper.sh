#!/bin/bash
# GitHub MCP Wrapper for secure PAT retrieval from macOS Keychain
# Used to avoid storing the PAT in plain text in config files.

# Try to find the token in Keychain
# Account: github-token, Service: careercopilot (matching setup-keychain-secrets.sh)
PAT=$(security find-generic-password -a "github-token" -s "careercopilot" -w 2>/dev/null)

if [ -z "$PAT" ]; then
    # Fallback to env if available (e.g. for legacy setups)
    PAT="${GITHUB_TOKEN:-${GH_TOKEN:-${GITHUB_PAT:-${GITHUB_PERSONAL_ACCESS_TOKEN:-}}}}"
fi

if [ -z "$PAT" ]; then
    echo "Error: GitHub PAT not found in Keychain or environment." >&2
    echo "Please run: bash tools/scripts/setup-keychain-secrets.sh" >&2
    exit 1
fi

export GITHUB_PERSONAL_ACCESS_TOKEN="$PAT"

# Execute the actual GitHub MCP server
exec npx -y @modelcontextprotocol/server-github "$@"
