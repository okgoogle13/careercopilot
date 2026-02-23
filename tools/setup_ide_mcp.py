"""
tools/setup_ide_mcp.py
----------------------
Lead Architect: CareerCopilot
Context: Fixes 'Invisible Servers' by writing config to the strictly required .vscode/mcp.json path.
"""

import json
import os
from pathlib import Path

def resolve_python_command(root_dir: Path) -> str:
    """Prefer workspace venv, then .venv, then python3."""
    for candidate in (
        root_dir / "venv" / "bin" / "python",
        root_dir / ".venv" / "bin" / "python",
    ):
        if candidate.exists():
            return str(candidate)
    return "python3"


def build_mcp_config(root_dir: Path) -> dict:
    python_cmd = resolve_python_command(root_dir)
    flash_server = root_dir / "servers" / "flash_sidekick.py"
    return {
        "mcpServers": {
            "flash-sidekick": {
                "command": python_cmd,
                "args": [str(flash_server)],
                "env": {
                    "GEMINI_MODEL": "models/gemini-2.5-flash-lite",
                    "GEMINI_PRO_MODEL": "models/gemini-2.5-pro",
                },
                "disabled": False,
                "autoApprove": [],
            },
            "playwright": {
                "command": "npx",
                "args": [
                    "-y",
                    "@executeautomation/playwright-mcp-server",
                ],
                "disabled": False,
                "autoApprove": [],
            },
            "docker": {
                "command": "npx",
                "args": [
                    "-y",
                    "@0xshariq/docker-mcp-server",
                ],
                "disabled": False,
                "autoApprove": [],
            },
        }
    }

def main():
    # 1. Target the .vscode directory in the current project
    root_dir = Path(os.getcwd()).resolve()
    vscode_dir = root_dir / ".vscode"
    target_file = vscode_dir / "mcp.json"
    mcp_config = build_mcp_config(root_dir)

    print(f"[*] Targeting IDE Configuration: {target_file}")
    print(f"[*] Python command: {resolve_python_command(root_dir)}")

    # 2. Ensure directory exists
    if not vscode_dir.exists():
        print(f"[*] Creating .vscode directory...")
        vscode_dir.mkdir(parents=True, exist_ok=True)

    # 3. Write the configuration
    try:
        with open(target_file, "w") as f:
            json.dump(mcp_config, f, indent=2)
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
    print(json.dumps(mcp_config, indent=2))
    print("="*50 + "\n")

if __name__ == "__main__":
    main()
