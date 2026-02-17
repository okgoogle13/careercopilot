#!/usr/bin/env bash

set -euo pipefail

SCRIPT_NAME="$(basename "$0")"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"

if [[ -z "${REPO_ROOT}" ]]; then
  echo "ERROR: ${SCRIPT_NAME} must be run inside a git repository." >&2
  exit 1
fi

cd "${REPO_ROOT}"

INDEX_LOCK_FILE="${REPO_ROOT}/.git/index.lock"
FSMONITOR_SOCKET_FILE="${REPO_ROOT}/.git/fsmonitor--daemon.ipc"
LFS_TMP_DIR="${REPO_ROOT}/.git/lfs/tmp"

usage() {
  cat <<'EOF'
Usage:
  ./scripts/git-safe.sh preflight
  ./scripts/git-safe.sh repair
  ./scripts/git-safe.sh add [git-add-args...]
  ./scripts/git-safe.sh commit [git-commit-args...]
  ./scripts/git-safe.sh push [git-push-args...]
  ./scripts/git-safe.sh status

Notes:
  - preflight: checks stale locks, fsmonitor, and LFS health.
  - repair: rebuilds local LFS temp runtime and reinstalls local LFS hooks.
  - add: runs preflight, then git add (defaults to -A when no args).
  - commit: runs preflight, then git commit with provided args.
  - push: runs preflight, then git push with GIT_ASKPASS unset.
EOF
}

info() {
  echo "[git-safe] $*"
}

warn() {
  echo "[git-safe] WARN: $*" >&2
}

fail() {
  echo "[git-safe] ERROR: $*" >&2
  exit 1
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

is_lfs_repo() {
  [[ -f "${REPO_ROOT}/.gitattributes" ]] && grep -q "filter=lfs" "${REPO_ROOT}/.gitattributes"
}

enforce_repo_fsmonitor_setting() {
  local current
  current="$(git config --local --get --bool core.fsmonitor || echo "false")"
  if [[ "${current}" == "true" ]]; then
    git config --local core.fsmonitor false
    info "Set local git config core.fsmonitor=false"
  fi

  if [[ -e "${FSMONITOR_SOCKET_FILE}" ]]; then
    rm -f "${FSMONITOR_SOCKET_FILE}" || true
    info "Removed stale fsmonitor socket file: .git/fsmonitor--daemon.ipc"
  fi
}

remove_stale_index_lock() {
  if [[ ! -f "${INDEX_LOCK_FILE}" ]]; then
    return 0
  fi

  if command_exists lsof; then
    local holders
    holders="$(lsof "${INDEX_LOCK_FILE}" 2>/dev/null || true)"
    if [[ -n "${holders}" ]]; then
      fail "index.lock is currently held by an active process. Wait for git to finish, or stop that process."
    fi
  else
    fail "index.lock exists and lsof is unavailable; refusing unsafe automatic removal."
  fi

  rm -f "${INDEX_LOCK_FILE}"
  info "Removed stale lock file: .git/index.lock"
}

ensure_lfs_tmp_dir() {
  mkdir -p "${LFS_TMP_DIR}"
  if [[ ! -w "${LFS_TMP_DIR}" ]]; then
    fail "LFS temp directory is not writable: ${LFS_TMP_DIR}"
  fi
}

probe_lfs_clean() {
  if ! is_lfs_repo; then
    return 0
  fi

  if ! command_exists git-lfs; then
    fail "Repository uses Git LFS but git-lfs is not installed or not on PATH."
  fi

  ensure_lfs_tmp_dir

  if ! printf "git-safe-lfs-probe\n" | git lfs clean >/dev/null 2>&1; then
    fail "git lfs clean probe failed. Run: ./scripts/git-safe.sh repair"
  fi
}

preflight() {
  remove_stale_index_lock
  enforce_repo_fsmonitor_setting
  probe_lfs_clean
  info "Preflight checks passed."
}

repair_lfs_runtime() {
  if ! is_lfs_repo; then
    info "No LFS tracking rules detected in .gitattributes. Nothing to repair."
    return 0
  fi

  if ! command_exists git-lfs; then
    fail "git-lfs is required for repair in an LFS-enabled repository."
  fi

  rm -rf "${LFS_TMP_DIR}"
  mkdir -p "${LFS_TMP_DIR}"
  git lfs install --local --force >/dev/null
  info "Rebuilt .git/lfs/tmp and reinstalled local LFS hooks."
}

run_add() {
  if [[ "$#" -eq 0 ]]; then
    git add -A
  else
    git add "$@"
  fi
}

run_commit() {
  if [[ "$#" -eq 0 ]]; then
    fail "commit requires arguments, for example: ./scripts/git-safe.sh commit -m \"message\""
  fi
  git commit "$@"
}

run_push() {
  env -u GIT_ASKPASS git push "$@"
}

main() {
  local command="${1:-}"

  if [[ -z "${command}" ]]; then
    usage
    exit 1
  fi

  shift || true

  case "${command}" in
    preflight)
      preflight
      ;;
    repair)
      repair_lfs_runtime
      preflight
      ;;
    add)
      preflight
      run_add "$@"
      ;;
    commit)
      preflight
      run_commit "$@"
      ;;
    push)
      preflight
      run_push "$@"
      ;;
    status)
      preflight
      git status -sb
      ;;
    *)
      usage
      exit 1
      ;;
  esac
}

main "$@"
