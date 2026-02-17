#!/bin/bash

# Consolidate Root-Level Components
# Moves scattered components from root to proper namespaces
# Ensures single source of truth in electric/, m3-expressive/, or custom/

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPONENTS_DIR="$PROJECT_ROOT/frontend/src/components"

echo "=========================================="
echo "Consolidating Root-Level Components"
echo "=========================================="

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

# Helper to move components
move_component() {
  local src=$1
  local dest=$2
  local src_path="$COMPONENTS_DIR/$src"
  local dest_path="$COMPONENTS_DIR/$dest"

  if [ ! -d "$src_path" ]; then
    log_warn "Source $src not found"
    return
  fi

  if [ -d "$dest_path" ]; then
    log_warn "Destination $dest already exists, skipping"
    return
  fi

  log_info "Moving $src → $dest"
  mkdir -p "$(dirname "$dest_path")"
  mv "$src_path" "$dest_path"

  # Update imports
  find "$PROJECT_ROOT/frontend/src" -type f \( -name "*.tsx" -o -name "*.ts" \) \
    ! -path "*/node_modules/*" \
    -exec sed -i.bak "s|@/components/$src|@/components/$dest|g" {} \; 2>/dev/null || true

  find "$PROJECT_ROOT/frontend/src" -name "*.bak" -delete

  log_info "  ✓ Moved and updated imports"
}

# Phase 1: Move layout components to layout/
echo ""
log_info "PHASE 1: Consolidating layout components..."

move_component "AppLayout" "layout/AppLayout"
move_component "AppShell" "layout/AppShell"
move_component "PageHeader" "layout/PageHeader"
move_component "Navbar" "layout/Navbar"
move_component "NavigationItem" "layout/NavigationItem"
move_component "NotificationCenter" "layout/NotificationCenter"
move_component "SkeletonLoader" "layout/SkeletonLoader"

# Phase 2: Move feature-specific components to custom/
echo ""
log_info "PHASE 2: Moving feature components to custom/..."

move_component "ApplicationCard" "custom/application-card"
move_component "ApplicationTracker" "custom/application-tracker"
move_component "ConfirmTagsModal" "custom/confirm-tags-modal"
move_component "SmartUploadModal" "custom/smart-upload-modal"
move_component "GridCompat" "custom/grid-compat"
move_component "LoadingState" "custom/loading-state"
move_component "StatCard" "custom/stat-card"
move_component "JobSearch" "custom/job-search"
move_component "TimelineView" "custom/timeline-view"

# Phase 3: Clean up scattered folders (library, main, dashboard, etc)
echo ""
log_info "PHASE 3: Reviewing other scattered components..."

# library - demo/showcase, should be in stories/
if [ -d "$COMPONENTS_DIR/library" ]; then
  log_warn "library/ is a showcase/demo - consider moving to stories/"
  log_info "  For now, keeping in components/library (re-categorize if needed)"
fi

# main - landing page components, should be in features/main
if [ -d "$COMPONENTS_DIR/main" ]; then
  log_info "  main/ components belong in features/main"
  log_info "  (manual review recommended)"
fi

# dashboard - should be in features/dashboard
if [ -d "$COMPONENTS_DIR/dashboard" ]; then
  log_info "  dashboard/ components belong in features/dashboard"
  log_info "  (manual review recommended)"
fi

# profiles, profile - should be in features/profile
if [ -d "$COMPONENTS_DIR/profiles" ]; then
  log_info "  profiles/ components belong in features/profile"
  log_info "  (manual review recommended)"
fi

if [ -d "$COMPONENTS_DIR/profile" ]; then
  log_info "  profile/ components exist - consolidate with profiles/"
fi

# Documents - should be in features/documents
if [ -d "$COMPONENTS_DIR/Documents" ]; then
  log_info "  Documents/ should be in features/documents/"
fi

# Phase 4: Verify final structure
echo ""
log_info "PHASE 4: Verifying final structure..."

echo ""
echo "Final Components Directory Structure:"
echo ""
echo "UI Primitives (electric/):"
ls -d "$COMPONENTS_DIR/electric"/*/ 2>/dev/null | xargs -n1 basename | wc -l
echo ""
echo "Design System (m3-expressive/):"
ls -d "$COMPONENTS_DIR/m3-expressive"/*/ 2>/dev/null | xargs -n1 basename | wc -l
echo ""
echo "Custom/Domain Components (custom/):"
ls -d "$COMPONENTS_DIR/custom"/*/ 2>/dev/null | xargs -n1 basename | wc -l
echo ""
echo "Layout Infrastructure (layout/):"
ls -d "$COMPONENTS_DIR/layout"/*/ 2>/dev/null | xargs -n1 basename | sort | sed 's/^/  - /'
echo ""
echo "Remaining at root level (should be minimal):"
ls -d "$COMPONENTS_DIR"/*/ 2>/dev/null | xargs -n1 basename | grep -v "^electric\|^m3-expressive\|^custom\|^layout\|^__tests__\|^career" | sort | sed 's/^/  - /'

# Phase 5: Summary
echo ""
echo "=========================================="
log_info "Component Consolidation Complete!"
echo "=========================================="
echo ""
echo "Recommended Next Steps:"
echo "  1. Review manually-categorized components (main/, dashboard/, profile/)"
echo "  2. Run: yarn test (verify no broken imports)"
echo "  3. Run: yarn build (verify production build)"
echo ""
