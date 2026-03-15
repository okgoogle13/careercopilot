---
name: wireframe-annotator
description: Generate annotated ASCII wireframes based on the "Annotated Wireframe
  Protocol". Bridges the gap between high-level specs and developer-ready implementation
  guidance. Outputs structured XML blocks — layout, tokens, accessibility, states,
  asset placement, breakpoints, user flows, component specs, motion contracts,
  test ID anchors, content strategy, design rationale, Storybook story specs,
  error boundary mapping, i18n slots, visual regression baselines, and pipeline
  linkage — aligned to Kerala Rage kr-solidarity v6.0 design system.
metadata:
  version: 6.0.0
  tags:
    - wireframing
    - design
    - spec-generation
    - design-to-code
    - kerala-rage
    - m3-expressive
    - responsive-design
    - typescript
    - storybook
    - visual-regression
    - i18n
    - design-automation

inputs:
  - name: feature_brief
    type: string
  - name: annotated_wireframe_protocol
    type: string
  - name: constraints
    type: string
    required: false

outputs:
  - name: xml_wireframes
    type: string
  - name: compliance_checklist
    type: string
  - name: summary
    type: string
---

# Wireframe Annotator Skill (v6.0)

## Purpose

Consume high-level feature briefs or the **Annotated Wireframe Protocol** (from `design-system-doc-generator`) and output detailed, developer-ready annotated wireframes. Translates design intent into concrete ASCII layout diagrams with explicit Kerala Rage kr-solidarity token mappings, component archetype assignments, and asset placement slots.

**Design System:** Kerala Rage kr-solidarity v6.0 (Strike / March / Megaphone / Placard / Scaffold / Substrate)

---

## When to Use

- After design system documentation is complete (`design-system-doc-generator`)
- Before component spec generation (`component-spec-generator`)
- When translating design specs into developer-ready layouts
- When defining screen structure, token mapping, and asset slot assignments

---

## Process

1. **Parse Input**: Read `feature_brief`, `annotated_wireframe_protocol`, and optional `constraints`
2. **Identify Screens**: Determine all screens, primary flows, edge cases, and key UI elements
3. **Assign Archetypes**: Map each UI element to a kr-solidarity v6.0 semantic action archetype (Strike/March/Megaphone/Placard/Scaffold/Substrate)
4. **Generate ASCII Layout**: Visual text representation using `[ ]`, `| |`, `+--+` notation with archetype labels
5. **Build Element Nodes**: For each element, emit an `<element>` node with all required child blocks
6. **Fill Screen Blocks**: Populate `<user_flow>`, `<states>`, `<assets>`, `<breakpoints>`, `<accessibility_overview>`, `<storybook>`
7. **Enforce Token Rules**: Use only canonical tokens. Colors must be `--sys-color-*-base`, typography must be `--sys-type-fontFamilies-*`, and shapes must be `--sys-shape-*`. Never hex. Never deprecated aliases.
8. **Compliance Checklist**: Emit a non-authoritative compliance checklist and notes. Only emit a numeric score if a real validator/rubric is explicitly provided.
9. **Output XML**: Produce well-formed XML wireframe(s) with required blocks per screen

---

## Kerala Rage Component Archetypes (v6.0)

Every element in the wireframe MUST be assigned one of the six semantic action archetypes:

| Archetype | Role | Emotional Register | Component Examples | Shape Token |
|---|---|---|---|---|
| **Strike** | Primary action, decisive CTA | Defiance, finality | Button (primary/secondary/ghost/destructive), chip, icon button | `--sys-shape-blockRiot03` |
| **March** | Sequential selection, flow elements | Collective momentum | Select/dropdown, progress bar, breadcrumb, step indicator | `--sys-shape-blockRiot01` |
| **Megaphone** | Announcement, focal interruption | Urgency, voice | Modal dialog, drawer, high-priority alert | `--sys-shape-megaphoneCut01` |
| **Placard** | Content container, framing | Solidarity structure | Card, panel, feed item, list item, accordion | `--sys-shape-placardTorn01` |
| **Scaffold** | Layout structure, form input | Neutral, load-bearing | Text input, textarea, divider, sidebar, header bar, data table | `--sys-shape-scaffoldFrame01` |
| **Substrate** | Decorative background, atmospheric | Organic, environmental | Background canvas, hero texture, ambient overlay, avatar mask | `--sys-shape-substrateTile02` |

