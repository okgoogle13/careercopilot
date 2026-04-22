# Codex Execution Plans (ExecPlans)

This file defines how to create and maintain long-session execution plans for Career Copilot. It adapts OpenAI's Codex ExecPlan guidance to this repository's planning rules.

An ExecPlan is a living design-and-implementation document that lets a fresh agent or a human novice continue a complex task from the current working tree. It must describe the desired behavior, the relevant repository context, the sequence of edits, validation commands, recovery steps, and the decisions made while work proceeds.

## When to use an ExecPlan

Use an ExecPlan for complex features, significant refactors, migrations, route-promotion decisions, Figma-to-code convergence, branch consolidation, backend contract work, or any task that may span multiple sessions.

Do not create an ExecPlan for a tiny, local edit where the code, validation, and outcome are obvious. If a small task grows unclear or crosses multiple subsystems, stop and create or update an ExecPlan before continuing.

## Where ExecPlans live

Career Copilot stores active implementation plans in `docs/project/active/plans/`. Do not store active ExecPlans in `.claude/plans/`, `docs/superpowers/plans/`, or `.agent/`.

Use this filename pattern:

    docs/project/active/plans/YYYY-MM-DD-short-task-name.md

If a task needs a handover separate from the plan, save it in `docs/project/active/handovers/`.

## How to use this file

When authoring an ExecPlan, read this file first and follow it directly. Start from the skeleton below, then fill it in after inspecting the codebase and active authority documents.

When implementing an ExecPlan, do not stop to ask for generic next steps. Proceed through the next concrete milestone, update the plan as facts change, and keep the living sections current. If a decision changes the shape of the work, record the decision and rationale before continuing.

When discussing an ExecPlan, preserve the reasoning trail in the plan itself. A future agent should not need prior chat context to understand what changed or why.

## Non-negotiable requirements

Every ExecPlan must be self-contained. Include the repository context, assumptions, file paths, commands, and acceptance criteria needed to complete the work without relying on prior conversation.

Every ExecPlan must be a living document. Update `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds.

Every ExecPlan must produce demonstrably working behavior. A passing type check is useful, but the plan should also explain what behavior changed and how to observe it.

Every ExecPlan must define non-obvious terms in plain language. Do not assume a future reader knows local abbreviations, old branch history, Figma migration vocabulary, or hidden coordination context.

Every ExecPlan must follow the repo authority order in `AGENTS.md`. If design canon, active Figma coordination, control JSON, runtime code, and backend contracts disagree, the plan must state the conflict and resolve it according to that order.

## Formatting rules

An ExecPlan stored as a Markdown file should be normal Markdown. Do not wrap the whole file in an outer fenced code block.

Use prose first. Lists are fine for progress tracking, commands, and concise acceptance criteria, but narrative sections should explain why the work matters and how the pieces fit together.

Use repository-relative paths such as `frontend/src/App.tsx` and `backend/app/api/endpoints/...`. Commands must include the working directory.

Avoid nested Markdown fences inside examples. If a command transcript or code excerpt is necessary, keep it short and focused.

## Required sections

Each ExecPlan must contain these sections, in this order unless there is a strong reason to add a brief preface.

# <Short, action-oriented title>

State that the document is a living ExecPlan and that it must be maintained according to `.agent/PLANS.md`.

## Purpose / Big Picture

Explain what someone can do after this change that they could not do before. Describe how to see the new or corrected behavior working.

## Progress

Use timestamped checkboxes. Update this section at every stopping point.

    - [x] (2026-04-23 10:00 AEDT) Inspected current route registry and confirmed the affected routes.
    - [ ] Implement the route registry update.
    - [ ] Run validation and record results.

## Surprises & Discoveries

Record unexpected behavior, constraints, bugs, stale assumptions, or useful observations. Include concise evidence.

    - Observation: The route exists in `frontend/src/App.tsx` but not in `frontend/src/config/route-registry.ts`.
      Evidence: `rg "/example" frontend/src/App.tsx frontend/src/config/route-registry.ts`.

## Decision Log

Record each meaningful decision with rationale and date/author.

    - Decision: Keep `/kr/*` routes reference-only for this task.
      Rationale: `AGENTS.md` says prototype routes are reference-only unless explicitly promoted.
      Date/Author: 2026-04-23 / Codex

## Outcomes & Retrospective

Update at major milestones and completion. Summarize what changed, what remains, and what was learned.

## Context and Orientation

Describe the current state as if the reader has no prior context. Name the key files, modules, tests, docs, branches, or services involved. Define local terms.

For Figma/design work, cite the active authority files from `AGENTS.md`: design canon, active Figma coordination, control JSON, screen mappings, runtime truth, backend capability truth, and asset truth as relevant.

## Plan of Work

Describe the sequence of edits in prose. For each edit, name the file, the module or component, and the intended change. Keep the plan concrete enough to execute but flexible enough to adapt to discoveries.

For high-risk work, break the work into independently verifiable milestones. Prototyping milestones are allowed when they de-risk an unknown; label them as prototypes and state how they will be promoted or discarded.

## Concrete Steps

List exact commands and working directories. Include expected short outputs where useful.

Example:

    Working directory: repo root
    Command: node frontend/scripts/validate-governance-artifacts.mjs
    Expected: JSON output with `"ok": true`.

## Validation and Acceptance

State how to prove the change works. Include the narrowest relevant validation commands from `AGENTS.md`, plus any focused tests, runtime checks, screenshots, or manual flows needed for the task.

Acceptance must be phrased as observable behavior. For example, say that visiting a route returns the expected screen or that an API call returns a specific response shape, not only that a file was edited.

## Idempotence and Recovery

Explain whether steps can be safely repeated. If a command can partially fail, describe how to retry. If a migration, branch operation, or destructive step is involved, state backups, checkpoints, and rollback options.

## Artifacts and Notes

Record concise evidence such as command transcripts, important diffs, PR links, screenshots, or handover links. Keep this section focused on proof needed by the next agent.

## Interfaces and Dependencies

Name any APIs, schemas, functions, routes, components, or third-party services the task depends on. If an interface must exist at completion, describe its name, file path, and expected contract.

## Maintenance checklist

Before pausing or completing work on an ExecPlan:

- Update `Progress` with the current state.
- Add any new facts to `Surprises & Discoveries`.
- Add any meaningful design or implementation choices to `Decision Log`.
- Update `Concrete Steps` if the actual commands changed.
- Update `Validation and Acceptance` with commands run and observed results.
- Add an `Outcomes & Retrospective` entry when a milestone or the full task completes.
- Ensure the plan remains self-contained and can be resumed without chat history.
