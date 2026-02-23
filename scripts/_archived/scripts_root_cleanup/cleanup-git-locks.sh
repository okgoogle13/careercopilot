#!/bin/bash

################################################################################
# Git Lock Cleanup Script
#
# This script safely removes stale git lock files that can cause conflicts
# when multiple git operations attempt to run concurrently.
#
# Usage: ./scripts/cleanup-git-locks.sh [--force]
#
# Options:
#   --force   Remove locks without confirmation (use in automation)
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get repository root
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$REPO_ROOT"

# Parse arguments
FORCE=false
if [[ "$1" == "--force" ]]; then
  FORCE=true
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Git Lock Cleanup Tool${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
  echo -e "${RED}❌ Error: Not in a git repository${NC}"
  exit 1
fi

echo -e "${YELLOW}🔍 Scanning for git lock files...${NC}"
echo ""

# Find all lock files in .git directory
LOCK_FILES=$(find .git -name "*.lock" -type f 2>/dev/null || true)

if [ -z "$LOCK_FILES" ]; then
  echo -e "${GREEN}✅ No git lock files found${NC}"
  echo ""
  echo "Your repository is in a clean state."
  exit 0
fi

# Count lock files
LOCK_COUNT=$(echo "$LOCK_FILES" | wc -l)
echo -e "${YELLOW}Found $LOCK_COUNT lock file(s):${NC}"
echo ""

# Display each lock file with age
while IFS= read -r lock_file; do
  if [ -f "$lock_file" ]; then
    # Get file modification time
    if [[ "$OSTYPE" == "darwin"* ]]; then
      # macOS
      AGE=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$lock_file")
    else
      # Linux
      AGE=$(stat -c "%y" "$lock_file" | cut -d'.' -f1)
    fi
    echo -e "  📄 ${lock_file} (created: $AGE)"
  fi
done <<< "$LOCK_FILES"

echo ""

# Check if any git processes are running
GIT_PROCESSES=$(ps aux | grep -E "git (add|commit|push|pull|fetch|merge|rebase)" | grep -v grep || true)

if [ -n "$GIT_PROCESSES" ]; then
  echo -e "${YELLOW}⚠️  Warning: Git processes are currently running:${NC}"
  echo ""
  echo "$GIT_PROCESSES"
  echo ""
  echo -e "${YELLOW}It's recommended to wait for these processes to complete before removing locks.${NC}"
  echo ""
fi

# Ask for confirmation unless --force is used
if [ "$FORCE" = false ]; then
  echo -e "${YELLOW}⚠️  This will remove all git lock files listed above.${NC}"
  echo ""
  read -p "Do you want to proceed? (y/N): " -n 1 -r
  echo
  
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Aborted.${NC}"
    exit 0
  fi
fi

echo ""
echo -e "${YELLOW}🧹 Removing lock files...${NC}"

# Remove each lock file
REMOVED_COUNT=0
FAILED_COUNT=0

while IFS= read -r lock_file; do
  if [ -f "$lock_file" ]; then
    if rm -f "$lock_file" 2>/dev/null; then
      echo -e "  ${GREEN}✓${NC} Removed: $lock_file"
      REMOVED_COUNT=$((REMOVED_COUNT + 1))
    else
      echo -e "  ${RED}✗${NC} Failed to remove: $lock_file"
      FAILED_COUNT=$((FAILED_COUNT + 1))
    fi
  fi
done <<< "$LOCK_FILES"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${GREEN}✓ Removed: $REMOVED_COUNT${NC}"
if [ $FAILED_COUNT -gt 0 ]; then
  echo -e "  ${RED}✗ Failed: $FAILED_COUNT${NC}"
fi
echo ""

if [ $FAILED_COUNT -eq 0 ]; then
  echo -e "${GREEN}✅ All lock files removed successfully${NC}"
  echo ""
  echo "You can now run git operations without lock conflicts."
else
  echo -e "${YELLOW}⚠️  Some lock files could not be removed${NC}"
  echo ""
  echo "This may be due to permissions or active git processes."
  echo "Try running with sudo or wait for git operations to complete."
fi

echo ""
echo -e "${BLUE}📊 Current git status:${NC}"
git status --short

exit 0
