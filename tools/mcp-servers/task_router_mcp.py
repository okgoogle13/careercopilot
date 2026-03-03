#!/usr/bin/env python3
"""
Task-Router MCP Server
Multi-agent task orchestration via a JSON-based queue.
"""

from mcp.server.fastmcp import FastMCP
import json
import os
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple
import shutil

# Configuration
QUEUE_FILE = "/tmp/kerala-rage-task-queue.json"
BACKUP_FILE = "/tmp/kerala-rage-task-queue.bak.json"

mcp = FastMCP("task-router")

def _normalize_queue_payload(payload: Any) -> Tuple[List[Dict[str, Any]], Dict[str, Any], bool]:
    """Support both legacy list queues and wrapped queue objects."""
    if isinstance(payload, list):
        return payload, {}, False
    if isinstance(payload, dict):
        tasks = payload.get("tasks", [])
        metadata = payload.get("metadata", {})
        if isinstance(tasks, list):
            return tasks, metadata if isinstance(metadata, dict) else {}, True
    return [], {}, False


def _load_queue() -> Tuple[List[Dict[str, Any]], Dict[str, Any], bool]:
    if not os.path.exists(QUEUE_FILE):
        return [], {}, False
    try:
        with open(QUEUE_FILE, 'r') as f:
            return _normalize_queue_payload(json.load(f))
    except json.JSONDecodeError:
        return [], {}, False


def _save_queue(tasks: List[Dict[str, Any]], metadata: Optional[Dict[str, Any]] = None, wrapped: bool = False):
    # Atomic write pattern
    payload: Any = {
        "tasks": tasks,
        "metadata": metadata or {},
    } if wrapped or metadata is not None else tasks

    with open(BACKUP_FILE, 'w') as f:
        json.dump(payload, f, indent=2)
    shutil.move(BACKUP_FILE, QUEUE_FILE)

def _get_task(task_id: str, tasks: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    for task in tasks:
        if isinstance(task, dict) and task.get("task_id") == task_id:
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
    tasks, metadata, wrapped = _load_queue()

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
    if wrapped:
        metadata = dict(metadata)
        metadata["total_tasks"] = len(tasks)
        metadata["pending"] = sum(1 for item in tasks if item.get("status") == "pending")
        metadata["in_progress"] = sum(1 for item in tasks if item.get("status") == "in_progress")
        metadata["completed"] = sum(1 for item in tasks if item.get("status") == "completed")
        metadata["last_updated"] = datetime.now().isoformat()
    _save_queue(tasks, metadata if wrapped else None, wrapped)
    return task

@mcp.tool()
def claim_task(task_id: str, agent: str) -> Dict[str, Any]:
    """Mark a task as in-progress by an agent."""
    tasks, metadata, wrapped = _load_queue()
    task = _get_task(task_id, tasks)

    if not task:
        return {"error": f"Task {task_id} not found"}

    if task["status"] != "pending":
         return {"error": f"Task {task_id} is not pending (status: {task['status']})"}

    task["status"] = "in_progress"
    task["claimed_by"] = agent
    task["claimed_at"] = datetime.now().isoformat()
    task.setdefault("history", []).append({
        "event": "claimed",
        "agent": agent,
        "timestamp": datetime.now().isoformat()
    })

    if wrapped:
        metadata = dict(metadata)
        metadata["pending"] = sum(1 for item in tasks if item.get("status") == "pending")
        metadata["in_progress"] = sum(1 for item in tasks if item.get("status") == "in_progress")
        metadata["completed"] = sum(1 for item in tasks if item.get("status") == "completed")
        metadata["last_updated"] = datetime.now().isoformat()

    _save_queue(tasks, metadata if wrapped else None, wrapped)
    return task

@mcp.tool()
def complete_task(task_id: str, outputs: Dict[str, Any]) -> Dict[str, Any]:
    """Mark a task as completed and optionally create the next task."""
    tasks, metadata, wrapped = _load_queue()
    task = _get_task(task_id, tasks)

    if not task:
        return {"error": f"Task {task_id} not found"}

    task["status"] = "completed"
    task["outputs"] = outputs
    task["completed_at"] = datetime.now().isoformat()
    task.setdefault("history", []).append({
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

    if wrapped:
        metadata = dict(metadata)
        metadata["total_tasks"] = len(tasks)
        metadata["pending"] = sum(1 for item in tasks if item.get("status") == "pending")
        metadata["in_progress"] = sum(1 for item in tasks if item.get("status") == "in_progress")
        metadata["completed"] = sum(1 for item in tasks if item.get("status") == "completed")
        metadata["last_updated"] = datetime.now().isoformat()

    _save_queue(tasks, metadata if wrapped else None, wrapped)
    return result

@mcp.tool()
def list_tasks(status: Optional[str] = None, assigned_to: Optional[str] = None) -> List[Dict[str, Any]]:
    """List tasks filtered by status and/or assignee."""
    tasks, _, _ = _load_queue()
    filtered = []

    for task in tasks:
        if not isinstance(task, dict):
            continue
        if status and task.get("status") != status:
            continue
        if assigned_to and task.get("assigned_to") != assigned_to:
            continue
        filtered.append(task)

    return filtered

@mcp.tool()
def rollback_task(task_id: str, reason: str) -> Dict[str, Any]:
    """Reset a task to pending status."""
    tasks, metadata, wrapped = _load_queue()
    task = _get_task(task_id, tasks)

    if not task:
        return {"error": f"Task {task_id} not found"}

    previous_status = task["status"]
    task["status"] = "pending"
    task["claimed_by"] = None
    task["claimed_at"] = None
    task.setdefault("history", []).append({
        "event": "rollback",
        "previous_status": previous_status,
        "reason": reason,
        "timestamp": datetime.now().isoformat()
    })

    if wrapped:
        metadata = dict(metadata)
        metadata["pending"] = sum(1 for item in tasks if item.get("status") == "pending")
        metadata["in_progress"] = sum(1 for item in tasks if item.get("status") == "in_progress")
        metadata["completed"] = sum(1 for item in tasks if item.get("status") == "completed")
        metadata["last_updated"] = datetime.now().isoformat()

    _save_queue(tasks, metadata if wrapped else None, wrapped)
    return task

if __name__ == "__main__":
    mcp.run()
