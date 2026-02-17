
import docker
import json
import asyncio
from typing import Any, List, Optional
from mcp.server.fastmcp import FastMCP

# Initialize FastMCP Server
mcp = FastMCP("docker")

# Initialize Docker Client
try:
    client = docker.from_env()
except Exception as e:
    # Fail gracefully if Docker isn't running, but don't crash import
    client = None

@mcp.tool()
def docker_list_containers(all: bool = False) -> str:
    """
    List Docker containers.
    Args:
        all: Show all containers (default shows just running)
    """
    if not client:
        return "Error: Docker client not initialized. Is Docker running?"
    
    try:
        containers = client.containers.list(all=all)
        return json.dumps([
            {
                "id": c.short_id,
                "name": c.name,
                "status": c.status,
                "image": c.image.tags[0] if c.image.tags else c.image.id
            } for c in containers
        ], indent=2)
    except Exception as e:
        return f"Error listing containers: {e}"

@mcp.tool()
def docker_run(image: str, command: Optional[str] = None, detach: bool = True) -> str:
    """
    Run a container.
    Args:
        image: Docker image to run
        command: Command to run in container
        detach: Run in background (default True)
    """
    if not client:
        return "Error: Docker client not initialized."

    try:
        container = client.containers.run(image, command=command, detach=detach)
        return f"Container started: {container.short_id} ({container.name})"
    except Exception as e:
        return f"Error running container: {e}"

@mcp.tool()
def docker_logs(container_id: str, tail: int = 100) -> str:
    """
    Get logs from a container.
    Args:
        container_id: Container ID or name
        tail: Number of lines to show (default 100)
    """
    if not client:
        return "Error: Docker client not initialized."
    
    try:
        container = client.containers.get(container_id)
        logs = container.logs(tail=tail).decode('utf-8')
        return logs
    except Exception as e:
        return f"Error fetching logs: {e}"

if __name__ == "__main__":
    mcp.run()
