# Final Dev Sprint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the remaining repo-truth gaps so the Figma/design lane can be called complete with one authoritative board, verified KR hygiene on live surfaces, and a cleared auth follow-through.

**Architecture:** Keep this sprint narrow and verification-first. Treat `TASKS.md`, `DECISIONS.md`, and the active Figma sync artifacts as the authority surface; remediate only the remaining live-surface token/styling residue in `LandingPage`, `Dashboard`, and `OnboardFlow`; then verify the inline auth decision is safe at the route/caller boundary.

**Tech Stack:** React 18, TypeScript, Vite, Jest/Testing Library, Tailwind utility classes, repo drift checker (`scripts/design-validation/check-design-drift.py`).

---

### Task 1: Normalize The Control Surface

**Files:**
- Modify: `TASKS.md`
- Inspect: `DECISIONS.md`
- Inspect: `docs/project/active/figma-agent-tasks.md`
- Inspect: `docs/project/active/figma-sync-order.json`

- [ ] **Step 1: Re-read the authoritative sprint surfaces**

Run:
```bash
sed -n '1,120p' TASKS.md
sed -n '1,80p' DECISIONS.md
sed -n '1,80p' docs/project/active/figma-agent-tasks.md
sed -n '1,80p' docs/project/active/figma-sync-order.json
```

Expected:
- `TASKS.md` contains only one `## Active`, one `## Waiting On`, one `## Someday`, and one `## Done`
- `DECISIONS.md` contains the 2026-04-21 entries for `F-01/F-02` and `F-06`

- [ ] **Step 2: Make `TASKS.md` reflect only genuinely open sprint work**

Update `TASKS.md` so the top of the file has exactly:
- `Control-surface cleanup`
- `Final KR hygiene sweep`
- `Auth decision follow-through`

And the decision items are no longer listed as open waiting work once they are already recorded in `DECISIONS.md`.

- [ ] **Step 3: Verify the board structure is clean**

Run:
```bash
python3 - <<'PY'
from pathlib import Path
lines = Path("TASKS.md").read_text().splitlines()
for heading in ["## Active", "## Waiting On", "## Someday", "## Done"]:
    hits = [i + 1 for i, line in enumerate(lines) if line.strip() == heading]
    print(heading, hits, len(hits))
PY
```

Expected:
- each heading prints exactly one location and count `1`

- [ ] **Step 4: Commit the control-surface cleanup**

Run:
```bash
git add TASKS.md
git commit -m "docs: normalize final sprint task board"
```

Expected:
- one docs-only commit containing the board normalization

---

### Task 2: Finish KR Hygiene On Live Surfaces

**Files:**
- Modify: `frontend/src/features/landing/LandingPage.tsx`
- Modify: `frontend/src/features/dashboard/Dashboard.tsx`
- Modify: `frontend/src/screens/03_onboarding/OnboardFlow.tsx`
- Test: `frontend/src/features/landing/__tests__/LandingPage.test.tsx`
- Test: `frontend/src/features/dashboard/__tests__/Dashboard.test.tsx`
- Test: `frontend/src/screens/03_onboarding/__tests__/OnboardFlow.test.tsx`

- [ ] **Step 1: Write or extend failing checks for remaining hygiene debt**

Add/update assertions for:
- `LandingPage`: no `font-['Caveat']` on audited copy surfaces; feature cards remain `rounded-march`
- `LandingPage`: donor copy remains internally consistent across the hero, stat row, and evidence badge
- `Dashboard`: no `bg-white/5` residue in the metric bar path; collective block still renders
- `OnboardFlow`: no `--sys-color-*` slot token residue

Use these suites:
```text
frontend/src/features/landing/__tests__/LandingPage.test.tsx
frontend/src/features/dashboard/__tests__/Dashboard.test.tsx
frontend/src/screens/03_onboarding/__tests__/OnboardFlow.test.tsx
```

- [ ] **Step 2: Run the focused suites to confirm red state where new checks were added**

Run:
```bash
cd frontend && yarn test --runInBand \
  src/features/landing/__tests__/LandingPage.test.tsx \
  src/features/dashboard/__tests__/Dashboard.test.tsx \
  src/screens/03_onboarding/__tests__/OnboardFlow.test.tsx
```

Expected:
- any new hygiene assertions fail for the intended residue, not due to test harness errors

- [ ] **Step 3: Implement the minimal surface fixes**

Make only these classes/token changes:
- `LandingPage.tsx`
  - replace remaining `font-['Caveat']` with approved typography
  - replace remaining raw `borderRadius` values with canonical KR shape vars where appropriate
  - replace remaining inline `rgba(...)` surface colors with `color-mix(...)` or KR semantic vars
  - resolve donor-copy drift so stat labels and the evidence badge do not disagree
- `Dashboard.tsx`
  - replace remaining `bg-white/5` and `--sys-color-*` residue on live CTAs/reminder surfaces
  - preserve the already-verified `THE COLLECTIVE` block
- `OnboardFlow.tsx`
  - replace `--sys-color-*` slot token references with canonical `--kr-color-*` vars

- [ ] **Step 4: Re-run the focused suites to confirm green**

Run:
```bash
cd frontend && yarn test --runInBand \
  src/features/landing/__tests__/LandingPage.test.tsx \
  src/features/dashboard/__tests__/Dashboard.test.tsx \
  src/screens/03_onboarding/__tests__/OnboardFlow.test.tsx
```

Expected:
- all three suites pass

- [ ] **Step 5: Run type and drift verification**

