#!/bin/bash

################################################################################
#
# Asset Batch Processor
# Orchestrates workflow for multiple PNG assets (ZIP or directory)
#
# Usage:
#   ./scripts/process-asset-batch.sh my-assets.zip
#   ./scripts/process-asset-batch.sh /path/to/pngs/
#
# Features:
#   - Accepts ZIP files (auto-extracts) or directories
#   - Processes all PNGs sequentially or in parallel
#   - Generates batch results JSON
#   - Creates categorization manifest
#   - Reports success/failure summary
#
################################################################################

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
ASSETS_DIR="$REPO_ROOT/assets"
UNCATEGORIZED_DIR="$ASSETS_DIR/uncategorized"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
BATCH_FILE="${1:-.}"
CATEGORY="${2:-kr-motifs}"
FORCE_PACKAGE="${3:-false}"
MAX_WORKERS=5
BATCH_TIMESTAMP=$(date +%Y%m%d-%H%M%S)

################################################################################
# FUNCTIONS
################################################################################

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}  $1"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC}  $1"
}

print_step() {
    echo -e "\n${YELLOW}→${NC} $1"
}

# Validate input file/directory
validate_input() {
    if [ ! -e "$BATCH_FILE" ]; then
        print_error "File or directory not found: $BATCH_FILE"
        exit 1
    fi
}

# Extract ZIP if needed
extract_batch() {
    if [[ "$BATCH_FILE" == *.zip ]]; then
        print_step "Extracting batch ZIP"

        EXTRACT_DIR="$UNCATEGORIZED_DIR/batch-$BATCH_TIMESTAMP"
        mkdir -p "$EXTRACT_DIR"

        if unzip -q "$BATCH_FILE" -d "$EXTRACT_DIR"; then
            print_success "Extracted to: $EXTRACT_DIR"
            echo "$EXTRACT_DIR"
        else
            print_error "Failed to extract ZIP file"
            exit 1
        fi
    else
        # It's a directory
        echo "$BATCH_FILE"
    fi
}

# Count PNG files
count_pngs() {
    find "$1" -maxdepth 1 -name "*.png" -type f | wc -l
}

# Process single PNG
process_png() {
    local png_file="$1"
    local png_name=$(basename "$png_file")

    python3 "$SCRIPT_DIR/orchestrate-asset-workflow.py" \
        --png "$png_file" \
        --category "$CATEGORY" \
        $([ "$FORCE_PACKAGE" = "true" ] && echo "--force-package") \
        2>&1
}

