#!/bin/bash
# analyze-ui-libraries.sh
# Purpose: Analyze UI libraries to identify duplicates and suggest consolidation

BASE_DIR="frontend/src/components"
OUTPUT_FILE="ui_analysis_report.md"

# Create or clear the output file
echo "# UI Libraries Analysis Report\n" > "$OUTPUT_FILE"

echo "🔍 Analyzing UI libraries..."

# Function to list components in a directory
list_components() {
  local dir=$1
  find "$dir" -type f \( -name "*.tsx" -o -name "*.jsx" \) -not -path "*/node_modules/*" -not -path "*/__tests__/*" | \
  sed -E 's|.*/([^/]+)\.(tsx|jsx)|\1|' | sort | uniq
}

# List components in each library
UI_COMPONENTS=$(list_components "$BASE_DIR/ui")
ELECTRIC_COMPONENTS=$(list_components "$BASE_DIR/electric")
M3_COMPONENTS=$(list_components "$BASE_DIR/m3" 2>/dev/null || echo "")

# Find common components
echo "## 🧩 Common Components" >> "$OUTPUT_FILE"
echo "The following components exist in multiple libraries:\n" >> "$OUTPUT_FILE"

echo "### UI vs Electric" >> "$OUTPUT_FILE"
comm -12 <(echo "$UI_COMPONENTS") <(echo "$ELECTRIC_COMPONENTS") | while read -r comp; do
  echo "- $comp" >> "$OUTPUT_FILE"
  echo "  - UI: $BASE_DIR/ui/$comp" >> "$OUTPUT_FILE"
  echo "  - Electric: $BASE_DIR/electric/$comp" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
done

if [ -n "$M3_COMPONENTS" ]; then
  echo "### UI vs M3" >> "$OUTPUT_FILE"
  comm -12 <(echo "$UI_COMPONENTS") <(echo "$M3_COMPONENTS") | while read -r comp; do
    echo "- $comp" >> "$OUTPUT_FILE"
    echo "  - UI: $BASE_DIR/ui/$comp" >> "$OUTPUT_FILE"
    echo "  - M3: $BASE_DIR/m3/$comp" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
  done
fi

# Find unique components
echo "## 🆕 Unique Components" >> "$OUTPUT_FILE"

echo "### Only in UI" >> "$OUTPUT_FILE"
comm -23 <(echo "$UI_COMPONENTS") <(echo "$ELECTRIC_COMPONENTS") | while read -r comp; do
  echo "- $comp" >> "$OUTPUT_FILE"
done

echo "\n### Only in Electric" >> "$OUTPUT_FILE"
comm -13 <(echo "$UI_COMPONENTS") <(echo "$ELECTRIC_COMPONENTS") | while read -r comp; do
  echo "- $comp" >> "$OUTPUT_FILE"
done

if [ -n "$M3_COMPONENTS" ]; then
  echo "\n### Only in M3" >> "$OUTPUT_FILE"
  comm -13 <(echo "$UI_COMPONENTS" && echo "$ELECTRIC_COMPONENTS") <(echo "$M3_COMPONENTS") | while read -r comp; do
    echo "- $comp" >> "$OUTPUT_FILE"
  done
fi

echo "\n## 📊 Summary" >> "$OUTPUT_FILE"
echo "- Total UI Components: $(echo "$UI_COMPONENTS" | wc -l)" >> "$OUTPUT_FILE"
echo "- Total Electric Components: $(echo "$ELECTRIC_COMPONENTS" | wc -l)" >> "$OUTPUT_FILE"
[ -n "$M3_COMPONENTS" ] && echo "- Total M3 Components: $(echo "$M3_COMPONENTS" | wc -l)" >> "$OUTPUT_FILE"

echo "✅ Analysis complete. Report generated at $OUTPUT_FILE"
