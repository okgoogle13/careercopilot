# MCP Server Configuration Guide

## Overview

CareerCopilot uses **Model Context Protocol (MCP)** servers to enable autonomous multi-agent workflows. This document provides setup instructions for all MCP servers in the project.

---

## Available MCP Servers

### 1. Task Router MCP
**Purpose**: Multi-agent task orchestration via JSON-based queue
**File**: `/servers/task_router_mcp.py`
**Status**: ✅ Active

### 2. Skill Orchestrator MCP
**Purpose**: Programmatic execution of Claude Code skills
**File**: `/servers/skill_orchestrator_mcp.py`
**Status**: ✅ Active (Phase 1)

---

## Claude Desktop Configuration

Add the following to your Claude Desktop config file:

**macOS/Linux**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "task-router": {
      "command": "/Users/YOUR_USERNAME/Desktop/careercopilot/.venv/bin/python3",
      "args": [
        "/Users/YOUR_USERNAME/Desktop/careercopilot/servers/task_router_mcp.py"
      ],
      "env": {
        "QUEUE_FILE": "/tmp/northcote-task-queue.json"
      }
    },
    "skill-orchestrator": {
      "command": "/Users/YOUR_USERNAME/Desktop/careercopilot/.venv/bin/python3",
      "args": [
        "/Users/YOUR_USERNAME/Desktop/careercopilot/servers/skill_orchestrator_mcp.py"
      ],
      "env": {
        "CLAUDE_SKILLS_PATH": "/Users/YOUR_USERNAME/Desktop/careercopilot/.claude/skills",
        "MAX_EXECUTION_TIME_SEC": "300"
      }
    }
  }
}
```

**Important**: Replace `/Users/YOUR_USERNAME/Desktop/careercopilot` with your actual project path.

---

## Environment Variables

### Task Router
| Variable | Default | Description |
|---|---|---|
| `QUEUE_FILE` | `/tmp/northcote-task-queue.json` | Task queue storage location |

### Skill Orchestrator
| Variable | Default | Description |
|---|---|---|
| `CLAUDE_SKILLS_PATH` | `/Users/.../careercopilot/.claude/skills` | Skills directory path |
| `MAX_EXECUTION_TIME_SEC` | `300` | Maximum skill execution time (5 minutes) |

---

## Testing MCP Servers

### Verify Server Registration

```bash
# In Claude Desktop, check MCP status
# The servers should appear in: Settings → Developer → MCP Servers
```

### Test Task Router

```python
# In Claude Desktop (after server is configured)
from mcp import Client

client = Client("task-router")

# List all tasks
tasks = await client.call_tool("list_tasks")
print(tasks)

# Create a test task
result = await client.call_tool(
    "create_task",
    task_id="test-task-001",
    assigned_to="claude-code",
    inputs={"description": "Test task"},
    priority="normal"
)
print(result)
```

### Test Skill Orchestrator

```python
# Get skill registry
from mcp import Client

client = Client("skill-orchestrator")

registry = await client.call_tool("get_skill_registry")
print(f"Total skills: {registry['total_skills']}")

# Execute a skill (simulation in Phase 1)
result = await client.call_tool(
    "execute_skill",
    skill_name="wireframe-annotator",
    arguments={"brief_path": "/path/to/brief.md"}
)
print(result)
```

---

## Troubleshooting

### Server Not Starting

**Symptom**: Server doesn't appear in Claude Desktop MCP list

**Solutions**:
1. Check Python path is correct:
   ```bash
   which python3
   # Use this path in "command" field
   ```

2. Verify virtual environment:
   ```bash
   cd /Users/YOUR_USERNAME/Desktop/careercopilot
   source .venv/bin/activate
   python3 -m pip list | grep fastmcp
   ```

3. Test server manually:
   ```bash
   python3 servers/skill_orchestrator_mcp.py
   # Should output: "Starting MCP Skill Orchestration Server..."
   ```

---

### Permission Errors

**Symptom**: `Permission denied` when accessing queue file

**Solution**:
```bash
# Ensure temp directory is writable
chmod 755 /tmp
touch /tmp/northcote-task-queue.json
chmod 644 /tmp/northcote-task-queue.json
```

---

### Skills Not Loading

**Symptom**: `get_skill_registry` returns 0 skills

**Solutions**:
1. Verify skills path:
   ```bash
   ls -la /Users/YOUR_USERNAME/Desktop/careercopilot/.claude/skills
   ```

2. Check SKILL.md frontmatter:
   ```yaml
   ---
   name: skill-name
   description: Skill description
   metadata:
     version: 1.0.0
   ---
   ```

3. Check server logs:
   ```bash
   # Add to env vars in config:
   "LOG_LEVEL": "DEBUG"
   ```

---

## Development Workflow

### Adding a New MCP Tool

1. **Define the tool** in the server file:
   ```python
   @mcp.tool()
   def my_new_tool(param1: str, param2: int) -> Dict[str, Any]:
       """Tool description."""
       return {"result": "success"}
   ```

2. **Test locally**:
   ```bash
   python3 servers/skill_orchestrator_mcp.py
   # Verify no errors
   ```

3. **Restart Claude Desktop** to load the new tool

4. **Test via Claude Desktop**:
   ```python
   result = await client.call_tool("my_new_tool", param1="test", param2=42)
   ```

---

### Debugging MCP Communication

Enable verbose logging:

```json
{
  "mcpServers": {
    "skill-orchestrator": {
      "command": "...",
      "args": [...],
      "env": {
        "LOG_LEVEL": "DEBUG",
        "PYTHONUNBUFFERED": "1"
      }
    }
  }
}
```

View logs:
```bash
# macOS
tail -f ~/Library/Logs/Claude/mcp-server-skill-orchestrator.log

# Linux
tail -f ~/.local/share/Claude/logs/mcp-server-skill-orchestrator.log
```

---

## Security Considerations

### Local-Only Access

MCP servers bind to `127.0.0.1` by default (local-only). Do NOT expose to network without authentication.

### File Access Restrictions

Servers can only access files within the project directory. Attempting to access files outside will result in permission errors.

### Command Execution

Skill orchestration does NOT execute arbitrary shell commands. Only registered skills can be invoked.

---

## Next Steps

- **Phase 2**: Add context management for multi-step workflows
- **Phase 3**: Implement `run_workflow_stage` for pipeline automation
- **Phase 4**: Add automatic retry logic with validation gates
- **Phase 5**: Build web dashboard for workflow monitoring

---

## References

- [MCP Specification](https://modelcontextprotocol.io/)
- [FastMCP Documentation](https://github.com/jlowin/fastmcp)
- [Task Router Architecture](../servers/task_router_mcp.py)
- [Skill Orchestration Architecture](./architecture/mcp-skill-orchestration-server.md)

---

**Last Updated**: 2026-02-15
**Version**: 1.0.0 (Phase 1)
