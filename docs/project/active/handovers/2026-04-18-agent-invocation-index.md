# Agent Invocation Index

**Date:** 2026-04-18
**Purpose:** Single entrypoint for invoking the staged external-agent and Codex workstreams in the intended order.

## Default Launch Surface

- Start with `docs/project/active/handovers/2026-04-18-operator-dispatch-sheet.md`

## Assignment Matrix

| Task | Assigned agent | Scope | Packet / authority doc | Expected output |
| --- | --- | --- | --- | --- |
| Batch 1 inventory | `Gemini` | Inventory only across canonical KR tokens, phase3 donor-reference files, and archive donor export | `docs/project/active/handovers/2026-04-18-gemini-inventory-packet.md` | Structured inventory memo |
| Batch 1 semantic review | `Claude Code` | Review-only approval/correction of token mappings and ambiguities | `docs/project/active/handovers/2026-04-18-claude-semantic-review-packet.md` | Review memo with approved mappings and ambiguities |
| Workstream A | `Claude Code` | Hex cleanup in `frontend/src/config/resume-constants.ts`, `frontend/src/features/landing/LandingPage.tsx`, `frontend/src/features/landing/LandingPage.module.css` | `docs/project/active/handovers/2026-04-18-claude-code-workstream-a-packet.md` | Bounded patch summary for those 3 files only |
| Workstream B | `Claude Code` | Deterministic chart-color residue cleanup in `frontend/src/features/analysis/Analysis.tsx` only | `docs/project/active/handovers/2026-04-18-claude-code-workstream-b-packet.md` | Bounded patch summary for `Analysis.tsx` only |
| Workstream C | `Codex` | Runtime-sensitive cleanup in `frontend/src/screens/06_opportunities/OpportunitiesDiscovery.tsx` only | `docs/project/active/handovers/2026-04-18-codex-workstream-c-packet.md` | In-workspace change + verification output |
| Workstream D | `Claude Code` | Bounded banned-token cleanup in `frontend/src/layouts/shared/Footer.tsx` and `frontend/src/layouts/shared/Sidebar.tsx` | `docs/project/active/handovers/2026-04-18-claude-code-workstream-d-packet.md` | Bounded patch summary for those 2 files only |
| Reintegration | `Codex` | Review returned patches, integrate accepted edits, run verification, update task board | This file + `docs/project/active/plans/2026-04-18-agent-delegation-execution-plan.md` + `docs/project/active/handovers/2026-04-18-token-translation-table.md` | Integrated repo changes + verification |

## Do Not Reassign

- `Gemini` is not implementing code.
- `Claude Code` is not implementing code in this stage.
- `Claude Code` does not touch runtime-sensitive `OpportunitiesDiscovery.tsx`.
- `Codex` does not delegate reintegration authority.
- No two agents share the same writable file set in the same batch.

## Recommended Order

1. `Gemini` inventory pass — user-reported complete
2. `Claude Code` semantic review pass
3. `Claude Code` Workstream A
4. `Claude Code` Workstream B
5. `Codex` Workstream C
6. `Claude Code` Workstream D
7. `Codex` integration and verification in this workspace

## Model Guidance

Per `AGENTS.md`:
- `Gemini`: inventory/classification mode
- `Claude Code`: use **Sonnet** for semantic review; reserve **Opus** for final go/no-go review only
- `Claude Code`: use **Sonnet** for deterministic bounded transforms in Workstreams A/B/D
- `Codex`: integration, runtime-sensitive cleanup, and verification

## Gemini Prompt

Packet:
- `docs/project/active/handovers/2026-04-18-gemini-inventory-packet.md`

Copy-paste prompt:

```text
Use the packet at docs/project/active/handovers/2026-04-18-gemini-inventory-packet.md.

Follow its authority order, inspected files, constraints, and output format exactly.

Return only the structured memo requested in the packet.
```

## Claude Code Prompt

Packet:
- `docs/project/active/handovers/2026-04-18-claude-semantic-review-packet.md`

Copy-paste prompt:

```text
Use Sonnet for this review.

Open and follow the packet at docs/project/active/handovers/2026-04-18-claude-semantic-review-packet.md exactly.

This is review-only. Do not make code changes. Return the approved mapping corrections and ambiguities in the format required by the packet.
```

## Claude Code Prompt: Workstream A

Packet:
- `docs/project/active/handovers/2026-04-18-claude-code-workstream-a-packet.md`

Copy-paste prompt:

```text
Use Sonnet.

Use the packet at docs/project/active/handovers/2026-04-18-claude-code-workstream-a-packet.md.

Stay inside the writable file set and follow the forbidden-actions list exactly.

Return only the sections requested by the packet.
```

## Claude Code Prompt: Workstream B

Packet:
- `docs/project/active/handovers/2026-04-18-claude-code-workstream-b-packet.md`

Copy-paste prompt:

```text
Use Sonnet.

Use the packet at docs/project/active/handovers/2026-04-18-claude-code-workstream-b-packet.md.

Do not widen scope beyond the single writable file. Preserve Recharts behavior and do not replace chart constants with CSS vars.

Return only the sections requested by the packet.
```

## Codex Prompt: Workstream C

Packet:
- `docs/project/active/handovers/2026-04-18-codex-workstream-c-packet.md`

Copy-paste prompt:

```text
Execute Workstream C using the packet at docs/project/active/handovers/2026-04-18-codex-workstream-c-packet.md.

Read the listed runtime and screen-pairing context first. Stay inside the writable file set and run the required verification commands.

Return exactly the packet’s required format.
```

## Claude Code Prompt: Workstream D

Packet:
- `docs/project/active/handovers/2026-04-18-claude-code-workstream-d-packet.md`

Copy-paste prompt:

```text
Use Sonnet.

Use the packet at docs/project/active/handovers/2026-04-18-claude-code-workstream-d-packet.md.

This is a bounded shared-shell cleanup task. Do not guess on ambiguous nav-active or shape-token replacements; report them instead.

Return only the sections requested by the packet.
```

## Reintegration Prompt for Codex

Use after external agents return results:

```text
Reintegrate the returned agent outputs using docs/project/active/plans/2026-04-18-agent-delegation-execution-plan.md and docs/project/active/handovers/2026-04-18-token-translation-table.md.

Rules:
- Codex is the reintegration authority
- reject edits outside each packet’s writable set
- reject any new raw hex, --sys-*, donor surface vars, or route-exposure changes unless the packet explicitly allowed them
- run the narrowest relevant verification commands after integration
- update TASKS.md if a workstream is fully integrated
```
