import os
import json
import shutil
from datetime import datetime
from mcp.server.fastmcp import FastMCP

# Define the server
mcp = FastMCP("AgentHandoff")

# Base directory for the queue
QUEUE_BASE = os.path.abspath(os.path.join(os.getcwd(), ".agent/queue"))
PENDING = os.path.join(QUEUE_BASE, "pending")
IN_PROGRESS = os.path.join(QUEUE_BASE, "in-progress")
COMPLETE = os.path.join(QUEUE_BASE, "complete")

def ensure_dirs():
    for d in [PENDING, IN_PROGRESS, COMPLETE]:
        os.makedirs(d, exist_ok=True)

@mcp.tool()
def task_publish(task_id: str, title: str, objective: str, priority: str = "medium", payload: dict = None):
    """
    Publish a new task for another agent to claim.
    """
    ensure_dirs()
    task_file = os.path.join(PENDING, f"{task_id}.json")
    
    data = {
        "task_id": task_id,
        "title": title,
        "objective": objective,
        "priority": priority,
        "status": "pending",
        "timestamp_created": datetime.now().isoformat(),
        "payload": payload or {}
    }
    
    with open(task_file, "w") as f:
        json.dump(data, f, indent=2)
    
    return f"Task '{task_id}' published to pending queue."

@mcp.tool()
def task_claim(task_id: str):
    """
    Claim a task from the pending queue and move it to in-progress.
    """
    ensure_dirs()
    src = os.path.join(PENDING, f"{task_id}.json")
    dst = os.path.join(IN_PROGRESS, f"{task_id}.json")
    
    if not os.path.exists(src):
        return f"Error: Task '{task_id}' not found in pending queue."
    
    # Update status in JSON
    with open(src, "r") as f:
        data = json.load(f)
    
    data["status"] = "in-progress"
    data["timestamp_claimed"] = datetime.now().isoformat()
    
    with open(src, "w") as f:
        json.dump(data, f, indent=2)
        
    shutil.move(src, dst)
    return f"Task '{task_id}' claimed and moved to in-progress."

@mcp.tool()
def task_complete(task_id: str, summary: str = ""):
    """
    Mark a task as complete and move it to the complete queue.
    """
    ensure_dirs()
    src = os.path.join(IN_PROGRESS, f"{task_id}.json")
    dst = os.path.join(COMPLETE, f"{task_id}.json")
    
    if not os.path.exists(src):
        return f"Error: Task '{task_id}' not found in in-progress queue."
    
    # Update status and summary in JSON
    with open(src, "r") as f:
        data = json.load(f)
    
    data["status"] = "complete"
    data["timestamp_completed"] = datetime.now().isoformat()
    data["completion_summary"] = summary
    
    with open(src, "w") as f:
        json.dump(data, f, indent=2)
        
    shutil.move(src, dst)
    return f"Task '{task_id}' marked as complete."

@mcp.tool()
def task_list():
    """
    List all tasks across all queues.
    """
    ensure_dirs()
    report = {"pending": [], "in-progress": [], "complete": []}
    
    for category, path in [("pending", PENDING), ("in-progress", IN_PROGRESS), ("complete", COMPLETE)]:
        if os.path.exists(path):
            files = [f for f in os.listdir(path) if f.endswith(".json")]
            for f in files:
                with open(os.path.join(path, f), "r") as tf:
                    report[category].append(json.load(tf))
                    
    return report

if __name__ == "__main__":
    mcp.run()
