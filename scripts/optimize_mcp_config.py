import json
import os

# Paths to the MCP configurations
CONFIG_PATHS = [
    "/Users/okgoogle13/.gemini/antigravity/mcp_config.json",
    "/Users/okgoogle13/Projects/careercopilot/mcp_config.json",
    "/Users/okgoogle13/Library/Application Support/Code/User/mcp.json"
]

# Tool Exclusion List (Approx 50 tools)
DISABLED_TOOLS = {
    "github": [
        "search_users", "search_repositories", "create_repository", "fork_repository",
        "list_commits", "get_file_contents", "search_issues", "get_issue", "list_issues",
        "add_issue_comment", "update_issue", "update_pull_request_branch",
        "get_pull_request_comments", "get_pull_request_status", "list_pull_requests", "search_code"
    ],
    "supabase-mcp-server": [
        "list_organizations", "get_organization", "get_cost", "confirm_cost",
        "list_projects", "get_project", "create_project", "pause_project",
        "restore_project", "list_extensions", "list_migrations", "list_branches",
        "delete_branch", "rebase_branch", "get_advisors", "get_project_url", "get_publishable_keys"
    ],
    "playwright": [
        "resize", "drag", "hover", "press_key", "console_messages",
        "network_requests", "evaluate", "file_upload"
    ],
    "flash-sidekick": [
        "trigger_error", "create_readme", "generate_api_docs", "generate_docstrings", "generate_idf"
    ],
    "docker": [
        "list_images", "inspect_container", "list_containers"
    ],
    "perplexity-ask": [
        "perplexity_search_web"
    ]
}

def optimize_configs():
    for path in CONFIG_PATHS:
        if not os.path.exists(path):
            print(f"Skipping missing config: {path}")
            continue
            
        try:
            with open(path, 'r') as f:
                config = json.load(f)
            
            # Check if it's the personal/antigravity format or global VSCode format
            servers_key = "mcpServers" if "mcpServers" in config else "servers"
            
            if servers_key in config:
                for server_name, tools in DISABLED_TOOLS.items():
                    # Handle naming variations (e.g. supabase-mcp-server vs supabase)
                    target_server = None
                    if server_name in config[servers_key]:
                        target_server = server_name
                    elif "supabase" in server_name and "supabase" in config[servers_key]:
                        target_server = "supabase"
                    
                    if target_server:
                        print(f"Optimizing {target_server} in {os.path.basename(path)}...")
                        config[servers_key][target_server]["disabledTools"] = tools
                
                with open(path, 'w') as f:
                    json.dump(config, f, indent=2)
                print(f"Successfully updated {path}")
        except Exception as e:
            print(f"Error updating {path}: {e}")

if __name__ == "__main__":
    optimize_configs()
    print("\nOptimization Complete. Approximately 50 low-utility tools have been tagged for exclusion.")
