# Prototype Harvest Blocker Remediation Implementation Plan

> **For agentic workers:** REQUIRED: Use `subagent-driven-development` (if subagents available) or `executing-plans` to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the concrete blocker conditions preventing `prototype_v2.0` from being treated as a harvest-prepared source folder.

**Architecture:** Treat the cloned prototype as a support/reference source, not a runtime source of truth. Fix the blocker set in two layers: first align source documentation and visible prototype cues to current contract-backed ownership, then create a migration-owned pattern catalog and verification record so harvest workers can use the folder safely without re-deciding ownership.

**Tech Stack:** Markdown docs, React/TypeScript prototype source, ripgrep, git, contract XML references, migration control docs

---

## Chunk 1: Documentation Quarantine

### Task 1: Rewrite the prototype README as support-reference guidance

**Files:**
- Modify: `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/README.md`
- Reference: `docs/project/active/frontend-source-of-truth-migration/control/COMET-MANIFEST.md`
- Reference: `docs/project/active/frontend-source-of-truth-migration/prototype-integration.md`

- [ ] **Step 1: Confirm the stale claims are present**

Run:
```bash
rg -n "react-router-dom|Firebase|Firestore|History API routing|/profile|/history|/components" docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/README.md
```

Expected: matches showing stale routing and Firebase-era architecture claims.

- [ ] **Step 2: Rewrite the README header and architecture section**

Replace the current execution-truth framing with:
- support/reference-only status
- `activeTab` prototype shell note
- current canonical owners live in the migration control docs and contracts
- extension/Firebase scaffolding is not a harvest target

- [ ] **Step 3: Re-run the audit**

Run:
```bash
rg -n "react-router-dom|History API routing|Firestore & Firebase Auth" docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/README.md
```

Expected: no matches for those exact stale claims.

- [ ] **Step 4: Commit**

```bash
git add docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/README.md
git commit -m "docs(prototype): quarantine stale prototype readme claims"
```

### Task 2: Rewrite prototype guidelines as a support-reference note, not route truth

**Files:**
- Modify: `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/guidelines.md`
- Reference: `docs/project/active/frontend-source-of-truth-migration/control/AI-STUDIO-PROMPT-PACK.md`
- Reference: `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-profile.xml`
- Reference: `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-documents.xml`

- [ ] **Step 1: Confirm stale route and tooling claims**

Run:
```bash
rg -n "react-router-dom|/job-match|/analysis/:jobId|/resume-builder/:jobId|/cover-letter/:jobId" docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/guidelines.md
```

Expected: matches showing obsolete route assumptions.

- [ ] **Step 2: Rewrite the route section**

Replace obsolete route claims with a compact note:
- prototype route names are support-only labels
- canonical route owners are defined by migration contracts
- use the current locked mapping from the manifest

- [ ] **Step 3: Re-run the audit**

Run:
```bash
rg -n "/job-match|/analysis/:jobId|/resume-builder/:jobId|/cover-letter/:jobId" docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/guidelines.md
```

Expected: no matches.

- [ ] **Step 4: Commit**

```bash
git add docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/guidelines.md
git commit -m "docs(prototype): align prototype guidelines to contract-backed routing"
```

## Chunk 2: Ownership And Platform Drift Cleanup

### Task 3: Fix voice ownership drift in prototype UI copy

**Files:**
- Modify: `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/pages/ImageStudioPage.tsx`
- Reference: `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-profile.xml`
- Reference: `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-settings.xml`

- [ ] **Step 1: Confirm the stale copy**

Run:
```bash
rg -n "Voice Profile in Settings|Settings\\." docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/pages/ImageStudioPage.tsx
```

Expected: match showing the CTA points users to Settings for voice profile ownership.

- [ ] **Step 2: Update the copy**

Change the CTA so it points to Profile as the voice-profile owner and describes Settings as secondary/configuration only if mentioned.

- [ ] **Step 3: Re-run the audit**

Run:
```bash
rg -n "Voice Profile in Settings|set up your Voice Profile in Settings" docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/pages/ImageStudioPage.tsx
```

Expected: no matches.

- [ ] **Step 4: Commit**

```bash
git add docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/pages/ImageStudioPage.tsx
git commit -m "fix(prototype): keep voice ownership on profile"
```

### Task 4: Remove extension-first cues from harvest-facing checklist surfaces

