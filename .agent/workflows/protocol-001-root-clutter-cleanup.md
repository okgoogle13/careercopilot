---
description: Clean up root-level documentation and configuration files
---

# Protocol 001: Root Clutter Cleanup

**Created**: 2026-01-21  
**Purpose**: Organize root-level files to improve repository navigation and maintainability

## Assessment

The repository root contains 43 files, many of which are documentation or configuration files that could be better organized.

## Cleanup Actions

### 1. Documentation Consolidation
Move user-facing documentation to `docs/`:
- `AGENTS.md` → `docs/guides/AGENTS.md`
- `DEPLOYMENT_READINESS.md` → `docs/deployment/DEPLOYMENT_READINESS.md`
- `HOW_TO_CHECK_MCP_SERVERS.md` → `docs/guides/MCP_SERVER_CHECK.md`
- `MCP_CONFIGURATION_GUIDE.md` → `docs/guides/MCP_CONFIGURATION.md`
- `MCP_TROUBLESHOOTING.md` → `docs/guides/MCP_TROUBLESHOOTING.md`
- `PHASE_6_QUICKSTART.md` → `docs/development/PHASE_6_QUICKSTART.md`
- `QUICK_START.md` → Keep in root (essential quick reference)
- `UAT_CHECKLIST.md` → `docs/testing/UAT_CHECKLIST.md`
- `USER_MANUAL.md` → `docs/USER_MANUAL.md` (keep at docs root)

### 2. Configuration Files
Organize configuration templates:
- `mcp_config.json` → Keep in root (active config)
- `mcp_settings_template.json` → `docs/templates/mcp_settings_template.json`
- `credentials.json.EXAMPLE` → `docs/templates/credentials.json.EXAMPLE`

### 3. Scripts
Move utility scripts to `scripts/`:
- `benchmark_performance.py` → `scripts/benchmark_performance.py`
- `cleanup_repo.sh` → `scripts/cleanup_repo.sh`
- `run_copilot.py` → `scripts/run_copilot.py`
- `start-chrome-extension-api.sh` → `scripts/start-chrome-extension-api.sh`

### 4. Keep in Root
Essential files that should remain:
- `README.md` - Primary entry point
- `QUICK_START.md` - Quick reference
- `package.json` - NPM configuration
- `package-lock.json` - Dependency lock
- `yarn.lock` - Yarn lock
- `Dockerfile` - Container definition
- `docker-compose*.yml` - Container orchestration
- `firebase.json` - Firebase config
- `firestore.rules` - Firestore security
- `storage.rules` - Storage security
- `pytest.ini` - Test configuration
- `setup.cfg` - Python setup
- `vitest.config.ts` - Vitest config
- `.env*` files - Environment configs
- `.gitignore` - Git ignore rules
- `.dockerignore` - Docker ignore rules
- `.editorconfig` - Editor config
- `.firebaserc` - Firebase project config
- `.pre-commit-config.yaml` - Pre-commit hooks
- `.yarnrc.yml` - Yarn config

## Execution Steps

// turbo-all

1. Create target directories if they don't exist:
```bash
mkdir -p docs/guides docs/templates
```

2. Move documentation files:
```bash
mv AGENTS.md docs/guides/
mv DEPLOYMENT_READINESS.md docs/deployment/
mv HOW_TO_CHECK_MCP_SERVERS.md docs/guides/MCP_SERVER_CHECK.md
mv MCP_CONFIGURATION_GUIDE.md docs/guides/MCP_CONFIGURATION.md
mv MCP_TROUBLESHOOTING.md docs/guides/MCP_TROUBLESHOOTING.md
mv PHASE_6_QUICKSTART.md docs/development/
mv UAT_CHECKLIST.md docs/testing/
mv USER_MANUAL.md docs/
```

3. Move configuration templates:
```bash
mv mcp_settings_template.json docs/templates/
mv credentials.json.EXAMPLE docs/templates/
```

4. Move scripts:
```bash
mv benchmark_performance.py scripts/
mv cleanup_repo.sh scripts/
mv run_copilot.py scripts/
mv start-chrome-extension-api.sh scripts/
```

5. Update any references to moved files in documentation and scripts

6. Verify the cleanup:
```bash
ls -lh | grep -E "^-" | wc -l
```

## Expected Outcome

- Root directory reduced from 43 files to ~25 essential files
- Improved discoverability of documentation
- Clearer separation between active configs and templates
- Better organization of utility scripts

## Rollback Plan

If issues arise, all moves can be reversed using:
```bash
git checkout HEAD -- <moved-file>
```
