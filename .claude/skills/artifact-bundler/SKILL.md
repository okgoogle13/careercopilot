---
name: artifact-bundler
description: Bundle a React component or app entry into one shareable HTML artifact with inlined assets for isolated browser review.
metadata:
  version: 1.1.0
  tags:
    - bundling
    - prototype
    - html
    - parcel
---

# Artifact Bundler

## Purpose

Create a single self-contained HTML artifact from a component or entry file so reviewers can open and test the UI without running the full app.

## When to Use

- Share a component prototype with non-technical reviewers.
- Validate isolated visual behavior outside the main dev server.
- Archive deterministic snapshots for design audits or approvals.

## Scope

This skill covers:
- Bundling from `--component` (auto-scaffolded wrapper entry).
- Bundling from `--entry` (existing `.html`, `.tsx`, `.ts`, `.jsx`, or `.js`).
- Inlining built CSS/JS into one output HTML file.

This skill does not cover:
- Pixel-perfect screenshot automation.
- Multi-page app packaging.
- SSR output generation.

## Prerequisites

- `node` + `npx` available.
- Project dependencies required by target entry/component.
- Script path: `.claude/skills/artifact-bundler/scripts/bundle.sh`.

## Usage

```bash
# Bundle a specific component (auto-creates temp wrapper)
.claude/skills/artifact-bundler/scripts/bundle.sh \
  --component frontend/src/components/kerala-rage/KeralaRageButton.tsx \
  --output /tmp/kerala-rage-button.html

# Bundle an existing TS/TSX/JS/JSX entry
.claude/skills/artifact-bundler/scripts/bundle.sh \
  --entry frontend/src/main.tsx \
  --output /tmp/frontend-main.html

# Bundle an existing HTML entry directly
.claude/skills/artifact-bundler/scripts/bundle.sh \
  --entry frontend/index.html \
  --output /tmp/frontend-index.html
```

## Behavior Details

1. Input validation:
- Requires exactly one of `--component` or `--entry`.
- Fails fast when files are missing.

2. Component mode:
- Scaffolds a temporary entry file.
- Resolves component via `default` export first, then named export matching file stem.
- Applies KR base stylesheet import.

3. Entry mode:
- Uses provided `.html` directly, or scaffolds temporary HTML for script/module entries.

4. Build + inline:
- Builds with Parcel.
- Inlines final built assets to a single HTML output.

5. Cleanup:
- Always removes temporary build directory via shell `trap`.

## Edge Cases & Fallbacks

- Component export mismatch: script throws explicit error with expected export forms.
- Missing `npx`: script fails with actionable dependency error.
- Output directory absent: script creates parent directory automatically.
- Relative import resolution: script computes portable paths via `python3` `os.path.relpath`.

## Troubleshooting

### Build fails with module resolution errors
- Run from repo root so aliases/config resolve consistently.
- Confirm project dependencies are installed.

### Output file generated but styles look wrong
- Verify the target entry imports required global styles/tokens.
- In component mode, ensure KR styles path is valid for your repo layout.

### Component does not render
- Confirm the component is either a default export or named export matching filename.
- If component requires props/providers, create an explicit `--entry` wrapper that supplies them.

### Inline step fails
- Confirm `html-inline` is resolvable through `npx`.
- Re-run after clearing transient npm cache issues.

## Best Practices

- Prefer `--entry` when component needs app providers/router/context.
- Use absolute output paths for CI artifacts.
- Keep bundle runs deterministic by pinning Node/package-lock in CI.

## Related Skills

- `component-builder` for generating new KR components.
- `component-visual-audit` for post-bundle visual QA.
