#!/bin/bash
# Generate prioritized component migration list

COMPONENTS_DIR="frontend/src/components"
OUTPUT_SIMPLE="simple-components.txt"
OUTPUT_MEDIUM="medium-components.txt"
OUTPUT_COMPLEX="complex-components.txt"

echo "📋 Generating Component Migration Priority List"
echo "================================================"

# Clear output files
> "$OUTPUT_SIMPLE"
> "$OUTPUT_MEDIUM"
> "$OUTPUT_COMPLEX"

# Find all .tsx components (excluding tests, stories, deprecated)
find "$COMPONENTS_DIR" -name "*.tsx" \
  -not -path "*/_deprecated/*" \
  -not -name "*.test.tsx" \
  -not -name "*.stories.tsx" \
  -not -path "*/__tests__/*" \
  -not -path "*/__mocks__/*" | while read -r file; do

  # Get relative path from components directory
  rel_path="${file#$COMPONENTS_DIR/}"

  # Count lines
  lines=$(wc -l < "$file")

  # Categorize by size
  if [ "$lines" -lt 100 ]; then
    echo "$rel_path" >> "$OUTPUT_SIMPLE"
  elif [ "$lines" -lt 300 ]; then
    echo "$rel_path" >> "$OUTPUT_MEDIUM"
  else
    echo "$rel_path" >> "$OUTPUT_COMPLEX"
  fi
done

# Count results
SIMPLE_COUNT=$(wc -l < "$OUTPUT_SIMPLE")
MEDIUM_COUNT=$(wc -l < "$OUTPUT_MEDIUM")
COMPLEX_COUNT=$(wc -l < "$OUTPUT_COMPLEX")
TOTAL=$((SIMPLE_COUNT + MEDIUM_COUNT + COMPLEX_COUNT))

echo ""
echo "✅ Migration lists generated:"
echo "   Simple (<100 lines):   $SIMPLE_COUNT components → $OUTPUT_SIMPLE"
echo "   Medium (100-300 lines): $MEDIUM_COUNT components → $OUTPUT_MEDIUM"
echo "   Complex (>300 lines):   $COMPLEX_COUNT components → $OUTPUT_COMPLEX"
echo "   Total:                  $TOTAL components"
echo ""
echo "Next: Run batch migration with:"
echo "  ./scripts/batch-migrate-m3.sh $OUTPUT_SIMPLE 5"
