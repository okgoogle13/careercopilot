---
name: asset-path-validator
description: Validate asset path references across code/docs and report broken, orphaned, and non-canonical paths with deterministic fix suggestions.
metadata:
  version: 1.1.0
  tags:
    - assets
    - validation
    - quality
---

# Asset Path Validator

## Purpose

Scan repository files for asset path references, verify filesystem resolution, and produce a structured broken-path report with safe fix suggestions.

## When to Use

- After asset folder refactors or bulk renames.
- Before production builds/deploys.
- During CI checks for broken image/link regressions.

## Canonical Path Rules

1. Frontend runtime references
- Prefer `/assets/...` for public runtime URLs.
- Flag `/public/assets/...` when used as runtime URL in app code.

2. Repository filesystem references
- `frontend/public/assets/...` is valid for filesystem checks and docs/reports.

3. Relative references
- Resolve `./` and `../` based on referencing file location.

4. External URLs
- Do not validate `http://` or `https://` as local filesystem paths.

## Scan Scope

Include by default:
- `frontend/src/**/*.{ts,tsx,js,jsx,css,scss,md,mdx,json}`
- `docs/**/*.md`

Pattern targets:
- `src="..."`
- `url(...)`
- markdown image links `![...](...)`
- obvious asset literals containing `/assets/` or `frontend/public/assets/`

## Deterministic Process

1. Extract candidate paths from target files.
2. Classify each as runtime, repo-relative, external, or unknown.
3. Resolve local filesystem targets.
4. Mark status per path:
- `valid`
- `broken`
- `non_canonical`
- `unresolved` (ambiguous base/templated string)
5. Generate fix suggestion where deterministic.

## Output Contract

```json
{
  "summary": {
    "files_scanned": 0,
    "paths_found": 0,
    "valid": 0,
    "broken": 0,
    "non_canonical": 0,
    "unresolved": 0
  },
  "issues": [
    {
      "file": "frontend/src/components/Hero.tsx",
      "line": 42,
      "raw_path": "/public/assets/kr-solidarity/foo.png",
      "classification": "non_canonical",
      "status": "non_canonical",
      "reason": "runtime_url_should_use_assets_prefix",
      "suggested_fix": "/assets/kr-solidarity/foo.png"
    },
    {
      "file": "frontend/src/pages/Landing.tsx",
      "line": 88,
      "raw_path": "/assets/kr-solidarity/missing.png",
      "classification": "runtime",
      "status": "broken",
      "reason": "file_not_found",
      "suggested_fix": null
    }
  ]
}
```

## Safety Rules

- Do not mutate files automatically.
- Emit suggestions only; edits require explicit follow-up step.
- Do not infer speculative replacements when multiple candidates exist.

## Edge Cases

- Query/hash suffixes: `/assets/a.png?v=2#x` should resolve against `/assets/a.png`.
- Templated strings: mark as `unresolved` if interpolation blocks deterministic resolution.
- Aliased imports: distinguish module imports from runtime URL strings.
- JSON report paths: allow `frontend/public/assets/...` as repo path references.

## Troubleshooting

### Many false positives in docs

- Narrow scope to runtime code paths first.
- Treat docs/reports as repo-reference context, not runtime URL context.

### Paths appear broken but file exists

- Check query/hash stripping logic.
- Confirm case-sensitive path match on filesystem.

### Ambiguous relative references

- Resolve against file directory; if still unclear, mark `unresolved`.

### Mixed runtime and filesystem conventions

- Keep `/assets/...` for runtime code.
- Keep `frontend/public/assets/...` for repository metadata/docs.

## Usage

`Validate asset paths across target files and return structured broken/non-canonical report.`

## Related Skills

- `asset-token-replacer`
- `asset-placement-strategy`
- `manifest-reconciler`

Last Updated: 2026-03-08 | Version: 1.1.0
