"""
tools/bootstrap_mcp.py
----------------------
Lead Architect: CareerCopilot
Context: Fixes persistent 404s and Auth errors for MCP servers on Chromebook/Linux.

Directives:
1. Backs up and sanitizes .npmrc to fix 'Access token expired'.
2. Installs the CORRECT package names for Docker and Playwright MCP.
3. Generates a 'mcp_config.json' ready for Antigravity/VS Code.
"""

import os
import shutil
import subprocess
import json
import sys
from pathlib import Path

# --- Configuration ---
NPM_CONFIG_USER = Path.home() / ".npmrc"
PROJECT_ROOT = Path(__file__).parent.parent
MCP_OUTPUT_CONFIG = PROJECT_ROOT / "mcp_config.json"

# The ACTUAL working packages on npm (as of 2025)
PACKAGES = {
    "playwright": "@executeautomation/playwright-mcp-server",
    "docker": "@0xshariq/docker-mcp-server"
}

def log(msg, level="INFO"):
    print(f"[{level}] {msg}")

def fix_npm_auth():
    """Moves stale .npmrc out of the way to prevent 403/Auth errors on public packages."""
    if NPM_CONFIG_USER.exists():
        backup_path = NPM_CONFIG_USER.with_suffix(".npmrc.bak")
        log(f"Detected .npmrc. Backing up to {backup_path} to clear stale tokens...", "WARN")
        shutil.move(NPM_CONFIG_USER, backup_path)
        log("Stale .npmrc removed. Public registry access should now work.", "SUCCESS")
    else:
        log("No .npmrc found. Proceeding...", "INFO")

def install_packages():
    """Installs packages globally to ensure they are cached and available."""
    for name, pkg in PACKAGES.items():
        log(f"Installing {name} MCP server: {pkg}...", "ACTION")
        try:
            # We use --no-fund --no-audit for speed on Chromebooks
            cmd = ["npm", "install", "-g", pkg, "--no-fund", "--no-audit"]
            subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            log(f"Successfully installed {pkg}", "SUCCESS")
        except subprocess.CalledProcessError as e:
            log(f"Failed to install {pkg}. Error: {e.stderr.decode()}", "ERROR")
            # Don't exit, try the next one

def generate_config():
    """Generates the JSON config Antigravity needs."""

    # Locate where npm put the binaries (usually /usr/bin/npx or via npx lookup)
    # We will configure them to run via 'npx -y' which is safer now that they are cached

    config = {
        "mcpServers": {
            "docker": {
                "command": "npx",
                "args": [
                    "-y",
                    PACKAGES["docker"]
                ],
                "disabled": False,
                "autoApprove": []
            },
            "playwright": {
                "command": "npx",
                "args": [
                    "-y",
                    PACKAGES["playwright"]
                ],
                "disabled": False,
                "autoApprove": []
            }
        }
    }

    with open(MCP_OUTPUT_CONFIG, "w") as f:
        json.dump(config, f, indent=2)

    log(f"Generated MCP Configuration at: {MCP_OUTPUT_CONFIG}", "SUCCESS")
    log(">>> ACTION REQUIRED: Copy the content of mcp_config.json into your IDE's MCP settings.", "IMPORTANT")

def main():
    log("Starting CareerCopilot MCP Bootstrap...", "INFO")

    # 1. Fix Auth
    fix_npm_auth()

    # 2. Install Correct Packages
    install_packages()

    # 3. Generate Config
    generate_config()

    log("Bootstrap complete. Restart Antigravity/VS Code to apply changes.", "DONE")

if __name__ == "__main__":
    main()
