# E2E and Visual Regression Testing Strategy

## E2E Testing (End-to-End)
- Recommended tool: [Cypress](https://www.cypress.io/) or [Playwright](https://playwright.dev/)
- Add `cypress` or `playwright` as a devDependency in `frontend/package.json`.
- Create a `frontend/e2e/` directory for E2E test specs.
- Add a CI job to run E2E tests on every PR and push to main/develop.

## Visual Regression Testing
- Recommended tool: [Percy](https://percy.io/) or [Loki](https://loki.js.org/)
- Integrate with Storybook or E2E flows for screenshot comparison.
- Add a CI job to run visual regression checks and upload results as artifacts.

## Example CI Job (Cypress)
```yaml
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
        working-directory: ./frontend
      - name: Run E2E tests
        run: npx cypress run
        working-directory: ./frontend
      - name: Upload E2E results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: e2e-results
          path: ./frontend/cypress/results
```

## Next Steps
- Install Cypress/Playwright and set up basic E2E tests.
- Add visual regression tool and configure CI job.
- Document E2E/visual strategy in `TESTING_STRATEGY.md`.
