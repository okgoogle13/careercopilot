#!/bin/bash

# Exit on error
set -e

# Set environment variables from .env.test
if [ -f .env.test ]; then
  export $(grep -v '^#' .env.test | xargs)
fi

# Function to run tests with error handling
run_test() {
  local name=$1
  local cmd=$2
  
  echo "🚀 Running $name tests..."
  
  if eval "$cmd"; then
    echo "✅ $name tests passed"
  else
    echo "❌ $name tests failed"
    return 1
  fi
}

# Run tests in parallel where possible
run_test "Frontend" "cd frontend && yarn test:ci" &
FRONTEND_PID=$!

run_test "Functions" "cd functions && yarn test:ci" &
FUNCTIONS_PID=$!

run_test "Firestore Rules" "cd functions && yarn test:rules" &
RULES_PID=$!

run_test "Backend" "cd backend && python -m pytest app/tests/ -v" &
BACKEND_PID=$!

# Wait for all tests to complete
wait $FRONTEND_PID $FUNCTIONS_PID $RULES_PID $BACKEND_PID

# Check if any tests failed
if [ $? -ne 0 ]; then
  echo "❌ Some tests failed"
  exit 1
else
  echo "✅ All tests passed!"
  exit 0
fi
