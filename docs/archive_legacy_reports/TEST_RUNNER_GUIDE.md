# Comprehensive Test Runner Guide

**All test runners configured and ready**
**Test all layers: Frontend Unit, E2E, Backend, Functions**

---

## Quick Start Commands

### Frontend Unit Tests (Jest)
```bash
# From root or frontend directory
yarn test                          # Run all unit tests
npm test                          # Alternative (from frontend/)
yarn test:watch                   # Watch mode (auto-rerun on changes)
yarn test:coverage                # Generate coverage report
yarn test:ui                      # Watch mode with UI
yarn test:ci                      # CI mode (single run, coverage)
```

### E2E Tests (Playwright)
```bash
# From root or frontend directory
yarn test:e2e                     # Run all E2E tests
yarn test:e2e:headed              # Run with browser visible
yarn test:e2e:debug               # Debug mode with step-through
yarn test:e2e:ui                  # Interactive UI mode
yarn playwright:report            # View last test report
```

### All Tests
```bash
# From root
npm run test:all                  # Run: frontend + functions + backend + e2e
yarn test:all                     # Same with yarn
```

---

## Frontend Unit Tests (Jest)

### Configuration
```
Location: frontend/jest.config.mjs
Framework: Jest 29.7.0
Environment: jsdom (browser-like)
Compiler: ts-jest + Babel
Transforms: TypeScript, JSX, React
```

### Available Commands

#### 1. Run All Tests
```bash
yarn test

# Output shows:
# ✓ Test Suites: 7 passed
# ✓ Tests: 176 passed
# ✓ Time: ~15 seconds
```

#### 2. Watch Mode (Development)
```bash
yarn test:watch

# Features:
# - Auto-reruns when files change
# - Interactive menu (press 'a' to run all, 'q' to quit)
# - Instant feedback as you code
# - Best for development and TDD
```

#### 3. Coverage Report
```bash
yarn test:coverage

# Generates:
# - coverage/lcov-report/index.html (open in browser)
# - coverage/coverage-final.json (machine-readable)
# - Shows: % Statements, % Branches, % Functions, % Lines
```

#### 4. Update Snapshots
```bash
yarn test:update

# Use when snapshot tests are intentionally changed
# Snapshot files: **/__snapshots__/*.snap
```

#### 5. CI Mode (Single Run + Coverage)
```bash
yarn test:ci

# Used in CI/CD pipelines (GitHub Actions, etc.)
# Features:
# - Single run (no watch mode)
# - Generates coverage report
# - --passWithNoTests (doesn't fail if no tests found)
```

#### 6. Specific Component Test
```bash
# From frontend directory:
yarn test EmptyState.test.tsx
yarn test Button
yarn test src/components/ui/feedback/__tests__/

# From root:
cd frontend && yarn test EmptyState.test.tsx
```

### Test File Locations

```
frontend/src/components/ui/feedback/__tests__/
├── EmptyState.test.tsx
├── Toast.test.tsx
├── ToastContext.test.tsx
└── Dialog.test.tsx

frontend/src/components/ui/loading/__tests__/
├── LoadingSpinner.test.tsx
├── FullPageLoading.test.tsx
└── LoadingSkeleton.test.tsx

[Other test files in similar __tests__/ directories]
```

### Debugging Tests

#### Option 1: node --inspect-brk
```bash
# Run single test with debugger
node --inspect-brk node_modules/jest/bin/jest.js --runInBand src/components/ui/Button/__tests__/Button.test.tsx

# Then open: chrome://inspect
```

#### Option 2: console.log in tests
```typescript
// In test file
it('does something', () => {
  console.log('Debug value:', variable);
  expect(something).toBe(true);
});

// Run with: yarn test --verbose
```

#### Option 3: Only run one test
```typescript
// In test file - use .only
it.only('does something', () => {  // Only this test runs
  expect(something).toBe(true);
});

// Or run specific test:
yarn test -t "does something"
```

---

## E2E Tests (Playwright)

### Configuration
```
Location: frontend/playwright.config.ts
Framework: Playwright 1.55.0
Browsers: Chromium, Firefox, WebKit (configurable)
Environment: Real browser automation
Tests: frontend/tests/ directory
```

### Available Commands

#### 1. Run All E2E Tests
```bash
yarn test:e2e

# Runs tests in headless mode (no visible browser)
# Output shows test results per spec file
# Good for: CI/CD, fast feedback
```

#### 2. Run with Visible Browser (Headed)
```bash
yarn test:e2e:headed

# Opens browser window so you can see what's happening
# Good for: Debugging, understanding test flow
# Slower than headless but shows exactly what's happening
```

#### 3. Debug Mode
```bash
yarn test:e2e:debug

# Interactive step-through debugger
# Features:
# - Step through test line by line
# - Inspect DOM state at each step
# - Run specific actions and see results
# Good for: Debugging failing tests
```

