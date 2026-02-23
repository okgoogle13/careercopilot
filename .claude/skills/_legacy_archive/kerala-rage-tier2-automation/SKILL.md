---
name: kerala-rage-tier2-automation
description: Tier 2 Kerala Rage workflow acceleration skills. Includes batch-processor
  (parallel asset packaging) and task-router-mcp (multi-agent coordination). Deploy
  after Tier 1 for 73% time reduction on batch operations and automated workflow handoffs.
metadata:
  legacy_frontmatter:
    version: 1.0.0
    tags:
    - automation
    - kerala-rage
    - batch-processing
    - workflow
    - tier2
---

# Tier 2 Automation Skills

**Deploy Priority:** SECOND
**ROI:** Workflow acceleration
**Dependencies:** Tier 1 skills

## Overview

Two workflow acceleration skills that enable parallel processing and multi-agent coordination:

1. **batch-processor** - Parallel asset packaging
2. **task-router-mcp** - Multi-agent task orchestration

**Combined Impact:**

- Batch operations: 45 min → 12 min (73% reduction)
- Manual handoffs: 2-3 min → 5 sec (automated)

---

# Skill 1: Batch-Processor

## Purpose

Process multiple validated assets simultaneously. Input: array of 3-5 asset paths. Output: complete packages in parallel. Eliminates sequential bottleneck.

## Input

```json
{
  "batch_id": "batch-theatrical-kr-motifs",
  "assets": [
    {
      "asset_id": "ASSET-3",
      "path": "/downloads/asset-3-validated.png",
      "score": 92,
      "specs": {...}
    },
    {
      "asset_id": "ASSET-4",
      "path": "/downloads/asset-4-validated.png",
      "score": 94,
      "specs": {...}
    },
    {
      "asset_id": "ASSET-6",
      "path": "/downloads/asset-6-validated.png",
      "score": 91,
      "specs": {...}
    }
  ]
}
```

## Parallel Operations

**1. IDF Extraction (Flash-Sidekick)**

```python
# Parallel calls
results = await Promise.all([
    flash_sidekick.generate_idf(asset_3_png),
    flash_sidekick.generate_idf(asset_4_png),
    flash_sidekick.generate_idf(asset_6_png)
])
# Returns in 5-8 seconds vs 15-20 serial
```

**2. Package Generation**
Template-based parallel creation:

- context.md × 3 assets
- tokens.json × 3 assets
- usage.md × 3 assets

**3. Directory Creation**

```bash
mkdir -p /assets/ASSET-{3,4,6}-*/
```

**4. File Copy Operations**
Parallel cp commands:

```bash
cp asset-3.png /frontend/public/assets/patterns/ &
cp asset-4.png /frontend/public/assets/kr-motifs/ &
cp asset-6.png /frontend/public/assets/kr-motifs/ &
wait
```

**5. Single Consolidated Commit**

```bash
git add /assets/ASSET-{3,4,6}-* /frontend/public/assets/*
git commit -m "feat(assets): Add batch theatrical kr-motifs - Assets 3,4,6"
```

## Workflow

1. Receive array of validated assets
2. Spawn parallel IDF extraction (Flash-Sidekick)
3. Generate packages using templates
4. Execute batch file operations
5. Single git commit
6. Report completion metrics

## Integration

**Flash-Sidekick:**

- `batch_file_analysis` for parallel IDF extraction
- Returns aggregated results JSON

**Asset-Packager:**

- Batch mode trigger
- Receives array instead of single asset

**Codex CLI:**

- Executes batch file operations
- Handles git operations

## Efficiency Gain

**Sequential (3 assets):**

- IDF extraction: 15 min (5 min each)
- Packaging: 45 min (15 min each)
- Total: 60 min

**Parallel (3 assets):**

- IDF extraction: 5 min (parallel)
- Packaging: 10 min (template-based)
- Total: 15 min

**Savings:** 75% time reduction for batches

## Constraints

- Max 5 assets per batch (API rate limits)
- All assets must be validated ≥90
- Requires sufficient system memory

## Usage

```python
batch_result = batch_processor.run(
    batch_id="theatrical-kr-motifs",
    assets=[asset_3, asset_4, asset_6]
)

# Output:
# Processed: 3 assets in 15 min
# Created: 9 files across 3 directories
# Committed: 1 consolidated commit
```

---

# Skill 2: Task-Router MCP Server

## Function

Coordinates multi-agent workflows via task queue. Eliminates manual handoffs.

## Architecture

```
Claude Desktop (Orchestrator)
    ↓ creates tasks
Task Queue (JSON file-based)
    ↓ agents poll
[Gemini | Claude Code | Codex CLI]
    ↓ claim → execute → complete
Next Task Auto-assigned
```

## MCP Tools

### 1. `create_task`

```json
{
  "task_id": "asset-3-generation",
  "assigned_to": "gemini",
  "status": "pending",
  "priority": "high",
  "inputs": {
    "prompt": "[full prompt text]",
    "resolution": "512x512"
  },
  "outputs": null,
  "next_task": "asset-3-validation",
  "next_assigned_to": "claude-desktop"
}
```

