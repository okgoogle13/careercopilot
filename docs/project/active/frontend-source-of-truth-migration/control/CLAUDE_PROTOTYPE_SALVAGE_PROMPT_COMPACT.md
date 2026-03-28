# Compact Claude Prompt: Prototype Salvage Pass (Expanded)

Execute the expanded salvage pass: 5 strategies, ~37 candidates, 10+ routes enriched.

Read first:

- `control/PROTOTYPE-SALVAGE-TRACKER.md` — **master tracker with all 5 strategy tables**
- `frontend/QUARANTINE - HARVESTED PROTOTYPE FEATURES/PROTOTYPE_AUDIT_LOG.md`
- `frontend/QUARANTINE - HARVESTED PROTOTYPE FEATURES/REMEDIATION_REPORT.md`
- `control/FRONTEND-CLEANUP-REPORT.md`
- `.claude/skills/route-migration/SKILL.md`
- `docs/design/01_CANON.md`, `02_SYSTEM.md`, `03_COMPONENTS.md`
- `frontend/src/App.tsx`, `frontend/src/config/route-registry.ts`

Prototype source (read-only reference):

- `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/`

Authority order:

1. `frontend/src/App.tsx`
2. `frontend/src/config/route-registry.ts`
3. current canonical destination under `frontend/src/**`
4. `PROTOTYPE-SALVAGE-TRACKER.md`
5. `PROTOTYPE_AUDIT_LOG.md`
6. prototype files last

## Execution order

```text
Phase 1 (parallel):  S1 — Behavior Seam Extraction (hooks/services, 11 files)
                      S3 — Type System Consolidation (3 files)
Phase 2:             S5 — Genkit Flow + Analysis UX (11 files)
Phase 3:             S2 — Template & Renderer Harvest (6 files)
Phase 4:             S4 — Route-Owned Page Upgrade (6 files)
```

Pre-flight: S4 requires `blueprint` for ambiguous routes. S5 requires backend
Genkit alignment check. S1/S3 have no pre-flight.

## Flash-sidekick MCP calls

```text
flash-sidekick.batch_file_analysis({
  "analysis_type": "prototype_salvage_candidate_review",
  "file_paths": [
    "docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md",
    "frontend/QUARANTINE - HARVESTED PROTOTYPE FEATURES/PROTOTYPE_AUDIT_LOG.md",
    "frontend/src/App.tsx",
    "frontend/src/config/route-registry.ts"
  ]
})
```

```text
flash-sidekick.generate_idf({"code":"<prototype source >200 lines>"})
flash-sidekick.quick_summarize({"text":"<long doc section>"})
flash-sidekick.analyze_code_quality({"language":"typescript","code":"<patched file>"})
flash-sidekick.consult_pro({"query":"<only if ambiguous>","context":"<summaries>"})
```

## Tasks

- resolve every row across all 5 strategy tables to `PORTED`, `ALREADY_CANONICAL`, `DISCARDED`, or explicit block
- **`PORTED` gate (all 5 required):** confirmed owner file exists · confirmed runtime gap · explicit transfer mode · `yarn type-check` passed + verification evidence recorded · tracker row updated with destination path
- port behavior/logic only — never import prototype files into runtime
- for blocked items (Firebase, Chrome, Genkit): extract independent logic, stub the dep, document what remains blocked
- do not create parallel owner surfaces or invent routes
- no client Genkit flows that duplicate backend flows
- update `PROTOTYPE-SALVAGE-TRACKER.md` and `PROTOTYPE_AUDIT_LOG.md` (reclassifications)
- update status/dashboard docs only if evidence changes

## Verify (after each strategy batch)

```bash
npx tsx tools/scripts/scan-routes.ts
npx tsx tools/ci/check-route-integrity.ts
npx tsx tools/ci/check-screen-pairs.ts
(cd frontend && yarn type-check)
```

If runtime TSX changed materially:

```bash
(cd frontend && yarn lint)
```

## Return per strategy

- strategy ID + rows resolved
- files created/changed
- behavior ported (bullets)
- verification results
- blocked items with named blockers

Final: total resolved, total blocked, exit criteria met (yes/no).