**Files:**
- Modify: `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/components/feature/GettingStartedChecklist.tsx`
- Modify: `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/README.md`
- Reference: `docs/project/active/frontend-source-of-truth-migration/prototype-integration.md`

- [ ] **Step 1: Confirm extension-specific cues**

Run:
```bash
rg -n "Install Extension|extension" docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/components/feature/GettingStartedChecklist.tsx docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/README.md
```

Expected: matches showing extension-first onboarding cues.

- [ ] **Step 2: Replace or quarantine the cues**

Use one of these approaches:
- replace extension checklist item with a neutral job-intake action, or
- clearly mark extension support as blocked from harvest and not part of the canonical workflow

- [ ] **Step 3: Re-run the audit**

Run:
```bash
rg -n "Install Extension" docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/components/feature/GettingStartedChecklist.tsx
```

Expected: no matches.

- [ ] **Step 4: Commit**

```bash
git add docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/components/feature/GettingStartedChecklist.tsx docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/README.md
git commit -m "fix(prototype): quarantine extension-first onboarding cues"
```

## Chunk 3: Harvest Catalog And Verification

### Task 5: Create a route-mapped prototype harvest pattern catalog

**Files:**
- Create: `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-PATTERN-CATALOG.md`
- Reference: `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/docs/prototype-to-canonical-mapping.md`
- Reference: `docs/project/active/frontend-source-of-truth-migration/control/IMPLEMENTATION-PLAN-PROTOTYPE-HARVEST-READINESS.md`
- Reference: `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-profile.xml`
- Reference: `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-analysis.xml`
- Reference: `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-tracker.xml`
- Reference: `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-opportunities.xml`
- Reference: `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-documents.xml`

- [ ] **Step 1: Gather source surfaces**

Run:
```bash
rg -n "ApplyQuickWorkspaceReference|ImageStudioPage|ProfileView|JobsWorklist|PastApplicationsReference|KanbanTracker|LibraryReferencePage" docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0 -g '!node_modules' -g '!dist'
```

Expected: source files for the six primary harvest candidate surfaces.

- [ ] **Step 2: Write the catalog**

For each route family, include:
- canonical route owner
- source file(s)
- reusable interior patterns
- blocked assumptions
- contract reference
- harvest notes

- [ ] **Step 3: Verify the catalog contains all route families**

Run:
```bash
rg -n "/profile|/analysis|/apply/quick|/tracker|/opportunities|/documents" docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-PATTERN-CATALOG.md
```

Expected: matches for all required route families.

- [ ] **Step 4: Commit**

```bash
git add docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-PATTERN-CATALOG.md
git commit -m "docs(migration): add prototype harvest pattern catalog"
```

### Task 6: Run the harvest-prep verification pass

**Files:**
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/IMPLEMENTATION-PLAN-PROTOTYPE-HARVEST-READINESS.md`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-BLOCKER-SPRINT.md`
- Reference: `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-PATTERN-CATALOG.md`

- [ ] **Step 1: Run the verification checks**

Run:
```bash
rg -n "react-router-dom|History API routing|Firestore & Firebase Auth" docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/README.md docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/guidelines.md
rg -n "Voice Profile in Settings|set up your Voice Profile in Settings" docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/pages/ImageStudioPage.tsx
rg -n "Install Extension" docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/components/feature/GettingStartedChecklist.tsx
```

Expected:
- no matches for stale routing/Firebase claims
- no matches for voice ownership drift
- no matches for extension-first checklist copy

- [ ] **Step 2: Update the readiness review**

Mark which blockers are resolved and change the folder verdict from `not harvest-ready now` to either:
- `harvest-prepared support/reference source`, or
- `still blocked`, if any verification check fails

- [ ] **Step 3: Update sprint status**

Increase readiness score only for verifiably closed blocker groups.

- [ ] **Step 4: Commit**

```bash
git add docs/project/active/frontend-source-of-truth-migration/control/IMPLEMENTATION-PLAN-PROTOTYPE-HARVEST-READINESS.md docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-BLOCKER-SPRINT.md
git commit -m "docs(migration): record prototype harvest blocker closure"
```

## Chunk 4: Frontend Source-Of-Truth Cleanup

### Task 7: Generate a frontend runtime-truth cleanup report with `frontend-cleanup-manager`

