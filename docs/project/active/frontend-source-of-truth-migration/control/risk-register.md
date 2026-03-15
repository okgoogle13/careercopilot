# Risk Register

| ID | Risk | Severity | Mitigation | Escalate after |
| --- | --- | --- | --- | --- |
| R1 | Mock-backed `/tracker` migration regresses current workflow during Step 3a | High | Require route tests, API-response mocks, and build-contract conformance before replacing the mock data path | 1 session |
| R2 | Non-auth `migration-audit` is invoked without benchmark coverage and blocks execution unexpectedly | Medium | Keep benchmark creation explicitly deferred unless `migration-audit` is intentionally chosen as an immediate route gate | 1 session |
| R3 | Worktree noise obscures the planning-to-execution handoff boundary | Medium | Keep `/tracker` as the single next active route and checkpoint planning/control artifacts before mixing in runtime implementation changes | 1 session |
| R4 | Skills or helper scripts are used beyond their approved scope during execution | Medium | Check `control/fit-for-purpose.md` before using any skill or script as a gate; treat Python governance tests as the stronger readiness signal | 2 days |
| R5 | `/kr/*` cleanup is pulled forward before replacement routes are verified | Medium | Defer route cleanup until Steps 3 and 4 produce verified live replacements and routing tests | 1 day |
