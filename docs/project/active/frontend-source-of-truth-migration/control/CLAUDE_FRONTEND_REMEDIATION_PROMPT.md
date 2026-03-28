# Claude Code Prompt: Frontend Route Remediation And Source-Of-Truth Cleanup

## Objective

Execute a clean frontend remediation pass in the canonical CareerCopilot app. Your goal is to eliminate remaining broken or drifting frontend routes, restore a single source of route/component truth, and keep the design canon and migration skill docs aligned with the current runtime.

Do not do a broad rewrite. Do bounded remediation against the live runtime and the migration control documents.

## Mandatory Inputs

Read and obey these first:

- `.claude/skills/route-migration/SKILL.md`
- `docs/design/01_CANON.md`
- `docs/design/02_SYSTEM.md`
- `docs/design/03_COMPONENTS.md`
- `frontend/src/App.tsx`
- `frontend/src/config/route-registry.ts`
- `docs/manifests/routes.json`
- `tools/scripts/scan-routes.ts`
- `tools/ci/check-route-integrity.ts`
- `tools/ci/check-screen-pairs.ts`

Also use these migration references when needed:

- `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
- `docs/project/active/frontend-source-of-truth-migration/control/archive/route-matrix.md`
- `docs/project/active/frontend-source-of-truth-migration/analysis/tokens-first-gap-fill-workflow.md`
- `docs/project/active/frontend-source-of-truth-migration/control/COMET-MANIFEST.md`
- `frontend/QUARANTINE - HARVESTED PROTOTYPE FEATURES/REMEDIATION_REPORT.md`
- `frontend/QUARANTINE - HARVESTED PROTOTYPE FEATURES/PROTOTYPE_AUDIT_LOG.md`

## Authority Order

Use this order of truth. Never invert it.

1. `frontend/src/App.tsx` for live route reachability and layout ownership
2. `frontend/src/config/route-registry.ts` for declared route metadata and mode coverage
3. `docs/manifests/routes.json` as a derived artifact only
4. route-matrix artifacts and migration control docs for ownership intent
5. quarantine / prototype support-reference code last

Prototype `/prototype/*` routes are support-reference only. They are not canonical product truth.

## Token-Efficient MCP Strategy

Use the `flash-sidekick` MCP server explicitly. Do not rely on vague “summarize this” behavior. Prefer these exact tool calls and sequence:

### Required MCP invocation order

1. Multi-file drift pass first:

```text
flash-sidekick.batch_file_analysis({
  "analysis_type": "route_drift_and_source_of_truth",
  "file_paths": [
    "frontend/src/App.tsx",
    "frontend/src/config/route-registry.ts",
    "docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json",
    "docs/project/active/frontend-source-of-truth-migration/control/archive/route-matrix.md",
    "docs/manifests/routes.json"
  ]
})
```

2. Long-doc compression before full local reads:

```text
flash-sidekick.quick_summarize({
  "text": "<paste only the specific long doc section you need summarized>"
})
```

3. Large-file structure extraction when a file is too big to read directly:

```text
flash-sidekick.generate_idf({
  "code": "<contents of the large file being inspected>"
})
```

4. Post-patch quality check on touched runtime files:

```text
flash-sidekick.analyze_code_quality({
  "language": "typescript",
  "code": "<contents of each materially patched TS/TSX file>"
})
```

5. Only if route ownership or cleanup sequencing is still ambiguous after the canonical reads:

```text
flash-sidekick.consult_pro({
  "query": "Resolve remaining ambiguity in route ownership / cleanup ordering for the listed files",
  "context": "Summaries from App.tsx, route-registry.ts, route-matrix.json, and cleanup report"
})
```

### Mandatory MCP usage rules

- Start with `batch_file_analysis` before broad local reading.
- Use `quick_summarize` or `generate_idf` on long docs or large source files before pasting them into context.
- Run `analyze_code_quality` after every meaningful TS/TSX patch batch.
- Do not spend tokens on old prototype/quarantine files unless live runtime or route-matrix evidence still points at them.
- If a local read is still needed after MCP analysis, read only the narrowed file/section the MCP output identifies.

## Required Tasks

### 1. Route integrity cleanup

- Ensure every route reachable from `frontend/src/App.tsx` is represented correctly in `frontend/src/config/route-registry.ts`
- Ensure `docs/manifests/routes.json` matches the current runtime by regenerating it from `tools/scripts/scan-routes.ts`
- Fix any stale import paths, layout drift, redirect drift, or route entries that no longer match the live app
- Remove or downgrade stale prototype assumptions such as retired `/kr/*` route ownership if they still linger in canonical control files

### 2. Single-source-of-truth cleanup

- Ensure no canonical product route is simultaneously treated as owned by multiple frontend surfaces without explicit support-reference wording
- Keep canonical runtime owners in `frontend/src/features/**` or documented legacy exceptions already reachable from `App.tsx`
- Keep derived artifacts derived; do not let them become authority over runtime truth

### 3. Prototype quarantine hygiene

- Ensure quarantine support-reference files do not break the frontend compiler or route checks
- If the runtime still exposes `/prototype/*`, make sure it does so through a safe canonical runtime surface under `frontend/src/**`
- Do not promote raw quarantine TSX into canonical runtime truth

### 4. Design canon alignment

Update the design docs only where they are stale against the current runtime/token/component truth:

- `docs/design/01_CANON.md`
- `docs/design/02_SYSTEM.md`
- `docs/design/03_COMPONENTS.md`

Focus on:

- current semantic token names
- current shape token names
- current public-vs-internal component naming
- current route-authority wording

Do not do speculative canon rewrites. Patch only stale or contradictory sections.

### 5. Route-migration skill alignment

Ensure `.claude/skills/route-migration/` points to the current migration artifact paths rather than stale control paths. Update supporting references/checklists if needed.

## Required Verification

Run these after patching:

```bash
npx tsx tools/scripts/scan-routes.ts
npx tsx tools/ci/check-route-integrity.ts
npx tsx tools/ci/check-screen-pairs.ts
(cd frontend && yarn type-check)
```

If you materially change runtime TSX beyond route support surfaces, also run:

```bash
(cd frontend && yarn lint)
```

## Guardrails

- No prototype shell promotion
- No direct promotion of quarantine TSX into canonical runtime truth
- No route invention
- No hardcoded token aliases when the current semantic token exists
- No broad refactors outside route/remediation/doc drift
- Do not change route ownership unless the runtime and migration docs both justify it

## Deliverable Format

Return:

1. files changed
2. exact broken-route or drift issues fixed
3. verification results
4. remaining blockers, if any

If all checks pass, say so explicitly.
