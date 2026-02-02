# Jules Delegation Prompts - Days 3-4 Execution

**Status:** Ready to send to 8 parallel Jules instances
**Timeline:** Launch simultaneously, ~2-3 hours total execution
**Goal:** 66 components tested, 1,000+ tests generated

---

## 🚀 How to Use

**For Each Jules Instance (1-8):**
1. Copy the entire prompt for that batch (everything between the "---" markers)
2. Send to Jules instance / Claude API / agent
3. Jules executes independently
4. Monitor progress in parallel
5. Capture metrics when batch completes

**Key:** All 8 launch at same time for 3-4x speed improvement!

---

---

## BATCH 1: UI Components (Feedback)

```
You are a test generation expert for the CareerCopilot project.

BATCH: 1 - UI Components (Feedback & Information Display)

YOUR MISSION:
Generate comprehensive Jest tests for feedback/information UI components.
Use jest-test-scaffolder skill to create tests automatically.

COMPONENTS TO TEST (10-12 total):
1. Dialog (frontend/src/components/ui/feedback/Dialog.tsx) - Modal dialog
2. Toast (frontend/src/components/ui/feedback/Toast.tsx) - Toast notifications
3. ToastContext (frontend/src/components/ui/feedback/ToastContext.tsx) - Context hook
4. EmptyState (frontend/src/components/ui/feedback/EmptyState.tsx) - Empty state display
5. Alert (frontend/src/components/ui/feedback/Alert.tsx) - Alert messages
6. Snackbar (frontend/src/components/ui/feedback/Snackbar.tsx) - Snackbar notifications
7. Skeleton (frontend/src/components/ui/feedback/Skeleton.tsx) - Loading skeleton
[Add any additional feedback components from this directory]

YOUR WORKFLOW:
For each component:
1. Read: src/components/ui/feedback/[ComponentName].tsx
2. Analyze: Props, state, event handlers, variants
3. Generate: Create __tests__/[ComponentName].test.tsx with 15-25 tests
   - Render tests (does it show up?)
   - Props tests (do props work?)
   - Interaction tests (do clicks work?)
   - State tests (do states work?)
   - Edge case tests (empty, null, disabled)
4. Run: yarn test [ComponentName]
5. Document: X tests generated, Y passed, Z failed

SPECIAL HANDLING:
- Material-UI theme already mocked in setupTests.ts ✅
- Portal components: Use snapshot tests, skip positioning assertions
- Animations: Consider jest.useFakeTimers() for duration testing
- Accessibility: Use screen queries (getByRole, getByLabelText)
- Some components already have tests (Dialog, Toast, etc.) - focus on edge cases

EXPECTED RESULTS:
- 10-12 components tested
- 150-200 tests generated
- 80%+ pass rate
- Clear documentation of any failures

TIMELINE: 60-75 minutes total

SUCCESS METRICS:
✅ All component tests in __tests__/ directories
✅ 150-200 tests generated
✅ 80%+ tests passing
✅ Metrics documented

START NOW - Use jest-test-scaffolder skill for each component!
```

---

## BATCH 2: UI Components (Loading)

```
You are a test generation expert for the CareerCopilot project.

BATCH: 2 - UI Components (Loading States & Progress Indicators)

YOUR MISSION:
Generate comprehensive Jest tests for loading state components.
These components display progress and loading states to users.

COMPONENTS TO TEST (8-10 total):
1. LoadingSpinner (frontend/src/components/ui/loading/LoadingSpinner.tsx) - Animated spinner
2. FullPageLoading (frontend/src/components/ui/loading/FullPageLoading.tsx) - Full-page overlay
3. LoadingSkeleton (frontend/src/components/ui/loading/LoadingSkeleton.tsx) - Skeleton loader
4. LinearProgress (frontend/src/components/ui/loading/LinearProgress.tsx) - Progress bar
5. CircularProgress (frontend/src/components/ui/loading/CircularProgress.tsx) - Circular indicator
6. ProgressBar (frontend/src/components/ui/loading/ProgressBar.tsx) - Generic progress
[Add any additional loading components from this directory]

YOUR WORKFLOW:
For each component:
1. Read: src/components/ui/loading/[ComponentName].tsx
2. Analyze: Props, animation, state, variants
3. Generate: Create __tests__/[ComponentName].test.tsx with 15-25 tests
   - Render tests
   - Size/variant tests (small, medium, large)
   - Animation tests (if applicable)
   - Value/progress tests (if applicable)
   - State tests (loading, complete)
4. Run: yarn test [ComponentName]
5. Document: metrics and any jsdom limitations

SPECIAL HANDLING:
- Portal-based components: jsdom doesn't support Portals perfectly
  → Use snapshot tests instead of positioning assertions
  → Skip: absolute positioning, z-index, overlay tests
- Animations: Jest fake timers may be needed
- jsdom limitation: Can't test real animations - use snapshots
- Some components already have tests - enhance with more edge cases

EXPECTED RESULTS:
- 8-10 components tested
- 100-150 tests generated
- 70%+ pass rate
- Document jsdom limitations encountered

TIMELINE: 50-60 minutes total

SUCCESS METRICS:
✅ All component tests in __tests__/ directories
✅ 100-150 tests generated
✅ 70%+ tests passing
✅ jsdom limitations documented for Week 2

START NOW - Use jest-test-scaffolder skill for each component!
```

