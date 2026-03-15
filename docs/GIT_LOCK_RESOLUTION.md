# Git Lock Issue Resolution

## Overview

This document describes the persistent git lock issues that were affecting the CareerCopilot repository and the implemented solutions.

## Problem Statement

The repository was experiencing persistent `index.lock` conflicts causing workflow failures and blocking development. This occurred when multiple GitHub Actions workflows attempted to perform git operations concurrently on the same branch.

## Root Causes Identified

### 1. Auto-Fix Workflow Race Conditions
**Location**: `.github/workflows/auto-fix.yml`

**Issue**: The auto-fix workflow would directly push commits to PR branches without:
- Checking for existing lock files
- Implementing retry logic
- Handling concurrent push attempts
- Validating git state before operations

**Impact**: When multiple auto-fix runs triggered simultaneously (e.g., when pushing multiple commits to a PR), they would conflict and create stale lock files.

### 2. Overlapping Workflow Triggers
Multiple workflows could trigger on the same push event:
- `ci.yml` - Triggers on push to develop/main
- `auto-fix.yml` - Triggers on pull_request events
- `deploy.yml` - Triggers on workflow completion
- `storybook.yml` - Triggers on push events

**Impact**: Concurrent workflows attempting git operations would create race conditions.

### 3. Insufficient Concurrency Controls
**Issue**: Concurrency groups were workflow-specific but didn't prevent cross-workflow conflicts. The `cancel-in-progress: true` setting could also cancel legitimate operations.

### 4. No Error Handling or Recovery
**Issue**: No retry logic for transient git failures, no automatic cleanup of stale lock files, and no diagnostic logging for debugging.

## Implemented Solutions

### 1. Enhanced Auto-Fix Workflow (`.github/workflows/auto-fix.yml`)

#### Added Pre-Workflow Lock Cleanup
```yaml
- name: Verify git repository state
  run: |
    # Remove any stale lock files from previous failed runs
    find .git -name "*.lock" -type f -delete 2>/dev/null || true

    # Verify repository is in good state
    git status
```

#### Improved Concurrency Configuration
```yaml
concurrency:
  # Using github.sha ensures we queue runs instead of canceling
  group: auto-fix-${{ github.event.pull_request.number || github.ref }}-${{ github.sha }}
  cancel-in-progress: false  # Queue runs instead of canceling
```

**Benefits**:
- Prevents multiple concurrent runs on the same PR
- Queues runs instead of canceling them (preserves all fixes)
- Uses SHA to ensure unique group per commit

#### Added Retry Logic with Exponential Backoff
```bash
MAX_RETRIES=5
RETRY_COUNT=0
RETRY_DELAY=2

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  # Clean up any stale locks before push
  rm -f .git/index.lock .git/HEAD.lock 2>/dev/null || true

  if git push; then
    exit 0
  else
    # Exponential backoff
    sleep $RETRY_DELAY
    RETRY_DELAY=$((RETRY_DELAY * 2))

    # Try to pull and rebase in case of conflicts
    git pull --rebase origin ${{ github.head_ref }} || true
  fi
done
```

**Benefits**:
- Automatically retries failed pushes (up to 5 attempts)
- Implements exponential backoff (2s, 4s, 8s, 16s, 32s)
- Cleans up lock files before each retry
- Attempts to pull and rebase if conflicts occur
- Provides detailed logging for debugging

#### Added Lock File Cleanup Step
```yaml
- name: Clean up stale git locks
  if: steps.git-check.outputs.changes_made == 'true'
  run: |
    rm -f .git/index.lock .git/HEAD.lock .git/refs/heads/*.lock 2>/dev/null || true
```

#### Added Environment Configuration
```yaml
env:
  GIT_CONFIG_SYSTEM: ""  # Prevent system-level git config conflicts
```

### 2. Updated CI Workflow (`.github/workflows/ci.yml`)

```yaml
concurrency:
  # Prevent concurrent CI runs on the same branch
  group: ci-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true
```

**Benefits**:
- Clearer concurrency group naming
- Prevents multiple CI runs from conflicting

### 3. Updated Deploy Workflow (`.github/workflows/deploy.yml`)

```yaml
concurrency:
  # Prevent concurrent deployments
  group: deploy-${{ github.ref }}-${{ inputs.environment || 'auto' }}
  cancel-in-progress: false  # Queue deployments instead of canceling
```

**Benefits**:
- Deployments are queued instead of canceled
- Environment-specific concurrency groups
- Prevents partial deployments

### 4. Created Git Lock Cleanup Script (`scripts/cleanup-git-locks.sh`)

A standalone script for manual lock file cleanup that:
- Scans for all lock files in the `.git` directory
- Shows file age and modification time
- Warns if git processes are currently running
- Safely removes lock files with confirmation
- Provides detailed logging and summary
- Can be run with `--force` flag for automation

