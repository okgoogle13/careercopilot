#!/bin/bash

# Frontend Directory Refactoring Script (DRY RUN)
# This script creates a new organized structure and moves existing files
# All commands are prefixed with 'echo' for safety - remove 'echo' to execute

set -e

echo "=== Frontend Directory Refactoring (DRY RUN) ==="
echo "Current directory: $(pwd)"
echo "Target: frontend/src directory reorganization"
echo ""

# Navigate to frontend/src directory
cd src

echo "=== Creating new directory structure ==="

# Create new api directory structure
mkdir -p api/services
mkdir -p api/clients
mkdir -p api/types

# Create new features directory structure
mkdir -p components/features/Analysis
mkdir -p components/features/Documents
mkdir -p components/features/KSC

echo ""
echo "=== Moving services to api directory ==="

# Check if services directory exists and move contents
if [ -d "services" ]; then
    echo "# Moving services/* to api/"
    for file in services/*; do
        if [ -f "$file" ]; then
            mv "$file" "api/$(basename "$file")"
        fi
    done
    # Remove empty services directory
    rmdir services
else
    echo "# services/ directory not found - skipping"
fi

echo ""
echo "=== Moving feature components ==="

# Move AnalysisResults components
if [ -d "components/AnalysisResults" ]; then
    echo "# Moving AnalysisResults/* to components/features/Analysis/"
    for file in components/AnalysisResults/*; do
        if [ -f "$file" ]; then
            mv "$file" "components/features/Analysis/$(basename "$file")"
        fi
    done
    rmdir components/AnalysisResults
else
    echo "# components/AnalysisResults/ directory not found - skipping"
fi

# Move DocumentGeneration components
if [ -d "components/DocumentGeneration" ]; then
    echo "# Moving DocumentGeneration/* to components/features/Documents/"
    for file in components/DocumentGeneration/*; do
        if [ -f "$file" ]; then
            mv "$file" "components/features/Documents/$(basename "$file")"
        fi
    done
    rmdir components/DocumentGeneration
else
    echo "# components/DocumentGeneration/ directory not found - skipping"
fi

# Move KSC components
if [ -d "components/KSC" ]; then
    echo "# Moving KSC/* to components/features/KSC/"
    for file in components/KSC/*; do
        if [ -f "$file" ]; then
            mv "$file" "components/features/KSC/$(basename "$file")"
        fi
    done
    rmdir components/KSC
else
    echo "# components/KSC/ directory not found - skipping"
fi

echo ""
echo "=== Creating index files for better imports ==="

# Create index files for each feature
echo '// Analysis feature exports' > components/features/Analysis/index.ts
echo '// Documents feature exports' > components/features/Documents/index.ts
echo '// KSC feature exports' > components/features/KSC/index.ts
echo '// API exports' > api/index.ts

echo ""
echo "=== Final directory structure preview ==="
echo "tree . -I 'node_modules' || find . -type d | head -20"

echo ""
echo "=== SAFETY NOTICE ==="
echo "This is a DRY RUN script. To execute the refactoring:"
echo "1. Review all commands above"
echo "2. Remove 'echo' prefix from mkdir and mv commands"
echo "3. Update import statements in affected files"
echo "4. Test the application after refactoring"
echo ""
echo "Recommended: Run 'git status' and commit current changes before refactoring"
