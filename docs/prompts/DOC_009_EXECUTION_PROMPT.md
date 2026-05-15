# IDE Copilot Execution Prompt: DOC-009 Resolution via Nano Banana Pro & Hero Engine

Provide this directly to your IDE Copilot Chat (e.g., Cursor, GitHub Copilot Chat, or Windsurf) utilizing standard `@workspace` context where applicable.

---

```text
@workspace TASK: Execute UI fixes and structural asset replacements outlined in DOC-009_Violations_Spreadsheet.csv. Strictly enforce the KR Solidarity v6.1 selective flora/fauna design governance.

You will encounter violations asking for flora or fauna (V-005: Solidarity Gold/Grid Anchor, V-008: Urban Element, V-009: Cultural Anchor).

CRITICAL GOVERNANCE & ASSET GENERATION:
1. REJECT requested Australian native flora and endemic-fauna assets. They violate the current KR Solidarity canon.
2. If components require background texture or geometric breaking elements (V-005, V-009):
   - Check `assets/kr-solidarity/abstract/` utilizing your workspace context. Look for "keep" marked files in `asset-triage-report.json`.
3. If no pre-existing visual fits: Do NOT stall. Automatically execute the 'Hero Engine Asset Generator' paired with 'Nano Banana Pro Image Generate' extensions via your integrated terminal.
   - Prompt the Nano Banana Pro / Hero Engine with: "high contrast dark UI structural vector graphic, asymmetrical geometric shapes, no Australian native flora, utilitarian brutalism, 8k, adhering to m3_expressive_schema.json".

EXECUTION INSTRUCTIONS:
- FIX V-003: Swap out the deprecated `<img src="leaf_concrete-texture.svg">` with `laboratory_compass.svg`.
- FIX V-001 & V-007: Enforce Libre Bodoni for Hero text and Thin (200 weight) for metrics across components.
- FIX V-002 & V-004: Revert 'Parchment' backgrounds to 'Nocturnal Canopy' applying `opacity: 0.25;`.
- FIX V-006 & V-010: Inject Laboratory tokens (`var(--kr-color-charcoalSlate)` and `var(--kr-color-slateSmoke)`) in Drop Zones. Ensure `displayHero` and `metricDisplay` are committed to `tokens.json`.

Write directly to files after generating required assets in the terminal. Once complete, update DOC-009 replacing flora/fauna lines with "RESOLVED: Replaced with Nano Banana Pro Generated Structural Asset."
```