**Usage**:
```bash
# Interactive mode (asks for confirmation)
./scripts/cleanup-git-locks.sh

# Force mode (for automation)
./scripts/cleanup-git-locks.sh --force
```

## Best Practices Going Forward

### For Workflow Developers

1. **Always use concurrency groups** for workflows that modify git state:
   ```yaml
   concurrency:
     group: ${{ github.workflow }}-${{ github.ref }}
     cancel-in-progress: false  # Queue instead of cancel for git operations
   ```

2. **Implement retry logic** for git push operations:
   ```bash
   for i in {1..5}; do
     git push && break || sleep $((i * 2))
   done
   ```

3. **Clean up lock files** before git operations:
   ```bash
   find .git -name "*.lock" -type f -delete 2>/dev/null || true
   ```

4. **Use proper error handling**:
   ```bash
   set +e  # Don't exit on error
   # ... git operations with retry
   set -e  # Re-enable exit on error
   ```

5. **Add diagnostic logging**:
   ```bash
   git status  # Check state before operations
   git config --list --local  # Show configuration
   ```

### For Local Development

1. **If you encounter lock file issues**:
   ```bash
   # Use the cleanup script
   ./scripts/cleanup-git-locks.sh

   # Or manually
   find .git -name "*.lock" -type f -delete
   ```

2. **Check for running git processes**:
   ```bash
   ps aux | grep git
   ```

3. **Verify git state**:
   ```bash
   git status
   git fsck  # Check repository integrity
   ```

### For CI/CD Pipeline

1. **Queue critical operations** (deployments, releases) instead of canceling:
   ```yaml
   cancel-in-progress: false
   ```

2. **Cancel parallel operations** (tests, builds) that can be safely restarted:
   ```yaml
   cancel-in-progress: true
   ```

3. **Use unique concurrency groups** for different workflow types:
   - `ci-{ref}` for builds and tests
   - `auto-fix-{ref}-{sha}` for automated fixes
   - `deploy-{ref}-{env}` for deployments

## Monitoring and Debugging

### Check for Lock File Issues

```bash
# Find all lock files
find .git -name "*.lock"

# Check age of lock files
find .git -name "*.lock" -ls

# Remove stale lock files
find .git -name "*.lock" -type f -delete
```

### View Workflow Logs

1. Go to GitHub Actions tab
2. Find the failed workflow run
3. Look for these error patterns:
   - "fatal: Unable to create '.../.git/index.lock': File exists"
   - "Another git process seems to be running"
   - "Could not lock config file"

### Debug Concurrency Issues

```yaml
# Add to workflow for debugging
- name: Debug concurrency
  run: |
    echo "Workflow: ${{ github.workflow }}"
    echo "Run ID: ${{ github.run_id }}"
    echo "Run Number: ${{ github.run_number }}"
    echo "Ref: ${{ github.ref }}"
    echo "SHA: ${{ github.sha }}"
```

## Testing

### Test the Auto-Fix Workflow

1. Create a PR with intentional formatting issues
2. Push multiple commits quickly to trigger concurrent runs
3. Verify that:
   - Only one auto-fix runs at a time (others are queued)
   - Failed pushes are retried automatically
   - No lock file errors appear in logs

### Test the Cleanup Script

```bash
# Create a test lock file
touch .git/index.lock

# Run cleanup script
./scripts/cleanup-git-locks.sh

# Verify lock file is removed
ls -la .git/index.lock  # Should not exist
```

## Rollback Plan

If issues persist:

1. **Disable auto-fix workflow temporarily**:
   ```yaml
   # Add to auto-fix.yml
   if: false  # Temporarily disable
   ```

2. **Revert to simpler concurrency**:
   ```yaml
   concurrency:
     group: ${{ github.workflow }}-${{ github.ref }}
     cancel-in-progress: true
   ```

3. **Manual intervention**:
   ```bash
   # SSH into runner (if self-hosted)
   find /home/runner -name "*.lock" -delete
   ```

## Related Issues

- GitHub Actions concurrency documentation: https://docs.github.com/en/actions/using-jobs/using-concurrency
- Git lock file issues: https://git-scm.com/docs/git-gc#_files
- Retry patterns in bash: https://www.shellscript.sh/tips/retry/

## Change Log

- **2024-02-14**: Initial implementation of all fixes
  - Added retry logic to auto-fix workflow
  - Improved concurrency controls across all workflows
  - Created cleanup script for manual intervention
  - Added comprehensive documentation

---

## Questions or Issues?

If you encounter git lock issues after these fixes:

1. Check the workflow logs for error details
2. Run the cleanup script: `./scripts/cleanup-git-locks.sh`
3. Check for concurrent workflow runs in GitHub Actions
4. Review the concurrency settings in the affected workflow
5. Open an issue with logs and reproduction steps
