#!/usr/bin/env bash
set -euo pipefail

: "${GOOGLE_CLOUD_PROJECT:?GOOGLE_CLOUD_PROJECT is required}"

# Try the provided secret name first, then fallback to canonical names
get_perplexity_key() {
  local project="$1"
  local names=(${PERPLEXITY_SECRET_NAME:-} "PERPLEXITY_API_KEY" "perplexity-api-key")

  for name in "${names[@]}"; do
    if [[ -n "$name" ]]; then
      # Redirect stderr to /dev/null to suppress error messages if a secret doesn't exist
      if key=$(gcloud secrets versions access latest --secret="$name" --project="$project" 2>/dev/null); then
        echo "$key"
        return 0
      fi
    fi
  done

  echo "ERROR: Perplexity API key not found in GCP Secret Manager." >&2
  return 1
}

export PERPLEXITY_API_KEY=$(get_perplexity_key "$GOOGLE_CLOUD_PROJECT")

# Execute the local FastMCP server using the project's virtual environment
exec /Users/okgoogle13/Projects/careercopilot/.venv/bin/python3 /Users/okgoogle13/Projects/careercopilot/servers/perplexity_server.py
