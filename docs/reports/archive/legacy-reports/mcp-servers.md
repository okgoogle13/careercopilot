# MCP Servers Configuration

This project contains several Model Context Protocol (MCP) servers that provide specialized capabilities to Claude and other MCP clients.

## Available Servers

### 1. Claude Orchestrator

- **Path**: `servers/mcp-claude-orchestrator/mcp_claude_orchestrator.py`
- **Description**: Coordinates delegation across other MCP servers, managing routing, caching, and retries.
- **Capabilities**: `health_check_all`, `execute_batch`, `create_health_check_batch`, `create_index_batch`, `create_validation_batch`, `stats`.

### 2. Gemini Wrapper

- **Path**: `servers/mcp-gemini-wrapper/mcp_gemini_wrapper.py`
- **Description**: Wrapper for Google's Gemini API for analysis and content generation.
- **Dependencies**: `google-generativeai` (Install via `pip install -r servers/mcp-gemini-wrapper/requirements.txt`)

### 3. Documentation Server

- **Path**: `.claude/mcp-servers/documentation-server.py`
- **Description**: Provides fast access to codebase documentation, agents, and skills.
- **Capabilities**: `get_docs`, `search_docs`, `get_agents`, `get_skills`, `index`.

### 4. Configuration Server

- **Path**: `.claude/mcp-servers/configuration-server.py`
- **Description**: Manages environment configuration and validation.

### 5. Genkit Server

- **Path**: `.claude/mcp-servers/genkit-server.py`
- **Description**: Manages Genkit flows and execution.

### 6. Contract Validator

- **Path**: `.claude/mcp-servers/contract-validator-server.py`
- **Description**: Validates API contracts and types.

### 7. Design System Server

- **Path**: `.claude/mcp-servers/design-system-server.py`
- **Description**: Manages design tokens and system validation.

### 8. Firestore Server

- **Path**: `.claude/mcp-servers/firestore-server.py`
- **Description**: Interface for Firestore database operations.

### 9. Perplexity Server

- **Path**: `servers/perplexity`
- **Description**: Node.js based server for Perplexity API integration.
- **Type**: HTTP Server (Express)

## Configuration

To use these servers with Claude Desktop, add the following configuration to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "orchestrator": {
      "command": "python3",
      "args": ["/absolute/path/to/careercopilot/servers/mcp-claude-orchestrator/mcp_claude_orchestrator.py"]
    },
    "gemini": {
      "command": "python3",
      "args": ["/absolute/path/to/careercopilot/servers/mcp-gemini-wrapper/mcp_gemini_wrapper.py"],
      "env": {
        "GEMINI_API_KEY": "your-api-key"
      }
    },
    "documentation": {
      "command": "python3",
      "args": ["/absolute/path/to/careercopilot/.claude/mcp-servers/documentation-server.py"]
    },
    "configuration": {
      "command": "python3",
      "args": ["/absolute/path/to/careercopilot/.claude/mcp-servers/configuration-server.py"]
    },
    "genkit": {
      "command": "python3",
      "args": ["/absolute/path/to/careercopilot/.claude/mcp-servers/genkit-server.py"]
    },
    "contract-validator": {
      "command": "python3",
      "args": ["/absolute/path/to/careercopilot/.claude/mcp-servers/contract-validator-server.py"]
    },
    "design-system": {
      "command": "python3",
      "args": ["/absolute/path/to/careercopilot/.claude/mcp-servers/design-system-server.py"]
    },
    "firestore": {
      "command": "python3",
      "args": ["/absolute/path/to/careercopilot/.claude/mcp-servers/firestore-server.py"]
    }
  }
}
```

**Note**: Replace `/absolute/path/to/careercopilot` with the actual absolute path to your project directory.

## Setup

1. Install dependencies for Gemini Wrapper:

   ```bash
   pip install -r servers/mcp-gemini-wrapper/requirements.txt
   ```

2. Ensure `python3` is in your PATH.

3. Configure environment variables (e.g., `GEMINI_API_KEY`) in your `.env` file or directly in the MCP configuration.
