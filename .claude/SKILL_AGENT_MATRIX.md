# Skill-Agent Matrix

This matrix maps the 30+ specialized skills to the agents that use them.
Legend: ✅ = Primary User | ⚪ = Secondary/Occasional User

## 1. Design & M3 Migration Skills

| Skill Name                 | Description                                 | Design PM | Design Director | Systems Architect | M3 Migration Arch | UX Lead | Frontend Spec |
| :------------------------- | :------------------------------------------ | :-------: | :-------------: | :---------------: | :---------------: | :-----: | :-----------: |
| `design-token-generator`   | Generates tokens.json from aesthetic config |    ⚪     |                 |        ✅         |                   |         |               |
| `design-critique-vision`   | Analyzes images for aesthetic vibe/critique |           |       ✅        |                   |                   |         |      ⚪       |
| `wcag-contrast-checker`    | Validates color contrast ratios             |           |                 |        ✅         |                   |   ✅    |      ⚪       |
| `ux-heuristic-audit`       | Audits flows against Nielsen's Heuristics   |           |                 |                   |                   |   ✅    |               |
| `m3-layout-refactor`       | Migrates layout to Spacing tokens/Grid      |           |                 |                   |        ✅         |         |               |
| `m3-color-themer`          | Migrates colors to Semantic tokens          |           |                 |                   |        ✅         |         |               |
| `m3-typography-classifier` | Maps fonts to M3 Type Scale                 |           |                 |                   |        ✅         |         |               |
| `m3-shape-refactor`        | Maps border-radius to Shape tokens          |           |                 |                   |        ✅         |         |               |
| `m3-elevation-refactor`    | Maps shadows to Elevation tokens            |           |                 |                   |        ✅         |         |               |
| `m3-icon-replacer`         | Standardizes Icons and sizing               |           |                 |                   |        ✅         |         |               |
| `m3-motion-applier`        | Adds M3 transition tokens                   |           |                 |                   |        ✅         |         |               |
| `theme-factory`            | Provides pre-built aesthetic templates      |    ✅     |                 |                   |                   |         |               |

## 2. Frontend & Scaffolding Skills

| Skill Name                   | Description                    | Frontend Spec | Fullstack Spec | Testing Spec | Design PM |
| :--------------------------- | :----------------------------- | :-----------: | :------------: | :----------: | :-------: |
| `react-component-scaffolder` | Creates .tsx/.css structure    |      ✅       |       ⚪       |              |           |
| `react-page-scaffolder`      | Creates new page directories   |      ✅       |       ⚪       |              |           |
| `storybook-scaffolder`       | Creates .stories.tsx files     |      ✅       |                |      ✅      |           |
| `figma-to-component`         | Vision-based code generation   |      ✅       |                |              |    ⚪     |
| `figma-to-page`              | Vision-based page generation   |      ✅       |                |              |           |
| `component-builder`          | Writes M3-compliant React code |      ✅       |                |              |    ✅     |

## 3. Backend & Architecture Skills

| Skill Name                       | Description                    | Fullstack Spec | AI Agent Spec | Frontend Spec | Security Analyst |
| :------------------------------- | :----------------------------- | :------------: | :-----------: | :-----------: | :--------------: |
| `fastapi-endpoint-scaffolder`    | Creates Routes, Models, Tests  |       ✅       |               |               |                  |
| `pydantic-model-scaffolder`      | Creates Data Schemas           |       ✅       |      ⚪       |               |                  |
| `frontend-backend-mapper`        | Maps Integration gaps          |       ✅       |               |      ⚪       |                  |
| `fullstack-flow-mapper`          | Visualizes complete data flows |       ✅       |      ⚪       |               |                  |
| `api-contract-validator`         | Checks TS vs Python types      |       ✅       |               |      ⚪       |                  |
| `careercopilot-agent-scaffolder` | Creates new Agent files        |                |      ✅       |               |                  |
| `careercopilot-tool-creator`     | Creates new Tool files         |                |      ✅       |               |                  |

## 4. Testing & Quality Skills

| Skill Name                        | Description                        | Testing Spec | Test Runner | Frontend Spec | DevOps Spec |
| :-------------------------------- | :--------------------------------- | :----------: | :---------: | :-----------: | :---------: |
| `jest-test-scaffolder`            | Creates Unit Tests (Jest)          |      ✅      |             |      ⚪       |             |
| `vitest-test-scaffolder`          | Creates Unit Tests (Vitest)        |      ✅      |             |      ⚪       |             |
| `api-integration-test-scaffolder` | Creates Integration Tests          |      ✅      |             |               |             |
| `webapp-testing`                  | Runs/Writes Playwright E2E         |      ⚪      |     ✅      |      ⚪       |     ✅      |
| `task-delegator`                  | Massively parallel test generation |      ✅      |             |               |             |

## 5. Operations & Utility Skills

| Skill Name               | Description                   | DevOps Spec | Security Analyst | Branch Mgr | PDF Processor |
| :----------------------- | :---------------------------- | :---------: | :--------------: | :--------: | :-----------: |
| `deployment-manager`     | Deploys to Staging/Prod       |     ✅      |                  |            |               |
| `project-health-checker` | Validates Secrets/Config      |     ✅      |        ✅        |            |               |
| `pdf-text-extractor`     | Extracts text/forms from PDFs |             |                  |            |      ✅       |