---

## BATCH 3: UI Components (Navigation)

```
You are a test generation expert for the CareerCopilot project.

BATCH: 3 - UI Components (Navigation & Routing)

YOUR MISSION:
Generate comprehensive Jest tests for navigation UI components.
These components handle user navigation and routing.

COMPONENTS TO TEST (10-12 total):
1. Sidebar (frontend/src/components/ui/navigation/Sidebar.tsx) - Navigation sidebar
2. Navbar (frontend/src/components/ui/navigation/Navbar.tsx) - Top navigation
3. Breadcrumbs (frontend/src/components/ui/navigation/Breadcrumbs.tsx) - Breadcrumb nav
4. Tabs (frontend/src/components/ui/navigation/Tabs.tsx) - Tab navigation
5. Stepper (frontend/src/components/ui/navigation/Stepper.tsx) - Step indicator
6. Pagination (frontend/src/components/ui/navigation/Pagination.tsx) - Page navigation
[Add any additional navigation components from this directory]

YOUR WORKFLOW:
For each component:
1. Read: src/components/ui/navigation/[ComponentName].tsx
2. Analyze: Props, navigation logic, active states, routing
3. Generate: Create __tests__/[ComponentName].test.tsx with 15-25 tests
   - Render tests
   - Item/option tests
   - Selection/active state tests
   - Click handler tests
   - Keyboard navigation tests (arrow keys, enter)
4. Run: yarn test [ComponentName]
5. Document: routing-related challenges and solutions

SPECIAL HANDLING:
- React Router: Components may use React Router context
  → Wrap tests with <BrowserRouter> if needed
  → Mock useNavigate() hook if used
- Link components: May need next/link or react-router Link mocking
- Active states: Test with different route paths/indices
- Keyboard navigation: Test arrow keys, Enter key, Tab key
- Accessibility: Test ARIA attributes (role, aria-current, aria-label)

EXPECTED RESULTS:
- 10-12 components tested
- 150-200 tests generated
- 65%+ pass rate (routing complexity may lower this)
- Router mocking patterns documented for reuse

TIMELINE: 70-85 minutes total

SUCCESS METRICS:
✅ All component tests in __tests__/ directories
✅ 150-200 tests generated
✅ 65%+ tests passing
✅ Router mocking patterns documented

START NOW - Use jest-test-scaffolder skill for each component!
```

---

## BATCH 4: UI Components (Surfaces) ⭐ EASIEST BATCH

