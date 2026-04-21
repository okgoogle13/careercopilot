# Frontend Parity Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` (recommended) or `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remediate the frontend parity issues that are confirmed on the current branch: incomplete `/auth` UX, signal-green drift on `/opportunities`, and the visible onboarding debug footer.

**Architecture:** Do not apply the audit's P0 AppShell route-wrap change, because the current router already uses `MigratedRouteLayout` for authenticated routes and the reported missing-sidebar symptom matches the mobile breakpoint behavior. Instead, fix the actual current-branch issues in-place with small, test-backed updates to the auth screen, opportunity filters/headings, and onboarding shell footer behavior.

**Tech Stack:** React 18, TypeScript, Vite, Jest + Testing Library, existing `AuthContext`, KR Solidarity tokens and archetype components.

---

## Revalidated Scope

- Confirmed real issue: `frontend/src/screens/02_auth/AuthModal.tsx` is a placeholder CTA shell with no email/password fields or mode-specific form behavior.
- Confirmed real issue: `frontend/src/screens/06_opportunities/OpportunitiesDiscovery.tsx` uses `--kr-color-signal-green-base` for headline/filter UI that the audit flagged as drift.
- Confirmed real issue: `frontend/src/screens/03_onboarding/OnboardFlow.tsx` always renders a debug footer (`Slots: ... Density ratio: 0.36 ...`) instead of gating it to development or removing it.
- Rejected as stale/incorrect for this branch: the report's P0 AppShell propagation fix and the claimed landing-page overlay issue.
- Deferred unless revalidated later: documents left-column complaint and onboarding pale-lime body copy complaint.

---

### Task 1: Repair the `/auth` Route With a Real Form

**Files:**
- Modify: `frontend/src/screens/02_auth/AuthModal.tsx`
- Modify: `frontend/src/App.tsx`
- Test: `frontend/src/screens/02_auth/__tests__/AuthModal.test.tsx`

- [ ] **Step 1: Write the failing auth regression tests**

Create `frontend/src/screens/02_auth/__tests__/AuthModal.test.tsx` covering:
- login mode renders email and password inputs
- register mode renders display name + email + password inputs
- primary submit label changes by mode
- submit calls `useAuth().login(...)` or `useAuth().register(...)`

Use mocks for `useAuth` and `useModeStore`, and assert on visible fields instead of implementation details.

- [ ] **Step 2: Run the auth tests to verify they fail**

Run:
```bash
(cd frontend && yarn test --runInBand frontend/src/screens/02_auth/__tests__/AuthModal.test.tsx)
```

Expected:
- FAIL because current `AuthModal` only renders title + CTA buttons, not a real form.

- [ ] **Step 3: Implement the minimal real auth form**

Update `frontend/src/screens/02_auth/AuthModal.tsx` to:
- keep the existing shell/styling direction, but render actual form controls
- support `mode="login"` and `mode="register"`
- use `useAuth()` for submit behavior
- show a display name field only in register mode
- render mode-specific submit text
- provide a mode toggle link/button so users can switch between login and register

Update `frontend/src/App.tsx` only if needed so the `/auth?mode=...` route still passes mode correctly and no longer relies on placeholder CTA-only behavior.

- [ ] **Step 4: Run the auth tests again**

Run:
```bash
(cd frontend && yarn test --runInBand frontend/src/screens/02_auth/__tests__/AuthModal.test.tsx)
```

Expected:
- PASS

- [ ] **Step 5: Run targeted typecheck sanity for the auth changes**

Run:
```bash
(cd frontend && yarn type-check)
```

Expected:
- Exit code 0

---

### Task 2: Replace Confirmed Signal-Green Drift on `/opportunities`

**Files:**
- Modify: `frontend/src/screens/06_opportunities/OpportunitiesDiscovery.tsx`
- Test: `frontend/src/screens/06_opportunities/__tests__/OpportunitiesDiscovery.test.tsx`

- [ ] **Step 1: Write the failing opportunities regression tests**

Create `frontend/src/screens/06_opportunities/__tests__/OpportunitiesDiscovery.test.tsx` covering:
- the hero eyebrow and highlighted title segment do not reference `--kr-color-signal-green-base`
- the active filter pill does not reference `--kr-color-signal-green-base`
- the page still renders the expected title and filter tabs

