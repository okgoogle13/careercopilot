#!/bin/bash
# Audit Hardcoded Values - Find all hardcoded styling values that should use design tokens

COMPONENTS_DIR="/home/user/careercopilot/frontend/src/components"
OUTPUT_FILE="/home/user/careercopilot/HARDCODED_VALUES_AUDIT.txt"

echo "🔍 Hardcoded Values Audit" > "$OUTPUT_FILE"
echo "=========================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "Generated: $(date)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Hardcoded Colors
echo "📌 HARDCODED COLORS" >> "$OUTPUT_FILE"
echo "===================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "backgroundColor with hex colors:" >> "$OUTPUT_FILE"
grep -rn "backgroundColor:\s*['\"]#" "$COMPONENTS_DIR" --include="*.tsx" --include="*.ts" 2>/dev/null | sed 's/^/  /' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "color with hex colors:" >> "$OUTPUT_FILE"
grep -rn "color:\s*['\"]#" "$COMPONENTS_DIR" --include="*.tsx" --include="*.ts" 2>/dev/null | sed 's/^/  /' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "borderColor with hex colors:" >> "$OUTPUT_FILE"
grep -rn "borderColor:\s*['\"]#" "$COMPONENTS_DIR" --include="*.tsx" --include="*.ts" 2>/dev/null | sed 's/^/  /' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Hardcoded Spacing
echo "📌 HARDCODED SPACING (px values)" >> "$OUTPUT_FILE"
echo "================================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "padding with px values:" >> "$OUTPUT_FILE"
grep -rn "padding:\s*['\"][0-9]" "$COMPONENTS_DIR" --include="*.tsx" 2>/dev/null | head -20 | sed 's/^/  /' >> "$OUTPUT_FILE"
echo "  ... (showing first 20)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "margin with px values:" >> "$OUTPUT_FILE"
grep -rn "margin:\s*['\"][0-9]" "$COMPONENTS_DIR" --include="*.tsx" 2>/dev/null | head -20 | sed 's/^/  /' >> "$OUTPUT_FILE"
echo "  ... (showing first 20)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "gap with px values:" >> "$OUTPUT_FILE"
grep -rn "gap:\s*['\"][0-9]" "$COMPONENTS_DIR" --include="*.tsx" 2>/dev/null | head -20 | sed 's/^/  /' >> "$OUTPUT_FILE"
echo "  ... (showing first 20)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Hardcoded Border Radius
echo "📌 HARDCODED BORDER RADIUS" >> "$OUTPUT_FILE"
echo "==========================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "borderRadius with px values:" >> "$OUTPUT_FILE"
grep -rn "borderRadius:\s*['\"][0-9]" "$COMPONENTS_DIR" --include="*.tsx" 2>/dev/null | head -20 | sed 's/^/  /' >> "$OUTPUT_FILE"
echo "  ... (showing first 20)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Summary Statistics
echo "📊 SUMMARY" >> "$OUTPUT_FILE"
echo "==========" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

TOTAL_COLOR=$(grep -r "backgroundColor:\s*['\"]#\|color:\s*['\"]#\|borderColor:\s*['\"]#" "$COMPONENTS_DIR" --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
TOTAL_SPACING=$(grep -r "padding:\s*['\"][0-9]\|margin:\s*['\"][0-9]\|gap:\s*['\"][0-9]" "$COMPONENTS_DIR" --include="*.tsx" 2>/dev/null | wc -l)
TOTAL_RADIUS=$(grep -r "borderRadius:\s*['\"][0-9]" "$COMPONENTS_DIR" --include="*.tsx" 2>/dev/null | wc -l)

echo "Total hardcoded color values: $TOTAL_COLOR" >> "$OUTPUT_FILE"
echo "Total hardcoded spacing values: $TOTAL_SPACING" >> "$OUTPUT_FILE"
echo "Total hardcoded border radius values: $TOTAL_RADIUS" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

TOTAL=$((TOTAL_COLOR + TOTAL_SPACING + TOTAL_RADIUS))
echo "TOTAL HARDCODED VALUES: $TOTAL" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Recommendations
echo "📋 RECOMMENDATIONS" >> "$OUTPUT_FILE"
echo "==================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "1. Replace hardcoded colors with design tokens:" >> "$OUTPUT_FILE"
echo "   BAD:  backgroundColor: '#A78BFA'" >> "$OUTPUT_FILE"
echo "   GOOD: backgroundColor: 'var(--sys-color-primary)'" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "2. Replace hardcoded spacing with design tokens:" >> "$OUTPUT_FILE"
echo "   BAD:  padding: '16px'" >> "$OUTPUT_FILE"
echo "   GOOD: padding: 'var(--sys-space-md)'" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "3. Replace hardcoded radius with design tokens:" >> "$OUTPUT_FILE"
echo "   BAD:  borderRadius: '12px'" >> "$OUTPUT_FILE"
echo "   GOOD: borderRadius: 'var(--sys-shape-radius-lg)'" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Files with most violations
echo "📁 FILES WITH MOST VIOLATIONS (Top 10)" >> "$OUTPUT_FILE"
echo "======================================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

grep -r "backgroundColor:\s*['\"]#\|color:\s*['\"]#\|borderColor:\s*['\"]#\|padding:\s*['\"][0-9]\|margin:\s*['\"][0-9]\|borderRadius:\s*['\"][0-9]" "$COMPONENTS_DIR" --include="*.tsx" 2>/dev/null | \
  cut -d: -f1 | sort | uniq -c | sort -rn | head -10 | sed 's/^/  /' >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "✅ Audit complete! Results saved to: $OUTPUT_FILE" >> "$OUTPUT_FILE"

# Also print to console
cat "$OUTPUT_FILE"

echo ""
echo "💾 Full report saved to: $OUTPUT_FILE"
