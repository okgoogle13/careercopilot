---
name: figma-token-sync
description: Bi-directional token synchronization between DTCG `tokens.json` and Figma
  Variables.
---

# figma-token-sync

**Purpose**: Bi-directional token synchronization between DTCG `tokens.json` and Figma Variables.

## When to Use

- After editing design tokens in `tokens.json`.
- Before design handoff to Figma.
- During mockup generation (optional flag).
- Pre-deployment validation.

## Capabilities

- **Sync Local → Figma**: Push flattened DTCG tokens to Figma Variables.
- **Sync Figma → Local**: Reverse sync variables back to `tokens.json`.
- **Conflict Resolution**: Interactive or automated merge logic for mismatched values.
- **Type Mapping**: Automatic detection and mapping of DTCG types to Figma types.
- **Alias Resolution**: Resolves `{color.primary.base}` to its hex value.
- **Validation**: Checks for deprecated tokens and invalid formats before sync.
- **Reporting**: Generates change logs and sync metrics.

## Usage

### Sync Local to Figma
```bash
npm run tokens:figma:push
```

### Sync Figma to Local
```bash
npm run tokens:figma:pull
```

### Bi-directional Sync
```bash
npm run tokens:figma:sync
```

## Configuration

Requires the following environment variables:
- `FIGMA_ACCESS_TOKEN`: Your Figma Personal Access Token.
- `FIGMA_FILE_KEY`: The key of the Figma file containing the variables.

## Integration Points

- `ui-design-evaluator`: Use `--sync-figma` flag to push generated tokens.
- `design-token-validator`: Automatically runs pre-validation before any sync.
- `batch-processor`: Orchestrates multi-component token updates.

## Roadmap Status

- [x] Skill Definition
- [/] Core Sync API (Week 1)
- [ ] Bidirectional Merge (Week 4)
