# Agent Model Reference

**Last Updated:** 2025-11-17
**Total Agents:** 15

This document provides a comprehensive reference for all agents in the CareerCopilot project, organized by functional category.

---

## Design & UI Agents (5)

### design-project-manager
**Description:** The orchestrator agent that manages the full design-to-code pipeline.
**When to Use:** Complex design projects requiring coordination across multiple agents
**Key Responsibilities:**
- Routes tasks to appropriate design/development agents
- Manages M3 migration projects
- Orchestrates QA loops with ux-accessibility-lead
- Coordinates visual-design-director and design-systems-architect

**Team:** visual-design-director, design-systems-architect, ux-accessibility-lead, frontend-specialist, m3-migration-architect

---

### visual-design-director
**Description:** A senior Art Director who defines the "Look and Feel" and critiques visual aesthetics.
**When to Use:** Creating new design systems, defining visual direction, design critiques
**Key Capabilities:**
- Analyzes design references and creates aesthetic specifications
- Uses design-critique-vision skill for screenshot analysis
- Produces `aestheticPreferences` JSON for design-systems-architect
- Visual quality review and critique

**Skills Used:** design-critique-vision

---

### design-systems-architect
**Description:** A Design Ops specialist who translates aesthetics into a concrete token system.
**When to Use:** Creating or updating design token systems, M3 token generation
**Key Capabilities:**
- Receives aesthetic preferences and generates token system
- Validates WCAG AA/AAA color contrast
- Builds frontend assets (CSS variables, Tailwind config)
- Manages design-system/tokens.json

**Skills Used:** design-token-generator, wcag-contrast-checker
**Outputs:** design-system/tokens.json, frontend/src/styles/design-tokens.css

---

### ux-accessibility-lead
**Description:** A user-advocate who audits flows and components for usability and WCAG compliance.
**When to Use:** QA audits, accessibility reviews, usability testing
**Key Capabilities:**
- Validates WCAG compliance (focus states, keyboard navigation)
- Audits user flows against Nielsen's 10 Usability Heuristics
- Provides actionable remediation recommendations
- Part of design-project-manager QA loop

**Skills Used:** ux-heuristic-audit, wcag-contrast-checker

---

### m3-migration-architect
**Description:** Orchestrator for M5-to-M3 component migration.
**When to Use:** Migrating legacy components to M3 Design System
**Key Capabilities:**
- Orchestrates 8-step M3 migration protocol
- Coordinates all frontend-migration skills sequentially
- Ensures complete token replacement (no hardcoded values)
- Validates M3 compliance

**Skills Used:** All 8 M3 migration skills (m3-layout-refactor, m3-color-themer, m3-typography-classifier, m3-editorial-stylist, m3-shape-refactor, m3-elevation-refactor, m3-icon-replacer, m3-motion-applier)

---

## Development Agents (3)

### frontend-specialist
**Description:** A React/TypeScript architect who plans and builds M3-compliant UI.
**When to Use:** Creating new React components, building UI features
**Key Capabilities:**
- Builds production-ready React components
- Uses component-builder skill for M3-compliant code
- Enforces design token usage (var(--sys-...))
- Works with Material-UI and TypeScript

**Skills Used:** component-builder, react-component-scaffolder, react-page-scaffolder, figma-to-component
**Updated:** V2 (M3-aware, enforces token usage)

---

### fullstack-integration-specialist
**Description:** Expert orchestrator for full-stack feature development.
**When to Use:** Planning/debugging full-stack features, integration issues
**Key Capabilities:**
- Complete stack integration (React → FastAPI → Genkit → Firestore)
- Uses all backend and integration skills systematically
- API contract design and validation
- Type safety across stack boundaries
- Integration debugging (422 errors, type mismatches)

**Skills Used:** fastapi-endpoint-scaffolder, pydantic-model-scaffolder, api-contract-validator, api-integration-test-scaffolder, frontend-backend-mapper, fullstack-flow-mapper
**Updated:** V2 (includes design token flow mapping)

---

### ai-agent-specialist
**Description:** A specialist in AI integration, Genkit flows, and agent architecture for the CareerCopilot project.
**When to Use:** Genkit flow development, AI integration, agent architecture
**Key Capabilities:**
- Genkit flow creation and debugging
- AI model integration (Gemini, Claude)
- Agent architecture design
- Vector search and embeddings

