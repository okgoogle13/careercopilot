# E2E Testing Setup (Cypress)

## How to Run Locally
1. Install dependencies: `npm install`
2. Start the frontend app: `npm run dev`
3. In a separate terminal, run Cypress:
   ```sh
   npx cypress open
   ```
   or for headless:
   ```sh
   npx cypress run
   ```

## Directory Structure
- `e2e/sample.cy.ts`: Example E2E test for dashboard page.

## CI Integration
- E2E tests are run in CI using the provided workflow job.
- Results are uploaded as artifacts for review.

---
See `../E2E_VISUAL_STRATEGY.md` for more details and next steps.
