# Stage 2: UI-KIT Asset Integration Automation

**Quick Reference Guide for Codex CLI Scripts and Orchestration**

---

## Overview

Stage 2 automates the integration of newly generated UI-KIT assets into the hi-fi wireframes through three coordinated Node.js scripts. This guide covers both standalone script usage and full orchestration.

**Timeline:** ~2-3 minutes to complete all stages
**Prerequisites:** UI-KIT assets generated (7 PNG files in `/frontend/public/assets/ui-kit/`)

---

## Quick Start

### Option 1: Full Orchestration (Recommended)

Execute all three stages with a single command:

```bash
# From project root
./scripts/orchestrate-stage2.sh

# With asset updates (provide paths to newly generated UI-KIT assets)
./scripts/orchestrate-stage2.sh \
  --asset-updates \
  "KR-UI-001=/frontend/public/assets/ui-kit/wheat-paste-tear.png" \
  "KR-UI-002=/frontend/public/assets/ui-kit/halo-disk.png" \
  "KR-UI-003=/frontend/public/assets/ui-kit/screenprint-grit.png" \
  "KR-UI-004=/frontend/public/assets/ui-kit/blueprint-grid.png" \
  "KR-UI-005=/frontend/public/assets/ui-kit/charcoal-paper.png" \
  "KR-UI-006=/frontend/public/assets/ui-kit/blueprint-layout.png" \
  "KR-UI-007=/frontend/public/assets/ui-kit/screenprint-stamp.png"
```

**What happens:**
1. Creates backups of token map, hero registry, and hi-fi blueprints
2. Replaces 23+ TODO[asset] markers with token references
3. Updates token map with asset file paths and bumps version
4. Injects 15+ UI-KIT layers into hero compositions
5. Validates all JSON files and logs results

---

## Individual Script Usage

### Stage 2.1: Replace TODO[asset] Markers

**Purpose:** Replace placeholder comments with canonical token references

**Command (from project root):**

```bash
# From project root
node scripts/kr/replace-asset-tokens.mjs

# Or via npm script (from frontend dir)
cd frontend && npm run kr:replace-markers
```

**Output:**
- 23 markers replaced across 14 hi-fi files
- Semantic matching: "Melbourne Laneway" → `{KR-SOLID-033}`
- Context preserved: Z-index, opacity, placement info retained
- Unmatched markers: reported for manual review

**Files Modified:**
- `/docs/design/hifi/SolidarityLanding-hifi.md`
- `/docs/design/hifi/Authentication-hifi.md`
- `/docs/design/hifi/Onboarding-hifi.md`
- (and 11 others)

**Example Transformation:**

```markdown
# Before
- `// TODO[asset]: Melbourne Laneway substrate (Z-0, 22% opacity)`

# After
- `{KR-SOLID-033}` Melbourne Laneway substrate (Z-0, 22% opacity)
```

---

### Stage 2.2: Update Token Map

**Purpose:** Register new UI-KIT assets in the central token mapping system

**Command (from project root):**

```bash
# Provide asset ID and file path pairs
node scripts/kr/update-token-map.mjs \
  --asset KR-UI-002=/frontend/public/assets/ui-kit/halo-disk.png \
  --asset KR-UI-003=/frontend/public/assets/ui-kit/screenprint-grit.png

# Or via npm script (from frontend dir)
cd frontend && npm run kr:update-tokens -- \
  --asset KR-UI-002=/frontend/public/assets/ui-kit/halo-disk.png
