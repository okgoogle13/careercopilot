
# FIGMA MIGRATION STRATEGY: THE TRANSPLANT

## SOURCE TRUTH (Layout Only)
* **Reference File:** `src/reference/FigmaDashboardLayout.tsx`
* **Role:** Defines the grid structure, section hierarchy, spacing, and visual arrangement.
* **Warning:** This file likely contains hardcoded `divs`, raw pixel values, and un-optimized components. **DO NOT COPY CODE VERBATIM.**

## TARGET COMPONENT LIBRARY (The "Bricks")
* **JobCard:** `src/components/applications/JobCard.tsx`
* **DocumentCard:** `src/components/documents/DocumentCard.tsx`
* **ActionCard:** `src/components/dashboard/ActionCard.tsx`
* **CreateProfileCard:** `src/components/dashboard/CreateProfileCard.tsx`
* **ProfileCard:** `src/components/dashboard/ProfileCard.tsx`
* **JobMatchCard:** `src/components/opportunities/JobMatchCard.tsx`

## EXECUTION RULES
1.  **Structure:** Replicate the *layout* (CSS Grid/Flex) from the Reference File into `src/pages/ATSDashboard.tsx`.
2.  **Substitution:** Wherever the Reference File shows a "Job Card" or "Document" placeholder, use our actual imported components (`JobCard`, `DocumentCard`).
3.  **Stability:** Maintain the "Antigravity" physics. Do not wrap our optimized cards in extra `divs` unless necessary for the grid.
4.  **Event Safety:** If the layout introduces clickable rows or overlays, ensure `e.stopPropagation()` is considered for nested actions (like the Dropdown inside DocumentCard).
