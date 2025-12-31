"""
tools/setup_ide_mcp.py
----------------------
Lead Architect: CareerCopilot
Context: Fixes 'Invisible Servers' by writing config to the strictly required .vscode/mcp.json path.
"""

import json
import os
from pathlib import Path

# Define the configuration Antigravity/VS Code expects
# We use 'npx -y' to ensure it runs even if not locally installed, 
# leveraging the cache we built in the previous step.
MCP_CONFIG = {
    "mcpServers": {
        "flash-sidekick": {
            "command": "/home/njd/careercopilot/careercopilot-1/.venv/bin/python3",
            "args": [
                "/home/njd/careercopilot/careercopilot-1/servers/flash_sidekick.py"
            ],
            "env": {
                "GEMINI_MODEL": "models/gemini-2.5-flash-lite",
                "GEMINI_PRO_MODEL": "models/gemini-2.5-pro"
            },
            "disabled": False,
            "autoApprove": []
        },
        "playwright": {
            "command": "npx",
            "args": [
                "-y",
                "@executeautomation/playwright-mcp-server"
            ],
            "disabled": False,
            "autoApprove": []
        },
        "docker": {
            "command": "npx",
            "args": [
                "-y",
                "@0xshariq/docker-mcp-server"
            ],
            "disabled": False,
            "autoApprove": []
        }
    }
}

def main():
    # 1. Target the .vscode directory in the current project
    root_dir = Path(os.getcwd())
    vscode_dir = root_dir / ".vscode"
    target_file = vscode_dir / "mcp.json"

    print(f"[*] Targeting IDE Configuration: {target_file}")

    # 2. Ensure directory exists
    if not vscode_dir.exists():
        print(f"[*] Creating .vscode directory...")
        vscode_dir.mkdir(parents=True, exist_ok=True)

    # 3. Write the configuration
    try:
        with open(target_file, "w") as f:
            json.dump(MCP_CONFIG, f, indent=2)
        print(f"[SUCCESS] Configuration written to {target_file}")
        print("[ACTION] Restart Antigravity/VS Code to apply changes.")
    except Exception as e:
        print(f"[ERROR] Could not write file: {e}")

    # 4. Print for Manual Fallback (The "View raw config" method)
    print("\n" + "="*50)
    print(">>> MANUAL FALLBACK <<<")
    print("If the servers still do not appear, click 'View raw config' in your IDE")
    print("and PASTE the following JSON content exactly:")
    print("="*50)
    print(json.dumps(MCP_CONFIG, indent=2))
    print("="*50 + "\n")

if __name__ == "__main__":
    main()
