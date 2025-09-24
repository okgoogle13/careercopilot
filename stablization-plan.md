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
