# Design Workflow Playbook

## Table of Contents
1. Quick Start Guide (30-second orientation)
2. Workflow Phases (6 phases with decision trees)
3. Tool Selection Guide (skills vs agents vs MCP)
4. Common Design Tasks (how-to library)
5. Example Prompts (copy-paste templates)
6. MCP Task Delegation (parallel execution guide)
7. Troubleshooting (common issues + solutions)
8. Design System Reference (tokens, colors, typography)
9. Appendices (skill registry, agent capabilities)

---

## 1. Quick Start Guide

### 30-Second Orientation

**I need to...**
- **Create a new page from Figma** → Use `/figma-to-page` skill (2-5 min, 6× faster)
- **Convert wireframe to mockup** → Use `/ui-design-evaluator` skill + Figma MCP push
- **Generate wireframes** → Use `/wireframe-annotator` skill or prompt template
- **Validate design compliance** → Use `/kerala-rage-visual-audit` or `/m3-visual-audit`
- **Build a production component** → Use `/component-builder` skill
- **Define brand aesthetics** → Invoke `visual-design-director` agent
- **Sync tokens with Figma** → `npm run tokens:push` (local → Figma) or `npm run tokens:pull` (Figma → local)
- **Run parallel design tasks** → Delegate via `/task-router-mcp`
- **Plan final deployment sprint** → Use `/sprint-coordinator` for sprint planning, daily standups, go/no-go decisions

**Core Principles:**
- **Solidarity Mode Only** (no legacy mode switching)
- **Semantic Colors** (`--sys-color-*`, never hardcoded hex)
- **M3 Expressive Typography** (Fraunces, Work Sans, JetBrains Mono)
- **Accessibility First** (WCAG 2.2 AA minimum)
- **Kerala Rage Identity** (Melbourne laneway + endemic flora)

---

## 2. Workflow Phases

### Phase 1: Research & Briefing (UX Strategist)

**When to use:** Starting a new feature or page

**Input:** Product requirements, user needs, business goals

**Output:** Design brief with problem statement, target users, scenarios, success metrics

**How to invoke:**
```markdown
Use the design brief template:

/prompt-template design-brief

Fill in:
- Problem statement (what pain point are we solving?)
- Target users (who is this for?)
- User scenarios (how will they use it?)
- Success metrics (how do we measure success?)
- Design principles (what constraints guide decisions?)
- Known risks (technical, timeline, accessibility)
```

**Example prompt:**
```
Create a design brief for a job application status dashboard.

Context:
- Users: Job seekers tracking 5-20 applications simultaneously
- Pain point: Scattered application data across email, spreadsheets, browser tabs
- Goal: Single source of truth for application status
- Success metrics: 80% user adoption, <5 seconds to find application status

Constraints:
- Must support screen readers (WCAG 2.2 AA)
- Mobile-first design (60% users on mobile)
- Integrate with existing kerala-rage design system
```

**Human checkpoint:** Review brief for equity, inclusion, strategic alignment

**Next phase:** → Phase 2 (Ideation & Flows)

---

### Phase 2: Ideation & Flows (UX Architect)

**When to use:** After design brief approved

**Input:** Design brief from Phase 1

**Output:** 2-3 alternative user flows with edge cases, accessibility notes

**How to invoke:**
```markdown
Use the user flows template:

/prompt-template user-flows

Provide:
- Design brief (from Phase 1)
- Request 2-3 alternative flows (happy path + edge cases)
- Specify accessibility requirements (keyboard nav, screen reader)
```

**Example prompt:**
```
Generate 3 alternative user flows for the job application status dashboard.

Design brief: [paste from Phase 1]

Required flows:
1. View application status (happy path)
2. Update application stage (rejection, interview, offer)
3. Filter/search applications (edge case: 50+ applications)

Accessibility:
- Full keyboard navigation (no mouse required)
- Screen reader compatible (ARIA labels, live regions)
- High contrast mode support

Output format: Markdown table comparing flows
```

**Human checkpoint:** Select most ethical/feasible flow

**Next phase:** → Phase 3 (Wireframing)

---

### Phase 3: Wireframing (UX Designer)

**When to use:** After user flow selected

**Input:** Selected user flow from Phase 2

**Output:** ASCII wireframe with layout/tokens/accessibility annotations

**Option A: Use wireframe-annotator skill**
```bash
/wireframe-annotator

Arguments:
{
  "brief_path": "/path/to/design-brief.md",
  "flow_path": "/path/to/selected-flow.md",
  "breakpoints": ["mobile", "tablet", "desktop"]
}
```

**Option B: Use prompt template**
```markdown
/prompt-template wireframes-lowfi

Context:
- User flow: [paste selected flow]
- Breakpoint: mobile (375px)
- Components: DashboardHeader, ApplicationCard, FilterBar

Required blocks:
<layout> - Component hierarchy, grid structure
<tokens> - Color/spacing/typography mappings
<accessibility> - WCAG 2.2 AA considerations
```

**Example output:**
```
<layout>
┌─────────────────────────────────────┐
│ DashboardHeader                     │
│ ├─ Logo (--sys-color-kr-ink-gold)  │
│ └─ UserProfile                      │
├─────────────────────────────────────┤
│ FilterBar (sticky)                  │
│ ├─ SearchInput                      │
│ └─ StatusDropdown                   │
├─────────────────────────────────────┤
│ ApplicationList (scroll container)  │
│ ├─ ApplicationCard × N              │
│ │  ├─ CompanyLogo                   │
│ │  ├─ JobTitle (Fraunces 700)       │
│ │  ├─ StatusBadge                   │
│ │  └─ LastUpdated                   │
└─────────────────────────────────────┘
</layout>

<tokens>
DashboardHeader:
  background: --sys-color-asphaltBlack
  height: 64px
  padding: --sys-spacing-4

ApplicationCard:
  background: --sys-color-surface
  border-radius: --sys-shape-medium
  padding: --sys-spacing-6
  gap: --sys-spacing-4

JobTitle:
  font-family: Fraunces
  font-weight: 700
  font-size: --sys-font-headline-small
  color: --sys-color-on-surface
</tokens>

<accessibility>
- DashboardHeader: landmark role="banner", aria-label="Application Dashboard"
- FilterBar: aria-label="Filter applications", sticky for persistent access
- ApplicationCard: role="article", aria-labelledby="job-title-{id}"
- StatusBadge: aria-live="polite" for status updates
- Keyboard nav: Tab order header → filters → cards (↓/↑ arrows)
</accessibility>
```

**Human checkpoint:** Validate mobile-first layout, assistive tech support

**Next phase:** → Phase 4 (UI Specification)

---

### Phase 4: UI Specification (Product Designer + Design Systems Specialist)

**When to use:** After wireframe approved

**Input:** Wireframe from Phase 3

**Output:** High-fidelity component specs with states, breakpoints, accessibility

**How to invoke:**
```markdown
/prompt-template ui-spec-hifi

Context:
- Wireframe: [paste Phase 3 wireframe]
- Breakpoints: mobile (375px), tablet (768px), desktop (1440px)
- Component focus: ApplicationCard

Required sections:
1. Component inventory (table)
2. Layout rules (per breakpoint)
3. Interaction specs (hover, focus, active, disabled)
4. WCAG 2.2 AA accessibility checklist
```

**Example prompt:**
```
Generate high-fidelity UI specification for ApplicationCard component.

Wireframe context: [paste from Phase 3]

Component requirements:
- States: default, hover, focus, active, disabled, selected
- Breakpoints: mobile (single column), tablet (2 columns), desktop (3 columns)
- Interactions: Click to expand details, swipe to archive (mobile)
- Tokens: Use kerala-rage kr-solidarity semantic colors only

Accessibility:
- WCAG 2.2 AA contrast (4.5:1 text, 3:1 UI)
- Focus visible (2px outline, --sys-color-primary)
- Screen reader: Status changes announced
```

**Expected output structure:**
```markdown
## Component Inventory

| Component | Archetype | Variants | Priority |
|-----------|-----------|----------|----------|
| ApplicationCard | Jar | default, hover, focus, active, disabled, selected | Critical |
| StatusBadge | Seed | applied, interviewing, rejected, offered | Critical |
| CompanyLogo | Pebble | square, circular | Medium |

## Layout Rules

### Mobile (375px)
- Single column layout
- Card width: 100% - 32px (16px padding each side)
- Card gap: 16px (--sys-spacing-4)
- StatusBadge: Absolute positioned top-right

### Desktop (1440px)
- 3 column grid
- Card width: calc((100% - 64px) / 3)
- Card gap: 24px (--sys-spacing-6)
- StatusBadge: Inline with JobTitle

## Interaction States

### ApplicationCard: Hover
- Background: --sys-color-surface-variant
- Border: 2px solid --sys-color-primary
- Transform: translateY(-2px)
- Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
- Shadow: --sys-elevation-2

### ApplicationCard: Focus
- Outline: 2px solid --sys-color-primary
- Outline offset: 4px
- Background: --sys-color-surface
- (Focus visible for keyboard nav)

## WCAG 2.2 AA Checklist

- [ ] Text contrast ≥ 4.5:1 (JobTitle on surface background)
- [ ] UI contrast ≥ 3:1 (StatusBadge borders)
- [ ] Focus visible (2px outline, 4px offset)
- [ ] Target size ≥ 44×44px (entire card clickable)
- [ ] Status changes announced (aria-live="polite")
- [ ] Keyboard accessible (Tab/Enter to select, Arrow keys to navigate)
```

**Human checkpoint:** Review accessibility compliance

**Next phase:** → Phase 5 (Accessibility Audit)

---

### Phase 5: Accessibility Audit (Accessibility Specialist)

**When to use:** After UI spec complete

**Input:** UI specification from Phase 4

**Output:** Severity-ranked issue list with concrete fixes

