#!/bin/bash

# ======================================================
# Universal MCP Setup: MacOS & Chromebook (Linux)
# Supports: Antigravity, Cursor, Windsurf
# Features: OS Detection, Venv Setup, Legacy Cleanup
# ======================================================

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Universal MCP Setup for Nishant...${NC}"

# 1. Detect OS & Set Paths
OS_TYPE=$(uname)
PROJECT_ROOT=$(pwd)
SERVERS_DIR="$PROJECT_ROOT/servers"
VENV_DIR="$PROJECT_ROOT/.venv"
ARCHIVE_DIR="$PROJECT_ROOT/_legacy_archive"

echo -e "Detected OS: ${YELLOW}$OS_TYPE${NC}"
echo -e "Project Root: ${YELLOW}$PROJECT_ROOT${NC}"

# Define Config Paths based on OS
if [[ "$OS_TYPE" == "Darwin" ]]; then
    # MacOS Paths
    ANTIGRAVITY_CONFIG_DIR="$HOME/Library/Application Support/Google/Antigravity"
    # Antigravity sometimes uses this fallback on Mac
    ANTIGRAVITY_FALLBACK="$HOME/.gemini/antigravity"
    
    CURSOR_CONFIG="$HOME/Library/Application Support/Cursor/User/globalStorage/cursor.mcp/mcp_config.json"
else
    # Linux / Chromebook Paths
    ANTIGRAVITY_CONFIG_DIR="$HOME/.gemini/antigravity"
    CURSOR_CONFIG="$HOME/.config/Cursor/User/globalStorage/cursor.mcp/mcp_config.json"
fi

# 2. CLEANUP LEGACY SERVERS
echo -e "\n${BLUE}Cleaning up legacy servers...${NC}"

if [ ! -d "$ARCHIVE_DIR" ]; then
    mkdir -p "$ARCHIVE_DIR"
fi

# List of old files to move to archive
LEGACY_FILES=(
    "servers/mcp-gemini-wrapper"
    "servers/mcp_gemini_wrapper.py"
    "servers/mcp-resilience-router"
    "servers/mcp-claude-skills"
    "servers/documentation-server.py"
    "servers/configuration-server.py"
    "servers/genkit-server.py"
    "servers/typecheck-server.py"
    ".claude/mcp-servers/documentation-server.py"
)

MOVED_COUNT=0
for file in "${LEGACY_FILES[@]}"; do
    if [ -e "$file" ]; then
        mv "$file" "$ARCHIVE_DIR/"
        echo -e "  Moved to archive: ${YELLOW}$file${NC}"
        ((MOVED_COUNT++))
    fi
done

if [ $MOVED_COUNT -eq 0 ]; then
    echo -e "  ${GREEN}Workspace clean (No legacy files found).${NC}"
else
    echo -e "  ${GREEN}Archived $MOVED_COUNT items to ./_legacy_archive/${NC}"
fi

# 3. Python Environment Setup
echo -e "\n${BLUE}Setting up Python Environment...${NC}"

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: python3 not found.${NC}"
    if [[ "$OS_TYPE" == "Linux" ]]; then
        echo "Run: sudo apt update && sudo apt install python3 python3-venv python3-pip"
    else
        echo "Run: brew install python3"
    fi
    exit 1
fi

# Create Virtual Environment (Critical for Linux/Chromebook)
if [ ! -d "$VENV_DIR" ]; then
    echo -e "Creating .venv..."
    python3 -m venv "$VENV_DIR"
fi

# Select Python Executable from the Venv
VENV_PYTHON="$VENV_DIR/bin/python3"

echo -e "Installing dependencies..."
"$VENV_PYTHON" -m pip install --upgrade pip --quiet
"$VENV_PYTHON" -m pip install google-generativeai --quiet

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed in .venv${NC}"
else
    echo -e "${RED}Warning: Failed to install dependencies.${NC}"
fi

# 4. Generate Server Files (Flash Sidekick)
if [ ! -d "$SERVERS_DIR" ]; then mkdir -p "$SERVERS_DIR"; fi

echo -e "\n${BLUE}Generating Flash Sidekick...${NC}"
cat << 'EOF' > "$SERVERS_DIR/flash_sidekick.py"
#!/usr/bin/env python3
"""
MCP Flash Sidekick - High-Speed Utility Agent
"""
import json, os, sys, logging
from typing import Dict, Any

# Log to temp to avoid permission issues
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [Sidekick] - %(levelname)s - %(message)s',
    handlers=[logging.FileHandler('/tmp/mcp-flash-sidekick.log'), logging.StreamHandler(sys.stderr)]
)
logger = logging.getLogger("FlashSidekick")

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

