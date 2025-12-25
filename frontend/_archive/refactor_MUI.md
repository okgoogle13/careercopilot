refactor_MUI.md

# Pure MUI Refactor Plan: Career Copilot

Act as an expert senior frontend developer. Your task is to execute a full
architectural refactor of this application to a pure Material-UI (MUI) design
system. Follow each phase in this plan precisely and sequentially.

---

### Phase 1: The Great Cleanup

This phase removes all conflicting libraries and configurations.

1.  **Uninstall Dependencies:** Run
    `npm uninstall tailwindcss postcss autoprefixer @radix-ui/react-slot lucide-react class-variance-authority clsx tailwind-merge`.
2.  **Delete Configuration Files:** Delete `tailwind.config.js` and
    `postcss.config.js`.
3.  **Delete Manual Theming:** Delete the entire `src/styles` directory.
4.  **Clean `main.tsx`:** Remove any now-deleted global CSS imports from
    `src/main.tsx`.

---

### Phase 2: Establish the MUI Foundation

This phase creates and applies the new, authoritative M3 theme.

1.  **Create `src/theme/theme.ts`:**
    - Import `createTheme`.
    - Define a theme with `mode: 'dark'` and the following palette:
      - `primary.main`: `'#A78BFA'`
      - `background.default`: `'#1E293B'`
      - `background.paper`: `'#293548'`
2.  **Modify `src/main.tsx`:**
    - Import the new `theme`, `ThemeProvider`, and `CssBaseline`.
    - Wrap the `<App />` component in `<ThemeProvider theme={theme}>` and add
      `<CssBaseline />`.

---

### Phase 3: Full Component Replacement

This is the largest phase. Systematically refactor all components throughout the
`src/components` and `src/pages` directories to use pure MUI components and
styling conventions.

**General Rules for Refactoring:**

- **Remove `className`:** Delete all `className` props from every component.
- **Replace HTML with MUI:** Convert standard HTML elements to their semantic
  MUI counterparts (e.g., `div` -> `<Box>`, `p` -> `<Typography>`, `button` ->
  `<Button>`).
- **Use `sx` Prop:** Apply all component-specific styles using the `sx` prop.
- **Reference Theme:** Inside the `sx` prop, always reference theme tokens
  (e.g., `color: 'primary.main'`, `p: 2`, `bgcolor: 'background.paper'`).
- **Use `<Stack>` for Layout:** For flexbox layouts, use the `<Stack>` component
  with `direction`, `spacing`, `justifyContent`, and `alignItems` props.

**Execution Order:**

1.  Start with layout components (`src/components/layout/`).
2.  Refactor page-level components (`src/pages/`).
3.  Refactor all remaining UI and feature components (`src/components/ui/`,
    `src/components/features/`).

This is a comprehensive task. Methodically go through the file tree and update
each component one by one.

---

### Final Task

After all phases are complete, provide a summary of the files you modified to
complete this refactor.