**Skills Used:** careercopilot-agent-scaffolder, careercopilot-tool-creator

---

## Quality & Operations Agents (4)

### code-reviewer
**Description:** Code quality and M3 Design System policy enforcer.
**When to Use:** Code reviews, enforcing design system compliance
**Key Capabilities:**
- Enforces M3 token compliance (rejects hardcoded values)
- Validates CSS variables usage (var(--sys-...))
- Reviews code quality and patterns
- Automated design system policy enforcement

**Updated:** V2 (M3 compliance checks, token enforcement)

---

### debugger
**Description:** Debugging specialist for errors, test failures, and unexpected behavior. Use proactively when encountering any issues.
**When to Use:** Any errors, test failures, unexpected behavior
**Key Capabilities:**
- Root cause analysis
- Test failure debugging
- Error trace interpretation
- Suggests fixes with code examples

**Updated:** V2 (can debug design token issues)

---

### test-runner
**Description:** Use proactively to run tests and fix failures.
**When to Use:** Running test suites, fixing failing tests
**Key Capabilities:**
- Executes test suites (Jest, pytest, Playwright)
- Analyzes test failures
- Fixes broken tests
- Reports coverage metrics

**Skills Used:** jest-test-scaffolder, webapp-testing, api-integration-test-scaffolder

---

### testing-specialist
**Description:** Expert test automation and QA specialist.
**When to Use:** Creating tests, improving coverage, test strategy
**Key Capabilities:**
- Test generation for all layers (frontend, backend, integration, E2E)
- Coverage analysis and improvement
- Test quality assurance and pattern enforcement
- Test data management and fixture creation

**Skills Used:** jest-test-scaffolder, api-integration-test-scaffolder, storybook-scaffolder, webapp-testing

---

## Infrastructure & DevOps Agents (3)

### devops-specialist
**Description:** A build and deployment engineer who understands this project's CI/CD pipeline and scripts.
**When to Use:** Deployment issues, CI/CD pipeline work, infrastructure
**Key Capabilities:**
- Deployment orchestration (staging/production)
- CI/CD pipeline debugging
- Docker and container management
- Infrastructure configuration

**Skills Used:** deployment-manager, project-health-checker
**Updated:** V2 (validates design token build system)

---

### security-analyst
**Description:** A specialist who audits for vulnerabilities, dependency issues, and hardcoded secrets.
**When to Use:** Security audits, vulnerability scans, dependency reviews
**Key Capabilities:**
- Vulnerability scanning
- Dependency audits
- Secret detection
- Security best practices enforcement

---

### branch-manager
**Description:** Git branch management specialist for cleaning up merged branches, analyzing branch health, and managing PR-related branch operations.
**When to Use:** Git branch cleanup, PR management, branch health checks
**Key Capabilities:**
- Cleans up merged branches
- Analyzes branch health
- Manages PR-related operations
- Git workflow optimization

---

## Agent Collaboration Patterns

### Design-to-Code Pipeline
```
design-project-manager
  ├─> visual-design-director (aesthetic direction)
  ├─> design-systems-architect (token generation)
  ├─> frontend-specialist (component building)
  └─> ux-accessibility-lead (QA audit)
```

### M3 Migration Workflow
```
design-project-manager
  └─> m3-migration-architect
       ├─> 8 M3 migration skills (sequential)
       └─> code-reviewer (compliance validation)
```

### Full-Stack Feature Development
```
fullstack-integration-specialist
  ├─> fastapi-endpoint-scaffolder (backend)
  ├─> react-component-scaffolder (frontend)
  ├─> api-contract-validator (type safety)
  └─> testing-specialist (test generation)
```

### Quality Assurance Loop
```
frontend-specialist (build)
  → ux-accessibility-lead (audit)
  → frontend-specialist (fix)
  → code-reviewer (validate)
  → User delivery
```

---

## Version History

- **V2 (2025-11-17):** Added M3 Design System awareness
  - Updated: frontend-specialist, code-reviewer, debugger, devops-specialist, fullstack-integration-specialist
  - New: design-project-manager, m3-migration-architect
- **V1:** Initial agent infrastructure

---

## Notes

- All agents can be invoked via the Task tool
- Agents with "Use proactively" should be invoked without explicit user request
- Orchestrator agents (design-project-manager, m3-migration-architect, fullstack-integration-specialist) coordinate multiple agents
- V2 agents enforce M3 Design System compliance (no hardcoded values)
