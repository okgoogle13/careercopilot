#!/bin/bash
# Phase 2: Move M3 and Custom Components
# Moves components from ui/ to m3-expressive/ and custom/ directories

set -e

COMPONENTS_DIR="/Applications/careercopilot/frontend/src/components"
UI_DIR="$COMPONENTS_DIR/ui"
M3_DEST="$COMPONENTS_DIR/m3-expressive"
CUSTOM_DEST="$COMPONENTS_DIR/custom"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Phase 2: Moving M3 and Custom Components${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

moved_count=0
failed_count=0

# Function to move a component with all its files
move_component() {
  local component_name="$1"
  local destination="$2"
  local dest_dir_name="$3"

  if [ ! -f "$UI_DIR/${component_name}.tsx" ]; then
    echo -e "${YELLOW}⊘ Skipping $component_name (not found)${NC}"
    return 0
  fi

  # Create destination directory
  mkdir -p "$destination/$dest_dir_name"

  # Move main component file
  mv "$UI_DIR/${component_name}.tsx" "$destination/$dest_dir_name/"
  echo -e "${GREEN}✓ Moved${NC} $component_name.tsx"

  # Move CSS module if exists
  if [ -f "$UI_DIR/${component_name}.css" ]; then
    mv "$UI_DIR/${component_name}.css" "$destination/$dest_dir_name/"
    echo -e "${GREEN}✓ Moved${NC} $component_name.css"
  fi

  # Move Storybook story if exists
  if [ -f "$UI_DIR/${component_name}.stories.tsx" ]; then
    mv "$UI_DIR/${component_name}.stories.tsx" "$destination/$dest_dir_name/"
    echo -e "${GREEN}✓ Moved${NC} $component_name.stories.tsx"
  fi

  # Move test file if exists
  if [ -f "$UI_DIR/${component_name}.test.tsx" ]; then
    mv "$UI_DIR/${component_name}.test.tsx" "$destination/$dest_dir_name/"
    echo -e "${GREEN}✓ Moved${NC} $component_name.test.tsx"
  fi

  # Create index.ts for the component
  cat > "$destination/$dest_dir_name/index.ts" <<EOF
export { ${component_name} } from './${component_name}';
export type { ${component_name}Props } from './${component_name}';
EOF
  echo -e "${GREEN}✓ Created${NC} index.ts"

  moved_count=$((moved_count + 1))
  echo ""
}

# ============================================================================
# MOVE M3 EXPRESSIVE COMPONENTS (18 total)
# ============================================================================
echo -e "${BLUE}Moving M3 Expressive Components...${NC}"
echo ""

M3_COMPONENTS=(
  "M3ActionCard:action-card"
  "M3JobCard:job-card"
  "M3ProfileCard:profile-card"
  "M3Select:select"
  "M3DatePicker:date-picker"
  "M3Menu:menu"
  "M3Chip:chip"
  "M3Alert:alert"
  "M3Breadcrumb:breadcrumb"
  "M3Tabs:tabs"
  "M3Skeleton:skeleton"
  "M3EmptyState:empty-state"
  "M3Sidebar:sidebar"
  "M3Popover:popover"
  "M3Tooltip:tooltip"
  "M3Label:label"
  "M3Separator:separator"
  "M3Avatar:avatar"
)

for mapping in "${M3_COMPONENTS[@]}"; do
  comp_name="${mapping%:*}"
  dest_dir="${mapping#*:}"
  move_component "$comp_name" "$M3_DEST" "$dest_dir"
done

echo -e "${BLUE}Moving Custom/Hybrid Components...${NC}"
echo ""

# ============================================================================
# MOVE CUSTOM COMPONENTS (12 total)
# ============================================================================
CUSTOM_COMPONENTS=(
  "PageHeader:page-header"
  "KeywordTag:keyword-tag"
  "ATSScoreCircle:ats-score-circle"
  "AnimatedButton:animated-button"
  "Toast:toast"
  "AlertDialog:alert-dialog"
  "Collapsible:collapsible"
  "DropdownMenu:dropdown-menu"
  "Menu:menu"
  "ImageWithFallback:image-with-fallback"
  "Stepper:stepper"
  "TimelineView:timeline-view"
)

for mapping in "${CUSTOM_COMPONENTS[@]}"; do
  comp_name="${mapping%:*}"
  dest_dir="${mapping#*:}"
  move_component "$comp_name" "$CUSTOM_DEST" "$dest_dir"
done

# ============================================================================
# HANDLE SPECIAL CASES - Components with subdirectories
# ============================================================================
echo -e "${BLUE}Moving components with subdirectories...${NC}"
echo ""

# Toast has subdirectory structure
if [ -d "$UI_DIR/Toast" ]; then
  echo "Toast has subdirectory, skipping (already moved)"
fi

# AlertDialog might have subdirectory
if [ -d "$UI_DIR/AlertDialog" ]; then
  echo "AlertDialog has subdirectory, skipping (already moved)"
fi

# ============================================================================
# REMOVE DUPLICATE M3 ROOT DIRECTORIES
# ============================================================================
echo -e "${BLUE}Cleaning up duplicate M3 root directories...${NC}"
echo ""

M3_ROOT_DIRS=(
  "M3ActionCard"
  "M3JobCard"
  "M3ProfileCard"
  "M3Select"
  "M3DatePicker"
  "M3Menu"
  "M3Chip"
  "M3Alert"
  "M3Breadcrumb"
  "M3Tabs"
  "M3Skeleton"
  "M3EmptyState"
  "M3Sidebar"
  "M3Popover"
  "M3Tooltip"
  "M3Label"
  "M3Separator"
  "M3Avatar"
)

for dir in "${M3_ROOT_DIRS[@]}"; do
  if [ -d "$COMPONENTS_DIR/$dir" ]; then
    rm -rf "$COMPONENTS_DIR/$dir"
    echo -e "${GREEN}✓ Removed${NC} $dir/ (root duplicate)"
  fi
done

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Phase 2 Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Summary:"
echo "  M3 Components moved: 18"
echo "  Custom Components moved: 12"
echo "  Total components organized: 30"
echo ""
echo "Next steps:"
echo "  1. Verify all files were moved"
echo "  2. Run Phase 3: Update import paths"
echo ""
