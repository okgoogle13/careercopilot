#!/usr/bin/env bash
# cleanup-merged-branches.sh
# Deletes remote branches that have been merged into restoration-KR-Rage-Figma-v2.0
#
# Usage: bash scripts/cleanup-merged-branches.sh
# Requires: git with push access to the repository

set -euo pipefail

TARGET_BRANCH="restoration-KR-Rage-Figma-v2.0"

# These branches were explicitly merged into restoration-KR-Rage-Figma-v2.0
# as confirmed by merge commits in the branch history:
#   c40b4259 - Merge 'origin/claude/finalize-assets-skills-mzlX9'
#   ba0be597 - Merge 'origin/claude/finalize-assets-skills-98mTq'
#   56538c81 - Merge 'origin/claude/review-component-skills-O9SMw'
#   0128c526 - Merge 'origin/claude/design-migration-status-Tj6t4'
MERGED_BRANCHES=(
  "claude/design-migration-status-Tj6t4"
  "claude/finalize-assets-skills-98mTq"
  "claude/finalize-assets-skills-mzlX9"
  "claude/review-component-skills-O9SMw"
)

echo "=== Branch Cleanup: ${TARGET_BRANCH} ==="
echo ""
echo "The following branches were merged into ${TARGET_BRANCH} and will be deleted:"
for branch in "${MERGED_BRANCHES[@]}"; do
  echo "  - ${branch}"
done
echo ""

read -rp "Proceed with deleting these ${#MERGED_BRANCHES[@]} remote branches? [y/N] " confirm
if [[ "${confirm,,}" != "y" ]]; then
  echo "Aborted."
  exit 0
fi

echo ""
echo "Deleting merged branches..."
failed=()
deleted=()

for branch in "${MERGED_BRANCHES[@]}"; do
  echo -n "  Deleting origin/${branch} ... "
  if git push origin --delete "${branch}" 2>/dev/null; then
    echo "✓ deleted"
    deleted+=("${branch}")
  else
    echo "✗ failed (branch may not exist or already deleted)"
    failed+=("${branch}")
  fi
done

echo ""
echo "=== Summary ==="
echo "Deleted (${#deleted[@]}): ${deleted[*]:-none}"
echo "Failed  (${#failed[@]}): ${failed[*]:-none}"
echo ""
echo "Branches NOT deleted (active / not merged):"
echo "  - KR-Rage-Figma"
echo "  - claude/update-claude-kr-design-NTfe4"
echo "  - develop"
echo "  - feature/northcote-design-update"
echo "  - kerala-rage-branch"
echo "  - main"
echo "  - restoration-KR-Rage-Figma-v2.0 (the target branch - keep)"