**How to invoke:**
```markdown
Conduct structured WCAG 2.2 AA heuristic review:

Spec to audit: [paste UI spec from Phase 4]

Audit criteria:
1. Perceivable (text alternatives, contrast, resize text)
2. Operable (keyboard, timing, navigation)
3. Understandable (readable, predictable, input assistance)
4. Robust (compatible with assistive tech)

Output format:
- Issue: [description]
- Severity: Critical / High / Medium / Low
- WCAG criterion: [e.g., 1.4.3 Contrast]
- Fix: [concrete solution]
```

**Example output:**
```markdown
## Critical Issues

**Issue**: StatusBadge "Rejected" uses --sys-color-error (#C45C4B) on white, contrast 3.2:1
**Severity**: Critical
**WCAG**: 1.4.3 Contrast (Minimum)
**Fix**: Change text color to --sys-color-on-error-container or increase badge background opacity

## High Issues

**Issue**: Card focus outline only 1px, difficult to see for low vision users
**Severity**: High
**WCAG**: 2.4.7 Focus Visible
**Fix**: Increase outline to 2px, add 4px offset for breathing room

## Fixes Applied

<accessibility>
StatusBadge (rejected):
  background: --sys-color-error-container
  color: --sys-color-on-error-container
  (Contrast: 7.8:1 ✅)

ApplicationCard (focus):
  outline: 2px solid --sys-color-primary
  outline-offset: 4px
  (Focus visible ✅)
</accessibility>
```

**Human checkpoint:** Validate all critical/high issues resolved

**Next phase:** → Phase 6 (Handoff)

---

### Phase 6: Handoff (Design Systems Specialist + Frontend Specialist)

**When to use:** After accessibility audit complete

**Input:** Approved UI spec + accessibility fixes

**Output:** Production-ready React code + Figma sync

**Step 1: Export tokens to Figma**
```bash
cd frontend
node scripts/sync-tokens-to-figma-vars.mjs
```

**Step 2: Convert design to React**
```bash
/figma-to-page

Arguments:
{
  "figma_url": "https://figma.com/file/...",
  "page_name": "ApplicationDashboard",
  "component_specs": "/path/to/ui-spec.md"
}

Output:
- pages/ApplicationDashboard/page.tsx
- pages/ApplicationDashboard/index.ts
- pages/ApplicationDashboard/styles.module.css
- Routing integration in config/navigation.tsx
```

**Step 3: Generate SVG primitives** (if needed)
```bash
/kr-svg "status badge icon" --archetype=seed --colors=semantic

Output: SVG with --sys-color-* CSS variables
```

**Step 4: Validate component compliance**
```bash
/ui-design-evaluator

Arguments:
{
  "screenshot_path": "/path/to/component-screenshot.png",
  "validation_mode": "kerala-rage-kr-solidarity"
}

Output: Compliance score + token usage validation
```

**Verification:**
- [ ] Tokens synced to Figma (bi-directional)
- [ ] React code uses semantic colors (`--sys-color-*`)
- [ ] Components follow archetype structure (Seed/Pebble/Jar/Lens/Cabinet/Stone)
- [ ] Accessibility attributes present (ARIA labels, roles, live regions)
- [ ] Compliance score ≥ 320/400 (80%)

**Next steps:** Component testing, integration testing, deployment

---

## 3. Tool Selection Guide

### Decision Tree

```
What are you trying to do?

├─ Define brand aesthetics & color palette
│  └─ Use: visual-design-director agent
│     Output: aestheticPreferences JSON
│     Follow-up: design-systems-architect agent
│
├─ Convert Figma design to React code
│  └─ Use: /figma-to-page skill (PRIMARY SPEED-DIAL)
│     Time: 2-5 minutes (vs 30-45 manual)
│     ROI: 6× faster
│
├─ Generate wireframes from brief
│  ├─ Option 1: /wireframe-annotator skill (automated)
│  └─ Option 2: /prompt-template wireframes-lowfi (manual)
│
├─ Validate design compliance
│  ├─ Kerala Rage standards → /kerala-rage-visual-audit
│  ├─ M3 Expressive standards → /m3-visual-audit
│  └─ Design tokens (DTCG) → /token-orchestrator
│
├─ Build production component
│  └─ Use: /component-builder skill
│     Archetype: Seed/Pebble/Jar/Lens/Cabinet/Stone
│     Output: TypeScript + React + CSS + tests
│
├─ Run parallel design tasks (3-5 components)
│  └─ Use: /task-router-mcp (queue-based delegation)
│     Example: 5 components in parallel vs sequential
│
├─ Generate design tokens
│  └─ Use: design-systems-architect agent
│     Sequence: color → typography → motion → backgrounds → hierarchy
│
└─ Troubleshoot token issues
   └─ Use: /token-orchestrator skill
      Validates: DTCG schema, contrast, circular refs
```

---

## 4. Common Design Tasks

### Task: Convert wireframe to mockup via Figma Dev Mode

**Time: 3-5 minutes per screen**

**Prerequisites:**
- Wireframe markdown in `docs/design/generated/wireframes/` with `<layout>`, `<tokens>`, `<accessibility>` blocks
- Figma MCP server configured (`claude_desktop_config.json` → `figma` entry)
- Environment: `FIGMA_ACCESS_TOKEN` and `FIGMA_FILE_KEY` set

**Steps:**

1. **Invoke ui-design-evaluator skill:**
```bash
/ui-design-evaluator

Arguments:
{
  "wireframe_path": "docs/design/generated/wireframes/dashboardoverview-screen.md",
  "validation_mode": "kerala-rage-kr-solidarity",
  "output_format": "html_mockup"
}

Output:
- Interactive HTML mockup artifact
- Compliance score (target: ≥ 320/400)
- Token mapping report
```

2. **Push to Figma via MCP:**
```bash
# Token sync ensures Figma has latest Kerala Rage variables
npm run tokens:push

# Use Figma MCP to create frame from mockup
# (via Claude Desktop with figma MCP server)
```

3. **Generate HiFi blueprint:**
```bash
# Output structured markdown to docs/design/hifi/
# Include: layout regions, typography, color, spacing, motion, motif slots
```

4. **Validate against existing HiFi (if one exists):**
```bash
# Compare generated mockup with existing hifi blueprint
diff docs/design/hifi/DashboardOverview-hifi.md /path/to/new-hifi.md
```

**Batch conversion via MCP:**
```json
{
  "task_id": "mockup-batch-tier1",
  "assigned_to": "ui-design-evaluator",
  "priority": "high",
  "inputs": {
    "wireframes": [
      "solidaritylanding-screen.md",
      "dashboardoverview-screen.md",
      "kanbanboard-screen.md",
      "analysisdashboard-screen.md",
      "splitscreeneditor-screen.md"
    ],
    "validation_threshold": 320,
    "output_figma": true
  }
}
```

**Acceptance criteria:**
- Mockup score ≥ 320/400 (80% compliance)
- Zero hardcoded colors (all `--sys-color-*` tokens)
- Typography uses variable fonts (Fraunces, Work Sans, JetBrains Mono)
- WCAG 2.2 AA contrast (4.5:1 text, 3:1 UI)
- HiFi blueprint generated in `docs/design/hifi/`

---

### Figma MCP Setup Guide

**1. Install Figma Code Connect:**
```bash
cd frontend && yarn add -D @figma/code-connect
```

**2. Set environment variables** (in `frontend/.env.local`):
```bash
FIGMA_ACCESS_TOKEN=figd_your_token_here  # Settings → Tokens → Create new
FIGMA_FILE_KEY=OQizDLqM9Y3qitGXiabkAv   # From Figma file URL
```

**3. MCP server** (already configured in `claude_desktop_config.json`):
```json
{
  "figma": {
    "command": "npx",
    "args": ["-y", "@anthropic-ai/mcp-server-figma", "--figma-access-token=${FIGMA_ACCESS_TOKEN}"]
  }
}
```

**4. Token sync commands:**
```bash
npm run tokens:push       # Push local tokens → Figma variables
npm run tokens:pull       # Pull Figma variables → local tokens
npm run tokens:sync       # Bi-directional sync
npm run tokens:sync:dry   # Preview changes without applying
npm run tokens:validate   # Validate token integrity
```

**5. Code Connect verification:**
```bash
npx figma connect verify  # Validates all .figma.tsx declarations
```

**Code Connect files** (link components to Figma nodes):
- `frontend/src/components/core/Leaf.figma.tsx` — Typography component
- `frontend/src/components/shared/TechCard.figma.tsx` — Card component
- `frontend/src/components/ui/Pebble.figma.tsx` — Action/button component
- `frontend/src/components/ui/Stone.figma.tsx` — Container component

---

### Task: Create a new page from Figma design

**Time: 2-5 minutes**

**Prerequisites:**
- Figma design in "Ready for Dev" state
- Design tokens defined in `frontend/src/design/tokens/tokens.json`
- Figma Inspect access (Copy as CSS)

**Steps:**

1. **Get Figma Inspect data:**
   - Open Figma file
   - Select artboard/frame
   - Copy as CSS (Cmd+Opt+C on Mac)
   - Save to `/tmp/figma-inspect.css`

2. **Invoke figma-to-page skill:**
```bash
/figma-to-page

Arguments:
{
  "figma_url": "https://figma.com/file/XYZ/ApplicationDashboard",
  "page_name": "ApplicationDashboard",
  "inspect_css_path": "/tmp/figma-inspect.css",
  "component_specs": "/path/to/ui-spec.md"  # Optional: from Phase 4
}
```

3. **Review generated files:**
```
pages/ApplicationDashboard/
├─ page.tsx          # React component with hooks
├─ index.ts          # Export barrel
├─ styles.module.css # Token-based styles
└─ __tests__/
   └─ ApplicationDashboard.test.tsx
```