**Decision Logic:**
1. Is it a primary tap/click action? → **Strike**
2. Does it select from a sequence of options? → **March**
3. Does it interrupt with urgency (modal, alarm)? → **Megaphone**
4. Does it frame and contain other content? → **Placard**
5. Is it a form input or load-bearing structure (divider, nav)? → **Scaffold**
6. Is it purely atmospheric, decorative, environmental? → **Substrate**

---

## Token Reference for Annotations (v6.0 Canonical)

### Colors (`--sys-color-*` only — no hardcoded hex)

**v6.0 canonical semantic tokens** — use exactly these:

```
--sys-color-charcoalBackground-base  → Global floor, dark backgrounds
--sys-color-paperWhite-base          → High-contrast poster/text on dark
--sys-color-inkGold-base             → Primary brand accent, CTAs
--sys-color-solidarityRed-base       → Secondary brand, urgent actions
--sys-color-kr-activistSmokeGreen-base → Natural/elite accent, map routes
--sys-color-signalGreen-base         → Small accents, links
--sys-color-inkGold-base             → Halo/saint disks, celebratory
--sys-color-stencilYellow-base       → Large poster words, warnings
--sys-color-worker-ash-base          → Primary readable ink on dark
--sys-color-solidaritySmokeOrange-base → Portrait warmth, earth layers
--sys-color-protestMetalBlue-base    → Ripples, quiet tech accents
--sys-color-concreteGrey-base        → Neutral, disabled
--sys-color-kr-charcoalRed-base      → Error state, destructive
```

**Never use:** Hardcoded hex, deprecated aliases (e.g., `kr-ink-gold`, `waratahRed`, `asphaltBlack`, `gumLeafGreen`).

### Typography (Font families)

```
--sys-type-fontFamilies-display        → Headlines, hero (Fraunces)
--sys-type-fontFamilies-primary        → Body, UI labels (Work Sans)
--sys-type-fontFamilies-proclamation   → Proclamation, authoritative (Libre Bodoni)
--sys-type-fontFamilies-mono           → Code, data (JetBrains Mono)
--sys-type-fontFamilies-curator        → Handwritten accents, curator notes (Caveat)
--sys-type-fontFamilies-colorAccent    → RESTRICTED: icon-scale hero hits only (Nabla)
```

### Shape Tokens (`--sys-shape-*`)

```
--sys-shape-blockRiot03          → Strike archetype (buttons, chips)
--sys-shape-blockRiot01          → March archetype (selects, progress)
--sys-shape-megaphoneCut01       → Megaphone archetype (modals, alerts)
--sys-shape-placardTorn01        → Placard archetype (cards, panels)
--sys-shape-scaffoldFrame01      → Scaffold archetype (inputs, dividers)
--sys-shape-substrateTile02      → Substrate archetype (backgrounds)
```

### Asset Z-Index Layers

```
Z-0    → Substrate / base texture (background canvas)
Z-1    → Atmospheric / motif overlays
Z-2    → Secondary atmospheric layers
Z-3+   → UI foreground accents and focal cues
```

---

## XML Output Structure (v6)

MUST output well-formed XML. One `<wireframe>` per screen.

### Screen Template

