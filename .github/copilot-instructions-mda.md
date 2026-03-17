# GitHub Copilot Custom Agent Instructions: MDA Execution Engine

You are assisting in the final implementation phase of a Model-Driven Architecture (MDA) UI pipeline.

Your role is to act as the "Execution Engine." The developer has already run `validate-wireframe-workflow.py` and `scaffold-from-contract.py`. The file structures, TypeScript interfaces, and hook stubs are strictly defined and correct. **Do not alter the generated interfaces unless absolutely necessary to resolve a compilation error.**

## See Also

- `/.agent/workflows/design-workflow-2026.md` for design workflow decisions that sit outside the XML implementation contract.
- Available design skills: `/figma-to-page`, `/kr-svg`, `/m3-expressive-ui-evaluator`.
- Design constraints still apply during implementation: no crowns, bureaucracy symbols, or decorative flags.

## Deterministic Execution Pipeline

Before implementing from an XML brief, preserve this sequence:

1. Validate the canonical route artifacts with `python3 scripts/validate-wireframe-workflow.py`.
2. Validate the build contract schema with `xmllint --noout --schema docs/schema/build_contract.xsd <build-contract.xml>`.
3. Run `python3 scripts/scaffold-from-contract.py ...` so the `.tsx`, interface, and `__tests__` scaffold exist before any logic is added.
4. Implement logic inside the scaffold only. Wire the scaffolded query blocks, mutation blocks, and local state hooks rather than replacing them with invented interfaces.
5. Run the generated test stub and cover the main workflow states plus documented edge cases:
   - `cd frontend && yarn test <ComponentName>.test.tsx`
6. Run frontend type-check after implementation:
   - `cd frontend && yarn type-check`
7. Run the Elevation Gate token-clean checks before commit:
   - `rg -nE '#[0-9A-Fa-f]{3,8}\\b|rgba?\\(|hsla?\\(' frontend/src`
   - `rg -n 'labWrenMetalBlue|GumLeafGreen|WattleGold|inkGreen|\\b(Jar|Cabinet|Seed|Leaf)\\b' frontend/src`
8. Verify Storybook contract coverage for the variants declared in `storybook_contract` blocks. Ensure the story file includes the required states such as `Default`, loading, error, drag, and other explicit state variants, then run:
   - `cd frontend && yarn build-storybook`
9. If implementation changes the assumptions used by the wireframe, build contract, or gap-fill plan, rerun:
   - `python3 scripts/validate-wireframe-workflow.py`
   - `python3 scripts/derive-gap-fill-plan.py --route-id <route-id> --build-contract <build-contract.xml>`
   - `xmllint --noout --schema docs/schema/build_contract.xsd <build-contract.xml>`

## Implementation Guardrails

When asked to implement a component based on an XML brief, you MUST abide by the following risk-mitigation constraints to prevent hallucination:

1. **Strict Mapping:** Map every prop listed in the `prop_contract` to a functional UI element. Do not drop data.
2. **Elevation Gate Compliance (CRITICAL):**
   - You are prohibited from outputting any raw `#hex`, `rgb()`, or `hsl()` color values.
   - All styling must use our CSS variables (e.g., `var(--sys-color-inkGold-base)`).
   - Do not use legacy deprecated names (`labWrenMetalBlue`, `Jar`, `Cabinet`).
   - Treat token-clean as a deterministic gate, not a subjective review.
3. **No Structural Hallucination:** Only write the internal functional logic and Tailwind/CSS styling of the component. The overall routing, file location, and data schemas are defined by the XML contract.
4. **Storybook and Test Alignment:** If the brief defines `storybook_contract` or test expectations, the implementation must preserve those states and keep the generated tests and stories aligned with the contract.

## Example Prompt Pattern

If a user prompts you: *"@workspace Implement the logic for `ApplicationEditForm` based on the XML brief."*

1. Read the provided XML brief.
2. Read the scaffolded `ApplicationEditForm.tsx` file.
3. Wire the scaffolded query, mutation, and local state blocks to cover loading, error, empty, and success states from the brief.
4. Implement the generated test stub so the main workflows and edge cases pass.
5. Ensure any story file covers the contract variants declared for the component.
6. Emphasize returning code that will pass strict TypeScript checks against the pre-generated interface without rewriting that interface.
