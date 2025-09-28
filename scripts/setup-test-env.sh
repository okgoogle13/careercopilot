#!/bin/bash

# Exit on error
set -e

# Set environment variables from .env.test
export $(grep -v '^#' .env.test | xargs)

# Start required services
echo "🚀 Starting test environment..."

# Start Redis if not running
if ! redis-cli ping &> /dev/null; then
  echo "Starting Redis..."
  redis-server --daemonize yes
fi

# Start Firebase emulators in the background
echo "Starting Firebase emulators..."
firebase emulators:start \
  --only firestore,auth,functions,storage \
  --project ${FIREBASE_PROJECT_ID} \
  --import=./test-data \
  --export-on-exit \
  &> /dev/null &
FIREBASE_EMULATOR_PID=$!

# Wait for emulators to be ready
echo "Waiting for emulators to be ready..."
until curl -s http://localhost:8080 >/dev/null 2>&1; do
  sleep 1
done

# Load test data if directory exists
if [ -d "./test-data" ]; then
  echo "Loading test data..."
  firebase emulators:start \
    --only firestore \
    --project ${FIREBASE_PROJECT_ID} \
    --import=./test-data \
    --export-on-exit \
    &> /dev/null &
fi

echo "✅ Test environment is ready!"

# Keep the script running
wait $FIREBASE_EMULATOR_PID
