
## SOURCE TRUTH (Layout Only)
* **Reference File:** `src/reference/FigmaDashboardLayout.tsx`
* **Role:** Defines the specific "Bio-Glass" design, Hero Banner, Stats Grid, and "Gummy Bear" buttons.
* **Warning:** Use the layout structure and specific visual tokens (gradients, shadows, glass effects) from this file.

## TARGET COMPONENT LIBRARY (The "Bricks")
* **JobCard / JobMatchCard:** `src/components/applications/JobCard.tsx` (Use for the "ATS Profiles" grid items)
* **DocumentCard:** `src/components/documents/DocumentCard.tsx` (If documents are shown)
* **Stats Cards:** Refactor the raw `motion.div` stats into cleanly defined components if possible, or replicate the structure.

## EXECUTION RULES
1.  **Layout Replication:** accurately recreate the "Hero Banner" (with its gradient and text styles), the "Stats Grid", and the "Quick Actions" bar (including the distinct "Gummy Bear" connect button style).
2.  **Asset Handling:** If images (plantImage) are missing, use a placeholder or gradient.
3.  **Substitution:** In the "Your Application Profiles" section, replace the raw `motion.div` mapping with our `JobCard` or `JobMatchCard` components.
    *   *Note:* Ensure our cards fit the grid (grid-cols-3).
4.  **Stability:** Ensure `relative` and `z-index` (Antigravity) are maintained, especially if adding `motion` wrappers.
5.  **Motion:** The reference uses `motion/react`, but our project uses `framer-motion`. **Use `import { motion } from 'framer-motion'`**. Do not install new packages.
