import json
import sys
import os
import subprocess

# Read the component code
try:
    with open("frontend/src/components/M3Card/M3Card.tsx", "r") as f:
        code_content = f.read()
except FileNotFoundError:
    print("Error: M3Card.tsx not found")
    sys.exit(1)

# Construct the request
request = {
    "method": "execute_batch",
    "params": {
        "tasks": [
            {
                "id": "analyze_task",
                "server": "gemini-wrapper",
                "method": "analyze_code",
                "params": {
                    "code": code_content,
                    "language": "typescript"
                }
            },
            {
                "id": "test_plan_task",
                "server": "gemini-wrapper",
                "method": "delegate_to_gemini",
                "params": {
                    "prompt": "Based on the code provided in the previous task (M3Card), create a comprehensive Jest test plan covering render, props, interactions, and accessibility.",
                    "system_prompt": "You are a QA specialist."
                }
            }
        ]
    }
}

# Run the orchestrator
# We need to pass the JSON to stdin of the orchestrator script
orchestrator_path = "servers/mcp-claude-orchestrator/mcp_claude_orchestrator.py"
process = subprocess.Popen(
    ["python3", orchestrator_path],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

stdout, stderr = process.communicate(input=json.dumps(request))

if stderr:
    print(f"Orchestrator Stderr: {stderr}")

print(stdout)