4. **Verify token compliance:**
```bash
# Check for hardcoded colors (should be zero)
grep -r "#[0-9A-Fa-f]\{6\}" pages/ApplicationDashboard/

# Should use --sys-color-* variables
grep -r "var(--sys-color" pages/ApplicationDashboard/
```

5. **Run accessibility audit:**
```bash
/ui-design-evaluator

Arguments:
{
  "screenshot_path": "/screenshots/ApplicationDashboard-mobile.png",
  "validation_mode": "kerala-rage-kr-solidarity",
  "wcag_level": "AA"
}
```

**Common issues:**
- **Issue**: Hardcoded colors in generated CSS
  - **Fix**: Run `/token-injector` skill to auto-replace with `--sys-color-*`

- **Issue**: Missing ARIA attributes
  - **Fix**: Manually add `aria-label`, `role`, `aria-live` per Phase 5 audit

- **Issue**: Non-semantic HTML (`<div>` soup)
  - **Fix**: Replace with semantic elements (`<nav>`, `<article>`, `<section>`)

---

### Task: Validate component against kerala-rage standards

**Time: 1-2 minutes**

**Prerequisites:**
- Component screenshot (PNG, 1920×1080 recommended)
- OR component code (React/TypeScript)

**Option A: Visual audit (screenshot)**
```bash
/kerala-rage-visual-audit

Arguments:
{
  "screenshot_path": "/screenshots/DashboardCard.png",
  "component_name": "DashboardCard",
  "archetype": "Jar"  # Seed/Pebble/Jar/Lens/Cabinet/Stone
}

Output:
{
  "score": 340,  # Out of 400 (85% compliance)
  "typography_score": 90,  # Variable fonts, extreme contrast
  "color_score": 85,       # Semantic tokens, no hardcoded hex
  "layout_score": 80,      # Asymmetric spacing, organic shapes
  "accessibility_score": 85,  # WCAG 2.2 AA contrast
  "issues": [
    {
      "severity": "high",
      "category": "color",
      "message": "Hardcoded #1A1714 found, use --sys-color-asphaltBlack",
      "line": 23
    }
  ]
}
```

**Option B: Code audit (React component)**
```bash
/token-orchestrator

Arguments:
{
  "component_path": "src/components/DashboardCard.tsx",
  "validation_mode": "kerala-rage-kr-solidarity",
  "auto_fix": true  # Auto-replace hardcoded values
}

Output:
- DTCG schema compliance: ✅
- Circular reference check: ✅
- WCAG AA contrast: ✅ (18 token pairs validated)
- Hardcoded colors: ❌ Found 3 instances
  - Line 45: #D4A84B → --sys-color-kr-ink-gold
  - Line 67: #1A1714 → --sys-color-asphaltBlack
  - Line 89: #F5F0E8 → --sys-color-paperWhite
```

**Acceptance criteria:**
- Score ≥ 320/400 (80% compliance)
- Zero hardcoded colors (all `--sys-color-*`)
- Typography uses variable fonts (Fraunces, Work Sans, JetBrains Mono)
- WCAG 2.2 AA contrast (4.5:1 text, 3:1 UI)

---

### Task: Generate hero composition via Gemini (Automated)

**Time: 1-3 minutes**

**Prerequisites:**
- Gemini API key configured (`GEMINI_API_KEY` in `.env.local`)
- Asset manifest exists (`frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`)
- Hero registry exists (`frontend/public/assets/kr-solidarity/kr-solidarity.hero-registry.json`)

**Step 1: Choose a prompt template**

Available templates in `scripts/gemini-prompts/hero-composer.json`:

| Template ID | Use Case | Mood |
|---|---|---|
| `deterministic-layered-hero` | Standard layered composition | Configurable (defiance, reflection, etc.) |
| `cinematic-spiritual-hero` | Devotional/Shiva focal point | Mythic, solemn |
| `resistance-hero-street` | Anti-colonial urban aesthetic | Aggressive, wheat-paste energy |

**Step 2: Run the generator**

```bash
npm run hero:generate -- deterministic-layered-hero "Emotional register: Defiance. Cinematic asymmetry."
```

The generator:
- Reads the asset manifest (41 assets across 6 layers)
- Enforces layering rules (substrate → atmospheric → cultural/resistance/spiritual → typography → UI)
- Calls Gemini 2.0 Flash with structured JSON output
- Auto-retries on 429 rate limits (up to 5 retries with exponential backoff)
- Updates the hero registry automatically

**Step 3: Validate the output**

Use the `hero-composition-injector` skill to verify:
- ID uniqueness (no collisions in registry)
- Asset references exist in manifest
- Layer constraints respected (no spiritual + resistance coexistence)
- Typography pressure profile valid (register, weight_range, tracking_range)

**Step 4: Batch generation via MCP** (for multiple compositions)

```json
{
  "task_id": "hero-batch-generation",
  "assigned_to": "gemini-hero-generator",
  "priority": "medium",
  "inputs": {
    "templates": [
      {"id": "deterministic-layered-hero", "context": "Register: Defiance"},
      {"id": "cinematic-spiritual-hero", "context": "Shiva anchor, warm halo"},
      {"id": "resistance-hero-street", "context": "Bhagat Singh, Melbourne laneway"}
    ],
    "validate_after": true,
    "update_registry": true
  }
}
```

**Output schema** (per composition):
```json
{
  "hero_id": "string",
  "name": "string",
  "layers": [{"type": "substrate|atmospheric|cultural|resistance|spiritual", "asset_id": "string", "z_index": 1, "opacity": 1.0, "blend_mode": "normal", "position": "center"}],
  "typography": {"headline": "string", "supporting": "string", "pressure_profile": {"register": "defiance|reflection|discovery|control|craft", "weight_range": [400, 700], "tracking_range": [-0.02, 0.04]}},
  "animation": {"bezier": [0.34, 1.56, 0.64, 1], "parallax": true, "scroll_behavior": "weight_shift"}
}
```

---

### Task: Generate production component from scratch

**Time: 5-10 minutes**

**Prerequisites:**
- Component specification (from Phase 4) OR wireframe (from Phase 3)
- Design tokens defined

**Invoke component-builder skill:**
```bash
/component-builder

Arguments:
{
  "component_name": "ApplicationCard",
  "archetype": "Jar",  # Container component
  "wireframe_path": "/path/to/wireframe.md",
  "ui_spec_path": "/path/to/ui-spec.md",
  "features": [
    "TypeScript interfaces",
    "Zustand state integration",
    "TanStack Query hooks",
    "Jest unit tests",
    "Storybook stories"
  ]
}

Output:
components/ui/ApplicationCard/
├─ ApplicationCard.tsx       # React component (100% token-based)
├─ ApplicationCard.module.css  # Scoped styles (--sys-color-*)
├─ ApplicationCard.types.ts    # TypeScript interfaces
├─ useApplicationCard.ts       # Custom hook
├─ ApplicationCard.test.tsx    # Jest tests (>85% coverage)
└─ ApplicationCard.stories.tsx # Storybook stories (all variants)
```

**Generated component structure:**
```typescript
// ApplicationCard.tsx
import { useApplicationCard } from './useApplicationCard';
import styles from './ApplicationCard.module.css';
import type { ApplicationCardProps } from './ApplicationCard.types';

export const ApplicationCard = ({
  company,
  jobTitle,
  status,
  lastUpdated,
  onSelect
}: ApplicationCardProps) => {
  const { isExpanded, toggleExpanded } = useApplicationCard();

  return (
    <article
      className={styles.card}
      role="article"
      aria-labelledby={`job-title-${jobTitle}`}
    >
      <div className={styles.header}>
        <h3 id={`job-title-${jobTitle}`} className={styles.title}>
          {jobTitle}
        </h3>
        <StatusBadge status={status} />
      </div>
      <p className={styles.company}>{company}</p>
      <time className={styles.timestamp} dateTime={lastUpdated}>
        {formatRelativeTime(lastUpdated)}
      </time>
    </article>
  );
};
```

**Verification:**
```bash
# Run tests
yarn test ApplicationCard.test.tsx

# Run Storybook
yarn storybook
# Navigate to: Components > UI > ApplicationCard

# Check token compliance
grep "#[0-9A-Fa-f]" components/ui/ApplicationCard/ApplicationCard.module.css
# Should return zero results
```

---

### Task: Delegate 5 components to parallel agents via MCP

**Time: 15-20 minutes (vs 60-75 sequential)**

**Prerequisites:**
- MCP task router configured (`task-router-mcp` server running)
- Component specifications ready (from Phase 4)

**Create task queue:**
```bash
# Via task-router-mcp skill
/task-router-mcp create-batch

Arguments:
{
  "workflow_name": "dashboard-components-batch",
  "tasks": [
    {
      "task_id": "build-application-card",
      "assigned_to": "component-builder",
      "priority": "high",
      "inputs": {
        "component_name": "ApplicationCard",
        "archetype": "Jar",
        "spec_path": "/specs/application-card.md"
      }
    },
    {
      "task_id": "build-filter-bar",
      "assigned_to": "component-builder",
      "priority": "high",
      "inputs": {
        "component_name": "FilterBar",
        "archetype": "Cabinet",
        "spec_path": "/specs/filter-bar.md"
      }
    },
    {
      "task_id": "build-status-badge",
      "assigned_to": "component-builder",
      "priority": "medium",
      "inputs": {
        "component_name": "StatusBadge",
        "archetype": "Seed",
        "spec_path": "/specs/status-badge.md"
      }
    },
    {
      "task_id": "build-dashboard-header",
      "assigned_to": "component-builder",
      "priority": "medium",
      "inputs": {
        "component_name": "DashboardHeader",
        "archetype": "Cabinet",
        "spec_path": "/specs/dashboard-header.md"
      }
    },
    {
      "task_id": "build-empty-state",
      "assigned_to": "component-builder",
      "priority": "low",
      "inputs": {
        "component_name": "EmptyState",
        "archetype": "Lens",
        "spec_path": "/specs/empty-state.md"
      }
    }
  ]
}

Output:
{
  "batch_id": "dashboard-components-batch",
  "total_tasks": 5,
  "queued_tasks": 5,
  "status": "processing"
}
```

