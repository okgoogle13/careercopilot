# Skill-Agent Matrix

**Last Updated:** 2025-11-17
**Total Skills:** 25 (+ 12 nested skills)
**Total Agents:** 15

This document maps all skills to the agents that use them, organized by functional category.

---

## Design System Skills (4 + 4 nested)

### design-skills/ (4 nested skills)
**Location:** `.claude/skills/design-skills/`

#### design-critique-vision
- **Description:** Analyzes images for visual design quality and provides actionable critique
- **Used By:** visual-design-director
- **Use Case:** Screenshot analysis, design review

#### design-token-generator
- **Description:** Translates aesthetic preferences into complete design token JSON
- **Used By:** design-systems-architect
- **Output:** design-system/tokens.json

#### wcag-contrast-checker
- **Description:** Validates color contrast against WCAG AA/AAA standards
- **Used By:** design-systems-architect, ux-accessibility-lead
- **Validation:** 4.5:1 minimum contrast ratio

#### ux-heuristic-audit
- **Description:** Audits components against Nielsen's 10 Usability Heuristics
- **Used By:** ux-accessibility-lead
- **Use Case:** Usability reviews, UX audits

---

## M3 Migration Skills (8 nested)

### frontend-migration/ (8 nested skills)
**Location:** `.claude/skills/frontend-migration/`
**Orchestrator:** m3-migration-architect (executes sequentially)

| Skill | Description | Order |
|-------|-------------|-------|
| m3-layout-refactor | Refactors spacing/layout to use spacing tokens | 1 |
| m3-color-themer | Replaces hardcoded colors with color tokens | 2 |
| m3-typography-classifier | Updates typography to use text tokens | 3 |
| m3-editorial-stylist | Applies editorial style tokens | 4 |
| m3-shape-refactor | Updates border radius to shape tokens | 5 |
| m3-elevation-refactor | Replaces box-shadow with elevation tokens | 6 |
| m3-icon-replacer | Updates icon usage to M3 standards | 7 |
| m3-motion-applier | Applies motion/animation tokens | 8 |

**All skills enforce:** No hardcoded values, only `var(--sys-...)` CSS variables

---

## Component Scaffolding Skills (6)

### component-builder
- **Description:** Core engine for generating M3-compliant React components
- **Used By:** frontend-specialist
- **Output:** Production-ready React code with design tokens
- **Version:** V2 (token-aware)
- **Rules:** Never uses hardcoded values, only `var(--sys-...)`

### react-component-scaffolder
- **Description:** Scaffolds React component directories (.tsx, .css, index)
- **Used By:** frontend-specialist, fullstack-integration-specialist, testing-specialist
- **Output:** `src/components/.../ComponentName/`
- **Version:** V2 (generates token-aware code)

### react-page-scaffolder
- **Description:** Scaffolds complete React page directories
- **Used By:** frontend-specialist, fullstack-integration-specialist
- **Output:** `src/pages/PageName/`
- **Version:** V2 (uses M3 layout tokens)

### figma-to-component
- **Description:** Vision-based workflow for converting Figma designs to React
- **Used By:** frontend-specialist
- **Version:** V2 (vision-based token mapping)
- **Status:** DEPRECATED (use vision workflow instead)

### figma-to-page
- **Description:** Generates full pages from Figma Inspect details
- **Used By:** frontend-specialist
- **Uses:** react-page-scaffolder

### storybook-scaffolder
- **Description:** Generates M3-token-aware Storybook files
- **Used By:** frontend-specialist, testing-specialist
- **Output:** `*.stories.tsx` with design-tokens.css import
- **Version:** V2 (auto-imports design tokens)

---

## Backend & API Skills (5)

### fastapi-endpoint-scaffolder
- **Description:** Scaffolds FastAPI endpoints with Pydantic models and tests
- **Used By:** fullstack-integration-specialist
- **Output:** `backend/app/api/endpoints/*.py`, `backend/app/models/*_schemas.py`

### pydantic-model-scaffolder
- **Description:** Creates type-safe Pydantic models for API validation
- **Used By:** fullstack-integration-specialist
- **Output:** Request/Response/Database model variants

