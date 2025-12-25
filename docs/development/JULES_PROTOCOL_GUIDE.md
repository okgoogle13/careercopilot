# 💬 JULES DELEGATION PROTOCOL (JDP)

## Overview

JDP defines the contract for delegating large, asynchronous tasks to the Jules agent, ensuring compliance and trackability.

## Launch Command (Standard Batch)

```bash
cat tasks.txt | while IFS= read -r line; do
  jules remote new --repo . --session "$line"
done
```

## Core JDP Format (Single Line)

A task must be one continuous line for batch processing:

```
Task: [Component/Module] - [Action] - [Requirements] - [Handover Hook]
```

## Compliance Requirements

- **Paths:** Must always be relative (./).
- **Handover Hook:** Must include instructions to generate the final audit report (./.ai_reports/[Component]\_report.md).
- **Monitoring:** Use `jules remote list` and `jules remote status --session [ID]` to track progress.

## Full Reference

Complete Workflow: Refer to `docs/JULES_DELEGATION_WORKFLOW.md` for detailed troubleshooting, monitoring, and validation steps.