```

**What it does:**
1. Loads `/frontend/public/assets/kr-solidarity-ui-token-map.json`
2. Finds tokens matching the provided asset IDs
3. Updates `path` field with provided file path
4. Changes `status` from `planned` to `ready`
5. Validates DTCG schema compliance
6. Bumps semantic version (1.0.0 → 1.0.1)
7. Updates ISO-8601 timestamp
8. Writes updated file

**Example CLI Format:**

```bash
node scripts/kr/update-token-map.mjs \
  --asset KR-UI-001=/frontend/public/assets/ui-kit/wheat-paste-tear.png \
  --asset KR-UI-002=/frontend/public/assets/ui-kit/halo-disk.png \
  --asset KR-UI-003=/frontend/public/assets/ui-kit/screenprint-grit.png \
  --asset KR-UI-004=/frontend/public/assets/ui-kit/blueprint-grid.png \
  --asset KR-UI-005=/frontend/public/assets/ui-kit/charcoal-paper.png \
  --asset KR-UI-006=/frontend/public/assets/ui-kit/blueprint-layout.png \
  --asset KR-UI-007=/frontend/public/assets/ui-kit/screenprint-stamp.png
```

**Output Example:**

```
📋 Loading token map...
🔄 Applying 7 asset updates...
  ✅ KR-UI-001: /frontend/public/assets/ui-kit/wheat-paste-tear.png
  ✅ KR-UI-002: /frontend/public/assets/ui-kit/halo-disk.png
  ... (5 more)
🔍 Validating DTCG schema...
  ✅ Schema valid
📈 Bumping version...
  ✅ 1.0.0 → 1.0.1
💾 Writing token map...

✅ Token map updated successfully
   - Version: 1.0.1
   - Updated: 2026-02-12T02:23:12.494Z
   - Assets updated: 7
```

---

### Stage 2.3: Inject UI-KIT Layers

**Purpose:** Automatically add UI-KIT layers to hero compositions with proper Z-index stacking

**Command (from project root):**

```bash
# From project root
node frontend/scripts/kr/inject-ui-kit-layers.mjs

# Or via npm script (from frontend dir)
cd frontend && npm run kr:inject-layers
```

**What it does:**
1. Loads hero registry (10 compositions)
2. Applies UI-KIT layer insertion rules:
   - KR-UI-004 (Blueprint Grid) → Z-1.5, multiply blend, 10% opacity
   - KR-UI-003 (Screenprint Grit) → Z-4, overlay blend, 15% opacity
   - KR-UI-002 (Halo Disk) → Z-2, screen blend, 50% opacity
3. Inserts layers after substrate/atmospheric layers
4. Prevents duplicate insertions
5. Validates Z-index compatibility
6. Writes updated hero registry

**Layer Injection Rules:**

| Asset ID | Insert After | Z-Index | Blend Mode | Opacity | Applies To |
|----------|--------------|---------|------------|---------|-----------|
| KR-UI-004 | substrate | 1.5 | multiply | 10% | resistance, cultural, structural |
| KR-UI-003 | atmospheric | 4 | overlay | 15% | * (all compositions) |
| KR-UI-002 | substrate | 2 | screen | 50% | devotional, spiritual |

**Output Example:**

```
📂 Loading hero registry...
  ✅ Loaded 10 compositions

🔄 Injecting UI-KIT layers...
✅ Injected KR-UI-003 into devotional-anchor-hero
✅ Injected KR-UI-002 into devotional-anchor-hero
✅ Injected KR-UI-004 into bhagat-singh-resistance
... (14 more)
  📊 Total injected: 17

🔍 Validating compatibility...
  ✅ All layers compatible

💾 Writing hero registry...
  ✅ Hero registry updated

✅ Layer injection complete!
```

---

## npm Script Shortcuts

Add these commands to `frontend/package.json` for quick invocation:

```bash
# From frontend directory
cd frontend

# Individual scripts
npm run kr:replace-markers    # Stage 2.1
npm run kr:update-tokens      # Stage 2.2 (add --asset args)
npm run kr:inject-layers      # Stage 2.3

