#!/bin/bash
# Cleanup redundant files and backup directories

set -e

REPO_ROOT="/Applications/careercopilot"
FRONTEND_DIR="$REPO_ROOT/frontend"

echo "🧹 Cleaning up redundant files..."
echo ""

# Remove backup directories
echo "Removing backup directories..."
rm -rf "$FRONTEND_DIR/.migration_backup"
rm -rf "$REPO_ROOT/verified_backups"
rm -rf "$REPO_ROOT/backups"
echo "✓ Backup directories removed"

# Remove temp/bak files
echo "Removing .bak and .tmp files..."
find "$FRONTEND_DIR/src" -name "*.bak" -o -name "*.tmp" | while read f; do
  rm -f "$f"
  echo "  ✓ Deleted: $(basename $f)"
done

# Remove analysis report
echo "Removing analysis report..."
rm -f "$REPO_ROOT/component_duplication_analysis_*.json"
echo "✓ Analysis reports removed"

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "What remains safe:"
echo "  ✓ Migration scripts in /scripts/ (reference only)"
echo "  ✓ All component code consolidated and organized"
echo "  ✓ CLAUDE.md updated with new architecture"
echo ""