**Monitor progress:**
```bash
/task-router-mcp status

Output:
{
  "batch_id": "dashboard-components-batch",
  "total_tasks": 5,
  "completed": 3,
  "in_progress": 2,
  "pending": 0,
  "failed": 0,
  "progress": "60%",
  "tasks": [
    {
      "task_id": "build-application-card",
      "status": "completed",
      "agent": "component-builder-1",
      "duration_minutes": 8
    },
    {
      "task_id": "build-filter-bar",
      "status": "completed",
      "agent": "component-builder-2",
      "duration_minutes": 12
    },
    {
      "task_id": "build-status-badge",
      "status": "completed",
      "agent": "component-builder-3",
      "duration_minutes": 5
    },
    {
      "task_id": "build-dashboard-header",
      "status": "in_progress",
      "agent": "component-builder-1",
      "elapsed_minutes": 7
    },
    {
      "task_id": "build-empty-state",
      "status": "in_progress",
      "agent": "component-builder-2",
      "elapsed_minutes": 3
    }
  ]
}
```

**Retrieve completed components:**
```bash
/task-router-mcp retrieve

Arguments:
{
  "batch_id": "dashboard-components-batch",
  "task_id": "build-application-card"
}

Output:
{
  "status": "completed",
  "outputs": {
    "component_path": "components/ui/ApplicationCard/",
    "files_created": 5,
    "test_coverage": "87%",
    "storybook_url": "http://localhost:6006/?path=/story/ui-applicationcard--default"
  }
}
```

**Time savings:**
- Sequential: 5 components × 12 min avg = 60 minutes
- Parallel (3 agents): 20 minutes (67% faster)

---

### Sprint Coordinator for Final Deployment

Use `/sprint-coordinator` to orchestrate the final deployment sprint with unified planning, daily standups, and deployment readiness assessment.

**Scenario**: You're in the final week before production deployment and need to coordinate multiple teams, track progress, and make go/no-go decisions.

**Generate Sprint Plan:**
```bash
/sprint-coordinator plan

Arguments:
{
  "sprint_name": "Phase 5 Final Deployment Push",
  "duration_days": 7,
  "goals": [
    "Complete Phase 5 Dashboard implementation",
    "Achieve 90%+ test coverage",
    "Pass all WCAG 2.2 AA audits",
    "Deploy to production"
  ],
  "target_environment": "production"
}

Output: Sprint plan YAML with goals, milestones, tasks, risks, blockers, baseline metrics
```

**Generate Daily Standup:**
```bash
/sprint-coordinator standup

Arguments:
{
  "sprint_name": "Phase 5 Final Deployment Push",
  "day": 3,
  "queue_file": "/tmp/kerala-rage-task-queue.json"
}

Output: Markdown standup with completed/in-progress/pending tasks, blockers, health snapshot, velocity/ETA
```

**Deployment Readiness Assessment:**
```bash
/sprint-coordinator deployment-readiness

Arguments:
{
  "target_date": "2026-02-22",
  "environment": "production"
}

Output:
- Overall readiness score (0-100)
- Recommendation: GO / GO_WITH_CONDITIONS / NO_GO
- Weighted breakdown (test coverage, WCAG, security, performance)
- Pre-deployment checklist
- Blocking issues and required actions
```

**Sprint Coordinator Features:**
- **Unified Dashboard**: Aggregates health signals from codebase-orchestrator, project-health-checker, compliance-dashboard, audit-agent
- **Weighted Scoring**: Objective deployment readiness with configurable weights
- **Risk Tracking**: Automatic blocker escalation based on severity (critical=1 day, high=2 days, medium=3 days)
- **MCP Integration**: Creates task-router-compatible payloads for parallel execution
- **Velocity Tracking**: Calculates tasks/day and predicts sprint completion ETA

**When to Use:**
- Sprint kickoff planning (break goals → milestones → tasks)
- Daily progress tracking and blocker management
- Pre-deployment go/no-go decisions
- Parallel task delegation to multiple agents
- Final sprint coordination before production deployment

---

## 5. Example Prompts

### Prompt: Generate Design Brief

```markdown
Create a comprehensive design brief for [FEATURE NAME].

**Context:**
- Product: [Product name and core value proposition]
- Users: [Primary user personas and their goals]
- Problem: [Pain point this feature solves]
- Business goal: [Revenue, engagement, retention metric]

**Requirements:**
- Target platform: [Web/Mobile/Both]
- Accessibility: WCAG 2.2 AA minimum
- Design system: Kerala Rage kr-solidarity
- Timeline: [Sprint timeline]

**Constraints:**
- Technical: [API limitations, browser support, performance]
- Design: [Brand guidelines, existing patterns to maintain]
- Resources: [Team size, budget, third-party dependencies]

**Success Metrics:**
- [Metric 1 with target, e.g., "80% task completion rate"]
- [Metric 2 with target, e.g., "<5s time to first action"]
- [Metric 3 with target, e.g., "Zero critical WCAG violations"]

**Output Format:**
Use `/prompts/library/design-brief.md` template structure:
1. Problem Statement
2. Target Users
3. User Scenarios
4. Success Metrics
5. Design Principles
6. Known Risks
```

**Example instantiation:**
```markdown
Create a comprehensive design brief for Job Application Tracker Dashboard.

**Context:**
- Product: CareerCopilot - AI-powered job search assistant
- Users: Job seekers managing 5-20 simultaneous applications
- Problem: Scattered application data across email, spreadsheets, browser bookmarks
- Business goal: Increase user retention by 40% (reduce churn from overwhelm)

**Requirements:**
- Target platform: Web (responsive), Mobile app (future)
- Accessibility: WCAG 2.2 AA, screen reader compatible
- Design system: Kerala Rage kr-solidarity (Solidarity mode)
- Timeline: Sprint 3 (2 weeks)

**Constraints:**
- Technical: Must integrate with existing Firestore backend, <3s page load
- Design: Maintain consistent laneway aesthetic, no purple gradients
- Resources: 1 designer, 2 frontend engineers, Gemini API quota (10K calls/day)

**Success Metrics:**
- 80% user adoption (8/10 active users use dashboard weekly)
- <5 seconds to locate application status
- Zero critical WCAG violations (AA compliance 100%)
- 60% mobile usage (mobile-first design validation)

**Output Format:**
[...use template structure...]
```

---

### Prompt: Request User Flow Alternatives

```markdown
Generate 3 alternative user flows for [FEATURE/TASK].

**Design Brief Context:**
[Paste design brief from Phase 1]

**Required Flows:**
1. **Happy Path**: [Describe ideal scenario with no errors]
2. **Edge Case 1**: [e.g., "User has 50+ applications, needs filtering"]
3. **Edge Case 2**: [e.g., "API returns error, show graceful fallback"]

**Accessibility Requirements:**
- Full keyboard navigation (Tab, Enter, Arrow keys)
- Screen reader compatible (ARIA labels, live regions, semantic HTML)
- High contrast mode support (color not sole indicator of status)

**Output Format:**
Markdown table comparing flows:

| Step | Flow A (Simple) | Flow B (Power User) | Flow C (Accessible) |
|------|-----------------|---------------------|---------------------|
| 1    | [Action]        | [Action]            | [Action]            |
| ...  | ...             | ...                 | ...                 |

Include:
- Time estimate per flow (seconds)
- Accessibility score (0-100)
- Complexity rating (Low/Medium/High)
```

---

### Prompt: Generate Wireframe with Annotations

```markdown
Generate an annotated ASCII wireframe for [PAGE/COMPONENT NAME].

**User Flow Context:**
[Paste selected flow from Phase 2]

**Breakpoint**: [mobile (375px) / tablet (768px) / desktop (1440px)]

**Components to Include:**
- [Component 1 name and purpose]
- [Component 2 name and purpose]
- [Component 3 name and purpose]

**Required Annotation Blocks:**

**<layout>**
- ASCII diagram showing component hierarchy
- Grid structure (columns, rows, gap)
- Responsive behavior (how layout changes per breakpoint)

**<tokens>**
- Color mappings (use --sys-color-* semantic variables)
- Spacing values (use --sys-spacing-* tokens)
- Typography specs (font-family, weight, size from --sys-font-*)
- Shape values (border-radius from --sys-shape-*)

**<accessibility>**
- ARIA attributes (labels, roles, live regions)
- Keyboard navigation (Tab order, shortcuts)
- Focus management (trap focus in modals, restore on close)
- Screen reader announcements (status changes, errors)

**Example Output Format:**
```
<layout>
┌─────────────────────────────────────┐
│ [Component hierarchy here]          │
└─────────────────────────────────────┘
</layout>

<tokens>
ComponentName:
  property: token-reference
</tokens>

<accessibility>
- Component: ARIA attribute details
- Keyboard: Navigation pattern
</accessibility>
```

---

### Prompt: Request High-Fidelity UI Specification

```markdown
Generate high-fidelity UI specification for [COMPONENT NAME].

**Wireframe Context:**
[Paste wireframe from Phase 3 with layout/tokens/accessibility blocks]

**Component Requirements:**
- **States**: [e.g., default, hover, focus, active, disabled, error, loading, selected]
- **Breakpoints**: mobile (375px), tablet (768px), desktop (1440px)
- **Interactions**: [e.g., Click to expand, Swipe to archive (mobile), Drag to reorder]
- **Design Tokens**: Kerala Rage kr-solidarity semantic colors (`--sys-color-*`)

