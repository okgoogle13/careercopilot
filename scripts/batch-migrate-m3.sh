#!/bin/bash
# M3 Batch Migration Coordinator
# Guides migration of multiple components using consolidated Claude skills
# Updated 2025-11-28 to use unified skill architecture

COMPONENTS_FILE="${1:-components-to-migrate.txt}"
BATCH_SIZE="${2:-5}"

if [ ! -f "$COMPONENTS_FILE" ]; then
  echo "❌ Error: Components file not found: $COMPONENTS_FILE"
  echo ""
  echo "Usage: ./scripts/batch-migrate-m3.sh <components-file> [batch-size]"
  echo "Example: ./scripts/batch-migrate-m3.sh components-to-migrate.txt 5"
  echo ""
  echo "📋 Sample components-to-migrate.txt:"
  echo "  Button.tsx"
  echo "  Input.tsx"
  echo "  Select.tsx"
  echo "  Card.tsx"
  echo "  Dialog.tsx"
  exit 1
fi

# Read components into array
mapfile -t COMPONENTS < "$COMPONENTS_FILE"
TOTAL=${#COMPONENTS[@]}

echo ""
echo "🚀 M3 BATCH MIGRATION COORDINATOR"
echo "=================================="
echo "Updated 2025-11-28 - Uses Consolidated Skills"
echo ""
echo "📋 Configuration:"
echo "  Components file: $COMPONENTS_FILE"
echo "  Total components: $TOTAL"
echo "  Batch size: $BATCH_SIZE"
echo ""

# Create migration instructions
echo "📖 MIGRATION WORKFLOW (Using Consolidated Skills)"
echo "=================================================="
echo ""
echo "🔧 Available Skills:"
echo "  • m3-layout-tokens - Spacing, sizing, layout"
echo "  • m3-visual-tokens - Colors, shape, elevation"
echo "  • m3-typography-tokens - Type scale, fonts"
echo "  • m3-interaction-tokens - Motion, icons, animations"
echo "  • batch-migration-orchestrator - Coordinates all 4 steps"
echo ""

# Process in batches
BATCH_NUM=1
MIGRATED=0

echo "📦 Batch Processing Plan:"
echo "========================="
echo ""

for ((i=0; i<$TOTAL; i+=$BATCH_SIZE)); do
  echo "Batch $BATCH_NUM (Components $((i+1))-$((i+BATCH_SIZE>TOTAL ? TOTAL : i+BATCH_SIZE))):"
  echo "---"

  # Get batch slice
  BATCH=("${COMPONENTS[@]:$i:$BATCH_SIZE}")
  BATCH_COMPONENTS=""

  for component in "${BATCH[@]}"; do
    # Skip empty lines
    if [ -z "$component" ]; then
      continue
    fi
    if [ -z "$BATCH_COMPONENTS" ]; then
      BATCH_COMPONENTS="$component"
    else
      BATCH_COMPONENTS="$BATCH_COMPONENTS, $component"
    fi
    ((MIGRATED++))
  done

  if [ -n "$BATCH_COMPONENTS" ]; then
    echo "  Ask Claude: \"Migrate $BATCH_COMPONENTS to M3 Expressive\""
    echo ""
    echo "  batch-migration-orchestrator will:"
    echo "    1. Apply m3-layout-tokens (spacing, sizing)"
    echo "    2. Apply m3-visual-tokens (colors, elevation)"
    echo "    3. Apply m3-typography-tokens (fonts, types)"
    echo "    4. Apply m3-interaction-tokens (motion, icons)"
    echo "    5. Validate 100% token compliance"
    echo ""
  fi

  ((BATCH_NUM++))
done

# Summary and next steps
echo "✅ READY FOR MIGRATION"
echo "======================"
echo "Total components to migrate: $TOTAL"
echo "Recommended batches: $((BATCH_NUM-1))"
echo ""
echo "📝 NEXT STEPS:"
echo "1. Use Claude Code to ask:"
echo "   \"Migrate [Component1, Component2, ...] to M3 Expressive\""
echo ""
echo "2. batch-migration-orchestrator will execute 4-step protocol"
echo ""
echo "3. After each batch, verify:"
echo "   - No hardcoded colors (#hex, rgb())"
echo "   - No hardcoded spacing (px values)"
echo "   - All tokens use var(--sys-*) format"
echo "   - TypeScript compilation: yarn build"
echo ""
echo "4. Commit batch changes:"
echo "   git add . && git commit -m 'refactor: M3 migration batch $i to M3 tokens'"
echo ""
echo "📚 Documentation:"
echo "  • M3 Migration Plan: .claude/docs/M3_MIGRATION_PLAN.md"
echo "  • Migration Template: .claude/docs/M3_MIGRATION_TEMPLATE.md"
echo "  • Token Reference: .claude/docs/M3_DESIGN_TOKENS_REFERENCE.md"
echo ""