# Full orchestration
npm run kr:stage2             # All stages with backups
```

---

## Orchestration Workflow

### Full Execution Flow

```
orchestrate-stage2.sh
├── Pre-flight checks
│   ├── Node.js installed?
│   ├── Scripts exist? (3 files)
│   ├── Token map exists?
│   └── Hero registry exists?
├── Backup critical files
│   ├── kr-solidarity-ui-token-map.json
│   ├── kr-solidarity.hero-registry.json
│   └── All hifi blueprints (14 files)
├── Stage 2.1: Replace markers
│   ├── Execute replace-asset-tokens.mjs
│   ├── Count replacements (23 expected)
│   └── Report unmatched markers (17 expected)
├── Stage 2.2: Update token map
│   ├── Parse --asset-updates arguments
│   ├── Execute update-token-map.mjs
│   ├── Validate DTCG schema
│   └── Verify version bumped
├── Stage 2.3: Inject layers
│   ├── Execute inject-ui-kit-layers.mjs
│   ├── Validate Z-index compatibility
│   └── Verify file written
├── Post-execution validation
│   ├── Token map JSON valid?
│   ├── Hero registry JSON valid?
│   └── Count modified files
└── Summary & Next Steps
```

---

## Error Handling & Rollback

### Automatic Rollback

If any stage fails, the orchestration script automatically restores backups:

**Token Map Update Failure:**
```bash
error "Failed to update token map"
log "Restoring backup from: ${BACKUP_DIR}/kr-solidarity-ui-token-map.json.bak"
cp "${BACKUP_DIR}/kr-solidarity-ui-token-map.json.bak" "$TOKEN_MAP"
```

**Layer Injection Failure:**
```bash
error "Failed to inject UI-KIT layers"
log "Restoring backups..."
cp "${BACKUP_DIR}/kr-solidarity.hero-registry.json.bak" "$HERO_REGISTRY"
```

### Manual Rollback

If issues arise, manually restore from backup:

```bash
# List available backups
ls scripts/backups/

# Restore specific backup
cp scripts/backups/stage2-20260212-132145/kr-solidarity-ui-token-map.json.bak \
   frontend/public/assets/kr-solidarity-ui-token-map.json
```

---

## Validation & Verification

### Verify Token Map Updates

```bash
# Check version was bumped
jq '.version' frontend/public/assets/kr-solidarity-ui-token-map.json

# Check specific asset path
jq '.tokens."kr-asset-halo-disk".path' frontend/public/assets/kr-solidarity-ui-token-map.json

# List all ready assets
jq '.tokens[] | select(.status == "ready")' frontend/public/assets/kr-solidarity-ui-token-map.json
```

### Verify Hero Registry Changes

```bash
# Count layers in first composition
jq '.compositions[0].layers | length' frontend/public/assets/kr-solidarity/kr-solidarity.hero-registry.json

# List all UI-KIT layers
jq '.compositions[].layers[] | select(.type == "ui-kit")' frontend/public/assets/kr-solidarity/kr-solidarity.hero-registry.json

# Check Z-index ordering
jq '.compositions[0].layers | map(.z_index)' frontend/public/assets/kr-solidarity/kr-solidarity.hero-registry.json
```

### Verify Hi-Fi Marker Replacements

```bash
# Count remaining TODO markers
grep -r "TODO\[asset\]" docs/design/hifi/ | wc -l

