# Route Migration Checklist: {ROUTE_NAME}

## 1. Authority Lock

- [ ] Confirm route record in `control/route-matrix.json`
- [ ] Confirm the human-readable route row in `control/archive/route-matrix.md`
- [ ] Confirm canonical runtime owner is reachable from `frontend/src/App.tsx`
- [ ] Confirm paired screen reference and backend capabilities
- [ ] Confirm this is canonical app work, not prototype support-reference work

**Validation**
```bash
npx tsx tools/ci/check-route-integrity.ts
```

---

## 2. Wireframe And Gap-Fill

- [ ] Run `python3 scripts/validate-wireframe-workflow.py`
- [ ] Run `python3 scripts/derive-gap-fill-plan.py --route-id {route-id}`
- [ ] Record selected reuse mode
- [ ] Record whether any support-reference TSX is `reference_only`, `behavior_only`, or blocked
- [ ] Stop if ownership or contract gaps remain unresolved

---

## 3. Route-Local Implementation

- [ ] Update only the canonical runtime owner for the route
- [ ] Keep route path unchanged unless route matrix explicitly says otherwise
- [ ] Use semantic tokens only
- [ ] Remove hardcoded colors, forbidden fonts, and deprecated aliases
- [ ] Keep public labels plain and user-facing
- [ ] Avoid prototype shell semantics and old migration-kit rollout patterns

**Validation**
```bash
(cd frontend && yarn type-check)
(cd frontend && yarn lint)
```

---

## 4. Closure Gates

- [ ] Run `token-enforcement`
- [ ] Run `migration-audit`
- [ ] Run `npx tsx tools/ci/check-route-integrity.ts`
- [ ] Run `npx tsx tools/ci/check-screen-pairs.ts`
- [ ] If support-influenced, complete the TSX identity gate from `control/archive/workflow.md`
- [ ] If route is part of broader readiness work, run `./scripts/test-deployment.sh`

---

## Final Route Status

Route: `{ROUTE_NAME}`
Runtime owner: `{RUNTIME_OWNER}`
Reuse mode: `{REUSE_MODE}`
Blocked: `{YES/NO}`
Ready for closure: `{YES/NO}`
Notes: `{NOTES}`
