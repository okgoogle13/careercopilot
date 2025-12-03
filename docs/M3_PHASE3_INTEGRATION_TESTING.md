# M3 Phase 3 Integration Testing Guide

**Status:** ✅ Phase 3 Complete - Ready for Integration Testing

---

## 🎯 Overview

After completing all 32 Phase 3 components, integration testing ensures:
1. Components work together seamlessly
2. Design tokens are used consistently
3. Real-world usage scenarios function correctly
4. E2E user flows work with M3 components

---

## 📋 Integration Testing Checklist

### 1. Component Integration Tests

**Location:** `frontend/src/__tests__/integration/m3-components-integration.test.tsx`

**Purpose:** Test multiple M3 components working together in realistic scenarios

**Test Scenarios:**
- ✅ Form components (Input, Select, DatePicker, Button) working together
- ✅ Navigation components (Breadcrumb, TabBar, Menu) integration
- ✅ Data display (Table, List, Badge, Chip) integration
- ✅ Feedback components (Alert, Toast, Snackbar) integration
- ✅ Advanced forms (Autocomplete, MultiSelect, Slider) integration
- ✅ Modal and Dialog integration
- ✅ Stepper with form integration

**Run Tests:**
```bash
cd frontend
yarn test m3-components-integration
```

---

### 2. Visual Integration Test Page

**Location:** `frontend/src/pages/M3IntegrationTestPage.tsx`

**Purpose:** Visual verification of all M3 components working together

**Features:**
- All 32 Phase 3 components displayed
- Realistic usage scenarios
- Interactive examples
- Visual consistency check

**Access:**
```bash
# Add route to AppRouter.tsx
<Route path="/m3-integration-test" element={<M3IntegrationTestPage />} />

# Then navigate to: http://localhost:3000/m3-integration-test
```

---

### 3. E2E Integration Tests

**Location:** `frontend/tests/m3-components-integration.spec.js`

**Purpose:** End-to-end testing of M3 components in real browser

**Test Scenarios:**
- ✅ All components render correctly
- ✅ Form interactions work together
- ✅ Navigation flows function
- ✅ Modal/Dialog interactions
- ✅ Table pagination
- ✅ Autocomplete search
- ✅ MultiSelect selection

**Run Tests:**
```bash
# Run all E2E tests
yarn test:e2e

# Run only M3 integration tests
yarn test:e2e m3-components-integration
```

---

### 4. Token Consistency Verification

**Location:** `scripts/verify-m3-token-consistency.sh`

**Purpose:** Verify all components use M3 design tokens consistently

**Checks:**
- All CSS files use `--md-sys-*` tokens
- No hardcoded colors, spacing, or values
- Token categories are properly used
- Consistency across all components

**Run Verification:**
```bash
./scripts/verify-m3-token-consistency.sh
```

**Expected Output:**
```
✅ All components use design tokens consistently!
Token Statistics:
  • Total tokens: 342
  • Component CSS files: 32
  • Components with tokens: 32
```

---

## 🧪 Running Full Integration Test Suite

### Complete Integration Test

```bash
# 1. Verify token consistency
./scripts/verify-m3-token-consistency.sh

# 2. Run component integration tests
cd frontend && yarn test m3-components-integration

# 3. Build application
yarn build

# 4. Run E2E tests
yarn test:e2e m3-components-integration

# 5. Visual inspection
# Navigate to http://localhost:3000/m3-integration-test
```

---

## 📊 Integration Test Results

### Expected Outcomes

**Component Integration:**
- ✅ All form components work together
- ✅ Navigation flows are smooth
- ✅ Data display components render correctly
- ✅ Feedback components appear/disappear properly
- ✅ Advanced forms handle user input correctly

**Token Consistency:**
- ✅ 100% of components use design tokens
- ✅ No hardcoded values found
- ✅ All token categories represented

**E2E Tests:**
- ✅ All user interactions work
- ✅ Components integrate seamlessly
- ✅ No visual regressions

---

## 🔍 Common Issues & Solutions

### Issue: Components not rendering together

**Solution:**
- Check that all CSS files are imported
- Verify M3 design tokens CSS is loaded
- Check for conflicting styles

### Issue: Token consistency failures

**Solution:**
- Review component CSS files
- Replace hardcoded values with tokens
- Use `scripts/verify-m3-token-consistency.sh` to identify issues

### Issue: E2E tests failing

**Solution:**
- Ensure dev server is running
- Check component selectors
- Verify component visibility states

---

## 📈 Next Steps After Integration Testing

1. **Styling Fine-Tuning**
   - Review visual consistency
   - Adjust spacing/colors if needed
   - Compare against M3 design spec

2. **Deprecation & Cleanup**
   - Remove old Electric Alchemist components
   - Update page imports
   - Delete obsolete files

3. **Documentation**
   - Update component library docs
   - Create migration completion report
   - Archive migration guides

---

## 🎉 Phase 3 Completion Status

**Components Completed:** 32/32 ✅

- ✅ Batch 1: Layout & Containers (5 components)
- ✅ Batch 2: Navigation & Menus (6 components)
- ✅ Batch 3: Data Display (8 components)
- ✅ Batch 4: Feedback & Status (7 components)
- ✅ Batch 5: Advanced Forms (6 components)

**Integration Testing:** Ready to begin

**Total Test Coverage:** 500+ unit tests, integration tests, E2E tests

---

**Last Updated:** 2025-01-XX
**Status:** ✅ Phase 3 Complete - Integration Testing Ready

