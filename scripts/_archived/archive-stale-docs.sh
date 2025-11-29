#!/bin/bash

# Archive Transient MD Files Script
# Scans for unreferenced .md files outside docs/ and archives old ones

set -euo pipefail

# Configuration
DAYS_THRESHOLD=90
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ARCHIVE_DIR="$PROJECT_ROOT/archive/old_docs"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
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

# Create archive directory if it doesn't exist
create_archive_dir() {
    if [[ ! -d "$ARCHIVE_DIR" ]]; then
        log "Creating archive directory: $ARCHIVE_DIR"
        mkdir -p "$ARCHIVE_DIR"
    fi
}

# Check if file should be excluded from archiving
should_exclude() {
    local file="$1"
    local filename="$(basename "$file")"
    
    # Exclude README.md and CLAUDE.md
    if [[ "$filename" == "README.md" ]] || [[ "$filename" == "CLAUDE.md" ]]; then
        return 0  # Exclude
    fi
    
    # Exclude files in docs/ directory
    if [[ "$file" == "$PROJECT_ROOT/docs/"* ]]; then
        return 0  # Exclude
    fi
    
    # Exclude files already in archive
    if [[ "$file" == "$PROJECT_ROOT/archive/"* ]]; then
        return 0  # Exclude
    fi
    
    # Exclude the script itself
    if [[ "$file" == "${BASH_SOURCE[0]}" ]]; then
        return 0  # Exclude
    fi
    
    return 1  # Don't exclude
}

# Check if file is referenced by other files
is_referenced() {
    local file="$1"
    local filename="$(basename "$file")"
    local filename_no_ext="${filename%.md}"
    
    log "  Checking references for: $filename"
    
    # Search for references to the filename (with and without .md extension)
    local references
    references=$(grep -r -l --exclude-dir=".git" --exclude-dir="node_modules" --exclude-dir=".next" \
        --exclude-dir="archive" \
        -e "$filename" \
        -e "$filename_no_ext" \
        "$PROJECT_ROOT" 2>/dev/null || true)
    
    # Remove self-reference
    references=$(echo "$references" | grep -v "^${file}$" || true)
    
    if [[ -n "$references" ]]; then
        log "    Found $(echo "$references" | wc -l) references"
        return 0  # Referenced
    else
        log "    No references found"
        return 1  # Not referenced
    fi
}

# Check if file is older than threshold days
is_old() {
    local file="$1"
    
    # Check file modification time
    local file_age
    file_age=$(find "$file" -mtime +$DAYS_THRESHOLD -print 2>/dev/null || true)
    
    if [[ -n "$file_age" ]]; then
        return 0  # Old
    else
        return 1  # Not old
    fi
}

# Archive a file
archive_file() {
    local file="$1"
    local filename="$(basename "$file")"
    local archive_path="$ARCHIVE_DIR/$filename"
    
    # Handle filename conflicts
    local counter=1
    while [[ -f "$archive_path" ]]; do
        local name_without_ext="${filename%.md}"
        local archive_path="$ARCHIVE_DIR/${name_without_ext}_$counter.md"
        ((counter++))
    done
    
    log "Archiving: $file -> $archive_path"
    mv "$file" "$archive_path"
}

# Main scanning and archiving function
scan_and_archive() {
    log "Starting scan for stale markdown files"
    log "Age threshold: $DAYS_THRESHOLD days"
    log "Archive directory: $ARCHIVE_DIR"
    
    # Create archive directory
    create_archive_dir
    
    # Find all .md files in the project
    local total_files=0
    local excluded_files=0
    local old_files=0
    local referenced_files=0
    local archived_files=0
    
    log "Scanning for .md files..."
    
    while IFS= read -r -d '' file; do
        ((total_files++))
        
        local filename="$(basename "$file")"
        log "Processing: $filename"
        
        # Check if should be excluded
        if should_exclude "$file"; then
            log "  Excluded (protected file)"
            ((excluded_files++))
            continue
        fi
        
        # Check if file is old
        if ! is_old "$file"; then
            log "  Not old enough (modified within $DAYS_THRESHOLD days)"
            continue
        fi
        
        ((old_files++))
        log "  File is old enough"
        
        # Check if referenced
        if is_referenced "$file"; then
            log "  File is referenced - keeping"
            ((referenced_files++))
            continue
        fi
        
        # Archive the file
        log "  File is unreferenced and old - archiving"
        archive_file "$file"
        ((archived_files++))
        
    done < <(find "$PROJECT_ROOT" -name "*.md" -type f -print0 2>/dev/null | grep -z -v "$PROJECT_ROOT/.git" | grep -z -v "$PROJECT_ROOT/node_modules" | grep -z -v "$PROJECT_ROOT/archive" || true)
    
    # Summary
    echo ""
    echo "=========================================="
    success "Archive operation completed!"
    echo "Total .md files found: $total_files"
    echo "Files excluded (protected): $excluded_files"
    echo "Files old enough ($DAYS_THRESHOLD+ days): $old_files"
    echo "Files referenced by others: $referenced_files"
    echo "Files archived: $archived_files"
    
    if [[ $archived_files -gt 0 ]]; then
        echo ""
        log "Archived files are now in: $ARCHIVE_DIR"
        log "Disk space saved: $(du -sh "$ARCHIVE_DIR" 2>/dev/null | cut -f1 || echo "unknown")"
    fi
}

# Help function
show_help() {
    cat << EOF
Archive Transient MD Files Script

Scans for unreferenced .md files outside docs/ and archives old ones.

Protected files (NEVER archived):
- README.md
- CLAUDE.md  
- Files in ./docs/ directory
- Files already in ./archive/
- This script itself

Criteria for archiving:
- File is older than 90 days (configurable)
- File is not referenced by any other file
- File is not in protected locations

Usage: $0 [OPTIONS]

Options:
    -h, --help          Show this help message
    -d, --days N        Archive files older than N days (default: 90)
    --dry-run           Show what would be archived without actually archiving
    -v, --verbose       Verbose output

Examples:
    $0                  # Archive files older than 90 days
    $0 -d 30           # Archive files older than 30 days
    $0 --dry-run       # Show what would be archived
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

# Override archive function for dry run
if [[ "$DRY_RUN" == "true" ]]; then
    log "DRY RUN MODE - No files will actually be archived"
    
    # Override mv command
    mv() {
        local src="$1"
        local dst="$2"
        warning "[DRY RUN] Would archive: $src -> $dst"
    }
fi

# Verify we're in a git repository
if ! git -C "$PROJECT_ROOT" rev-parse --git-dir >/dev/null 2>&1; then
    error "Not in a git repository. Aborting for safety."
    exit 1
fi

# Run main function
scan_and_archive "$@"
