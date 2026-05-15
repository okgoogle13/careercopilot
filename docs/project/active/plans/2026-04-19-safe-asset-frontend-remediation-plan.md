# Safe Asset and Frontend Remediation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` (recommended) or `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the real `KR-SOLID-096` asset placement mismatch without touching live frontend component structure or introducing build/runtime regressions.

**Architecture:** Keep the current frontend component layout intact. Treat the previous handover as partially stale. Execute one narrow asset relocation change set that updates the filesystem, manifest-backed metadata, and runtime URL consumers atomically, then verify with frontend typecheck/build plus targeted path checks.

**Tech Stack:** React 18, TypeScript, Vite, static public assets, manifest-backed hero composition data.

---

## Scope Guardrails

- Do not move or archive any live `frontend/src/components/kerala-rage/*` components.
- Do not re-run HeroArt or `hero.layers.json` migration work; those files already live under `frontend/src/`.
- Do not rename `asset-packages/KR-SOLID-100` through `KR-SOLID-105`; those IDs are already normalized.
- Do not change route exposure in `frontend/src/App.tsx` or `frontend/src/config/route-registry.ts`.
- Keep the existing `frontend/public/assets/templates/README.md` unless a separate documentation task explicitly changes it.

## Current Reality Snapshot

- `frontend/src/components/HeroArt.tsx` and `frontend/src/hero/hero.layers.json` are already in canonical frontend locations.
- `frontend/src/components/kerala-rage/index.ts` still exports `KanbanBoard`, `UnifiedColumn`, `EditorSplitPane`, and `ManifestoCard`.
- Runtime views still import those exports:
  - `frontend/src/layouts/KrDarkShell/views/KrDarkKanban.tsx`
  - `frontend/src/layouts/KrDarkShell/views/KrDarkSearch.tsx`
  - `frontend/src/layouts/KrDarkShell/views/KrDarkLanding.tsx`
- `frontend/src/features/landing/LandingPage.tsx` hardcodes the current `uncategorized` protest-tram asset URL.
- `frontend/public/assets/kr-solidarity-manifest.json` still points `KR-SOLID-096` at `/assets/uncategorized/...`.
- `frontend/public/assets/kr-solidarity-hero-registry.json` references `KR-SOLID-096` by `asset_id`, so registry verification still matters after the manifest/path move.

---

### Task 1: Freeze Unsafe Workstreams

**Files:**
- Review only: `docs/project/active/handovers/2026-04-19-asset-structure-remediation-plan.md`
- Review only: `frontend/src/components/kerala-rage/index.ts`
- Review only:
  - `frontend/src/layouts/KrDarkShell/views/KrDarkKanban.tsx`
  - `frontend/src/layouts/KrDarkShell/views/KrDarkSearch.tsx`
  - `frontend/src/layouts/KrDarkShell/views/KrDarkLanding.tsx`

- [ ] Confirm that component-archive work is out of scope because live imports still exist.

Run:
```bash
rg -n "KanbanBoard|UnifiedColumn|ManifestoCard|EditorSplitPane" frontend/src/layouts frontend/src/components/kerala-rage
```

Expected:
- Non-zero matches in runtime views and the barrel export.

- [ ] Record the decision in the implementation notes for the execution PR or handoff:
  - Workstream 1 from the old handover is already satisfied.
  - Workstream 2 is unsafe because it targets live imports.
  - Workstream 3 is stale/no-op.
  - Workstream 4 is already satisfied.
  - Only Workstream 5 has a real repo action item.

- [ ] Do not edit code in this task.

---

### Task 2: Move `KR-SOLID-096` to Its Canonical Street Category

**Files:**
- Modify: `frontend/public/assets/uncategorized/kr-solidarity__uncategorized__uncategorized--textless-protest-tram--v1.png`
- Modify: `frontend/public/assets/kr-solidarity/street/`
- Modify: `frontend/public/assets/kr-solidarity-manifest.json`
- Review: `frontend/public/assets/kr-solidarity-hero-registry.json`

- [ ] Move the asset file with `git mv`.

Run:
```bash
git mv \
  frontend/public/assets/uncategorized/kr-solidarity__uncategorized__uncategorized--textless-protest-tram--v1.png \
  frontend/public/assets/kr-solidarity/street/kr-solidarity__street__protest--textless-protest-tram--v1.png
```

Expected:
- Git reports a rename, not delete-plus-add.

- [ ] Update the `KR-SOLID-096` manifest entry so metadata matches the new category and path.

Required manifest changes:
- `category`: `street`
- `layer`: `protest`
- `file_path`: `/assets/kr-solidarity/street/kr-solidarity__street__protest--textless-protest-tram--v1.png`

- [ ] Review the hero registry entry for `KR-SOLID-096`.

