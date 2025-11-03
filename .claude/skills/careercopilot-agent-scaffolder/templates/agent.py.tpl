from crewai import Agent

# TODO: Import this agent's specific tools from 'src.tools'
# from src.tools.my_tool import my_tool

{{AGENT_NAME}} = Agent(
    role='TODO: Define the role',
    goal='TODO: Define the singular goal',
    backstory=(
        "TODO: Write a compelling backstory for this agent."
    ),
    tools=[], # TODO: Add imported tools
    allow_delegation=False,
    verbose=True
)
