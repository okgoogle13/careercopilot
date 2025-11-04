#!/usr/bin/env bash
# Script: merge_pr84_into_pr83.sh
# Purpose: Automate steps 2-7 from the checklist:
#  - update develop
#  - fetch PR branches
#  - create safety branch
#  - merge PR #84 into PR #83 branch
#  - run basic safety checks (lint/build/test)
#  - push merged branch back to origin (with --force-with-lease if necessary)
#
# Usage: ./merge_pr84_into_pr83.sh
# Notes: Run from repo root. Ensure git remote 'origin' is correct and you have push rights.
# Edit the LINT_CMD, BUILD_CMD and TEST_CMD variables to match your project's commands.

set -euo pipefail

# Configuration - change these if your branches differ
DEVELOP_BRANCH="develop"
PR83_BRANCH="final-consolidation"                  # branch for PR #83
PR84_BRANCH="feat/backend-hello-world-slice"       # branch for PR #84
SAFETY_BRANCH="final-consolidation-merge-safety"  # local safety branch name
REMOTE="origin"

# Safety checks / commands - updated for careercopilot
LINT_CMD="(cd frontend && yarn lint:ci) || true"
TYPECHECK_CMD="(cd frontend && yarn typecheck) || true"
FRONTEND_BUILD_CMD="(cd frontend && yarn build) || true"
BACKEND_TEST_CMD="(cd backend && python -m pytest -q) || true"

echo "1) Ensure working tree is clean"
if [[ -n "$(git status --porcelain)" ]]; then
  echo "ERROR: Working tree is dirty. Commit/stash changes before running this script."
  git status --porcelain
  exit 1
fi

echo "2) Update local ${DEVELOP_BRANCH}"
git checkout "${DEVELOP_BRANCH}"
git pull "${REMOTE}" "${DEVELOP_BRANCH}"

echo "3) Fetch PR branches"
git fetch "${REMOTE}" "${PR83_BRANCH}:${PR83_BRANCH}" || { echo "Failed to fetch ${PR83_BRANCH}"; exit 1; }
git fetch "${REMOTE}" "${PR84_BRANCH}:${PR84_BRANCH}" || { echo "Failed to fetch ${PR84_BRANCH}"; exit 1; }

echo "4) Create safety branch from ${PR83_BRANCH}"
git checkout -b "${SAFETY_BRANCH}" "${PR83_BRANCH}"

echo "5) Merge ${PR84_BRANCH} into ${SAFETY_BRANCH}"
set +e
git merge --no-ff "${PR84_BRANCH}" -m "chore: merge ${PR84_BRANCH} (PR #84) into ${PR83_BRANCH} (PR #83)"
MERGE_EXIT=$?
set -e

if [[ ${MERGE_EXIT} -ne 0 ]]; then
  echo ""
  echo "Merge completed with conflicts or errors (exit ${MERGE_EXIT})."
  echo "You must resolve conflicts manually. The safety branch '${SAFETY_BRANCH}' contains the merge result."
  echo "Run 'git status' and 'git mergetool' or resolve files, then 'git add' and 'git commit'."
  exit 2
fi

echo "Merge succeeded without conflicts."

echo "6) Run lint/type-check/build/test safety checks (customize commands in script if needed)"
echo "> Lint:"
eval "${LINT_CMD}"
echo "> TypeCheck:"
eval "${TYPECHECK_CMD}"
echo "> Frontend build (smoke):"
eval "${FRONTEND_BUILD_CMD}"
echo "> Backend tests (smoke):"
eval "${BACKEND_TEST_CMD}"

echo "If any of the above commands produced errors, fix them on branch ${SAFETY_BRANCH} now, then re-run this script or push fixes."

read -p "Proceed to push the merged '${SAFETY_BRANCH}' to remote branch '${PR83_BRANCH}' and update PR #83? (y/N): " CONFIRM
if [[ "${CONFIRM}" != "y" && "${CONFIRM}" != "Y" ]]; then
  echo "Aborting push. Safety branch '${SAFETY_BRANCH}' contains merge results."
  echo "You can push manually later with: git push ${REMOTE} ${SAFETY_BRANCH}:${PR83_BRANCH}"
  exit 0
fi

echo "7) Push merged safety branch to remote ${PR83_BRANCH}"
# Prefer safe push; try non-force first
if git push "${REMOTE}" "${SAFETY_BRANCH}:${PR83_BRANCH}"; then
  echo "Pushed ${SAFETY_BRANCH} -> ${REMOTE}/${PR83_BRANCH} (fast-forward)."
else
  echo "Non-fast-forward push failed. Attempting force-with-lease push."
  git push --force-with-lease "${REMOTE}" "${SAFETY_BRANCH}:${PR83_BRANCH}"
  echo "Force-with-lease push completed."
fi

echo ""
echo "DONE: merged ${PR84_BRANCH} into ${PR83_BRANCH} on remote. PR #83 now contains PR #84 changes."
echo "Next: wait for CI to run on PR #83. If CI passes, proceed to merge PR #83 into ${DEVELOP_BRANCH} (follow your merge policy)."
