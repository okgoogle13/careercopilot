#!/bin/bash
# Finalizes the consolidation of .env.example files.

echo ">>> Renaming consolidated environment file..."
if [ -f "./.env.example.consolidated" ]; then
    mv ./.env.example.consolidated ./.env.example
    echo "✅ Consolidated .env.example created"
else
    echo "⚠️  No .env.example.consolidated file found - skipping rename"
fi

echo ">>> Removing old frontend/functions environment examples..."
rm -f ./frontend/.env.example
rm -f ./functions/.env.example

echo ">>> Environment config consolidated. Update README.md next."