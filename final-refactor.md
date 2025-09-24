# Final Refactor & QA Plan: Career Copilot to Pure MUI

## 🎯 **Objective**
Act as an expert AI Senior Frontend Engineer. Your objective is to execute a definitive and final refactor of the 'Career Copilot' application to a **pure Material-UI (MUI)** architecture. You will first completely purge all legacy dependencies (Shadcn/UI, Radix UI, Tailwind CSS) and then systematically rebuild the application using only MUI components and best practices. Finally, you will fix all known bugs and generate missing test coverage.

## 🚀 **Execution Plan**
Execute the following phases sequentially in your VS Code terminal. Do not proceed to the next phase until the current one is 100% complete.

---

### **Phase 1: The Great Purge (Eradicate Legacy Stack)**

The goal of this phase is to remove every trace of the old, conflicting design systems.

1.  **Uninstall All Legacy Dependencies:** Run this command to remove every non-MUI styling and component library.
    ```bash
    yarn remove tailwindcss postcss autoprefixer @radix-ui/react-slot lucide-react class-variance-authority clsx tailwind-merge
    ```
2.  **Delete Configuration Files:** Delete the following files from the project root:
    * `tailwind.config.js`
    * Any `postcss.config.js` if it exists.
3.  **Delete Legacy Styling:** Delete the entire `src/styles` directory and its contents (`theme-tokens.css`, etc.).
4.  **Delete Legacy Component Library:** Delete the **entire `src/components/ui` directory**. We will rebuild it from scratch with pure MUI components.
5.  **Clean Entry Point:** Edit `src/main.tsx` and remove any global CSS imports that now point to deleted files.

At the end of this phase, the application will be visually broken. This is the expected and desired state.

**➡️ Deliverable:** Confirm that all legacy packages, config files, and directories have been deleted.

---

### **Phase 2: Establish the MUI Foundation**

Now, we will build the new, authoritative MUI design system foundation.

1.  **Install MUI Dependencies:** Ensure all necessary MUI packages are present.
    ```bash
    yarn add @mui/material @emotion/react @emotion/styled @mui/icons-material
    ```
2.  **Create the Authoritative Theme:**
    * In `src/theme/theme.ts`, ensure you have a `createTheme` call that defines your application's design tokens (palette, typography, spacing). This is your single source of truth.
3.  **Apply the Theme:**
    * In `src/main.tsx`, wrap the `<App />` component with the MUI `<ThemeProvider theme={theme}>` and include `<CssBaseline />` to apply baseline styles.

**➡️ Deliverable:** Confirm that the MUI theme is created and applied globally.

---

### **Phase 3: Systematic MUI Refactoring & Rebuilding**

This is the most critical phase. You will go through the application and replace every legacy component with a pure MUI equivalent.

1.  **Rebuild Core UI Components:**
    * Create a **new, empty `src/components/ui` directory**.
    * One by one, recreate the essential UI components (e.g., `Button.tsx`, `Card.tsx`, `Input.tsx`, `Dialog.tsx`) as styled MUI components. Use the `styled()` utility or the `sx` prop. **Do not use `className`**.
2.  **Refactor Layout and Pages:**
    * Go through every file in `src/components/layout/` and `src/pages/`.
    * Replace all `div`s with MUI layout components like `<Box>`, `<Container>`, and `<Stack>`.
    * Replace all old component instances with your newly created pure MUI components from `src/components/ui`.
    * Replace every icon (`lucide-react`) with an equivalent from `@mui/icons-material`.
3.  **Refactor Feature Components:**
    * Methodically refactor all components inside `src/components/features/`. Remove all `className` props and apply styles exclusively through the `sx` prop, referencing your theme (e.g., `sx={{ color: 'primary.main' }}`).

**➡️ Deliverable:** A summary of the key components you rebuilt and refactored to be pure MUI.

---

### **Phase 4: Critical Bug Fixes & Accessibility**

Now that the refactor is complete, fix all outstanding issues.

1.  **Fix E2E Test Failure:**
    * **File:** `tests/documents.spec.js`
    * **Action:** Debug the test and fix the underlying
