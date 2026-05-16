# Operator Dispatch Sheet

| Run now | Agent | Packet | Writable files | Expected return |
| --- | --- | --- | --- | --- |
| 1 | `Gemini` | `docs/project/active/handovers/2026-04-18-gemini-inventory-packet.md` | None | Structured inventory memo |
| 2 | `Claude Code` | `docs/project/active/handovers/2026-04-18-claude-semantic-review-packet.md` | None | Review memo with approved mappings and ambiguities |
| 3 | `Claude Code` | `docs/project/active/handovers/2026-04-18-claude-code-workstream-a-packet.md` | `frontend/src/config/resume-constants.ts`<br>`frontend/src/features/landing/LandingPage.tsx`<br>`frontend/src/features/landing/LandingPage.module.css` | Bounded patch summary for Workstream A only |
| 4 | `Claude Code` | `docs/project/active/handovers/2026-04-18-claude-code-workstream-b-packet.md` | `frontend/src/features/analysis/Analysis.tsx` | Bounded patch summary for Workstream B only |
| 5 | `Codex` | `docs/project/active/handovers/2026-04-18-codex-workstream-c-packet.md` | `frontend/src/screens/06_opportunities/OpportunitiesDiscovery.tsx` | Local implementation plus verification output |
| 6 | `Claude Code` | `docs/project/active/handovers/2026-04-18-claude-code-workstream-d-packet.md` | `frontend/src/layouts/shared/Footer.tsx`<br>`frontend/src/layouts/shared/Sidebar.tsx` | Bounded patch summary for Workstream D only |
| 7 | `Codex` | `docs/project/active/handovers/2026-04-18-agent-invocation-index.md` | Only accepted returned files | Integrated changes plus verification |

## Hard Rules

- `Gemini` does not edit code.
- `Claude Code` does not edit code in this stage.
- `Claude Code` does not touch `frontend/src/screens/06_opportunities/OpportunitiesDiscovery.tsx`.
- `Codex` is the only reintegration authority.
- No agent may edit files outside its listed writable set.
