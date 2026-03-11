# Token Enforcement Failure Modes

## Common Blocking States

### Hardcoded color detected

Cause:
- direct style literal or non-canonical class fragment

Response:
- replace with KR Solidarity semantic token usage
- rerun lint and design audit

### Deprecated token detected

Cause:
- legacy palette usage copied from old code

Response:
- replace with canonical semantic token usage
- update references and rerun audit

### Banned archetype name detected

Cause:
- migration copied legacy naming into new code or docs

Response:
- rename to approved archetype language or neutral terminology

### Audit scope is wrong

Cause:
- canonical token source files or generated output included incorrectly

Response:
- fix scope first
- do not trust a noisy audit
