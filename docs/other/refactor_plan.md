# Frontend Cleanup & Restructuring Plan

This plan outlines the steps to clean up unused files and refactor the frontend
directory structure for better scalability and maintainability. Execute each
phase in the specified order.

---

### Phase 1: Immediate Deletion (Low-Risk Cleanup)

Delete the following files and directories from the repository root and `src/`
folder. They are backups, migration artifacts, or unused scripts.

**Delete from root:**

- `package.json.backup`
- `bundle-analysis-report.html`
- `MUI_MIGRATION_PROGRESS.md`
- `HANDOVER_REPORT.md`
- `tidy-up-copy.md`
- `restructure.sh`
- `cleanup-analysis.sh`
- `monitor-app.sh`
- `/scripts/` (the entire directory)

**Delete from `src/`:**

- `src/Career Copilot.zip` (and its unzipped contents if they exist)
- `src/components/Dashboard-backup.tsx`
- `src/cleanup-notes.md`

---

### Phase 2: Legacy UI Component Removal

The `src/components/ui` directory contains a mix of old and new MUI-based
components. This phase removes the old library.

1.  **Delete Legacy Components:** For every component that has a `-mui.tsx`
    counterpart, delete the original file.
    - **Example:** Delete `src/components/ui/button.tsx` because
      `button-mui.tsx` exists. Delete `card.tsx`, `dialog.tsx`, `input.tsx`,
      `badge.tsx`, etc.

2.  **Rename MUI Components:** Rename all `*-mui.tsx` files to remove the `-mui`
    suffix.
    - **Example:** Rename `button-mui.tsx` to `button.tsx`.
    - **Result:** `src/components/ui` should now only contain the pure, renamed
      MUI components.

3.  **Delete Legacy Storybook Files:**
    - Delete `src/stories/page.css`, `src/stories/button.css`,
      `src/stories/header.css`.

---

### Phase 3: Directory Restructuring

Create the new folder structure inside `src/components/` to group components by
type and feature.

1.  **Create New Directories:**
    - `src/components/layout`
    - `src/components/features`
    - `src/components/features/opportunities`
    - `src/components/features/documents`
    - `src/components/features/analysis`

---

### Phase 4: Component Migration

Move existing components from their current locations into the new structure.

1.  **Move to `src/components/layout/`:**
    - `src/components/Navbar.tsx`
    - `src/components/Sidebar-mui.tsx` (and rename to `Sidebar.tsx`)
    - `src/components/layout/PageHeader.tsx`

2.  **Move to `src/components/features/opportunities/`:**
    - `src/components/features/opportunities/KanbanBoard.tsx.wip` (Note: This
      component is a work in progress and has been temporarily disabled in
      `ApplicationTracker.tsx`.)
    - `src/components/career/FilterPanel.tsx`
    - `src/components/career/JobCard.tsx`

3.  **Move to `src/components/features/documents/`:**
    - `src/components/documents/DocumentBrowser.tsx`
    - `src/components/documents/DocumentCard.tsx`
    - `src/components/DocumentPreview.tsx`

4.  **Move to `src/components/features/analysis/`:**
    - `src/components/ATSAnalysisDashboard.tsx`
    - `src/components/ATSScoreCircle.tsx`

---

### Phase 5: Update All Import Paths

After all files have been moved, perform a project-wide find-and-replace to fix
all broken import paths. Ensure the application compiles and runs without import
errors. This is the final and most critical step. a
