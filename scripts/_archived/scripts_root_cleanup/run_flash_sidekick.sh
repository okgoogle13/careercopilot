#!/usr/bin/env bash
set -euo pipefail

# Load environment variables from .env if present
script_dir="$(dirname "$0")"
if [[ -f "$script_dir/../.env" ]]; then
  # shellcheck source=/dev/null
  source "$script_dir/../.env"
fi

# Start Flash Sidekick in background, logging to /tmp/flash_sidekick.log
nohup "$script_dir/../.venv/bin/python3" "$script_dir/../servers/flash_sidekick.py" > /tmp/flash_sidekick.log 2>&1 &
PID=$!
echo "Flash‑Sidekick started with PID $PID"