```
You are a test generation expert for the CareerCopilot project.

BATCH: 4 - UI Components (Surfaces & Container Components)

YOUR MISSION:
Generate comprehensive Jest tests for surface/container components.
⭐ This is the EASIEST batch - expect HIGHEST pass rate!

COMPONENTS TO TEST (8-10 total):
1. Card (frontend/src/components/ui/surfaces/Card.tsx) - Content card
2. Paper (frontend/src/components/ui/surfaces/Paper.tsx) - Base surface
3. Container (frontend/src/components/ui/surfaces/Container.tsx) - Content container
4. Grid (frontend/src/components/ui/surfaces/Grid.tsx) - Grid layout
5. Box (frontend/src/components/ui/surfaces/Box.tsx) - Generic box
6. Panel (frontend/src/components/ui/surfaces/Panel.tsx) - Panel container
[Add any additional surface components from this directory]

YOUR WORKFLOW:
For each component:
1. Read: src/components/ui/surfaces/[ComponentName].tsx
2. Analyze: Props, composition patterns, styling variants
3. Generate: Create __tests__/[ComponentName].test.tsx with 15-25 tests
   - Render tests
   - Props tests (elevation, color, size variants)
   - Children rendering tests
   - Styling/className tests
   - Responsive behavior tests (if applicable)
4. Run: yarn test [ComponentName]
5. Document: results (should be highest pass rate)

SPECIAL HANDLING:
- These are SIMPLE composition components - no complex logic!
- No special mocks needed ✅
- No routing, context, portals, or API calls needed ✅
- Test thoroughly because they're straightforward
- Test all style props and variants
- Test with various children content

EXPECTED RESULTS:
- 8-10 components tested
- 120-150 tests generated
- 85%+ pass rate ⭐ HIGHEST OF ALL BATCHES!
- Excellent pattern foundation for other batches

TIMELINE: 45-60 minutes total (FASTEST)

SUCCESS METRICS:
✅ All component tests in __tests__/ directories
✅ 120-150 tests generated
✅ 85%+ tests passing ⭐
✅ Clean test patterns for documentation

STRATEGY: This batch completes fastest - get quick win and confidence!

START NOW - Use jest-test-scaffolder skill for each component!
```

---

## BATCH 5: Common Components

```
You are a test generation expert for the CareerCopilot project.

BATCH: 5 - Common Components (App Layout & Shared Features)

YOUR MISSION:
Generate comprehensive Jest tests for commonly used app layout components.
These are building blocks used across the application.

COMPONENTS TO TEST (8-10 total):
1. Header (frontend/src/components/common/Header.tsx) - Application header
2. Footer (frontend/src/components/common/Footer.tsx) - Application footer
3. Layout (frontend/src/components/common/Layout.tsx) - Main layout wrapper
4. PageWrapper (frontend/src/components/common/PageWrapper.tsx) - Page wrapper
5. Sidebar (frontend/src/components/common/Sidebar.tsx) - App sidebar
6. NavBar (frontend/src/components/common/NavBar.tsx) - App navbar
[Add any additional common components from this directory]

YOUR WORKFLOW:
For each component:
1. Read: src/components/common/[ComponentName].tsx
2. Analyze: Props, composition, layout, context usage
3. Generate: Create __tests__/[ComponentName].test.tsx with 15-25 tests
   - Render tests
   - Props tests
   - Children rendering
   - Layout structure tests
   - Conditional rendering tests
4. Run: yarn test [ComponentName]
5. Document: context mocking patterns used

SPECIAL HANDLING:
- These components likely use Application Context
  → Mock: AuthContext, UserContext, ThemeContext
  → Test with/without context values
  → Test logged-in vs logged-out states
- Responsive behavior: Test layout on different screen sizes
- User display: Test with/without user data
- Permissions: Test conditional rendering based on user role

EXPECTED RESULTS:
- 8-10 components tested
- 120-150 tests generated
- 70%+ pass rate
- Context mocking patterns documented

TIMELINE: 60-70 minutes total

SUCCESS METRICS:
✅ All component tests in __tests__/ directories
✅ 120-150 tests generated
✅ 70%+ tests passing
✅ Context patterns documented for reuse

START NOW - Use jest-test-scaffolder skill for each component!
```

---

## BATCH 6: Library Components

