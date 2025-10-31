#!/usr/bin/env bash
# Auto-fix linting errors across the entire project

set -e

echo "🔧 Running automatic linting fixes..."

# Frontend linting
echo "📁 Frontend: Running ESLint auto-fix..."
if cd frontend && yarn lint:fix; then
    echo "✅ Frontend ESLint auto-fix completed"
else
    echo "❌ Frontend ESLint auto-fix failed"
    exit 1
fi

cd ..

# Functions linting
echo "📁 Functions: Running ESLint auto-fix..."
if cd functions && npm run lint:fix; then
    echo "✅ Functions ESLint auto-fix completed"
else
    echo "❌ Functions ESLint auto-fix failed"
    exit 1
fi

cd ..

echo "✅ All linting auto-fixes completed successfully!"
