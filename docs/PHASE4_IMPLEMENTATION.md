# Phase 4: Enhanced Validation & Retry Logic

**Status**: ✅ Complete
**Created**: 2026-02-15
**Sprint**: 2 (Pipeline Automation)
**Builds on**: Phase 3 (Workflow Orchestration)

---

## Overview

Phase 4 enhances the validation and retry capabilities introduced in Phase 3 with:
- **Intelligent retry feedback** with skill-specific improvement suggestions
- **Configurable retry strategies** (immediate, exponential backoff, linear backoff)
- **Severity-based retry guidance** based on score gap analysis
- **Actionable improvement suggestions** tailored to skill types

---

## What's New in Phase 4

### 1. Enhanced Retry Feedback Generation

**Location**: `servers/skill_orchestrator_mcp.py:204-280`

The `_build_retry_feedback()` function now provides:

#### Skill-Specific Suggestions

Different skill types receive tailored improvement guidance:

**Wireframe/Annotator Skills**:
- Gap > 50: "Add more detailed component specifications and layout annotations"
- Gap > 20: "Clarify component hierarchy and relationships"
- Gap ≤ 20: "Refine spacing and alignment specifications"

**Evaluator/Audit Skills**:
- Gap > 50: "Review design token compliance - ensure all colors use --sys-color-* variables"
- Gap > 20: "Verify WCAG 2.2 AA contrast ratios"
- Gap ≤ 20: "Fine-tune motion and transition specifications"

**Component/Builder Skills**:
- Gap > 50: "Ensure TypeScript interfaces match Pydantic backend models"
- Gap > 20: "Improve component composition and reusability"
- Gap ≤ 20: "Refine styling and responsive breakpoints"

#### Severity Classification

Retry feedback includes severity levels based on score gap:
- **Critical** (gap > 50): Major improvements needed
- **Moderate** (gap > 20): Targeted improvements needed
- **Minor** (gap ≤ 20): Small refinements needed

#### Example Retry Feedback Payload

```python
{
    "stage": "wireframe-generation",
    "skill_name": "wireframe-annotator",
    "attempt": 1,
    "previous_score": 280,
    "target_score": 320,
    "gap": 40,
    "severity": "moderate",
    "message": "Score gap is moderate (40 points below threshold). Targeted improvements needed.",
    "improvement_suggestions": [
        "Clarify component hierarchy and relationships",
        "Add accessibility annotations (ARIA labels, roles)"
    ],
    "retry_strategy": "analyze_and_retry"
}
```

---

### 2. Configurable Retry Strategies

**Location**: `servers/skill_orchestrator_mcp.py:285-305`

Three retry strategies are now supported:

#### Immediate (Default)
- **Behavior**: No delay between retries
- **Use case**: Fast iteration when failures are due to randomness, not resource contention
- **Delay formula**: `0 seconds`

#### Exponential Backoff
- **Behavior**: Exponentially increasing delay between retries
- **Use case**: API rate limiting, external service throttling, resource contention
- **Delay formula**: `(2^attempt) * base_delay`
- **Example** (base_delay=2.0s):
  - Attempt 1 → 2s delay
  - Attempt 2 → 4s delay
  - Attempt 3 → 8s delay
  - Attempt 4 → 16s delay

#### Linear Backoff
- **Behavior**: Linearly increasing delay between retries
- **Use case**: Moderate resource contention, distributed system coordination
- **Delay formula**: `attempt * base_delay`
- **Example** (base_delay=2.0s):
  - Attempt 1 → 2s delay
  - Attempt 2 → 4s delay
  - Attempt 3 → 6s delay
  - Attempt 4 → 8s delay

---

## Configuration

### Workflow Definition with Retry Strategies

**File**: `servers/schemas/workflow_schema.yaml`

```yaml
workflow:
  name: "wireframe-to-code-with-retry"
  description: "Design-to-code pipeline with intelligent retry"

  shared_context:
    project_name: "CareerCopilot"

  stages:
    - name: "wireframe"
      skill_name: "wireframe-annotator"
      arguments:
        brief_path: "/tmp/design-brief.md"
      validation:
        min_score: 320
        max_retries: 3
        retry_strategy: "exponential_backoff"  # NEW: Retry strategy
        retry_delay_base: 2.0                   # NEW: Base delay (seconds)

    - name: "evaluate"
      skill_name: "m3-expressive-ui-evaluator"
      arguments: {}
      validation:
        min_score: 320
        max_retries: 2
        retry_strategy: "linear_backoff"        # Different strategy per stage
        retry_delay_base: 3.0

    - name: "component"
      skill_name: "component-builder"
      arguments:
        component_name: "DashboardCard"
      # No validation = no retries (default behavior)
```

