# Figma ↔ Code Sync — Split Task List
**Generated**: 2026-04-01  
**Branch**: `copilot/update-sprint-plan-transition`  
**Figma File Key**: `YPDj0edchIDXykYChSmCUd`

Splits all remaining sprint work into exactly two lanes so both agents can proceed with zero overlap friction.

---

## 🎨 LANE A — Figma Make Assistant Tasks

These tasks must be done **inside Figma** before the coding agent can unblock the corresponding code work.  
All items are ordered by urgency (blocking > high > medium).

### A-1 · BLOCKING — Export missing node IDs (7 surfaces)

The code agent cannot run any Figma sync or visual-compliance pass until these node IDs are in `docs/project/active/figma-sync-order.json`.

| Surface | Current `figma_node_id` | What to do in Figma |
|---------|------------------------|---------------------|
| `/auth` (AuthModal) | `MISSING` | Open file `YPDj0edchIDXykYChSmCUd` → select Auth page frame → copy node ID |
| `/profile` (ProfilePage) | `MISSING` | Select Profile page frame → copy node ID |
| `/docs` (Documents) | `MISSING` | Select Documents page frame → copy node ID |
| `/onboarding` | `MISSING` | Select Onboarding page frame → copy node ID |
| `/apply` (Quick Apply) | `MISSING` | Select Quick Apply frame → copy node ID |
| `/generation` (Studio) | `MISSING` | Select Generation/Studio frame → copy node ID |
| `/style-guide` | `MISSING` | Select Style Guide frame → copy node ID |
| `MigratedRouteLayout` (shared layout) | `MISSING` | Select Layout component → copy node ID |
| `Navigation / SolidaritySidebar` | `MISSING` | Select Sidebar component → copy node ID |

**Deliverable**: Paste all 9 node IDs into a comment on this PR OR update `figma-sync-order.json` directly.

---

### A-2 · HIGH — Verify token variable names match `--kr-color-*` CSS variables

The code uses these exact CSS variable names. Confirm they match your Figma variable names 1:1:

| CSS variable | Expected Figma variable |
|---|---|
| `--kr-color-charcoal-background-base` | `kr/color/charcoal/background/base` |
| `--kr-color-worker-ash-base` | `kr/color/worker-ash/base` |
| `--kr-color-solidarity-red-base` | `kr/color/solidarity-red/base` |
| `--kr-color-ink-gold-base` | `kr/color/ink-gold/base` |
| `--kr-color-kr-activist-smoke-green-base` | `kr/color/activist-smoke/green/base` |
| `--kr-color-stencil-yellow-base` | `kr/color/stencil-yellow/base` |
| `--kr-color-signal-green-base` | `kr/color/signal-green/base` |

**If any Figma variable name differs**, post the diff in a PR comment so the code agent can update `tokens.json` accordingly.  
**Source of truth**: `frontend/src/design/tokens/tokens.json` (DTCG format).

---

### A-3 · HIGH — Annotate Dashboard frame with asset slot IDs

`Dashboard.tsx` (`1:166`) has Figma-bound asset imports that must be replaced before code promotion.  
For each asset slot in the Dashboard Figma frame, add an annotation with the `asset_id` from `docs/manifests/kr-manifest.json`.

Slots to annotate:
- Hero illustration (currently `figma:asset/dashboard-hero-illustration.png`)
- Stats card background (currently `figma:asset/dashboard-stats-card.svg`)

**Deliverable**: Screenshot of annotated frame OR updated Figma component description with `kr-asset-id` values.

---

### A-4 · MEDIUM — Create/verify missing page frames for Batch 4 routes

These routes have `NEEDS_MIGRATION` status and no Figma frame yet:

| Route | Missing frame |
|---|---|
| `/onboarding` | Onboarding flow (multi-step) |
| `/apply` | Quick Apply single-page form |
| `/generation` | Tabbed Generation Panel (Cover Letter / KSC / Resume tabs) |

If frames already exist but with a different name, just share the node ID (see A-1 above).  
If frames need to be created, use the KR Solidarity template set:
- Placard for containers, Strike for primary CTAs, March for selects, Megaphone for modal overlays.

---

### A-5 · LOW — Add `figma_node_id` to `/design-sidekick` and `/asset-library` (Batch 5)

These are P3 dev surfaces — low urgency but needed before final M6 closeout.

---

## 💻 LANE B — Next Coding Agent Tasks

These are ordered by dependency (earlier = unblocked, later = needs Lane A items first).  
**Do NOT touch** `frontend/src/App.tsx` or `frontend/src/config/route-registry.ts` (Workstream 6 only).

### B-1 · UNBLOCKED — Resolve 3 NEEDS_MIGRATION routes (M4 Sprint)

Complete migration for `/apply`, `/generation`, `/onboarding`. These are blocked on App.tsx verification, not Figma.

