#!/bin/bash
# Stages all changes, commits with a standard message, and pushes.

echo ">>> Staging all changes..."
git add .

echo ">>> Committing consolidated files..."
git commit -m "chore: automated repo cleanup and file consolidation"

echo ">>> Pushing to remote..."
git push

echo ">>> Phase 1 complete."