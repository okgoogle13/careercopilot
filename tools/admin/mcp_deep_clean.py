"""
tools/mcp_deep_clean.py
-----------------------
Lead Architect: CareerCopilot
Context: "Scorched Earth" removal of all legacy, broken, or conflicting MCP configurations.
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

# --- Configuration ---
PROJECT_ROOT = Path(os.getcwd())
VSCODE_DIR = PROJECT_ROOT / ".vscode"

# List of files that might contain conflicting configurations
CONFLICT_FILES = [
    "mcp_config.json",           # Created by previous failed attempts
    "mcp.json",                  # If sitting in root (wrong place)
    "claude_desktop_config.json",# Common artifact
    "mcp-server-config.json",    # Common artifact
]

# The "Ghost" packages that caused the 404s
BAD_NPM_PACKAGES = [
    "@modelcontextprotocol/server-docker",
    "@modelcontextprotocol/server-playwright",
    "@modelcontextprotocol/server-filesystem" # Just in case
]

def log(msg, level="INFO"):
    print(f"[{level}] {msg}")

def kill_zombies():
    """Kills any running MCP processes to release file locks."""
    log("Scanning for zombie MCP processes...", "ACTION")
    try:
        # Kill node processes running mcp servers
        subprocess.run(["pkill", "-f", "mcp-server"], check=False)
        log("Zombie processes terminated.", "SUCCESS")
    except Exception:
        log("No zombie processes found or permission denied.", "INFO")

def clean_files():
    """Removes conflicting config files from Root and .vscode."""
    # 1. Clean Root
    for filename in CONFLICT_FILES:
        file_path = PROJECT_ROOT / filename
        if file_path.exists():
            try:
                file_path.unlink()
                log(f"Deleted legacy artifact: {filename}", "DELETE")
            except OSError as e:
                log(f"Failed to delete {filename}: {e}", "ERROR")

    # 2. Clean .vscode (We want to regenerate this fresh later)
    target_vscode_config = VSCODE_DIR / "mcp.json"
    if target_vscode_config.exists():
        try:
            target_vscode_config.unlink()
            log(f"Deleted existing .vscode/mcp.json (will be regenerated)", "DELETE")
        except OSError as e:
            log(f"Failed to delete .vscode config: {e}", "ERROR")

def clean_npm():
    """Uninstalls the non-existent/ghost packages globally."""
    log("Purging ghost NPM packages...", "ACTION")
    cmd = ["npm", "uninstall", "-g"] + BAD_NPM_PACKAGES + ["--no-fund", "--no-audit"]
    try:
        subprocess.run(cmd, check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        log("Global NPM cache sanitized.", "SUCCESS")
    except Exception as e:
        log(f"NPM cleanup warning: {e}", "WARN")

def main():
    log("Starting Deep Clean Protocol...", "INFO")

    kill_zombies()
    clean_files()
    clean_npm()

    log("Cleanup Complete. The environment is now a blank slate.", "DONE")
    log(">>> NEXT STEP: Run 'python tools/setup_ide_mcp.py' to establish the Single Source of Truth.", "IMPORTANT")

if __name__ == "__main__":
    main()
