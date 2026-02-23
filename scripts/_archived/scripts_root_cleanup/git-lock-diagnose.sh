#!/usr/bin/env bash

set -euo pipefail

SCRIPT_NAME="$(basename "$0")"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"

if [[ -z "${REPO_ROOT}" ]]; then
  echo "ERROR: ${SCRIPT_NAME} must be run inside a git repository." >&2
  exit 1
fi

cd "${REPO_ROOT}"

LOCK_FILE="${REPO_ROOT}/.git/index.lock"
FSMONITOR_SOCKET_FILE="${REPO_ROOT}/.git/fsmonitor--daemon.ipc"

section() {
  echo
  echo "== $* =="
}

print_file_details_if_exists() {
  local path="$1"
  if [[ -e "${path}" ]]; then
    ls -l "${path}"
  else
    echo "missing: ${path}"
  fi
}

show_lfs_probe() {
  if [[ ! -f ".gitattributes" ]] || ! grep -q "filter=lfs" ".gitattributes"; then
    echo "LFS tracking rules: not detected in .gitattributes"
    return 0
  fi

  if ! command -v git-lfs >/dev/null 2>&1; then
    echo "LFS probe: git-lfs not installed"
    return 0
  fi

  if printf "git-lock-diagnose-lfs-probe\n" | git lfs clean >/dev/null 2>&1; then
    echo "LFS probe: PASS"
  else
    echo "LFS probe: FAIL (git lfs clean could not write temp object)"
  fi
}

section "Repository"
echo "repo_root: ${REPO_ROOT}"
echo "date_utc: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "branch: $(git branch --show-current 2>/dev/null || echo unknown)"
echo "git_version: $(git --version)"
echo "git_lfs_version: $(git lfs version 2>/dev/null || echo unavailable)"

section "Lock Artifacts"
find .git -maxdepth 2 \( -name "*.lock" -o -name "fsmonitor--daemon.ipc" \) -print | sort || true
print_file_details_if_exists "${LOCK_FILE}"
print_file_details_if_exists "${FSMONITOR_SOCKET_FILE}"

if command -v lsof >/dev/null 2>&1 && [[ -f "${LOCK_FILE}" ]]; then
  echo
  echo "lsof_index_lock:"
  lsof "${LOCK_FILE}" || true
fi

section "Git Config"
git config --show-origin --get-regexp '^(core\.fsmonitor|core\.hooksPath|filter\.lfs\.process|filter\.lfs\.clean|filter\.lfs\.smudge|credential\.helper)$' || true

section "Git LFS Environment"
git lfs env 2>/dev/null | grep -E '^(TempDir|LocalMediaDir|Endpoint=|ConcurrentTransfers=|AccessUpload=|AccessDownload=|git config filter\.lfs\.)' || true
show_lfs_probe

section "Current Status Probe"
if git status -sb >/tmp/git-status-probe.log 2>&1; then
  sed -n '1,80p' /tmp/git-status-probe.log
else
  echo "git status failed:"
  sed -n '1,120p' /tmp/git-status-probe.log
fi

section "Environment Signals"
echo "GIT_ASKPASS=${GIT_ASKPASS:-<unset>}"
echo "SSH_AUTH_SOCK=${SSH_AUTH_SOCK:-<unset>}"

section "Recent Logs"
for candidate in /tmp/git-recovery-baseline.log /tmp/git-push-trace.log; do
  if [[ -f "${candidate}" ]]; then
    echo "--- ${candidate} ---"
    tail -n 50 "${candidate}"
  fi
done
