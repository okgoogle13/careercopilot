#!/bin/bash

# Branch Analysis Script
# Analyzes all branches in the repository to help with consolidation decisions
# Usage: ./scripts/analyze_branches.sh

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the repository root
REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Branch Analysis Tool - CareerCopilot Repository${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Fetch all branches
echo -e "${YELLOW}⏳ Fetching all branches from remote...${NC}"
git fetch --all --quiet 2>/dev/null || true
echo -e "${GREEN}✅ Branches fetched${NC}"
echo ""

# Get the default branch (develop or main)
DEFAULT_BRANCH="develop"
if ! git rev-parse --verify "$DEFAULT_BRANCH" >/dev/null 2>&1; then
    DEFAULT_BRANCH="main"
fi

if ! git rev-parse --verify "$DEFAULT_BRANCH" >/dev/null 2>&1; then
    echo -e "${RED}❌ Error: Neither 'develop' nor 'main' branch exists${NC}"
    exit 1
fi

echo -e "${BLUE}📊 Using base branch: ${GREEN}$DEFAULT_BRANCH${NC}"
echo ""

# Function to count files by pattern
count_files() {
    local branch=$1
    local pattern=$2
    git diff --name-only "$DEFAULT_BRANCH...$branch" 2>/dev/null | grep -c "$pattern" || echo "0"
}

# Function to get last commit date
get_last_commit_date() {
    local branch=$1
    git log -1 --format="%ci" "$branch" 2>/dev/null || echo "Unknown"
}

# Function to get last commit message
get_last_commit_message() {
    local branch=$1
    git log -1 --format="%s" "$branch" 2>/dev/null | cut -c 1-50 || echo "N/A"
}

# Function to get commit count ahead of base
get_commits_ahead() {
    local branch=$1
    git rev-list --count "$DEFAULT_BRANCH..$branch" 2>/dev/null || echo "0"
}

# Get all branches (remote and local)
echo -e "${BLUE}📋 Analyzing all branches...${NC}"
echo ""

# Array to store branch data for sorting
declare -a branch_data=()

# Process remote branches
for branch in $(git branch -r | grep -v 'HEAD' | sed 's/origin\///'); do
    if [ "$branch" = "$DEFAULT_BRANCH" ]; then
        continue
    fi
    
    full_branch="origin/$branch"
    
    # Get branch metrics
    last_date=$(get_last_commit_date "$full_branch")
    last_msg=$(get_last_commit_message "$full_branch")
    commits_ahead=$(get_commits_ahead "$full_branch")
    
    # Count file changes
    backend_files=$(count_files "$full_branch" "^backend/")
    frontend_files=$(count_files "$full_branch" "^frontend/")
    genkit_files=$(count_files "$full_branch" "genkit_flows")
    api_files=$(count_files "$full_branch" "backend/app/api")
    core_files=$(count_files "$full_branch" "backend/app/core")
    
    # Store data for sorting (date|branch|data)
    branch_data+=("$last_date|$branch|$commits_ahead|$backend_files|$frontend_files|$genkit_files|$api_files|$core_files|$last_msg")
done

# Sort by date (most recent first) and display
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
printf "${GREEN}%-40s %-12s %-8s %-8s %-8s${NC}\n" "BRANCH" "DATE" "COMMITS" "BACKEND" "FRONTEND"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"

IFS=$'\n' sorted_branches=($(sort -r <<< "${branch_data[*]}"))
unset IFS

for data in "${sorted_branches[@]}"; do
    IFS='|' read -r date branch commits backend frontend genkit api core msg <<< "$data"
    
    # Format date (take just the date part)
    short_date=$(echo "$date" | cut -d' ' -f1)
    
    # Color code based on backend/frontend ratio
    if [ "$backend" -gt "$frontend" ]; then
        color=$GREEN
        indicator="🟢"
    elif [ "$backend" -eq "$frontend" ]; then
        color=$YELLOW
        indicator="🟡"
    else
        color=$RED
        indicator="🔴"
    fi
    
    # Truncate branch name if too long
    short_branch=$(echo "$branch" | cut -c 1-38)
    
    printf "${color}%-40s %-12s %-8s %-8s %-8s${NC} %s\n" \
        "$short_branch" "$short_date" "$commits" "$backend" "$frontend" "$indicator"
done

echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Detailed analysis for high-value branches
echo -e "${BLUE}🔍 Detailed Backend File Analysis${NC}"
echo -e "${BLUE}══════════════════════════════════════════════════════════════${NC}"
echo ""

for data in "${sorted_branches[@]}"; do
    IFS='|' read -r date branch commits backend frontend genkit api core msg <<< "$data"
    
    # Only show branches with backend changes
    if [ "$backend" -gt 0 ]; then
        echo -e "${YELLOW}Branch: ${GREEN}$branch${NC}"
        echo -e "  📅 Last commit: $date"
        echo -e "  💬 Last message: $msg"
        echo -e "  📈 Commits ahead: $commits"
        echo -e "  📊 Files changed:"
        echo -e "     - Backend total: $backend files"
        echo -e "     - Frontend total: $frontend files"
        echo -e "     - Genkit flows: $genkit files"
        echo -e "     - API endpoints: $api files"
        echo -e "     - Core logic: $core files"
        
        # List specific backend files changed
        echo -e "  📝 Backend files modified:"
        git diff --name-only "$DEFAULT_BRANCH...origin/$branch" 2>/dev/null | \
            grep "^backend/" | \
            head -10 | \
            sed 's/^/     - /'
        
        total_backend_files=$(git diff --name-only "$DEFAULT_BRANCH...origin/$branch" 2>/dev/null | grep -c "^backend/" || echo "0")
        if [ "$total_backend_files" -gt 10 ]; then
            echo -e "     ${YELLOW}... and $((total_backend_files - 10)) more files${NC}"
        fi
        
        echo ""
    fi
done

# Summary statistics
echo -e "${BLUE}📈 Summary Statistics${NC}"
echo -e "${BLUE}══════════════════════════════════════════════════════════════${NC}"

total_branches=${#sorted_branches[@]}
backend_heavy=$(for data in "${sorted_branches[@]}"; do
    IFS='|' read -r date branch commits backend frontend genkit api core msg <<< "$data"
    if [ "$backend" -gt "$frontend" ]; then echo "1"; fi
done | wc -l)

frontend_heavy=$(for data in "${sorted_branches[@]}"; do
    IFS='|' read -r date branch commits backend frontend genkit api core msg <<< "$data"
    if [ "$frontend" -gt "$backend" ]; then echo "1"; fi
done | wc -l)

balanced=$(for data in "${sorted_branches[@]}"; do
    IFS='|' read -r date branch commits backend frontend genkit api core msg <<< "$data"
    if [ "$backend" -eq "$frontend" ]; then echo "1"; fi
done | wc -l)

echo -e "  📊 Total branches analyzed: ${GREEN}$total_branches${NC}"
echo -e "  🟢 Backend-heavy branches: ${GREEN}$backend_heavy${NC}"
echo -e "  🟡 Balanced branches: ${YELLOW}$balanced${NC}"
echo -e "  🔴 Frontend-heavy branches: ${RED}$frontend_heavy${NC}"
echo ""

echo -e "${GREEN}✅ Analysis complete!${NC}"
echo -e "${BLUE}💡 Next steps:${NC}"
echo -e "   1. Run ${YELLOW}python3 scripts/extract_backend_features.py${NC} for detailed scoring"
echo -e "   2. Review the generated ${YELLOW}branch_analysis.json${NC} file"
echo -e "   3. Consult ${YELLOW}docs/CONSOLIDATION_PLAN.md${NC} for merge strategy"
echo ""
