# Agent Model Reference & Call Graph

This document defines the 15 specialized agents in the CareerCopilot ecosystem, their assigned AI models (Sonnet vs. Haiku), their core responsibilities, and their interaction patterns (Call Graph).

## 🧠 Model Strategy

- **Sonnet (3.5/3.7):** Used for "Architects" and "Specialists" requiring reasoning, planning, complex analysis, and creative direction.
- **Haiku (3.0):** Used for "Runners," "Reviewers," and "Managers" performing repetitive tasks, checklist validations, or strictly defined protocols.

---

## 1. Design & Migration Agents

### **design-project-manager**

- **Model:** `sonnet`
- **Role:** The "Head of Design." Orchestrates the flow from abstract idea to concrete code tasks. Routes work to the creative, system, or migration teams.
- **Workflow:**
  1.  Receives high-level feature request.
  2.  Determines if it's a _New Feature_ (Creative) or _Legacy Upgrade_ (Migration).
  3.  Delegates to appropriate sub-agents.
  4.  Enforces the "Golden Rule": Code must pass `ux-accessibility-lead` before shipping.
- **Call Graph:**
  - **Upstream:** User
  - **Downstream:** `visual-design-director`, `m3-migration-architect`, `theme-factory` (skill), `frontend-specialist`

### **visual-design-director**

- **Model:** `sonnet`
- **Role:** Creative lead. Defines the "Vibe," analyzes visual inputs, and outputs the `aestheticPreferences` JSON.
- **Workflow:**
  1.  Analyzes reference images using Vision skills.
  2.  Defines color palettes, typography, and shape hierarchy.
  3.  Outputs `aestheticPreferences` JSON.
- **Call Graph:**
  - **Upstream:** `design-project-manager`
  - **Downstream:** `design-systems-architect` (Handoff), `design-critique-vision` (Skill)

### **design-systems-architect**

- **Model:** `sonnet`
- **Role:** Technical implementation of design. Converts `aestheticPreferences` into a formal `tokens.json` system.
- **Workflow:**
  1.  Receives `aestheticPreferences`.
  2.  Generates full token set (Color, Typography, Elevation, etc.).
  3.  Validates contrast ratios.
  4.  Builds CSS variables/TS artifacts.
- **Call Graph:**
  - **Upstream:** `visual-design-director`
  - **Downstream:** `design-token-generator` (Skill), `wcag-contrast-checker` (Skill)

### **m3-migration-architect**

- **Model:** `sonnet`
- **Role:** Specialist in upgrading legacy components to Material Design 3.
- **Workflow:**
  1.  Receives legacy component code.
  2.  Orchestrates the 8-step migration protocol (Layout -> Color -> Type -> etc.).
  3.  Returns fully refactored, token-aware code.
- **Call Graph:**
  - **Upstream:** `design-project-manager`
  - **Downstream:** `m3-*` Skills (Layout, Color, Shape, Elevation, etc.)

### **ux-accessibility-lead**

- **Model:** `sonnet`
- **Role:** Quality Gate. Audits components for Usability (Nielsen) and Accessibility (WCAG).
- **Workflow:**
  1.  Reviews proposed flows/components.
  2.  Runs heuristic audits and contrast checks.
  3.  Rejects work or provides specific "FIX" instructions.
- **Call Graph:**
  - **Upstream:** `design-project-manager`, `frontend-specialist`
  - **Downstream:** `ux-heuristic-audit` (Skill), `wcag-contrast-checker` (Skill)

---

## 2. Engineering & Architecture Agents

### **frontend-specialist**

- **Model:** `sonnet`
- **Role:** React/TypeScript Architect. Plans and builds UI components using the Design System.
- **Workflow:**
  1.  Receives specs (Figma/Tokens).
  2.  Scaffolds components/pages.
  3.  Writes implementation code using M3 tokens.
  4.  Generates Storybook stories.
- **Call Graph:**
  - **Upstream:** `design-project-manager`
  - **Downstream:** `react-*-scaffolder` (Skills), `component-builder` (Skill)

### **fullstack-integration-specialist**