# List remaining unmatched markers
grep "TODO\[asset\]" docs/design/hifi/*.md | grep -v "KR-SOLID\|KR-UI"
```

---

## Troubleshooting

### Issue: Path errors

**Symptom:** "Hero registry not found"

**Solution:** Verify script paths relative to execution location:
```bash
# Always run from project root
cd /Users/okgoogle13/Desktop/careercopilot
./scripts/orchestrate-stage2.sh
```

### Issue: Asset path format

**Symptom:** "Asset {id} not found in token map"

**Format check:**
```bash
# Correct format
--asset KR-UI-002=/frontend/public/assets/ui-kit/halo-disk.png

# Wrong formats (won't work)
--asset="KR-UI-002=/frontend/public/assets/ui-kit/halo-disk.png"  # No quotes
--asset KR-UI-002 /frontend/public/assets/ui-kit/halo-disk.png   # Space instead of =
```

### Issue: Unmatched markers after Stage 2.1

**Cause:** Semantic matching couldn't find exact pattern match in token map

**Resolution:**
1. Review unmatched markers in log output
2. Manually replace in hi-fi files
3. Use semantic close enough? Use git to apply global find-replace if pattern is consistent

Example:
```bash
# If "[DEPRECATED_STYLE] Motif" appears in multiple places and has no token yet:
# 1. Create issue for new token: KR-UI-008
# 2. Find-replace manually:
find docs/design/hifi/ -name "*.md" -exec sed -i 's/TODO\[asset\]: [DEPRECATED_STYLE] Motif/TODO[PENDING-KR-UI-008]: [DEPRECATED_STYLE] Motif/g' {} \;
# 3. Track for future automation
```

---

## Integration with CI/CD

### Add to GitHub Actions workflow

```yaml
- name: Stage 2 Asset Integration
  run: |
    ./scripts/orchestrate-stage2.sh \
      --asset-updates \
      "KR-UI-001=/frontend/public/assets/ui-kit/wheat-paste-tear.png" \
      "KR-UI-002=/frontend/public/assets/ui-kit/halo-disk.png" \
      "KR-UI-003=/frontend/public/assets/ui-kit/screenprint-grit.png"

- name: Verify Changes
  run: |
    # Ensure all markers replaced
    ! grep -r "TODO\[asset\]" docs/design/hifi/ || exit 1

    # Validate JSON files
    jq . frontend/public/assets/kr-solidarity-ui-token-map.json > /dev/null
    jq . frontend/public/assets/kr-solidarity/kr-solidarity.hero-registry.json > /dev/null

    # Check version bumped
    NEW_VERSION=$(jq -r '.version' frontend/public/assets/kr-solidarity-ui-token-map.json)
    echo "Token map updated to version: $NEW_VERSION"
```

---

## Next Steps

After Stage 2 completes successfully:

1. **Commit Changes**
   ```bash
   git add .
   git commit -m "chore(stage2): complete asset integration automation"
   ```

2. **Review Modifications**
   ```bash
   git diff HEAD~1 docs/design/hifi/
   git diff HEAD~1 frontend/public/assets/
   ```

3. **Proceed to Stage 3**
   - Generate interactive mockups from updated hi-fi blueprints
   - Use ui-design-evaluator skill
   - Validate mockups against 400-point scoring system

4. **Build Wave 4 Components**
   - Use updated specs from Stage 3
   - Implement React components with kenya-rage tokens
   - Test against mockups

---

## Reference Files

| File | Purpose |
|------|---------|
| `scripts/kr/replace-asset-tokens.mjs` | Semantic marker replacement logic |
| `scripts/kr/update-token-map.mjs` | Token map synchronization |
| `frontend/scripts/kr/inject-ui-kit-layers.mjs` | Hero composition enhancement |
| `scripts/orchestrate-stage2.sh` | Full orchestration wrapper |
| `frontend/package.json` | npm script shortcuts |
| `frontend/public/assets/kr-solidarity-ui-token-map.json` | Central asset mapping |
| `frontend/public/assets/kr-solidarity/kr-solidarity.hero-registry.json` | Hero compositions |
| `docs/design/hifi/*.md` | Hi-fi blueprints (14 files) |

---

## Quick Reference: Asset Token IDs

**Ready Assets (KR-SOLID series):**
- `KR-SOLID-033` - Melbourne Laneway (substrate)
- `KR-SOLID-011` - Abstract Solidarity (atmospheric)
- `KR-SOLID-029` - Paint Splash (atmospheric)

**Planned Assets (KR-UI series):**
- `KR-UI-001` - Wheat Paste Tear (decorative)
- `KR-UI-002` - Halo Disk (overlay markers)
- `KR-UI-003` - Screenprint Grit (particles)
- `KR-UI-004` - Blueprint Grid (structural)
- `KR-UI-005` - Charcoal Paper (substrate variant)
- `KR-UI-006` - Blueprint Layout (overlay)
- `KR-UI-007` - Screenprint Stamp (badge)

---

**Last Updated:** 2026-02-12
**Version:** 1.0.0
**Status:** Production Ready ✅
