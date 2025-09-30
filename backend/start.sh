#!/bin/sh
# Startup script for Cloud Run backend

set -e

# Set PYTHONPATH to include both /app and /app/app
export PYTHONPATH="/app:/app/app:${PYTHONPATH:-}"

# Use PORT from environment or default to 8080
PORT=${PORT:-8080}

echo "=== Starting CareerCopilot Backend ==="
echo "PYTHONPATH: $PYTHONPATH"
echo "PORT: $PORT"
echo "Working directory: $(pwd)"

echo "\n=== Python Environment ==="
python3 --version
which python3

# Debug: List directory structure
echo "\n=== Directory Structure ==="
ls -la /app

# Check if main module is accessible
echo "\n=== Module Check ==="
python3 -c "
import sys
print(f'Python Path: {sys.path}')
try:
    import app.main
    print('✓ app.main module found')
except ImportError as e:
    print(f'✗ Error importing app.main: {e}')
    print('Current directory contents:')
    import os
    print(os.listdir('.'))
    if os.path.exists('app'):
        print('\napp directory contents:')
        print(os.listdir('app'))
    raise
"

echo "\n=== Starting Uvicorn ==="
# Use exec to replace the shell process with uvicorn
# No --workers flag means single process (no multiprocessing)
# Cloud Run handles horizontal scaling, so we don't need worker processes
cd /app
exec python3 -m uvicorn app.main:app --host 0.0.0.0 --port $PORT --log-level info