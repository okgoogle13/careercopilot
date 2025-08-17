# CareerCopilot Frontend Testing Strategy

## Overview
This document outlines the testing, CI, and code quality strategy for the CareerCopilot frontend. It is designed to maximize reliability, coverage, and maintainability for all contributors.

---

## 1. Automated Testing & Coverage
- **Unit & Integration Tests:** All code must be covered by Vitest tests. Run with `npm test` or `npm run test:ci`.
- **Code Coverage:** Coverage reports are generated and uploaded as CI artifacts. Aim for >90% coverage on new code.
- **MSW:** All API calls are intercepted and mocked for deterministic tests.

## 2. Dependency Health
- **Lock File Consistency:** CI checks for `package-lock.json` sync. PRs must update lock files if dependencies change.
- **Automated Audits:** `npm audit` runs in CI to catch vulnerabilities.

## 3. Linting & Static Analysis
- **ESLint:** All code is linted on commit and in CI. No warnings allowed.
- **TypeScript:** Type checks run in CI and pre-commit.
- **Lint-Staged:** Only staged files are linted and type-checked before commit.

## 4. Pre-Commit Hooks
- **Husky:** Pre-commit runs lint-staged, which lints and type-checks staged files.
- **Tests:** Optionally, run `npm test` in pre-commit for critical branches.

## 5. CI Workflow Enhancements
- **Multi-Node Version Testing:** CI runs on Node 18.x and 20.x for compatibility.
- **Artifact Uploads:** Test results and coverage are uploaded for review.
- **Fail Fast:** CI fails if lint, type, or test checks fail.
- **Build Verification:** CI ensures the app builds successfully.

## 6. Reporting & Onboarding
- **Test Results:** Uploaded as CI artifacts for every run.
- **Coverage Reports:** Available in CI artifacts and can be integrated with Coveralls/Codecov.
- **Documentation:** This strategy is documented in `TESTING_STRATEGY.md` and referenced in onboarding docs.

---

## Team Adoption Checklist
- Always run `npm install` after dependency changes.
- Commit updated `package-lock.json`.
- Run `npm run lint` and `npm run tsc` before pushing.
- Ensure tests pass locally (`npm test`).
- Review CI artifacts for coverage and test results.

---

## Future-Proofing
- Regularly audit dependencies (`npm audit`).
- Update CI workflows to include new checks as needed.
- Monitor coverage and increase where possible.
- Use static analysis tools for security and code health.

---

For questions, contact the maintainers or review the latest CI workflow in `.github/workflows/`.
