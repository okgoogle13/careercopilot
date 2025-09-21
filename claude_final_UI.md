# Claude Refactoring Guide: Career Copilot Component Library (Phase 2)

### **Persona**

You are an expert Senior Frontend Developer specializing in React, TypeScript, and implementing Figma design systems with Material 3 (M3) principles. You are working within the "Career Copilot" repository.

### **Context**

The Figma design system has been completely updated with a new, expressive M3 color palette. All color styles, tonal palettes, and component variants are now finalized and ready for implementation. Your task is to apply this new design system to the codebase, ensuring a 1:1 match with the Figma specification.

### **General Guidelines**

-   **Strictly use CSS variables** from `src/index.css` for all styling. **No hardcoded values.**
-   Consolidate duplicate components into a single source of truth.
-   Ensure strong TypeScript types for all components and props.
-   All file paths are relative to the `src/` directory.
-   After each major task, verify the application still runs and functions as expected.

---

### **Phase 1: Structural Refactoring**

*(It is recommended to complete these architectural tasks first.)*

**Task 1: Consolidate Button & Card Components**
-   **🎯 Objective:** Unify duplicate Button and Card components into single sources of truth.
-   **⚙️ Action Steps:**
    1.  **Buttons:**
        -   Designate `ui/m3-button.tsx` as the single button component.
        -   Add a `variant='aurora'` prop to it. This variant will apply the new gradient and glow effects defined in the updated design system.
        -   Refactor all project-wide usages of `Button` (`ui/button.tsx`) and `AuroraButton` (`ui/button-aurora.tsx`) to use the unified `M3Button`.
    2.  **Cards:**
        -   Designate `ui/m3-card.tsx` as the single card component.
        -   Add a boolean prop `aurora` to `M3Card`. When true, this prop will apply the new gradient border and glass morphism styles from the design system.
        -   Refactor all project-wide usages of `Card` (`ui/card.tsx`) to use the updated `M3Card`.
-   **🗑️ Cleanup:**
    -   Delete `src/components/ui/button.tsx`.
    -   Delete `src/components/ui/button-aurora.tsx`.
    -   Delete `src/components/ui/card.tsx`.

**Task 2: Refactor Main Sidebar & Dashboard**
-   **🎯 Objective:** Modernize core layout components and standardize branding.
-   **⚙️ Action Steps:**
    1.  **Sidebar:** In `App.tsx`, replace the legacy `Sidebar` from `components/Sidebar.tsx` with the advanced sidebar system from `components/ui/sidebar.tsx`. Ensure it is collapsible on desktop and off-canvas on mobile. Delete the old `components/Sidebar.tsx` file.
    2.  **Logo:** Replace all instances of `FOMOLogo` with `CareerCopilotLogo`. Delete `src/components/FOMOLogo.tsx`.
    3.  **Dashboard:** Decompose `Dashboard.tsx` into smaller child components within a new `src/components/dashboard/` directory (`DashboardHeader.tsx`, `DashboardStats.tsx`, `ProfileGrid.tsx`). Re-assemble them in the parent `Dashboard.tsx`.

---

### **Phase 2: Styling & Token Implementation**

*(Begin this phase after structural refactoring is complete.)*

**Task 3: Implement New M3 Color System in CSS**
-   **🎯 Objective:** Update the global stylesheet with the new M3 color system from Figma.
-   **📝 Problem:** The `src/index.css` file contains an outdated color palette.
-   **⚙️ Ac