# Component Inventory Guide

> [!WARNING]
> This legacy documentation and the `simple-component-inventory.sh` script are **deprecated**.
> The source of truth for migration remains the route matrix and active migration blueprint.
> The automated AST crawler in `frontend/scripts/component-inventory.ts` is a support tool only.
> The layered mapping snapshot is located at:
> `docs/design/layered-component-blueprint.json` (categorized by L1-L4 taxonomy).

This guide describes how to check the target state of the component library and run the modern inventory tool.

## 🎯 Checking Target State

The target state snapshot for the components is defined in the auto-generated AST layered blueprint:
../layered-component-blueprint.json

## 📊 Running Component Inventory

To see the current state of your components, run the modern AST crawler:

```bash
cd frontend
npx tsx scripts/component-inventory.ts
```

To generate the full layered blueprint (L1-L4 taxonomy):

```bash
cd frontend
npx tsx scripts/component-inventory.ts --raw
npx tsx scripts/generate-layered-blueprint.ts
```
