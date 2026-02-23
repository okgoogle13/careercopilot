#!/bin/bash

# Move Domain-Specific Components from components/ to features/
# Ensures components/ only contains UI primitives and layout utilities
# Domain logic belongs in features/

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPONENTS_DIR="$PROJECT_ROOT/frontend/src/components"
FEATURES_DIR="$PROJECT_ROOT/frontend/src/features"

echo "=========================================="
echo "Moving Domain Components to Features"
echo "=========================================="

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Helper to move and update imports
move_and_update_imports() {
  local component=$1
  local dest_feature=$2
  local source_path="$COMPONENTS_DIR/$component"
  local dest_path="$FEATURES_DIR/$dest_feature/$component"

  if [ ! -d "$source_path" ]; then
    log_warn "Source path $source_path not found"
    return
  fi

  # Create destination if needed
  mkdir -p "$(dirname "$dest_path")"

  log_info "Moving $component from components/ to features/$dest_feature/"
  mv "$source_path" "$dest_path"

  # Update imports in source files
  # Pattern: components/ingestion -> features/ingestion
  find "$PROJECT_ROOT/frontend/src" -type f \( -name "*.tsx" -o -name "*.ts" \) \
    ! -path "*/node_modules/*" \
    -exec sed -i.bak "s|@/components/$component|@/features/$dest_feature/$component|g" {} \; \
    -exec sed -i.bak "s|from.*components/$component|from '@/features/$dest_feature/$component|g" {} \;

  # Clean up backup files
  find "$PROJECT_ROOT/frontend/src" -name "*.bak" -delete

  log_info "✓ Moved and updated imports for $component"
}

# Phase 1: Move domain-specific components
echo ""
log_info "PHASE 1: Moving domain components to features/..."

# Check which domain components exist
if [ -d "$COMPONENTS_DIR/ingestion" ]; then
  move_and_update_imports "ingestion" "ingestion"
else
  log_warn "ingestion component not found"
fi

if [ -d "$COMPONENTS_DIR/jobs" ]; then
  move_and_update_imports "jobs" "jobs"
else
  log_warn "jobs component not found"
fi

if [ -d "$COMPONENTS_DIR/career" ]; then
  log_info "  career/ has TimelineView - keeping as it's shared infrastructure"
fi

# Phase 2: Handle remaining primitives with no electric/ equivalent
echo ""
log_info "PHASE 2: Handling remaining primitives without electric/ equivalents..."

REMAINING_PRIMITIVES=(
  "label"
  "menu"
  "separator"
  "sidebar"
)

for prim in "${REMAINING_PRIMITIVES[@]}"; do
  PRIM_PATH="$COMPONENTS_DIR/$prim"

  if [ -d "$PRIM_PATH" ]; then
    # Check if there's an electric version
    if [ -d "$COMPONENTS_DIR/electric/$prim" ]; then
      log_info "  Deleting $prim (electric/$prim exists)"
      rm -rf "$PRIM_PATH"
    else
      # Check if it's used elsewhere
      USAGE=$(grep -r "from.*components/$prim" "$PROJECT_ROOT/frontend/src" --include="*.tsx" --include="*.ts" | wc -l)

      if [ "$USAGE" -gt 0 ]; then
        log_warn "  Keeping $prim ($USAGE usages found)"
      else
        log_warn "  Deleting $prim (unused)"
        rm -rf "$PRIM_PATH"
      fi
    fi
  fi
done

# Phase 3: Final structure verification
echo ""
log_info "PHASE 3: Verifying final structure..."

echo ""
echo "Components/ Structure (UI Primitives + Layout):"
echo "  electric/:" $(ls -d "$COMPONENTS_DIR/electric"/*/ 2>/dev/null | xargs -n1 basename | wc -l) "components"
echo "  m3-expressive/:" $(ls -d "$COMPONENTS_DIR/m3-expressive"/*/ 2>/dev/null | xargs -n1 basename | wc -l) "components"
echo "  custom/:" $(ls -d "$COMPONENTS_DIR/custom"/*/ 2>/dev/null | xargs -n1 basename | wc -l) "components"
echo "  layout utilities:" $(ls -d "$COMPONENTS_DIR"/{footer,header,layout}/ 2>/dev/null | xargs -n1 basename | wc -l) "utilities"

echo ""
echo "Features/ Structure (Domain Logic):"
ls -d "$FEATURES_DIR"/*/ 2>/dev/null | xargs -n1 basename | head -15

# Phase 4: Check for broken imports
echo ""
log_info "PHASE 4: Checking for broken imports..."

BROKEN_IMPORTS=$(grep -r "@/components/(ingestion\|jobs)" "$PROJECT_ROOT/frontend/src" --include="*.tsx" --include="*.ts" | wc -l)

if [ "$BROKEN_IMPORTS" -gt 0 ]; then
  log_error "Found $BROKEN_IMPORTS broken imports"
  grep -r "@/components/(ingestion\|jobs)" "$PROJECT_ROOT/frontend/src" --include="*.tsx" --include="*.ts" | head -5
else
  log_info "✓ No broken imports found"
fi

echo ""
echo "=========================================="
log_info "Domain Component Migration Complete!"
echo "=========================================="
echo ""
echo "Next: Run 'yarn test' to verify no broken imports"
echo ""