```
You are a test generation expert for the CareerCopilot project.

BATCH: 6 - Library Components (Complex Reusable Components)

YOUR MISSION:
Generate comprehensive Jest tests for complex interactive library components.
These have more advanced interactions and state management.

COMPONENTS TO TEST (10-12 total):
1. Modal (frontend/src/components/library/Modal.tsx) - Modal dialog
2. Dropdown (frontend/src/components/library/Dropdown.tsx) - Select dropdown
3. Tooltip (frontend/src/components/library/Tooltip.tsx) - Tooltip overlay
4. Menu (frontend/src/components/library/Menu.tsx) - Context menu
5. Popover (frontend/src/components/library/Popover.tsx) - Popover component
6. DatePicker (frontend/src/components/library/DatePicker.tsx) - Date selection
[Add any additional library components from this directory]

YOUR WORKFLOW:
For each component:
1. Read: src/components/library/[ComponentName].tsx
2. Analyze: Props, interactions, state, event handlers
3. Generate: Create __tests__/[ComponentName].test.tsx with 15-25 tests
   - Render tests
   - Open/close behavior
   - User interactions (clicks, keyboard)
   - Selection tests
   - State tests
   - Edge cases
4. Run: yarn test [ComponentName]
5. Document: interaction patterns and any special setup

SPECIAL HANDLING:
- Complex user interactions: Use userEvent for realistic behavior
  → Test clicking items to select/open
  → Test keyboard navigation (arrow keys, enter, escape)
  → Test click-outside closing modals
- Portal components: Use snapshots for positioning
- Date/time components: May need date library mocks
- Async behavior: Use act() and waitFor() as needed
- Popovers/Tooltips: Skip positioning tests (jsdom limitation)

EXPECTED RESULTS:
- 10-12 components tested
- 150-200 tests generated
- 65%+ pass rate
- Complex interaction patterns documented

TIMELINE: 75-85 minutes total

SUCCESS METRICS:
✅ All component tests in __tests__/ directories
✅ 150-200 tests generated
✅ 65%+ tests passing
✅ Interaction patterns documented

START NOW - Use jest-test-scaffolder skill for each component!
```

---

## BATCH 7: Feature Components

```
You are a test generation expert for the CareerCopilot project.

BATCH: 7 - Feature Components (Forms & Form Controls)

YOUR MISSION:
Generate comprehensive Jest tests for form and feature components.
These handle user input and form submission.

COMPONENTS TO TEST (10-12 total):
1. FormGroup (frontend/src/components/features/FormGroup.tsx) - Form group wrapper
2. FormControl (frontend/src/components/features/FormControl.tsx) - Form control
3. TextInput (frontend/src/components/features/TextInput.tsx) - Text input field
4. SelectField (frontend/src/components/features/SelectField.tsx) - Select field
5. Checkbox (frontend/src/components/features/Checkbox.tsx) - Checkbox control
6. Radio (frontend/src/components/features/Radio.tsx) - Radio control
[Add any additional feature components from this directory]

YOUR WORKFLOW:
For each component:
1. Read: src/components/features/[ComponentName].tsx
2. Analyze: Props, form integration, validation, handlers
3. Generate: Create __tests__/[ComponentName].test.tsx with 15-25 tests
   - Render tests
   - Controlled input tests (value + onChange)
   - User input tests (typing, selecting)
   - Error state tests
   - Validation tests (if applicable)
   - Accessibility tests (labels, ARIA)
4. Run: yarn test [ComponentName]
5. Document: form integration patterns

SPECIAL HANDLING:
- Form inputs: Test controlled behavior (value prop + onChange handler)
  → Input changes should update value
  → onChange should fire with correct values
- Validation: Test error states and error messages if applicable
- React Hook Form: If used, may need form context mocking
- userEvent: Use for realistic typing/selecting interactions
- Accessibility: Test labels, ARIA attributes, keyboard interaction

EXPECTED RESULTS:
- 10-12 components tested
- 150-200 tests generated
- 60%+ pass rate (form complexity may lower this)
- Form patterns documented

TIMELINE: 75-90 minutes total

SUCCESS METRICS:
✅ All component tests in __tests__/ directories
✅ 150-200 tests generated
✅ 60%+ tests passing
✅ Form integration patterns documented

START NOW - Use jest-test-scaffolder skill for each component!
```

---

## BATCH 8: Career-Specific Components ⚠️ MOST COMPLEX

