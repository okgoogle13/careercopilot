# Repository Size Analysis

**Date**: February 16, 2026  
**Total Working Tree Size**: 1.4GB (excluding .git: 877MB)  
**Git Repository Size**: 877MB

## Executive Summary

The working tree is large (1.4GB) primarily due to **design assets and images**. Over 1GB of space is consumed by PNG/JPEG files across multiple directories, with significant duplication between `assets/` and `frontend/public/assets/`.

### Quick Stats
- **783MB** - Total git-tracked files
- **1.4GB** - Working tree size
- **465** - Tracked image files
- **~400** - Duplicate or uncategorized assets

## Detailed Breakdown

### 1. Frontend Directory (744MB)

```
frontend/public/assets/     650MB  ← Primary space consumer
├── uncategorized/          258MB  (148 image files)
├── _triage/                170MB  (triage/staging area)
├── kr-solidarity/          147MB  (design system assets)
├── plates/                  26MB  (wallpaper plates)
├── fauna/                   21MB  (Australian fauna specimens)
├── textures/                16MB  (texture assets)
└── specimens/               13MB  (specimen images)

frontend/src/               92MB
└── assets/                  (additional asset copies)
```

**Issues:**
- Many large PNG files (18-23MB each)
- Duplicate assets across directories
- Uncategorized assets not cleaned up
- Triage directory still present in public/

### 2. Assets Directory (546MB)

```
assets/                     546MB
├── uncategorized/          468MB  (59 PNG files @ 14-23MB each)
├── plates/                  26MB
├── fauna/                   21MB
├── textures/                14MB
├── specimens/               13MB
└── ui/                     5.5MB
```

**Issues:**
- 468MB of uncategorized assets (49 PNG files)
- Significant overlap with frontend/public/assets/
- Large individual files (18-23MB per PNG)
- No compression or optimization

### 3. Documentation (42MB)

```
docs/                       42MB
```

Contains extensive markdown documentation, likely includes embedded images.

### 4. Purge Directory (36MB)

```
purge/                      36MB  ← Should be cleaned up
```

Cleanup artifacts that should not be in the repository.

### 5. Other Directories

```
archive/                    4.5MB
asset-packages/             3.9MB
scripts/                    2.2MB
backend/                    2.2MB
```

## Duplicate Assets Identified

### Critical Duplicates (23MB each)

1. **Wallpaper Assets** (3 copies):
   - `assets/plates/northcote-curio-wallpaper.png` (23MB)
   - `frontend/public/assets/plates/northcote-curio-wallpaper.png` (23MB)
   - `frontend/src/assets/textures/wallpaper.png` (23MB)

2. **Kookaburra Specimen** (2+ copies):
   - `assets/fauna/northcote-sentry-kookaburra.png` (21MB)
   - `frontend/public/assets/fauna/northcote-sentry-kookaburra.png` (21MB)
   - `frontend/src/assets/specimens/sentry_kookaburra.png` (21MB)

3. **Abstract Assets** (multiple copies):
   - `frontend/public/assets/kr-solidarity/abstract/` (21MB)
   - `frontend/public/assets/_triage/keep/` (21MB)
   - `frontend/src/assets/KrMotifs/` (21MB)

### Total Potential Space Savings from Deduplication
**Estimated: 200-300MB** (by eliminating duplicates and keeping single canonical versions)

## Git LFS Analysis

### Files That Should Use Git LFS

Currently, **465 image files** are tracked in git. Files over 1MB should ideally use Git LFS:

**Large Files (>10MB):**
- 30+ PNG files @ 18-23MB each = **~600MB**
- Wallpapers, specimens, design assets

**Candidates for Git LFS:**
```
*.png > 5MB
*.jpg > 5MB  
*.jpeg > 5MB
Design system assets in frontend/public/assets/
Uncategorized assets in assets/uncategorized/
```

### Current Git LFS Usage
**None** - Git LFS is not currently configured for this repository.

## Optimization Recommendations

### Immediate Actions (High Impact)

#### 1. Clean Up Purge Directory (-36MB)
```bash
# Remove cleanup artifacts
rm -rf purge/
```
**Savings**: 36MB

#### 2. Remove Uncategorized Assets (-468MB)
```bash
# Move to external storage or Git LFS
# Delete from repository after migration
rm -rf assets/uncategorized/
rm -rf frontend/public/assets/uncategorized/
```
**Savings**: ~700MB total

#### 3. Deduplicate Assets (-200-300MB)
Create canonical asset locations:
- Keep design assets in `frontend/public/assets/` only
- Remove duplicates from `assets/` and `frontend/src/assets/`
- Use symbolic links or import references instead

**Savings**: 200-300MB

#### 4. Remove Triage Directory (-170MB)
```bash
# Move completed triage to proper categories
# Remove staging area from public/
rm -rf frontend/public/assets/_triage/
```
**Savings**: 170MB

**Total Immediate Savings: 1GB+** (reduces working tree to ~400MB)

