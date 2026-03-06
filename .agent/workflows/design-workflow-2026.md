---
description: KR Solidarity Unified Design Workflow (v6.0)
---

# KR Solidarity: Design Workflow 2026

This workflow implements the "Solidarity Chain" approach for KR Solidarity development, ensuring 100% token compliance, Material 3 Expressive maturity, and strict adherence to the [Design Canon](../../docs/design/01_CANON.md).

## Step 1: Research & Briefing

1. Consult the [Design Canon](../../docs/design/01_CANON.md) for core identity and the [Zero-Flora Lockdown](../../docs/design/04_ASSETS.md).
2. Use the `brand-brief-optimizer` skill to validate requirements against the Migrant Rage aesthetic.

## Step 2: System Alignment

1. Verify all proposed UI elements against the [System Infrastructure](../../docs/design/02_SYSTEM.md).
2. Ensure variable axes (Work Sans, Fraunces) are mapped to emotional states (Solidarity, Pressure, Melancholy).

## Step 3: Wireframing & Flow Analysis

1. Map user journeys to the [Screen Matrix](../../docs/design/05_FLOWS.md).
2. Use `wireframe-annotator` to generate specs with `<layout>`, `<tokens>`, and `<accessibility>` blocks.

## Step 4: Asset & Component Implementation

1. Slot assets using the [Asset Placement Strategy](../../docs/design/04_ASSETS.md).
2. Build components using the `component-builder` skill, enforcing [Component Standards](../../docs/design/03_COMPONENTS.md).

## Step 5: Visual Audit & Compliance

1. Run `vision-scorer-mcp` to ensure compliance with the KR Solidarity visual bar (Score >= 90).
2. Validate semantic token usage using `design-token-validator`.

## Step 6: Handoff & Registry Sync

1. Update `kerala-rage-kr-solidarity-manifest.json` and `kr-solidarity-hero-registry.json`.
2. Generate final documentation using the `design-system-doc-generator` skill.
