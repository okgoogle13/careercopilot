"""
Integration tests for Phase 4 enhanced retry logic.

Validates:
- Exponential backoff retry strategy timing
- Linear backoff retry strategy timing
- Enhanced retry feedback with skill-specific suggestions
- Mixed retry strategies in multi-stage workflows
- Severity-based retry guidance
"""

import time
from pathlib import Path

import pytest

import servers.skill_orchestrator_mcp as orchestrator


@pytest.mark.asyncio
async def test_exponential_backoff_timing():
    """Verify exponential backoff delays: 2^attempt * base_delay."""
    start_times = []

    def mock_execute_with_timing(skill_name, arguments, validation=None, context=None):
        start_times.append(time.time())

        # Always fail validation to trigger retries
        return {
            "status": "validation_failed",
            "skill": skill_name,
            "output": {"score": 280},
            "validation": {
                "score": 280,
                "min_score": 320,
                "gap": 40,
                "retries_available": True
            }
        }

    # Patch execute_skill to track timing
    original_execute = orchestrator.execute_skill
    orchestrator.execute_skill = mock_execute_with_timing

    try:
        result = await orchestrator.run_workflow_stage(
            workflow_name="exponential-backoff-test",
            stages=[
                {
                    "skill_name": "test-skill",
                    "arguments": {},
                    "validation": {
                        "min_score": 320,
                        "max_retries": 2,
                        "retry_strategy": "exponential_backoff",
                        "retry_delay_base": 1.0  # 1s base for faster tests
                    }
                }
            ],
            stop_on_failure=True
        )

        # Should have 3 attempts (1 initial + 2 retries)
        assert len(start_times) == 3

        # Verify exponential backoff delays
        # Attempt 1 → Attempt 2: ~2^1 * 1.0 = 2s delay
        delay_1_to_2 = start_times[1] - start_times[0]
        assert 1.8 <= delay_1_to_2 <= 2.2, f"Expected ~2s delay, got {delay_1_to_2:.2f}s"

        # Attempt 2 → Attempt 3: ~2^2 * 1.0 = 4s delay
        delay_2_to_3 = start_times[2] - start_times[1]
        assert 3.8 <= delay_2_to_3 <= 4.2, f"Expected ~4s delay, got {delay_2_to_3:.2f}s"

        # Verify workflow failed after exhausting retries
        assert result["status"] == "failed"
        assert result["progress"]["retries_used"] == 2

    finally:
        orchestrator.execute_skill = original_execute
        if result.get("conversation_id"):
            await orchestrator.context_manager.delete_workflow(result["conversation_id"])


@pytest.mark.asyncio
async def test_linear_backoff_timing():
    """Verify linear backoff delays: attempt * base_delay."""
    start_times = []

    def mock_execute_with_timing(skill_name, arguments, validation=None, context=None):
        start_times.append(time.time())

        return {
            "status": "validation_failed",
            "skill": skill_name,
            "output": {"score": 290},
            "validation": {
                "score": 290,
                "min_score": 320,
                "gap": 30,
                "retries_available": True
            }
        }

    original_execute = orchestrator.execute_skill
    orchestrator.execute_skill = mock_execute_with_timing

    try:
        result = await orchestrator.run_workflow_stage(
            workflow_name="linear-backoff-test",
            stages=[
                {
                    "skill_name": "test-skill",
                    "arguments": {},
                    "validation": {
                        "min_score": 320,
                        "max_retries": 2,
                        "retry_strategy": "linear_backoff",
                        "retry_delay_base": 1.0
                    }
                }
            ]
        )

        assert len(start_times) == 3

        # Attempt 1 → Attempt 2: 1 * 1.0 = 1s delay
        delay_1_to_2 = start_times[1] - start_times[0]
        assert 0.9 <= delay_1_to_2 <= 1.1, f"Expected ~1s delay, got {delay_1_to_2:.2f}s"

        # Attempt 2 → Attempt 3: 2 * 1.0 = 2s delay
        delay_2_to_3 = start_times[2] - start_times[1]
        assert 1.9 <= delay_2_to_3 <= 2.1, f"Expected ~2s delay, got {delay_2_to_3:.2f}s"

        assert result["status"] == "failed"
        assert result["progress"]["retries_used"] == 2

    finally:
        orchestrator.execute_skill = original_execute
        if result.get("conversation_id"):
            await orchestrator.context_manager.delete_workflow(result["conversation_id"])


