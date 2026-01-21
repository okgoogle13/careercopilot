---
description: Verify frontend build integrity and configuration
---

# Build 001: Frontend Verification

**Created**: 2026-01-21  
**Purpose**: Comprehensive frontend build verification and health check

## Verification Steps

// turbo-all

### 1. Dependency Check
```bash
cd frontend && npm list --depth=0
```

### 2. TypeScript Configuration Validation
```bash
cd frontend && npx tsc --noEmit --pretty
```

### 3. Lint Check
```bash
cd frontend && npm run lint
```

### 4. Build Verification
```bash
cd frontend && npm run build
```

### 5. Build Output Analysis
```bash
cd frontend && ls -lh dist/
```

### 6. Asset Verification
```bash
cd frontend && find dist/assets -type f | wc -l
```

### 7. Bundle Size Check
```bash
cd frontend && du -sh dist/
```

### 8. Preview Server Test
```bash
cd frontend && npm run preview &
sleep 5
curl -I http://localhost:4173
pkill -f "vite preview"
```

## Success Criteria

- ✅ All dependencies installed without errors
- ✅ TypeScript compilation succeeds with no errors
- ✅ Linting passes or only has warnings
- ✅ Build completes successfully
- ✅ `dist/` directory contains compiled assets
- ✅ All expected assets are present in `dist/assets/`
- ✅ Bundle size is reasonable (< 5MB for initial load)
- ✅ Preview server starts and responds with 200 OK

## Common Issues & Fixes

### TypeScript Errors
- Check `tsconfig.json` for correct paths
- Verify all imports resolve correctly
- Ensure type definitions are installed

### Build Failures
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist .vite`
- Check for circular dependencies

### Asset Missing
- Verify asset paths in `public/` and `src/assets/`
- Check Vite config for asset handling
- Ensure imports use correct paths

### Bundle Size Issues
- Run bundle analyzer: `npm run build -- --analyze`
- Check for duplicate dependencies
- Consider code splitting

## Reporting

After running all checks, create a report with:
- Build time
- Bundle size
- Number of chunks
- Number of assets
- Any warnings or errors
- TypeScript error count
- Lint warning count

## Example Report Format

```markdown
# Frontend Build Verification Report
**Date**: 2026-01-21
**Status**: ✅ PASS / ❌ FAIL

## Metrics
- Build Time: 45.3s
- Bundle Size: 2.1 MB
- Chunks: 12
- Assets: 156
- TypeScript Errors: 0
- Lint Warnings: 3

## Issues
- None / List issues here

## Recommendations
- List any optimization opportunities
```
