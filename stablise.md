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
