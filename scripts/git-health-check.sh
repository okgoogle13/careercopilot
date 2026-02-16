#!/bin/bash
# Git Repository Health Check Script
# Diagnoses git corruption issues including "short read" errors

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Script configuration
VERBOSE=false
REPAIR=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -r|--repair)
            REPAIR=true
            shift
            ;;
        -h|--help)
            echo "Git Repository Health Check"
            echo ""
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  -v, --verbose    Enable verbose output"
            echo "  -r, --repair     Attempt automatic repairs (use with caution)"
            echo "  -h, --help       Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         Git Repository Health Check                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}✗ Not a git repository${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Git repository detected${NC}"
echo ""

# 1. Check git status
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Repository Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git status -sb
echo ""

# 2. Check object database
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Object Database Statistics"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git count-objects -vH
echo ""

# 3. Check for shallow clone
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Clone Type"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f .git/shallow ]; then
    echo -e "${YELLOW}⚠ Shallow clone detected${NC}"
    echo "  Shallow commit: $(cat .git/shallow)"
else
    echo -e "${GREEN}✓ Full repository clone${NC}"
fi
echo ""

# 4. Run git fsck
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. File System Check (fsck)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$VERBOSE" = true ]; then
    FSCK_OUTPUT=$(git fsck --full --verbose 2>&1)
else
    FSCK_OUTPUT=$(git fsck --full 2>&1)
fi

FSCK_EXIT_CODE=$?
if [ $FSCK_EXIT_CODE -eq 0 ]; then
    if echo "$FSCK_OUTPUT" | grep -qiE "error|corrupt|missing|broken"; then
        echo -e "${RED}✗ Issues detected in repository${NC}"
        echo "$FSCK_OUTPUT" | grep -iE "error|corrupt|missing|broken"
    else
        echo -e "${GREEN}✓ No corruption detected${NC}"
        if [ "$VERBOSE" = true ]; then
            echo "$FSCK_OUTPUT" | tail -20
        fi
    fi
else
    echo -e "${RED}✗ fsck failed with exit code $FSCK_EXIT_CODE${NC}"
    echo "$FSCK_OUTPUT"
fi
echo ""

# 5. Verify pack files
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. Pack File Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
PACK_COUNT=$(find .git/objects/pack -name "*.pack" 2>/dev/null | wc -l)
if [ $PACK_COUNT -eq 0 ]; then
    echo -e "${YELLOW}⚠ No pack files found${NC}"
else
    echo "Found $PACK_COUNT pack file(s)"
    for idx in .git/objects/pack/*.idx; do
        if [ -f "$idx" ]; then
            PACK_NAME=$(basename "$idx" .idx)
            PACK_SIZE=$(du -h ".git/objects/pack/${PACK_NAME}.pack" 2>/dev/null | cut -f1)
            echo "  • ${PACK_NAME}: ${PACK_SIZE}"
            
            if [ "$VERBOSE" = true ]; then
                git verify-pack -v "$idx" 2>&1 | head -5
            else
                if git verify-pack "$idx" > /dev/null 2>&1; then
                    echo -e "    ${GREEN}✓ Pack verified${NC}"
                else
                    echo -e "    ${RED}✗ Pack verification failed${NC}"
                fi
            fi
        fi
    done
fi
echo ""

# 6. Check repository size
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. Repository Size"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
GIT_SIZE=$(du -sh .git 2>/dev/null | cut -f1)
WORKTREE_SIZE=$(du -sh --exclude=.git . 2>/dev/null | cut -f1)
echo "  .git directory: $GIT_SIZE"
echo "  Working tree:   $WORKTREE_SIZE"

# Warn if .git is unusually large
GIT_SIZE_BYTES=$(du -sb .git 2>/dev/null | cut -f1)
if [ "$GIT_SIZE_BYTES" -gt 524288000 ]; then  # 500MB
    echo -e "  ${YELLOW}⚠ Large .git directory detected (>500MB)${NC}"
    echo "    Consider using Git LFS for large files"
fi
echo ""

# 7. Check reflog
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7. Reference Log (Recent Activity)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git reflog --date=relative -10
echo ""

# 8. Check for common issues
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "8. Configuration Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check http buffer
HTTP_BUFFER=$(git config --get http.postBuffer || echo "not set")
echo "  http.postBuffer: $HTTP_BUFFER"
if [ "$HTTP_BUFFER" = "not set" ] || [ "$HTTP_BUFFER" -lt 524288000 ]; then
    echo -e "    ${YELLOW}⚠ Consider increasing: git config http.postBuffer 524288000${NC}"
fi

# Check compression
COMPRESSION=$(git config --get core.compression || echo "not set")
echo "  core.compression: $COMPRESSION"

# Check remote URL
REMOTE_URL=$(git config --get remote.origin.url || echo "not set")
echo "  remote.origin.url: $REMOTE_URL"
echo ""

# 9. Repair options
if [ "$REPAIR" = true ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "9. Attempting Repairs"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    echo "Running git gc..."
    if git gc --auto 2>&1; then
        echo -e "${GREEN}✓ Garbage collection completed${NC}"
    else
        echo -e "${RED}✗ Garbage collection failed${NC}"
    fi
    
    echo ""
    echo "Pruning unreachable objects..."
    if git prune 2>&1; then
        echo -e "${GREEN}✓ Pruning completed${NC}"
    else
        echo -e "${RED}✗ Pruning failed${NC}"
    fi
    echo ""
fi

# Summary
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Health Check Summary                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ $FSCK_EXIT_CODE -eq 0 ] && ! echo "$FSCK_OUTPUT" | grep -qiE "error|corrupt|missing|broken"; then
    echo -e "${GREEN}✓ Repository is healthy${NC}"
    echo ""
    echo "No corruption or 'short read' errors detected."
    exit 0
else
    echo -e "${RED}✗ Issues detected in repository${NC}"
    echo ""
    echo "Recommended actions:"
    echo "  1. Review the detailed output above"
    echo "  2. Try running: git gc --aggressive --prune=now"
    echo "  3. If issues persist, consider re-cloning the repository"
    echo "  4. See docs/GIT_HEALTH_CHECK.md for detailed recovery steps"
    exit 1
fi