Run:
```bash
rg -n '"asset_id": "KR-SOLID-096"|textless-protest-tram|uncategorized' \
  frontend/public/assets/kr-solidarity-hero-registry.json \
  frontend/public/assets/kr-solidarity-manifest.json
```

Expected:
- Manifest no longer points to `/assets/uncategorized/...`.
- If the registry contains only `asset_id` references and human-readable text, update only any stale descriptive text.
- Do not invent a new registry path field if one does not already exist.

---

### Task 3: Update Runtime Consumers Atomically

**Files:**
- Modify: `frontend/src/features/landing/LandingPage.tsx`
- Review:
  - `frontend/src/design/hero/manifestLoader.ts`
  - `frontend/src/design/hero/heroRegistry.ts`
  - any additional files returned by targeted grep

- [ ] Replace the hardcoded landing-page hero URL with the new canonical street path.

Target replacement:
```ts
const imgHero =
  '/assets/kr-solidarity/street/kr-solidarity__street__protest--textless-protest-tram--v1.png';
```

- [ ] Search for any remaining references to the old filename or `/assets/uncategorized/` path.

Run:
```bash
rg -n "textless-protest-tram|/assets/uncategorized/" frontend/src frontend/public/assets scripts docs/project/active
```

Expected:
- Remaining hits are either historical docs/handoffs or intentionally archived references.
- No live frontend runtime file should still point at the old `uncategorized` asset path.

- [ ] Do not change unrelated asset URLs while touching these files.

---

### Task 4: Verify Build Safety and Asset Integrity

**Files:**
- Verify: `frontend/public/assets/kr-solidarity-manifest.json`
- Verify: `frontend/src/features/landing/LandingPage.tsx`
- Verify build output only; no source edits expected unless verification fails

- [ ] Run frontend typecheck.

Run:
```bash
(cd frontend && yarn type-check)
```

Expected:
- Exit code 0.

- [ ] Run frontend production build.

Run:
```bash
(cd frontend && yarn build)
```

Expected:
- Exit code 0.
- Pre-existing CSS warnings may still appear; treat them as baseline unless the asset change introduces new hard failures.

- [ ] Confirm no live source still references the old moved asset path.

Run:
```bash
rg -n "/assets/uncategorized/kr-solidarity__uncategorized__uncategorized--textless-protest-tram--v1.png" frontend/src frontend/public/assets
```

Expected:
- Zero matches.

- [ ] Confirm the new canonical asset path is present in both manifest-backed metadata and runtime code.

Run:
```bash
rg -n "/assets/kr-solidarity/street/kr-solidarity__street__protest--textless-protest-tram--v1.png" \
  frontend/src/features/landing/LandingPage.tsx \
  frontend/public/assets/kr-solidarity-manifest.json
```

Expected:
- Match in `LandingPage.tsx`.
- Match in `kr-solidarity-manifest.json`.

---

### Task 5: Close the Documentation Gap Without Reopening Stale Work

**Files:**
- Modify: `docs/project/active/handovers/2026-04-19-asset-structure-remediation-plan.md` or superseding handoff/PR notes
- Review: `docs/development/ASSET_GOVERNANCE.md`

- [ ] Add a short note in execution notes or PR summary stating:
  - HeroArt/frontend relocation already complete before this remediation.
  - Asset package zero-padding already normalized.
  - Templates README already exists.
  - Component archive suggestions were intentionally rejected because they would break live imports.

- [ ] Leave `docs/development/ASSET_GOVERNANCE.md` unchanged unless verification proves it is inaccurate.

Current governance statements already match repo reality:
- `frontend/src/hero/` is active.
- `frontend/public/assets/templates/` is reserved and documented.
- `asset-packages/KR-SOLID-{NNN}` uses 3-digit IDs without extra leading zeros above 99.

---

## Final Verification Checklist

- [ ] `git diff --stat` shows only the intentional asset move plus manifest/runtime/doc updates.
- [ ] No `frontend/src/components/kerala-rage/*` files were archived, deleted, or renamed.
- [ ] `frontend/public/assets/kr-solidarity-manifest.json` agrees with the moved file location.
- [ ] `frontend/src/features/landing/LandingPage.tsx` agrees with the moved file location.
- [ ] `(cd frontend && yarn type-check)` passes.
- [ ] `(cd frontend && yarn build)` passes.

## Suggested Commit Scope

Single commit:

```bash
git add \
  frontend/public/assets/uncategorized/kr-solidarity__uncategorized__uncategorized--textless-protest-tram--v1.png \
  frontend/public/assets/kr-solidarity/street/kr-solidarity__street__protest--textless-protest-tram--v1.png \
  frontend/public/assets/kr-solidarity-manifest.json \
  frontend/src/features/landing/LandingPage.tsx
git commit -m "fix(assets): reconcile KR-SOLID-096 canonical path"
```

If documentation notes are added in the same change set, include them in the commit; otherwise keep docs as a separate follow-up commit.
