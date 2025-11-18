#!/bin/bash
# Simple Component Inventory - Generate list of all components without ts-morph dependency

echo "📊 Component Inventory Analysis"
echo "================================"
echo ""

FRONTEND_DIR="/home/user/careercopilot/frontend/src/components"

# Count all .tsx files
TOTAL_TSX=$(find "$FRONTEND_DIR" -name "*.tsx" -not -path "*/_deprecated/*" -not -name "*.test.tsx" -not -name "*.stories.tsx" | wc -l)
TOTAL_TESTS=$(find "$FRONTEND_DIR" -name "*.test.tsx" | wc -l)
TOTAL_STORIES=$(find "$FRONTEND_DIR" -name "*.stories.tsx" | wc -l)

echo "📈 Summary Statistics:"
echo "  Total Components: $TOTAL_TSX"
echo "  Test Files: $TOTAL_TESTS"
echo "  Storybook Stories: $TOTAL_STORIES"
echo "  Test Coverage: $(echo "scale=1; $TOTAL_TESTS * 100 / $TOTAL_TSX" | bc)%"
echo "  Storybook Coverage: $(echo "scale=1; $TOTAL_STORIES * 100 / $TOTAL_TSX" | bc)%"
echo ""

# Components by directory
echo "📁 Components by Directory:"
for dir in ui library features career documents layout dashboard profile common auth; do
  if [ -d "$FRONTEND_DIR/$dir" ]; then
    count=$(find "$FRONTEND_DIR/$dir" -name "*.tsx" -not -name "*.test.tsx" -not -name "*.stories.tsx" | wc -l)
    if [ $count -gt 0 ]; then
      echo "  $dir/: $count files"
    fi
  fi
done
echo ""

# Component size categories
echo "📏 Components by Size:"
echo "  Simple (<100 lines):"
find "$FRONTEND_DIR" -name "*.tsx" -not -name "*.test.tsx" -not -name "*.stories.tsx" -not -path "*/_deprecated/*" -exec wc -l {} + | awk '$1 < 100 {print "    " $2 " (" $1 " lines)"}' | head -10
echo "    ... (showing first 10)"
echo ""

echo "  Medium (100-300 lines):"
find "$FRONTEND_DIR" -name "*.tsx" -not -name "*.test.tsx" -not -name "*.stories.tsx" -not -path "*/_deprecated/*" -exec wc -l {} + | awk '$1 >= 100 && $1 < 300 {print "    " $2 " (" $1 " lines)"}' | head -10
echo "    ... (showing first 10)"
echo ""

echo "  Complex (>300 lines):"
find "$FRONTEND_DIR" -name "*.tsx" -not -name "*.test.tsx" -not -name "*.stories.tsx" -not -path "*/_deprecated/*" -exec wc -l {} + | awk '$1 >= 300 {print "    " $2 " (" $1 " lines)")}'
echo ""

# Component duplicates check
echo "🔍 Potential Duplicate Components:"
find "$FRONTEND_DIR" -name "*.tsx" -not -name "*.test.tsx" -not -name "*.stories.tsx" -not -path "*/_deprecated/*" -exec basename {} \; | sort | uniq -d | while read -r basename; do
  echo "  $basename found in:"
  find "$FRONTEND_DIR" -name "$basename" -not -path "*/_deprecated/*" | sed 's/^/    /'
done
echo ""

# Hardcoded values check
echo "🚨 Hardcoded Values Detected:"
echo "  Colors:"
grep -rn "backgroundColor:\s*['\"]#" "$FRONTEND_DIR" --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs echo "    backgroundColor with hex: "
grep -rn "color:\s*['\"]#" "$FRONTEND_DIR" --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs echo "    color with hex: "
echo ""

echo "  Spacing (px values):"
grep -rn "padding:\s*['\"][0-9]" "$FRONTEND_DIR" --include="*.tsx" 2>/dev/null | wc -l | xargs echo "    padding with px: "
grep -rn "margin:\s*['\"][0-9]" "$FRONTEND_DIR" --include="*.tsx" 2>/dev/null | wc -l | xargs echo "    margin with px: "
echo ""

echo "✅ Inventory complete!"
echo ""
echo "📋 Next Steps:"
echo "  1. Review component duplicates"
echo "  2. Audit hardcoded values"
echo "  3. Plan migration priorities"