```xml
<wireframe
  version="6.0.0"
  screen_id="apply-job-form"
  design_system="kr-solidarity"
  mode="solidarity-only"
>

  <meta>
    <title>Apply for Senior Social Worker</title>
    <description>Primary application flow collecting candidate details and resume.</description>
    <user_story>As a job seeker, I can submit my application quickly without confusion.</user_story>
    <viewport base_width="1440" base_height="900" />
    <breakpoints values="xs,sm,md,lg" />
  </meta>

  <layout>
    <![CDATA[
+--------------------------------------------------------+
| [H1: Apply for Senior Social Worker]                  |
+--------------------------------------------------------+
| [SECTION: Candidate details]    | [SECTION: Sidebar]  |
| [INPUT: Full name]              | [PLACARD: Tips]     |
| [INPUT: Email]                  |                     |
| [INPUT: Phone]                  |                     |
| [UPLOAD: Resume]                |                     |
+--------------------------------------------------------+
| [STRIKE: Submit application]    [GHOST: Save draft]   |
+--------------------------------------------------------+
    ]]>
  </layout>

  <elements>
    <!-- One <element> per UI element (see schema below) -->
  </elements>

  <user_flow>
    <primary_path><![CDATA[...]]></primary_path>
    <edge_cases><![CDATA[...]]></edge_cases>
  </user_flow>

  <states>
    <empty><![CDATA[...]]></empty>
    <loading><![CDATA[...]]></loading>
    <error><![CDATA[...]]></error>
    <disabled><![CDATA[...]]></disabled>
  </states>

  <assets>
    <slot name="hero-illustration" z_layer="Z-1" token="--sys-color-inkGold-base">
      TODO[asset] hero_social_work_scene
    </slot>
  </assets>

  <breakpoints>
    <mobile max_width="767"><![CDATA[...]]></mobile>
    <tablet min_width="768" max_width="1023"><![CDATA[...]]></tablet>
    <desktop min_width="1024"><![CDATA[...]]></desktop>
  </breakpoints>

  <accessibility_overview>
    <focus_order><![CDATA[...]]></focus_order>
    <landmarks><![CDATA[role="banner", role="main", role="contentinfo"]]></landmarks>
  </accessibility_overview>

  <storybook>
    <stories>
      <story name="ApplyJobForm/Default" />
      <story name="ApplyJobForm/WithErrors" />
      <story name="ApplyJobForm/Loading" />
    </stories>
    <controls><![CDATA[canSubmit, serverError]]></controls>
  </storybook>

</wireframe>
```

**Required blocks per screen:** `<meta>`, `<layout>`, `<elements>`, `<user_flow>`, `<states>`, `<assets>`, `<breakpoints>`, `<accessibility_overview>`.

---

### Detailed Schema & Examples

To keep this skill concise and reduce token drift, the full schema and long-form examples live under `references/`:

- `references/xml-schema.md` (full `<element>` schema)
- `references/example-wireframes.md` (example screens)

---

## Usage

```
"Generate annotated wireframe for [Screen Name] using [feature brief / Protocol File]"

Examples:
- "Generate annotated wireframe for the Dashboard screen"
- "Generate annotated wireframe for the Job Application form flow"
- "Generate annotated wireframes for all 3 onboarding steps"
```

---

## Integration

**Upstream (what feeds into this skill):**
- `design-system-doc-generator` — Produces Annotated Wireframe Protocol
- Feature briefs and user flow docs

**Downstream (what consumes this output):**
- `asset-placement-strategy` — Resolves `TODO[asset]` slots (`<assets>` block)
- `m3-expressive-ui-evaluator` — Validates M3 Expressive motion + typography (`<motion>`, `<score>` blocks)
- `ui-design-evaluator` — Generates HiFi mockup from annotated wireframe
- `component-spec-generator` — Transforms `<component>` block into React specs
- `jest-test-scaffolder` — Uses `<testids>` + `<component>` blocks to generate unit tests
- `smoke-test-generator` — Uses `<testids>` + `<flow>` blocks for E2E test selectors
- `storybook-scaffolder` — Uses `<storybook>` block to generate story files
- `component-visual-audit` — Uses `<visualregression>` block for baseline captures

**Full pipeline:**
```
design-system-doc-generator
  → wireframe-annotator (this skill)
      → asset-placement-strategy   (resolve <assets> TODO[asset] slots)
      → m3-expressive-ui-evaluator (validate <motion> + <score>)
      → ui-design-evaluator        (HiFi mockup from <layout> + <tokens>)
      → component-spec-generator   (README from <component>)
          → component-builder      (production React code)
          → jest-test-scaffolder   (tests from <testids>)
          → storybook-scaffolder   (stories from <storybook>)
      → component-visual-audit     (baselines from <visualregression>)
```

---

## Constraints

- Output must be well-formed XML
- Each `<wireframe>` must include: `<meta>`, `<layout>`, `<elements>`, `<user_flow>`, `<states>`, `<assets>`, `<breakpoints>`, `<accessibility_overview>`
- Every interactive element must include: `archetype`, `role`, `<tokens>`, `<test_ids>`, and `states` with at least `default` + `focus`
- Do not invent design tokens: use only canonical v6 tokens (`--sys-color-*`, `--sys-type-*`, `--sys-shape-*`)
- Never use hardcoded hex colors or deprecated token aliases
- All token references must be validated against the kr-solidarity design system

---

**Version:** 6.0.0 | **Last Updated:** 2026-03-07 | **Mode:** Solidarity Only | **Archetypes:** v6.0 (Strike/March/Megaphone/Placard/Scaffold/Substrate)
