# Dev Server Cascade Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate all Tailwind `green-*` utility class usages from production code and remove the duplicate `design-tokens.css` import in `App.tsx`, so the dev server renders KR Solidarity tokens correctly with no SaaS-green bleed-through.

**Architecture:** The Tailwind config replaces the default color palette with KR tokens (`theme.colors`, not `extend`), but Tailwind's JIT still generates `green-*` classes when they appear in source files. Nine production files use raw `bg-green-*` / `text-green-*` / `border-green-*` classes — these are the entire cause of the green cascade. Each replacement maps to the nearest KR semantic token. Additionally, `App.tsx` imports `design/styles/design-tokens.css` directly, which `globals.css` already imports via `@import` — the duplicate is harmless but should be removed.

**Tech Stack:** React 18, TypeScript, Tailwind v4, KR Solidarity CSS custom properties (`--kr-color-*`)

---

## File Map

| File | Change |
|---|---|
| `frontend/src/App.tsx` | Remove duplicate `design-tokens.css` import |
| `frontend/src/features/analysis/components/feature/AnalysisTabContent.tsx` | Replace `Strong` level green classes with KR signal-green tokens |
| `frontend/src/features/analysis/components/SingleColumnResume.tsx` | Replace apply-suggestion button green classes |
| `frontend/src/features/analysis/components/TwoColumnResume.tsx` | Replace apply-suggestion button green classes (identical pattern) |
| `frontend/src/features/profile/components/ResumeUploader.tsx` | Replace success state green classes with KR ink-gold / charcoal |

---

## KR Token Mapping Reference

| Tailwind class | KR replacement | Rationale |
|---|---|---|
| `bg-green-900/40` | `bg-[color-mix(in_srgb,var(--kr-color-signal-green-steps-0)_40%,transparent)]` | Dark signal-green tint for "Strong" match bg |
| `border-green-500/30` | `border-[color-mix(in_srgb,var(--kr-color-signal-green-base)_30%,transparent)]` | Signal-green border at 30% opacity |
| `text-green-300` | `text-[var(--kr-color-signal-green-steps-4)]` | Light signal-green text |
| `bg-green-400` | `bg-[var(--kr-color-signal-green-base)]` | Signal-green dot |
| `shadow-[0_0_8px_rgba(74,222,128,0.5)]` | `shadow-[0_0_8px_color-mix(in_srgb,var(--kr-color-signal-green-base)_50%,transparent)]` | Signal-green glow |
| `bg-green-100 hover:bg-green-200` | `bg-[var(--kr-color-charcoal-background-steps-2)] hover:bg-[var(--kr-color-charcoal-background-steps-3)]` | Charcoal hover state for action buttons |
| `text-green-700` | `text-[var(--kr-color-ink-gold-base)]` | Ink gold for positive/confirm text |
| `text-green-600` | `text-[var(--kr-color-ink-gold-base)]` | Ink gold for success icon |
| `text-green-700` (success label) | `text-[var(--kr-color-ink-gold-base)]` | Ink gold for "Analysis Complete!" label |

---

## Task 1: Remove duplicate CSS import in App.tsx

**Files:**
- Modify: `frontend/src/App.tsx:14`

- [ ] **Step 1: Remove the duplicate import**

Open `frontend/src/App.tsx`. Find and delete line 14:
```ts
import './design/styles/design-tokens.css';
```
This file is already loaded by `globals.css` via `@import './design/styles/design-tokens.css'`. The duplicate causes no visible bug but is dead weight.

- [ ] **Step 2: Verify type-check still passes**

```bash
cd frontend && yarn type-check 2>&1 | tail -5
```
Expected: `Found 0 errors.`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/App.tsx
git commit -m "fix(css): remove duplicate design-tokens.css import from App.tsx"
```

---

## Task 2: Replace green classes in AnalysisTabContent.tsx

**Files:**
- Modify: `frontend/src/features/analysis/components/feature/AnalysisTabContent.tsx:31-34`

- [ ] **Step 1: Replace the Strong level styles object**

Find this block (around line 29):
```tsx
              Strong: {
                bg: 'bg-green-900/40',
                border: 'border-green-500/30',
                text: 'text-green-300',
                dot: 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]',
              },
```

Replace with:
```tsx
              Strong: {
                bg: 'bg-[color-mix(in_srgb,var(--kr-color-signal-green-steps-0)_40%,transparent)]',
                border: 'border-[color-mix(in_srgb,var(--kr-color-signal-green-base)_30%,transparent)]',
                text: 'text-[var(--kr-color-signal-green-steps-4)]',
                dot: 'bg-[var(--kr-color-signal-green-base)] shadow-[0_0_8px_color-mix(in_srgb,var(--kr-color-signal-green-base)_50%,transparent)]',
              },
```

- [ ] **Step 2: Verify type-check**

```bash
cd frontend && yarn type-check 2>&1 | tail -5
```
Expected: `Found 0 errors.`

- [ ] **Step 3: Verify no green-* classes remain in this file**

```bash
grep "green-" frontend/src/features/analysis/components/feature/AnalysisTabContent.tsx
```
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/features/analysis/components/feature/AnalysisTabContent.tsx
git commit -m "fix(tokens): replace Tailwind green classes in AnalysisTabContent with KR signal-green tokens"
```

---