class FlashSidekickServer:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        # Using 1.5 Flash as standard workhorse
        self.model_name = os.getenv("GEMINI_MODEL", "models/gemini-1.5-flash")
        self.initialized = False
        self.model = None

        if GENAI_AVAILABLE and self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel(self.model_name)
                self.initialized = True
            except Exception as e:
                logger.error(f"Init failed: {e}")

    def _call_flash(self, prompt, sys_instruct=""):
        if not self.initialized: return {"content": "Error: API Key missing or invalid."}
        try:
            full = f"System: {sys_instruct}\n\nUser: {prompt}"
            resp = self.model.generate_content(full)
            return {"content": resp.text if resp else "No response."}
        except Exception as e:
            return {"content": f"Error: {str(e)}"}

    def list_tools(self):
        return [
            {
                "name": "quick_summarize",
                "description": "Summarize text using Gemini Flash.",
                "inputSchema": {"type": "object", "properties": {"text": {"type": "string"}}, "required": ["text"]}
            },
            {
                "name": "generate_idf",
                "description": "Generate Python IDF to save tokens.",
                "inputSchema": {"type": "object", "properties": {"code": {"type": "string"}}, "required": ["code"]}
            }
        ]

    def call_tool(self, name, args):
        if name == "quick_summarize":
            res = self._call_flash(args.get("text",""), "Summarize concisely.")
            return [{"type": "text", "text": res["content"]}]
        elif name == "generate_idf":
            res = self._call_flash(args.get("code",""), "Extract Python signatures/docstrings only. Replace bodies with ...")
            return [{"type": "text", "text": res["content"]}]
        return []

def handle_request(server, line):
    try:
        req = json.loads(line)
        if req.get("method") == "tools/list":
            return {"result": {"tools": server.list_tools()}}
        elif req.get("method") == "tools/call":
            res = server.call_tool(req["params"]["name"], req["params"]["arguments"])
            return {"result": {"content": res}}
        elif req.get("method") == "initialize":
            return {"result": {"protocolVersion": "0.1.0", "capabilities": {"tools": {}}, "serverInfo": {"name": "sidekick", "version": "1.0"}}}
        return {}
    except Exception:
        return {}

if __name__ == "__main__":
    server = FlashSidekickServer()
    while True:
        try:
            line = sys.stdin.readline()
            if not line: break
            resp = handle_request(server, line)
            if resp: 
                print(json.dumps(resp))
                sys.stdout.flush()
        except: break
EOF
chmod +x "$SERVERS_DIR/flash_sidekick.py"

# 5. Generate JSON Content (Dynamic Paths)
# Note: We inject the VENV_PYTHON path so Linux executes correctly
MCP_JSON_CONTENT=$(cat <<EOF
{
  "mcpServers": {
    "flash-sidekick": {
      "command": "$VENV_PYTHON",
      "args": ["$SERVERS_DIR/flash_sidekick.py"],
      "env": {
        "GEMINI_API_KEY": "\${GEMINI_API_KEY}",
        "GEMINI_MODEL": "gemini-1.5-flash"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "\${GITHUB_TOKEN}" }
    },
    "perplexity": {
      "command": "npx",
      "args": ["-y", "@angrych/perplexity-mcp"],
      "env": { "PERPLEXITY_API_KEY": "\${PERPLEXITY_API_KEY}" }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/careercopilot"]
    }
  }
}
EOF
)

# 6. Apply Configurations

# Function to write config safely
write_config() {
    local path="$1"
    local dir=$(dirname "$path")
    if [ ! -d "$dir" ]; then mkdir -p "$dir"; fi
    echo "$MCP_JSON_CONTENT" > "$path"
    echo -e "${GREEN}✓ Updated:${NC} $path"
}

echo -e "\n${BLUE}Applying Configs...${NC}"

# Update Antigravity (Try standard path first, then fallback)
if [ -d "$ANTIGRAVITY_CONFIG_DIR" ] || [[ "$OS_TYPE" == "Linux" ]]; then
    write_config "$ANTIGRAVITY_CONFIG_DIR/mcp_config.json"
elif [ -d "$HOME/.gemini/antigravity" ]; then
    write_config "$HOME/.gemini/antigravity/mcp_config.json"
fi

# Update Cursor (If installed)
if [ -d "$(dirname "$CURSOR_CONFIG")" ]; then
    write_config "$CURSOR_CONFIG"
else
    echo -e "${YELLOW}Cursor config folder not found (skipped).${NC}"
fi

# Create local manifest (Portable)
cat << EOF > "$PROJECT_ROOT/mcp.json"
{
  "name": "careercopilot-tools",
  "version": "1.0.0",
  "servers": {
    "flash-sidekick": {
      "command": "$VENV_PYTHON",
      "args": ["servers/flash_sidekick.py"],
      "env": { "GEMINI_MODEL": "gemini-1.5-flash" }
    }
  }
}
EOF
echo -e "${GREEN}✓ Created portable mcp.json${NC}"

echo -e "\n${BLUE}======================================${NC}"
echo -e "Setup Complete!"
echo -e "1. Restart Antigravity."
echo -e "2. Ensure API Keys are in your .env or ~/.bashrc"
echo -e "3. Verify 'flash-sidekick' in the Agent Manager."
echo -e "${BLUE}======================================${NC}"
