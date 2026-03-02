#!/usr/bin/env bash
# cleanup-merged-branches.sh
# Final branch consolidation: delete all branches except develop and main.
#
# Context: restoration-KR-Rage-Figma-v2.0 was merged into develop via PR #111.
# All other branches have been reviewed and their work is consolidated into develop.
#
# Usage: bash scripts/cleanup-merged-branches.sh
# Requires: git with push access, or gh CLI authenticated
#
# Branch review summary:
#   claude/design-migration-status-Tj6t4   - included in restoration (33586b26 ancestor)
#   claude/finalize-assets-skills-98mTq    - merged into restoration (ba0be597)
#   claude/finalize-assets-skills-mzlX9    - merged into restoration (c40b4259)
#   claude/review-component-skills-O9SMw   - merged into restoration (56538c81)
#   claude/update-claude-kr-design-NTfe4   - included in restoration (37869e62 ancestor)
#   KR-Rage-Figma                          - older branch, superseded by restoration
#   kerala-rage-branch                     - subset of KR-Rage-Figma, superseded
#   feature/northcote-design-update        - old northcote design work, superseded
#   restoration-KR-Rage-Figma-v2.0        - merged into develop via PR #111

set -euo pipefail

BRANCHES_TO_DELETE=(
  "claude/design-migration-status-Tj6t4"
  "claude/finalize-assets-skills-98mTq"
  "claude/finalize-assets-skills-mzlX9"
  "claude/review-component-skills-O9SMw"
  "claude/update-claude-kr-design-NTfe4"
  "KR-Rage-Figma"
  "kerala-rage-branch"
  "feature/northcote-design-update"
  "restoration-KR-Rage-Figma-v2.0"
)

echo "=== Final Branch Consolidation Cleanup ==="
echo ""
echo "Branches to be deleted (work consolidated into develop):"
for branch in "${BRANCHES_TO_DELETE[@]}"; do
  echo "  - ${branch}"
done
echo ""
echo "Branches to KEEP:"
echo "  - main (production)"
echo "  - develop (active development)"
echo ""

read -rp "Proceed with deleting ${#BRANCHES_TO_DELETE[@]} remote branches? [y/N] " confirm
if [[ "${confirm,,}" != "y" ]]; then
  echo "Aborted."
  exit 0
fi

echo ""
echo "Deleting branches..."
failed=()
deleted=()

for branch in "${BRANCHES_TO_DELETE[@]}"; do
  echo -n "  Deleting origin/${branch} ... "
  if git push origin --delete "${branch}" 2>/dev/null; then
    echo "✓ deleted"
    deleted+=("${branch}")
  else
    echo "✗ skipped (may not exist or already deleted)"
    failed+=("${branch}")
  fi
done

echo ""
echo "=== Summary ==="
echo "Deleted (${#deleted[@]}): ${deleted[*]:-none}"
echo "Skipped (${#failed[@]}): ${failed[*]:-none}"
echo ""
echo "Active branches remaining:"
git branch -r | grep -v 'origin/HEAD' | sed 's|  origin/||'