### 2. `claim_task`

Agent marks task as in-progress:

```json
{
  "task_id": "asset-3-generation",
  "status": "in_progress",
  "claimed_by": "gemini",
  "claimed_at": "2026-01-30T10:15:00Z"
}
```

### 3. `complete_task`

Agent reports completion:

```json
{
  "task_id": "asset-3-generation",
  "status": "completed",
  "outputs": {
    "image_path": "/downloads/asset-3-attempt-2.png",
    "notes": "Generated successfully"
  },
  "completed_at": "2026-01-30T10:18:00Z"
}
```

### 4. `list_tasks`

Query tasks by status/agent:

```json
{
  "status": "pending",
  "assigned_to": "gemini"
}
```

Returns array of matching tasks.

### 5. `rollback_task`

If validation fails, rollback to previous state:

```json
{
  "task_id": "asset-3-validation",
  "rollback_to": "asset-3-generation",
  "reason": "Score 85 (below 90 threshold)"
}
```

## Task Flow Example

**Phase: Asset 3 Generation**

1. Claude Desktop creates task:

```json
{
  "task_id": "asset-3-gen",
  "assigned_to": "gemini",
  "inputs": { "prompt": "...", "resolution": "512x512" },
  "next_task": "asset-3-validate"
}
```

2. Gemini polls queue → claims task → generates → completes:

```json
{
  "status": "completed",
  "outputs": { "image_path": "/downloads/asset-3.png" }
}
```

3. Router auto-creates next task:

```json
{
  "task_id": "asset-3-validate",
  "assigned_to": "claude-desktop",
  "inputs": { "image_path": "/downloads/asset-3.png" }
}
```

4. Claude Desktop claims → validates → scores 92 → completes
5. Router auto-creates packaging task for Claude Code

## Implementation

**File:** `/servers/task_router_mcp.py`

**Queue Storage:** `/tmp/kerala-rage-task-queue.json`

```python
class TaskRouter:
    def __init__(self):
        self.queue_file = "/tmp/kerala-rage-task-queue.json"
        self.tasks = self.load_queue()

    def create_task(self, task_data):
        task = {
            "task_id": task_data['task_id'],
            "assigned_to": task_data['assigned_to'],
            "status": "pending",
            "created_at": datetime.now().isoformat(),
            **task_data
        }
        self.tasks.append(task)
        self.save_queue()
        return task

    def claim_task(self, task_id, agent):
        task = self.get_task(task_id)
        task['status'] = 'in_progress'
        task['claimed_by'] = agent
        task['claimed_at'] = datetime.now().isoformat()
        self.save_queue()

    def complete_task(self, task_id, outputs):
        task = self.get_task(task_id)
        task['status'] = 'completed'
        task['outputs'] = outputs
        task['completed_at'] = datetime.now().isoformat()

        # Auto-create next task if specified
        if task.get('next_task'):
            self.create_task({
                'task_id': task['next_task'],
                'assigned_to': task['next_assigned_to'],
                'inputs': outputs  # Previous outputs → next inputs
            })

        self.save_queue()
```

## Integration

**Claude Desktop Config:**

```json
{
  "mcpServers": {
    "task-router": {
      "command": "python3",
      "args": ["/path/to/task_router_mcp.py"]
    }
  }
}
```

## Agent Polling

Each agent polls queue every 30 seconds:

**Gemini (Antigravity):**

```python
while True:
    tasks = mcp.call_tool("task-router", "list_tasks", {
        "status": "pending",
        "assigned_to": "gemini"
    })
    if tasks:
        task = tasks[0]
        mcp.call_tool("task-router", "claim_task", {"task_id": task['task_id']})
        # Execute generation
        mcp.call_tool("task-router", "complete_task", {
            "task_id": task['task_id'],
            "outputs": {"image_path": result_path}
        })
    time.sleep(30)
```

## Progress Tracking

Dashboard view:

```json
{
  "total_tasks": 47,
  "completed": 23,
  "in_progress": 3,
  "pending": 21,
  "by_agent": {
    "gemini": { "completed": 10, "in_progress": 1 },
    "claude-code": { "completed": 8, "in_progress": 2 },
    "codex": { "completed": 5, "in_progress": 0 }
  }
}
```

## Benefits

- Eliminates manual handoffs
- Progress tracking built-in
- Rollback capability
- Agent autonomy (claim tasks independently)
- Context preserved in task chain

---

# Installation

Extract to Claude Desktop skills:

```bash
cd ~/.config/claude-desktop/skills/
cp -r /path/to/tier2-automation .
```

For task-router MCP server, add to Claude Desktop config:

```json
{
  "mcpServers": {
    "task-router": {
      "command": "python3",
      "args": ["/path/to/task_router_mcp.py"]
    }
  }
}
```

Restart Claude Desktop.

---

_Parallel processing + queue-based orchestration. Sequential workflow → automated coordination._
