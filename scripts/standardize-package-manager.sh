#!/bin/bash
# Standardizes the package manager. Usage: ./standardize-package-manager.sh <npm|yarn>

MANAGER=$1

if [ "$MANAGER" == "yarn" ]; then
  echo "Standardizing to Yarn..."
  find . -name 'package-lock.json' -delete
  yarn install && (cd frontend && yarn install) && (cd functions && yarn install)
elif [ "$MANAGER" == "npm" ]; then
  echo "Standardizing to NPM..."
  find . -name 'yarn.lock' -delete
  npm install && (cd frontend && npm install) && (cd functions && npm install)
else
  echo "Error: Please specify 'npm' or 'yarn'."
  echo "Usage: ./standardize-package-manager.sh <npm|yarn>"
  exit 1
fi

echo ">>> Package manager standardized to $MANAGER."