### api-contract-validator
- **Description:** Validates contracts between TypeScript and Pydantic
- **Used By:** fullstack-integration-specialist, code-reviewer
- **Detects:** Field mismatches, type inconsistencies

### api-integration-test-scaffolder
- **Description:** Generates E2E tests for frontend → backend → Genkit flows
- **Used By:** fullstack-integration-specialist, testing-specialist, test-runner
- **Output:** `backend/app/tests/integration/*.py`

### frontend-backend-mapper
- **Description:** Maps frontend API calls to backend endpoints
- **Used By:** fullstack-integration-specialist
- **Output:** `docs/INTEGRATION_MAP.md` with health report

### fullstack-flow-mapper
- **Description:** Traces data flows from UI to database, including design tokens
- **Used By:** fullstack-integration-specialist
- **Output:** `docs/FULLSTACK_FLOWS.md` with Mermaid diagrams
- **Version:** V2 (includes token flow tracking)

---

## Testing Skills (4)

### jest-test-scaffolder
- **Description:** Generates Jest tests for React components and hooks
- **Used By:** testing-specialist, test-runner
- **Output:** `__tests__/*.test.tsx`
- **Pattern:** React Testing Library best practices

### vitest-test-scaffolder
- **Description:** Generates Vitest unit tests for components
- **Used By:** testing-specialist, test-runner
- **Alternative to:** jest-test-scaffolder

### webapp-testing
- **Description:** Runs/writes Playwright E2E tests
- **Used By:** testing-specialist, test-runner
- **Output:** `frontend/tests/*.spec.js`
- **Reference:** `.claude/skills/webapp-testing/REFERENCE/careercopilot-selectors.md`

### task-delegator
- **Description:** Coordinates multi-agent workflows for parallel test generation
- **Used By:** testing-specialist
- **Use Case:** Parallel test generation via Jules

---

## Document & AI Skills (3)

### document-skills/pdf/
- **Description:** PDF text extraction, summarization, form parsing
- **Used By:** ai-agent-specialist, document processors
- **Guides:** `SKILL.md`, `forms.md`, `reference.md`

### careercopilot-agent-scaffolder
- **Description:** Scaffolds Python agent files in `src/agents/`
- **Used By:** ai-agent-specialist
- **Output:** Python agent template

### careercopilot-tool-creator
- **Description:** Scaffolds Python tool files in `src/tools/`
- **Used By:** ai-agent-specialist
- **Output:** Python tool template

---

## Infrastructure & DevOps Skills (3)

### deployment-manager
- **Description:** Deploys to staging/production using project scripts
- **Used By:** devops-specialist
- **Commands:** `./scripts/deploy.sh staging|production`

### project-health-checker
- **Description:** Runs full validation and health check suite
- **Used By:** devops-specialist
- **Output:** Health report with errors/warnings

### theme-factory
- **Description:** Provides pre-built M3-compliant tokens.json themes
- **Used By:** design-project-manager, design-systems-architect
- **Themes:** Dracula, Nord, etc.

---

## Example & Reference Skills (1)

### example-skill
- **Description:** Example demonstrating YAML best practices
- **Use Case:** Reference for creating new skills
- **Documentation:** Shows proper skill structure

---

## Skill Usage Matrix

### By Agent

| Agent | Skills Used | Count |
|-------|------------|-------|
| design-project-manager | theme-factory | 1 |
| visual-design-director | design-critique-vision | 1 |
| design-systems-architect | design-token-generator, wcag-contrast-checker, theme-factory | 3 |
| ux-accessibility-lead | ux-heuristic-audit, wcag-contrast-checker | 2 |
| m3-migration-architect | All 8 frontend-migration skills | 8 |
| frontend-specialist | component-builder, react-component-scaffolder, react-page-scaffolder, figma-to-component, storybook-scaffolder | 5 |
| fullstack-integration-specialist | fastapi-endpoint-scaffolder, pydantic-model-scaffolder, api-contract-validator, api-integration-test-scaffolder, frontend-backend-mapper, fullstack-flow-mapper | 6 |
| ai-agent-specialist | careercopilot-agent-scaffolder, careercopilot-tool-creator, document-skills | 3 |
| code-reviewer | api-contract-validator | 1 |
| test-runner | jest-test-scaffolder, vitest-test-scaffolder, webapp-testing, api-integration-test-scaffolder | 4 |
| testing-specialist | jest-test-scaffolder, vitest-test-scaffolder, api-integration-test-scaffolder, storybook-scaffolder, webapp-testing, task-delegator | 6 |
| devops-specialist | deployment-manager, project-health-checker | 2 |