Run:
```bash
cd frontend && yarn type-check
python3 scripts/design-validation/check-design-drift.py \
  frontend/src/features/landing/LandingPage.tsx \
  frontend/src/features/dashboard/Dashboard.tsx \
  frontend/src/screens/03_onboarding/OnboardFlow.tsx
```

Expected:
- `yarn type-check` exits `0`
- drift checker prints `No drift violations found`

- [ ] **Step 6: Commit the hygiene sweep**

Run:
```bash
git add \
  frontend/src/features/landing/LandingPage.tsx \
  frontend/src/features/dashboard/Dashboard.tsx \
  frontend/src/screens/03_onboarding/OnboardFlow.tsx \
  frontend/src/features/landing/__tests__/LandingPage.test.tsx \
  frontend/src/features/dashboard/__tests__/Dashboard.test.tsx \
  frontend/src/screens/03_onboarding/__tests__/OnboardFlow.test.tsx
git commit -m "fix: close final KR hygiene debt on live surfaces"
```

Expected:
- one code+test commit containing the final design-surface cleanup

---

### Task 3: Verify Auth Decision Follow-Through

**Files:**
- Inspect/Modify: `frontend/src/screens/02_auth/AuthModal.tsx`
- Test: `frontend/src/screens/02_auth/__tests__/AuthModal.test.tsx`
- Inspect: `frontend/src/App.tsx`
- Inspect: `frontend/src/config/route-registry.ts`
- Modify: `DECISIONS.md`

- [ ] **Step 1: Find every active caller and route entry for `AuthModal`**

Run:
```bash
rg -n "<AuthModal|AuthModal\\(" frontend/src
sed -n '1,120p' frontend/src/App.tsx
sed -n '1,120p' frontend/src/config/route-registry.ts
```

Expected:
- all active call sites are identified
- no active caller still passes removed copy-prop fields

- [ ] **Step 2: Add or extend auth regression tests**

In `frontend/src/screens/02_auth/__tests__/AuthModal.test.tsx`, cover:
- `mode="login"` selects the login tab initially
- `mode="register"` selects the register tab initially
- clicking the inline switcher changes the surfaced flow without navigation
- form submission uses `Sign In →` and `Create Account →` instead of legacy button labels

- [ ] **Step 3: Run the auth suite**

Run:
```bash
cd frontend && yarn test --runInBand src/screens/02_auth/__tests__/AuthModal.test.tsx
```

Expected:
- suite passes and proves the inline tab-switcher behavior

- [ ] **Step 4: Remove auth lint debt introduced by the decision change**

Fix in `frontend/src/screens/02_auth/AuthModal.tsx`:
- remove or consume the unused `onSecondaryAction` prop
- escape or rewrite the apostrophe in the toggle copy so lint passes

- [ ] **Step 5: Close the decision follow-up in `DECISIONS.md`**

Append a short note under the 2026-04-21 `F-06` decision confirming:
- no active callers use removed props
- query-param/default-mode behavior is verified by test

- [ ] **Step 6: Commit the auth follow-through**

Run:
```bash
git add \
  frontend/src/screens/02_auth/AuthModal.tsx \
  frontend/src/screens/02_auth/__tests__/AuthModal.test.tsx \
  DECISIONS.md
git commit -m "test: verify auth tab-switcher follow-through"
```

Expected:
- one focused auth verification commit

---

### Task 4: Final Sprint Gate

**Files:**
- Inspect: `TASKS.md`
- Inspect: `DECISIONS.md`
- Inspect: `docs/project/active/figma-agent-tasks.md`
- Inspect: `docs/project/active/figma-sync-order.json`

- [ ] **Step 1: Run the narrow final verification bundle**

Run:
```bash
cd frontend && yarn test --runInBand \
  src/features/landing/__tests__/LandingPage.test.tsx \
  src/features/dashboard/__tests__/Dashboard.test.tsx \
  src/screens/03_onboarding/__tests__/OnboardFlow.test.tsx \
  src/screens/02_auth/__tests__/AuthModal.test.tsx
cd ..
cd frontend && yarn lint
cd ..
cd frontend && yarn type-check
cd ..
python3 scripts/design-validation/check-design-drift.py \
  frontend/src/features/landing/LandingPage.tsx \
  frontend/src/features/dashboard/Dashboard.tsx \
  frontend/src/screens/03_onboarding/OnboardFlow.tsx \
  frontend/src/screens/02_auth/AuthModal.tsx
```

Expected:
- all targeted suites pass
- lint exits `0`
- type-check exits `0`
- drift checker reports no violations on the touched surfaces

- [ ] **Step 2: Confirm board and decisions agree**

Run:
```bash
sed -n '1,80p' TASKS.md
sed -n '1,80p' DECISIONS.md
```

Expected:
- no decision item remains listed as open if it is already recorded
- `TASKS.md` reflects only any truly unresolved work, or explicitly shows none

- [ ] **Step 3: Re-run Codex review for sprint-close signal**

Run:
```bash
bash /Users/okgoogle13/.codex/skills/codex-review/scripts/codex-state.sh set phase implementing
```

Then submit a fresh code review summary via the codex-review workflow and require a formal verdict before claiming the Figma/design lane complete.

- [ ] **Step 4: Commit the sprint closeout state**

Run:
```bash
git add TASKS.md DECISIONS.md
git commit -m "docs: close final design sprint gate"
```

Expected:
- a final closeout commit after verification, not before

---

**Self-review**

- Spec coverage: this plan covers the three remaining sprint threads discovered in the repo state and review log: control-surface truth, KR hygiene debt on live surfaces, and auth follow-through.
- Placeholder scan: no `TBD`/`TODO` placeholders remain; each task has concrete files and commands.
- Type consistency: task names, file paths, and verification commands match the current repo layout and active board.
