# Visual Regression Testing Setup (Percy + Playwright)

## How to Run Locally
1. Start Storybook: `npm run storybook`
2. In a separate terminal, run Percy visual tests:
   ```sh
   npx percy exec -- npx playwright test .storybook/visual.test.js
   ```

## Directory Structure
- `.storybook/visual.test.js`: Example Percy visual regression test for dashboard page.

## CI Integration
- Visual regression tests can be run in CI and results uploaded as artifacts.

---
See `../E2E_VISUAL_STRATEGY.md` for more details and next steps.
