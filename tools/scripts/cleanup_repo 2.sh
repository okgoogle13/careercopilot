#!/bin/bash

# ======================================================
# CareerCopilot: Pre-Flight Repository Cleanup
# Description: Sanitizes the repo before migration to iMac.
# ======================================================

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PROJECT_ROOT=$(pwd)
ARCHIVE_DIR="$PROJECT_ROOT/_archive_legacy"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo -e "${BLUE}Starting Pre-Flight Cleanup...${NC}"

# 1. SETUP ARCHIVE
if [ ! -d "$ARCHIVE_DIR" ]; then
    echo -e "Creating archive directory: ${YELLOW}$ARCHIVE_DIR${NC}"
    mkdir -p "$ARCHIVE_DIR"
fi

# 2. UPDATE GITIGNORE
if ! grep -q "_archive_legacy/" .gitignore; then
    echo -e "Updating .gitignore..."
    echo "" >> .gitignore
    echo "# Legacy Archive (Pre-Flight Cleanup)" >> .gitignore
    echo "_archive_legacy/" >> .gitignore
fi

# Helper function to move files
move_to_archive() {
    local file="$1"
    if [ -e "$file" ]; then
        echo -e "  Archiving: ${YELLOW}$file${NC}"
        mv "$file" "$ARCHIVE_DIR/"
    fi
}

# 3. ARCHIVE LEGACY FRONTEND ARTIFACTS
echo -e "\n${BLUE}Scanning for Legacy Frontend Artifacts...${NC}"
move_to_archive "$FRONTEND_DIR/src/services/geminiService.ts"
move_to_archive "$FRONTEND_DIR/src/types.ts"
move_to_archive "$FRONTEND_DIR/src/components/DocumentInput.tsx"
move_to_archive "$FRONTEND_DIR/src/components/Header.tsx"
move_to_archive "$FRONTEND_DIR/src/components/icons" # Entire folder if exists

# 4. ARCHIVE FLOATING ROOT FILES
echo -e "\n${BLUE}Scanning for Floating Root Files...${NC}"
move_to_archive "run_jules.py"
move_to_archive "setup_fresh_start.sh"
move_to_archive "repomix-output.xml"
move_to_archive "backend/test_output.txt"
move_to_archive "backend/test_output_2.txt"
move_to_archive "backend/test_output_3.txt"
move_to_archive "backend/test_output_4.txt"

# 5. ORGANIZE BACKEND FLOATING SCRIPTS
echo -e "\n${BLUE}Organizing Backend Scripts...${NC}"
# Move loose test_*.py files in backend root to backend/tests/ or archive
# We'll archive them as they seem to be ad-hoc verification scripts
move_to_archive "backend/test_autofix_validation.py"
move_to_archive "backend/test_nlp_optimization.py"
move_to_archive "backend/fix_mypy_errors.py" # Ad-hoc repair script

# 6. ARCHIVE RENAMED BACKEND FILES (Safety Check)
move_to_archive "backend/app/schemas/career_db.py"
move_to_archive "backend/app/flows/career_ingestion.py"

# 7. CLEANUP EMPTY DIRS
# Check for known legacy dirs that might be empty
rmdir "$FRONTEND_DIR/src/components/icons" 2>/dev/null
rmdir "$ARCHIVE_DIR" 2>/dev/null # Remove archive if empty

echo -e "\n${GREEN}Cleanup Complete!${NC}"
echo -e "Review the contents of '$ARCHIVE_DIR' before deleting."
