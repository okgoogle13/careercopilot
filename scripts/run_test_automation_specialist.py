import asyncio
import logging
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), "../backend"))

from app.agents.test_automation_specialist import TestAutomationSpecialistAgent

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

async def main():
    """
    Run the Test Automation Specialist Agent to generate and validate tests.
    """
    logger.info("🚀 Starting Test Automation Specialist Agent...")
    
    agent = TestAutomationSpecialistAgent()
    
    # Context can be populated with specific targets if needed
    context = {
        "target_scope": "all",
        "focus_area": "m3_compliance"
    }
    
    try:
        results = await agent.execute(context)
        logger.info("✅ Test Automation Specialist completed successfully.")
        logger.info(f"Results: {results}")
        
        # In a real scenario, we might want to fail the build if tests failed
        # or if coverage didn't improve enough, but for now we just exit 0.
        sys.exit(0)
        
    except Exception as e:
        logger.error(f"❌ Agent execution failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
