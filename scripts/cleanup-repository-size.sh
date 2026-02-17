#!/bin/bash
# Repository Size Optimization Script
# Safely reduces repository size by removing duplicates and cleanup artifacts

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DRY_RUN=true
BACKUP=true
BACKUP_DIR="repo-cleanup-backup-$(date +%Y%m%d-%H%M%S)"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --execute)
            DRY_RUN=false
            shift
            ;;
        --no-backup)
            BACKUP=false
            shift
            ;;
        -h|--help)
            echo "Repository Size Optimization Script"
            echo ""
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --execute      Actually perform cleanup (default: dry-run)"
            echo "  --no-backup    Skip creating backup (not recommended)"
            echo "  -h, --help     Show this help message"
            echo ""
            echo "Dry-run mode (default):"
            echo "  Shows what would be deleted without actually deleting"
            echo ""
            echo "Execute mode (--execute):"
            echo "  Performs actual cleanup with backup (unless --no-backup)"
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
echo "║      Repository Size Optimization Script                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}⚠ DRY-RUN MODE${NC} - No files will be deleted"
    echo "   Use --execute to perform actual cleanup"
else
    echo -e "${RED}⚠ EXECUTE MODE${NC} - Files will be deleted!"
    if [ "$BACKUP" = true ]; then
        echo -e "${GREEN}✓ Backup enabled${NC} - Files will be backed up to $BACKUP_DIR"
    else
        echo -e "${RED}✗ Backup disabled${NC} - No backup will be created"
    fi
fi
echo ""

# Function to calculate directory size
calc_size() {
    if [ -d "$1" ]; then
        du -sh "$1" 2>/dev/null | cut -f1
    else
        echo "0"
    fi
}

# Function to backup files
backup_files() {
    if [ "$BACKUP" = true ] && [ "$DRY_RUN" = false ]; then
        local src="$1"
        if [ -e "$src" ]; then
            mkdir -p "$BACKUP_DIR/$(dirname "$src")"
            cp -r "$src" "$BACKUP_DIR/$src" 2>/dev/null || true
            echo -e "  ${GREEN}✓ Backed up${NC}: $src"
        fi
    fi
}

# Function to remove directory
remove_dir() {
    local dir="$1"
    local size=$(calc_size "$dir")
    
    if [ ! -d "$dir" ]; then
        echo -e "  ${YELLOW}⊗ Not found${NC}: $dir"
        return
    fi
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "Directory: $dir"
    echo -e "Size: $size"
    
    if [ "$DRY_RUN" = true ]; then
        echo -e "  ${YELLOW}⚠ Would delete${NC}: $dir ($size)"
    else
        backup_files "$dir"
        rm -rf "$dir"
        echo -e "  ${GREEN}✓ Deleted${NC}: $dir ($size)"
    fi
    echo ""
}

# Function to find and report duplicates
find_duplicates() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo "Searching for duplicate files..."
    echo ""
    
    # Check if fdupes is available
    if command -v fdupes &> /dev/null; then
        echo "Duplicates found (using fdupes):"
        fdupes -r assets/ frontend/public/assets/ 2>/dev/null | grep -v "^$" | head -20 || echo "  No duplicates found"
    else
        echo "  Note: Install 'fdupes' for duplicate detection"
        echo "  Checking for obvious duplicates by filename..."
        
        # Simple duplicate check by filename
        find assets/ frontend/public/assets/ -type f -name "*.png" -o -name "*.jpg" 2>/dev/null | \
            xargs -I {} basename {} | sort | uniq -c | sort -rn | head -10
    fi
    echo ""
}

# Pre-cleanup report
echo "═══════════════════════════════════════════════════════════"
echo "  PRE-CLEANUP SIZE ANALYSIS"
echo "═══════════════════════════════════════════════════════════"
echo ""

TOTAL_SIZE_BEFORE=$(du -sh . --exclude=.git 2>/dev/null | cut -f1)
echo "Total working tree size: $TOTAL_SIZE_BEFORE"
echo ""

