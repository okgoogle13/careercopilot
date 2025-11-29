# Scripts Directory Cleanup Plan

## Executive Summary
The `/scripts` directory contains 85+ scripts with significant duplication, redundancy, and obsolescence. This cleanup will reduce the directory by ~60% while maintaining all essential functionality.

## Categories of Issues Found

### 1. HIGH DUPLICATION (Immediate Action Required)

#### Setup Scripts Redundancy:
- `setup-secrets.sh` (6KB) - Unified secrets management
- `setup-secure-credentials.sh` (6KB) - Overlaps with above
- `setup-api-keys.sh` (5KB) - Subset of secrets setup
- **Action**: Consolidate into single `setup-secrets.sh`

#### Deployment Scripts Redundancy:
- `deploy.sh` (8KB) - Main deployment script
- `deploy-production.sh` (3KB) - Redundant wrapper
- `deploy-staging.sh` (2KB) - Redundant wrapper
- **Action**: Remove wrappers, enhance main script

#### M3 Migration Scripts Overlap:
- `migrate-to-m3.py` (9KB) - General migration
- `migrate-component-m3.py` (8KB) - Component-specific
- `batch-migrate-m3.sh` (3KB) - Batch coordinator
- **Action**: Consolidate into unified migration system

#### Firebase Scripts Overlap:
- `setup-firebase.sh` (4KB) - Basic setup
- `setup-careercopilot-firebase.sh` (14KB) - Comprehensive
- `configure-firebase-permissions.sh` (6KB) - Subset
- **Action**: Keep comprehensive, archive others

### 2. OBSOLETE SCRIPTS (Archive)

#### Already Archived (26 scripts):
- Grid migration scripts (MUI v7 migration completed)
- Autofix scripts (issues resolved)
- Personal automation scripts
- **Status**: ✅ Already in `_archived/`

#### Need Archiving:
- `migrate_redis_to_firestore.py` (13KB) - Migration completed
- `switch-to-development.sh` / `switch-to-production.sh` - Replaced by env vars
- `cleanup-old-reports.sh` - One-time cleanup completed
- `archive-stale-docs.sh` - One-time cleanup completed

### 3. VALIDATION SCRIPTS CONSOLIDATION

#### Test/Validation Overlap:
- `test-configuration.py` (17KB) - Comprehensive
- `validate-environment.sh` (6KB) - Subset
- `validate-secrets.sh` (16KB) - Overlaps with production validator
- `test_firebase_secrets.py` (4KB) - Subset
- **Action**: Consolidate into unified validation system

## Cleanup Actions

### Phase 1: Archive Obsolete Scripts
```bash
# Move to _archived/
mv migrate_redis_to_firestore.py _archived/
mv switch-to-development.sh _archived/
mv switch-to-production.sh _archived/
mv cleanup-old-reports.sh _archived/
mv archive-stale-docs.sh _archived/
```

### Phase 2: Consolidate Setup Scripts
```bash
# Keep: setup-secrets.sh (unified)
# Archive: setup-secure-credentials.sh, setup-api-keys.sh
mv setup-secure-credentials.sh _archived/
mv setup-api-keys.sh _archived/
```

### Phase 3: Consolidate Deployment Scripts
```bash
# Keep: deploy.sh (enhanced)
# Archive: deploy-production.sh, deploy-staging.sh
mv deploy-production.sh _archived/
mv deploy-staging.sh _archived/
```

### Phase 4: Consolidate Firebase Scripts
```bash
# Keep: setup-careercopilot-firebase.sh
# Archive: setup-firebase.sh, configure-firebase-permissions.sh
mv setup-firebase.sh _archived/
mv configure-firebase-permissions.sh _archived/
```

### Phase 5: Consolidate Validation Scripts
```bash
# Keep: test-configuration.py, production-secrets-validator.py
# Archive: validate-environment.sh, validate-secrets.sh, test_firebase_secrets.py
mv validate-environment.sh _archived/
mv validate-secrets.sh _archived/
mv test_firebase_secrets.py _archived/
```

## Expected Results

### Before Cleanup:
- 85+ active scripts
- ~500KB total
- High confusion for developers
- Maintenance overhead

### After Cleanup:
- ~35 active scripts
- ~200KB total (60% reduction)
- Clear purpose for each script
- Easier maintenance

## Safety Measures

1. **All scripts archived (not deleted)** - Can be restored if needed
2. **Update CLAUDE.md** with new script references
3. **Test critical scripts** after consolidation
4. **Document consolidated script usage**

## Consolidated Script Index

### Essential Scripts (Keep & Enhance):
1. **deploy.sh** - Unified deployment (staging/production)
2. **setup-secrets.sh** - Unified secrets management
3. **test-configuration.py** - Comprehensive validation
4. **production-secrets-validator.py** - Production secrets
5. **setup-careercopilot-firebase.sh** - Firebase setup
6. **migrate-to-m3.py** - M3 migration (enhanced)
7. **frontend-deployment-readiness.sh** - Frontend validation
8. **vite-bundle-analyzer.sh** - Bundle analysis

### Specialized Scripts (Keep):
- Component generators
- Token builders
- Migration tools
- Agent runners
- Audit tools

## Implementation Timeline

1. **Day 1**: Archive obsolete scripts
2. **Day 2**: Consolidate setup scripts
3. **Day 3**: Consolidate deployment scripts
4. **Day 4**: Update documentation
5. **Day 5**: Test and validate

## Risk Mitigation

- **Low Risk**: All scripts archived, not deleted
- **Rollback Plan**: Can restore from `_archived/` folder
- **Testing**: Verify each consolidated script works
- **Documentation**: Update all references
