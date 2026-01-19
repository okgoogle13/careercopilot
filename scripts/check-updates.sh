#!/bin/bash
# Check for outdated dependencies in both frontend and backend

echo "🔍 Checking for outdated dependencies..."

# Check frontend dependencies
echo "\n📦 Frontend Dependencies:"
cd frontend
yarn dlx npm-check-updates
cd ..

# Check backend Python dependencies
echo "\n🐍 Backend Python Dependencies:"
cd backend
pip list --outdated --format=freeze | grep -v '^\-e' | cut -d = -f 1 | xargs -n1 pip install -U --dry-run | grep -v 'Requirement already satisfied'
cd ..

echo "\n✅ Update check complete!"
echo "\nTo update frontend dependencies, run: cd frontend && yarn dlx npm-check-updates -u && yarn install"
echo "To update backend dependencies, update requirements.in and run: cd backend && pip-compile requirements.in"
