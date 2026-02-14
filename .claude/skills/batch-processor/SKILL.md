---
name: batch-processor
description: "Orchestrates parallel design-to-code workflows for multiple components\
  \ (3-5). Manages the pipeline from Protocol \u2192 Wireframe \u2192 Spec \u2192\
  \ Build with aggregated validation gates."
metadata:
  legacy_frontmatter:
    version: 2.0.0
    tags:
    - design-automation
    - component-batching
    - orchestration
---

# Batch-Processor Skill

## Purpose
Orchestrates the parallel processing of multiple components through the Design Automation Workflow. It creates a high-throughput pipeline for generating or migrating components by coordinating 6 specialized design skills, managing parallel execution, and aggregating validation gates.

> **Note**: Also supports legacy asset packaging (PNG → Package) via the `assets` input array.

## When to Use
- **Batch Creation**: Creating 3-5 new M3 Expressive components in a single sprint.
- **Batch Migration**: Refactoring multiple legacy components to the Northcote system.
- **Mixed Batches**: Simultaneously creating new and migrating existing components.
- **High Volume**: When sequential processing of individual components becomes a bottleneck.

## Input Schema

### Component Batch (Primary)
```json
{
  "batch_id": "sprint-24-manifesto-cards",
  "components": [
    {
      "name": "ManifestoCard",
      "mode": "new",
      "context": "Primary display card for the manifesto grid"
    },
    {
      "name": "GalleryGrid",
      "mode": "migrate",
      "context": "Refactor existing grid to use M3 tokens"
    },
    {
      "name": "ActionFab",
      "mode": "new",
      "context": "Floating action button with micro-interactions"
    }
  ]
}
```

### Legacy Asset Batch (Secondary)
```json
{
  "batch_id": "asset-pack-v2",
  "assets": [
    { "path": "/path/to/asset1.png", "asset_id": "ASSET-1" },
    { "path": "/path/to/asset2.png", "asset_id": "ASSET-2" }
  ]
}
```

## Workflow Architecture

The skill orchestrates a **2-Stage Design Workflow** with parallel execution and aggregated gates.

### Stage 1: Structure & Specification (Parallel)
**Input**: Component List → **Output**: Validated Specs

1.  **Parallel Execution**: For each component in `batch`:
    *   **Protocol**: `design-system-doc-generator` creates component-specific design rules.
    *   **Wireframe**: `wireframe-annotator` generates ASCII structure.
    *   **Spec**: `component-spec-generator` derives technical specifications.
2.  **Aggregated Gate 1**:
    *   Pause for **Human Approval** of all wireframes/specs.
    *   *Constraint*: All components must pass M3 validation (Score > 90) before proceeding.

### Stage 2: Visuals & Implementation (Parallel)
**Input**: Approved Specs → **Output**: Production Code

1.  **Parallel Execution**:
    *   **Mockup**: `m3-expressive-ui-evaluator` generates HTML mockups.
    *   **Build/Refactor**:
        *   If `mode="new"`: `component-builder` scaffolds new code.
        *   If `mode="migrate"`: `component-transformer` refactors existing code.
2.  **Aggregated Gate 2**:
    *   **Automated Verification**: `m3-expressive-ui-evaluator` audits final code.
    *   **Commit**: Single consolidated commit for the entire batch.

## Skill Integration Map

| Step | Skill | Role |
| :--- | :--- | :--- |
| **1** | `design-system-doc-generator` | Ingests brief, outputs component protocol |
| **2** | `wireframe-annotator` | Visualizes structure (ASCII) |
| **3** | `component-spec-generator` | Defines props, tokens, and behavior |
| **4** | `m3-expressive-ui-evaluator` | Validates design & code against system |
| **5A** | `component-builder` | Creates new components from spec |
| **5B** | `component-transformer` | Refactors existing components using spec |

## Error Handling & Recovery

### Scenario: Partial Batch Failure
If 1 out of 5 components fails validation or build:
1.  **Isolate**: The failed component is marked `FAILED` and removed from the active batch pipeline.
2.  **Continue**: Processing continues for the remaining 4 successful components.
3.  **Report**: Final output lists successful deployments and error logs for the failed item.

### Retry Strategy
*   **Validation Failures**: Require manual intervention (fix spec/wireframe) -> Re-submit as single-item batch.
*   **Transient Errors**: (e.g., API timeout) -> Automatically retried once by the orchestrator.

### Rollback
*   If a **Critical System Error** occurs (e.g., git corruption), the entire batch is halted, and no commit is made.
*   State is preserved in `docs/design/generated/` for manual recovery.

## Troubleshooting

### "Validation Gate 1 Failed for Component X"
*   **Cause**: The wireframe score is below threshold (e.g., < 320/400).
*   **Fix**: Review `wires/component-x.md`. Manually specific constraints in the prompt to improve M3 alignment. Re-run `wireframe-annotator` for that specific component.

### "Merge Conflict in Consolidated Commit"
*   **Cause**: Multiple components modified the same shared file (unlikely in component isolation).
*   **Fix**: The skill will abort auto-commit. Resolve conflicts manually in `src/` and run `git commit`.

## Usage Examples

### 1. Batch Component Creation
```bash
# Using the coordinator script
./scripts/batch-process-components.sh --manifest ./batch-manifests/sprint-24.json
```

### 2. Mixed New & Migration Batch
```python
# Direct Skill Invocation (Pseudo-code)
batch_processor.run(
    batch_id="mixed-sprint-update",
    components=[
        {"name": "HeroBanner", "mode": "new"},
        {"name": "Footer", "mode": "migrate"}
    ]
)
```

---
*Optimized for high-velocity design teams. Transforms linear "design-then-code" into parallel "batch-design-and-build".*