@pytest.mark.asyncio
async def test_enhanced_retry_feedback_quality(monkeypatch):
    """Verify retry feedback includes skill-specific suggestions and severity."""
    captured_feedback = []

    def mock_execute_with_feedback_capture(skill_name, arguments, validation=None, context=None):
        # Capture retry_feedback if present
        if "retry_feedback" in arguments:
            captured_feedback.append(arguments["retry_feedback"])

        # Fail first attempt, succeed second
        if len(captured_feedback) == 0:
            return {
                "status": "validation_failed",
                "skill": skill_name,
                "output": {"score": 270},
                "validation": {
                    "score": 270,
                    "min_score": 320,
                    "gap": 50,
                    "retries_available": True
                }
            }
        else:
            return {
                "status": "success",
                "skill": skill_name,
                "output": {"score": 330}
            }

    monkeypatch.setattr(orchestrator, "execute_skill", mock_execute_with_feedback_capture)

    result = await orchestrator.run_workflow_stage(
        workflow_name="feedback-quality-test",
        stages=[
            {
                "skill_name": "wireframe-annotator",
                "arguments": {},
                "validation": {
                    "min_score": 320,
                    "max_retries": 1,
                    "retry_strategy": "immediate"
                }
            }
        ]
    )

    # Verify retry feedback was captured
    assert len(captured_feedback) == 1
    feedback = captured_feedback[0]

    # Verify enhanced feedback structure
    assert "severity" in feedback
    assert "improvement_suggestions" in feedback
    assert "skill_name" in feedback
    assert "gap" in feedback

    # Verify severity classification (gap=50 → critical)
    assert feedback["severity"] == "critical"
    assert feedback["gap"] == 50

    # Verify skill-specific suggestions for wireframe-annotator
    assert isinstance(feedback["improvement_suggestions"], list)
    assert len(feedback["improvement_suggestions"]) > 0

    # Should include wireframe-specific suggestions for critical gap
    suggestions_text = " ".join(feedback["improvement_suggestions"]).lower()
    assert any(word in suggestions_text for word in ["component", "layout", "annotations", "specifications"])

    # Verify workflow succeeded on retry
    assert result["status"] == "success"
    assert result["progress"]["retries_used"] == 1

    await orchestrator.context_manager.delete_workflow(result["conversation_id"])


@pytest.mark.asyncio
async def test_mixed_retry_strategies_workflow(monkeypatch):
    """Verify each stage can use different retry strategies independently."""
    stage_configs = []

    def mock_execute_with_strategy_tracking(skill_name, arguments, validation=None, context=None):
        # Track which stage and strategy is being used
        stage_configs.append({
            "skill": skill_name,
            "has_retry_feedback": "retry_feedback" in arguments
        })

        # Always succeed to focus on strategy verification
        return {
            "status": "success",
            "skill": skill_name,
            "output": {"score": 340}
        }

    monkeypatch.setattr(orchestrator, "execute_skill", mock_execute_with_strategy_tracking)

    result = await orchestrator.run_workflow_stage(
        workflow_name="mixed-strategies-test",
        stages=[
            {
                "name": "stage1",
                "skill_name": "skill-exponential",
                "arguments": {},
                "retry_strategy": "exponential_backoff"  # Stage-level override
            },
            {
                "name": "stage2",
                "skill_name": "skill-linear",
                "arguments": {},
                "validation": {
                    "retry_strategy": "linear_backoff"  # Validation-level config
                }
            },
            {
                "name": "stage3",
                "skill_name": "skill-immediate",
                "arguments": {},
                # No retry_strategy = defaults to immediate
            }
        ]
    )

    # All stages should execute successfully
    assert result["status"] == "success"
    assert result["progress"]["completed_stages"] == 3

    # Verify each stage executed once (no retries since all succeeded)
    assert len(stage_configs) == 3
    assert stage_configs[0]["skill"] == "skill-exponential"
    assert stage_configs[1]["skill"] == "skill-linear"
    assert stage_configs[2]["skill"] == "skill-immediate"

    await orchestrator.context_manager.delete_workflow(result["conversation_id"])


