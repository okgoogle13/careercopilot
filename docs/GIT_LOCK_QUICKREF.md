# Git Lock Issue - Quick Reference

## 🚨 If You Encounter a Git Lock Error

### Immediate Fix (Local Development)
```bash
# Option 1: Use the cleanup script (recommended)
./scripts/cleanup-git-locks.sh --force

# Option 2: Manual cleanup
find .git -name "*.lock" -type f -delete
git status  # Verify repository is clean
```

### Immediate Fix (GitHub Actions)
The workflows now automatically handle this! The auto-fix workflow includes:
- Pre-workflow lock cleanup
- Retry logic (5 attempts with exponential backoff)
- Automatic pull/rebase on conflicts

## 🔍 Root Causes (Now Fixed)

1. ✅ **Concurrent workflow runs** - Fixed with improved concurrency groups
2. ✅ **Missing retry logic** - Fixed with exponential backoff
3. ✅ **No lock cleanup** - Fixed with pre-workflow and pre-push cleanup
4. ✅ **Race conditions** - Fixed by queuing critical operations

## 📋 What Changed

### Workflows Updated
- `.github/workflows/auto-fix.yml` - Added retry logic and lock cleanup
- `.github/workflows/ci.yml` - Improved concurrency control
- `.github/workflows/deploy.yml` - Queue deployments instead of canceling

### New Tools
- `scripts/cleanup-git-locks.sh` - Manual lock file cleanup script
- `docs/GIT_LOCK_RESOLUTION.md` - Comprehensive documentation

## 🛠️ Quick Commands

```bash
# Check for lock files
find .git -name "*.lock"

# Remove lock files (safe)
./scripts/cleanup-git-locks.sh --force

# Check running git processes
ps aux | grep git

# View workflow logs for git errors
# GitHub UI → Actions → Select failed workflow → Search for "lock"
```

## 📊 Monitoring

### Signs of Lock Issues
- ❌ Workflow fails with "Unable to create index.lock"
- ❌ "Another git process seems to be running"
- ❌ Multiple workflows running on same branch simultaneously

### Verification After Fix
- ✅ Auto-fix workflows complete successfully
- ✅ No "index.lock" errors in workflow logs
- ✅ Concurrent pushes are queued, not rejected
- ✅ Retry logic activates on transient failures

## 🎯 Best Practices

### For Developers
1. If you see a lock error, run: `./scripts/cleanup-git-locks.sh`
2. Don't manually kill git processes unless necessary
3. Let workflows finish before pushing new changes

### For Workflow Maintainers
1. Always use concurrency groups for git operations
2. Implement retry logic for push operations
3. Clean up lock files before critical git commands
4. Queue (not cancel) critical operations like deployments

## 📚 More Information

See `docs/GIT_LOCK_RESOLUTION.md` for:
- Detailed root cause analysis
- Complete solution documentation
- Best practices and patterns
- Testing procedures
- Rollback plans

## ❓ Still Having Issues?

1. Check workflow logs for specific error messages
2. Run the cleanup script: `./scripts/cleanup-git-locks.sh`
3. Verify no stale lock files: `find .git -name "*.lock"`
4. Check for concurrent workflows in GitHub Actions
5. Review concurrency settings in affected workflow
6. Open an issue with logs and reproduction steps

---

**Last Updated**: 2024-02-14
**Status**: All known issues resolved ✅
