# Comprehensive AI-Powered QA & Review Cycle: Career Copilot

## 🎯 **Objective**

Act as an expert AI Quality Assurance Engineer. Your objective is to perform a comprehensive, automated testing and review cycle for the 'Career Copilot' frontend application. Your goal is to identify bugs, regressions, performance issues, and accessibility gaps, and to generate new tests where coverage is lacking.

## 🛠️ **Tech Stack Context**

The application is built with **React, TypeScript, and MUI**. Testing is done with **Vitest** for unit/component tests and **Playwright** for End-to-End tests. The build tool is **Vite**.

## 🚀 **Execution Plan**

Execute the following phases sequentially. If a critical failure occurs in any phase, report it immediately and await further instructions.

---

### **Phase 1: Static Analysis & Code Health**

This phase ensures the codebase meets baseline quality standards before running any tests.

1.  **Install Dependencies:** Run `npm install` to set up the environment.
2.  **Type Checking:** Run `npx tsc --noEmit` to check for any TypeScript errors.
3.  **Linting:** Run `npx eslint . --ext .ts,.tsx` to identify and report any linting violations.
4.  **Code Formatting:** Run `npx prettier --check .` to find any formatting inconsistencies.
5.  **Dependency Audit:** Run `npm audit --production` to check for known vulnerabilities in dependencies.

**➡️ Deliverable:** A summary of all errors, warnings, and vulnerabilities found.

---

### **Phase 2: Unit & Component Test Execution & Generation**

This phase verifies the functionality of individual components and utility functions.

1.  **Run Existing Tests:** Run `npm test` to execute the entire Vitest suite. Report any failing tests.
2.  **Identify Untested Critical Logic:**
    - Analyze the utility functions in `src/lib/utils.ts`.
    - Analyze the core feature components in `src/components/features/` (e.g., `opportunities/KanbanBoard.tsx`, `documents/DocumentBrowser.tsx`).
3.  **Generate New Unit Tests:**
    - For any complex, untested functions in `utils.ts`, generate a corresponding `utils.test.ts` file with comprehensive unit tests.
    - For the most critical feature components identified, generate new `*.test.tsx` files. Use Vitest and React Testing Library to test their core logic (e.g., state changes, event handling), not just simple rendering. Place generated test files alongside their source files.

**➡️ Deliverable:** A report of existing test results and a list of all new test files you have generated.

---

### **Phase 3: End-to-End (E2E) & Visual Regression Testing**

This phase simulates real user journeys to validate critical application flows.

1.  **Identify Critical User Flows:** The primary user journeys to validate are:
    - **Authentication Flow:** Login and navigation to the dashboard.
    - **Document Flow:** Uploading a document, triggering an analysis, and viewing the results.
    - **Opportunity Flow:** Adding and moving a job card on the Kanban board.
2.  **Run Existing E2E Tests:** Execute the existing Playwright test suite.
3.  **Generate New E2E Tests:**
    - Review the critical user flows above. For any flow that lacks a corresponding Playwright test in the `tests/` directory, generate a new test script (`*.spec.js`).
    - The generated scripts should perform realistic user actions and include assertions to verify that the UI reacts as expected.
4.  **Visual Regression Snapshots:**
    - For each critical user flow, capture a full-page screenshot using Playwright at a key point in the flow (e.g., after login, after analysis is complete).
    - Save these screenshots to a new `e2e-screenshots/` directory for manual review.

**➡️ Deliverable:** A report of E2E test results, a list of newly generated test scripts, and confirmation that screenshots have been saved.

---

### **Phase 4: Performance & Accessibility Audit**

This phase assesses the production-readiness of the application from a performance and accessibility standpoint.

1.  **Analyze Production Build:** Run `npm run build`. Analyze the output in the `dist/` folder and report on:
    - Total bundle size.
    - The size of the 5 largest JavaScript chunks.
    - The number of CSS and JS assets generated.
2.  **Automated Accessibility Scan:** Using Playwright, navigate to the main dashboard page (assume a logged-in state) and run an automated accessibility scan (emulating a tool like Axe). Report all detected violations and categorize them by severity (critical, serious, moderate).

**➡️ Deliverable:** A summary of the build analysis and a prioritized list of accessibility violations.

---

### **Phase 5: Final Comprehensive Report**

Compile all deliverables from the previous phases into a single, structured Markdown report.

**Report Structure:**

1.  **Executive Summary:**
    - **Overall Verdict:** (e.g., ✅ PASS, ⚠️ PASS WITH WARNINGS, ❌ FAIL)
    - Summary of the most critical findings.
2.  **Detailed Findings by Phase:**
    - **Static Analysis:** All errors and vulnerabilities.
    - **Unit/Component Testing:** Test results and a list of new files.
    - **E2E Testing:** Test results and a list of new scripts.
    - **Performance & Accessibility:** Build metrics and a11y violations.
3.  **Actionable To-Do List:** A final, prioritized checklist of all issues that require a developer's attention, ordered by severity.
