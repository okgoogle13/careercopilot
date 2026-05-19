# Codebase Simplification — Phase 2

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Address 9 verified findings from repomix audits not captured in Phase 1, plus 2 carry-over fixes from the Codex execution review. Phase 1 plan: `docs/project/active/plans/2026-05-16-codebase-simplification-cleanup.md`.

**Branch:** `consolidation/active-branches-to-develop-2026-04-22`

---

## Carry-Over Fixes

### CO-1 — Fix useFeedData endpoint param bug
**File:** `frontend/src/hooks/useFeedData.ts`

Hook accepts `endpoint: string` in signature and dep array, but always calls `analyticsService.getDashboardStats()` — endpoint never routes to different data. All callers get the same data regardless of param.

- [ ] Run: `grep -r "useFeedData" frontend/src --include="*.tsx" --include="*.ts" -l`
- [ ] If all callers want analytics data: remove `endpoint` param from signature and dep array
- [ ] If endpoint should dispatch differently: replace `analyticsService.getDashboardStats()` with `apiClient.get<T[]>(endpoint)`
- [ ] Run `cd frontend && yarn tsc --noEmit` to confirm clean

### CO-2 — Deprecate run_endpoint_operation
**File:** `backend/app/api/endpoints/_shared.py`

Codex created 5 functions; `run_endpoint_operation` overlaps semantically with `run_endpoint` (both handle HTTPException passthrough + generic 500 wrapping). One will drift out of use.

- [ ] Add `# deprecated: use run_endpoint` comment directly above the `run_endpoint_operation` function definition
- [ ] No other changes — deletion deferred to next sprint once confirmed unused

---

## Track D — Frontend Code

### D1 — kerala-rage.css duplicate aliases
**File:** `frontend/src/design/styles/kerala-rage.css` (lines 28–70)

8 duplicate CSS variable aliases: both `--color-asphalt-black-base` and `--color-asphalt-black` alias the same `--kr-*` var; same pattern for 3 other color pairs and 3 shape pairs (`--radius-*`).

- [ ] Run grep to confirm no consumers reference the secondary alias names:
  ```bash
  grep -r "color-asphalt-black\b\|color-ink-gold\b\|color-solidarity-red\b\|color-concrete-grey\b\|radius-march\|radius-placard\|radius-strike" frontend/src --include="*.tsx" --include="*.ts" --include="*.css"
  ```
- [ ] For each pair, delete the secondary `--color-*` / `--radius-*` alias line (keep the `--kr-*`-named one)
- [ ] Run `cd frontend && yarn tsc --noEmit`

### D2 — solidarity-tokens.ts dead code
**File:** `frontend/src/design/tokens/solidarity-tokens.ts`

246-line generated Tailwind patch file with color and shape token mappings. Zero imports in codebase.

- [ ] Confirm zero imports: `grep -r "solidarity-tokens" frontend/src --include="*.ts" --include="*.tsx"`
- [ ] If zero: `rm frontend/src/design/tokens/solidarity-tokens.ts`
- [ ] If imported somewhere: defer and add `# load-bearing: imported by X` comment, do not delete

### D3 — useFileUpload non-functional error state
**File:** `frontend/src/hooks/useFileUpload.ts`

`const [error] = useState<Error | null>(null)` — destructures only the value, never the setter. State can never change from null. Returned in hook output but permanently broken.

- [ ] Run: `grep -r "useFileUpload" frontend/src --include="*.tsx" --include="*.ts"`
- [ ] Check if callers read the `error` return value
- [ ] If callers use `error`: add `setError` to destructure and call it in the hook's catch block(s)
- [ ] If callers don't use `error`: remove `error` from the hook's return object
- [ ] Run `cd frontend && yarn tsc --noEmit`

### D4 — userStore silent error swallowing
**File:** `frontend/src/stores/userStore.ts` (lines 96–105)

`checkMaster` catch block silently falls back to cached value with no logging, no error state, no rethrow. Network failures are invisible.

- [ ] Add `console.error('[userStore] checkMaster failed:', e)` as first line of the catch block
- [ ] Add an `error` flag to store state (e.g., `checkMasterError: boolean`) and set it to `true` in the catch block
- [ ] Do NOT rethrow — fallback to cached value is intentional behaviour
- [ ] Run `cd frontend && yarn tsc --noEmit`

