# Phase 3: Physical Harvest & Decomposition

- [x] Locate and Analyze `ValidationDashboard.tsx` (prototype-features/)
- [x] De-quarantine and Move `ValidationDashboard.tsx`
- [x] Create implementation plan for Phase 3
- [x] Extract sub-components to `features/analysis/components/`
- [x] `ValidationStats.tsx`
- [x] `AuditLogList.tsx`
- [x] Integrate `SourceVerificationGrid` and `AuditLogList` into `ValidationDashboard.tsx`
- [x] Refactor `ValidationStats.tsx` for simplified data flow
- [x] Fix pre-commit hook failures (`prettier-frontend`)
- [x] Final visual and token compliance check for refined components
- [x] Update documentation and walkthrough with final harvest results
- [x] Complete prototype safety audit and generate report
- [x] Update prototype safety audit for latest commit (`4535a6b`)
- [x] Refine safety audit tone and focus (Architectural Drift)
- [x] Create `PROTOTYPE_GUARDRAILS.md` for AI agent guidance

# Phase 4: Experimental Support Integrations
- [ ] Implement Prototype Harvest Audit (Deterministic Gates)
  - [ ] Flag destructive operations and secret leakage
  - [ ] Prevent prototype shell/routing drift
- [ ] Implement Canonical-Owner Mapper
  - [ ] Inventory prototype surfaces
  - [ ] Map approved patterns to canonical owners (route-matrix)
- [ ] Implement Readiness Wrapper
  - [ ] Wrap `scripts/test-deployment.sh` and validations
  - [ ] Enforce `.env.local` config rules
- [ ] Implement KR Harvest Audit
  - [ ] Setup deterministic scan for zero-flora and tokens
  - [ ] Implement optional `--apply` codemod
- [ ] Implement Genkit Playground (Local Dev Utility)
  - [ ] Hook into `backend/app/api/endpoints/genkit.py`
- [ ] Implement Visual Drift "Diff-Auditor" (Optional)
  - [ ] Wire to canonical design truth and wireframes
