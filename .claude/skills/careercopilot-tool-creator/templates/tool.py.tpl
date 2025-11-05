from crewai.tools import tool

@tool("{{TOOL_NAME}}")
def {{TOOL_NAME}}(question: str) -&gt; str:
    """
    TODO: Add a *very* clear docstring. This is critical
    for the agent to know when and how to use this tool.

    Example:
    "Searches the web for recent information on a given topic.
    Input must be a single string search query."
    """

    # TODO: Implement the tool's logic here
    return f"Tool logic for {question} not yet implemented."