### D5 — services/api.ts direct fetch calls
**File:** `frontend/src/services/api.ts` (lines 164, 192, 227, 241)

4 direct `fetch(...)` calls in the `realApi` object bypass the centralized `apiClient`. No auth headers attached, no consistent error handling.

- [ ] For each of the 4 `fetch(...)` calls, replace with `apiClient.get<T>(path)` or `apiClient.post<T>(path, body)` from `frontend/src/api/apiClient.ts`
- [ ] Remove the manual `.then(r => r.json())` chains — `apiClient` returns typed data directly
- [ ] Run `cd frontend && yarn tsc --noEmit`
- [ ] Manually test the 4 affected endpoints to confirm auth headers are attached

### D6 — authService.ts untyped params
**File:** `frontend/src/api/authService.ts` (lines 17, 31)

`login(credentials: any)` and `register(userData: any)` — 2 input params typed as `any`.

- [ ] Define inline types (or import from a types file if one exists):
  ```typescript
  type LoginCredentials = { email: string; password: string };
  type RegisterPayload = { email: string; password: string; name?: string };
  ```
- [ ] Verify field names match the actual API contract before committing
- [ ] Replace `any` with these types in both function signatures
- [ ] Run `cd frontend && yarn tsc --noEmit`

### D7 — getUserStats mock fallback
**File:** `frontend/src/services/api.ts`

`realApi.getUserStats()` always returns `mockApi.getUserStats()` — no real backend call exists.

- [ ] Run: `grep -r "user.*stats\|getUserStats" backend/app --include="*.py"`
- [ ] If backend endpoint exists: implement real `apiClient.get<UserStats>('/api/users/stats')` call
- [ ] If backend endpoint does not exist: add explicit `// TODO: backend endpoint not implemented — returns mock` comment to make it intentional, not accidental. Do NOT implement a stub.

---

## Track E — Docs Taxonomy

### E1 — docs/other/ reorganisation
**Directory:** `docs/other/` — 113 files, unorganized catch-all

- [ ] Run `ls docs/other/` and categorize files into:
  - Design specs + wireframes → `docs/design/`
  - Audit reports → `.claude/reports/`
  - CI/CD / infrastructure docs → `docs/infrastructure/`
  - Project/accessibility audits → `docs/project/`
  - Superseded / no clear home → delete after confirming not referenced
- [ ] Move files in batches by category
- [ ] Verify no internal links break after moves

---

## Out of Scope

| Item | Reason |
|------|--------|
| KrIcon.tsx hex values | Confirmed clean — no hex values present |
| Grit overlay ×4 | All 4 variants are actively used; not dead code |
| motion-presets/tokens split | Intentional: JSON tokens + TS presets are separate concerns |
| ScaffoldInput 11-prop interface | Borderline, not a blocking simplification issue |
| consolidated-hifi-wireframes.md | Exists at correct location (`docs/design/hifi/`) |
| CACHE_STRATEGY.md dual-copy | Resolved — only `docs/infrastructure/` copy exists |

---

## Verification

```bash
# TypeScript clean after D1–D6
cd frontend && yarn tsc --noEmit 2>&1 | tail -20

# Confirm solidarity-tokens.ts has no imports (before D2 delete)
grep -r "solidarity-tokens" frontend/src --include="*.ts" --include="*.tsx"

# Confirm alias names not referenced (before D1 delete)
grep -r "color-asphalt-black\b\|color-ink-gold\b\|color-solidarity-red\b\|color-concrete-grey\b\|radius-march\|radius-placard\|radius-strike" frontend/src

# Confirm getUserStats backend status (before D7)
grep -r "user.*stats\|getUserStats" backend/app --include="*.py"
```

---

## Execution Order

1. CO-1 — bug fix (highest risk, resolve first)
2. CO-2 — comment only (trivial)
3. D2 — delete dead file (low risk, grep first)
4. D6 — type 2 params (low risk)
5. D3, D4 — hook/store fixes (low risk)
6. D1 — CSS alias cleanup (run grep before delete)
7. D5 — fetch → apiClient (moderate, test after)
8. D7 — investigate backend, then comment or implement
9. E1 — docs reorganization (manual, last)
