# Parallel Agents and Tasks Guide

**Last Updated:** 2025-11-24  
**Audience:** Developers working with multi-agent systems in CareerCopilot

This guide explains how to set up multiple agents and tasks working in parallel, covering both Python backend orchestration and Claude/Jules delegation patterns.

---

## Table of Contents

1. [Overview](#overview)
2. [Python Async Parallel Execution](#python-async-parallel-execution)
3. [Agent Orchestration Patterns](#agent-orchestration-patterns)
4. [Claude/Jules Multi-Instance Delegation](#claudejules-multi-instance-delegation)
5. [Best Practices](#best-practices)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)

---

## Overview

CareerCopilot uses multiple approaches for parallel execution:

1. **Python AsyncIO** - For backend agent orchestration
2. **Dependency-Based Scheduling** - For sequential + parallel hybrid workflows
3. **Multi-Instance Delegation** - For Claude/Jules parallel task execution

### When to Use Each Approach

| Approach                     | Use Case                                      | Example                              |
| ---------------------------- | --------------------------------------------- | ------------------------------------ |
| **AsyncIO (asyncio.gather)** | Independent tasks that can run simultaneously | Analyzing multiple job postings      |
| **Dependency-Based**         | Tasks with prerequisites                      | Market analysis needs job data first |
| **Multi-Instance**           | Large-scale batch processing                  | Generating tests for 66 components   |

---

## Python Async Parallel Execution

### Basic Pattern: asyncio.gather()

The simplest way to run multiple async tasks in parallel:

```python
import asyncio
from typing import List, Dict, Any

async def analyze_job(job_id: str) -> Dict[str, Any]:
    """Analyze a single job posting"""
    # Simulate API call or AI analysis
    await asyncio.sleep(1)
    return {"job_id": job_id, "score": 0.85}

async def analyze_jobs_parallel(job_ids: List[str]) -> List[Dict[str, Any]]:
    """Analyze multiple jobs in parallel"""
    # Create tasks for all jobs
    tasks = [analyze_job(job_id) for job_id in job_ids]

    # Run all tasks in parallel
    results = await asyncio.gather(*tasks)

    return results

# Usage
job_ids = ["job_1", "job_2", "job_3", "job_4", "job_5"]
results = await analyze_jobs_parallel(job_ids)
```

### Error Handling with asyncio.gather()

```python
async def analyze_jobs_with_error_handling(job_ids: List[str]) -> List[Dict[str, Any]]:
    """Analyze jobs with graceful error handling"""
    tasks = [analyze_job(job_id) for job_id in job_ids]

    # return_exceptions=True prevents one failure from stopping all tasks
    results = await asyncio.gather(*tasks, return_exceptions=True)

    # Process results and handle errors
    successful_results = []
    errors = []

    for i, result in enumerate(results):
        if isinstance(result, Exception):
            errors.append({"job_id": job_ids[i], "error": str(result)})
        else:
            successful_results.append(result)

    return {
        "successful": successful_results,
        "errors": errors,
        "success_rate": len(successful_results) / len(job_ids)
    }
```

### Advanced Pattern: TaskGroup (Python 3.11+)

```python
import asyncio
from asyncio import TaskGroup

async def analyze_jobs_with_taskgroup(job_ids: List[str]) -> List[Dict[str, Any]]:
    """Use TaskGroup for better error handling and cancellation"""
    results = []

    async with TaskGroup() as tg:
        tasks = [tg.create_task(analyze_job(job_id)) for job_id in job_ids]

    # All tasks completed successfully if we reach here
    results = [task.result() for task in tasks]
    return results
```

### Limiting Concurrency with Semaphore

```python
async def analyze_jobs_with_limit(job_ids: List[str], max_concurrent: int = 5) -> List[Dict[str, Any]]:
    """Limit number of concurrent tasks to avoid overwhelming resources"""
    semaphore = asyncio.Semaphore(max_concurrent)

    async def analyze_with_semaphore(job_id: str):
        async with semaphore:
            return await analyze_job(job_id)

    tasks = [analyze_with_semaphore(job_id) for job_id in job_ids]
    results = await asyncio.gather(*tasks)

    return results
```

---

## Agent Orchestration Patterns

### Pattern 1: Fully Parallel (No Dependencies)

Use when agents have no dependencies on each other.

```python
from backend.app.agents.orchestrator import BaseAgent, AgentStatus
import asyncio

class ParallelOrchestrator:
    """Run multiple independent agents in parallel"""

    def __init__(self, agents: List[BaseAgent]):
        self.agents = agents

    async def run_parallel(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute all agents simultaneously"""
        # Create tasks for all agents
        tasks = [agent.execute(context) for agent in self.agents]

        # Run all in parallel
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Collect results
        agent_results = {}
        for agent, result in zip(self.agents, results):
            if isinstance(result, Exception):
                agent_results[agent.agent_id] = {
                    "status": "failed",
                    "error": str(result)
                }
            else:
                agent_results[agent.agent_id] = {
                    "status": "completed",
                    "data": result
                }

        return {
            "execution_mode": "parallel",
            "agents_run": len(self.agents),
            "results": agent_results
        }

# Example usage
async def run_job_analysis():
    # Create multiple independent analysis agents
    agents = [
        JobScoutAgent(),
        SalaryAnalysisAgent(),
        SkillTrendAgent(),
        CompanyResearchAgent()
    ]

    orchestrator = ParallelOrchestrator(agents)
    results = await orchestrator.run_parallel({
        "user_id": "user_123",
        "search_criteria": {"role": "Software Engineer", "location": "Melbourne"}
    })

    return results
```

### Pattern 2: Dependency-Based (Sequential + Parallel Hybrid)

This is the pattern used in `backend/app/agents/orchestrator.py`. Some agents depend on others, creating a DAG (Directed Acyclic Graph).

```python
class DependencyOrchestrator:
    """Execute agents respecting dependencies, parallelizing when possible"""

    def __init__(self, agents: Dict[str, BaseAgent]):
        self.agents = agents

    async def run_with_dependencies(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents in dependency order, parallelizing independent agents"""
        completed_agents = []
        results = {}

        # Build dependency graph
        dependency_graph = self._build_dependency_graph()

        # Execute in waves (each wave contains agents that can run in parallel)
        while len(completed_agents) < len(self.agents):
            # Find agents that can run now
            ready_agents = self._get_ready_agents(completed_agents)

            if not ready_agents:
                raise RuntimeError("Circular dependency detected or no agents ready")

            # Run all ready agents in parallel
            agent_context = self._prepare_context(context, results)
            tasks = [
                self.agents[agent_id].execute(agent_context)
                for agent_id in ready_agents
            ]

            # Execute this wave
            wave_results = await asyncio.gather(*tasks, return_exceptions=True)

            # Process results
            for agent_id, result in zip(ready_agents, wave_results):
                if isinstance(result, Exception):
                    results[agent_id] = {"error": str(result)}
                else:
                    results[agent_id] = result
                    completed_agents.append(agent_id)

        return {
            "execution_mode": "dependency_based",
            "agents_completed": completed_agents,
            "results": results
        }

    def _get_ready_agents(self, completed: List[str]) -> List[str]:
        """Get agents whose dependencies are satisfied"""
        ready = []
        for agent_id, agent in self.agents.items():
            if agent_id not in completed and agent.can_run(completed):
                ready.append(agent_id)
        return ready

    def _prepare_context(self, base_context: Dict, results: Dict) -> Dict:
        """Prepare context with results from completed agents"""
        context = base_context.copy()
        for agent_id, result in results.items():
            context[f"{agent_id}_results"] = result
        return context

    def _build_dependency_graph(self) -> Dict[str, List[str]]:
        """Build dependency graph for visualization"""
        graph = {}
        for agent_id, agent in self.agents.items():
            graph[agent_id] = agent.dependencies
        return graph
```

### Pattern 3: Map-Reduce Pattern

Process many items in parallel, then aggregate results.

```python
class MapReduceOrchestrator:
    """Process items in parallel (map), then aggregate (reduce)"""

    async def map_reduce(
        self,
        items: List[Any],
        map_fn: callable,
        reduce_fn: callable,
        max_concurrent: int = 10
    ) -> Any:
        """
        Map-reduce pattern for parallel processing

        Args:
            items: List of items to process
            map_fn: Async function to process each item
            reduce_fn: Function to aggregate results
            max_concurrent: Max parallel tasks
        """
        # Map phase (parallel)
        semaphore = asyncio.Semaphore(max_concurrent)

        async def map_with_semaphore(item):
            async with semaphore:
                return await map_fn(item)

        tasks = [map_with_semaphore(item) for item in items]
        mapped_results = await asyncio.gather(*tasks, return_exceptions=True)

        # Filter out errors
        successful_results = [
            r for r in mapped_results
            if not isinstance(r, Exception)
        ]

        # Reduce phase (sequential)
        final_result = reduce_fn(successful_results)

        return {
            "total_items": len(items),
            "successful": len(successful_results),
            "failed": len(items) - len(successful_results),
            "result": final_result
        }

# Example: Analyze 100 job postings in parallel, then rank them
async def analyze_and_rank_jobs(job_ids: List[str]):
    orchestrator = MapReduceOrchestrator()

    async def analyze_job(job_id: str):
        # Analyze individual job
        return await job_analysis_agent.analyze(job_id)

    def rank_jobs(analyses: List[Dict]):
        # Aggregate and rank
        sorted_jobs = sorted(analyses, key=lambda x: x['score'], reverse=True)
        return sorted_jobs[:10]  # Top 10

    result = await orchestrator.map_reduce(
        items=job_ids,
        map_fn=analyze_job,
        reduce_fn=rank_jobs,
        max_concurrent=20
    )

    return result
```

---

## Claude/Jules Multi-Instance Delegation

For large-scale batch processing (like generating tests for 66 components), use multiple Claude/Jules instances.

### Pattern: Batch Delegation

This pattern is documented in `.claude/skills/task-delegator/SKILL.md`.

#### Step 1: Prepare Batches

```python
# scripts/prepare_test_batches.py
import json
from pathlib import Path
from typing import List, Dict

def create_component_batches(components: List[str], num_batches: int = 8) -> List[Dict]:
    """Split components into balanced batches"""
    batch_size = len(components) // num_batches
    batches = []

    for i in range(num_batches):
        start_idx = i * batch_size
        end_idx = start_idx + batch_size if i < num_batches - 1 else len(components)

        batch_components = components[start_idx:end_idx]

        batches.append({
            "batch_id": i + 1,
            "batch_name": f"Batch {i + 1}",
            "components": batch_components,
            "component_count": len(batch_components),
            "estimated_tests": len(batch_components) * 15,  # ~15 tests per component
            "expected_duration_minutes": len(batch_components) * 8  # ~8 min per component
        })

    return batches

# Example usage
components = [
    "frontend/src/components/Dialog",
    "frontend/src/components/Toast",
    # ... 64 more components
]

batches = create_component_batches(components, num_batches=8)

# Save batch configurations
for batch in batches:
    batch_file = f".ai_batches/batch_{batch['batch_id']}_config.json"
    with open(batch_file, 'w') as f:
        json.dump(batch, f, indent=2)
```

#### Step 2: Generate Delegation Prompts

```python
def generate_delegation_prompt(batch: Dict) -> str:
    """Generate prompt for Jules instance"""
    components_list = "\n".join([
        f"  {i+1}. {comp}"
        for i, comp in enumerate(batch['components'])
    ])

    prompt = f"""
You are testing Batch {batch['batch_id']} of React components for CareerCopilot.

BATCH INFORMATION:
- Batch ID: {batch['batch_id']}
- Components: {batch['component_count']}
- Expected Tests: {batch['estimated_tests']}
- Estimated Time: {batch['expected_duration_minutes']} minutes

COMPONENT LIST:
{components_list}

YOUR TASK:
1. For each component above:
   a. Use the jest-test-scaffolder skill to generate comprehensive tests
   b. Run: yarn test <ComponentName> to verify
   c. Document pass rate and any failures

2. Generate comprehensive test coverage:
   - Render tests (does it show up?)
   - Props tests (do props work correctly?)
   - Interaction tests (do user interactions work?)
   - State tests (do state changes work?)
   - Edge cases (null props, empty values, etc.)

3. Document Results:
   - Components tested: [X]
   - Tests generated: [Y]
   - Pass rate: [Z]%
   - Failed tests: [List with reasons]
   - Blockers: [Any blocking issues]

SUCCESS METRICS:
- {batch['component_count']} components tested
- {batch['estimated_tests']} tests generated
- 60%+ pass rate minimum
- Clear documentation of failures

TIMELINE:
- Expected completion: {batch['expected_duration_minutes']} minutes
- Report results when complete
"""

    return prompt

# Save prompts
for batch in batches:
    prompt = generate_delegation_prompt(batch)
    prompt_file = f".ai_batches/batch_{batch['batch_id']}_prompt.txt"
    with open(prompt_file, 'w') as f:
        f.write(prompt)
```

#### Step 3: Execute in Parallel

**Manual Execution:**

1. Open 8 separate Claude/Jules instances
2. Copy prompt from `.ai_batches/batch_N_prompt.txt` into each instance
3. Monitor progress across all instances
4. Collect results when complete

**Automated Execution (if using MCP servers):**

```python
# scripts/run_parallel_batches.py
import asyncio
import json
from typing import List, Dict
from mcp_client import MCPClient  # Your MCP client

async def run_batch_on_jules(batch_id: int, prompt: str) -> Dict:
    """Run a single batch on a Jules instance via MCP"""
    client = MCPClient(instance_id=f"jules_{batch_id}")

    try:
        result = await client.send_prompt(prompt)
        return {
            "batch_id": batch_id,
            "status": "completed",
            "result": result
        }
    except Exception as e:
        return {
            "batch_id": batch_id,
            "status": "failed",
            "error": str(e)
        }

async def run_all_batches_parallel(batches: List[Dict]) -> List[Dict]:
    """Run all batches in parallel across multiple Jules instances"""
    tasks = []

    for batch in batches:
        # Load prompt for this batch
        prompt_file = f".ai_batches/batch_{batch['batch_id']}_prompt.txt"
        with open(prompt_file, 'r') as f:
            prompt = f.read()

        # Create task for this batch
        task = run_batch_on_jules(batch['batch_id'], prompt)
        tasks.append(task)

    # Run all batches in parallel
    results = await asyncio.gather(*tasks, return_exceptions=True)

    return results

# Execute
batches = [json.load(open(f".ai_batches/batch_{i}_config.json")) for i in range(1, 9)]
results = asyncio.run(run_all_batches_parallel(batches))

# Save consolidated results
with open(".ai_batches/parallel_execution_results.json", 'w') as f:
    json.dump(results, f, indent=2)
```

#### Step 4: Consolidate Results

```python
def consolidate_batch_results(batch_results: List[Dict]) -> Dict:
    """Consolidate results from all batches"""
    total_components = 0
    total_tests = 0
    total_passed = 0
    total_failed = 0
    all_failures = []

    for result in batch_results:
        if result['status'] == 'completed':
            batch_data = result['result']
            total_components += batch_data.get('components_tested', 0)
            total_tests += batch_data.get('tests_generated', 0)
            total_passed += batch_data.get('tests_passed', 0)
            total_failed += batch_data.get('tests_failed', 0)
            all_failures.extend(batch_data.get('failures', []))

    pass_rate = (total_passed / total_tests * 100) if total_tests > 0 else 0

    return {
        "summary": {
            "total_batches": len(batch_results),
            "successful_batches": sum(1 for r in batch_results if r['status'] == 'completed'),
            "total_components_tested": total_components,
            "total_tests_generated": total_tests,
            "total_tests_passed": total_passed,
            "total_tests_failed": total_failed,
            "overall_pass_rate": round(pass_rate, 2)
        },
        "batch_details": batch_results,
        "common_failures": analyze_common_failures(all_failures)
    }

def analyze_common_failures(failures: List[Dict]) -> List[Dict]:
    """Identify patterns in failures"""
    failure_patterns = {}

    for failure in failures:
        error_type = failure.get('error_type', 'unknown')
        if error_type not in failure_patterns:
            failure_patterns[error_type] = {
                "count": 0,
                "examples": []
            }

        failure_patterns[error_type]["count"] += 1
        if len(failure_patterns[error_type]["examples"]) < 3:
            failure_patterns[error_type]["examples"].append(failure)

    # Sort by frequency
    sorted_patterns = sorted(
        failure_patterns.items(),
        key=lambda x: x[1]["count"],
        reverse=True
    )

    return [
        {
            "error_type": error_type,
            "count": data["count"],
            "examples": data["examples"]
        }
        for error_type, data in sorted_patterns
    ]
```

---

## Best Practices

### 1. Choose the Right Concurrency Level

```python
# Too many concurrent tasks can overwhelm resources
# Too few wastes parallelization opportunity

# Good: Based on resource limits
MAX_CONCURRENT_API_CALLS = 10  # API rate limit
MAX_CONCURRENT_AI_CALLS = 5    # AI service limit
MAX_CONCURRENT_DB_QUERIES = 20 # Database connection pool

# Use semaphore to enforce limits
semaphore = asyncio.Semaphore(MAX_CONCURRENT_AI_CALLS)
```

### 2. Handle Errors Gracefully

```python
async def robust_parallel_execution(tasks: List[callable]) -> Dict:
    """Execute tasks with comprehensive error handling"""
    results = await asyncio.gather(*tasks, return_exceptions=True)

    successful = []
    failed = []

    for i, result in enumerate(results):
        if isinstance(result, Exception):
            failed.append({
                "task_index": i,
                "error": str(result),
                "error_type": type(result).__name__
            })
        else:
            successful.append(result)

    return {
        "successful_count": len(successful),
        "failed_count": len(failed),
        "success_rate": len(successful) / len(tasks),
        "successful_results": successful,
        "failures": failed
    }
```

### 3. Monitor Progress

```python
from tqdm.asyncio import tqdm

async def process_with_progress(items: List[Any], process_fn: callable):
    """Process items with progress bar"""
    tasks = [process_fn(item) for item in items]

    # Use tqdm for progress tracking
    results = []
    for coro in tqdm.as_completed(tasks, total=len(tasks)):
        result = await coro
        results.append(result)

    return results
```

### 4. Implement Timeouts

```python
async def execute_with_timeout(task: callable, timeout_seconds: int = 30):
    """Execute task with timeout"""
    try:
        result = await asyncio.wait_for(task(), timeout=timeout_seconds)
        return {"status": "completed", "result": result}
    except asyncio.TimeoutError:
        return {"status": "timeout", "error": f"Task exceeded {timeout_seconds}s"}
    except Exception as e:
        return {"status": "failed", "error": str(e)}
```

### 5. Log Execution Metrics

```python
import logging
import time

logger = logging.getLogger(__name__)

async def execute_with_metrics(agent: BaseAgent, context: Dict) -> Dict:
    """Execute agent with detailed metrics logging"""
    start_time = time.time()

    logger.info(f"Starting agent: {agent.name}")

    try:
        result = await agent.execute(context)
        duration = time.time() - start_time

        logger.info(
            f"Agent {agent.name} completed in {duration:.2f}s",
            extra={
                "agent_id": agent.agent_id,
                "duration_seconds": duration,
                "status": "success"
            }
        )

        return result

    except Exception as e:
        duration = time.time() - start_time

        logger.error(
            f"Agent {agent.name} failed after {duration:.2f}s: {e}",
            extra={
                "agent_id": agent.agent_id,
                "duration_seconds": duration,
                "status": "failed",
                "error": str(e)
            }
        )

        raise
```

---

## Common Patterns

### Pattern: Fan-Out / Fan-In

Process multiple items in parallel, then aggregate:

```python
async def fan_out_fan_in(items: List[Any]) -> Dict:
    """
    Fan-out: Process each item in parallel
    Fan-in: Aggregate all results
    """
    # Fan-out
    tasks = [process_item(item) for item in items]
    results = await asyncio.gather(*tasks)

    # Fan-in
    aggregated = aggregate_results(results)

    return aggregated
```

### Pattern: Pipeline

Chain multiple processing stages:

```python
async def pipeline(data: Any, stages: List[callable]) -> Any:
    """Process data through multiple stages"""
    result = data

    for stage in stages:
        result = await stage(result)

    return result

# Example: Job processing pipeline
async def process_job(job_data: Dict) -> Dict:
    stages = [
        extract_job_details,
        analyze_requirements,
        calculate_match_score,
        generate_application_materials
    ]

    return await pipeline(job_data, stages)
```

### Pattern: Retry with Exponential Backoff

```python
async def retry_with_backoff(
    task: callable,
    max_retries: int = 3,
    base_delay: float = 1.0
) -> Any:
    """Retry task with exponential backoff"""
    for attempt in range(max_retries):
        try:
            return await task()
        except Exception as e:
            if attempt == max_retries - 1:
                raise

            delay = base_delay * (2 ** attempt)
            logger.warning(f"Attempt {attempt + 1} failed, retrying in {delay}s: {e}")
            await asyncio.sleep(delay)
```

---

## Troubleshooting

### Issue: "RuntimeError: This event loop is already running"

**Cause:** Trying to use `asyncio.run()` inside an already-running event loop.

**Solution:**

```python
# Instead of:
result = asyncio.run(my_async_function())

# Use:
result = await my_async_function()

# Or if you need to run from sync code:
loop = asyncio.get_event_loop()
result = loop.run_until_complete(my_async_function())
```

### Issue: Tasks not running in parallel

**Cause:** Using sequential `await` instead of `gather()`.

**Problem:**

```python
# This runs sequentially (slow)
result1 = await task1()
result2 = await task2()
result3 = await task3()
```

**Solution:**

```python
# This runs in parallel (fast)
results = await asyncio.gather(task1(), task2(), task3())
```

### Issue: High memory usage with many tasks

**Cause:** Creating too many tasks at once.

**Solution:** Use semaphore or process in batches:

```python
async def process_in_batches(items: List[Any], batch_size: int = 100):
    """Process items in batches to control memory"""
    results = []

    for i in range(0, len(items), batch_size):
        batch = items[i:i + batch_size]
        batch_tasks = [process_item(item) for item in batch]
        batch_results = await asyncio.gather(*batch_tasks)
        results.extend(batch_results)

    return results
```

### Issue: One slow task blocking others

**Cause:** All tasks waiting for the slowest one in `gather()`.

**Solution:** Use `as_completed()` to process results as they finish:

```python
async def process_as_completed(tasks: List[callable]):
    """Process results as they complete, don't wait for all"""
    results = []

    for coro in asyncio.as_completed(tasks):
        result = await coro
        # Process result immediately
        results.append(result)
        logger.info(f"Completed {len(results)}/{len(tasks)} tasks")

    return results
```

---

## References

### Related Documentation

- `backend/app/agents/orchestrator.py` - Production agent orchestration
- `.claude/skills/task-delegator/SKILL.md` - Multi-instance delegation
- `SKILL_AGENT_MATRIX.md` - Agent and skill relationships

### Python AsyncIO Resources

- [Python AsyncIO Documentation](https://docs.python.org/3/library/asyncio.html)
- [Real Python AsyncIO Guide](https://realpython.com/async-io-python/)

### CareerCopilot Examples

- **Parallel Job Analysis:** `JobScoutAgent` analyzing multiple jobs
- **Dependency-Based:** `MarketAnalystAgent` depends on `JobScoutAgent`
- **Multi-Instance:** Test generation across 8 Jules instances

---

## Quick Reference

### Python Async Patterns

```python
# Run tasks in parallel
results = await asyncio.gather(task1(), task2(), task3())

# Limit concurrency
semaphore = asyncio.Semaphore(5)
async with semaphore:
    result = await task()

# Timeout
result = await asyncio.wait_for(task(), timeout=30)

# Process as completed
for coro in asyncio.as_completed(tasks):
    result = await coro

# Error handling
results = await asyncio.gather(*tasks, return_exceptions=True)
```

### Agent Orchestration

```python
# Check if agent can run
if agent.can_run(completed_agents):
    result = await agent.execute(context)

# Prepare context with previous results
context[f"{agent_id}_results"] = previous_result

# Track agent status
agent.status  # IDLE, RUNNING, COMPLETED, FAILED
```

### Multi-Instance Delegation

```bash
# 1. Prepare batches
python scripts/prepare_test_batches.py

# 2. Generate prompts
python scripts/generate_delegation_prompts.py

# 3. Execute (manual or automated)
# Open 8 Claude/Jules instances, paste prompts

# 4. Consolidate
python scripts/consolidate_batch_results.py
```

---

**Next Steps:**

1. Review `backend/app/agents/orchestrator.py` for production examples
2. Experiment with `asyncio.gather()` for simple parallel tasks
3. Implement dependency-based orchestration for complex workflows
4. Use multi-instance delegation for large-scale batch processing
