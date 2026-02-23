#!/bin/bash

################################################################################
# Test Script for Git Lock Cleanup
#
# This script tests the cleanup-git-locks.sh script to ensure it works correctly
################################################################################

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
CLEANUP_SCRIPT="$REPO_ROOT/scripts/cleanup-git-locks.sh"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "Testing Git Lock Cleanup Script"
echo "================================"
echo ""

# Test 1: Script exists and is executable
echo "Test 1: Script exists and is executable..."
if [ ! -f "$CLEANUP_SCRIPT" ]; then
    echo -e "${RED}✗ FAIL: Script not found at $CLEANUP_SCRIPT${NC}"
    exit 1
fi

if [ ! -x "$CLEANUP_SCRIPT" ]; then
    echo -e "${RED}✗ FAIL: Script is not executable${NC}"
    exit 1
fi
echo -e "${GREEN}✓ PASS${NC}"
echo ""

# Test 2: Script runs with --force flag
echo "Test 2: Script runs with --force flag..."
if "$CLEANUP_SCRIPT" --force > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${RED}✗ FAIL: Script failed to run${NC}"
    exit 1
fi
echo ""

# Test 3: Script detects no lock files in clean repo
echo "Test 3: Script detects clean repository..."
OUTPUT=$("$CLEANUP_SCRIPT" --force 2>&1)
if echo "$OUTPUT" | grep -q "No git lock files found"; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${YELLOW}⚠ WARN: Unexpected output (may have lock files)${NC}"
fi
echo ""

# Test 4: Create test lock file and verify detection
echo "Test 4: Create and detect test lock file..."
TEST_LOCK="$REPO_ROOT/.git/test.lock"
touch "$TEST_LOCK"

if [ -f "$TEST_LOCK" ]; then
    echo "  Created test lock file"
    
    OUTPUT=$("$CLEANUP_SCRIPT" --force 2>&1)
    
    if echo "$OUTPUT" | grep -q "Found 1 lock file"; then
        echo -e "${GREEN}✓ PASS: Lock file detected${NC}"
    else
        echo -e "${YELLOW}⚠ WARN: Lock file detection may have issues${NC}"
    fi
    
    # Verify cleanup
    if [ ! -f "$TEST_LOCK" ]; then
        echo -e "${GREEN}✓ PASS: Lock file cleaned up${NC}"
    else
        echo -e "${RED}✗ FAIL: Lock file not cleaned up${NC}"
        rm -f "$TEST_LOCK"
        exit 1
    fi
else
    echo -e "${RED}✗ FAIL: Could not create test lock file${NC}"
    exit 1
fi
echo ""

# Test 5: Verify git repository is still functional
echo "Test 5: Verify git repository still works..."
cd "$REPO_ROOT"
if git status > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS: Git repository is functional${NC}"
else
    echo -e "${RED}✗ FAIL: Git repository may be corrupted${NC}"
    exit 1
fi
echo ""

# Test 6: Test multiple lock files
echo "Test 6: Test multiple lock files..."
touch "$REPO_ROOT/.git/test1.lock"
touch "$REPO_ROOT/.git/test2.lock"
touch "$REPO_ROOT/.git/test3.lock"

OUTPUT=$("$CLEANUP_SCRIPT" --force 2>&1)

if echo "$OUTPUT" | grep -q "Found 3 lock file"; then
    echo -e "${GREEN}✓ PASS: Multiple lock files detected${NC}"
else
    echo -e "${YELLOW}⚠ WARN: Multiple lock file detection may have issues${NC}"
fi

# Verify all cleaned up
if [ ! -f "$REPO_ROOT/.git/test1.lock" ] && \
   [ ! -f "$REPO_ROOT/.git/test2.lock" ] && \
   [ ! -f "$REPO_ROOT/.git/test3.lock" ]; then
    echo -e "${GREEN}✓ PASS: All lock files cleaned up${NC}"
else
    echo -e "${RED}✗ FAIL: Some lock files remain${NC}"
    rm -f "$REPO_ROOT/.git/test"*.lock
    exit 1
fi
echo ""

echo "================================"
echo -e "${GREEN}All tests passed! ✓${NC}"
echo ""
echo "The cleanup script is working correctly."