# Phase 1: Remove cleanup artifacts
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PHASE 1: Remove Cleanup Artifacts                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

remove_dir "purge"
remove_dir "cleanup_backup_*" 2>/dev/null || true

# Phase 2: Remove uncategorized assets
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PHASE 2: Remove Uncategorized Assets                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${YELLOW}Note:${NC} These assets should be categorized or moved to Git LFS"
echo ""

if [ -d "assets/uncategorized" ]; then
    FILE_COUNT=$(find assets/uncategorized -type f | wc -l)
    echo "Files in assets/uncategorized/: $FILE_COUNT"
    remove_dir "assets/uncategorized"
fi

if [ -d "frontend/public/assets/uncategorized" ]; then
    FILE_COUNT=$(find frontend/public/assets/uncategorized -type f | wc -l)
    echo "Files in frontend/public/assets/uncategorized/: $FILE_COUNT"
    remove_dir "frontend/public/assets/uncategorized"
fi

# Phase 3: Remove triage directory
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PHASE 3: Remove Triage/Staging Areas                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

remove_dir "frontend/public/assets/_triage"

# Phase 4: Report duplicates
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PHASE 4: Duplicate File Analysis                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ "$DRY_RUN" = true ]; then
    find_duplicates
else
    echo "Duplicate removal should be done manually after review."
    echo "See docs/REPOSITORY_SIZE_ANALYSIS.md for details."
fi
echo ""

# Phase 5: Clean up specific large files
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PHASE 5: Large File Report                               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "Large files (>10MB):"
find . -type f -size +10M -not -path "./.git/*" -not -path "./$BACKUP_DIR/*" -exec du -h {} + 2>/dev/null | \
    sort -hr | head -10 || echo "  None found"
echo ""

# Summary
echo "═══════════════════════════════════════════════════════════"
echo "  CLEANUP SUMMARY"
echo "═══════════════════════════════════════════════════════════"
echo ""

if [ "$DRY_RUN" = false ]; then
    TOTAL_SIZE_AFTER=$(du -sh . --exclude=.git --exclude=$BACKUP_DIR 2>/dev/null | cut -f1)
    echo "Size before: $TOTAL_SIZE_BEFORE"
    echo "Size after:  $TOTAL_SIZE_AFTER"
    echo ""
    
    if [ "$BACKUP" = true ]; then
        BACKUP_SIZE=$(calc_size "$BACKUP_DIR")
        echo -e "${GREEN}✓ Backup created${NC}: $BACKUP_DIR ($BACKUP_SIZE)"
        echo ""
        echo "To restore backup:"
        echo "  cp -r $BACKUP_DIR/* ."
        echo ""
        echo "To remove backup (once verified):"
        echo "  rm -rf $BACKUP_DIR"
    fi
else
    echo -e "${YELLOW}DRY-RUN COMPLETE${NC} - No files were deleted"
    echo ""
    echo "To perform actual cleanup:"
    echo "  $0 --execute"
    echo ""
    echo "To perform cleanup without backup (not recommended):"
    echo "  $0 --execute --no-backup"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  NEXT STEPS"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "1. Review docs/REPOSITORY_SIZE_ANALYSIS.md for full analysis"
echo "2. Consider implementing Git LFS for remaining large files"
echo "3. Deduplicate assets manually using the duplicate report"
echo "4. Update .gitignore to prevent future bloat"
echo "5. Run git health check: bash scripts/git-health-check.sh"
echo ""

if [ "$DRY_RUN" = false ]; then
    echo "═══════════════════════════════════════════════════════════"
    echo "  GIT OPERATIONS"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "Files have been removed from working tree."
    echo ""
    echo "To commit changes:"
    echo "  git add -A"
    echo "  git commit -m 'chore: cleanup large assets and duplicates'"
    echo ""
    echo "To also remove from git history (CAUTION - rewrites history):"
    echo "  # See docs/REPOSITORY_SIZE_ANALYSIS.md for safe procedures"
    echo ""
fi
