#!/bin/bash
# Batch M3 Migration Script
# Migrates multiple components to M3 design tokens in batches

COMPONENTS_FILE="${1:-components-to-migrate.txt}"
BATCH_SIZE="${2:-5}"
DRY_RUN="${3:-false}"

if [ ! -f "$COMPONENTS_FILE" ]; then
  echo "❌ Error: Components file not found: $COMPONENTS_FILE"
  echo ""
  echo "Usage: ./scripts/batch-migrate-m3.sh <components-file> [batch-size] [dry-run]"
  echo "Example: ./scripts/batch-migrate-m3.sh simple-components.txt 5"
  exit 1
fi

# Read components into array
mapfile -t COMPONENTS < "$COMPONENTS_FILE"
TOTAL=${#COMPONENTS[@]}

echo "🚀 M3 Batch Migration"
echo "===================="
echo "Components file: $COMPONENTS_FILE"
echo "Total components: $TOTAL"
echo "Batch size: $BATCH_SIZE"
echo ""

if [ "$DRY_RUN" = "true" ]; then
  echo "⚠️  DRY RUN MODE - No changes will be made"
  echo ""
fi

# Process in batches
BATCH_NUM=1
MIGRATED=0
SKIPPED=0
FAILED=0

for ((i=0; i<$TOTAL; i+=$BATCH_SIZE)); do
  echo "=== Batch $BATCH_NUM ==="
  echo ""

  # Get batch slice
  BATCH=("${COMPONENTS[@]:$i:$BATCH_SIZE}")

  for component in "${BATCH[@]}"; do
    # Skip empty lines
    if [ -z "$component" ]; then
      continue
    fi

    # Full path
    COMPONENT_PATH="frontend/src/components/$component"

    if [ ! -f "$COMPONENT_PATH" ]; then
      echo "⚠️  Skipping (not found): $component"
      ((SKIPPED++))
      continue
    fi

    if [ "$DRY_RUN" = "true" ]; then
      echo "📝 Would migrate: $component"
      ((MIGRATED++))
    else
      # Run migration script
      if python3 scripts/migrate-component-m3.py "$COMPONENT_PATH"; then
        ((MIGRATED++))
      else
        echo "❌ Failed: $component"
        ((FAILED++))
      fi
    fi
    echo ""
  done

  echo "✓ Batch $BATCH_NUM complete"
  echo ""
  ((BATCH_NUM++))
done

# Summary
echo "===================="
echo "📊 Migration Summary"
echo "===================="
echo "Total components: $TOTAL"
echo "Migrated: $MIGRATED"
echo "Skipped: $SKIPPED"
echo "Failed: $FAILED"
echo ""

if [ "$DRY_RUN" != "true" ] && [ $MIGRATED -gt 0 ]; then
  echo "✅ Migration complete!"
  echo ""
  echo "Next steps:"
  echo "  1. Review changes: git diff"
  echo "  2. Run tests: yarn test"
  echo "  3. Commit: git add . && git commit -m 'refactor: migrate batch to M3 tokens'"
else
  echo "ℹ️  No changes made (dry run or no components migrated)"
fi