### Medium-Term Actions

#### 5. Implement Git LFS
```bash
# Install Git LFS
git lfs install

# Track large assets
git lfs track "*.png"
git lfs track "*.jpg"
git lfs track "*.jpeg"
git lfs track "frontend/public/assets/**/*.png"
git lfs track "assets/**/*.png"

# Migrate existing files
git lfs migrate import --include="*.png,*.jpg,*.jpeg" --above=5MB
```

**Benefits:**
- Repository clone becomes faster (~100MB vs 1.4GB)
- Only download assets when needed
- Better CI/CD performance
- Reduced storage costs

#### 6. Optimize Image Sizes
```bash
# Use tools like imagemagick or sharp
convert input.png -quality 85 -strip output.png
```

**Example optimizations:**
- 23MB wallpaper → 5-8MB (PNG optimization)
- 21MB specimens → 3-5MB (appropriate resolution)

**Potential Savings**: 50-70% file size reduction

#### 7. Update .gitignore

Add to `.gitignore`:
```gitignore
# Large design assets (use Git LFS instead)
assets/uncategorized/
frontend/public/assets/_triage/
frontend/public/assets/uncategorized/

# Cleanup artifacts
purge/

# Generated or temporary assets
*.png.bak
*.jpg.bak
*-optimized.png
```

### Long-Term Strategy

#### 8. Asset Management System
- Use CDN for production assets
- Keep only source files in repository
- Generate optimized versions during build
- Version control through asset manifest JSON files

#### 9. Repository Cleanup
```bash
# Remove files from git history
git filter-repo --path purge/ --invert-paths
git filter-repo --path assets/uncategorized/ --invert-paths

# Force push (coordinate with team)
git push --force
```

**Warning**: This rewrites history. Coordinate with all contributors.

## Impact Analysis

### Current State
| Metric | Value |
|--------|-------|
| Working Tree | 1.4GB |
| Git Tracked | 783MB |
| Clone Time | ~5-10 minutes |
| CI Build Time | Slow (large checkout) |

### After Immediate Optimizations
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Working Tree | 1.4GB | ~400MB | -71% |
| Git Tracked | 783MB | ~300MB | -62% |
| Clone Time | 5-10 min | 2-3 min | -60% |
| CI Build Time | Slow | Fast | Significant |

### After Git LFS Migration
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Working Tree | 1.4GB | ~100MB | -93% |
| Initial Clone | 1.4GB | ~50MB | -96% |
| Asset Download | Automatic | On-demand | Flexible |

## Action Plan

### Phase 1: Cleanup (1 hour)
- [ ] Remove `purge/` directory
- [ ] Clean up uncategorized assets
- [ ] Remove `_triage/` directory
- [ ] Update .gitignore

### Phase 2: Deduplication (2 hours)
- [ ] Identify all duplicates
- [ ] Create canonical asset locations
- [ ] Update import paths in code
- [ ] Remove duplicate files

### Phase 3: Git LFS Migration (4 hours)
- [ ] Install and configure Git LFS
- [ ] Migrate large files (>5MB)
- [ ] Update documentation
- [ ] Test cloning and CI/CD

### Phase 4: Optimization (ongoing)
- [ ] Implement image optimization pipeline
- [ ] Set up CDN for production assets
- [ ] Create asset manifest system
- [ ] Regular cleanup audits

## Monitoring

### Health Metrics
```bash
# Check repository size
du -sh .git
du -sh . --exclude=.git

# Count large files
find . -type f -size +10M -not -path "./.git/*" | wc -l

# Check for duplicates
fdupes -r assets/ frontend/public/assets/
```

### Regular Audits
- **Weekly**: Check for new uncategorized assets
- **Monthly**: Review asset sizes and duplicates
- **Quarterly**: Optimize and compress assets

## Conclusion

The repository is large primarily due to **unoptimized design assets**. The main issues are:

1. ❌ **No Git LFS** - Large binaries tracked directly
2. ❌ **Duplicate assets** - Same files in multiple locations
3. ❌ **Unoptimized images** - PNG files at 18-23MB each
4. ❌ **Uncategorized assets** - 700MB+ of unorganized files
5. ❌ **Cleanup artifacts** - 36MB in purge/ directory

**Recommended Priority**: 
1. Immediate cleanup (remove purge/, uncategorized/)
2. Implement Git LFS for remaining large assets
3. Deduplicate and optimize images
4. Set up automated asset management

**Expected Results**:
- 📉 Working tree: 1.4GB → 100-400MB
- ⚡ Clone time: 10 min → 2-3 min
- 🚀 CI/CD performance: Significantly improved
- 💰 Storage costs: Reduced by 70-90%

---

**Tools Available**:
- `bash scripts/git-health-check.sh` - Repository health monitoring
- `docs/GIT_HEALTH_CHECK.md` - Diagnostic procedures

**Next Steps**: Review this analysis and approve cleanup phases.
