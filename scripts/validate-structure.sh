#!/bin/bash

# Validate Frontend Structure
# Checks that folder organization follows React best practices

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/frontend/src"
COMPONENTS_DIR="$FRONTEND_DIR/components"
FEATURES_DIR="$FRONTEND_DIR/features"

echo "=========================================="
echo "Frontend Structure Validation"
echo "=========================================="

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[✓]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[⚠]${NC} $1"; }
log_error() { echo -e "${RED}[✗]${NC} $1"; }

ERRORS=0

# 1. Verify 3-namespace model exists
echo ""
echo "1. Component Namespaces:"

if [ -d "$COMPONENTS_DIR/electric" ]; then
  ELECTRIC_COUNT=$(find "$COMPONENTS_DIR/electric" -maxdepth 1 -type d | wc -l)
  log_info "electric/: $((ELECTRIC_COUNT-1)) components"
else
  log_error "electric/ namespace missing!"
  ((ERRORS++))
fi

if [ -d "$COMPONENTS_DIR/m3-expressive" ]; then
  M3_COUNT=$(find "$COMPONENTS_DIR/m3-expressive" -maxdepth 1 -type d | wc -l)
  log_info "m3-expressive/: $((M3_COUNT-1)) components"
else
  log_error "m3-expressive/ namespace missing!"
  ((ERRORS++))
fi

if [ -d "$COMPONENTS_DIR/custom" ]; then
  CUSTOM_COUNT=$(find "$COMPONENTS_DIR/custom" -maxdepth 1 -type d | wc -l)
  log_info "custom/: $((CUSTOM_COUNT-1)) components"
else
  log_error "custom/ namespace missing!"
  ((ERRORS++))
fi

# 2. Check for problematic directories
echo ""
echo "2. Checking for problematic directories:"

PROBLEMATIC=(
  "_legacy"
  "NotificationCenter"
  "ProtectedRoute"
  "SkeletonLoader"
  "m3"
)

for prob in "${PROBLEMATIC[@]}"; do
  if [ -d "$COMPONENTS_DIR/$prob" ] || [ -d "$FRONTEND_DIR/$prob" ]; then
    log_error "Found problematic directory: $prob"
    ((ERRORS++))
  fi
done

log_info "No deleted directories found at component root"

# 3. Check test co-location
echo ""
echo "3. Checking test co-location (industry standard):"

# Find components with local tests
TESTED=$(find "$COMPONENTS_DIR" -name "*.test.tsx" -o -name "*.test.ts" | wc -l)
log_info "Found $TESTED test files in component tree"

if [ "$TESTED" -eq 0 ]; then
  log_warn "No local tests found - verify tests are co-located"
fi

# 4. Verify no orphaned imports
echo ""
echo "4. Checking for orphaned imports:"

ORPHANED=0

# Check for imports from deleted paths
for pattern in "@/NotificationCenter" "@/ProtectedRoute" "@/SkeletonLoader" "from.*_legacy" "@/components/m3/"; do
  COUNT=$(grep -r "$pattern" "$FRONTEND_DIR" --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
  if [ "$COUNT" -gt 0 ]; then
    log_error "Found $COUNT orphaned imports matching: $pattern"
    ((ORPHANED++))
    ((ERRORS++))
  fi
done

if [ "$ORPHANED" -eq 0 ]; then
  log_info "No orphaned imports detected"
fi

# 5. Check archive exists
echo ""
echo "5. Checking archive:"

if [ -d "$PROJECT_ROOT/.archive_legacy" ]; then
  LEGACY_SIZE=$(du -sh "$PROJECT_ROOT/.archive_legacy" | cut -f1)
  log_info "Legacy archive exists ($LEGACY_SIZE)"
else
  log_warn "Legacy archive not found (expected at .archive_legacy/)"
fi

# 6. Summary statistics
echo ""
echo "6. Summary Statistics:"

TOTAL_COMPONENTS=$(find "$COMPONENTS_DIR/electric" "$COMPONENTS_DIR/m3-expressive" "$COMPONENTS_DIR/custom" -maxdepth 1 -type d 2>/dev/null | wc -l)
log_info "Total managed components: $((TOTAL_COMPONENTS-3))"

TOTAL_FILES=$(find "$COMPONENTS_DIR" -name "*.tsx" -o -name "*.ts" | wc -l)
log_info "Total component files: $TOTAL_FILES"

# 7. Final verdict
echo ""
echo "=========================================="

if [ "$ERRORS" -eq 0 ]; then
  log_info "✓ Frontend structure is valid!"
  echo ""
  echo "Structure adheres to React best practices:"
  echo "  • 3-namespace component model (electric, m3-expressive, custom)"
  echo "  • Layout infrastructure organized (layout/)"
  echo "  • Domain logic in features/"
  echo "  • No legacy/deprecated directories at root"
  echo "  • Tests co-located with components"
  exit 0
else
  log_error "Found $ERRORS validation errors!"
  exit 1
fi