Keep assertions string-based on rendered classes/styles so the test captures the specific token regression.

- [ ] **Step 2: Run the opportunities tests to verify they fail**

Run:
```bash
(cd frontend && yarn test --runInBand frontend/src/screens/06_opportunities/__tests__/OpportunitiesDiscovery.test.tsx)
```

Expected:
- FAIL because current component still uses `--kr-color-signal-green-base`.

- [ ] **Step 3: Implement the minimal token correction**

Update `frontend/src/screens/06_opportunities/OpportunitiesDiscovery.tsx` to replace the confirmed drift with canonical KR tokens:
- hero eyebrow/body emphasis should use parchment/worker-ash style tokens, not signal green
- active filter state should use ink-gold/charcoal-state styling, not signal green

Do not redesign the page or rewrite the filter logic.

- [ ] **Step 4: Re-run the opportunities tests**

Run:
```bash
(cd frontend && yarn test --runInBand frontend/src/screens/06_opportunities/__tests__/OpportunitiesDiscovery.test.tsx)
```

Expected:
- PASS

---

### Task 3: Remove the Onboarding Debug Footer From Runtime UI

**Files:**
- Modify: `frontend/src/screens/03_onboarding/OnboardFlow.tsx`
- Test: `frontend/src/screens/03_onboarding/__tests__/OnboardFlow.test.tsx`

- [ ] **Step 1: Write the failing onboarding shell regression test**

Create `frontend/src/screens/03_onboarding/__tests__/OnboardFlow.test.tsx` covering:
- the debug footer text is not rendered by default in the runtime shell

The test should assert that text like `Slots:` and `Density ratio:` is absent.

- [ ] **Step 2: Run the onboarding shell test to verify it fails**

Run:
```bash
(cd frontend && yarn test --runInBand frontend/src/screens/03_onboarding/__tests__/OnboardFlow.test.tsx)
```

Expected:
- FAIL because current `OnboardFlow` always renders the debug footer.

- [ ] **Step 3: Implement the smallest safe fix**

Update `frontend/src/screens/03_onboarding/OnboardFlow.tsx` to either:
- remove the footer entirely, or
- gate it behind a clearly development-only condition

Prefer removal unless another current runtime dependency requires it.

- [ ] **Step 4: Re-run the onboarding shell test**

Run:
```bash
(cd frontend && yarn test --runInBand frontend/src/screens/03_onboarding/__tests__/OnboardFlow.test.tsx)
```

Expected:
- PASS

---

### Task 4: Final Verification Across the Remediation Slice

**Files:**
- Verify only:
  - `frontend/src/screens/02_auth/AuthModal.tsx`
  - `frontend/src/screens/06_opportunities/OpportunitiesDiscovery.tsx`
  - `frontend/src/screens/03_onboarding/OnboardFlow.tsx`

- [ ] **Step 1: Run the three targeted regression tests together**

Run:
```bash
(cd frontend && yarn test --runInBand \
  frontend/src/screens/02_auth/__tests__/AuthModal.test.tsx \
  frontend/src/screens/06_opportunities/__tests__/OpportunitiesDiscovery.test.tsx \
  frontend/src/screens/03_onboarding/__tests__/OnboardFlow.test.tsx)
```

Expected:
- PASS

- [ ] **Step 2: Run frontend typecheck**

Run:
```bash
(cd frontend && yarn type-check)
```

Expected:
- Exit code 0

- [ ] **Step 3: Run frontend build**

Run:
```bash
(cd frontend && yarn build)
```

Expected:
- Exit code 0
- Pre-existing CSS token/minify warnings may remain; treat them as baseline unless new failures are introduced.

- [ ] **Step 4: Spot-check that the rejected P0 change was not accidentally applied**

Run:
```bash
rg -n "MigratedRouteLayout" frontend/src/App.tsx
```

Expected:
- Existing route wrapping remains intact; no broad router surgery was added for the stale audit claim.

---

## Final Checklist

- [ ] `/auth` renders a real form instead of placeholder CTAs
- [ ] `/opportunities` no longer uses signal-green tokens for the confirmed drift points
- [ ] onboarding runtime UI no longer shows the debug footer
- [ ] targeted tests pass
- [ ] `yarn type-check` passes
- [ ] `yarn build` passes
