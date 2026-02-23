#!/bin/bash

# Consolidate Primitive Components
# Maps legacy primitive components to proper namespaces:
# - electric/ for production UI elements
# - m3-expressive/ for Material Design 3 migration
# - delete unused/legacy primitives

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/frontend/src/components"

echo "=========================================="
echo "Consolidating Primitive Components"
echo "=========================================="

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

# Legacy primitive directories that should be consolidated or deleted
# These don't fit the 3-namespace model and should be moved/deleted

PRIMITIVES_TO_CONSOLIDATE=(
  # These are used in electric/ - should already exist in electric/
  # Just remove the legacy duplicates
  "alert"           # Has electric/alert
  "avatar"          # Has electric/avatar
  "badge"           # Has electric/badge
  "breadcrumb"      # Has electric/breadcrumb
  "button"          # Has electric/button
  "card"            # Has electric/card
  "checkbox"        # Has electric/checkbox
  "dialog"          # Has electric/dialog
  "input"           # Has electric/input
  "label"           # Has electric/label
  "menu"            # Has electric/ version via custom
  "pagination"      # Has electric/pagination
  "popover"         # Has electric/popover
  "progress"        # Has electric/progress
  "select"          # Has electric/select
  "separator"       # Has electric/separator
  "sidebar"         # Has electric/ version via custom
  "skeleton"        # Has electric/skeleton
  "slider"          # Has electric/slider
  "switch"          # Has electric/switch
  "tabs"            # Has electric/tabs
  "textarea"        # Has electric/textarea
  "tooltip"         # Has electric/tooltip
)

log_info "PHASE 1: Removing legacy primitive duplicates..."
log_info "These all have modern equivalents in electric/ namespace"

for prim in "${PRIMITIVES_TO_CONSOLIDATE[@]}"; do
  LEGACY_PATH="$FRONTEND_DIR/$prim"

  if [ -d "$LEGACY_PATH" ]; then
    # Check if it has a corresponding electric/ version
    ELECTRIC_PATH="$FRONTEND_DIR/electric/$prim"

    if [ -d "$ELECTRIC_PATH" ]; then
      log_info "✓ Deleting legacy $prim (electric/$prim exists)"
      rm -rf "$LEGACY_PATH"
    else
      log_warn "  Keeping $prim (no electric/ equivalent found)"
    fi
  fi
done

# Specialized handling for components that don't fit standard patterns
echo ""
log_info "PHASE 2: Handling specialized/domain components..."

# footer, header - These are layout-related, keep in components/
if [ -d "$FRONTEND_DIR/footer" ]; then
  log_info "  footer → components/footer (keep as-is, used in layouts)"
fi

if [ -d "$FRONTEND_DIR/header" ]; then
  log_info "  header → components/header (keep as-is, used in layouts)"
fi

# figma - This is a utility component, keep or move to custom/
if [ -d "$FRONTEND_DIR/figma" ]; then
  log_info "  figma → custom/figma-utilities (consider moving if domain-specific)"
fi

# ingestion - Domain-specific component, should be in custom/ or features/
if [ -d "$FRONTEND_DIR/ingestion" ]; then
  log_info "  ingestion → features/ingestion (domain-specific, should not be in components/)"
fi

# jobs - Domain-specific, should be in features/jobs
if [ -d "$FRONTEND_DIR/jobs" ]; then
  log_info "  jobs → features/jobs (domain-specific, should not be in components/)"
fi

# Verify final structure
echo ""
log_info "PHASE 3: Verifying final namespace structure..."

echo ""
echo "Current Component Namespaces:"
echo "  electric/:"
ls -d "$FRONTEND_DIR/electric"/*/ 2>/dev/null | xargs -n1 basename | wc -l
echo ""
echo "  m3-expressive/:"
ls -d "$FRONTEND_DIR/m3-expressive"/*/ 2>/dev/null | xargs -n1 basename | wc -l
echo ""
echo "  custom/:"
ls -d "$FRONTEND_DIR/custom"/*/ 2>/dev/null | xargs -n1 basename | wc -l
echo ""
echo "  layout utilities (footer, header):"
[ -d "$FRONTEND_DIR/footer" ] && echo "    - footer"
[ -d "$FRONTEND_DIR/header" ] && echo "    - header"

echo ""
echo "Legacy Primitives Remaining (should be empty):"
LEGACY_PRIMS=$(ls -d "$FRONTEND_DIR"/{alert,avatar,badge,breadcrumb,button,card,checkbox,dialog,input,label,menu,pagination,popover,progress,select,separator,sidebar,skeleton,slider,switch,tabs,textarea,tooltip}/ 2>/dev/null | wc -l)
if [ "$LEGACY_PRIMS" -eq 0 ]; then
  log_info "✓ All legacy primitives consolidated/removed"
else
  log_warn "Found $LEGACY_PRIMS legacy primitive directories remaining"
fi

echo ""
echo "=========================================="
log_info "Consolidation Complete!"
echo "=========================================="
echo ""
echo "Summary:"
echo "  • Removed duplicate primitive components"
echo "  • Unified on electric/ namespace for production"
echo "  • Identified m3-expressive/ for future migration"
echo ""
echo "Files to verify:"
grep -r "components/(alert\|avatar\|badge\|breadcrumb\|button\|card\|checkbox\|dialog\|input\|label\|menu\|pagination\|popover\|progress\|select\|separator\|sidebar\|skeleton\|slider\|switch\|tabs\|textarea\|tooltip)" "$PROJECT_ROOT/frontend/src" \
  --include="*.tsx" --include="*.ts" | grep -v "components/electric" | grep -v "m3-expressive" | head -5 || true
