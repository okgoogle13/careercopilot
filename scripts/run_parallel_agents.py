import asyncio
from backend.app.agents.orchestrator import AgentOrchestrator, JobScoutAgent, MarketAnalystAgent, ApplicationAgent

async def main():
    # Initialize agents you want to run in parallel
    agents = {
        "job_scout": JobScoutAgent(),
        "market_analyst": MarketAnalystAgent(),
        "application_agent": ApplicationAgent(),
    }

    orchestrator = AgentOrchestrator()
    # Override the default agents with our custom set
    orchestrator.agents = agents

    # Example context – adapt to your use‑case
    context = {
        "user_id": "user_123",
        "search_criteria": {"role": "Software Engineer", "location": "Melbourne"},
    }

    # Run the daily discovery workflow – this will execute agents respecting dependencies.
    # After JobScoutAgent finishes, MarketAnalystAgent and ApplicationAgent will run in parallel.
    result = await orchestrator._run_daily_discovery_workflow(context)
    print("Workflow result:")
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
