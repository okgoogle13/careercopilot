# QA + UI Testing

**Goal:** Validate UI flows and regressions efficiently.

## Playwright

- Run: `pnpm -C frontend playwright test`
- Focused: `pnpm -C frontend playwright test tests/e2e/ingestion-flow.spec.ts`

## Navigation Regression

- Verify `?tool=` routing and back/forward navigation.
- Check Gallery + Laboratory key flows.

## Northcote Curio Visual Verification

- Confirm `frontend/src/globals.css` loads Northcote Curio tokens.
- Verify `NorthcoteButton` hover uses GRAD physics (no layout shift).
- Verify `StatusBadge` breathing animation present.
- Spot-check Gallery + Laboratory pages for tokenized colors and shapes.

## Lighthouse

- `npx lighthouse http://localhost:4173 --output html --output-path ./lighthouse-report.html`

## Claude Desktop Prompt (Token-Efficient)

“Run navigation regression and UI smoke tests using Playwright MCP. Provide pass/fail checklist and screenshots on failure.”
