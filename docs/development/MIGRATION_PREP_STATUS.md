# ✨ M3 MIGRATION PREPARATION & STATUS

## Overview

The project is undergoing migration from Material-UI v5.16.14 to M3 Expressive Design tokens. The goal is 70% readiness before automated migration begins.

## Status Metrics

- **Current Readiness Score:** 12%
- **Target Score:** 70%
- **New Component Location:** All new M3-compliant components must be in **`frontend/src/components/electric/`**.

## Quick Start Commands

- **Run All Prep Steps:** `./scripts/prepare-for-migration.sh` (Runs audit, consolidation, standardization).
- **Audit Structure:** `./scripts/audit-component-structure.sh`
- **Generate Manifest:** `node scripts/generate-component-manifest.ts`

## Key M3 Principles (Anti-Slop)

- Aesthetic score **MUST** be $\geq 80$.
- **No** generic fonts (Inter, Roboto, Arial).
- **Must** use expressive motion (spring physics).
