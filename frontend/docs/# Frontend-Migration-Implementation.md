# Frontend Migration & Implementation Plan

**Objective:** Migrate the entire frontend from Tailwind CSS to a new stack:
**React, MUI (Material 3), and our custom `theme.ts` file.**

**Core Rule:** All work must adhere to the `src/theme.ts` file. This file is our
single source of truth for all styling, colors (e.g., `palette.primary.main`,
`palette.surface.containerHigh`), custom glow/shadows
(`customShadows.glowPrimary`), and custom variants (`variant="glass"`). **No
Tailwind CSS or hardcoded styles.**

---

### Phase 0: Setup (The Foundation)

- [ ] **Task:** Install dependencies:
      `@mui/material @emotion/react @emotion/styled @mui/x-date-pickers @tanstack/react-query vitest jsdom @testing-library/react storybook eslint prettier`.
- [ ] **Task:** Create `src/theme.ts` with the provided theme code.
- [ ] **Task:** Update `src/main.tsx` to wrap `<App />` in
      `<ThemeProvider theme={finalTheme}>` and `<CssBaseline />`.
- [ ] **Task:** Configure Storybook's `.storybook/preview.ts` to also use the
      `ThemeProvider`.

### Phase 1: Core Custom Components (Highest Priority)

_Objective: Integrate the key Figma-generated, MUI-based components._

- [ ] **Task: Refactor `ActionCard.tsx`**
  - **File:** `src/components/main/ActionCard.tsx`
  - **Action:** Replace the entire file contents with the new MUI-based code
    from `ActionCard.tsx`.
- [ ] **Task: Refactor `JobCard.tsx`**
  - **File:** `src/components/career/JobCard.tsx`
  - **Action:** Replace the entire file contents with the new MUI-based code
    from `JobCard.tsx`.
- [ ] **Task: Refactor `DocumentCard.tsx`**
  - **File:** `src/components/document/DocumentCard.tsx`
  - **Action:** Replace the entire file contents with the new MUI-based code
    from `DocumentCard.tsx`.
- [ ] **Task: Refactor `WelcomeBanner.tsx`**
  - **File:** `src/components/main/WelcomeBanner.tsx`
  - **Action:** Replace the entire file contents with the new MUI-based code
    from `WelcomeBanner.tsx`.

### Phase 2: Complex Page Composition (High Priority)

_Objective: Assemble the core app views using the new components from Phase 1._

- [ ] **Task: Refactor `DashboardView.tsx`**
  - **File:** `src/components/DashboardView.tsx`
  - **Action:** Replace the entire file contents with the new MUI-based code
    from `DashboardView.tsx`.
  - **Verify:** Ensure it correctly imports the _new_ `WelcomeBanner`,
    `ActionCard`, and `DocumentCard`.
- [ ] **Task: Refactor `ATSAnalysisDashboard.tsx`**
  - **File:** `src/components/ATSAnalysisDashboard.tsx`
  - **Action:** Replace the entire file contents with the new MUI-based code
    from `ATSAnalysisDashboard.tsx`.
- [ ] **Task: Refactor `KanbanBoard.tsx`**
  - **File:** `src/components/kanban/KanbanBoard.tsx`
  - **Action:** Replace the entire file contents with the new MUI-based code
    from `KanbanBoard.tsx`.

### Phase 3: Standard UI Migration (Medium Priority)

_Objective: Manually refactor standard pages and remove the old Tailwind UI
kit._

- [ ] **Task: Delete Old UI Kit**
  - **Action:** Delete the entire `src/components/ui` directory.
- [ ] **Task: Refactor `Auth.tsx`**
  - **File:** `src/components/Auth.tsx`
  - **Action:**
    - Replace `div`s with MUI `<Box>`, `<Container>`, and `<Grid>`.
    - Replace `<Card>` with `<Card variant="glass">`.
    - Replace `<Input>` with
      `<TextField variant="outlined" label="Email" fullWidth>`.
    - Replace `<Button>` with `<Button variant="aurora" fullWidth>`.
- [ ] **Task: Refactor `Settings.tsx`**
  - **File:** `src/components/Settings.tsx`
  - **Action:**
    - Replace layout `div`s with `<Box>` and `<Grid container spacing={3}>`.
    - Replace `<Card>` with `<Card variant="glass">`.
    - Replace `<Input>` with `<TextField>`.
    - Replace `<Switch>` with MUI `<Switch>`.
- [ ] **Task: Refactor Placeholder Views**
  - **Files:** `DocumentsView.tsx`, `OpportunitiesView.tsx`,
    `ApplicationsView.tsx`.
  - **Action:** Replace all Tailwind-based elements with their MUI equivalents
    (`<Box>`, `<Typography>`, `<Button>`).

### Phase 4: API & Data Integration (Functional Priority)

- [ ] **Task: Create API Types**
  - **File:** `src/types/api.ts`
  - **Action:** Define interfaces for `User`, `Document`, `JobApplication`,
    `ATSReport`.
- [ ] **Task: Create API Service**
  - **File:** `src/services/api.ts`
  - **Action:** Create a service to centralize `fetch` calls.
- [ ] **Task: Refactor Pages for Data Fetching**
  - **Action:** Go through all pages from Phase 2 & 3.
  - Remove all mock data arrays.
  - Implement `useState` for `(data, isLoading, error)` or (better) use
    `useQuery` from `@tanstack/react-query`.
  - Use MUI `<Skeleton>` for loading states and `<Alert severity="error">` for
    error states.

### Phase 5: QA & DevOps (Final Polish)

- [ ] **Task: Write Unit Tests**
  - **Action:** For each component in Phase 1 (e.g., `ActionCard.tsx`), create a
    `ActionCard.test.tsx` file.
  - **Test:** Mock props, render, and assert text is visible.
- [ ] **Task: Create Storybook Stories**
  - **Action:** For each component in Phase 1, create a `ActionCard.stories.tsx`
    file.
- [ ] **Task: Create CI Workflow**
  - **File:** `.github/workflows/ci.yml`
  - **Action:** Create a workflow to run `yarn install`, `yarn lint`,
    `yarn test`, and `yarn build` on push.