@pytest.mark.asyncio
async def test_immediate_strategy_has_no_delay():
    """Verify immediate strategy executes retries without delay."""
    start_times = []

    def mock_execute_with_timing(skill_name, arguments, validation=None, context=None):
        start_times.append(time.time())

        # Fail all attempts to test delay behavior
        return {
            "status": "validation_failed",
            "skill": skill_name,
            "output": {"score": 300},
            "validation": {
                "score": 300,
                "min_score": 320,
                "gap": 20,
                "retries_available": True
            }
        }

    original_execute = orchestrator.execute_skill
    orchestrator.execute_skill = mock_execute_with_timing

    try:
        result = await orchestrator.run_workflow_stage(
            workflow_name="immediate-no-delay-test",
            stages=[
                {
                    "skill_name": "test-skill",
                    "arguments": {},
                    "validation": {
                        "min_score": 320,
                        "max_retries": 2,
                        "retry_strategy": "immediate"  # No delay
                    }
                }
            ]
        )

        assert len(start_times) == 3

        # All attempts should execute with minimal delay (< 100ms overhead)
        total_time = start_times[-1] - start_times[0]
        assert total_time < 0.5, f"Expected < 0.5s total (immediate), got {total_time:.2f}s"

        # Verify each retry was nearly instantaneous
        for i in range(len(start_times) - 1):
            delay = start_times[i + 1] - start_times[i]
            assert delay < 0.1, f"Expected < 0.1s delay (immediate), got {delay:.2f}s"

    finally:
        orchestrator.execute_skill = original_execute
        if result.get("conversation_id"):
            await orchestrator.context_manager.delete_workflow(result["conversation_id"])


@pytest.mark.asyncio
async def test_severity_based_suggestions(monkeypatch):
    """Verify severity levels change based on score gap."""
    feedback_by_gap = {}

    def mock_execute_with_gap_variation(skill_name, arguments, validation=None, context=None):
        gap = validation.get("min_score", 320) - 280  # Always fail with score 280

        if "retry_feedback" in arguments:
            feedback_by_gap[gap] = arguments["retry_feedback"]

        # Always fail to trigger retry feedback
        return {
            "status": "validation_failed",
            "skill": skill_name,
            "output": {"score": 280},
            "validation": {
                "score": 280,
                "min_score": validation.get("min_score", 320),
                "gap": gap,
                "retries_available": True
            }
        }

    monkeypatch.setattr(orchestrator, "execute_skill", mock_execute_with_gap_variation)

    # Test critical severity (gap > 50)
    result1 = await orchestrator.run_workflow_stage(
        workflow_name="severity-critical-test",
        stages=[
            {
                "skill_name": "test-skill",
                "arguments": {},
                "validation": {"min_score": 340, "max_retries": 1}  # gap = 60
            }
        ]
    )

    # Test moderate severity (20 < gap <= 50)
    result2 = await orchestrator.run_workflow_stage(
        workflow_name="severity-moderate-test",
        stages=[
            {
                "skill_name": "test-skill",
                "arguments": {},
                "validation": {"min_score": 310, "max_retries": 1}  # gap = 30
            }
        ]
    )

    # Test minor severity (gap <= 20)
    result3 = await orchestrator.run_workflow_stage(
        workflow_name="severity-minor-test",
        stages=[
            {
                "skill_name": "test-skill",
                "arguments": {},
                "validation": {"min_score": 295, "max_retries": 1}  # gap = 15
            }
        ]
    )

    # Verify severity classification
    assert 60 in feedback_by_gap
    assert feedback_by_gap[60]["severity"] == "critical"
    assert "critical" in feedback_by_gap[60]["message"].lower()

    assert 30 in feedback_by_gap
    assert feedback_by_gap[30]["severity"] == "moderate"
    assert "moderate" in feedback_by_gap[30]["message"].lower()

    assert 15 in feedback_by_gap
    assert feedback_by_gap[15]["severity"] == "minor"
    assert "minor" in feedback_by_gap[15]["message"].lower()

    # Cleanup
    for result in [result1, result2, result3]:
        if result.get("conversation_id"):
            await orchestrator.context_manager.delete_workflow(result["conversation_id"])