**Accessibility Requirements:**
- WCAG 2.2 AA contrast (4.5:1 text, 3:1 UI)
- Focus visible (2px outline, --sys-color-primary, 4px offset)
- Screen reader: [Specific announcements needed, e.g., "Status changed to Interviewing"]
- Keyboard: [Tab order, shortcuts, escape handling]

**Output Sections:**

1. **Component Inventory** (markdown table)
   - Component name, Archetype, Variants, Priority

2. **Layout Rules** (per breakpoint)
   - Grid structure, spacing, alignment, responsive behavior

3. **Interaction States** (for each state)
   - Visual changes (colors, borders, shadows, transforms)
   - Transitions (duration, easing function)
   - Token references (`--sys-color-*`, `--sys-elevation-*`, etc.)

4. **WCAG 2.2 AA Checklist** (with validation)
   - Text contrast calculations
   - UI contrast calculations
   - Focus indicator specs
   - Target size verification (≥44×44px)
   - Keyboard accessibility confirmation

**Example Component Inventory:**
| Component | Archetype | Variants | Priority |
|-----------|-----------|----------|----------|
| ApplicationCard | Jar | default, hover, focus, active, disabled, selected | Critical |
| StatusBadge | Seed | applied, interviewing, rejected, offered | Critical |

**Example Interaction State:**
### ApplicationCard: Hover
- Background: --sys-color-surface-variant
- Border: 2px solid --sys-color-primary
- Transform: translateY(-2px)
- Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
- Shadow: --sys-elevation-2