**Files:**
- Read: `frontend/src/App.tsx`
- Read: `frontend/src/config/route-registry.ts`
- Read: `docs/project/active/frontend-source-of-truth-migration/control/archive/route-matrix.json`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/FRONTEND-CLEANUP-REPORT.md`
- Reference: `.claude/agents/frontend-cleanup-manager.md`

- [ ] **Step 1: Inventory live route mounts and route metadata**

Run:
```bash
nl -ba frontend/src/App.tsx | sed -n '1,320p'
nl -ba frontend/src/config/route-registry.ts | sed -n '1,320p'
```

Expected:
- complete list of live mounts from `App.tsx`
- registry rules confirming production routes should resolve through `features/`

- [ ] **Step 2: Check for route/source drift**

Run:
```bash
rg -n "from './pages/|from './features/|from './prototype-features/" frontend/src/App.tsx
rg -n "paired_runtime_surface|route_cleanup|features/" docs/project/active/frontend-source-of-truth-migration/control/archive/route-matrix.json docs/project/active/frontend-source-of-truth-migration/control/archive/implementation-backlog.json
```

Expected:
- identify any live product route still mounted from `pages/`
- identify mismatches between route-matrix runtime surfaces and actual mounts
- identify prototype or duplicate surfaces still competing with canonical owners

- [ ] **Step 3: Use `ts-morph` or scripted reference checks when ownership is ambiguous**

Run:
```bash
rg -n "ts-morph|findReferences|Project\\(" frontend/scripts scripts tools -S
```

Expected:
- locate the repo-supported AST/reference tools for duplicate surface and unused export analysis

- [ ] **Step 4: Write the cleanup report**

Create `FRONTEND-CLEANUP-REPORT.md` with these sections:
- Routing Drift
- Surface Ownership Drift
- Shell Drift
- API Convergence Gaps
- Unused / Dead Candidates
- Safe Retirements
- Blockers
- Recommended next batch

The report must explicitly answer:
- which surface is the single canonical owner for each live product route
- which duplicate `pages/`, `features/`, legacy shell, or prototype surfaces are support-only
- which cleanup candidates require runtime proof before retirement

- [ ] **Step 5: Commit**

```bash
git add docs/project/active/frontend-source-of-truth-migration/control/FRONTEND-CLEANUP-REPORT.md
git commit -m "docs(migration): add frontend source-of-truth cleanup report"
```

### Task 8: Convert the cleanup report into bounded single-owner cleanup batches

**Files:**
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-BLOCKER-SPRINT.md`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/IMPLEMENTATION-PLAN-PROTOTYPE-HARVEST-READINESS.md`
- Reference: `docs/project/active/frontend-source-of-truth-migration/control/FRONTEND-CLEANUP-REPORT.md`
- Reference: `.claude/agents/frontend-cleanup-manager.md`

- [ ] **Step 1: Translate findings into bounded cleanup batches**

Create batch entries only for these areas:
- routing truth cleanup
- single-owner surface cleanup (`features/` vs `pages/`)
- shell cleanup
- safe quarantine/retirement of unreachable legacy surfaces

Each batch must name:
- canonical owner
- in-scope files
- non-goals
- runtime proof required before deletion or quarantine

- [ ] **Step 2: Add a single-source-of-truth gate**

Record an explicit gate in both control docs:
- no live product route may have competing `pages/` and `features/` owners
- `App.tsx` mount truth must agree with `route-registry.ts` and `route-matrix.json`
- prototype or quarantine surfaces may inform behavior, but may not remain competing owner candidates

- [ ] **Step 3: Prioritize first execution-safe cleanup batch**

The first batch should prefer:
- report-only ownership reconciliation
- safe retirement candidates with runtime proof
- no UI redesign
- no route invention
- no prototype-shell promotion

- [ ] **Step 4: Commit**

```bash
git add docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-BLOCKER-SPRINT.md docs/project/active/frontend-source-of-truth-migration/control/IMPLEMENTATION-PLAN-PROTOTYPE-HARVEST-READINESS.md
git commit -m "docs(migration): add frontend source-of-truth cleanup batches"
```

Plan complete and saved to `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-BLOCKER-IMPLEMENTATION-PLAN.md`. Ready to execute?

## Chunk 5: Terminal Closeout And Migration Workspace Dissolution

### Task 9: Resync route-matrix truth to the live runtime before archive decisions

**Files:**
- Read: `frontend/src/App.tsx`
- Read: `frontend/src/config/route-registry.ts`
- Read/Modify: `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
- Read/Modify: `docs/project/active/frontend-source-of-truth-migration/control/archive/route-matrix.md`
- Read/Modify: `docs/project/active/frontend-source-of-truth-migration/control/status.md`
- Reference: `docs/manifests/routes.json`

