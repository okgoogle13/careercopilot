# ESLint 9 Upgrade - Follow-Up Tasks

This document tracks the remaining cleanup tasks after the initial ESLint 9 upgrade (PR #82).

## Status: Core Upgrade Complete ✅

**Major accomplishments:**

- ✅ ESLint upgraded to v9.38.0
- ✅ **Fixed 2-hour yarn install loop** (removed ajv/esbuild resolutions)
- ✅ **Fixed CI failures** (clean yarn.lock regenerated)
- ✅ Removed deprecated configs (Airbnb, Google)
- ✅ Migrated to modern flat config format
- ✅ Backend tests passing

---

## Remaining Linting Config Issues

### Issue 1: Missing `@nolyfill/is-core-module` Dependency

**Problem:**

```
Resolve error: Cannot find module '@nolyfill/is-core-module'
```

**Root cause:** This was a dependency of `eslint-import-resolver-typescript` which we removed.

**Solution options:**

- **Option A (Quick):** Remove import plugin rules that require the resolver:

  ```javascript
  // Remove from frontend/eslint.config.mjs:
  'import/no-unresolved': 'error',
  'import/named': 'error',
  'import/namespace': 'error',
  'import/default': 'error',
  'import/export': 'error',
  ```

- **Option B (Proper):** Add back the resolver but with simpler config:
  ```bash
  yarn workspace careercopilot-frontend add -D eslint-import-resolver-typescript
  ```

**Recommendation:** Option A - These rules are TypeScript's job, not ESLint's.

---

### Issue 2: TypeScript Project Configuration Warnings

**Problem:**

```
Parsing error: "parserOptions.project" has been provided for @typescript-eslint/parser.
The file was not found in any of the provided project(s):
  - .storybook/main.ts
  - .storybook/preview.tsx
  - playwright.config.ts
```

**Root cause:** These files aren't in `tsconfig.json` include paths.

**Solution:**
Add to `frontend/eslint.config.mjs` ignores:

```javascript
ignores: [
  // ... existing ignores
  ".storybook/**",
  "playwright.config.ts",
  "vite.config.ts",
  "*.config.{ts,js}", // All config files
];
```

**Effort:** 5 minutes

---

### Issue 3: Generated Files with Deprecated Rules

**Problem:**

```
/frontend/dev-dist/workbox-302896ff.js
  error: Definition for rule '@typescript-eslint/ban-types' was not found
```

**Root cause:** Generated Workbox files have eslint-disable comments for deprecated rules.

**Solution:**
Add `dev-dist/**` to ignores (already partially done, may need to verify).

**Effort:** 2 minutes

---

### Issue 4: `.eslintignore` Deprecation Warning

**Problem:**

```
ESLintIgnoreWarning: The ".eslintignore" file is no longer supported.
```

**Solution:**
Delete `.eslintignore` file if it exists and ensure all ignores are in `eslint.config.mjs`.

**Effort:** 2 minutes

---

## Testing Checklist

Before closing this follow-up, verify:

- [ ] `yarn lint` passes in frontend with 0 errors
- [ ] `yarn lint` passes in functions with 0 errors
- [ ] `yarn install --immutable` still passes
- [ ] `yarn build:frontend` completes successfully
- [ ] `yarn build:functions` completes successfully
- [ ] CI pipeline is green
- [ ] No unexpected new linting warnings in existing code

---

## Implementation Plan

### Phase 1: Quick Wins (15 minutes)

1. Add `.storybook/**`, `playwright.config.ts`, `*.config.{ts,js}` to ignores
2. Delete `.eslintignore` if it exists
3. Verify `dev-dist/**` is ignored
4. Test: `yarn lint` in frontend

### Phase 2: Import Plugin Cleanup (15 minutes)

5. Remove problematic import plugin rules (Option A from Issue 1)
6. Keep only: `import/order`, `import/no-duplicates`, `import/newline-after-import`
7. Test: `yarn lint` in frontend again

### Phase 3: Functions Testing (10 minutes)

8. Test: `yarn lint` in functions directory
9. Fix any functions-specific issues
10. Document any remaining warnings

### Phase 4: CI Validation (5 minutes)

11. Push changes to a new branch
12. Create PR and wait for CI
13. Verify all jobs pass

---

## Expected Final State

**Linting should:**

- ✅ Pass with 0 errors in frontend
- ✅ Pass with 0 errors in functions
- ✅ Have < 10 warnings total (acceptable)
- ✅ Run in < 30 seconds for frontend
- ✅ Work in CI without issues

**Configuration should:**

- ✅ Use only modern flat config files
- ✅ Have no .eslintrc or .eslintignore files
- ✅ Use official recommended configs (no custom Airbnb)
- ✅ Be maintainable and well-documented

---

## Notes

- Total estimated time to complete all follow-up: **45 minutes**
- None of these issues block deployment
- Can be done incrementally (don't need to fix all at once)
- Consider creating separate PRs for each phase

---

## References

- Original PR: #82
- ESLint 9 Migration Guide: https://eslint.org/docs/latest/use/migrate-to-9.0.0
- typescript-eslint v8 Docs: https://typescript-eslint.io/