**Example WCAG Checklist:**
- [x] Text contrast ≥ 4.5:1 (JobTitle #1A1714 on #F5F0E8 = 12.6:1 ✅)
- [x] UI contrast ≥ 3:1 (StatusBadge border #D4A84B on #F5F0E8 = 4.1:1 ✅)
- [x] Focus visible (2px outline, --sys-color-primary, 4px offset)
- [x] Target size ≥ 44×44px (entire card clickable area = 343×120px ✅)
```

---

### Prompt: Delegate Task via MCP Task Router

```markdown
Create an MCP task delegation request for [TASK DESCRIPTION].

**Task Type:** [component-builder / wireframe-annotator / visual-audit / etc.]

**Priority:** [critical / high / medium / low]

**Inputs:**
- [Input 1 name]: [value or file path]
- [Input 2 name]: [value or file path]
- [Input 3 name]: [value or file path]

**Expected Outputs:**
- [Output 1 description]
- [Output 2 description]

**Acceptance Criteria:**
- [ ] [Criterion 1, e.g., "Test coverage ≥ 85%"]
- [ ] [Criterion 2, e.g., "WCAG 2.2 AA compliance 100%"]
- [ ] [Criterion 3, e.g., "Zero hardcoded colors"]

**Delegation Command:**
```bash
/task-router-mcp create

Arguments:
{
  "task_id": "[unique-task-id]",
  "assigned_to": "[skill-name or agent-name]",
  "priority": "[priority-level]",
  "inputs": {
    "[input-key]": "[input-value]"
  }
}
```

**Example: Delegate Component Build**
```bash
/task-router-mcp create

Arguments:
{
  "task_id": "build-application-card-component",
  "assigned_to": "component-builder",
  "priority": "high",
  "inputs": {
    "component_name": "ApplicationCard",
    "archetype": "Jar",
    "wireframe_path": "/specs/wireframes/application-card.md",
    "ui_spec_path": "/specs/ui/application-card-spec.md",
    "features": ["TypeScript", "Zustand", "TanStack Query", "Jest", "Storybook"]
  },
  "acceptance_criteria": [
    "Test coverage ≥ 85%",
    "WCAG 2.2 AA compliance 100%",
    "Zero hardcoded colors (all --sys-color-* tokens)",
    "Storybook stories for all 6 states"
  ]
}
```

**Monitor Task Progress:**
```bash
/task-router-mcp status

Arguments:
{
  "task_id": "build-application-card-component"
}
```

**Retrieve Completed Task:**
```bash
/task-router-mcp retrieve

Arguments:
{
  "task_id": "build-application-card-component"
}
```

---

## 6. MCP Task Delegation

### When to Use MCP Delegation

**Use MCP task-router when:**
- ✅ Building 3+ components in parallel (60% time savings)
- ✅ Running multiple validation audits simultaneously (design + accessibility + token compliance)
- ✅ Generating batch assets (5+ hero images, icon sets, illustrations)
- ✅ Executing multi-stage workflows (wireframe → spec → build → test → audit)
- ✅ Optimizing token usage (delegate heavy analysis to Flash-Sidekick MCP server)

**Don't use MCP delegation for:**
- ❌ Single component builds (<5 min, overhead not worth it)
- ❌ Interactive design exploration (requires human judgment loop)
- ❌ Tasks requiring real-time user feedback
- ❌ Simple validation checks (token-orchestrator runs in <30 seconds locally)

---

### MCP Server Architecture

**Available MCP Servers:**

1. **Flash Sidekick** (`servers/flash_sidekick.py`)
   - **Purpose**: Dual-engine Gemini analysis (Flash Lite for speed, Pro 2.5 for reasoning)
   - **Tools**: `consult_pro`, `quick_summarize`, `generate_idf`
   - **Token Savings**: 97-98% for heavy operations (file analysis >10KB)
   - **Use for**: Code analysis, long-text summarization, complex reasoning

2. **Task Router** (`servers/task_router_mcp.py`)
   - **Purpose**: Queue-based multi-agent task orchestration
   - **Tools**: `create_task`, `claim_task`, `complete_task`, `status`, `retrieve`
   - **Workflow**: Assign → Claim → Execute → Report → Next
   - **Use for**: Parallel component builds, batch asset generation

3. **GitHub MCP** (external)
   - **Purpose**: Cross-repo operations
   - **Tools**: 40+ operations (repos, files, issues, PRs, search)
   - **Use for**: Multi-repo search, PR/issue management

4. **Playwright MCP** (external)
   - **Purpose**: Browser automation
   - **Tools**: `browser_subagent`
   - **Use for**: E2E testing, UI screenshots, visual regression

---

### Example: Parallel Component Build (5 Components)

**Scenario**: Build 5 dashboard components in parallel instead of sequentially

**Sequential Time**: 5 components × 12 min = 60 minutes
**Parallel Time (3 agents)**: 20 minutes (67% faster)

**Step 1: Prepare component specifications** (Phase 4 outputs)
```
/specs/ui/
├─ application-card-spec.md
├─ filter-bar-spec.md
├─ status-badge-spec.md
├─ dashboard-header-spec.md
└─ empty-state-spec.md
```

**Step 2: Create batch task queue**
```bash
/task-router-mcp create-batch

Arguments:
{
  "workflow_name": "dashboard-components-parallel",
  "tasks": [
    {
      "task_id": "build-application-card",
      "assigned_to": "component-builder",
      "priority": "high",
      "inputs": {
        "component_name": "ApplicationCard",
        "archetype": "Jar",
        "spec_path": "/specs/ui/application-card-spec.md"
      }
    },
    {
      "task_id": "build-filter-bar",
      "assigned_to": "component-builder",
      "priority": "high",
      "inputs": {
        "component_name": "FilterBar",
        "archetype": "Cabinet",
        "spec_path": "/specs/ui/filter-bar-spec.md"
      }
    },
    {
      "task_id": "build-status-badge",
      "assigned_to": "component-builder",
      "priority": "medium",
      "inputs": {
        "component_name": "StatusBadge",
        "archetype": "Seed",
        "spec_path": "/specs/ui/status-badge.spec.md"
      }
    },
    {
      "task_id": "build-dashboard-header",
      "assigned_to": "component-builder",
      "priority": "medium",
      "inputs": {
        "component_name": "DashboardHeader",
        "archetype": "Cabinet",
        "spec_path": "/specs/ui/dashboard-header-spec.md"
      }
    },
    {
      "task_id": "build-empty-state",
      "assigned_to": "component-builder",
      "priority": "low",
      "inputs": {
        "component_name": "EmptyState",
        "archetype": "Lens",
        "spec_path": "/specs/ui/empty-state-spec.md"
      }
    }
  ]
}
```

**Step 3: Monitor progress** (poll every 2-3 minutes)
```bash
/task-router-mcp status

Arguments:
{
  "workflow_name": "dashboard-components-parallel"
}

Output (after 8 minutes):
{
  "workflow_name": "dashboard-components-parallel",
  "total_tasks": 5,
  "completed": 2,
  "in_progress": 2,
  "pending": 1,
  "failed": 0,
  "progress": "40%",
  "estimated_completion": "12 minutes remaining"
}
```

**Step 4: Retrieve completed components**
```bash
/task-router-mcp retrieve

Arguments:
{
  "workflow_name": "dashboard-components-parallel",
  "task_id": "build-application-card"
}

Output:
{
  "status": "completed",
  "outputs": {
    "component_path": "components/ui/ApplicationCard/",
    "files_created": [
      "ApplicationCard.tsx",
      "ApplicationCard.module.css",
      "ApplicationCard.types.ts",
      "useApplicationCard.ts",
      "ApplicationCard.test.tsx",
      "ApplicationCard.stories.tsx"
    ],
    "test_coverage": "87%",
    "wcag_compliance": "100% AA",
    "token_compliance": "100% (zero hardcoded colors)"
  }
}
```

**Step 5: Validate all components**
```bash
# Run tests for all generated components
yarn test:coverage components/ui/

# Run Storybook to visually inspect
yarn storybook
```

**Outcome:**
- ✅ 5 components built in 20 minutes (vs 60 sequential)
- ✅ All components pass tests (>85% coverage)
- ✅ WCAG 2.2 AA compliant
- ✅ Zero hardcoded colors (100% token-based)
- ✅ Storybook stories for all states

---

### Example: Multi-Stage Workflow (Wireframe → Spec → Build → Audit)

**Scenario**: Automate full design-to-code pipeline for new page

**Sequential Time**: ~90 minutes (15 + 30 + 30 + 15)
**Orchestrated Time**: ~35 minutes (62% faster)

**Step 1: Create workflow definition** (`workflows/new-page-pipeline.yaml`)
```yaml
workflow:
  name: "application-dashboard-pipeline"
  description: "Wireframe → Spec → Build → Audit for ApplicationDashboard page"

  shared_context:
    project_name: "CareerCopilot"
    design_tokens_path: "frontend/src/design/tokens/tokens.json"

  stages:
    - name: "wireframe"
      skill_name: "wireframe-annotator"
      arguments:
        brief_path: "/specs/briefs/application-dashboard.md"
        breakpoints: ["mobile", "tablet", "desktop"]
      validation:
        min_score: 320
        max_retries: 1

    - name: "spec"
      skill_name: "component-spec-generator"
      arguments:
        wireframe_path: "{wireframe.output.file_path}"  # Previous stage output
        components: ["ApplicationCard", "FilterBar", "DashboardHeader"]

    - name: "build"
      skill_name: "component-builder"
      arguments:
        component_name: "ApplicationDashboard"
        archetype: "Cabinet"
        spec_path: "{spec.output.spec_path}"  # Previous stage output

    - name: "audit"
      skill_name: "kerala-rage-visual-audit"
      arguments:
        component_path: "{build.output.component_path}"  # Previous stage output
      validation:
        min_score: 320  # 80% compliance required
```

**Step 2: Execute workflow**
```bash
/task-router-mcp run-workflow

Arguments:
{
  "workflow_definition_path": "/workflows/new-page-pipeline.yaml",
  "stop_on_failure": true,  # Halt if any stage fails validation
  "notify_on_completion": true
}

Output:
{
  "workflow_id": "app-dashboard-pipeline-20260215-1530",
  "status": "running",
  "current_stage": "wireframe",
  "progress": "0/4 stages completed"
}
```

**Step 3: Monitor workflow progress**
```bash
/task-router-mcp workflow-status

Arguments:
{
  "workflow_id": "app-dashboard-pipeline-20260215-1530"
}

Output (after 15 minutes):
{
  "workflow_id": "app-dashboard-pipeline-20260215-1530",
  "status": "running",
  "current_stage": "build",
  "progress": "2/4 stages completed",
  "stages": [
    {
      "name": "wireframe",
      "status": "completed",
      "duration_minutes": 8,
      "output": {
        "file_path": "/output/wireframes/application-dashboard.md",
        "score": 340
      }
    },
    {
      "name": "spec",
      "status": "completed",
      "duration_minutes": 12,
      "output": {
        "spec_path": "/output/specs/application-dashboard-spec.md",
        "components_count": 3
      }
    },
    {
      "name": "build",
      "status": "in_progress",
      "elapsed_minutes": 10,
      "estimated_remaining": "5 minutes"
    },
    {
      "name": "audit",
      "status": "pending"
    }
  ]
}
```

**Step 4: Retrieve final outputs**
```bash
/task-router-mcp workflow-retrieve

Arguments:
{
  "workflow_id": "app-dashboard-pipeline-20260215-1530"
}

Output:
{
  "workflow_id": "app-dashboard-pipeline-20260215-1530",
  "status": "completed",
  "total_duration_minutes": 35,
  "stages": [
    {
      "name": "wireframe",
      "output": {
        "file_path": "/output/wireframes/application-dashboard.md",
        "score": 340
      }
    },
    {
      "name": "spec",
      "output": {
        "spec_path": "/output/specs/application-dashboard-spec.md"
      }
    },
    {
      "name": "build",
      "output": {
        "component_path": "pages/ApplicationDashboard/",
        "files_created": 8
      }
    },
    {
      "name": "audit",
      "output": {
        "compliance_score": 350,  # 87.5% compliance
        "wcag_aa": "100%",
        "token_compliance": "100%",
        "issues": []  # No critical issues
      }
    }
  ]
}
```

**Outcome:**
- ✅ Full pipeline executed in 35 minutes (vs 90 sequential)
- ✅ All validation gates passed (score ≥ 320)
- ✅ Production-ready page component generated
- ✅ Zero manual intervention required

---

### MCP Optimization: Flash Sidekick for Heavy Analysis

**When to delegate to Flash-Sidekick:**
- File analysis >10KB (97% token savings)
- Long-text summarization (documentation, specifications)
- Complex reasoning (architectural decisions, trade-off analysis)
- Code quality analysis (large component files)

**Example: Delegate Design Brief Analysis**
```bash
# Instead of analyzing 50KB design brief in main conversation:
# Token cost: ~50,000 tokens

# Delegate to Flash-Sidekick:
# Token cost: ~1,500 tokens (97% savings)

/flash-sidekick consult-pro

Arguments:
{
  "file_path": "/specs/briefs/application-dashboard.md",
  "task": "Analyze design brief for completeness. Identify missing accessibility requirements, unclear success metrics, and ambiguous technical constraints. Provide actionable recommendations."
}

Output:
{
  "summary": "Brief is 80% complete. Missing items: keyboard navigation specs, screen reader requirements, performance budget (page load time). Success metrics need quantification (e.g., 'improve retention' → 'increase 30-day retention from 40% to 60%').",
  "recommendations": [
    "Add accessibility section with WCAG 2.2 AA requirements",
    "Quantify all success metrics with baseline and target values",
    "Specify performance budget: <3s page load, <100ms interaction latency"
  ],
  "tokens_used": 1247
}
```

**MCP Usage Policy** (`.claude/mcp-usage-policy.md`):
- **Flash-Sidekick for**: File analysis >10KB, code quality, summarization
- **Filesystem MCP for**: Small config (<5KB), precise editing, file creation
- **Token Savings**: 97-98% when using Flash-Sidekick for heavy operations

---

## 7. Troubleshooting

### Issue: Hardcoded colors in generated components

**Symptom:**
```css
/* ApplicationCard.module.css */
.card {
  background: #F5F0E8;  /* ❌ Hardcoded */
  color: #1A1714;       /* ❌ Hardcoded */
}
```

**Root Cause**: Component generator didn't reference design tokens

**Fix 1: Auto-replace with token-injector skill**
```bash
/token-injector

Arguments:
{
  "file_path": "components/ui/ApplicationCard/ApplicationCard.module.css",
  "mode": "auto-replace"
}

Output:
{
  "replacements": 3,
  "changes": [
    "#F5F0E8 → var(--sys-color-paperWhite)",
    "#1A1714 → var(--sys-color-asphaltBlack)",
    "#D4A84B → var(--sys-color-kr-ink-gold)"
  ]
}
```

**Fix 2: Manual replacement** (for learning)
```css
/* ApplicationCard.module.css */
.card {
  background: var(--sys-color-paperWhite);  /* ✅ Semantic token */
  color: var(--sys-color-asphaltBlack);     /* ✅ Semantic token */
}
```

**Prevention**: Always specify `use_design_tokens: true` in component-builder arguments

---

### Issue: WCAG contrast failure

**Symptom:**
```bash
/kerala-rage-visual-audit

Output:
{
  "score": 280,  # Below 320 threshold
  "issues": [
    {
      "severity": "critical",
      "category": "accessibility",
      "message": "StatusBadge 'Rejected' text contrast 3.2:1, needs ≥4.5:1",
      "wcag": "1.4.3 Contrast (Minimum)"
    }
  ]
}
```

**Root Cause**: `--sys-color-error` (#C45C4B) on white background = 3.2:1 contrast

**Fix**: Use error container tokens
```css
/* Before (fails WCAG) */
.statusBadge--rejected {
  background: white;
  color: var(--sys-color-error);  /* 3.2:1 ❌ */
}

/* After (passes WCAG) */
.statusBadge--rejected {
  background: var(--sys-color-error-container);
  color: var(--sys-color-on-error-container);  /* 7.8:1 ✅ */
}
```

**Verification:**
```bash
# Re-run audit
/kerala-rage-visual-audit

Output:
{
  "score": 350,  # Now passing
  "accessibility_score": 95,
  "wcag_aa_compliance": "100%"
}
```

---

### Issue: Missing ARIA attributes in generated component

**Symptom:**
```tsx
// ApplicationCard.tsx (incorrect)
<div className={styles.card} onClick={onSelect}>
  <h3>{jobTitle}</h3>
  <p>{company}</p>
</div>
```

**Problems:**
- Not using semantic HTML (`<article>` for card)
- No ARIA label for screen readers
- No keyboard accessibility (div not focusable)

**Fix**: Add semantic HTML + ARIA attributes
```tsx
// ApplicationCard.tsx (corrected)
<article
  className={styles.card}
  onClick={onSelect}
  onKeyDown={(e) => e.key === 'Enter' && onSelect()}
  tabIndex={0}
  role="article"
  aria-labelledby={`job-title-${id}`}
>
  <h3 id={`job-title-${id}`} className={styles.title}>
    {jobTitle}
  </h3>
  <p className={styles.company}>{company}</p>
</article>
```

**Improvements:**
- ✅ `<article>` semantic HTML
- ✅ `aria-labelledby` links to heading
- ✅ `tabIndex={0}` enables keyboard focus
- ✅ `onKeyDown` handles Enter key
- ✅ `role="article"` explicit for screen readers

**Prevention**: Always specify `accessibility_level: "WCAG_AA"` in component-builder arguments

---

### Issue: Token circular reference error

**Symptom:**
```bash
ERROR: Circular reference detected in design tokens
  --sys-color-primary → --sys-color-primary-50 → --sys-color-primary
```

**Root Cause**: Token references itself in value chain

**Diagnosis:**
```bash
/token-orchestrator

Arguments:
{
  "tokens_path": "frontend/src/design/tokens/tokens.json",
  "validation_mode": "circular-ref-check"
}

Output:
{
  "circular_references": [
    {
      "token": "--sys-color-primary",
      "chain": [
        "--sys-color-primary",
        "--sys-color-primary-50",
        "--sys-color-primary"
      ]
    }
  ]
}
```

**Fix**: Break circular reference
```json
// tokens.json (before - circular)
{
  "sys-color-primary": {
    "value": "{sys-color-primary-50}",  // ❌ References variant
    "type": "color"
  },
  "sys-color-primary-50": {
    "value": "{sys-color-primary}",     // ❌ References base
    "type": "color"
  }
}

// tokens.json (after - fixed)
{
  "sys-color-primary": {
    "value": "#D4A84B",                 // ✅ Direct value
    "type": "color"
  },
  "sys-color-primary-50": {
    "value": "{sys-color-primary}",     // ✅ References base
    "type": "color"
  }
}
```

**Verification:**
```bash
/token-orchestrator

Output:
{
  "circular_references": [],
  "dtcg_schema_valid": true,
  "wcag_contrast_valid": true
}
```

---

### Issue: MCP task stuck in "in_progress" status

**Symptom:**
```bash
/task-router-mcp status

Output:
{
  "task_id": "build-application-card",
  "status": "in_progress",
  "claimed_by": "component-builder-agent-2",
  "elapsed_minutes": 45,  # Stuck for 45 minutes
  "expected_duration": "10-12 minutes"
}
```

**Root Cause**: Agent crashed or lost connection

**Fix 1: Check agent logs**
```bash
# View MCP task router logs
tail -f ~/.careercopilot/logs/task-router-mcp.log

# Look for error messages from agent-2
grep "component-builder-agent-2" ~/.careercopilot/logs/task-router-mcp.log
```

**Fix 2: Manually cancel stuck task**
```bash
/task-router-mcp cancel

Arguments:
{
  "task_id": "build-application-card",
  "reason": "Agent timeout after 45 minutes"
}

Output:
{
  "status": "cancelled",
  "task_id": "build-application-card",
  "reassigned": false
}
```

**Fix 3: Reassign to new agent**
```bash
/task-router-mcp reassign

Arguments:
{
  "task_id": "build-application-card",
  "new_agent": "component-builder-agent-1"
}

Output:
{
  "status": "reassigned",
  "task_id": "build-application-card",
  "claimed_by": "component-builder-agent-1",
  "status": "pending"
}
```

**Prevention**: Set task timeout in workflow definition
```yaml
stages:
  - name: "build"
    skill_name: "component-builder"
    timeout_minutes: 15  # Auto-cancel after 15 min
```

---

## 8. Design System Reference

### Semantic Color Variables (Complete Reference)

**Base Colors:**
- `--sys-color-asphaltBlack` (#1A1714) - Global floor, dark backgrounds
- `--sys-color-paperWhite` (#F5F0E8) - Light surfaces, high contrast text
- `--sys-color-kr-ink-gold` (#D4A84B) - Primary brand, key actions
- `--sys-color-waratahRed` (#C45C4B) - Secondary brand, urgent actions
- `--sys-color-ochreEarth` (#B8733D) - Tertiary brand, grounded elements
- `--sys-color-gumLeafGreen` (#6B7F6E) - Shadows, natural accents
- `--sys-color-concreteGrey` (#A39B8F) - Neutral UI, borders, disabled states

**Tonal Palettes** (M3 Standard 0-100, 13 stops per role):

**Primary** (based on kr-ink-gold):
```css
--sys-color-primary-0: #000000;
--sys-color-primary-10: #2A1F0B;  /* Darkest container */
--sys-color-primary-20: #453514;
--sys-color-primary-30: #5F4A1D;
--sys-color-primary-40: #8B7A35;  /* Standard container */
--sys-color-primary-50: #D4A84B;  /* Base */
--sys-color-primary-60: #DDB663;
--sys-color-primary-70: #E5C47B;
--sys-color-primary-80: #EDD293;
--sys-color-primary-90: #FFF8EB;  /* Lightest surface */
--sys-color-primary-95: #FFFCF5;
--sys-color-primary-99: #FFFEFB;
--sys-color-primary-100: #FFFFFF;
```

**Error** (based on waratahRed):
```css
--sys-color-error: #C45C4B;
--sys-color-error-container: #F9DEDB;
--sys-color-on-error: #FFFFFF;
--sys-color-on-error-container: #410002;
```

**Surface Variants:**
```css
--sys-color-surface: #F5F0E8;         /* Base surface */
--sys-color-surface-dim: #D6D1C9;     /* Dimmed variant */
--sys-color-surface-bright: #FFFCF5;  /* Brightened variant */
--sys-color-surface-container: #EAE5DD;
--sys-color-surface-container-low: #F0EBE3;
--sys-color-surface-container-high: #E4DFD7;
--sys-color-surface-container-highest: #DED9D1;

--sys-color-on-surface: #1A1714;        /* Text on surfaces */
--sys-color-on-surface-variant: #4A4541;
```

**Usage Rules:**
1. **Never hardcode hex values** - always use semantic tokens
2. **Container tokens for backgrounds** - use `*-container` variants
3. **On-* tokens for content** - use `on-*` variants for text/icons on colored backgrounds
4. **Tonal steps for elevation** - use step progression for depth (10 → 20 → 30)

---

### Typography System (Variable Fonts)

**Font Families:**
```css
--sys-font-family-headline: 'Fraunces', serif;        /* Expressive, warm */
--sys-font-family-body: 'Work Sans', sans-serif;       /* Modern, legible */
--sys-font-family-code: 'JetBrains Mono', monospace;   /* Code, data */
--sys-font-family-accent: 'Nabla', sans-serif;         /* COLRv1 color font, brand moments */
```

**Font Sizes** (M3 Expressive Scale):
```css
/* Headlines (Fraunces) */
--sys-font-headline-large: 3.5rem;    /* 56px */
--sys-font-headline-medium: 2.8rem;   /* 45px */
--sys-font-headline-small: 2rem;      /* 32px */

/* Titles (Work Sans) */
--sys-font-title-large: 1.375rem;     /* 22px */
--sys-font-title-medium: 1rem;        /* 16px */
--sys-font-title-small: 0.875rem;     /* 14px */

/* Body (Work Sans) */
--sys-font-body-large: 1rem;          /* 16px */
--sys-font-body-medium: 0.875rem;     /* 14px */
--sys-font-body-small: 0.75rem;       /* 12px */

/* Labels (Work Sans) */
--sys-font-label-large: 0.875rem;     /* 14px */
--sys-font-label-medium: 0.75rem;     /* 12px */
--sys-font-label-small: 0.688rem;     /* 11px */
```

**Font Weights** (Variable Font Axis):
```css
/* Fraunces (100-900, variable) */
--sys-font-weight-headline: 700;      /* Bold for headlines */

/* Work Sans (100-900, variable) */
--sys-font-weight-title: 600;         /* Semibold for titles */
--sys-font-weight-body: 400;          /* Regular for body */
--sys-font-weight-label: 500;         /* Medium for labels */

/* JetBrains Mono (100-800, variable) */
--sys-font-weight-code: 400;          /* Regular for code */
```

**Line Heights:**
```css
--sys-line-height-headline: 1.2;      /* Tight for headlines */
--sys-line-height-title: 1.4;         /* Moderate for titles */
--sys-line-height-body: 1.6;          /* Relaxed for body */
```

**Usage Example:**
```css
.jobTitle {
  font-family: var(--sys-font-family-headline);
  font-size: var(--sys-font-headline-small);
  font-weight: var(--sys-font-weight-headline);
  line-height: var(--sys-line-height-headline);
  color: var(--sys-color-on-surface);
}

.accentBadge {
  font-family: var(--sys-font-family-accent);
  font-size: var(--sys-font-label-large);
  font-palette: var(--kerala-rage-palette, --kerala-rage-sepia);
}
```

**Nabla Color Font Palettes:**
```css
@font-palette-values --kerala-rage-sepia {
  font-family: 'Nabla';
  base-palette: 0;
  override-colors:
    0 #4a3b32,  /* Brown */
    1 #d4c5b0;  /* Cream */
}

@font-palette-values --kerala-rage-neon {
  font-family: 'Nabla';
  base-palette: 1;
  override-colors:
    0 #D4A84B,  /* kr-ink-gold */
    1 #C45C4B;  /* waratahRed */
}

/* Usage: Switch palette via CSS variable */
.accentText {
  font-family: var(--sys-font-family-accent);
  font-palette: var(--current-palette, --kerala-rage-sepia);
  transition: font-palette 0.5s;
}

/* Dark mode override */
[data-theme="dark"] {
  --current-palette: --kerala-rage-neon;
}
```

---

### Spacing System (8px Base Grid)

```css
--sys-spacing-0: 0;
--sys-spacing-1: 0.25rem;   /* 4px */
--sys-spacing-2: 0.5rem;    /* 8px */
--sys-spacing-3: 0.75rem;   /* 12px */
--sys-spacing-4: 1rem;      /* 16px */
--sys-spacing-5: 1.25rem;   /* 20px */
--sys-spacing-6: 1.5rem;    /* 24px */
--sys-spacing-8: 2rem;      /* 32px */
--sys-spacing-10: 2.5rem;   /* 40px */
--sys-spacing-12: 3rem;     /* 48px */
--sys-spacing-16: 4rem;     /* 64px */
--sys-spacing-20: 5rem;     /* 80px */
--sys-spacing-24: 6rem;     /* 96px */
```

**Usage Guidelines:**
- **Component padding**: `--sys-spacing-4` to `--sys-spacing-6` (16-24px)
- **Component gaps**: `--sys-spacing-4` (16px) for related items
- **Section spacing**: `--sys-spacing-12` to `--sys-spacing-16` (48-64px)
- **Page margins**: `--sys-spacing-6` (mobile), `--sys-spacing-12` (desktop)

---

### Shape System (Border Radius)

```css
--sys-shape-none: 0;
--sys-shape-extra-small: 0.25rem;   /* 4px - Chips, small badges */
--sys-shape-small: 0.5rem;          /* 8px - Buttons, small cards */
--sys-shape-medium: 0.75rem;        /* 12px - Standard cards */
--sys-shape-large: 1rem;            /* 16px - Large cards, modals */
--sys-shape-extra-large: 1.75rem;   /* 28px - Hero sections */
--sys-shape-full: 9999px;           /* Full circle/pill */
```

**Kerala Rage Override** (Asymmetric Shapes):
```css
/* Use asymmetric radius for organic feel */
.applicationCard {
  border-radius:
    var(--sys-shape-medium) /* top-left */
    var(--sys-shape-large)  /* top-right */
    var(--sys-shape-medium) /* bottom-right */
    var(--sys-shape-small); /* bottom-left */
}
```

---

### Elevation System (Box Shadows)

```css
--sys-elevation-0: none;

--sys-elevation-1:
  0px 1px 2px 0px rgba(0, 0, 0, 0.3),
  0px 1px 3px 1px rgba(0, 0, 0, 0.15);

--sys-elevation-2:
  0px 1px 2px 0px rgba(0, 0, 0, 0.3),
  0px 2px 6px 2px rgba(0, 0, 0, 0.15);

--sys-elevation-3:
  0px 1px 3px 0px rgba(0, 0, 0, 0.3),
  0px 4px 8px 3px rgba(0, 0, 0, 0.15);

--sys-elevation-4:
  0px 2px 3px 0px rgba(0, 0, 0, 0.3),
  0px 6px 10px 4px rgba(0, 0, 0, 0.15);

--sys-elevation-5:
  0px 4px 4px 0px rgba(0, 0, 0, 0.3),
  0px 8px 12px 6px rgba(0, 0, 0, 0.15);
```

**Usage:**
- **Level 0**: Flat surfaces (backgrounds)
- **Level 1**: Slightly raised (cards at rest)
- **Level 2**: Elevated (cards on hover, dropdowns)
- **Level 3**: Floating (modals, tooltips)
- **Level 4**: High priority (alerts, notifications)
- **Level 5**: Maximum prominence (hero overlays)

---

## 9. Appendices

### Appendix A: Complete Skill Registry (91 Skills)

**Design System Skills (19)**
1. kerala-rage-typography-strategy
2. expressive-typography-manipulation
3. token-orchestrator
4. kerala-rage-visual-audit
5. design-token-validator
6. auto-validator
7. vision-scorer-mcp
8. m3-visual-audit
9. m3-expressive-token-orchestrator
10. ui-design-evaluator
11. figma-token-sync
12. m3-expressive-ui-evaluator
13. m3-aesthetic-creator
14. kerala-rage-brand-enforcer
15. kerala-rage-asset-cataloger
16. kr-svg
17. asset-placement-strategy
18. compliance-dashboard
19. m3-expressive-compliance-dashboard

**Development Skills (16)**
20. component-builder
21. component-transformer
22. storybook-scaffolder
23. component-spec-generator
24. figma-to-page
25. react-page-scaffolder
26. wireframe-annotator
27. jest-test-scaffolder
28. pytest-test-scaffolder
29. pydantic-model-scaffolder
30. careercopilot-tool-creator
31. careercopilot-agent-scaffolder
32. fastapi-endpoint-scaffolder (implied)
33. frontend-backend-mapper
34. api-contract-validator
35. skill-creator

**Project Management & Orchestration (9)**
36. task-router-mcp
37. task-delegator
38. codebase-orchestrator
39. compliance-dashboard (duplicate from design, multi-purpose)
40. asset-packager
41. batch-processor
42. skill-reviewer
43. project-health-checker
44. deployment-manager

**Asset Management (8)**
45. kerala-rage-asset-cataloger (duplicate from design)
46. asset-metadata-enricher
47. asset-token-replacer
48. asset-path-validator
49. manifest-reconciler
50. registry-version-bumper
51. hero-composition-injector
52. pattern-learner

**Validation & Auditing (11)**
53. token-orchestrator (duplicate from design)
54. design-token-validator (duplicate from design)
55. auto-validator (duplicate from design)
56. kerala-rage-visual-audit (duplicate from design)
57. m3-visual-audit (duplicate from design)
58. component-visual-audit
59. ui-design-evaluator (duplicate from design)
60. m3-expressive-ui-evaluator (duplicate from design)
61. hifi-blueprint-linter
62. audit-agent
63. root-cause-tracer

**Documentation & Guides (5)**
64. brand-brief-optimizer
65. design-system-doc-generator
66. json-schema-updater
67. prompt-composer
68. example-skill

**Utilities (8)**
69. pdf-text-extractor
70. docx-document-editor
71. xlsx-spreadsheet-editor
72. video-generator
73. artifact-bundler
74. token-injector
75. git-commit-batcher
76. keybindings-help

**Testing & E2E (4)**
77. webapp-testing
78. test-runner (implied)
79. test-automation-specialist (implied)
80. playwright-mcp (external)

**Infrastructure (4)**
81. flash-sidekick (MCP server)
82. task-router-mcp (duplicate, also MCP server)
83. github-mcp (external)
84. docker-mcp (external)

**Deprecated/Legacy (8)**
85. react-component-scaffolder (DEPRECATED: use component-builder)
86. frontend-migration (placeholder)
87. theme-factory (placeholder)
88. northcote-typography-strategy (DEPRECATED: use kerala-rage)
89. northcote-visual-audit (DEPRECATED: use kerala-rage)
90. enforce-routing (MCP routing mode)
91. route (MCP routing engine)

---

### Appendix B: Agent Capabilities Matrix

| Agent | Role | Primary Responsibility | Outputs | Invocation |
|-------|------|------------------------|---------|------------|
| **design-project-manager** | Orchestrator | Route tasks to specialized agents | Task assignments | `/design-project-manager` |
| **visual-design-director** | Art Director | Define aesthetic preferences | `aestheticPreferences JSON` | Delegate via project-manager |
| **design-systems-architect** | Design Ops | Generate design token hierarchy | `tokens-expressive.json` | Delegate via project-manager |
| **design-system-validator** | QA Specialist | WCAG compliance + aesthetic scoring | Validation report | Delegate via project-manager |
| **frontend-specialist** | React Engineer | Build production components | React/TypeScript code | Delegate via project-manager |
| **ux-accessibility-lead** | Accessibility | WCAG audits, ARIA implementation | Accessibility fixes | Delegate via project-manager |

---

### Appendix C: Workflow Phase Summary

| Phase | Duration | Input | Output | Checkpoint |
|-------|----------|-------|--------|------------|
| 1. Research & Briefing | 30-60 min | Product requirements | Design brief | Equity/inclusion review |
| 2. Ideation & Flows | 30-45 min | Design brief | 2-3 alternative flows | Select most ethical flow |
| 3. Wireframing | 45-60 min | Selected flow | ASCII wireframes | Validate mobile-first |
| 4. UI Specification | 60-90 min | Wireframe | Component specs + states | Review accessibility |
| 5. Accessibility Audit | 30-45 min | UI spec | Issue list + fixes | Validate WCAG compliance |
| 6. Handoff | 30-60 min | UI spec + fixes | React code + Figma sync | Compliance scoring |
| **Total** | **4-6 hours** | Product idea | Production code | Multiple checkpoints |

---

### Appendix D: MCP Server Configuration

**Claude Desktop config** (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "flash-sidekick": {
      "command": "/path/to/venv/bin/python3",
      "args": ["/path/to/servers/flash_sidekick.py"],
      "env": {
        "GEMINI_API_KEY": "your-api-key",
        "GEMINI_MODEL_FLASH": "gemini-2.5-flash",
        "GEMINI_MODEL_PRO": "gemini-2.5-pro"
      }
    },
    "task-router": {
      "command": "/path/to/venv/bin/python3",
      "args": ["/path/to/servers/task_router_mcp.py"],
      "env": {
        "QUEUE_FILE": "/tmp/kerala-rage-task-queue.json"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-github-token"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"]
    }
  }
}
```

---

### Appendix E: Quick Reference Commands

**Token Management:**
```bash
# Rebuild CSS from tokens.json
python3 scripts/build-m3-tokens.py

# Sync to Figma
node scripts/sync-tokens-to-figma-vars.mjs

# Validate tokens
/token-orchestrator --mode=full-validation
```

**Component Generation:**
```bash
# Build single component
/component-builder --name=ApplicationCard --archetype=Jar

# Build batch (5 components)
/task-router-mcp create-batch --workflow=dashboard-components
```

**Validation:**
```bash
# Visual audit (screenshot)
/kerala-rage-visual-audit --screenshot=/path/to/image.png

# Code audit (React)
/token-orchestrator --component=/path/to/Component.tsx

# Accessibility audit
/ui-design-evaluator --wcag=AA --component=/path/to/screenshot.png
```

**MCP Delegation:**
```bash
# Create task
/task-router-mcp create --task-id=xyz --assigned-to=component-builder

# Check status
/task-router-mcp status --task-id=xyz

# Retrieve output
/task-router-mcp retrieve --task-id=xyz
```

---

**End of Design Workflow Playbook**

---

**Last Updated**: 2026-02-15
**Version**: 1.0.0
**Maintainer**: Kerala Rage Design System Team
**Feedback**: Report issues at https://github.com/anthropics/claude-code/issues
