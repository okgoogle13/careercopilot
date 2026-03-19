# System Core: Project Manager Restart

> **@claude**: Invoke your `project-manager` skill first. Then treat this file as the authoritative restart snapshot for the AI Studio Prototype Harvest. Do not begin physical harvest yet. Confirm readiness for the next gate only.

## 1. Project Frame

We are conducting an "AI Studio Prototype Harvest" for CareerCopilot.

Objective:
Keep the Google AI Studio prototype useful as `support_reference` while preventing it from redefining canonical routing, shell ownership, or route-family truth in the main repo.

Prototype source:
`/Users/okgoogle13/Projects/prototype_v2.0`

Deprecated local checkout:
`/Users/okgoogle13/Downloads/careercopilot-aistud` was deleted and is no longer a valid source reference.

Current phase:
`Pre-Harvest Stabilization`

Success criteria for this phase:
- Prototype route/navigation ambiguity removed or clearly annotated as prototype-only
- Support-reference file names aligned to canonical target-state ownership
- Prototype-to-canonical mapping artifact created
- Import graph updated after renames
- No unauthorized route or shell ownership drift introduced

## 2. Current Status Snapshot

Completed:
- Harvest planning docs were migrated into `docs/project/active/ai-studio-prototype-harvest/`
- `AI_STUDIO_CLOSE_OUT_PROMPTS.md` exists and now carries the stabilization prompt
- `AI_STUDIO_HARVEST_PLAN.updated.md` exists and now records the blocked pre-harvest gate
- `STRUCTURE_MAP.prototype.md` exists
- Active prototype source references now target `/Users/okgoogle13/Projects/prototype_v2.0`
- Prototype-integration guidance exists in the migration workspace
- Review of the latest Gemini-generated plan is complete

Blocked:
- The latest Gemini plan incorrectly treats the prototype as implementation truth
- The prior close-out prompt encouraged shell/route normalization that violates migration authority
- The prior handover advanced directly to physical harvest before stabilization passed
- The prototype still carries tab-based pseudo-routing semantics that can mislead downstream harvest work

Readiness:
- Sprint readiness score: 58/100
- Phase status: `blocked`
- Blocker severity: `high`

## 3. Governing Constraints

You must obey these sources in this order:
1. `docs/project/active/frontend-source-of-truth-migration/control/blueprint.md`
2. `docs/project/active/frontend-source-of-truth-migration/control/workflow.md`
3. `docs/project/active/frontend-source-of-truth-migration/AGENTS.md`
4. `docs/project/active/frontend-source-of-truth-migration/prototype-integration.md`

Key rules:
- Prototype = support/reference input only
- Canonical runtime routing authority = `frontend/src/App.tsx`
- Canonical route ownership = `control/route-matrix.md`
- Do not promote prototype tabs, shell, or route labels into product truth
- Do not recommence physical harvest until the stabilization gate below passes

## 4. Stabilization Gate To Pass Next

Required next action:
Review the AI Studio output from the latest prototype-only stabilization prompt and verify all of the following:
- required file renames completed
- imports updated
- prototype comments explicitly state routing authority belongs to the main repo
- no canonical route claims introduced
- mapping artifact created
- deleted files justified by zero remaining imports

Gate result options:
- `PASS` = stabilization complete, project-manager may reopen harvest planning
- `FAIL` = remain blocked; publish the exact discrepancy list and do not advance

## 5. Immediate Operating Sequence

1. Read the four governing docs listed above.
2. Treat all current prototype artifacts from `/Users/okgoogle13/Projects/prototype_v2.0` as support-only unless explicitly remapped.
3. Wait for or ingest the latest AI Studio stabilization output.
4. Evaluate the output against the stabilization gate.
5. If PASS:
   - reopen the harvest as a project-manager phase called `Physical Harvest Planning`
   - derive phase outcomes from canonical route ownership, not prototype navigation
   - route execution into smaller harvest tracks only after naming/mapping are stable
6. If FAIL:
   - publish blocker list
   - keep project phase at `Pre-Harvest Stabilization`
   - request corrected AI Studio output only for the failed conditions

## 6. Current Priority Decision

Single highest-priority decision:
Do not harvest code yet. First verify the prototype no longer implies unauthorized route ownership.

## 7. Expected Reply

Reply with:
- current phase
- gate status (`awaiting_output`, `pass`, or `fail`)
- blocker list
- the next checkpoint needed before harvest can restart

Do not ask for `DashboardContainer` or any physical component harvest until the stabilization gate is passed.