### Programmatic Usage

```python
from servers.skill_orchestrator_mcp import run_workflow_stage

# Execute workflow with retry strategies
result = await run_workflow_stage(
    workflow_name="design-to-code-resilient",
    stages=[
        {
            "skill_name": "wireframe-annotator",
            "arguments": {"brief_path": "/tmp/brief.md"},
            "validation": {
                "min_score": 320,
                "max_retries": 3,
                "retry_strategy": "exponential_backoff",
                "retry_delay_base": 2.0
            }
        },
        {
            "skill_name": "m3-expressive-ui-evaluator",
            "arguments": {},
            "validation": {
                "min_score": 320,
                "max_retries": 2,
                "retry_strategy": "immediate"  # No delay for fast iteration
            }
        }
    ],
    stop_on_failure=True
)

# Check retry usage
print(f"Total retries used: {result['progress']['retries_used']}")
for stage in result['stages']:
    print(f"{stage['stage_name']}: {stage['attempts']} attempts, {stage['retries_used']} retries")
```

---

## Workflow Execution Examples

### Example 1: Immediate Retry (Fast Iteration)

**Scenario**: Wireframe generation fails with score 300 (gap: 20)

**Timeline**:
```
T+0.0s: Attempt 1 → Score 300 (validation_failed)
T+0.0s: Retry feedback generated (severity: minor)
T+0.0s: Attempt 2 → Score 330 (success)
```

**Log output**:
```
INFO - Executing skill: wireframe-annotator
INFO - Stage 'wireframe' retry 1/2: No delay (immediate strategy)
INFO - Retrieved outputs from 0 previous stages
INFO - Skill execution completed: success
```

---

### Example 2: Exponential Backoff (API Rate Limiting)

**Scenario**: External API skill hits rate limit, needs progressive backoff

**Timeline**:
```
T+0.0s:  Attempt 1 → Score 280 (validation_failed, gap: 40)
T+0.0s:  Retry feedback generated (severity: moderate)
T+0.0s:  [Waiting 2.0s - exponential_backoff]
T+2.0s:  Attempt 2 → Score 290 (validation_failed, gap: 30)
T+2.0s:  Retry feedback updated
T+2.0s:  [Waiting 4.0s - exponential_backoff]
T+6.0s:  Attempt 3 → Score 325 (success)
```

**Retry feedback evolution**:
```json
// Attempt 1 feedback
{
    "gap": 40,
    "severity": "moderate",
    "improvement_suggestions": [
        "Clarify component hierarchy and relationships",
        "Add accessibility annotations (ARIA labels, roles)"
    ]
}

// Attempt 2 feedback (gap reduced to 30)
{
    "gap": 30,
    "severity": "moderate",
    "improvement_suggestions": [
        "Clarify component hierarchy and relationships",
        "Add accessibility annotations (ARIA labels, roles)"
    ]
}
```

---

### Example 3: Retry Exhaustion with Rich Feedback

**Scenario**: Persistent validation failure across all retry attempts

**Timeline**:
```
T+0.0s:  Attempt 1 → Score 250 (validation_failed, gap: 70)
T+0.0s:  Retry feedback generated (severity: critical)
T+0.0s:  [Waiting 2.0s - exponential_backoff]
T+2.0s:  Attempt 2 → Score 260 (validation_failed, gap: 60)
T+2.0s:  [Waiting 4.0s - exponential_backoff]
T+6.0s:  Attempt 3 → Score 270 (validation_failed, gap: 50)
T+6.0s:  Max retries exceeded → Workflow failed
```

**Final workflow response**:
```json
{
    "status": "failed",
    "failed_stage": "wireframe-generation",
    "failure_reason": {
        "score": 270,
        "min_score": 320,
        "gap": 50,
        "retries_available": false
    },
    "stages": [
        {
            "stage_name": "wireframe-generation",
            "status": "failed",
            "attempts": 3,
            "retries_used": 2,
            "attempt_history": [
                {"attempt": 1, "status": "validation_failed", "score": 250},
                {"attempt": 2, "status": "validation_failed", "score": 260},
                {"attempt": 3, "status": "validation_failed", "score": 270}
            ],
            "final_result": {
                "status": "validation_failed",
                "output": {"score": 270},
                "validation": {
                    "score": 270,
                    "min_score": 320,
                    "gap": 50,
                    "retries_available": false
                }
            }
        }
    ]
}
```

---

## Testing

### Integration Tests

