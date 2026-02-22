#!/bin/bash
set -e

# Complete triage migration of approved assets
#
# This script migrates approved assets from _triage/keep/ to permanent
# kr-solidarity category folders, deletes discarded assets, and logs
# quarantine items for manual review.

ASSETS_DIR="frontend/public/assets"
TRIAGE_DIR="$ASSETS_DIR/_triage"
KEEP_DIR="$TRIAGE_DIR/keep"
DISCARD_DIR="$TRIAGE_DIR/discard"
QUARANTINE_DIR="$TRIAGE_DIR/quarantine"
KR_SOLIDARITY_DIR="$ASSETS_DIR/kr-solidarity"
LOG_FILE="triage-migration.log"

echo "🚀 Starting triage migration..." | tee -a "$LOG_FILE"
echo "Timestamp: $(date)" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Check if triage directory exists
if [ ! -d "$TRIAGE_DIR" ]; then
    echo "❌ Triage directory not found: $TRIAGE_DIR"
    exit 1
fi

# Counter for statistics
MOVED_COUNT=0
DELETED_COUNT=0
QUARANTINED_COUNT=0

# Function to extract category from kr-solidarity filename
extract_category() {
    local filename="$1"
    # Pattern: kr-solidarity__{layer}__{descriptor}__v{N}.ext
    # Extract layer as category
    if [[ $filename =~ kr-solidarity__([^_]+)__ ]]; then
        echo "${BASH_REMATCH[1]}"
    else
        echo "uncategorized"
    fi
}

# Migrate files from keep/ to permanent categories
if [ -d "$KEEP_DIR" ]; then
    echo "📦 Migrating approved assets from keep/..." | tee -a "$LOG_FILE"

    for file in "$KEEP_DIR"/*; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            category=$(extract_category "$filename")

            # Create category directory if needed
            target_dir="$KR_SOLIDARITY_DIR/$category"
            mkdir -p "$target_dir"

            # Move file
            if mv "$file" "$target_dir/$filename"; then
                echo "✅ Moved: $filename → $category/" | tee -a "$LOG_FILE"
                ((MOVED_COUNT++))
            else
                echo "❌ Failed to move: $filename" | tee -a "$LOG_FILE"
            fi
        fi
    done

    # Remove empty keep directory
    if [ -z "$(ls -A "$KEEP_DIR")" ]; then
        rmdir "$KEEP_DIR"
        echo "✅ Removed empty keep/ directory" | tee -a "$LOG_FILE"
    fi
fi

# Delete discarded files
if [ -d "$DISCARD_DIR" ]; then
    echo "" | tee -a "$LOG_FILE"
    echo "🗑️  Deleting discarded assets..." | tee -a "$LOG_FILE"

    for file in "$DISCARD_DIR"/*; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            if rm "$file"; then
                echo "✅ Deleted: $filename" | tee -a "$LOG_FILE"
                ((DELETED_COUNT++))
            else
                echo "❌ Failed to delete: $filename" | tee -a "$LOG_FILE"
            fi
        fi
    done

    # Remove empty discard directory
    if [ -z "$(ls -A "$DISCARD_DIR")" ]; then
        rmdir "$DISCARD_DIR"
        echo "✅ Removed empty discard/ directory" | tee -a "$LOG_FILE"
    fi
fi

# Log quarantine files for manual review
if [ -d "$QUARANTINE_DIR" ]; then
    echo "" | tee -a "$LOG_FILE"
    echo "⚠️  Quarantine files (manual review required):" | tee -a "$LOG_FILE"

    for file in "$QUARANTINE_DIR"/*; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            echo "  - $filename" | tee -a "$LOG_FILE"
            ((QUARANTINED_COUNT++))
        fi
    done
fi

# Summary
echo "" | tee -a "$LOG_FILE"
echo "📊 Migration Summary:" | tee -a "$LOG_FILE"
echo "  Moved: $MOVED_COUNT" | tee -a "$LOG_FILE"
echo "  Deleted: $DELETED_COUNT" | tee -a "$LOG_FILE"
echo "  Quarantined (manual review): $QUARANTINED_COUNT" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Update manifest
echo "🔄 Updating manifest..." | tee -a "$LOG_FILE"
cd frontend
if command -v node &> /dev/null; then
    if [ -f "scripts/kr/generate-manifest.mjs" ]; then
        node scripts/kr/generate-manifest.mjs 2>&1 | tee -a "../$LOG_FILE"
        echo "✅ Manifest updated" | tee -a "../$LOG_FILE"
    else
        echo "⚠️  Manifest generation script not found" | tee -a "../$LOG_FILE"
    fi
else
    echo "⚠️  Node.js not found, skipping manifest generation" | tee -a "../$LOG_FILE"
fi
cd ..

echo "" | tee -a "$LOG_FILE"
echo "✅ Triage migration complete!" | tee -a "$LOG_FILE"
echo "Log saved to: $LOG_FILE"

# Optionally create git commit
read -p "Create git commit? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git add "$ASSETS_DIR"
    git add "frontend/src/design/tokens/kerala-rage-kr-solidarity-manifest.json"
    git commit -m "chore: complete triage migration of $MOVED_COUNT approved assets

- Moved assets from _triage/keep to permanent category folders
- Deleted $DELETED_COUNT discarded assets
- $QUARANTINED_COUNT assets remain in quarantine for manual review
- Updated manifest with new asset entries"
    echo "✅ Commit created"
fi

exit 0