**For each route**:
1. Verify the import in `frontend/src/App.tsx` points to the correct canonical feature file
2. Confirm `frontend/src/config/route-registry.ts` has the route entry with `prototype: false`
3. Run `cd frontend && npx tsc --noEmit` — must exit 0
4. Update `docs/project/active/canonical-routes.json` to set `status: "CANONICAL"` for that route
5. Update `docs/project/active/ORCHESTRATION_DASHBOARD.md` — add P11 row ✅ DONE

Files to check:
```
frontend/src/features/applications/ApplyQuick.tsx          → /apply
frontend/src/features/documents/components/TabbedGenerationPanel.tsx  → /generation
frontend/src/features/onboarding/OnboardingPage.tsx        → /onboarding
```

**Stop condition**: If tsc errors appear in files you did NOT modify, halt and document the blocker.

---

### B-2 · UNBLOCKED — Register 3 NEEDS_REGISTRY_ENTRY routes

These routes exist in App.tsx but are missing a `route-registry.ts` entry:

| Route | Owner component | Action |
|---|---|---|
| `/applications` | `features/applications/ApplicationTracker` | Add registry entry |
| `/lookout` | `screens/06_opportunities/OpportunitiesDiscovery` | Add registry entry |
| `/ingestion` | `features/ingestion/SmartIngestion` (or replacement) | Add registry entry |

After registering: run `node scripts/extract-routes.js` to verify the registry is in sync.

---

### B-3 · UNBLOCKED — Fix hardcoded hex in analysis feature

From P04 snapshot: `frontend/src/features/analysis/` has 1 file with hardcoded hex values.

1. Run `grep -rn '#[0-9a-fA-F]\{3,6\}' frontend/src/features/analysis/` to find it
2. Replace with the correct `--kr-color-*` token from `frontend/src/design/tokens/tokens.json`
3. Run `python3 scripts/design-validation/validate-tokens.py` to confirm clean
4. Run `cd frontend && npx tsc --noEmit`

---

### B-4 · BLOCKED ON A-1 — Update `figma-sync-order.json` with node IDs from Figma

Once Lane A task A-1 delivers the 9 missing node IDs:

1. Edit `docs/project/active/figma-sync-order.json` — replace each `"figma_node_id": "MISSING"` with the real ID
2. Run `node frontend/scripts/validate-governance-artifacts.mjs` — must return `ok: true`
3. Update `docs/project/active/implementation-plan.json` — mark blocked pages as `"status": "READY"`

---

### B-5 · BLOCKED ON A-2 — Sync token variables if any name mismatch found

If Lane A task A-2 reports Figma variable name mismatches:

1. Update `frontend/src/design/tokens/tokens.json` with the corrected variable name
2. Regenerate CSS: `python3 scripts/build-m3-tokens.py`
3. Verify output: `python3 scripts/design-validation/validate-tokens.py`
4. Run `cd frontend && npx tsc --noEmit`

---

### B-6 · BLOCKED ON A-3 — Replace Dashboard Figma asset imports with KR manifest IDs

Once Lane A task A-3 delivers the KR asset IDs:

1. Update `docs/project/active/frontend-source-of-truth-migration/sources/consolidated-reference/components/Dashboard.tsx` — replace `figma:asset/` comments with `kr-asset-id:` comments
2. Re-run `python3 scripts/derive-gap-fill-plan.py --route-id dashboard --json-out /tmp/dashboard.json`
3. Verify `promotion_eligibility` is now `eligible` (not `behavior_only`) if the assets are clean
4. Run governance tests: `python3 -m pytest tests/plans/ -v` — must be 18/18

---

### B-7 · FINAL — M6 Closeout verification (unblocked after B-1..B-3 complete)

1. `cd frontend && npx tsc --noEmit` — zero errors
2. `python3 -m pytest tests/plans/ -v` — 18/18
3. `node frontend/scripts/validate-governance-artifacts.mjs` — `ok: true`
4. `node scripts/kr/validate-manifest.mjs` — manifest valid
5. Update `docs/project/active/compliance-report.md` — add M6 gate result row
6. Update `docs/project/active/ORCHESTRATION_DASHBOARD.md` — add P15 final ✅ row

---

## Dependency Map

```
A-1 (node IDs) ──────────────────────────────────────────► B-4
A-2 (token names) ───────────────────────────────────────► B-5
A-3 (asset IDs) ─────────────────────────────────────────► B-6
A-4 (missing frames) ─────────────────────────────────────► B-1 (unblocks /onboarding /apply /generation)

B-1 (migrations) ─┐
B-2 (registry)    ├──────────────────────────────────────► B-7 (M6 closeout)
B-3 (hex fix)     ─┘
```

## Quick Handoff Summary

| Who | Do now (no blockers) | Wait for |
|-----|---------------------|----------|
| **Figma Make** | A-1 export node IDs · A-2 verify token names · A-3 annotate asset slots | Nothing |
| **Next Agent** | B-1 route migrations · B-2 registry entries · B-3 hex fix | A-1 for B-4 · A-2 for B-5 · A-3 for B-6 |
