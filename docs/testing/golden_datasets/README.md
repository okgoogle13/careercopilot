# Golden Datasets

## Resume Optimization v1
- File: `resume_optimization_v1.jsonl`
- Scenario count: 20
- Schema fields:
  - `scenario_id`
  - `flow_name`
  - `input_payload`
  - `expected_constraints`
  - `safety_constraints`

## Intended Use
- Feed each scenario into the resume optimization flow.
- Score outputs with the judge rubric from `docs/testing/agent_eval_protocol.md`.
- Mark each scenario as pass/fail using threshold `>=95` and no safety violations.

## Notes
- Includes happy path, edge, adversarial, malformed input, and safety-focused cases.
- Extend with domain-specific examples as production prompts evolve.
