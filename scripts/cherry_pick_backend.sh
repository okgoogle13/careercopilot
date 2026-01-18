#!/bin/bash

# Cherry-Pick Backend Helper Script
# Extracts and applies backend-only commits from a specified branch
# Usage: ./scripts/cherry_pick_backend.sh <branch-name>

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Get the repository root
REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

# Check if branch name is provided
if [ $# -eq 0 ]; then
    echo -e "${RED}❌ Error: Branch name required${NC}"
    echo "Usage: $0 <branch-name>"
    echo ""
    echo "Example:"
    echo "  $0 claude/feature-name-abc123"
    exit 1
fi

BRANCH_NAME=$1
PATCH_DIR="/tmp/branch-consolidation-patches"
LOG_FILE="$REPO_ROOT/consolidation_log.txt"

# Verify branch exists
if ! git rev-parse --verify "origin/$BRANCH_NAME" >/dev/null 2>&1; then
    echo -e "${RED}❌ Error: Branch 'origin/$BRANCH_NAME' not found${NC}"
    echo ""
    echo "Available branches:"
    git branch -r | grep -v HEAD | head -10
    exit 1
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Cherry-Pick Backend Helper${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "📦 Source branch: ${GREEN}$BRANCH_NAME${NC}"
echo ""

# Get base branch
BASE_BRANCH="develop"
if ! git rev-parse --verify "$BASE_BRANCH" >/dev/null 2>&1; then
    BASE_BRANCH="main"
fi

if ! git rev-parse --verify "$BASE_BRANCH" >/dev/null 2>&1; then
    echo -e "${RED}❌ Error: Neither 'develop' nor 'main' branch exists${NC}"
    exit 1
fi

echo -e "🌿 Base branch: ${GREEN}$BASE_BRANCH${NC}"
echo ""

# Create patch directory
mkdir -p "$PATCH_DIR"
rm -f "$PATCH_DIR"/*.patch 2>/dev/null || true

# Initialize log file
echo "=== Cherry-Pick Log: $BRANCH_NAME ===" >> "$LOG_FILE"
echo "Date: $(date)" >> "$LOG_FILE"
echo "Base branch: $BASE_BRANCH" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Get commits that touch backend directory
echo -e "${YELLOW}⏳ Analyzing commits that modified backend/...${NC}"
echo ""

# Get list of commits affecting backend/
BACKEND_COMMITS=$(git log --oneline "$BASE_BRANCH..origin/$BRANCH_NAME" --pretty=format:"%H" -- backend/ | tac)

if [ -z "$BACKEND_COMMITS" ]; then
    echo -e "${YELLOW}⚠️  No commits found that modify backend/ directory${NC}"
    echo ""
    echo "This branch may not contain backend changes, or changes are in other directories."
    echo ""
    echo "Checking all changed files:"
    git diff --name-only "$BASE_BRANCH...origin/$BRANCH_NAME" | head -20
    exit 0
fi

# Count commits
COMMIT_COUNT=$(echo "$BACKEND_COMMITS" | wc -l)
echo -e "${GREEN}✓ Found $COMMIT_COUNT commits that modify backend/${NC}"
echo ""

# Display commits
echo -e "${BLUE}📋 Backend-touching commits:${NC}"
echo -e "${BLUE}────────────────────────────────────────────────────────────────${NC}"

commit_index=1
declare -A commit_details

for commit_hash in $BACKEND_COMMITS; do
    # Get commit info
    commit_msg=$(git log -1 --format="%s" "$commit_hash")
    commit_date=$(git log -1 --format="%ci" "$commit_hash" | cut -d' ' -f1)
    commit_author=$(git log -1 --format="%an" "$commit_hash")
    
    # Count backend files in this commit
    backend_files=$(git diff-tree --no-commit-id --name-only -r "$commit_hash" | grep -c "^backend/" || echo "0")
    total_files=$(git diff-tree --no-commit-id --name-only -r "$commit_hash" | wc -l)
    
    # Store details
    commit_details[$commit_index]="$commit_hash|$commit_msg|$backend_files|$total_files"
    
    # Display
    if [ "$backend_files" -eq "$total_files" ]; then
        indicator="🟢"  # Pure backend commit
    else
        indicator="🟡"  # Mixed commit
    fi
    
    echo -e "$indicator ${CYAN}[$commit_index]${NC} ${commit_hash:0:8} - $commit_msg"
    echo -e "    📅 $commit_date | 👤 $commit_author | 📁 $backend_files/$total_files backend files"
    
    commit_index=$((commit_index + 1))
done

echo -e "${BLUE}────────────────────────────────────────────────────────────────${NC}"
echo ""
echo -e "${YELLOW}Legend:${NC}"
echo -e "  🟢 Pure backend commit (all files in backend/)"
echo -e "  🟡 Mixed commit (some non-backend files)"
echo ""

# Generate patches
echo -e "${YELLOW}⏳ Generating patch files...${NC}"

patch_index=1
for commit_hash in $BACKEND_COMMITS; do
    patch_file="$PATCH_DIR/$(printf "%04d" $patch_index)-${commit_hash:0:8}.patch"
    
    # Generate patch for backend files only from this commit
    git diff-tree -p "$commit_hash" -- backend/ > "$patch_file"
    
    if [ -s "$patch_file" ]; then
        echo -e "  ✓ Created patch $patch_index: ${patch_file##*/}"
    else
        # Empty patch, remove it
        rm -f "$patch_file"
    fi
    
    patch_index=$((patch_index + 1))
done

echo -e "${GREEN}✓ Patch files created in: $PATCH_DIR${NC}"
echo ""

# Interactive application
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Interactive Patch Application${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Check if we're on a clean branch
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}⚠️  Warning: You have uncommitted changes${NC}"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
fi

applied_count=0
skipped_count=0
failed_count=0

for patch_file in "$PATCH_DIR"/*.patch; do
    if [ ! -f "$patch_file" ]; then
        continue
    fi
    
    patch_name=$(basename "$patch_file")
    patch_num=$(echo "$patch_name" | cut -d'-' -f1)
    commit_short=$(echo "$patch_name" | cut -d'-' -f2 | cut -d'.' -f1)
    
    # Find the original commit info
    commit_info=""
    for idx in "${!commit_details[@]}"; do
        details="${commit_details[$idx]}"
        IFS='|' read -r hash msg backend_cnt total_cnt <<< "$details"
        if [[ "$hash" == "$commit_short"* ]]; then
            commit_info="$msg"
            break
        fi
    done
    
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}Patch #$patch_num: $commit_short${NC}"
    echo -e "Message: $commit_info"
    echo ""
    echo -e "Preview of changes:"
    echo -e "${BLUE}────────────────────────────────────────────────────────────────${NC}"
    
    # Show a preview
    git apply --stat "$patch_file" 2>/dev/null || echo "  (Unable to generate stats)"
    
    echo -e "${BLUE}────────────────────────────────────────────────────────────────${NC}"
    echo ""
    
    # Ask user
    echo -e "Actions:"
    echo -e "  ${GREEN}[a]${NC} Apply this patch"
    echo -e "  ${YELLOW}[s]${NC} Skip this patch"
    echo -e "  ${BLUE}[v]${NC} View full patch"
    echo -e "  ${RED}[q]${NC} Quit (stop processing)"
    echo ""
    read -p "Choose action [a/s/v/q]: " -n 1 -r action
    echo
    echo
    
    case "$action" in
        a|A)
            # Try to apply
            if git apply --check "$patch_file" 2>/dev/null; then
                git apply "$patch_file"
                echo -e "${GREEN}✅ Patch applied successfully${NC}"
                applied_count=$((applied_count + 1))
                echo "APPLIED: $patch_name - $commit_info" >> "$LOG_FILE"
            else
                echo -e "${RED}❌ Patch failed to apply (conflicts)${NC}"
                echo ""
                echo "You can try to apply it manually:"
                echo "  git apply $patch_file"
                echo "Or apply with 3-way merge:"
                echo "  git apply --3way $patch_file"
                echo ""
                failed_count=$((failed_count + 1))
                echo "FAILED: $patch_name - $commit_info" >> "$LOG_FILE"
            fi
            ;;
        s|S)
            echo -e "${YELLOW}⏭️  Skipped${NC}"
            skipped_count=$((skipped_count + 1))
            echo "SKIPPED: $patch_name - $commit_info" >> "$LOG_FILE"
            ;;
        v|V)
            echo -e "${BLUE}📄 Full patch contents:${NC}"
            echo -e "${BLUE}────────────────────────────────────────────────────────────────${NC}"
            less "$patch_file"
            echo ""
            # Ask again after viewing
            read -p "Apply this patch? [a/s]: " -n 1 -r action2
            echo
            if [[ $action2 =~ ^[Aa]$ ]]; then
                if git apply --check "$patch_file" 2>/dev/null; then
                    git apply "$patch_file"
                    echo -e "${GREEN}✅ Patch applied successfully${NC}"
                    applied_count=$((applied_count + 1))
                    echo "APPLIED: $patch_name - $commit_info" >> "$LOG_FILE"
                else
                    echo -e "${RED}❌ Patch failed to apply (conflicts)${NC}"
                    failed_count=$((failed_count + 1))
                    echo "FAILED: $patch_name - $commit_info" >> "$LOG_FILE"
                fi
            else
                echo -e "${YELLOW}⏭️  Skipped${NC}"
                skipped_count=$((skipped_count + 1))
                echo "SKIPPED: $patch_name - $commit_info" >> "$LOG_FILE"
            fi
            ;;
        q|Q)
            echo -e "${RED}🛑 Stopping...${NC}"
            break
            ;;
        *)
            echo -e "${YELLOW}⏭️  Invalid choice, skipping${NC}"
            skipped_count=$((skipped_count + 1))
            echo "SKIPPED: $patch_name - $commit_info" >> "$LOG_FILE"
            ;;
    esac
    
    echo ""
done

# Summary
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${GREEN}✅ Applied: $applied_count${NC}"
echo -e "  ${YELLOW}⏭️  Skipped: $skipped_count${NC}"
echo -e "  ${RED}❌ Failed: $failed_count${NC}"
echo ""

# Log summary
echo "" >> "$LOG_FILE"
echo "Summary: Applied=$applied_count, Skipped=$skipped_count, Failed=$failed_count" >> "$LOG_FILE"
echo "====================================" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

if [ $applied_count -gt 0 ]; then
    echo -e "${GREEN}✓ Changes have been applied to your working directory${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Don't forget to:${NC}"
    echo "  1. Review the changes: ${CYAN}git status${NC}"
    echo "  2. Test the changes"
    echo "  3. Commit: ${CYAN}git add . && git commit -m 'Cherry-pick from $BRANCH_NAME'${NC}"
    echo ""
fi

if [ $failed_count -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Some patches failed to apply${NC}"
    echo "  Patch files are available in: $PATCH_DIR"
    echo "  Try applying manually or use: git apply --3way <patch-file>"
    echo ""
fi

echo -e "📝 Full log available at: ${CYAN}$LOG_FILE${NC}"
echo ""
echo -e "${GREEN}✨ Done!${NC}"