- **Model:** `sonnet`
- **Role:** Integration Architect. Ensures types, APIs, and data flows connect correctly from UI to DB.
- **Workflow:**
  1.  Maps API contracts (TypeScript <-> Pydantic).
  2.  Scaffolds backend endpoints and models.
  3.  Validates integration health.
- **Call Graph:**
  - **Upstream:** User, `frontend-specialist`
  - **Downstream:** `fastapi-endpoint-scaffolder` (Skill), `pydantic-model-scaffolder` (Skill), `api-contract-validator` (Skill)

### **ai-agent-specialist**

- **Model:** `sonnet`
- **Role:** AI Engineer. Designs Genkit flows, caching strategies, and LLM interactions.
- **Workflow:**
  1.  Designs Genkit flows for new features.
  2.  Configures caching (Firestore/Redis).
  3.  Selects models (Gemini Flash vs. Pro).
- **Call Graph:**
  - **Upstream:** User, `fullstack-integration-specialist`
  - **Downstream:** `careercopilot-agent-scaffolder` (Skill), `careercopilot-tool-creator` (Skill)

---

## 3. Quality & Testing Agents

### **testing-specialist**

- **Model:** `sonnet`
- **Role:** Test Strategist. Analyzes coverage gaps and plans comprehensive test suites.
- **Workflow:**
  1.  Analyzes coverage reports.
  2.  Generates test plans for components/endpoints.
  3.  Uses scaffolders to create test files.
- **Call Graph:**
  - **Upstream:** User, `frontend-specialist`
  - **Downstream:** `jest-test-scaffolder` (Skill), `vitest-test-scaffolder` (Skill), `api-integration-test-scaffolder` (Skill)

### **test-runner**

- **Model:** `haiku`
- **Role:** Execution Engine. Runs tests, analyzes immediate failures, and applies simple fixes.
- **Workflow:**
  1.  Runs specific test suites (Unit, E2E).
  2.  Reads error logs.
  3.  Fixes simple errors (imports, typos) or escalates.
- **Call Graph:**
  - **Upstream:** `testing-specialist`, `devops-specialist`
  - **Downstream:** `webapp-testing` (Skill)

### **code-reviewer**

- **Model:** `haiku`
- **Role:** Policy Enforcer. Checks code against strict checklists (Security, Style, M3 usage).
- **Workflow:**
  1.  Reads git diffs.
  2.  Checks for hardcoded values, secrets, and complexity.
  3.  Approves or Request Changes.
- **Call Graph:**
  - **Upstream:** User (Pre-merge)
  - **Downstream:** None (Pure analysis)

### **debugger**

- **Model:** `sonnet`
- **Role:** Root Cause Analyst. Solves complex, cross-stack bugs.
- **Workflow:**
  1.  Reproduces issues.
  2.  Traces errors across Frontend -> API -> Backend.
  3.  Implements fixes.
- **Call Graph:**
  - **Upstream:** User, `test-runner`
  - **Downstream:** `root-cause-tracer` (Skill)

### **security-analyst**

- **Model:** `sonnet`
- **Role:** Security Auditor. Checks for vulnerabilities, dependencies, and secrets.
- **Workflow:**
  1.  Runs dependency audits (`yarn audit`).
  2.  Scans for secrets.
  3.  Validates API auth logic.
- **Call Graph:**
  - **Upstream:** User, `devops-specialist`
  - **Downstream:** `project-health-checker` (Skill)

---

## 4. Operations Agents

### **devops-specialist**

- **Model:** `sonnet`
- **Role:** Infrastructure Engineer. Manages CI/CD, environment health, and deployments.
- **Workflow:**
  1.  Checks project health.
  2.  Runs pre-flight tests.
  3.  Deploys to Staging/Production.
- **Call Graph:**
  - **Upstream:** User
  - **Downstream:** `deployment-manager` (Skill), `project-health-checker` (Skill)

### **branch-manager**

- **Model:** `haiku`
- **Role:** Git Janitor. Manages branches, merges, and repository hygiene.
- **Workflow:**
  1.  Cleans up merged branches.
  2.  Analyzes branch staleness.
  3.  Ensures merge safety.
- **Call Graph:**
  - **Upstream:** User
  - **Downstream:** Bash/Git Tools
