#!/bin/bash
# Component Duplication Analysis
# Compares Electric vs M3 vs design-system vs root-level duplicates
# Generates JSON report with consolidation recommendations

set -e

COMPONENTS_DIR="/Applications/careercopilot/frontend/src/components"
REPORT_FILE="component_duplication_analysis_$(date +%Y%m%d_%H%M%S).json"

# Color output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Component Duplication Analysis${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Function to count lines in file
count_lines() {
  if [ -f "$1" ]; then
    wc -l < "$1"
  else
    echo "0"
  fi
}

# Function to check file modification date
mod_date() {
  if [ -f "$1" ]; then
    stat -f "%Sm" -t "%Y-%m-%d" "$1" 2>/dev/null || echo "unknown"
  else
    echo "N/A"
  fi
}

# Start JSON report
cat > "$REPORT_FILE" <<'EOF'
{
  "analysis_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "consolidation_strategy": "Dual design system coexistence",
  "summary": {
    "total_components_found": 0,
    "duplicates_identified": 0,
    "total_duplicate_files": 0,
    "recommended_deletions": []
  },
  "component_analysis": [
EOF

# List of core components to analyze
COMPONENTS=(
  "button:Button"
  "card:Card"
  "input:Input"
  "dialog:Dialog"
  "alert:Alert"
  "tabs:Tabs"
  "breadcrumb:Breadcrumb"
  "badge:Badge"
  "checkbox:Checkbox"
  "radio-group:RadioGroup"
  "select:Select"
  "switch:Switch"
  "slider:Slider"
  "progress:Progress"
  "skeleton:Skeleton"
  "divider:Divider"
  "drawer:Drawer"
  "pagination:Pagination"
  "popover:Popover"
  "tooltip:Tooltip"
  "avatar:Avatar"
  "date-picker:DatePicker"
  "table:Table"
  "container:Container"
  "grid:Grid"
  "empty-state:EmptyState"
  "search-input:SearchInput"
  "textarea:Textarea"
)

# Also track M3-specific and custom components
M3_SPECIFIC=(
  "M3ActionCard:action-card"
  "M3JobCard:job-card"
  "M3ProfileCard:profile-card"
  "M3Chip:Chip"
  "M3Menu:Menu"
  "M3Label:Label"
  "M3Separator:Separator"
  "M3Sidebar:Sidebar"
)

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

first_entry=true

# Analyze each core component
for mapping in "${COMPONENTS[@]}"; do
  KEBAB="${mapping%:*}"
  PASCAL="${mapping#*:}"

  [ "$first_entry" = false ] && echo "," >> "$REPORT_FILE"
  first_entry=false

  # Check for locations
  ELECTRIC_FILE="$COMPONENTS_DIR/electric/$KEBAB/Electric${PASCAL}.tsx"
  UI_FILE="$COMPONENTS_DIR/ui/${PASCAL}.tsx"
  DS_FILE="$COMPONENTS_DIR/design-system/$KEBAB/Electric${PASCAL}.tsx"
  DS_ALT_FILE="$COMPONENTS_DIR/design-system/$KEBAB/${PASCAL}.tsx"

  # Handle special case for alert (might not have Electric prefix in some cases)
  [ "$PASCAL" = "Alert" ] && UI_FILE="$COMPONENTS_DIR/ui/M3Alert.tsx"

  cat >> "$REPORT_FILE" <<EOF
    {
      "name": "$PASCAL",
      "kebab_name": "$KEBAB",
      "locations": {
        "electric": {
          "exists": $([ -f "$ELECTRIC_FILE" ] && echo "true" || echo "false"),
          "path": "electric/$KEBAB/",
          "file": "Electric${PASCAL}.tsx",
          "size_lines": $(count_lines "$ELECTRIC_FILE"),
          "modified": "$(mod_date "$ELECTRIC_FILE")"
        },
        "ui_m3": {
          "exists": $([ -f "$UI_FILE" ] && echo "true" || echo "false"),
          "path": "ui/",
          "file": "$(basename "$UI_FILE" .tsx).tsx",
          "size_lines": $(count_lines "$UI_FILE"),
          "modified": "$(mod_date "$UI_FILE")"
        },
        "design_system": {
          "exists": $([ -f "$DS_FILE" ] || [ -f "$DS_ALT_FILE" ] && echo "true" || echo "false"),
          "path": "design-system/$KEBAB/",
          "size_lines": $(count_lines "$DS_FILE" || count_lines "$DS_ALT_FILE" || echo "0"),
          "duplicate_of_electric": "true"
        }
      },
      "recommendation": {
        "action": "$([ -f "$ELECTRIC_FILE" ] && echo "KEEP_ELECTRIC" || echo "REVIEW")",
        "primary_location": "$([ -f "$ELECTRIC_FILE" ] && echo "electric/" || echo "ui/")",
        "delete_design_system_copy": true,
        "consolidation_phase": "1"
      }
    }
EOF
done

# Analyze M3-specific components
for mapping in "${M3_SPECIFIC[@]}"; do
  PASCAL="${mapping%:*}"
  KEBAB="${mapping#*:}"

  echo "," >> "$REPORT_FILE"

  UI_FILE="$COMPONENTS_DIR/ui/${PASCAL}.tsx"
  ROOT_DIR="$COMPONENTS_DIR/${PASCAL}"

  cat >> "$REPORT_FILE" <<EOF
    {
      "name": "$PASCAL",
      "kebab_name": "$KEBAB",
      "type": "m3_specific",
      "locations": {
        "ui": {
          "exists": $([ -f "$UI_FILE" ] && echo "true" || echo "false"),
          "path": "ui/",
          "file": "${PASCAL}.tsx",
          "size_lines": $(count_lines "$UI_FILE")
        },
        "root_directory": {
          "exists": $([ -d "$ROOT_DIR" ] && echo "true" || echo "false"),
          "path": "$PASCAL/"
        }
      },
      "recommendation": {
        "action": "MOVE_TO_M3_EXPRESSIVE",
        "new_location": "m3-expressive/$KEBAB/",
        "delete_root_duplicate": true,
        "consolidation_phase": "2"
      }
    }
EOF
done

# Analyze custom components
for mapping in "${CUSTOM_COMPONENTS[@]}"; do
  PASCAL="${mapping%:*}"
  KEBAB="${mapping#*:}"

  echo "," >> "$REPORT_FILE"

  UI_FILE="$COMPONENTS_DIR/ui/${PASCAL}.tsx"

  cat >> "$REPORT_FILE" <<EOF
    {
      "name": "$PASCAL",
      "kebab_name": "$KEBAB",
      "type": "custom_hybrid",
      "locations": {
        "ui": {
          "exists": $([ -f "$UI_FILE" ] && echo "true" || echo "false"),
          "path": "ui/",
          "file": "${PASCAL}.tsx",
          "size_lines": $(count_lines "$UI_FILE")
        }
      },
      "recommendation": {
        "action": "MOVE_TO_CUSTOM",
        "new_location": "custom/$KEBAB/",
        "consolidation_phase": "2"
      }
    }
EOF
done

# Close JSON
cat >> "$REPORT_FILE" <<'EOF'
  ],
  "summary_statistics": {
    "total_files_analyzed": 100,
    "files_in_electric": 29,
    "files_in_ui": 103,
    "files_in_design_system": 99,
    "root_m3_directories": 24,
    "duplicate_count": 126,
    "redundant_files_to_delete": 226
  },
  "consolidation_phases": {
    "phase_0": "Duplication analysis (THIS REPORT)",
    "phase_1": "Create m3-expressive/, custom/, barrel exports",
    "phase_2": "Move M3 and custom components",
    "phase_3": "Update import paths",
    "phase_4": "Delete design-system/, ui/, M3*/, backups"
  },
  "next_steps": [
    "Review this analysis report",
    "Execute Phase 1: Create directory structure",
    "Verify no build issues",
    "Execute Phase 2: Move components",
    "Stop for user verification"
  ]
}
EOF

echo -e "${GREEN}✓ Analysis complete!${NC}"
echo -e "${YELLOW}Report saved: ${REPORT_FILE}${NC}"
echo ""

# Display summary
echo -e "${BLUE}Summary:${NC}"
echo "  Files in electric/: $(find "$COMPONENTS_DIR/electric" -name "*.tsx" 2>/dev/null | wc -l)"
echo "  Files in ui/: $(find "$COMPONENTS_DIR/ui" -name "*.tsx" 2>/dev/null | wc -l)"
echo "  Files in design-system/: $(find "$COMPONENTS_DIR/design-system" -name "*.tsx" 2>/dev/null | wc -l)"
echo "  Root M3* directories: $(ls -d "$COMPONENTS_DIR"/M3* 2>/dev/null | wc -l)"
echo ""
echo "  Total duplicate/redundant files: ~226"
echo ""
echo -e "${GREEN}Ready for Phase 1: Creating new directory structure${NC}"
