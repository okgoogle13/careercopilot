# TSX Identity Gate Template

Use this artifact for any route that adopts support-reference patterns or newly generated TSX and therefore must pass the late-stage TSX identity gate.

**Filename pattern:** `YYYY-MM-DD-tsx-identity-gate-<route>.md`

## Route Metadata

- **Route id:** `<route-id>`
- **Runtime owner:** `<canonical runtime owner>`
- **Implemented TSX path:** `<path>`
- **Build contract:** `<path or none>`
- **Support-reference audit:** `<path or not triggered>`

## Inputs Reviewed

- `<implemented TSX file>`
- `<linked audit pack, if any>`
- `<linked wireframe / build contract, if relevant>`

## Identity Review

- **Archetype mapping:** `<required>`
- **Generic SaaS risk:** `<low | medium | high>`

### `design-orchestration`

- **Finding:** `<required>`
- **Required rewrite:** `<required or none>`

### `kerala-rage-brand-enforcer`

- **Finding:** `<required>`
- **Zero-Flora / anti-generic status:** `<required>`

### `m3-expressive-token-orchestrator`

- **Finding:** `<required>`
- **Token wiring status:** `<required>`

### `kerala-rage-typography-strategy`

- **Finding:** `<required>`
- **Voice / hierarchy status:** `<required>`

## Outcome

- **Gate result:** `identity_pass | identity_pass_with_rewrites | identity_fail_generic_saas | identity_fail_brand_drift | not_triggered`
- **Blocking rewrites:** `<required or none>`
- **Closure decision:** `<route may close | route blocked>`
