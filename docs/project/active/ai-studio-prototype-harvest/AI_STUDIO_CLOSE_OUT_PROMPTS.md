# AI Studio Final Close-Out Prompts

### M3 Expressive Proportions + KR Solidarity Canon (v6.0)

This document contains the consolidated "Final Pass" prompts to be executed in AI Studio before the physical harvest. They unify the **Architectural Map** (canonical routes) with the **M3 Expressive** adaptive layout rules.

---


## Batch 4.1: Adaptive Shell & Persistent Navigation

**Target Files:** `App.tsx`, `Layout.tsx`, `Sidebar.tsx`, `AppShell.tsx`
**Logic:** Implement the M3 Adaptive Window Size Classes while enforcing the "Solidarity Mode" (Dark-only) palette.

```text
Update the global application shell to strictly follow M3 Adaptive Window Size Classes and KR Solidarity v6.0 styling.

1. **Adaptive Layout Logic**:
   - **Expanded (1200dp+)**: Implement a dual-pane layout. The primary navigation must be a left-aligned persistent Standard Navigation Drawer (width: 360dp). The main content panel must occupy the remaining space, using a 12-column fluid grid. Cap the maximum width of the main content body at 1200dp with flexible horizontal margins.
   - **Medium (600dp - 1199dp)**: Collapse the sidebar into an M3 Navigation Rail (width: 80dp) containing icons and short labels. Main content shifts to an 8-column grid.
   - **Compact (<600dp)**: Remove side navigation. Implement an M3 Bottom Navigation Bar for core routing. Content stacks in a 4-column single-column view.

2. **Styling (Solidarity Canon)**:
   - **Backgrounds**: Use style={{ background: 'var(--sys-color-charcoalBackground-base)' }}.
   - **Shapes**: DO NOT use perfect circles (border-radius: 50%) for avatars or buttons. Use "Riot" asymmetric cuts. For Navigation Rails/Drawers, use style={{ borderRadius: 'var(--sys-shape-cutoutRiot01)' }}.
   - **Borders**: All panel dividers must use 1px solid var(--sys-color-outline-variant).
   - **Zero-Flora**: Ensure all icons (M3 standard) are geometric or abstract. Strictly no botanical or organic flora motifs during this pass.
```

---


## Batch 4.2: Feature-Level Quick Wins (State & Feedback)

**Target Routes:** `/dashboard`, `/analysis`, `/tracker`, `/career/ingest`
**Logic:** Apply M3 Expressive component patterns (cards, progress, status) to canonical feature surfaces.

```text
Perform a M3 Expressive design audit on the following core product routes:

1. **Dashboard (/dashboard)**: 
   - Wrap the "Profile Completeness" tracker in an elevated M3 Card using style={{ borderRadius: 'var(--sys-shape-blockRiot03)' }}. 
   - Use a thick, expressive progress bar with fully rounded ends (semantic color: var(--sys-color-inkGold-base)).
   - Add an M3 Filled Tonal button for "Load Sample Profile" that hydrates the local state.

2. **Analysis (/analysis) & Ingestion (/career/ingest)**:
   - Update processing screens. Replace spinners with animated text status (e.g., "Extracting skills...") in an M3-styled elevated surface.
   - For text paste fallbacks, use an M3 Outlined Textarea with rounded corners.
   - (REC-008): In analysis lists, add M3 toggle switches to cross out or dim ignored criteria.

3. **Tracker (/tracker) & Documents (/documents)**:
   - Implement the M3 Secondary Tab bar (Resume, Cover Letter, KSC) in the preview workspace.
   - Ensure the "Save & Rescore" action is an M3 Extended Floating Action Button (FAB) nested above the bottom navigation on mobile viewports.
   - Add an M3 Outlined button labeled "Copy to Clipboard for ATS" using standard clipboard APIs.
```
