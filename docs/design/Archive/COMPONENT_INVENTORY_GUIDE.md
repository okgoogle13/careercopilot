# Component Inventory Guide

This guide describes how to check the target state of the component library and run the inventory tool to see what's currently built.

## 🎯 Checking Target State

The target state for the current batch of components is defined in:
[component-batch-plan.yaml](file:///Users/okgoogle13/Projects/careercopilot/docs/design/component-batch-plan.yaml)

This file lists components and whether they should be `new` or `migrate`.

## 📊 Running Component Inventory

To see the current state of your components, run the following script:

```bash
./scripts/simple-component-inventory.sh
```

### What the script does:
- Counts total components, tests, and stories.
- Categorizes components by directory and size.
- Identifies potential duplicate components.
- Flags hardcoded colors and spacing that should be migrated to tokens.

## 🔄 Comparing State

After running the inventory, compare the list of components in `src/components` with the `component-batch-plan.yaml`.

- **New**: Components in the plan not yet in `src/components`.
- **Migrate**: Components in `src/components` that still have "Hardcoded Values Detected" in the inventory report.
