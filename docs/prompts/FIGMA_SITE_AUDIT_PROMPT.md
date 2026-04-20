# Figma Site Audit Prompt

You are running a verification-first frontend audit against the current published Figma Site donor. This is not a redesign pass and not an implementation pass.

## Operating context

- Repo root: `/Users/okgoogle13/Projects/careercopilot`
- Design donor: published Figma Site at `https://fake-pound-31010647.figma.site`
- Important constraint: this is a published `figma.site`, not a raw Figma file. There are no usable Figma Node IDs for this audit.
- You must inspect the live published site with browser tooling and compare it against the real runtime frontend code in this repo.
- Do not use Figma API assumptions, metadata guesses, or generic review heuristics when direct browser inspection can answer the question.

## Required skill invocation order

Before doing anything substantive, invoke the relevant skills in this order:

1. `using-superpowers`
   - Required at the start of the session.
2. `figma-skill-wrapper`
   - Required because this is Figma design inspection work in Codex/Claude-style workflow and the donor is a published `figma.site`.
   - Use it to keep the workflow grounded in tools that actually exist.
3. `verification-before-completion`
   - Required before you claim the audit is complete.

If you find a genuine runtime bug in your audit tooling or encounter contradictory evidence, invoke `systematic-debugging` before drawing conclusions.

When announcing skill use, be explicit and brief, for example:

- `Using using-superpowers to load the required workflow discipline.`
- `Using figma-skill-wrapper to route this Figma-site audit through real inspection paths only.`
- `Using verification-before-completion before claiming the audit is complete.`

## Authority order

Follow the repo authority order from `AGENTS.md`. Use these sources in this order:

1. Design canon
   - `docs/design/01_CANON.md`
   - `docs/design/02_SYSTEM.md`
2. Active Figma coordination
   - `docs/project/active/figma-agent-tasks.md`
   - `docs/project/active/figma-sync-order.json`
