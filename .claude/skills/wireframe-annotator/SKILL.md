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
  - name: compliance_score
    type: number
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
7. **Enforce Token Rules**: Use only canonical v6 `--sys-color-*`, `--sys-type-*`, `--sys-shape-*`; never hex; never deprecated aliases
8. **Score Compliance**: Compute 0–400 KR Solidarity compliance_score with detailed rubric breakdown
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
| **Scaffold** | Layout structure, form input | Neutral, load-bearing | Text input, textarea, divider, sidebar, header bar, data table | `--sys-shape-scaffoldSlab01` |
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
--sys-color-paperWhite               → Text on dark
--sys-color-inkGold-base             → Primary brand accent, CTAs
--sys-color-solidarityRed-base       → Secondary brand, urgent actions
--sys-color-kr-activistSmokeGreen    → Natural/elite accent, map routes
--sys-color-signalGreen              → Small accents, links
--sys-color-inkGold-base             → Halo/saint disks, celebratory
--sys-color-stencilYellow-base       → Large poster words, warnings
--sys-color-worker-ash-base          → Primary readable ink on dark
--sys-color-solidaritySmokeOrange    → Portrait warmth, earth layers
--sys-color-protestMetalBlue-base    → Ripples, quiet tech accents
--sys-color-concreteGrey             → Neutral, disabled
--sys-color-kr-charcoalRed           → Error state, destructive
```

**Never use:** Hardcoded hex, deprecated aliases (e.g., `kr-ink-gold`, `waratahRed`, `asphaltBlack`, `gumLeafGreen`).

### Typography (`--sys-type-*`)

```
--sys-type-font-fraunces         → Headlines, hero (wght 700–900, SOFT, WONK)
--sys-type-font-work-sans        → Body, UI labels (wght 400–600)
--sys-type-font-libre-bodoni     → Proclamation, authoritative
--sys-type-font-mono             → Code, data (JetBrains Mono, wght 400–600)
--sys-type-font-caveat           → Handwritten accents, curator notes
--sys-type-font-nabla            → RESTRICTED: Icon-scale hero hits only
```

### Shape Tokens (`--sys-shape-*`)

```
--sys-shape-blockRiot03          → Strike archetype (buttons, chips)
--sys-shape-blockRiot01          → March archetype (selects, progress)
--sys-shape-megaphoneCut01       → Megaphone archetype (modals, alerts)
--sys-shape-placardTorn01        → Placard archetype (cards, panels)
--sys-shape-scaffoldSlab01       → Scaffold archetype (inputs, dividers)
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

### `<element>` Schema

Each UI element becomes an `<element>` child of `<elements>`.

#### Attributes

- `id` – stable identifier.
- `element_type` – e.g. text, input, button, card, list, modal.
- `archetype` – Strike | March | Megaphone | Placard | Scaffold | Substrate.
- `role` – ARIA / semantic role (button, heading, textbox, list, dialog, etc.).
- `layout_role` – e.g. screen-title, form-field, primary-cta, secondary-cta.
- `x`, `y`, `width`, `height` – wireframe coordinates.

#### Child Blocks (per element)

```xml
<element
  id="submit-cta"
  element_type="button"
  archetype="Strike"
  role="button"
  layout_role="primary-cta"
  x="72" y="640" width="200" height="48"
>

  <component_mapping
    design_system_component="KR/Button/Primary"
    code_component="KRButton"
    props_interface="KRButtonProps"
    variant="filled"
    size="lg"
  />

  <content
    content_type="static"
    label="Submit application"
    sample_text="Submit application"
    i18n_label_key="apply.form.submit.label"
    domain_model_field="Application.submit"
  />

  <functionality
    intent="Primary CTA to submit the application."
    action="Validate form, POST /applications, navigate to confirmation."
    data_source="POST /applications"
    success_state_description="Show success banner and redirect to /applications/success."
    error_handling="Show inline error banner and keep form values."
  >
    <validation_rules>
      <rule>form_valid</rule>
    </validation_rules>
    <error_messages>
      <error key="server">Something went wrong. Please try again.</error>
    </error_messages>
  </functionality>

  <interaction
    patterns="click,keyboard-activate"
    states="default,hover,focus,pressed,disabled,loading"
    on_click="Trigger form submit."
    transitions="loading:opacity+label-change 150ms ease-out"
  />

  <layout_details
    responsive_behavior="left-aligned-on-lg, full-width-on-xs"
    constraints="top,left"
    margin_top="24"
    alignment="start"
  />

  <tokens
    color_token="--sys-color-inkGold-base"
    typography_token="--sys-type-font-work-sans"
    shape_token="--sys-shape-blockRiot03"
    z_layer="Z-3"
  />

  <accessibility
    label_source="visible-text"
    keyboard_shortcut="Enter"
  />

  <test_ids primary="cta-submit-application" />

  <motion_contract
    trigger="click"
    duration_ms="150"
    easing="cubic-bezier(0.34,1.56,0.64,1)"
    properties="scale,shadow"
  />

  <ux_rationale>
    Single clear primary action with strong loading feedback to reduce anxiety.
  </ux_rationale>

</element>
```