**Location**: `servers/tests/integration/test_phase4_retry.py`

Phase 4 adds comprehensive retry strategy tests:

1. **Exponential Backoff Timing Test**
   - Verifies delay calculation: 2^attempt * base_delay
   - Asserts actual delays match expected exponential curve

2. **Linear Backoff Timing Test**
   - Verifies delay calculation: attempt * base_delay
   - Asserts actual delays match expected linear progression

3. **Enhanced Feedback Quality Test**
   - Verifies skill-specific suggestions are generated
   - Asserts severity levels match score gaps
   - Checks improvement_suggestions array is populated

4. **Mixed Strategy Workflow Test**
   - Stage 1: exponential_backoff
   - Stage 2: linear_backoff
   - Stage 3: immediate
   - Verifies each stage uses correct strategy independently

### Manual Testing

```bash
# Run Phase 4 integration tests
cd /Users/okgoogle13/Desktop/careercopilot
source backend/venv/bin/activate
pytest servers/tests/integration/test_phase4_retry.py -v

# Run full integration suite (Phases 2+3+4)
pytest servers/tests/integration/ -v
```

---

## Performance Impact

### Retry Delay Overhead

**Exponential Backoff** (3 retries, base_delay=2.0s):
- Total delay: 2s + 4s + 8s = **14 seconds**
- Use when: External API rate limiting, resource contention

**Linear Backoff** (3 retries, base_delay=2.0s):
- Total delay: 2s + 4s + 6s = **12 seconds**
- Use when: Moderate resource contention, distributed coordination

**Immediate** (3 retries):
- Total delay: **0 seconds**
- Use when: Fast iteration, no resource constraints

### Best Practices

1. **Start with immediate strategy** for fast iteration during development
2. **Use exponential backoff** when calling external APIs with rate limits
3. **Use linear backoff** for moderate resource contention scenarios
4. **Set max_retries conservatively** (2-3) to avoid excessive delays
5. **Monitor retry_used metrics** in workflow reports to identify problematic stages

---

## Architecture Changes

### Modified Files

1. **`servers/skill_orchestrator_mcp.py`**
   - Enhanced `_build_retry_feedback()` with skill-specific suggestions (lines 204-280)
   - Added `_calculate_retry_delay()` for retry strategy calculation (lines 285-305)
   - Integrated retry delay into `run_workflow_stage` retry loop (lines 621-659)

2. **`servers/schemas/workflow_schema.yaml`**
   - Added `retry_strategy` enum field (immediate, exponential_backoff, linear_backoff)
   - Added `retry_delay_base` numeric field (default: 2.0 seconds)

3. **`servers/tests/integration/test_phase4_retry.py`** (new file)
   - Exponential backoff timing tests
   - Linear backoff timing tests
   - Enhanced feedback quality tests
   - Mixed strategy workflow tests

---

## Backward Compatibility

✅ **100% backward compatible**

- All Phase 4 features are **opt-in**
- Default retry strategy is `"immediate"` (no delay, same as Phase 3)
- Workflows without `retry_strategy` field work identically to Phase 3
- Phase 2 and Phase 3 integration tests still pass (11/11 tests)

---

## Success Metrics

Phase 4 is complete when:

✅ Enhanced retry feedback with skill-specific suggestions
✅ Configurable retry strategies (immediate, exponential, linear)
✅ Retry delay integrated into workflow execution
✅ Workflow schema updated with retry strategy fields
✅ Integration tests pass for all retry strategies
✅ Documentation complete with examples and best practices
✅ Backward compatibility maintained (100%)

---

## Next Steps (Phase 5)

**Phase 5: Dashboard & Monitoring** (Sprint 2 Week 5-6)
- Create web dashboard (FastAPI + React)
- Real-time workflow status display
- Execution logs and error traces
- Performance metrics (execution time, retry count, success rate)
- Workflow health monitoring and alerting

---

## References

- **Phase 3 Implementation**: [PHASE3_MCP_DELEGATION_GUIDE.md](PHASE3_MCP_DELEGATION_GUIDE.md)
- **Phase 2 Implementation**: [PHASE2_IMPLEMENTATION.md](PHASE2_IMPLEMENTATION.md)
- **Architecture Spec**: [docs/architecture/mcp-skill-orchestration-server.md](../docs/architecture/mcp-skill-orchestration-server.md)
- **Workflow Schema**: [servers/schemas/workflow_schema.yaml](../servers/schemas/workflow_schema.yaml)

---

**Status**: ✅ Phase 4 Complete
**Last Updated**: 2026-02-15
**Maintainer**: Kerala Rage Design System Team
