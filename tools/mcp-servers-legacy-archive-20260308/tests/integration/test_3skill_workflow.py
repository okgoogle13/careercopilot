"""
Integration tests for Phase 3 workflow orchestration.

Validates:
- 3+ stage automated workflow sequencing
- conditional retry branching on validation failures
- workflow progress/status reporting
- workflow definition loading from YAML
"""

from pathlib import Path

import pytest
import yaml

import servers.skill_orchestrator_mcp as orchestrator


@pytest.mark.asyncio
async def test_run_workflow_stage_executes_four_stage_pipeline():
    """Run a 4-stage workflow and verify progress/state reporting."""
    stages = [
        {
            "name": "wireframe",
            "skill_name": "wireframe-annotator",
            "arguments": {"brief_path": "/tmp/design-brief.md"},
            "validation": {"min_score": 320, "max_retries": 1},
        },
        {
            "name": "evaluate",
            "skill_name": "m3-expressive-ui-evaluator",
            "arguments": {},
            "validation": {"min_score": 320, "max_retries": 1},
        },
        {
            "name": "component",
            "skill_name": "component-builder",
            "arguments": {"component_name": "DashboardCard"},
        },
        {
            "name": "test",
            "skill_name": "jest-test-scaffolder",
            "arguments": {"target": "DashboardCard"},
        },
    ]

    result = await orchestrator.run_workflow_stage(
        workflow_name="wireframe-evaluate-build-test",
        stages=stages,
        shared_context={"project_name": "CareerCopilot"},
    )

    assert result["status"] == "success"
    assert result["progress"]["total_stages"] == 4
    assert result["progress"]["completed_stages"] == 4
    assert result["progress"]["failed_stages"] == 0
    assert len(result["stages"]) == 4

    conversation_id = result["conversation_id"]
    progress = await orchestrator.get_workflow_progress(conversation_id)
    assert progress["status"] == "success"
    assert progress["stages_completed_count"] == 4

    await orchestrator.context_manager.delete_workflow(conversation_id)


@pytest.mark.asyncio
async def test_run_workflow_stage_retries_when_validation_fails(monkeypatch):
    """A stage should retry with feedback and then succeed."""
    attempts = {"wireframe": 0, "retry_feedback": None}

    def fake_execute_skill(skill_name, arguments, validation=None, context=None):
        if skill_name == "wireframe-annotator":
            attempts["wireframe"] += 1
            if attempts["wireframe"] == 1:
                return {
                    "status": "validation_failed",
                    "skill": skill_name,
                    "output": {"score": 300},
                    "validation": {
                        "score": 300,
                        "min_score": 320,
                        "gap": 20,
                        "retries_available": True,
                    },
                }

            attempts["retry_feedback"] = arguments.get("retry_feedback")
            return {
                "status": "success",
                "skill": skill_name,
                "output": {"score": 330},
            }

        return {
            "status": "success",
            "skill": skill_name,
            "output": {"score": 340},
        }

    monkeypatch.setattr(orchestrator, "execute_skill", fake_execute_skill)

    stages = [
        {
            "skill_name": "wireframe-annotator",
            "arguments": {},
            "validation": {"min_score": 320, "max_retries": 1},
        },
        {
            "skill_name": "component-builder",
            "arguments": {"component_name": "RetryCard"},
        },
    ]

    result = await orchestrator.run_workflow_stage(
        workflow_name="retry-branching-test",
        stages=stages,
    )

    assert result["status"] == "success"
    assert result["progress"]["retries_used"] == 1
    assert result["stages"][0]["attempts"] == 2
    assert attempts["retry_feedback"] is not None
    assert attempts["retry_feedback"]["gap"] == 20

    await orchestrator.context_manager.delete_workflow(result["conversation_id"])


@pytest.mark.asyncio
async def test_run_workflow_stage_fails_after_retry_exhaustion(monkeypatch):
    """Workflow should fail when validation keeps failing after max retries."""

    def always_validation_fail(skill_name, arguments, validation=None, context=None):
        return {
            "status": "validation_failed",
            "skill": skill_name,
            "output": {"score": 280},
            "validation": {
                "score": 280,
                "min_score": 320,
                "gap": 40,
                "retries_available": False,
            },
        }

    monkeypatch.setattr(orchestrator, "execute_skill", always_validation_fail)

    result = await orchestrator.run_workflow_stage(
        workflow_name="retry-exhaustion-test",
        stages=[
            {
                "name": "wireframe",
                "skill_name": "wireframe-annotator",
                "arguments": {},
                "validation": {"min_score": 320, "max_retries": 1},
            },
            {
                "name": "component",
                "skill_name": "component-builder",
                "arguments": {"component_name": "ShouldNotRun"},
            },
        ],
        stop_on_failure=True,
    )

    assert result["status"] == "failed"
    assert result["failed_stage"] == "wireframe"
    assert result["progress"]["completed_stages"] == 0
    assert result["progress"]["failed_stages"] == 1
    assert len(result["stages"]) == 1
    assert result["stages"][0]["attempts"] == 2

    await orchestrator.context_manager.delete_workflow(result["conversation_id"])


def test_load_workflow_definition_from_yaml(tmp_path: Path):
    """Workflow definitions should load from YAML into normalized shape."""
    workflow_file = tmp_path / "workflow.yaml"
    workflow_file.write_text(
        yaml.safe_dump(
            {
                "workflow": {
                    "name": "yaml-workflow",
                    "shared_context": {"project_name": "CareerCopilot"},
                    "stages": [
                        {
                            "skill_name": "wireframe-annotator",
                            "arguments": {"brief_path": "/tmp/brief.md"},
                            "validation": {"min_score": 320, "max_retries": 1},
                        }
                    ],
                }
            }
        ),
        encoding="utf-8",
    )

    result = orchestrator.load_workflow_definition(str(workflow_file))
    assert result["status"] == "success"
    assert result["workflow_name"] == "yaml-workflow"
    assert result["stages_count"] == 1