```
You are a test generation expert for the CareerCopilot project.

BATCH: 8 - Career-Specific Components (AI-Integrated Features)

YOUR MISSION:
Generate comprehensive Jest tests for career/AI-integrated components.
⚠️ This is the MOST COMPLEX batch - expect LOWEST initial pass rate.

COMPONENTS TO TEST (10-12 total):
1. KSCGenerator (frontend/src/components/career/KSCGenerator.tsx) - KSC generation
2. TailoredResumeGenerator (frontend/src/components/career/TailoredResumeGenerator.tsx) - Resume generation
3. CoverLetterGenerator (frontend/src/components/career/CoverLetterGenerator.tsx) - Cover letter generation
4. ApplicationTracker (frontend/src/components/career/ApplicationTracker.tsx) - Application tracking
5. JobMatcher (frontend/src/components/career/JobMatcher.tsx) - Job matching
6. OneClickApplyButton (frontend/src/components/career/OneClickApplyButton.tsx) - Apply button
[Add any additional career components from this directory]

YOUR WORKFLOW:
For each component:
1. Read: src/components/career/[ComponentName].tsx
2. Analyze: API calls, Genkit flows, Firebase usage, state
3. Generate: Create __tests__/[ComponentName].test.tsx with 15-25 tests
   - Render tests
   - User interaction tests
   - Loading state tests
   - Success state tests
   - Error state tests
4. Run: yarn test [ComponentName]
5. Document: ALL mocks needed and setup patterns

CRITICAL: MOCK ALL EXTERNAL DEPENDENCIES!
⚠️ DO NOT make actual API calls in tests!

Mocking Required:
- Mock AI services: jest.mock('frontend/src/api/aiServices')
  - generateKscResponses
  - generateCoverLetter
  - generateTailoredResume
  - All other AI service methods
- Mock Firebase: jest.mock('firebase/...')
  - Auth state
  - Firestore queries
  - Storage operations
- Mock Genkit flows: jest.mock('backend Genkit flows')
  - All flow responses
- Mock HTTP: jest.mock('axios' or fetch client)
  - All API endpoints

Special Handling:
- Loading states: Mock async functions with jest.fn()
- Error handling: Test error messages and recovery
- API responses: Mock with realistic data structures
- Genkit integration: Mock flow responses
- Firebase auth: Mock logged-in/logged-out states
- Accessibility: Test keyboard navigation if applicable

EXPECTED RESULTS:
- 10-12 components tested
- 150-200 tests generated
- 50%+ pass rate (⚠️ OK for highest complexity)
- CLEAR documentation of all mocks needed
- Ready for Week 2 refinement

TIMELINE: 90-120 minutes total (SLOWEST - most complex)

SUCCESS METRICS:
✅ All component tests in __tests__/ directories
✅ 150-200 tests generated
✅ 50%+ tests passing (acceptable for complexity)
✅ ALL mocks clearly documented
✅ Ready for Week 2 improvements

WEEK 2 NOTE: This batch will have LOWEST pass rate - that's OK!
Complex components need refinement. Document what needs fixing.

START NOW - Use jest-test-scaffolder skill with comprehensive mocking!
```

---

## 📊 Execution Summary

### Ready to Launch Now (Days 3-4)

| Instance | Batch | Category | Components | Tests | Complexity | ETA |
|----------|-------|----------|-----------|-------|-----------|-----|
| 1 | 1 | UI Feedback | 10-12 | 150-200 | Medium | 60-75 min |
| 2 | 2 | UI Loading | 8-10 | 100-150 | Medium | 50-60 min |
| 3 | 3 | UI Navigation | 10-12 | 150-200 | High | 70-85 min |
| 4 | 4 | UI Surfaces | 8-10 | 120-150 | **Low** ⭐ | 45-60 min |
| 5 | 5 | Common | 8-10 | 120-150 | Medium | 60-70 min |
| 6 | 6 | Library | 10-12 | 150-200 | High | 75-85 min |
| 7 | 7 | Feature | 10-12 | 150-200 | High | 75-90 min |
| 8 | 8 | Career | 10-12 | 150-200 | **Very High** ⚠️ | 90-120 min |
| **TOTAL** | | | **66** | **1,090** | | **2-3 hrs** |

### Launch Instructions

**For Each Jules Instance:**
1. Copy the entire prompt section for that batch (all text between the batch markers)
2. Send to Jules instance / Claude API / agent
3. Jules executes independently while you monitor
4. All 8 running simultaneously = 3-4x speed improvement!

### Expected Timeline

```
9:00 AM  - All 8 Jules instances launch simultaneously
10:00 AM - Batch 4 (Surfaces) completes ✅ First win!
10:30 AM - Batches 1, 2, 5 completing
11:00 AM - Batches 3, 6 completing
11:30 AM - Batch 7 completing
12:00 PM - Batch 8 (Career) completes ⚠️ Most complex
          All 8 batches done in ~3 hours!
```

### Metrics to Capture Per Batch

```
Batch [N] Results:
- Components tested: X
- Tests generated: Y
- Tests passing: Z
- Pass rate: Z/Y%
- Major blockers: [List]
- Notes for Week 2: [Notes]
```

---

**Ready to deploy? All 8 prompts above are ready to send to Jules instances! 🚀**
