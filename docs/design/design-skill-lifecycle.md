# Design Skill Lifecycle (Spec-first Batch Orchestrator)

This document records lifecycle decisions for design automation skills under the `frontend-design-orchestrator` model.

Legend:
- **WRAP**: Skill remains but is invoked as orchestrator-internal stage logic.
- **DEMOTE**: Skill remains available but is not a primary workflow entrypoint.
- **RETIRE**: Planned deprecation/removal after orchestrator parity.

## Primary + Supporting Skill Decisions

| Skill | Decision | Reason | Orchestrator Stage |
|---|---|---|---|
| component-spec-scaffolder | WRAP | Produces useful artifacts but path/token drift must be gated centrally | `spec-generation` |
| wireframe-annotator | WRAP | Valuable generator; needs XML contract checks from centralized gate | `wireframe-generation` + `wireframe-contract-validator` |
| asset-placement-strategy | WRAP | Keep placement logic but run behind batch validation and readiness scoring | `asset-placement` |
| hifi-blueprint-linter | WRAP | Good linting utility but should be orchestrator-internal | `hifi-lint` |
| component-builder | WRAP | Keep as implementation utility, not top-level flow primitive | `component-generation` |
| component-transformer | WRAP | Core migration utility; governed by orchestrator checks | `component-migration` |
| design-system-doc-generator | WRAP | Input protocol helper; no direct top-level pipeline control | `docs-protocol-sync` |
| component-spec-generator | DEMOTE | Overlaps spec-scaffolder path; kept for low-level/manual use | n/a (manual) |
| asset-token-replacer | WRAP | Useful as sub-step in token safety remediation | `token-safety-batch-linter` |
| asset-path-validator | WRAP | Batch path verification stage | `path-normalizer` |
| token-orchestrator | WRAP | Token quality logic should feed orchestrator gate | `token-safety-batch-linter` |
| design-token-validator | WRAP | Structured token checks integrated as gate signal | `token-safety-batch-linter` |
| manifest-reconciler | WRAP | Required for asset consistency in batch runs | `asset-reconciliation` |
| vision-scorer-mcp | DEMOTE | Useful but optional until visual gate hardening completes | optional `visual-audit` enhancer |
| component-visual-audit | WRAP | Supports screenshot validation under visual audit stage | `visual-audit` |
| compliance-dashboard | DEMOTE | Reporting tool, not control plane | n/a (reporting) |
| storybook-scaffolder | DEMOTE | Useful utility, not pipeline primitive | n/a (manual) |
| jest-test-scaffolder | DEMOTE | Test helper; not orchestrator gate itself | n/a (manual) |

## Retire Candidates (post-parity)

These should be retired only after orchestrator stages reach functional parity:

- Direct single-file design generators that bypass contract + readiness gates.
- Any legacy queue-based process docs claiming authority over design readiness.

## Source of Truth (Design Automation)

Primary readiness outputs now come from:

- `docs/design/generated/design-readiness.json`
- `docs/design/design-readiness.md`
- `docs/design/runs/<timestamp>.json`
- `docs/design/generated/visual-audit-gallery.md`

Legacy queue-based status should be treated as archival context only.
