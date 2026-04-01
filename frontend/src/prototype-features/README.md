# Prototype Features Quarantine

This directory contains isolated prototype and experimental features that are **NOT** part of the canonical product routing.

## Rules

- **Imports**: All UI imports MUST resolve to `@/components/PrototypeAdapter`
- **Routes**: All prototype routes MUST be registered with `prototype: true` in route-registry
- **Path**: All files in this directory MUST use `/* eslint-disable */` at the top
- **Promotion**: Prototype code becomes canonical ONLY via explicit route-owned port decision in harvest control docs

## Subdirectories

- `ai-studio/` — AI text generation and document synthesis prototypes
- `design-review/` — Design critique and token validation prototypes
- `ksc-workbench/` — KSC generation and editing prototypes
- `document-builder/` — Multi-format document export prototypes

## Harvest Status

- ✅ AI Studio: Ready for port evaluation (P09-P10)
- ⏳ Design Review: Awaiting compliance audit (P10)
- ⏳ KSC Workbench: Awaiting feature extraction (P10)
- ⏳ Document Builder: Awaiting feature extraction (P10)

---

**Generated at**: 2026-04-01T01:52:00.000Z
**Phase**: P09 Prototype Harvest