### By Skill Type

| Type | Count | V2 Updated |
|------|-------|------------|
| Design System | 4 + 8 M3 | Yes (M3 migration) |
| Component Scaffolding | 6 | 5 updated to V2 |
| Backend & API | 5 | 1 updated (fullstack-flow-mapper) |
| Testing | 4 | No |
| Document & AI | 3 | No |
| Infrastructure | 3 | No |

---

## V2 Updates (M3 Design System)

### Skills Updated for M3 Compliance
1. **component-builder** - Enforces token usage, rejects hardcoded values
2. **react-component-scaffolder** - Generates token-aware code
3. **react-page-scaffolder** - Uses M3 layout tokens
4. **storybook-scaffolder** - Auto-imports design-tokens.css
5. **figma-to-component** - Vision-based token mapping
6. **fullstack-flow-mapper** - Includes token flow diagrams

### New M3 Skills (8)
All frontend-migration/ skills created for M3 migration workflow

---

## Skill Dependencies

### High-Impact Skills (Used by 3+ agents)
1. **wcag-contrast-checker** - 2 agents (design-systems-architect, ux-accessibility-lead)
2. **component-builder** - 1 agent (frontend-specialist), but central to M3 system
3. **jest-test-scaffolder** - 2 agents (testing-specialist, test-runner)
4. **webapp-testing** - 2 agents (testing-specialist, test-runner)

### Orchestrator Skills
- **m3-migration-architect** - Coordinates 8 M3 migration skills sequentially
- **task-delegator** - Coordinates parallel test generation across agents

---

## Notes

- All V2 skills enforce M3 Design System compliance (no hardcoded values)
- Skills in nested directories (design-skills/, frontend-migration/, document-skills/) contain multiple related skills
- Orchestrator agents coordinate multiple skills: design-project-manager, m3-migration-architect, fullstack-integration-specialist
- Some skills have SKILL.md files, others have individual .md files in subdirectories

---

## Directory Structure Reference

```
.claude/skills/
├── api-contract-validator/
├── api-integration-test-scaffolder/
├── careercopilot-agent-scaffolder/
├── careercopilot-tool-creator/
├── component-builder/
├── deployment-manager/
├── design-skills/
│   ├── design-critique-vision.md
│   ├── design-token-generator.md
│   ├── ux-heuristic-audit.md
│   └── wcag-contrast-checker.md
├── document-skills/
│   └── pdf/
│       ├── SKILL.md
│       ├── forms.md
│       └── reference.md
├── example-skill/
├── fastapi-endpoint-scaffolder/
├── figma-to-component/
├── figma-to-page/
├── frontend-backend-mapper/
├── frontend-migration/
│   ├── m3-color-themer.md
│   ├── m3-editorial-stylist.md
│   ├── m3-elevation-refactor.md
│   ├── m3-icon-replacer.md
│   ├── m3-layout-refactor.md
│   ├── m3-motion-applier.md
│   ├── m3-shape-refactor.md
│   └── m3-typography-classifier.md
├── fullstack-flow-mapper/
├── jest-test-scaffolder/
├── project-health-checker/
├── pydantic-model-scaffolder/
├── react-component-scaffolder/
├── react-page-scaffolder/
├── storybook-scaffolder/
├── task-delegator/
├── theme-factory/
│   └── theme-factory.md
├── vitest-test-scaffolder/
└── webapp-testing/
```
