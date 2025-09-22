Claude Tidy-Up Guide: M3/Aurora System Finalization
Objective
Address all remaaining gaps identified in the code audit to achieve 100% compliance with the M3/Aurora design system and ensure the project is production-ready.
General Instructions
Strictly use CSS variables from src/index.css for all styling.
Provide the full, updated code for each file you modify.
Confirm completion after each task.
Task 1: Component Prop Parity (Buttons & Cards)
🎯 Objective: Align M3Button and M3Card props with the final Figma specifications to fix variant gaps.
📝 Problem: The M3Button is missing an icon-only variant, and M3Card does not fully support the M3 elevation system.
⚙️ Action Steps:
Modify ui/m3-button.tsx:
Add a new size option: 'icon'.
When size='icon', the button should be a square with equal width and height (e.g., h-10 w-10), and the icon should be centered without any text.
Modify ui/m3-card.tsx:
The component already accepts an elevation prop. Ensure it correctly applies the corresponding elevation token from index.css.
Map the elevation prop (values 0 through 5) to the corresponding CSS utility class (e.g., elevation-0, elevation-1, ..., elevation-5).
Task 2: Implement Motion & Transition Tokens
🎯 Objective: Add the missing motion and transition tokens to the global stylesheet.
📝 Problem: The audit revealed that while animation classes might exist, the core --motion-* and --animation-* tokens are incomplete in the theme.
⚙️ Action Steps:
Open src/index.css.
In the :root selector, add the full suite of M3 motion tokens for duration and easing. Use the Guidelines.md file as a reference. Example tokens to add:
--motion-duration-short1: 50ms;
--motion-duration-medium1: 250ms;
--motion-duration-long1: 450ms;
--motion-easing-standard: cubic-bezier(0.2, 0, 0, 1.0);
--motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1.0);
Create corresponding utility classes for these new tokens (e.g., .transition-short1, .ease-emphasized) to make them easily applicable.
Task 3: Spacing and RTL Standardization Audit
🎯 Objective: Ensure consistent spacing and prepare the codebase for Right-to-Left (RTL) language support.
📝 Problem: Some components may still use directional CSS properties (margin-left) instead of logical properties (margin-inline-start), and spacing may not adhere to the 4px grid system.
⚙️ Action Steps:
Audit Key Components: Review the following components for spacing and directional properties: M3Card.tsx, M3Button.tsx, M3Input.tsx, and Navbar.tsx.
Replace with Logical Properties:
Replace margin-left with margin-inline-start.
Replace margin-right with margin-inline-end.
Replace padding-left with padding-inline-start.
Replace padding-right with padding-inline-end.
Enforce Spacing Tokens: Ensure all margins, paddings, and gaps use Tailwind classes that map to our --spacing-* variables (which are based on a 4px grid, e.g., p-4 = 1rem = 16px).
Task 4: Final Verification & Build
🎯 Objective: Confirm that all changes are integrated correctly and the project is error-free.
⚙️ Action Steps:
Run Production Build: Execute the npm run build command and confirm that it completes without any TypeScript or build errors.
Review Component Showcase: Mentally review the ComponentShowcase.tsx page. Confirm that the new M3Button icon size and M3Card elevation variants are now correctly implemented and displayed.
Confirm Completion: State that all audit points have been addressed and the project is now fully aligned with the M3/Aurora design system and ready for final QA.