#### 4. Interactive UI Mode
```bash
yarn test:e2e:ui

# Opens Playwright Inspector UI
# Shows: Test code, DOM inspector, locators
# Good for: Writing new tests, understanding what selectors work
```

#### 5. View Test Report
```bash
yarn playwright:report

# Opens HTML report of last test run
# Shows: Passed/failed tests, screenshots, videos
```

### E2E Test File Locations

```
frontend/tests/
├── document_upload_success.spec.js
├── example.spec.js
└── [other E2E tests]
```

### Specific E2E Test Runs

```bash
# Run specific test file
yarn test:e2e document_upload_success.spec.js

# Run tests matching pattern
yarn test:e2e --grep "upload"

# Run with specific browser
yarn test:e2e --project=chromium
yarn test:e2e --project=firefox
yarn test:e2e --project=webkit
```

---

## Root Test Commands

### From Project Root

#### Run All Tests (All Layers)
```bash
npm run test:all

# Runs in sequence:
# 1. Frontend Jest tests
# 2. Functions tests
# 3. Backend pytest tests
# 4. Frontend E2E tests
#
# Useful for: Final verification before deployment
# Time: 3-5 minutes depending on test count
```

#### Individual Layer Commands
```bash
npm run test:frontend      # Jest unit tests only
npm run test:functions     # Cloud Functions tests
npm run test:backend       # Python pytest tests
npm run test:e2e           # Playwright E2E tests
```

### CI Mode Commands
```bash
# For GitHub Actions / CI pipelines
npm run test:frontend:ci   # Jest with coverage
npm run test:e2e:ci        # E2E tests (if configured)
```

---

## Test Execution Matrix

### Frontend (Jest)

| Command | Mode | Speed | Coverage | Best For |
|---------|------|-------|----------|----------|
| `yarn test` | Single run | Fast (15s) | ❌ | Quick verification |
| `yarn test:watch` | Auto-rerun | Instant | ❌ | Development, TDD |
| `yarn test:coverage` | Single run | Slow (30s) | ✅ | Coverage reports |
| `yarn test:ui` | Watch + UI | Instant | ❌ | Visual feedback |
| `yarn test:ci` | Single run | Medium (20s) | ✅ | CI/CD pipelines |

### E2E (Playwright)

| Command | Mode | Speed | Browser | Best For |
|---------|------|-------|---------|----------|
| `yarn test:e2e` | Headless | Fast (30s) | All | CI/CD, quick check |
| `yarn test:e2e:headed` | Visual | Slow (45s) | Chrome | Debugging, demos |
| `yarn test:e2e:debug` | Interactive | Very slow | Chrome | Writing tests |
| `yarn test:e2e:ui` | Inspector UI | Variable | Chrome | Learning/writing |

---

## Common Workflows

### Development Workflow (TDD)

```bash
# Terminal 1: Watch mode for rapid feedback
cd frontend && yarn test:watch

# Make changes to component
# Tests auto-run and show results instantly

# When ready, test specific component
yarn test Button --verbose

# Check coverage before committing
yarn test:coverage
```

### Before Committing

```bash
# 1. Run all unit tests
yarn test

# 2. Run E2E tests
yarn test:e2e

# 3. Check coverage
yarn test:coverage

# 4. If all pass → commit
git add . && git commit -m "..."
```

### Before Deployment

```bash
# 1. Run complete test suite
npm run test:all

# 2. If failures, fix them
yarn test:watch  # Fix unit tests
yarn test:e2e:debug  # Fix E2E tests

# 3. Once all pass → deploy
./scripts/deploy.sh production
```

### Adding New Component Tests

```bash
# 1. Component created
# src/components/ui/Button/Button.tsx

# 2. Generate test with skill
# "Create tests for the Button component"

# 3. Run test file
cd frontend && yarn test Button.test.tsx

# 4. Fix failing tests
# Make assertions match component behavior

# 5. Verify with coverage
yarn test:coverage

# 6. Commit
git add src/components/ui/Button/__tests__/Button.test.tsx
git commit -m "test: Add tests for Button component"
```

---

## Troubleshooting

### Issue: "jest: command not found"
```bash
# Solution 1: Install dependencies
cd frontend && yarn install

# Solution 2: Use npx
cd frontend && npx jest --config=jest.config.mjs

# Solution 3: Use yarn
yarn test  # (uses yarn, which knows about jest)
```

### Issue: "Cannot find module 'jest.config.mjs'"
```bash
# Solution: Update scripts to include --config flag
# Already done in updated package.json
yarn test

# Or explicitly:
yarn test --config=jest.config.mjs
```

