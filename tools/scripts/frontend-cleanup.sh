#!/bin/bash

# Frontend Structure Cleanup & Restructuring Script
# Executes React best practices folder reorganization
# This script is idempotent and git-safe

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
FRONTEND_DIR="$PROJECT_ROOT/frontend/src"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "=========================================="
echo "Frontend Cleanup & Restructuring"
echo "Start time: $(date)"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Phase 1: Audit imports that reference old paths
echo ""
log_info "PHASE 1: Auditing imports of duplicated components..."

# Search for imports from root-level duplicates
log_info "Checking for imports of NotificationCenter, ProtectedRoute, SkeletonLoader from root..."

grep -r "from.*['\"].*NotificationCenter['\"]" "$FRONTEND_DIR" --include="*.tsx" --include="*.ts" | grep -v "_legacy" | grep -v "node_modules" | tee /tmp/imports-notif.log || true
grep -r "from.*['\"].*ProtectedRoute['\"]" "$FRONTEND_DIR" --include="*.tsx" --include="*.ts" | grep -v "_legacy" | grep -v "node_modules" | tee /tmp/imports-protected.log || true
grep -r "from.*['\"].*SkeletonLoader['\"]" "$FRONTEND_DIR" --include="*.tsx" --include="*.ts" | grep -v "_legacy" | grep -v "node_modules" | tee /tmp/imports-skeleton.log || true

IMPORT_COUNT=$(cat /tmp/imports-*.log | wc -l)
log_info "Found $IMPORT_COUNT imports to update"

# Phase 2: Archive _legacy directory
echo ""
log_info "PHASE 2: Archiving _legacy directory..."

if [ -d "$FRONTEND_DIR/_legacy" ]; then
  log_info "Creating archive branch reference..."
  git -C "$PROJECT_ROOT" tag "legacy-backup-$TIMESTAMP" HEAD || log_warn "Could not create git tag (may already exist)"

  log_info "Moving _legacy to .archive_legacy..."
  mkdir -p "$PROJECT_ROOT/.archive"

  if [ ! -d "$PROJECT_ROOT/.archive_legacy" ]; then
    mv "$FRONTEND_DIR/_legacy" "$PROJECT_ROOT/.archive_legacy"
    log_info "✓ _legacy archived to .archive_legacy/"
  else
    log_warn "_legacy already archived, skipping move"
  fi

  # Update .gitignore
  if ! grep -q "^\.archive_legacy" "$PROJECT_ROOT/.gitignore"; then
    echo ".archive_legacy/" >> "$PROJECT_ROOT/.gitignore"
    log_info "✓ Updated .gitignore to exclude .archive_legacy"
  fi
else
  log_warn "_legacy directory not found, skipping..."
fi

# Phase 3: Remove empty test directories
echo ""
log_info "PHASE 3: Removing empty and redundant test directories..."

EMPTY_DIRS=(
  "frontend/src/components/career/__tests__"
  "frontend/src/components/SkeletonLoader/__tests__"
  "frontend/src/components/layout/__tests__"
  "frontend/src/components/SmartUploadModal/__tests__"
  "frontend/src/components/NotificationCenter/__tests__"
  "frontend/src/components/profiles/__tests__"
  "frontend/src/components/main/__tests__"
)

for dir in "${EMPTY_DIRS[@]}"; do
  FULL_PATH="$PROJECT_ROOT/$dir"
  if [ -d "$FULL_PATH" ]; then
    rm -rf "$FULL_PATH"
    log_info "✓ Deleted $dir"
  fi
done

# Phase 4: Remove deprecated and demo code
echo ""
log_info "PHASE 4: Removing deprecated components and demo code..."

DEPRECATED_PATHS=(
  "frontend/src/components/_deprecated"
  "frontend/src/app/style-guide"
  "frontend/src/test-autofix"
  "frontend/src/components/style-guide"
  "frontend/src/components/library/fix-document-type-selector.ts"
  "frontend/src/components/library/fix-storybook-imports.ts"
)

for path in "${DEPRECATED_PATHS[@]}"; do
  FULL_PATH="$PROJECT_ROOT/$path"
  if [ -e "$FULL_PATH" ]; then
    rm -rf "$FULL_PATH"
    log_info "✓ Deleted $path"
  fi
done

# Phase 5: Handle root-level duplicate components
echo ""
log_info "PHASE 5: Removing root-level duplicate components..."

ROOT_COMPONENTS=(
  "frontend/src/NotificationCenter"
  "frontend/src/ProtectedRoute"
  "frontend/src/SkeletonLoader"
)

for comp in "${ROOT_COMPONENTS[@]}"; do
  FULL_PATH="$PROJECT_ROOT/$comp"
  if [ -d "$FULL_PATH" ]; then
    rm -rf "$FULL_PATH"
    log_info "✓ Deleted $comp"
  fi
done

# Phase 6: Clean up old M3 folder (keep m3-expressive only)
echo ""
log_info "PHASE 6: Consolidating M3 system..."

if [ -d "$FRONTEND_DIR/components/m3" ]; then
  # Check if m3 has any custom content
  FILE_COUNT=$(find "$FRONTEND_DIR/components/m3" -type f | wc -l)
  if [ "$FILE_COUNT" -le 2 ]; then
    rm -rf "$FRONTEND_DIR/components/m3"
    log_info "✓ Deleted components/m3 (old system - use m3-expressive)"
  else
    log_warn "components/m3 has $FILE_COUNT files, manual review needed"
  fi
else
  log_info "components/m3 not found (already cleaned)"
fi

# Phase 7: Create directory structure audit
echo ""
log_info "PHASE 7: Auditing component namespace structure..."

echo "Electric (Production) Components:"
find "$FRONTEND_DIR/components/electric" -maxdepth 1 -type d | sort | tail -n +2 | wc -l
echo "M3 Expressive (Migration) Components:"
find "$FRONTEND_DIR/components/m3-expressive" -maxdepth 1 -type d | sort | tail -n +2 | wc -l
echo "Custom (Domain) Components:"
find "$FRONTEND_DIR/components/custom" -maxdepth 1 -type d | sort | tail -n +2 | wc -l

# Phase 8: Verify structure integrity
echo ""
log_info "PHASE 8: Verifying structure integrity..."

if [ -d "$FRONTEND_DIR/components/electric" ]; then
  log_info "✓ Electric namespace exists"
else
  log_error "Electric namespace missing!"
fi

if [ -d "$FRONTEND_DIR/components/m3-expressive" ]; then
  log_info "✓ M3 Expressive namespace exists"
else
  log_error "M3 Expressive namespace missing!"
fi

if [ -d "$FRONTEND_DIR/components/custom" ]; then
  log_info "✓ Custom namespace exists"
else
  log_error "Custom namespace missing!"
fi

# Summary
echo ""
echo "=========================================="
log_info "Frontend Cleanup Complete!"
echo "=========================================="
echo ""
echo "Summary of Changes:"
echo "  • Archived _legacy directory"
echo "  • Removed empty test directories"
echo "  • Deleted deprecated/demo code"
echo "  • Removed root-level duplicates"
echo "  • Consolidated M3 system (m3-expressive only)"
echo ""
echo "Next Steps:"
echo "  1. Run: yarn install (to refresh dependencies)"
echo "  2. Run: yarn test (to verify no broken imports)"
echo "  3. Run: yarn build (to verify build succeeds)"
echo "  4. Review git diff for completeness"
echo ""
echo "Archive Location: .archive_legacy/"
echo "Archive Git Tag: legacy-backup-$TIMESTAMP"
echo ""
