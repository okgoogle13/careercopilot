# Sprint Plan v3 → v4 Change History

> Archived from Part 1 of `careercopilot-sprint-plan-v4.md` per FIX-12.
> Sprint plan v5 replaces v4. See `plans/sprint-plan-v5.md`.

## Delta: v3 → v4 (Registry Integration)

The Skills Registry v6.1 changes every routing decision. Key corrections:

| v3 (Wrong) | v4 (Correct) | Why |
|---|---|---|
| `design-system-sidekick` as token validator | `token-orchestrator` skill | Registry names this as the DTCG + KR compliance tool |
| Generic Phase 4–5 Figma loop | `phase4-pipeline-orchestrator` skill | Registry has a dedicated deterministic 4a→4b→4c contract-gated orchestrator |
| "Implementation Blueprinting" improvised | `writing-plans` skill + `blueprint` skill | Registry has these as explicit process skills |
| Phase 5 ad hoc execution | `executing-plans` skill | Registry skill for plan execution with review/blocker escalation |
| Phase 1.1 no cleanup agent | `frontend-cleanup-manager` agent | Canonical agent for harvest readiness and drift review |
| Phase 1.5 manual sprint framing | `sprint-coordinator` skill | Registry skill for parallelising targets + evidence capture |
| Phase 6 generic verification | `migration-audit` + `compliance-dashboard` | Late-stage canonical gates per registry |
| No visual scoring gate | `vision-scorer-mcp` ≥90 gate | Registry mandates this as a hard gate |
| No M3 audit in verification | `m3-expressive-ui-evaluator` | Registry audit dimension for Phase 5–6 |
| No brand compliance check | `kerala-rage-brand-enforcer` `/brand-check` | Registry has `/brand-check` as a callable skill command |