- [ ] **Step 1: Reconcile route counts and path classes**

Run:
```bash
npx tsx tools/scripts/scan-routes.ts
npx tsx tools/ci/check-route-integrity.ts
```

Expected:
- `docs/manifests/routes.json` reflects all live paths from `App.tsx`
- route-matrix artifacts explicitly classify every live path as one of:
  - canonical product route
  - support-only route
  - redirect
  - internal tool
  - quarantine prototype route

- [ ] **Step 2: Remove stale route-matrix drift**

The route-matrix artifacts must no longer undercount live runtime paths or imply that old route totals are still current.

Record explicitly:
- which paths are canonical product truth
- which paths are redirects only
- which paths are internal/support-only and excluded from product planning

- [ ] **Step 3: Update status metrics**

`control/status.md` must stop claiming stale route totals and must state the current live path count plus the planning subset count.

### Task 10: Create a canonical destination map for every retained migration artifact

**Files:**
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/FRONTEND-CLEANUP-REPORT.md`
- Modify: `docs/project/active/frontend-source-of-truth-migration/README.md`
- Reference: `frontend/src/components/**`
- Reference: `frontend/src/features/**`
- Reference: `docs/design/**`

- [ ] **Step 1: Add a destination-map section to the cleanup report**

For every migration artifact class that survives, record its permanent home:
- runtime route code → `frontend/src/features/**` or approved legacy runtime location
- shared component primitives → `frontend/src/components/ui/**`
- route-family design references worth retaining → `frontend/src/screens/**` or `docs/design/**`
- support-reference evidence worth retaining → archive location only, never runtime
- obsolete migration-only planning docs → archive or delete

- [ ] **Step 2: Add a folder end-state note to the migration README**

`README.md` must state that this folder is temporary program-control infrastructure and define the terminal condition for leaving Active state:
- surviving runtime/code artifacts have canonical homes outside this folder
- the route matrix is synchronized to live runtime truth
- no runtime code imports from `docs/project/active/frontend-source-of-truth-migration/**`
- the remaining contents are either archived control history or deleted

### Task 11: Prove the main frontend no longer depends on migration-workspace code

**Files:**
- Read: `frontend/src/**`
- Read: `docs/project/active/frontend-source-of-truth-migration/**`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/FRONTEND-CLEANUP-REPORT.md`

- [ ] **Step 1: Run import/reference proof**

Run:
```bash
rg -n "frontend-source-of-truth-migration|control/archive|sources/consolidated-reference|sources/prototype_v2.0" frontend/src frontend/package.json frontend/vite.config.ts frontend/tsconfig.json -S
```

Expected:
- no live runtime imports from the migration workspace
- any remaining references are docs-only, test-only, or explicitly quarantined

- [ ] **Step 2: Record any exceptions**

If any runtime dependency on migration-workspace files remains, mark closeout as blocked until that dependency is moved to a canonical home.

### Task 12: Define the final archive/delete gate for `frontend-source-of-truth-migration`

**Files:**
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/pm/phase-plan.yaml`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/status.md`
- Modify: `docs/project/active/frontend-source-of-truth-migration/README.md`

- [ ] **Step 1: Add a final phase**

Add an explicit terminal phase after prototype-harvest prep:
- route-matrix/runtime resync complete
- canonical destination map complete
- no live frontend imports from migration workspace
- remaining docs split into:
  - retained archive/control history
  - delete candidates

- [ ] **Step 2: Define dissolution semantics**

The phase must state that the end state is not “leave the active migration folder around forever”.

The end state is:
- canonical runtime code lives under `frontend/src/**`
- canonical design canon lives under `docs/design/**`
- canonical route/runtime metadata lives with the main app’s maintained control artifacts
- this folder either moves to archive/history status or is reduced to a minimal retained record

- [ ] **Step 3: Commit**

```bash
git add docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-BLOCKER-IMPLEMENTATION-PLAN.md docs/project/active/frontend-source-of-truth-migration/control/pm/phase-plan.yaml docs/project/active/frontend-source-of-truth-migration/control/status.md docs/project/active/frontend-source-of-truth-migration/README.md
git commit -m "docs(migration): add terminal closeout and archive phase"
```
