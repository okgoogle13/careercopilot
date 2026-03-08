---
name: artifact-bundler
description: Bundle a React component or app entry into a single shareable HTML artifact for isolated browser review.
metadata:
  version: 1.2.0
  tags:
    - bundling
    - prototype
    - html
---

# Artifact Bundler

## Purpose

Produce portable single-file HTML prototypes for component or page review.

## When to Use

- Share isolated UI artifacts with reviewers.
- Capture deterministic visual snapshots.

## Shared References

- `../shared-references/PIPELINE_EXECUTION_STANDARD.md`

## Script

- `scripts/bundle.sh`

## Scope

Supports `--component` and `--entry` flows; inlines build outputs into one HTML file.

## Usage

```bash
.claude/skills/artifact-bundler/scripts/bundle.sh --entry frontend/index.html --output /tmp/prototype.html
```

## Related Skills

- `phase4-pipeline-orchestrator`
- `component-visual-audit`
