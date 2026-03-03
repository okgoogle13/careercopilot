"""Regression tests for the task-router queue wrapper format."""

import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))

import task_router_mcp


@pytest.fixture
def wrapped_queue_file(tmp_path, monkeypatch):
    """Point the module at a temp queue file initialized with wrapped JSON."""
    queue_file = tmp_path / "queue.json"
    backup_file = tmp_path / "queue.bak.json"
    monkeypatch.setattr(task_router_mcp, "QUEUE_FILE", str(queue_file))
    monkeypatch.setattr(task_router_mcp, "BACKUP_FILE", str(backup_file))

    queue_file.write_text(
        json.dumps(
            {
                "tasks": [
                    {
                        "task_id": "task-1",
                        "assigned_to": "codex-cli",
                        "status": "pending",
                        "priority": "high",
                        "inputs": {"task_type": "test"},
                        "history": [],
                    },
                    {
                        "task_id": "task-2",
                        "assigned_to": "gemini",
                        "status": "completed",
                        "priority": "medium",
                        "inputs": {"task_type": "analysis"},
                        "history": [],
                    },
                ],
                "metadata": {
                    "queue_version": "1.0",
                    "completed": 1,
                    "in_progress": 0,
                    "pending": 1,
                    "total_tasks": 2,
                },
            }
        )
    )
    return queue_file


def test_list_tasks_reads_wrapped_queue_format(wrapped_queue_file):
    """Wrapped queue files should yield task dicts, not top-level keys."""
    result = task_router_mcp.list_tasks(status="pending", assigned_to="codex-cli")

    assert len(result) == 1
    assert result[0]["task_id"] == "task-1"


def test_claim_task_updates_wrapped_queue_and_metadata(wrapped_queue_file):
    """Claiming should work against the wrapped queue structure."""
    result = task_router_mcp.claim_task("task-1", "codex-cli")
    saved = json.loads(wrapped_queue_file.read_text())

    assert result["status"] == "in_progress"
    assert result["claimed_by"] == "codex-cli"
    assert saved["tasks"][0]["status"] == "in_progress"
    assert saved["metadata"]["pending"] == 0
    assert saved["metadata"]["in_progress"] == 1


def test_complete_task_preserves_wrapped_shape(wrapped_queue_file):
    """Completing should keep the top-level tasks/metadata wrapper intact."""
    result = task_router_mcp.complete_task("task-1", {"ok": True})
    saved = json.loads(wrapped_queue_file.read_text())

    assert result["status"] == "completed"
    assert saved["tasks"][0]["status"] == "completed"
    assert saved["tasks"][0]["outputs"] == {"ok": True}
    assert "metadata" in saved
    assert saved["metadata"]["completed"] == 2
    assert saved["metadata"]["pending"] == 0