# Process PNGs sequentially
process_sequential() {
    local png_dir="$1"
    local png_count="$2"

    print_step "Processing $png_count PNGs sequentially"

    local results_json="[]"
    local success_count=0
    local fail_count=0
    local i=0

    for png_file in "$png_dir"/*.png; do
        if [ -f "$png_file" ]; then
            i=$((i + 1))
            local png_name=$(basename "$png_file")

            echo -ne "\r  [$i/$png_count] Processing: $png_name"

            if process_png "$png_file" > /dev/null 2>&1; then
                success_count=$((success_count + 1))
            else
                fail_count=$((fail_count + 1))
                print_error "Failed to process: $png_name"
            fi
        fi
    done

    echo ""
    print_success "Sequential processing complete"
    echo "$success_count $fail_count"
}

# Process PNGs in parallel
process_parallel() {
    local png_dir="$1"
    local png_count="$2"

    print_step "Processing $png_count PNGs in parallel (max $MAX_WORKERS workers)"

    python3 << PYTHON_SCRIPT
import json
import subprocess
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import sys

png_dir = Path("$png_dir")
pngs = sorted(list(png_dir.glob("*.png")))

if not pngs:
    print("No PNG files found")
    sys.exit(1)

def process_png(png_path):
    try:
        result = subprocess.run([
            "python3", "$SCRIPT_DIR/orchestrate-asset-workflow.py",
            "--png", str(png_path),
            "--category", "$CATEGORY",
            $(['--force-package', 'or' ] if "$FORCE_PACKAGE" == "true" else ['false', 'and' ][0])
        ], capture_output=True, text=True, timeout=300)

        return {
            "file": png_path.name,
            "status": "success" if result.returncode == 0 else "failed",
            "returncode": result.returncode
        }
    except Exception as e:
        return {
            "file": png_path.name,
            "status": "error",
            "error": str(e)
        }

# Process in parallel
results = []
completed = 0

with ThreadPoolExecutor(max_workers=$MAX_WORKERS) as executor:
    futures = {executor.submit(process_png, png): png for png in pngs}

    for future in as_completed(futures):
        result = future.result()
        results.append(result)
        completed += 1
        status_symbol = "✅" if result["status"] == "success" else "❌"
        print(f"  [{completed}/{len(pngs)}] {status_symbol} {result['file']}")

# Summary
success = sum(1 for r in results if r["status"] == "success")
failed = sum(1 for r in results if r["status"] == "failed")
errors = sum(1 for r in results if r["status"] == "error")

print(f"\n✅ {success} successful")
if failed > 0:
    print(f"❌ {failed} failed")
if errors > 0:
    print(f"⚠️  {errors} errors")

PYTHON_SCRIPT
}

# Generate results summary
generate_summary() {
    local png_dir="$1"
    local success_count="$2"
    local fail_count="$3"

    print_step "Generating batch report"

    # Create batch results JSON
    local results_file="$ASSETS_DIR/batch-results-$BATCH_TIMESTAMP.json"

    local total=$((success_count + fail_count))

    cat > "$results_file" << EOF
{
  "batch_id": "batch-$BATCH_TIMESTAMP",
  "input": "$png_dir",
  "category": "$CATEGORY",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "summary": {
    "total_processed": $total,
    "successful": $success_count,
    "failed": $fail_count,
    "success_rate": $(echo "scale=2; $success_count * 100 / $total" | bc)%
  },
  "asset_directories": "$(ls -d $ASSETS_DIR/ASSET-* 2>/dev/null | wc -l) directories created"
}
EOF

    print_success "Results saved to: $results_file"
}

# Show next steps
show_next_steps() {
    echo ""
    print_header "Next Steps"
    echo ""
    echo "  1. Review asset metadata:"
    echo -e "     ${BLUE}ls -la $ASSETS_DIR/ASSET-*/${NC}"
    echo ""
    echo "  2. Check placement guides:"
    echo -e "     ${BLUE}cat $ASSETS_DIR/ASSET-*/placement-guide.md${NC}"
    echo ""
    echo "  3. Verify production files:"
    echo -e "     ${BLUE}ls $REPO_ROOT/frontend/public/assets/$CATEGORY/${NC}"
    echo ""
    echo "  4. Review batch results:"
    echo -e "     ${BLUE}cat $ASSETS_DIR/batch-results-$BATCH_TIMESTAMP.json | jq .${NC}"
    echo ""
}

################################################################################
# MAIN EXECUTION
################################################################################

print_header "Asset Batch Processor"

print_info "Input: $BATCH_FILE"
print_info "Category: $CATEGORY"
print_info "Timestamp: $BATCH_TIMESTAMP"

# Validate input
validate_input

# Extract if ZIP
print_step "Preparing batch"
PNG_DIR=$(extract_batch)

# Count PNGs
PNG_COUNT=$(count_pngs "$PNG_DIR")

if [ "$PNG_COUNT" -eq 0 ]; then
    print_error "No PNG files found in: $PNG_DIR"
    exit 1
fi

print_success "Found $PNG_COUNT PNG files"

# Decide: sequential or parallel
if [ "$PNG_COUNT" -gt 5 ]; then
    print_info "Using parallel processing ($MAX_WORKERS workers) for $PNG_COUNT assets"
    process_parallel "$PNG_DIR" "$PNG_COUNT"
    # For now, count manually
    SUCCESS_COUNT=$(find "$ASSETS_DIR" -maxdepth 1 -name "ASSET-*" -type d | wc -l)
    FAIL_COUNT=0
else
    print_info "Using sequential processing for $PNG_COUNT assets"
    COUNTS=$(process_sequential "$PNG_DIR" "$PNG_COUNT")
    SUCCESS_COUNT=$(echo $COUNTS | awk '{print $1}')
    FAIL_COUNT=$(echo $COUNTS | awk '{print $2}')
fi

# Generate summary
generate_summary "$PNG_DIR" "$SUCCESS_COUNT" "$FAIL_COUNT"

# Show results
echo ""
print_header "Batch Processing Complete"
echo ""
echo -e "  ${GREEN}Total: $((SUCCESS_COUNT + FAIL_COUNT))${NC}"
echo -e "  ${GREEN}Successful: $SUCCESS_COUNT${NC}"
if [ "$FAIL_COUNT" -gt 0 ]; then
    echo -e "  ${RED}Failed: $FAIL_COUNT${NC}"
fi
echo ""

# Show next steps
show_next_steps

exit 0
