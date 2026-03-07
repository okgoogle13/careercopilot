# KR Solidarity Pre-Ship Compliance Report — 2026-03-07

## Overall Gate: FAIL

| Check                    | Value / Score          | Result |
|--------------------------|------------------------|--------|
| Project Health (Step 1)  | Complete               | ✅     |
| Static Greps (Step 2)    | Blocking Violations    | ❌     |
| Headless Capture (Step 3)| 17/20 Success          | ⚠️     |
| Vision Scoring (Step 4)  | N/A (Skipped)          | ➖     |
| UI Compliance (Step 5)   | N/A (Skipped)          | ➖     |

## Blocking Issues to Resolve Before Re-running Gate:

### 1. Brand & Design Tokens (Static Analysis)
- **Forbidden Fonts**: Inter, Arial, Roboto, system-ui were found hardcoded in multiple components instead of semantic variables.
- **Flora Elements**: "eucalyptus" and "wattle" references were found in `tailwind.config.ts`, violating the Zero-Flora mandate.
- **Hardcoded Pixels & Unapproved Tailwinds**: Usage of `border-radius: 8px` and Tailwind shortcuts (`rounded-md`, `rounded-full`, etc.) was rampant throughout the codebase. Must convert to `var(--shape-*)` variables.
- **Transitions**: Linear easing logic was detected breaching the ease-in-out KR guidelines.

### 2. Missing Routes
- **Playwright Headless Timeout**: The capture script failed to find or snapshot the `/login`, `/design-sidekick`, and `/404` pages. Verify whether these route implementations exist or are broken in React Router.

## Screenshots Captured
The valid 17 full-page PNGs have successfully output into `frontend/docs/design/generated/previews/`.

## Next Action
Remediate the static brand greps (Step 2 issues) before allowing the gate to execute a full LLM Vision check (Steps 4 & 5). Ensure all tokens align strictly to the specifications listed in `.claude/skills/`.
