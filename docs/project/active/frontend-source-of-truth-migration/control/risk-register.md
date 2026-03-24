# Risk Register

| ID | Risk | Severity | Mitigation | Escalate after |
| --- | --- | --- | --- | --- |
| R1 | Active control docs reference missing root-level `route-matrix`, `implementation-backlog`, or `workflow` files instead of the retained `control/archive/` baselines | High | Normalize active docs to `control/archive/route-matrix.{md,json}`, `control/archive/implementation-backlog.md`, and `control/archive/workflow.md`; treat contracts and `App.tsx` as stronger truth | 1 session |
| R2 | AI Studio prompt packs collapse `/documents`, `/ksc-generator`, and `/cover-letter-generator` into one prototype hub and implicitly reassign ownership | High | Require contract-alignment notes in prompt docs and preserve dedicated generator ownership from `contracts/build-contract-{documents,ksc_generator,cover_letter_generator}.xml` | 1 session |
| R3 | Later prototype batches, especially `B18`, drift voice ownership away from `/profile` toward `/settings` | High | Keep `MIG-202` as an explicit route lock and verify prompt docs cite both `build-contract-profile.xml` and `build-contract-settings.xml` | 1 session |
| R4 | Env-backed verification for `/tracker` and `/profile` remains blocked and gets conflated with planning completeness | Medium | Keep `complete_deferred_verif` explicit in status/checklists until Firebase/auth evidence is captured | 2 days |
| R5 | Prompt annotation blocks drift from contract XML truth and create harvest ambiguity | Medium | Replace expressive/token annotation blocks with contract-alignment annotations that cite canonical route owners and relevant `contracts/*.xml` files | 1 session |
