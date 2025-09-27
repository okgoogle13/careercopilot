# Consolidated Stabilization Plan

---

--- (Content from stabilization-plan.md) ---
# MUI Refactor: Stabilization & Validation Plan

## 🎯 Objective

Act as an expert AI Senior Frontend Engineer. Your goal is to stabilize the Career Copilot application after its migration to Material-UI, resolve all remaining build errors, and validate the UI to ensure it is production-ready. Execute the following phases sequentially.

---

### **Phase 1: Stabilize and Fix (Immediate Priorities)**

Your goal is to get the application running without any build or runtime errors.

1.  **Fix Build-Breaking Errors:**
    - **Resolve File Casing:** Systematically find and fix all file import/export statements with case sensitivity issues (e.g., `Button.tsx` vs `button.tsx`). Ensure all imports match the actual file names on the case-sensitive file system.
    - **Fix Type Errors:** Address all remaining TypeScript compatibility errors. Update component prop types to align with MUI's API.
    - **Finalize Icon Migration:** Search the entire codebase for any remaining `lucide-react` imports and replace them with the appropriate `@mui/icons-material` equivalent.

2.  **Re-create Missing Core Components:**
    - Based on the previous refactor, identify critical missing UI components that are causing errors (e.g., `dropdown-menu`, `skeleton`).
    - Create these missing components in the `src/components/ui/` directory using their MUI equivalents (`Menu`, `Skeleton`, etc.). Ensure they are properly styled with the `sx` prop and integrated where they were previously used.

**➡️ Deliverable 1:** A confirmation that the application is 100% free of build errors and a list of the core components you re-created.

---

### **Phase 2: Validate and Verify**

Your goal is to confirm the UI is visually and functionally correct.

1.  **Run All Tests:** Execute the full test suite.
    ```bash
    yarn test
    ```
2.  **Fix E2E Test Failures:**
    - Focus on the failing test in `tests/documents.spec.js` and any others that are broken.
    - Update the Playwright selectors to target the new MUI component DOM structure. For example, a `data-testid` might now be on a different inner element.
    - Adjust assertions to match the new UI's behavior and appearance.

**➡️ Deliverable 2:** A summary of the E2E tests you fixed and confirmation that the entire test suite is passing.

---

### **Phase 3: Polish and Finalize**

Your goal is to enforce best practices and ensure long-term code quality.

1.  **Enforce Clean Codebase:**
    - Search the project for any remaining instances of `className` used for styling. Replace them with the `sx` prop, using theme tokens where possible (e.g., `sx={{ color: 'primary.main' }}`).
2.  **Implement Deprecation Lint Rule:**
    - Create a custom ESLint rule that disallows any new imports from old or legacy component paths to prevent regressions.

**➡️ Deliverable 3:** A final summary confirming that all `className` props have been removed and that the ESLint rule is in place.

--- (Content from stablise.md) ---
# Project Refactor & Stabilization Plan (Revised)

**Role:** You are an expert full-stack engineer. Your task is to execute a comprehensive plan to refactor and stabilize a React/Vite monorepo.

**Context:** This plan has been updated based on the finding that the codebase does not actively use Radix UI. The refactor is now smaller and targeted at unifying the styling approach.

Execute the following tasks sequentially. For each step that requires code generation, use the provided sub-prompts.

---

### Phase 1: Targeted Styling Refactor

**Goal:** Remove the non-MUI styling patterns (`cn` utility, `clsx`) from the few components that use them to create a single, unified styling system.

- [ ] **1.1 Confirm Scope**
  - **Action:** Run this command in the `frontend` directory to confirm the list of files using the `cn()` pattern.
  - **Command:**
    ```bash
    grep -rl "cn\(" src/
    ```

- [ ] **1.2 Refactor `cn()` Usage**
  - **Action:** For each file identified above, use the following sub-prompt to refactor it to a pure MUI styling approach.
  - **Sub-Prompt:**
    > **Role:** Expert in Material UI (MUI).
    >
    > **Task:** Refactor the following React component to remove the use of the `cn()` utility function and `clsx`. Replace all conditional styling handled by `className={cn(...)}` with the MUI `sx` prop. The final code must be functionally identical and use only MUI-native styling methods.
    >
    > **Original Code:**
    > ```tsx
    > [PASTE COMPONENT CODE HERE]
    > ```
    > Provide only the refactored code.

- [ ] **1.3 Uninstall Unused Dependencies**
  - **Action:** After the components are refactored, run this command from the `frontend` directory to remove the now-unnecessary styling utilities.
  - **Command:**
    ```bash
    yarn remove clsx tailwind-merge class-variance-authority tailwindcss-animate
    ```

---

### Phase 2: Configuration & Git Hygiene

- [ ] **2.1 Resolve File Casing Conflicts**
  - **Action:** Execute the `git mv` command to fix file casing conflicts. Correct all corresponding import paths in the codebase.
  - **Command (example):**
    ```bash
    # Rename 'Documents' to 'documents'
    git mv -f frontend/src/components/Documents frontend/src/components/temp-name
    git mv -f frontend/src/components/temp-name frontend/src/components/documents
    ```

