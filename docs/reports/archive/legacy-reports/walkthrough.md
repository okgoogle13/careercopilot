# MCP Server Configuration Walkthrough

I have configured the MCP servers for the CareerCopilot project.

## Changes Made

1.  **Created `claude_desktop_config.json`**:
    - This file contains the configuration for Claude Desktop to connect to the project's MCP servers.
    - It includes configurations for:
      - `orchestrator`
      - `gemini`
      - `documentation`
      - `configuration`
      - `genkit`
      - `contract-validator`
      - `design-system`
      - `firestore`

2.  **Created `MCP_SERVERS.md`**:
    - This file provides detailed documentation on each server, its capabilities, and setup instructions.

3.  **Installed Dependencies**:
    - Installed Node.js dependencies for `servers/perplexity`.

## Action Required

The Python environment in this workspace is missing `pip`, so I could not install the required Python packages. You will need to install them manually:

1.  **Gemini Wrapper Dependencies**:

    ```bash
    pip install -r servers/mcp-gemini-wrapper/requirements.txt
    ```

2.  **Design System Dependencies**:

    ```bash
    pip install wcag-contrast-ratio
    ```

3.  **API Keys**:
    - You need to provide your `GEMINI_API_KEY` in `claude_desktop_config.json` or your environment variables.

## Verification

To verify the setup:

1.  Copy the content of `claude_desktop_config.json` to your local Claude Desktop configuration file (usually `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS).
2.  Restart Claude Desktop.
3.  You should see the connected servers in the Claude Desktop interface (🔌 icon).
