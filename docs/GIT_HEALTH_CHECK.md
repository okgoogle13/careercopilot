# Git Repository Health Check

## Overview
This document provides guidance for diagnosing and resolving git repository issues, including "short read" errors.

## Common Git Issues

### Short Read Errors
"Short read" errors typically indicate:
- **Network interruption** during clone/fetch operations
- **Corrupted pack files** due to incomplete downloads
- **Disk I/O errors** during git operations
- **Large file transfer issues** (especially with shallow clones)

## Diagnostic Commands

### Quick Health Check
```bash
# Check repository status
git status

# Verify repository integrity
git fsck --full

# Check object database
git count-objects -v

# Verify pack files
git verify-pack -v .git/objects/pack/*.idx
```

### Deep Diagnostics
```bash
# Verbose integrity check
git fsck --full --verbose

# Check reflog for anomalies
git reflog

# Verify all references
git show-ref --verify refs/heads/main

# Check for dangling objects
git fsck --lost-found
```

## Resolution Steps

### If Short Read Errors Occur

1. **Verify Network Stability**
   ```bash
   # Test connection to GitHub
   ping github.com
   curl -I https://github.com
   ```

2. **Re-clone Repository**
   ```bash
   # Backup current work
   git bundle create backup.bundle --all
   
   # Fresh clone
   git clone https://github.com/okgoogle13/careercopilot.git
   cd careercopilot
   
   # Restore work if needed
   git pull /path/to/backup.bundle
   ```

3. **Repair Corrupted Objects**
   ```bash
   # Remove corrupted pack files (if identified)
   rm .git/objects/pack/pack-*.pack
   rm .git/objects/pack/pack-*.idx
   
   # Re-fetch from remote
   git fetch --all
   
   # Rebuild pack files
   git gc --aggressive --prune=now
   ```

4. **Convert Shallow to Full Clone**
   ```bash
   # If using shallow clone (--depth=1)
   git fetch --unshallow
   ```

### Preventive Measures

1. **Increase Git Buffer Size**
   ```bash
   git config --global http.postBuffer 524288000
   git config --global http.lowSpeedLimit 0
   git config --global http.lowSpeedTime 999999
   ```

2. **Enable Compression**
   ```bash
   git config --global core.compression 0
   ```

3. **Use SSH Instead of HTTPS**
   ```bash
   git remote set-url origin git@github.com:okgoogle13/careercopilot.git
   ```

## Automated Health Check

Use the provided `scripts/git-health-check.sh` script:
```bash
./scripts/git-health-check.sh
```

## CI/CD Integration

Add health checks to your CI pipeline:
```yaml
- name: Git Health Check
  run: |
    git fsck --full
    git gc --auto
```

## Repository Statistics (Current)

Based on investigation performed on 2026-02-16:
- **Repository Size**: 877MB
- **Objects in Pack**: 4,360
- **Pack File Size**: 876MB
- **Clone Type**: Shallow (depth=1)
- **Health Status**: ✅ Healthy (no corruption detected)

## Troubleshooting Large Repositories

For repositories > 500MB:
1. Consider using Git LFS for large binary files
2. Use shallow clones for CI/CD: `git clone --depth=1`
3. Implement `.gitignore` for build artifacts and node_modules
4. Regular maintenance: `git gc --aggressive`

## Support

If issues persist:
1. Run full diagnostics: `./scripts/git-health-check.sh --verbose`
2. Check GitHub status: https://www.githubstatus.com/
3. Review GitHub Actions logs for specific error messages
4. Consider disk space: `df -h`

## References

- [Git Documentation - git-fsck](https://git-scm.com/docs/git-fsck)
- [GitHub Guide - Dealing with Large Repositories](https://docs.github.com/en/repositories/working-with-files/managing-large-files)
- [Git Internals - Packfiles](https://git-scm.com/book/en/v2/Git-Internals-Packfiles)