## Task 3: Replace green classes in SingleColumnResume.tsx

**Files:**
- Modify: `frontend/src/features/analysis/components/SingleColumnResume.tsx:204`

- [ ] **Step 1: Replace the apply-suggestion button classes**

Find (around line 204):
```tsx
                            className="p-1 bg-green-100 hover:bg-green-200 text-green-700"
```

Replace with:
```tsx
                            className="p-1 bg-[var(--kr-color-charcoal-background-steps-2)] hover:bg-[var(--kr-color-charcoal-background-steps-3)] text-[var(--kr-color-ink-gold-base)]"
```

- [ ] **Step 2: Verify no green-* classes remain in this file**

```bash
grep "green-" frontend/src/features/analysis/components/SingleColumnResume.tsx
```
Expected: no output.

- [ ] **Step 3: Verify type-check**

```bash
cd frontend && yarn type-check 2>&1 | tail -5
```
Expected: `Found 0 errors.`

- [ ] **Step 4: Commit**

```bash
git add frontend/src/features/analysis/components/SingleColumnResume.tsx
git commit -m "fix(tokens): replace Tailwind green classes in SingleColumnResume with KR tokens"
```

---

## Task 4: Replace green classes in TwoColumnResume.tsx

**Files:**
- Modify: `frontend/src/features/analysis/components/TwoColumnResume.tsx:170`

- [ ] **Step 1: Replace the apply-suggestion button classes**

Find (around line 170):
```tsx
                                  className="p-1 bg-green-100 hover:bg-green-200 text-green-700"
```

Replace with:
```tsx
                                  className="p-1 bg-[var(--kr-color-charcoal-background-steps-2)] hover:bg-[var(--kr-color-charcoal-background-steps-3)] text-[var(--kr-color-ink-gold-base)]"
```

- [ ] **Step 2: Verify no green-* classes remain in this file**

```bash
grep "green-" frontend/src/features/analysis/components/TwoColumnResume.tsx
```
Expected: no output.

- [ ] **Step 3: Verify type-check**

```bash
cd frontend && yarn type-check 2>&1 | tail -5
```
Expected: `Found 0 errors.`

- [ ] **Step 4: Commit**

```bash
git add frontend/src/features/analysis/components/TwoColumnResume.tsx
git commit -m "fix(tokens): replace Tailwind green classes in TwoColumnResume with KR tokens"
```

---

## Task 5: Replace green classes in ResumeUploader.tsx

**Files:**
- Modify: `frontend/src/features/profile/components/ResumeUploader.tsx:166-169`

- [ ] **Step 1: Replace success state green classes**

Find (around line 166):
```tsx
              <div className="w-20 h-20 rounded-march bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-title-medium font-bold text-green-700">Analysis Complete!</p>
```

Replace with:
```tsx
              <div className="w-20 h-20 rounded-march bg-[var(--kr-color-charcoal-background-steps-2)] flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-[var(--kr-color-ink-gold-base)]" />
              </div>
              <p className="text-title-medium font-bold text-[var(--kr-color-ink-gold-base)]">Analysis Complete!</p>
```

- [ ] **Step 2: Verify no green-* classes remain in this file**

```bash
grep "green-" frontend/src/features/profile/components/ResumeUploader.tsx
```
Expected: no output.

- [ ] **Step 3: Verify type-check**

```bash
cd frontend && yarn type-check 2>&1 | tail -5
```
Expected: `Found 0 errors.`

- [ ] **Step 4: Commit**

```bash
git add frontend/src/features/profile/components/ResumeUploader.tsx
git commit -m "fix(tokens): replace Tailwind green classes in ResumeUploader with KR ink-gold tokens"
```

---

## Task 6: Full verification pass

- [ ] **Step 1: Confirm zero green-* classes remain in production source**

```bash
grep -rn "bg-green\|text-green\|border-green\|ring-green\|from-green\|to-green" \
  frontend/src \
  --include="*.tsx" --include="*.ts" --include="*.css" \
  | grep -v node_modules | grep -v _reference | grep -v stories | grep -v "\.test\."
```
Expected: no output.

- [ ] **Step 2: Run drift checker**

```bash
cd frontend && python3 ../scripts/design-validation/check-design-drift.py 2>&1 | tail -10
```
Expected: `0 violations`

- [ ] **Step 3: Run type-check**

```bash
cd frontend && yarn type-check 2>&1 | tail -5
```
Expected: `Found 0 errors.`

- [ ] **Step 4: Run Jest**

```bash
cd frontend && NODE_OPTIONS='--experimental-vm-modules' yarn test --passWithNoTests 2>&1 | tail -10
```
Expected: all tests pass.

- [ ] **Step 5: Start dev server and visually confirm**

```bash
cd frontend && yarn dev
```

Open `http://localhost:5173` and check:
- Background: dark charcoal (not white, not green)
- Sidebar: KR dark — asphalt/charcoal tones, ink-gold accents
- Nav items: correct KR typography, no generic SaaS green active states
- `/analysis` Skill Gap section: "Strong" match dots show signal-green (teal-green), not Tailwind lime-green
- `/profile` upload success state: ink-gold checkmark, not green

- [ ] **Step 6: Commit verification note to handover**

```bash
git add -A
git commit -m "fix(tokens): eliminate all Tailwind green-* classes from production — cascade fix complete"
```
