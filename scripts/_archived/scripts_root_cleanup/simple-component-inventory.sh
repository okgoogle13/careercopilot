# Check for JSON flag
JSON_MODE=false
if [[ "$1" == "--json" ]]; then
  JSON_MODE=true
fi

if [ "$JSON_MODE" = false ]; then
  echo "📊 Component Inventory Analysis"
  echo "================================"
  echo ""
fi

FRONTEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/frontend/src/components"

# Count all .tsx files
TOTAL_TSX=$(find "$FRONTEND_DIR" -name "*.tsx" -not -path "*/_deprecated/*" -not -name "*.test.tsx" -not -name "*.stories.tsx" | wc -l)
TOTAL_TESTS=$(find "$FRONTEND_DIR" -name "*.test.tsx" | wc -l)
TOTAL_STORIES=$(find "$FRONTEND_DIR" -name "*.stories.tsx" | wc -l)

if [ "$JSON_MODE" = false ]; then
  echo "📈 Summary Statistics:"
  echo "  Total Components: $TOTAL_TSX"
  echo "  Test Files: $TOTAL_TESTS"
  echo "  Storybook Stories: $TOTAL_STORIES"
  echo "  Test Coverage: $(echo "scale=1; $TOTAL_TESTS * 100 / $TOTAL_TSX" | bc)%"
  echo "  Storybook Coverage: $(echo "scale=1; $TOTAL_STORIES * 100 / $TOTAL_TSX" | bc)%"
  echo ""
fi

# Components by directory
if [ "$JSON_MODE" = false ]; then
  echo "📁 Components by Directory:"
fi

for dir in ui library features career documents layout dashboard profile common auth atomic core debug kerala-rage layouts shared; do
  if [ -d "$FRONTEND_DIR/$dir" ]; then
    count=$(find "$FRONTEND_DIR/$dir" -name "*.tsx" -not -name "*.test.tsx" -not -name "*.stories.tsx" | wc -l)
    if [ $count -gt 0 ] && [ "$JSON_MODE" = false ]; then
      echo "  $dir/: $count files"
    fi
  fi
done

if [ "$JSON_MODE" = false ]; then
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
  find "$FRONTEND_DIR" -name "*.tsx" -not -name "*.test.tsx" -not -name "*.stories.tsx" -not -path "*/_deprecated/*" -exec wc -l {} + | awk '$1 >= 300 {print "    " $2 " (" $1 " lines)"}'
  echo ""

  # Component duplicates check
  echo "🔍 Potential Duplicate Components:"
fi

DUPLICATES=$(find "$FRONTEND_DIR" -name "*.tsx" -not -name "*.test.tsx" -not -name "*.stories.tsx" -not -path "*/_deprecated/*" | while read -r file; do
  basename=$(basename "$file")
  if [ "$basename" == "index.tsx" ]; then
    dirname=$(basename "$(dirname "$file")")
    echo "$dirname"
  else
    echo "${basename%.*}"
  fi
done | sort | uniq -d)

if [ "$JSON_MODE" = false ]; then
  echo "$DUPLICATES" | while read -r name; do
    if [ -n "$name" ]; then
      echo "  $name found in multiple locations."
    fi
  done
  echo ""
  echo "🚨 Hardcoded Values Detected:"
fi

# Detection Logic
HC_COLORS=$(grep -rnE "backgroundColor:\s*['\"]#|color:\s*['\"]#|bg-\[#|text-\[#" "$FRONTEND_DIR" --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs)
HC_SPACING=$(grep -rnE "padding:\s*['\"][0-9]|margin:\s*['\"][0-9]|p-\[|m-\[" "$FRONTEND_DIR" --include="*.tsx" 2>/dev/null | wc -l | xargs)
HC_SHADOWS=$(grep -rnE "shadow-\[" "$FRONTEND_DIR" --include="*.tsx" 2>/dev/null | wc -l | xargs)

if [ "$JSON_MODE" = false ]; then
  echo "  Colors (Hex/Tailwind Arbitrary): $HC_COLORS"
  echo "  Spacing (px/Tailwind Arbitrary): $HC_SPACING"
  echo "  Shadows (Tailwind Arbitrary): $HC_SHADOWS"
  echo ""
  echo "✅ Inventory complete!"
  echo ""
else
  # JSON Output
  echo "{"
  echo "  \"total_tsx\": $TOTAL_TSX,"
  echo "  \"total_tests\": $TOTAL_TESTS,"
  echo "  \"total_stories\": $TOTAL_STORIES,"
  echo "  \"hardcoded_colors\": $HC_COLORS,"
  echo "  \"hardcoded_spacing\": $HC_SPACING,"
  echo "  \"hardcoded_shadows\": $HC_SHADOWS,"
  echo "  \"duplicates\": ["
  first=true
  echo "$DUPLICATES" | while read -r name; do
    if [ -n "$name" ]; then
      if [ "$first" = false ]; then echo ","; fi
      echo -n "    \"$name\""
      first=false
    fi
  done
  echo ""
  echo "  ]"
  echo "}"
fi
