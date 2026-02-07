#!/usr/bin/env python3
"""
Task-Router MCP Server
Multi-agent task orchestration via a JSON-based queue.
"""

from mcp.server.fastmcp import FastMCP
import json
import os
import time
from datetime import datetime
from typing import Dict, Any, List, Optional
import shutil

# Configuration
QUEUE_FILE = "/tmp/northcote-task-queue.json"
BACKUP_FILE = "/tmp/northcote-task-queue.bak.json"

mcp = FastMCP("task-router")

def _load_queue() -> List[Dict[str, Any]]:
    if not os.path.exists(QUEUE_FILE):
        return []
    try:
        with open(QUEUE_FILE, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []

def _save_queue(tasks: List[Dict[str, Any]]):
    # Atomic write pattern
    with open(BACKUP_FILE, 'w') as f:
        json.dump(tasks, f, indent=2)
    shutil.move(BACKUP_FILE, QUEUE_FILE)

def _get_task(task_id: str, tasks: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    for task in tasks:
        if task.get("task_id") == task_id:
            return task
    return None

@mcp.tool()
def create_task(
    task_id: str,
    assigned_to: str,
    inputs: Dict[str, Any],
    priority: str = "normal",
    next_task: Optional[str] = None,
    next_assigned_to: Optional[str] = None
) -> Dict[str, Any]:
    """Create a new task in the queue."""
    tasks = _load_queue()

    if _get_task(task_id, tasks):
        return {"error": f"Task ID {task_id} already exists"}

    task = {
        "task_id": task_id,
        "assigned_to": assigned_to,
        "status": "pending",
        "priority": priority,
        "inputs": inputs,
        "created_at": datetime.now().isoformat(),
        "next_task": next_task,
        "next_assigned_to": next_assigned_to,
        "history": []
    }

    tasks.append(task)
    _save_queue(tasks)
    return task

@mcp.tool()
def claim_task(task_id: str, agent: str) -> Dict[str, Any]:
    """Mark a task as in-progress by an agent."""
    tasks = _load_queue()
    task = _get_task(task_id, tasks)

    if not task:
        return {"error": f"Task {task_id} not found"}

    if task["status"] != "pending":
         return {"error": f"Task {task_id} is not pending (status: {task['status']})"}

    task["status"] = "in_progress"
    task["claimed_by"] = agent
    task["claimed_at"] = datetime.now().isoformat()
    task["history"].append({
        "event": "claimed",
        "agent": agent,
        "timestamp": datetime.now().isoformat()
    })

    _save_queue(tasks)
    return task

@mcp.tool()
def complete_task(task_id: str, outputs: Dict[str, Any]) -> Dict[str, Any]:
    """Mark a task as completed and optionally create the next task."""
    tasks = _load_queue()
    task = _get_task(task_id, tasks)

    if not task:
        return {"error": f"Task {task_id} not found"}

    task["status"] = "completed"
    task["outputs"] = outputs
    task["completed_at"] = datetime.now().isoformat()
    task["history"].append({
        "event": "completed",
        "timestamp": datetime.now().isoformat()
    })

    result = {"status": "completed", "task": task}

    # Auto-create next task
    if task.get("next_task") and task.get("next_assigned_to"):
        next_task_id = task["next_task"]
        if not _get_task(next_task_id, tasks):
            next_task = {
                "task_id": next_task_id,
                "assigned_to": task["next_assigned_to"],
                "status": "pending",
                "priority": task.get("priority", "normal"),
                "inputs": outputs, # Pass outputs as inputs to next task
                "created_at": datetime.now().isoformat(),
                "history": [],
                "previous_task": task_id
            }
            tasks.append(next_task)
            result["next_task_created"] = next_task

    _save_queue(tasks)
    return result

@mcp.tool()
def list_tasks(status: Optional[str] = None, assigned_to: Optional[str] = None) -> List[Dict[str, Any]]:
    """List tasks filtered by status and/or assignee."""
    tasks = _load_queue()
    filtered = []

    for task in tasks:
        if status and task["status"] != status:
            continue
        if assigned_to and task["assigned_to"] != assigned_to:
            continue
        filtered.append(task)

    return filtered

@mcp.tool()
def rollback_task(task_id: str, reason: str) -> Dict[str, Any]:
    """Reset a task to pending status."""
    tasks = _load_queue()
    task = _get_task(task_id, tasks)

    if not task:
        return {"error": f"Task {task_id} not found"}

    previous_status = task["status"]
    task["status"] = "pending"
    task["claimed_by"] = None
    task["claimed_at"] = None
    task["history"].append({
        "event": "rollback",
        "previous_status": previous_status,
        "reason": reason,
        "timestamp": datetime.now().isoformat()
    })

    _save_queue(tasks)
    return task

if __name__ == "__main__":
    mcp.run()
