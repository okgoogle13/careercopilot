---
name: asset-token-replacer
description: Replace generic asset placeholders in code/docs with canonical KR Solidarity asset IDs and valid runtime paths using deterministic mapping and verification rules.
metadata:
  version: 1.1.0
  tags:
    - design-system
    - automation
    - assets
---

# Asset Token Replacer

## Purpose

Replace placeholder asset references (for example `TODO[asset]`, `placeholder.png`, temporary IDs) with canonical KR Solidarity manifest-backed references across React source and markdown docs.

## When to Use

- Components or docs still contain placeholder asset strings.
- A feature branch needs manifest/registry sync before review.
- You need deterministic reporting of mapped vs unresolved placeholders.

## Canonical Data Sources

Use these in order:

1. `frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`
2. `frontend/public/assets/kr-solidarity-hero-registry.json`

Notes:
- Do not depend on `kr-solidarity-ui-token-map.json` (not canonical in this repo).
- Prefer manifest IDs (`KR-SOLID-*`, `KR-UI-*`) as source of truth.

## Scope

In scope:
- `.tsx`, `.jsx`, `.ts`, `.js`, `.md`, `.mdx`
- Placeholder replacement and path normalization

Out of scope:
- New asset generation
- Visual quality scoring
- Ambiguous auto-selection without explicit confidence

## Mapping Rules

1. Detect placeholders:
- `TODO[asset] ...`
- `placeholder*.png`
- temporary references like `asset-ref-*`

2. Resolve mapping:
- Prefer exact ID references if present in context.
- Else match by explicit hint text (`category`, `layer`, semantic cues) against manifest metadata.
- Use hero registry only to refine path/name where manifest match is already established.

3. Path convention:
- Runtime/public URL should use `/assets/...` (not `/public/assets/...`).
- Preserve relative markdown links only where repository docs require relative paths.

4. Ambiguity handling:
- If multiple candidates are plausible and confidence < 0.85, do not replace.
- Emit unresolved candidate list for manual decision.

## Verification Rules

After replacement:
- Referenced asset ID exists in manifest.
- Referenced runtime path resolves under `frontend/public/assets/...`.
- Replaced file remains syntactically valid and formatting-preserving.
- No destructive edits outside target placeholders.

## Deterministic Output Contract

Return a structured report with:

```json
{
  "summary": {
    "files_scanned": 0,
    "files_modified": 0,
    "placeholders_found": 0,
    "mapped_count": 0,
    "orphaned_count": 0
  },
  "mappings": [
    {
      "file": "frontend/src/components/Hero.tsx",
      "placeholder": "TODO[asset] hero spiritual",
      "resolved_asset_id": "KR-SOLID-022",
      "resolved_path": "/assets/kr-solidarity/devotional/...png",
      "confidence": 0.94,
      "source": "manifest"
    }
  ],
  "orphaned_placeholders": [
    {
      "file": "frontend/src/pages/Landing.tsx",
      "placeholder": "asset-ref-123",
      "candidates": ["KR-SOLID-021", "KR-SOLID-022"],
      "reason": "ambiguous_match"
    }
  ]
}
```

## Process

1. Inventory canonical datasets (manifest first, hero registry second).
2. Scan target files for placeholder patterns.
3. Build candidate matches with confidence scores.
4. Apply only high-confidence replacements (`>= 0.85`).
5. Verify ID/path existence and collect unresolved placeholders.
6. Return diff + deterministic JSON summary.

## Safety Constraints

- Never auto-replace ambiguous placeholders.
- Never rewrite unrelated strings that are not placeholder matches.
- Never emit `/public/assets/...` runtime URLs in frontend code.
- Maintain existing formatting and code style.

## Troubleshooting

### Missing manifest or registry

- Confirm paths:
  - `frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`
  - `frontend/public/assets/kr-solidarity-hero-registry.json`

### Placeholder has no confident match

- Keep unresolved.
- Include candidate IDs and rationale in `orphaned_placeholders`.

### Replaced path does not exist

- Re-check `file_path` in manifest.
- Normalize to runtime form by removing `/public` prefix.

### Markdown vs frontend path mismatch

- Frontend runtime: `/assets/...`
- Markdown docs: use repo-relative links when required by doc context.

### Large batch risk

- Run in small batches by directory.
- Re-run scan after replacement to confirm `placeholders_found == orphaned_count` (expected remaining unresolved only).

## Example

Input:

```tsx
<img src="placeholder-shiva.png" /> // TODO[asset]: Shiva spiritual
```

Output:

```tsx
<img src="/assets/kr-solidarity/devotional/kr-solidarity__spiritual__devotional---solidarity__v1.png" /> // KR-SOLID-022
```

## Related Skills

- `asset-placement-strategy`
- `manifest-reconciler`
- `component-builder`

Last Updated: 2026-03-08 | Version: 1.1.0
