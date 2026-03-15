#!/bin/bash
# cleanup-frontend-phase1.sh
# Purpose: Removes empty dirs and suggests moves for root pollution

BASE_DIR="frontend/src"

echo "🧹 Starting Phase 1 Cleanup..."

# --- 1. Remove Empty/Redundant Directories ---
# These were identified as empty in your audit
DIRS_TO_REMOVE=(
  "$BASE_DIR/app/style-guide"
  "$BASE_DIR/test-autofix"
  "$BASE_DIR/components/ui/loading/__tests__"
  "$BASE_DIR/components/ui/Button/__tests__"
  "$BASE_DIR/components/career/__tests__"
  "$BASE_DIR/components/SkeletonLoader/__tests__"
  "$BASE_DIR/components/layout/__tests__"
  "$BASE_DIR/components/SmartUploadModal/__tests__"
  "$BASE_DIR/components/NotificationCenter/__tests__"
  "$BASE_DIR/components/profiles/__tests__"
  "$BASE_DIR/components/main/__tests__"
  "$BASE_DIR/components/style-guide"
)

for dir in "${DIRS_TO_REMOVE[@]}"; do
  if [ -d "$dir" ]; then
    rmdir "$dir" 2>/dev/null && echo "✅ Removed empty: $dir" || echo "⚠️  Could not remove (might not be empty): $dir"
  fi
done

# --- 2. Move Root-Level Components ---
# Moving root folders to components/layout to clean up src/
TARGET_LAYOUT="$BASE_DIR/components/layout"
mkdir -p "$TARGET_LAYOUT"

echo "📦 Organizing Root Components..."

# Helper function to move if destination doesn't exist
safe_move() {
  src=$1
  dest=$2
  name=$(basename "$src")

  if [ -d "$src" ]; then
    if [ -d "$dest/$name" ]; then
      echo "⚠️  Conflict: $dest/$name already exists. Please merge manually."
    else
      mv "$src" "$dest/" && echo "✅ Moved $name to $(dirname "$dest")"
    fi
  fi
}

safe_move "$BASE_DIR/NotificationCenter" "$TARGET_LAYOUT"
safe_move "$BASE_DIR/ProtectedRoute" "$TARGET_LAYOUT"
safe_move "$BASE_DIR/SkeletonLoader" "$TARGET_LAYOUT"

echo "🎉 Phase 1 Complete. Check $BASE_DIR/components/layout for moved items."
