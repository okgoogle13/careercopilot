# Test Runner - Quick Reference Card

## 🚀 TL;DR - Copy & Paste Ready

### Run All Unit Tests
```bash
yarn test
npm test  # from frontend/
```

### Watch Mode (Development)
```bash
yarn test:watch
```

### E2E Tests
```bash
yarn test:e2e                    # Headless
yarn test:e2e:headed             # Visible browser
yarn test:e2e:debug              # Debug mode
```

### Coverage Report
```bash
yarn test:coverage
```

### All Tests (Complete)
```bash
npm run test:all                 # From root
```

---

## 📊 Current Test Status

| Layer | Framework | Status | Command |
|-------|-----------|--------|---------|
| **Frontend Unit** | Jest 29.7.0 | ✅ 176/218 passing | `yarn test` |
| **E2E** | Playwright 1.55.0 | ✅ Ready | `yarn test:e2e` |
| **Functions** | Jest | ✅ Ready | `npm run test:functions` |
| **Backend** | pytest | ✅ Ready | `npm run test:backend` |

---

## 📁 Test File Locations

```
Frontend Unit Tests:
└─ frontend/src/**/__tests__/**/*.test.tsx

E2E Tests:
└─ frontend/tests/*.spec.js

Configuration:
├─ frontend/jest.config.mjs
└─ frontend/playwright.config.ts
```

---

## ⚡ Common Commands

```bash
# Quick check
yarn test

# Development (auto-rerun)
yarn test:watch

# Before commit
yarn test && yarn test:e2e

# Before deploy
npm run test:all

# Coverage analysis
yarn test:coverage

# Debug E2E
yarn test:e2e:debug

# View E2E report
yarn playwright:report
```

---

## 🎯 Typical Workflow

```bash
# 1. Start watching tests
yarn test:watch

# 2. Edit component
# Tests auto-run, see results instantly

# 3. When done developing
yarn test              # Full run (not watching)
yarn test:e2e          # E2E tests

# 4. Ready to commit?
npm run test:all       # Complete suite

# 5. If all pass
git commit -m "feat: ..."
```

---

## 🔧 Individual Component Test

```bash
# From frontend/
yarn test Button
yarn test EmptyState
yarn test src/components/ui/Button/__tests__/

# Specific test within file
yarn test --testNamePattern="renders with default"
```

---

## 📊 Coverage

```bash
# Generate report
yarn test:coverage

# View in browser
open frontend/coverage/lcov-report/index.html
```

---

## 🐛 Debug Failing Test

```bash
# Option 1: See what's happening
yarn test:watch          # Then edit test to see details

# Option 2: Run single test
yarn test Button --verbose

# Option 3: Add console.log and watch
yarn test:watch          # Edit test, add console.log

# For E2E: Interactive debugger
yarn test:e2e:debug      # Step through test
```

---

## 💡 Pro Tips

```bash
# Skip slow tests (during development)
yarn test --testNamePattern="fast"

# Run only changed tests
yarn test --onlyChanged

# Update snapshots
yarn test --updateSnapshot

# Watch specific file
yarn test:watch Button

# Parallel execution
yarn test --maxWorkers=4
```

---

## ❌ Common Issues

### Jest not found
```bash
cd frontend && yarn install
```

### No tests found
```bash
yarn test --listTests  # See what's found
find src -name "*.test.tsx"  # Manual check
```

### E2E won't start
```bash
npx playwright install  # Install browsers
```

### Tests timeout
```bash
yarn test --testTimeout=60000  # Increase to 60s
```

---

## 📈 Next Steps

1. **Now**: Run `yarn test` to verify everything works
2. **Today**: Check `yarn test:watch` works in development
3. **This week**: Execute Week 1 playbook (fix 42 tests, test 15 components)
4. **Next month**: Scale to 50% coverage using jest-test-scaffolder

---

## 📚 Full Docs

See:
- `TEST_RUNNER_GUIDE.md` - Complete reference
- `TEST_COVERAGE_MASTERY_GUIDE.md` - Strategy & execution
- `WEEK_1_EXECUTION_PLAYBOOK.md` - Day-by-day tasks

---

**Everything is ready. Just run: `yarn test`** ✅
