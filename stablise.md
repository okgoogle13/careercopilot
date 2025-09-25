# Final Project Cleanup Plan

**Role:** You are my expert pair-programmer.

**Context:** The core stabilization of the project is complete. We now need to resolve the final TypeScript errors and fix the Storybook developer environment.

**Plan:** We will execute this in two phases.

---

### Phase 1: Achieve 100% Type Safety

- **1.1 Identify Errors:** First, I will run the command `tsc --noEmit` to generate a list of all remaining TypeScript errors in the project.

- **1.2 Fix Errors:** I will then provide you with the errors, one by one or in related groups. For each error, your task is to provide the corrected, type-safe code.

---

### Phase 2: Restore Storybook

- **2.1 Debug Stories:** After the codebase is fully type-safe, we will fix the Storybook build. I will provide you with the failing story files and their corresponding components, and you will use the following sub-prompt to correct them.

- **Sub-Prompt:**
  > **Context:** My Storybook build is failing for a specific component, even after the main application is compiling correctly.
  >
  > **Task:** Analyze the component and its failing story file. Identify the issue (e.g., incorrect props, mock data, or setup) and provide the corrected code for the story file.
  >
  > **Component Code:**
  > ```tsx
  > [PASTE THE COMPONENT CODE HERE]
  > ```
  >
  > **Failing Story File:**
  > ```tsx
  > [PASTE THE FAILING STORY CODE HERE]
  > ```

---

Acknowledge this plan. I will now run `tsc --noEmit` and provide you with the first set of errors.