- [ ] **2.2 Clean Up `package.json` Files**
  - **Action:**
    1.  Run `yarn remove eslint` in the root directory.
    2.  Manually move `react`, `react-dom`, and `@mui/*` dependencies from the root `package.json` to `frontend/package.json`.
    3.  Align the `styled-components` version in `frontend/package.json` to match the peer dependency requirement of `@mui/styled-engine-sc`.
    4.  Run `yarn install` from the root directory.

---

### Phase 3: Security & Stability

- [ ] **3.1 Implement Centralized Error Logging**
  - **Action:** Generate and follow a guide to integrate Sentry.
  - **Sub-Prompt:**
    > Provide a concise, step-by-step guide to integrate Sentry for error monitoring into a Vite + React application. Include package installation and `main.tsx` initialization code.

- [ ] **3.2 Implement React Error Boundary**
  - **Action:** Generate a reusable Error Boundary component.
  - **Sub-Prompt:**
    > Generate a reusable React `ErrorBoundary` component using a class component. It should catch JS errors, log them, and display a fallback UI. Include comments on how to use it.

- [ ] **3.3 Prevent Committing Secrets**
  - **Action:** Set up pre-commit hooks with Husky.
  - **Commands:**
    ```bash
    # Run from root
    yarn add -D -W husky lint-staged
    npx husky init
    ```
  - **Action:** Use the sub-prompt to create the hook configuration.
  - **Sub-Prompt:**
    > Create a `lint-staged` configuration for my root `package.json`. It should use a `grep` command to block commits if it finds files containing common secret patterns like `API_KEY=` or `-----BEGIN PRIVATE KEY-----`.

---

### Phase 4: Restore Developer Tooling

- [ ] **4.1 Verify Storybook Build**
  - **Action:** After the refactor, check if Storybook is still working. If it fails for the components that were changed, use the following sub-prompt to debug.
  - **Sub-Prompt:**
    > **Context:** My Storybook build is failing for a specific component after I refactored it to remove `clsx` and the `cn()` utility in favor of MUI's `sx` prop.
    >
    > **Task:** Analyze the failing story file below and the updated component it uses. Identify the problem and provide the corrected code for the story file.
    >
    > **Updated Component:**
    > ```tsx
    > [PASTE YOUR UPDATED COMPONENT CODE HERE]
    > ```
    >
    > **Failing Story File:**
    > ```tsx
    > [PASTE YOUR FAILING STORY CODE HERE]
    > ```

--- (Content from stablization-plan.md) ---
# MUI Refactor: Stabilization & Validation Plan

## 🎯 Objective

Act as an expert AI Senior Frontend Engineer. Your goal is to stabilize the Career Copilot application after its migration to Material-UI, resolve all remaining build errors, and validate the UI to ensure it is production-ready. Execute the following phases sequentially.

---

### **Phase 1: Stabilize and Fix (Immediate Priorities)**

Your goal is to get the application running without any build or runtime errors.

1.  **Fix Build-Breaking Errors:**
    - **Resolve File Casing:** Systematically find and fix all file import/export statements with case sensitivity issues (e.g., `Button.tsx` vs `button.tsx`). Ensure all imports match the actual file names on the case-sensitive file system.
    - **Fix Type Errors:** Address all remaining TypeScript compatibility errors. Update component prop types to align with MUI's API.
    - **Finalize Icon Migration:** Search the entire codebase for any remaining `lucide-react` imports and replace them with the appropriate `@mui/icons-material` equivalent.

2.  **Re-create Missing Core Components:**
    - Based on the previous refactor, identify critical missing UI components that are causing errors (e.g., `dropdown-menu`, `skeleton`).
    - Create these missing components in the `src/components/ui/` directory using their MUI equivalents (`Menu`, `Skeleton`, etc.). Ensure they are properly styled with the `sx` prop and integrated where they were previously used.

**➡️ Deliverable 1:** A confirmation that the application is 100% free of build errors and a list of the core components you re-created.

---

### **Phase 2: Validate and Verify**

Your goal is to confirm the UI is visually and functionally correct.

1.  **Run All Tests:** Execute the full test suite.
    ```bash
    yarn test
    ```
2.  **Fix E2E Test Failures:**
    - Focus on the failing test in `tests/documents.spec.js` and any others that are broken.
    - Update the Playwright selectors to target the new MUI component DOM structure. For example, a `data-testid` might now be on a different inner element.
    - Adjust assertions to match the new UI's behavior and appearance.

**➡️ Deliverable 2:** A summary of the E2E tests you fixed and confirmation that the entire test suite is passing.

---

### **Phase 3: Polish and Finalize**

Your goal is to enforce best practices and ensure long-term code quality.

1.  **Enforce Clean Codebase:**
    - Search the project for any remaining instances of `className` used for styling. Replace them with the `sx` prop, using theme tokens where possible (e.g., `sx={{ color: 'primary.main' }}`).
2.  **Implement Deprecation Lint Rule:**
    - Create a custom ESLint rule that disallows any new imports from old or legacy component paths to prevent regressions.

**➡️ Deliverable 3:** A final summary confirming that all `className` props have been removed and that the ESLint rule is in place.
