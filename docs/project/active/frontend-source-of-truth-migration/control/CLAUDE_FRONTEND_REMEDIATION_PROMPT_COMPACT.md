# Compact Claude Prompt: Route Remediation

Use `.claude/skills/route-migration/SKILL.md` and fix frontend route drift in the canonical app.

Authority order:

1. `frontend/src/App.tsx`
2. `frontend/src/config/route-registry.ts`
3. `docs/manifests/routes.json` as derived only
4. route-matrix + migration control docs
5. quarantine prototype files last

Required files:

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

Flash-sidekick MCP calls:

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

```text
flash-sidekick.quick_summarize({"text":"<only the long section you need compressed>"})
flash-sidekick.generate_idf({"code":"<large source file contents when structure extraction is cheaper than a full read>"})
flash-sidekick.analyze_code_quality({"language":"typescript","code":"<patched TS/TSX file contents>"})
```

Use `flash-sidekick.consult_pro` only if route ownership is still ambiguous after canonical reads and the batch analysis result.

Tasks:

- align `route-registry.ts` to live routes in `App.tsx`
- regenerate `docs/manifests/routes.json`
- fix broken imports / stale route entries / prototype drift
- keep `/prototype/*` support-only and runtime-safe
- ensure quarantine code does not break type-check
- update only stale sections in `01_CANON.md`, `02_SYSTEM.md`, `03_COMPONENTS.md`
- update stale references inside `.claude/skills/route-migration/`

Do not:

- promote raw prototype TSX into runtime truth
- invent new routes
- let derived artifacts override runtime truth

Verify:

```bash
npx tsx tools/scripts/scan-routes.ts
npx tsx tools/ci/check-route-integrity.ts
npx tsx tools/ci/check-screen-pairs.ts
(cd frontend && yarn type-check)
```

Return:

- files changed
- issues fixed
- verification results
- remaining blockers