3. Migration control artifacts
   - `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
   - `docs/design/screen-map.json`
4. Screen pairing inside the repo
   - `frontend/src/screens/mapping.schema.json`
   - `frontend/src/screens/*/mapping.json`
   - `frontend/src/screens/*/*.wireframe.xml`
   - `frontend/src/screens/*/*.tsx`
5. Runtime truth
   - `frontend/src/App.tsx`
   - `frontend/src/config/route-registry.ts`
   - `frontend/src/features/**`
   - `frontend/src/pages/**`

Conflict rules:

- Trust the published Figma Site for visual intent.
- Trust runtime code for what users actually get today.
- Treat docs as governance and mapping truth, not as proof that the UI visually matches.
- Do not invent node mappings or raw Figma metadata.
- Do not treat prototype `/kr/*` routes or stale archive artifacts as active truth unless current control docs explicitly say so.

## Goal

Find every meaningful frontend-vs-Figma mismatch on the target screens, with extra scrutiny on typography expressiveness, hierarchy, weight contrast, spacing rhythm, token hygiene, and archetype compliance. Assume previous audit evidence may have under-called typography issues and verify that directly.

## Hard constraints

- Do not implement fixes.
- Do not silently soften findings.
- Do not rely on screenshots alone when DOM/computed CSS inspection is possible.
- Do not compare against docs only; compare against actual runtime code.
- Do not claim alignment unless you verified both the live published site and the corresponding runtime implementation.
- Do not use `get_design_context`, `get_metadata`, or other node-ID-dependent Figma flows for this task.

## Audit scope

### Frontend repo

- `frontend/src/**`

### Canon and governance

- `docs/design/01_CANON.md`
- `docs/design/02_SYSTEM.md`
- `AGENTS.md`

### Focus routes

- `/`
- `/auth`
- `/dashboard`
- `/opportunities`
- `/applications`
- `/analysis`
- `/documents`
- `/onboarding`

### Give extra scrutiny to

- display typography
- stat and metric typography
- contrast between headline, subhead, eyebrow, label, and body
- font family correctness
- font-weight correctness, especially thin versus regular usage
- font-size and line-height
- letter-spacing and text-transform
- spacing rhythm and sectional cadence
- shape and archetype usage
- substrate, layering, and atmospheric treatment
- semantic token use versus hardcoded or drifted values

## Required workflow

1. Load the required skills first.
2. Read the governing repo artifacts before browsing deeply:
   - `AGENTS.md`
   - `docs/design/01_CANON.md`
   - `docs/design/02_SYSTEM.md`
   - `docs/project/active/figma-agent-tasks.md`
   - `docs/project/active/figma-sync-order.json`
   - `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
   - `docs/design/screen-map.json`
3. Identify the local authority for each focus surface:
   - `frontend/src/screens/<screen-id>/mapping.json`
   - paired wireframe
   - paired screen component
   - corresponding live route implementation
4. Use browser tooling to inspect the published Figma Site:
   - navigate the site
   - identify the route families or equivalent site sections
   - inspect exact DOM nodes for key typography and layout evidence
   - extract computed CSS where ambiguity exists
5. Read the corresponding runtime code for each route and key component.
6. Compare visual evidence against implementation evidence.
7. Record only evidenced findings.
8. Before concluding, run the narrowest verification steps needed to confirm the audit references are accurate.

## Browser inspection requirements

For each matched route or equivalent section on the published Figma Site, inspect the actual rendered DOM and computed styles where possible. Capture evidence for:

- text content and hierarchy
- `font-family`
- `font-weight`
- `font-size`
- `line-height`
- `letter-spacing`
- `text-transform`
- text color
- background and substrate treatment
- container width and max-width behavior
- padding, gap, and section spacing
- border radius and shape semantics
- shadows, blur, overlays, and atmospheric layering

If typography looks visually ambiguous, do not guess from appearance alone. Inspect the exact text node and report computed CSS values.

## Required code cross-checks

At minimum, verify these files if they participate in the inspected routes:

- `frontend/src/features/landing/LandingPage.tsx`
- `frontend/src/screens/06_opportunities/OpportunitiesDiscovery.tsx`
- `frontend/src/screens/02_auth/AuthModal.tsx`
- `frontend/src/components/core/SolidarityText.tsx`
- `frontend/src/globals.css`
- any route entrypoint or feature component that actually renders the audited surface

Also verify token truth when relevant:

- `frontend/src/design/tokens/tokens.json`
- generated token CSS or semantic token usage where the audited component consumes them

## What counts as a finding

Report a finding when one or more of these are true:

- the frontend matches copy but misses the visual hierarchy
- the font family or weight differs in a way that changes the intended tone
- spacing technically works but collapses the intended rhythm
- token use drifts from canon or semantic `--kr-*` expectations
- shapes or radii break the current KR Solidarity archetype language
- the runtime uses a legacy/prototype-era implementation that misses the published donor intent
- previous audit evidence claimed a fix that is incomplete, inaccurate, or wrong

Do not report trivial deltas that do not materially affect the design intent.

## Deliverable format

Produce the audit in this order:

### 1. Findings

Order findings by severity, highest first.

Each finding must include:

- route or screen
- component or surface name
- local file reference with line reference when possible
- published Figma Site section or element reference
- exact mismatch
- evidence
  - cite the computed CSS or structural observation from the site
  - cite the relevant code path or token usage from the repo
- why it matters visually or systemically
- status of prior evidence
  - `correct`
  - `incomplete`
  - `wrong`

### 2. Confirmed aligned

List surfaces or elements that you checked and believe are aligned, with brief evidence.

### 3. Needs follow-up inspection

List unresolved areas only if you can explain what blocked certainty.

### 4. Proposed fix plan

Provide a concise, implementation-ready fix plan, but do not apply it.

## Review posture

- Optimize for visual truth, not charity.
- Be especially suspicious of typography claims that were previously marked fixed without computed-style evidence.
- If the Figma Site and the code disagree, report the disagreement clearly and treat the Figma Site as the visual donor truth for this audit.
- If governance docs and runtime disagree, note both and anchor the finding in the authority order rather than guessing.

## Completion gate

Before you say the audit is complete:

1. Confirm you invoked the required skills.
2. Confirm you inspected the published Figma Site directly with browser tooling.
3. Confirm you cross-checked real runtime code, not only docs.
4. Confirm every reported finding includes evidence.
5. Invoke `verification-before-completion` discipline and only then state that the audit is finished.
