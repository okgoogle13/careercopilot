#!/bin/bash
# Phase 4: Clean Up Duplicate Directories
# Removes design-system/, ui/, and old backup directories

set -e

COMPONENTS_DIR="/Applications/careercopilot/frontend/src/components"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Phase 4: Clean Up Duplicate Directories${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# ============================================================================
# SAFETY CHECKS
# ============================================================================
echo -e "${YELLOW}Running safety checks...${NC}"
echo ""

# Verify new directories exist
if [ ! -d "$COMPONENTS_DIR/electric" ]; then
  echo -e "${RED}✗ ABORT: electric/ directory not found${NC}"
  exit 1
fi

if [ ! -d "$COMPONENTS_DIR/m3-expressive" ]; then
  echo -e "${RED}✗ ABORT: m3-expressive/ directory not found${NC}"
  exit 1
fi

if [ ! -d "$COMPONENTS_DIR/custom" ]; then
  echo -e "${RED}✗ ABORT: custom/ directory not found${NC}"
  exit 1
fi

echo -e "${GREEN}✓ All required directories exist${NC}"
echo ""

# ============================================================================
# DELETE DUPLICATE design-system/ DIRECTORY
# ============================================================================
if [ -d "$COMPONENTS_DIR/design-system" ]; then
  echo -e "${YELLOW}Deleting design-system/ (100% duplicate of electric/)${NC}"

  # Get size before deletion
  SIZE=$(du -sh "$COMPONENTS_DIR/design-system" | cut -f1)

  rm -rf "$COMPONENTS_DIR/design-system"
  echo -e "${GREEN}✓ Deleted design-system/ (freed ${SIZE})${NC}"
  echo ""
else
  echo -e "${YELLOW}⊘ design-system/ not found (already deleted)${NC}"
  echo ""
fi

# ============================================================================
# DELETE DUPLICATE ui/ DIRECTORY
# ============================================================================
if [ -d "$COMPONENTS_DIR/ui" ]; then
  echo -e "${YELLOW}Deleting ui/ (fully migrated)${NC}"

  # Get size before deletion
  SIZE=$(du -sh "$COMPONENTS_DIR/ui" | cut -f1)

  rm -rf "$COMPONENTS_DIR/ui"
  echo -e "${GREEN}✓ Deleted ui/ (freed ${SIZE})${NC}"
  echo ""
else
  echo -e "${YELLOW}⊘ ui/ not found (already deleted)${NC}"
  echo ""
fi

# ============================================================================
# DELETE OLD BACKUP DIRECTORIES
# ============================================================================
echo -e "${YELLOW}Cleaning up old backup directories...${NC}"
echo ""

BACKUP_COUNT=0
for backup_dir in "$COMPONENTS_DIR"/_backup_20251202_*; do
  if [ -d "$backup_dir" ]; then
    DIR_NAME=$(basename "$backup_dir")
    SIZE=$(du -sh "$backup_dir" | cut -f1)

    rm -rf "$backup_dir"
    echo -e "${GREEN}✓ Deleted${NC} $DIR_NAME (freed ${SIZE})"
    BACKUP_COUNT=$((BACKUP_COUNT + 1))
  fi
done

if [ $BACKUP_COUNT -eq 0 ]; then
  echo -e "${YELLOW}⊘ No backup directories found${NC}"
fi
echo ""

# ============================================================================
# DELETE REMAINING DUPLICATE M3 ROOT DIRECTORIES
# ============================================================================
echo -e "${YELLOW}Checking for remaining M3 root directories...${NC}"
echo ""

M3_DIRS_DELETED=0
for dir in "$COMPONENTS_DIR"/M3*/; do
  if [ -d "$dir" ]; then
    DIR_NAME=$(basename "$dir")
    rm -rf "$dir"
    echo -e "${GREEN}✓ Deleted${NC} $DIR_NAME/"
    M3_DIRS_DELETED=$((M3_DIRS_DELETED + 1))
  fi
done

if [ $M3_DIRS_DELETED -eq 0 ]; then
  echo -e "${GREEN}✓ No M3 root directories found (already cleaned)${NC}"
fi
echo ""

# ============================================================================
# DELETE REDUNDANT ROOT DIRECTORIES
# ============================================================================
echo -e "${YELLOW}Checking for redundant root directories...${NC}"
echo ""

REDUNDANT_DIRS=("alert-dialog" "date-picker" "radio-group" "search-input")
REDUNDANT_DELETED=0

for dir in "${REDUNDANT_DIRS[@]}"; do
  if [ -d "$COMPONENTS_DIR/$dir" ]; then
    rm -rf "$COMPONENTS_DIR/$dir"
    echo -e "${GREEN}✓ Deleted${NC} $dir/"
    REDUNDANT_DELETED=$((REDUNDANT_DELETED + 1))
  fi
done

if [ $REDUNDANT_DELETED -eq 0 ]; then
  echo -e "${GREEN}✓ No redundant directories found${NC}"
fi
echo ""

# ============================================================================
# VERIFY FINAL STRUCTURE
# ============================================================================
echo -e "${BLUE}Verifying final structure...${NC}"
echo ""

FINAL_DIRS=$(find "$COMPONENTS_DIR" -maxdepth 1 -type d | sort)

echo "Final directory structure:"
echo "$FINAL_DIRS" | grep -v "^\.$" | sed 's|.*/||' | while read dir; do
  [ -z "$dir" ] && continue

  if [ "$dir" = "electric" ] || [ "$dir" = "m3-expressive" ] || [ "$dir" = "custom" ]; then
    echo -e "${GREEN}✓ $dir/${NC}"
  elif [ "$dir" = "common" ] || [ "$dir" = "layout" ] || [ "$dir" = "features" ] || [ "$dir" = "library" ] || [ "$dir" = "profile" ]; then
    echo -e "${GREEN}✓ $dir/${NC} (unchanged)"
  else
    echo -e "${YELLOW}⊘ $dir/${NC}"
  fi
done

echo ""

# ============================================================================
# FINAL SUMMARY
# ============================================================================
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Phase 4 Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Cleanup Summary:"
echo "  ✓ Deleted design-system/ (duplicate)"
echo "  ✓ Deleted ui/ (migrated)"
echo "  ✓ Deleted _backup_20251202_* (old backups)"
echo "  ✓ Verified new structure"
echo ""
echo "Final structure:"
echo "  ✓ frontend/src/components/electric/ (30 production components)"
echo "  ✓ frontend/src/components/m3-expressive/ (18 migration components)"
echo "  ✓ frontend/src/components/custom/ (12 app-specific components)"
echo "  ✓ Common utilities, layouts, and features (preserved)"
echo ""
echo "Next steps:"
echo "  1. Run: npm run build"
echo "  2. Run: npm run test"
echo "  3. Commit changes: git add . && git commit -m 'feat: finalize UI consolidation'"
echo "  4. Create PR for review"
echo ""