**Element child blocks summary:**

- `<component_mapping>`: design_system_component, code_component, props_interface, variant, size.
- `<content>`: content_type, sample_text, label, placeholder, helper_text, i18n_key / i18n_label_key, domain_model_field.
- `<functionality>`: intent, action, data_source, validation_rules, error_messages, success_state_description, error_handling.
- `<interaction>`: patterns, states, on_focus, on_error, on_click, transitions.
- `<layout_details>`: responsive_behavior, constraints, margin_top/right/bottom/left, alignment.
- `<tokens>`: color_token, typography_token, shape_token, z_layer. (**Use only canonical v6 `--sys-color-*`, `--sys-type-*`, `--sys-shape-*`; no hex; no deprecated aliases.**)
- `<accessibility>`: label_source, heading_level (for headings), aria_describedby_ids, keyboard_shortcut, tab_order_override.
- `<test_ids>`: primary data-testid.
- `<motion_contract>`: trigger, duration_ms, easing, properties.
- `<ux_rationale>`: 1–3 sentences, why this pattern/archetype/token.

**Interactive elements must have:** `archetype`, `role`, `<tokens>`, `<test_ids>`, and `states` including at least `default` and `focus`.

---

## Example Wireframe Output (v6)

```xml
<wireframe
  version="6.0.0"
  screen_id="landing-hero"
  design_system="kr-solidarity"
  mode="solidarity-only"
>

<meta>
  <title>Landing Page Hero</title>
  <description>Primary marketing hero with layered KR asset composition, dual CTAs, and feature strip.</description>
  <user_story>As a visitor, I immediately understand CareerCopilot's value proposition and can start or learn more.</user_story>
  <viewport base_width="1440" base_height="900" />
  <breakpoints values="xs,sm,md,lg" />
</meta>

<layout>
<![CDATA[
+------------------------------------------------------------------+
| [SCAFFOLD: TopNav divider]                                       |
|  [STRIKE: Logo]        [MARCH: Nav links]  [STRIKE: CTA Button] |
+------------------------------------------------------------------+
|                                                                  |
|  [SCAFFOLD: Hero Grid — 2 col]                                  |
|  +----------------------------+  +---------------------------+  |
|  | [PLACARD: Hero Content]    |  | [SUBSTRATE: Hero Visual]  |  |
|  |                            |  |                           |  |
|  |  [MARCH: Eyebrow label]    |  |  KR asset hero (Z-0)      |  |
|  |  [STRIKE: H1 Headline]     |  |  Atmospheric overlay(Z-1) |  |
|  |  [MARCH: Subhead]          |  |  UI accent (Z-3)          |  |
|  |                            |  |                           |  |
|  |  [STRIKE: Primary CTA]     |  |                           |  |
|  |  [STRIKE: Secondary CTA]   |  |                           |  |
|  +----------------------------+  +---------------------------+  |
|                                                                  |
+------------------------------------------------------------------+
| [PLACARD: Feature strip — 3 cols]                               |
|  [PLACARD: Feature 1]  [PLACARD: Feature 2]  [PLACARD: Feat 3]  |
+------------------------------------------------------------------+
]]>
</layout>

<elements>

  <!-- Primary CTA Button -->
  <element
    id="cta-primary"
    element_type="button"
    archetype="Strike"
    role="button"
    layout_role="primary-cta"
    x="80" y="520" width="180" height="48"
  >
    <component_mapping
      design_system_component="KR/Button/Primary"
      code_component="KRButton"
      props_interface="KRButtonProps"
      variant="filled"
      size="lg"
    />
    <content
      content_type="static"
      label="Get Started"
      sample_text="Get Started"
      i18n_label_key="landing.hero.cta.primary"
    />
    <tokens
      color_token="--sys-color-inkGold-base"
      typography_token="--sys-type-font-work-sans"
      shape_token="--sys-shape-blockRiot03"
      z_layer="Z-3"
    />
    <interaction
      patterns="click,keyboard-activate"
      states="default,hover,focus,pressed"
      on_click="Navigate to /register"
      transitions="hover:scale+shadow 200ms cubic-bezier(0.34,1.56,0.64,1)"
    />
    <accessibility
      label_source="visible-text"
      keyboard_shortcut="Enter"
    />
    <test_ids primary="landing-cta-primary" />
    <motion_contract
      trigger="hover"
      duration_ms="200"
      easing="cubic-bezier(0.34,1.56,0.64,1)"
      properties="scale,box-shadow"
    />
    <ux_rationale>
      Primary Strike archetype with high-contrast inkGold on charcoal creates immediate focal hierarchy. M3 Expressive spring physics on hover reinforces action confidence.
    </ux_rationale>
  </element>

  <!-- H1 Headline -->
  <element
    id="hero-headline"
    element_type="text"
    archetype="Strike"
    role="heading"
    layout_role="screen-title"
    x="80" y="320" width="600" height="120"
  >
    <content
      content_type="static"
      sample_text="Career Applications, Perfected"
      i18n_label_key="landing.hero.headline"
    />
    <tokens
      color_token="--sys-color-paperWhite"
      typography_token="--sys-type-font-fraunces"
      z_layer="Z-3"
    />
    <accessibility
      label_source="visible-text"
      heading_level="1"
    />
    <ux_rationale>
      Fraunces variable font (wght 900, SOFT 80, WONK 1) creates extreme M3 Expressive contrast. Strike archetype for hero statement.
    </ux_rationale>
  </element>

</elements>

<user_flow>
  <primary_path><![CDATA[
**Step 1: Land on page**
- User sees hero headline + subheadline above fold
- Primary CTA "Get Started" visible without scrolling
- Substrate texture + atmospheric overlay create immediate brand impression

**Step 2: Engage with CTA**
- Click "Get Started" → navigate to `/register`
- Click "Learn More" → smooth-scroll to feature section or navigate to `/about`

**Step 3: Footer navigation**
- Keyboard Tab users reach footer links after CTAs
- Footer links: Privacy · Terms · Contact · About
  ]]></primary_path>

  <edge_cases><![CDATA[
**Hero asset timeout (>3s):**
- Fallback trigger in composeHero()
- Apply charcoal background (--sys-color-charcoalBackground-base)
- Show error banner: "Asset load failed. Refresh to retry."
- CTAs remain functional — page is not blocked

**No JS / SSR initial render:**
- Hero panel renders with charcoal background (CSS-only fallback)
- CTAs are standard `<a>` elements — navigable without JS
  ]]></edge_cases>
</user_flow>

<states>
  <loading><![CDATA[
- H1 replaced with Fraunces skeleton (pulsing --sys-color-primary-40)
- CTA buttons show spinner, disabled state (opacity: 0.4)
- Feature cards show grey skeleton blocks
  ]]></loading>

  <empty><![CDATA[
N/A for Landing — static content
  ]]></empty>

  <error><![CDATA[
- If hero asset fails to load: fallback to --sys-color-charcoalBackground-base
- If nav data fails: show cached nav links
- MEGAPHONE error banner: "Asset load failed. Refresh to retry."
  ]]></error>

  <disabled><![CDATA[
- CTA buttons: opacity 0.4, cursor: not-allowed
- color: --sys-color-concreteGrey
  ]]></disabled>
</states>

<assets>
  <slot name="hero_background" z_layer="Z-0" token="--sys-color-charcoalBackground-base">
    TODO[asset] Select from KR-SOLID-021 to KR-SOLID-030 (devotional/16:9)
  </slot>

  <slot name="hero_overlay" z_layer="Z-1" token="--sys-color-primary-40">
    TODO[asset] Abstract motif overlay (opacity: 0.6)
  </slot>

  <slot name="hero_accent" z_layer="Z-3" token="--sys-color-inkGold-base">
    KR-UI-016 (corner accent SVG, top-right placement)
  </slot>
</assets>

<breakpoints>
  <mobile max_width="767"><![CDATA[
- Hero panel: full-width, stacked layout
- CTA buttons: stack vertically, full-width
- H1 font-size: 36px
- Padding: 16px
- CSS: .hero-content-panel { width: 100%; padding: 24px 16px; }
  ]]></mobile>

  <tablet min_width="768" max_width="1023"><![CDATA[
- Hero panel: max-width 600px, centered
- CTA buttons: side-by-side
- H1 font-size: 48px
- Padding: 24px
- CSS: @media (min-width: 768px) { .hero-content-panel { max-width: 600px; padding: 32px 24px; } }
  ]]></tablet>

  <desktop min_width="1024"><![CDATA[
- Hero panel: max-width 720px, centered
- CTA buttons: side-by-side
- H1 font-size: 56px
- Padding: 48px
- CSS: @media (min-width: 1024px) { .hero-content-panel { max-width: 720px; padding: 48px; } }
  ]]></desktop>
</breakpoints>

<accessibility_overview>
  <focus_order><![CDATA[
1. Logo (skip-to-content link)
2. Nav links (Tab through)
3. Primary CTA
4. Secondary CTA
5. Feature cards (Tab through, Enter to activate)

Keyboard shortcuts:
- Tab: moves focus forward
- Shift+Tab: moves focus backward
- Enter/Space: activates buttons
- Esc: dismisses any Lens (modal/popover)
  ]]></focus_order>

  <landmarks><![CDATA[
role="banner" → TopNav
role="main" → Hero + Feature sections
aria-label="Primary navigation" → Nav links
aria-label="Get started with CareerCopilot" → Primary CTA
  ]]></landmarks>
</accessibility_overview>

<storybook>
  <stories>
    <story name="LandingHero/Default" />
    <story name="LandingHero/Loading" />
    <story name="LandingHero/AssetLoadError" />
  </stories>
  <controls><![CDATA[isLoading, assetLoadError, headlineText]]></controls>
</storybook>

</wireframe>

<!-- Compliance Score Summary (append after wireframe XML) -->
**Compliance Score: 390/400 (97.5%)** — Grade A · ✅ PASS (≥360 threshold)

**Deductions:**
- Fraunces variable settings partially specified (-5pt)
- Typographic scale less expressive than 144px hero max (-5pt)

```

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
