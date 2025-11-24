# Parallel Agents Workflow

---

description: Run multiple agents in parallel using the DependencyOrchestrator
---

## Prerequisites

- Ensure the virtual environment is activated (`source .venv/bin/activate` if using one).
- Install project dependencies (`pip install -r requirements.txt`).
- The database must be migrated (`alembic upgrade head`).

## Steps

1. **Create a Python script** to invoke the orchestrator.
   ```bash
   # File: scripts/run_parallel_agents.py
   ```
   ```python
   import asyncio
   from backend.app.agents.orchestrator import AgentOrchestrator, BaseAgent
   from backend.app.agents.orchestrator import JobScoutAgent, MarketAnalystAgent, ApplicationAgent

   async def main():
       # Initialize agents you want to run in parallel
       agents = {
           "job_scout": JobScoutAgent(),
           "market_analyst": MarketAnalystAgent(),
           "application_agent": ApplicationAgent(),
       }

       orchestrator = AgentOrchestrator()
       orchestrator.agents = agents  # Override default set

       # Example context – adapt to your use‑case
       context = {
           "user_id": "user_123",
           "search_criteria": {"role": "Software Engineer", "location": "Melbourne"},
       }

       # Run the parallel workflow (dependency‑aware – agents with no deps run together)
       result = await orchestrator._run_daily_discovery_workflow(context)
       print("Workflow result:")
       print(result)

   if __name__ == "__main__":
       asyncio.run(main())
   ```

2. **Execute the script**.
   ```bash
   python scripts/run_parallel_agents.py
   ```
   The orchestrator will:
   - Run `JobScoutAgent` first (no dependencies).
   - Once `JobScoutAgent` finishes, `MarketAnalystAgent` and `ApplicationAgent` will start **in parallel** because both depend only on `job_scout`.
   - Store progress in the `AgentSession` table for later inspection.

3. **Verify the session** via the API or directly in the DB.
   ```bash
   # Example using the FastAPI endpoint (if running locally)
   curl http://localhost:8000/api/agents/session/{session_id}
   ```

## Expected Output

```json
{
  "session_id": "<uuid>",
  "workflow_type": "daily_discovery",
  "agents_completed": ["job_scout", "market_analyst", "application_agent"],
  "results": {
    "job_scout": {"jobs_discovered": 15, "top_matches": [...]},
    "market_analyst": {"salary_trends": {...}, "skill_trends": {...}},
    "application_agent": {"materials_generated": 5, "job_applications": [...]}
  },
  "success": true
}
```

## Customising Parallelism

- **Adjust `max_concurrent`** by editing `backend/app/agents/orchestrator.py` – wrap the parallel block with a semaphore:
  ```python
  semaphore = asyncio.Semaphore(4)  # limit to 4 concurrent agents
  async with semaphore:
      agent_results = await agent.execute(agent_context)
  ```
- **Add new agents** – create a subclass of `BaseAgent`, implement `_run_task`, and add it to the `agents` dict.

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|---------------|-----|
| Only one agent runs | Dependencies not declared correctly | Ensure `self.dependencies` list is accurate in the agent's `__init__` |
| High CPU usage | Too many concurrent agents | Reduce concurrency with a semaphore (see above) |
| Session not saved | Database connection pool exhausted | Increase pool size in `SQLALCHEMY_DATABASE_URL` or close idle sessions |

---

**Enjoy blazing‑fast parallel agent execution!**
