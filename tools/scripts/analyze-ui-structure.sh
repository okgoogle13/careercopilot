#!/bin/bash
# analyze-ui-structure.sh
# Purpose: Analyze the structure of UI libraries to understand their organization

BASE_DIR="frontend/src/components"
OUTPUT_FILE="ui_structure_report.md"

# Create or clear the output file
echo "# UI Structure Analysis Report\n" > "$OUTPUT_FILE"

echo "🔍 Analyzing UI structure..."

# Function to get component names from a directory
get_components() {
  local dir=$1
  if [ -d "$dir" ]; then
    find "$dir" -type f \( -name "*.tsx" -o -name "*.jsx" \) -not -path "*/node_modules/*" -not -path "*/__tests__/*" | \
    sed -E 's|.*/([^/]+)\.[jt]sx$|\1|' | sort | uniq
  else
    echo "Directory not found: $dir"
  fi
}

# Analyze each UI library
echo "## 🏗️  UI Libraries Structure" >> "$OUTPUT_FILE"

# UI Library
echo "### 1. UI Library (components/ui/)" >> "$OUTPUT_FILE"
if [ -d "$BASE_DIR/ui" ]; then
  echo "#### Components:" >> "$OUTPUT_FILE"
  get_components "$BASE_DIR/ui" | sed 's/^/- /' >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"

  echo "#### Directory Structure:" >> "$OUTPUT_FILE"
  find "$BASE_DIR/ui" -type d -not -path "*/node_modules*" -not -path "*/.git*" -not -path "*/__tests__*" | sort | \
    sed -e 's|[^/]*/|  |g' -e 's|/|/|' >> "$OUTPUT_FILE"
else
  echo "UI library not found at $BASE_DIR/ui" >> "$OUTPUT_FILE"
fi

echo "" >> "$OUTPUT_FILE"

# Electric Library
echo "### 2. Electric Library (components/electric/)" >> "$OUTPUT_FILE"
if [ -d "$BASE_DIR/electric" ]; then
  echo "#### Components:" >> "$OUTPUT_FILE"
  get_components "$BASE_DIR/electric" | sed 's/^/- /' >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"

  echo "#### Directory Structure:" >> "$OUTPUT_FILE"
  find "$BASE_DIR/electric" -type d -not -path "*/node_modules*" -not -path "*/.git*" -not -path "*/__tests__*" | sort | \
    sed -e 's|[^/]*/|  |g' -e 's|/|/|' >> "$OUTPUT_FILE"
else
  echo "Electric library not found at $BASE_DIR/electric" >> "$OUTPUT_FILE"
fi

echo "" >> "$OUTPUT_FILE"

# M3 Library (if exists)
if [ -d "$BASE_DIR/m3" ]; then
  echo "### 3. M3 Library (components/m3/)" >> "$OUTPUT_FILE"
  echo "#### Components:" >> "$OUTPUT_FILE"
  get_components "$BASE_DIR/m3" | sed 's/^/- /' >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"

  echo "#### Directory Structure:" >> "$OUTPUT_FILE"
  find "$BASE_DIR/m3" -type d -not -path "*/node_modules*" -not -path "*/.git*" -not -path "*/__tests__*" | sort | \
    sed -e 's|[^/]*/|  |g' -e 's|/|/|' >> "$OUTPUT_FILE"
fi

echo "\n## 📊 Summary of Components" >> "$OUTPUT_FILE"

# Count components in each library
ui_count=$(get_components "$BASE_DIR/ui" | wc -l | xargs)
electric_count=$(get_components "$BASE_DIR/electric" | wc -l | xargs)

if [ -d "$BASE_DIR/m3" ]; then
  m3_count=$(get_components "$BASE_DIR/m3" | wc -l | xargs)
  echo "- Total UI Components: $ui_count" >> "$OUTPUT_FILE"
  echo "- Total Electric Components: $electric_count" >> "$OUTPUT_FILE"
  echo "- Total M3 Components: $m3_count" >> "$OUTPUT_FILE"

  # Find common components
  echo "\n### Common Components Across Libraries" >> "$OUTPUT_FILE"
  comm -12 <(get_components "$BASE_DIR/ui") <(get_components "$BASE_DIR/electric") | \
    while read -r comp; do
      echo "- $comp (UI & Electric)" >> "$OUTPUT_FILE"
    done

  comm -12 <(get_components "$BASE_DIR/ui") <(get_components "$BASE_DIR/m3") | \
    while read -r comp; do
      echo "- $comp (UI & M3)" >> "$OUTPUT_FILE"
    done

  comm -12 <(get_components "$BASE_DIR/electric") <(get_components "$BASE_DIR/m3") | \
    while read -r comp; do
      echo "- $comp (Electric & M3)" >> "$OUTPUT_FILE"
    done
else
  echo "- Total UI Components: $ui_count" >> "$OUTPUT_FILE"
  echo "- Total Electric Components: $electric_count" >> "$OUTPUT_FILE"

  # Find common components between UI and Electric
  echo "\n### Common Components (UI & Electric)" >> "$OUTPUT_FILE"
  comm -12 <(get_components "$BASE_DIR/ui") <(get_components "$BASE_DIR/electric") | \
    while read -r comp; do
      echo "- $comp" >> "$OUTPUT_FILE"
    done
fi

echo "✅ Analysis complete. Report generated at $OUTPUT_FILE"
