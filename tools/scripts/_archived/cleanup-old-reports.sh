#!/bin/bash

# Cleanup Old Reports Script
# Scans for and deletes files older than 30 days in specified directories
# while protecting important project documentation

set -euo pipefail

# Configuration
DAYS_THRESHOLD=30
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if file is protected
is_protected() {
    local file="$1"
    local absolute_path="$(realpath "$file")"
    local project_root_abs="$(realpath "$PROJECT_ROOT")"

    # Protect docs directory
    if [[ "$absolute_path" == "$project_root_abs/docs/"* ]]; then
        return 0  # Protected
    fi

    # Protect README.md
    if [[ "$absolute_path" == "$project_root_abs/README.md" ]]; then
        return 0  # Protected
    fi

    # Protect the script itself
    if [[ "$absolute_path" == "$(realpath "${BASH_SOURCE[0]}")" ]]; then
        return 0  # Protected
    fi

    return 1  # Not protected
}

# Check if file should be deleted based on age
should_delete() {
    local file="$1"

    # Check if file exists
    if [[ ! -f "$file" ]]; then
        return 1  # Don't delete
    fi

    # Check if protected
    if is_protected "$file"; then
        return 1  # Don't delete
    fi

    # Check file age
    local file_age
    file_age=$(find "$file" -mtime +$DAYS_THRESHOLD -print 2>/dev/null || true)

    if [[ -n "$file_age" ]]; then
        return 0  # Should delete
    else
        return 1  # Don't delete
    fi
}

# Scan and delete old files
cleanup_directory() {
    local target_dir="$1"
    local pattern="$2"
    local description="$3"

    if [[ ! -d "$target_dir" ]]; then
        log "Directory $target_dir does not exist, skipping"
        return 0
    fi

    log "Scanning $description in: $target_dir"

    local files_found=0
    local files_deleted=0
    local files_protected=0

    while IFS= read -r -d '' file; do
        ((files_found++))

        if should_delete "$file"; then
            log "Deleting old file: $file"
            rm -f "$file"
            ((files_deleted++))
        else
            ((files_protected++))
        fi
    done < <(find "$target_dir" -type f $pattern -print0 2>/dev/null || true)

    if [[ $files_found -eq 0 ]]; then
        log "No files found matching pattern: $pattern"
    else
        success "Found $files_found files, deleted $files_deleted, protected $files_protected"
    fi

    echo ""
}

# Main execution
main() {
    log "Starting cleanup of old reports (older than $DAYS_THRESHOLD days)"
    log "Project root: $PROJECT_ROOT"

    # Verify we're in a git repository
    if ! git -C "$PROJECT_ROOT" rev-parse --git-dir >/dev/null 2>&1; then
        error "Not in a git repository. Aborting for safety."
        exit 1
    fi

    local total_deleted=0

    # Cleanup .ai_reports/ directory (all files)
    echo "=========================================="
    cleanup_directory "$PROJECT_ROOT/.ai_reports" "" "AI Reports Directory"

    # Cleanup backups/ directory (all files)
    echo "=========================================="
    cleanup_directory "$PROJECT_ROOT/backups" "" "Backups Directory"

    # Cleanup coverage/ directory (.log and .md files)
    echo "=========================================="
    cleanup_directory "$PROJECT_ROOT/coverage" "-name '*.log' -o -name '*.md'" "Coverage Directory (logs and reports)"

    # Summary
    echo "=========================================="
    success "Cleanup completed!"
    log "Scanned directories: .ai_reports/, backups/, coverage/"
    log "Age threshold: $DAYS_THRESHOLD days"
    log "Protected: ./docs/ and README.md"

    # Show disk space saved (if possible)
    if command -v du >/dev/null 2>&1; then
        log "Disk usage summary:"
        du -sh "$PROJECT_ROOT/.ai_reports" "$PROJECT_ROOT/backups" "$PROJECT_ROOT/coverage" 2>/dev/null || true
    fi
}

# Help function
show_help() {
    cat << EOF
Cleanup Old Reports Script

Scans for and deletes files older than 30 days in:
- .ai_reports/ (all files)
- backups/ (all files)
- coverage/ (*.log and *.md files only)

Protected files (NEVER deleted):
- ./docs/ directory (all files)
- README.md
- This script itself

Usage: $0 [OPTIONS]

Options:
    -h, --help          Show this help message
    -d, --days N        Delete files older than N days (default: 30)
    --dry-run           Show what would be deleted without actually deleting
    -v, --verbose       Verbose output

Examples:
    $0                  # Delete files older than 30 days
    $0 -d 7            # Delete files older than 7 days
    $0 --dry-run       # Show what would be deleted
EOF
}

# Parse command line arguments
DRY_RUN=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -d|--days)
            DAYS_THRESHOLD="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        *)
            error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Override delete function for dry run
if [[ "$DRY_RUN" == "true" ]]; then
    log "DRY RUN MODE - No files will actually be deleted"

    # Override rm command
    rm() {
        local file="$1"
        warning "[DRY RUN] Would delete: $file"
    }
fi

# Run main function
main "$@"