### Issue: "No tests found"
```bash
# Solution 1: Check test file locations
cd frontend && find src -name "*.test.tsx" | head -10

# Solution 2: Verify jest config testMatch pattern
cat jest.config.mjs | grep -A 2 testMatch

# Solution 3: Run with list to see what's found
yarn test --listTests
```

### Issue: "Tests pass locally but fail in CI"
```bash
# Solution: Run CI mode locally
yarn test:ci

# This simulates GitHub Actions environment
# - Single run (no watch)
# - Coverage generation
# - Exact CI behavior
```

### Issue: "Playwright tests not starting"
```bash
# Solution 1: Check Playwright is installed
npx playwright install

# Solution 2: Check config exists
ls frontend/playwright.config.ts

# Solution 3: Run with verbose output
yarn test:e2e --verbose

# Solution 4: Run with specific browser
yarn test:e2e --project=chromium
```

### Issue: "E2E tests timing out"
```bash
# Increase timeout in playwright.config.ts:
timeout: 60000,  // 60 seconds per test
navigationTimeout: 30000,

# Or run with timeout override:
yarn test:e2e --timeout=60000
```

---

## Performance Tips

### Faster Unit Tests

```bash
# Run only changed test files (requires git)
yarn test --onlyChanged

# Run tests matching pattern
yarn test --testNamePattern="Button"

# Skip slow operations
# Skip coverage if not needed
yarn test  # instead of yarn test:coverage
```

### Faster E2E Tests

```bash
# Run specific test file only
yarn test:e2e document_upload.spec.js

# Run in headed mode with 1x speed (faster rendering)
yarn test:e2e:headed

# Reduce number of browser types
# Edit playwright.config.ts to test chromium only during development
```

---

## Integration with IDE

### VS Code

**Extension**: "Test Explorer UI" or "Jest Runner"

**Settings**:
```json
{
  "jest.runMode": "on-demand",
  "jest.showCoverageOnLoad": false,
  "jest.autoRun": "off"
}
```

**Usage**:
- Click test name to run specific test
- See coverage in gutter
- Quick feedback inline

### WebStorm / IntelliJ

**Built-in Jest support**:
- Right-click test file → Run
- Automatic test detection
- Coverage visualization

---

## CI/CD Integration

### GitHub Actions (Already Configured)

```yaml
# .github/workflows/ci.yml
- name: Run tests
  run: npm run test:all
```

### GitLab CI

```yaml
test:
  script:
    - npm run test:all
  artifacts:
    paths:
      - coverage/
```

### Jenkins

```groovy
stage('Test') {
  steps {
    sh 'npm run test:all'
    junit 'test-results/**/*.xml'
    publishHTML([ ... coverage/index.html ... ])
  }
}
```

---

## Continuous Integration Best Practices

### Before Merging to Main

```bash
# Required checks:
npm run test:all          # All tests pass
yarn lint                 # No linting errors
yarn build               # Build succeeds
```

### Pre-commit Hook

```bash
# .husky/pre-commit
yarn test  # Must pass before commit allowed
yarn lint:fix
```

### Coverage Reporting

```bash
# Track coverage over time
yarn test:coverage

# View HTML report
open frontend/coverage/lcov-report/index.html

# Compare with baseline
# Coverage should never decrease significantly
```

---

## Advanced Usage

### Custom Test Configuration

```bash
# Run tests with specific config
yarn test --config=custom-jest.config.js

# Update snapshots interactively
yarn test --updateSnapshot --watch

# Run with different Node options
NODE_OPTIONS="--max-old-space-size=4096" yarn test
```

### Debugging with Chrome DevTools

```bash
# 1. Start Jest with inspect
node --inspect-brk node_modules/jest/bin/jest.js --runInBand

# 2. Open chrome://inspect in browser
# 3. Click "inspect" on Jest process
# 4. Step through test code
```

### Performance Profiling

```bash
# Profile test execution
yarn test --detectOpenHandles

# Shows which tests are slow
# Identify optimization opportunities
```

---

## Summary

### Quick Reference

```bash
# Development
yarn test:watch              # Auto-run tests as you code

# Before commit
yarn test                    # Run all unit tests
yarn test:e2e               # Run all E2E tests

# Before deployment
npm run test:all            # Complete test suite

# Coverage
yarn test:coverage          # Generate coverage report

# E2E debugging
yarn test:e2e:debug         # Step through E2E tests
yarn test:e2e:headed        # See browser while running

# CI mode
yarn test:ci                # Single run + coverage
```

### File Locations

```
Unit Tests:    frontend/src/**/__tests__/**/*.test.tsx
E2E Tests:     frontend/tests/**/*.spec.js
Config:        frontend/jest.config.mjs
Config:        frontend/playwright.config.ts
Setup:         frontend/src/setupTests.ts
Coverage:      frontend/coverage/lcov-report/index.html
```

---

**All test runners are ready to use. Start with `yarn test` or `yarn test:watch` for development.**

