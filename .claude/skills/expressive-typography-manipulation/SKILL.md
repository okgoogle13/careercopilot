---
name: expressive-typography-manipulation
description: Compatibility wrapper for legacy references. Use kerala-rage-typography-strategy as the canonical source for typography policy and implementation.
metadata:
  version: 1.1.0
  tags:
    - typography
    - compatibility
    - m3-expressive
---

# Expressive Typography Manipulation (Compatibility Wrapper)

## Status

This skill is retained for backward compatibility only.

Canonical source:
- `../kerala-rage-typography-strategy/SKILL.md`

## Purpose

Redirect existing workflows that reference `expressive-typography-manipulation` to the consolidated canonical skill without behavioral drift.

## When to Use

- A workflow explicitly invokes this legacy skill name.
- You need continuity for older prompts/docs.

## Rule

When invoked, immediately apply the guidance from:
- `kerala-rage-typography-strategy`

No separate policy or examples should diverge from canonical guidance.

## Migration Guidance

Update references from:
- `expressive-typography-manipulation`

To:
- `kerala-rage-typography-strategy`

Last Updated: 2026-03-08 | Version: 1.1.0
