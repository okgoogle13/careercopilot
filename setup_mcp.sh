#!/bin/bash

# ======================================================
# CareerCopilot: Universal MCP Setup (Sync)
# Machines: Chromebook (Linux) & iMac (MacOS)
# Features: Dual-Engine Sidekick + Playwright + Docker + GitHub
# ======================================================

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Syncing CareerCopilot Environment for Nishant...${NC}"

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
    # --- MAC OS CONFIGURATION ---
    ANTIGRAVITY_CONFIG_DIR="$HOME/Library/Application Support/Google/Antigravity"
    ANTIGRAVITY_FALLBACK="$HOME/.gemini/antigravity"
    CURSOR_CONFIG="$HOME/Library/Application Support/Cursor/User/globalStorage/cursor.mcp/mcp_config.json"
    
    if ! command -v brew &> /dev/null; then
        echo -e "${YELLOW}Warning: Homebrew not found. Ensure python3/node are installed.${NC}"
    fi
else
    # --- LINUX / CHROMEBOOK CONFIGURATION ---
    ANTIGRAVITY_CONFIG_DIR="$HOME/.gemini/antigravity"
    CURSOR_CONFIG="$HOME/.config/Cursor/User/globalStorage/cursor.mcp/mcp_config.json"
fi

# 2. CLEANUP LEGACY SERVERS
echo -e "\n${BLUE}Cleaning up legacy files...${NC}"
if [ ! -d "$ARCHIVE_DIR" ]; then mkdir -p "$ARCHIVE_DIR"; fi

LEGACY_FILES=(
    "servers/mcp-gemini-wrapper" "servers/mcp_gemini_wrapper.py"
    "servers/mcp-resilience-router" "servers/mcp-claude-skills"
    "servers/documentation-server.py" "servers/configuration-server.py"
    "servers/genkit-server.py" "servers/typecheck-server.py"
    ".claude/mcp-servers/documentation-server.py"
)

for file in "${LEGACY_FILES[@]}"; do
    if [ -e "$file" ]; then
        mv "$file" "$ARCHIVE_DIR/"
        echo -e "  Archived: ${YELLOW}$file${NC}"
    fi
done

# 3. PYTHON ENVIRONMENT (VENV)
echo -e "\n${BLUE}Syncing Python Environment...${NC}"

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: python3 not found.${NC}"
    exit 1
fi

if [ ! -d "$VENV_DIR" ]; then
    echo -e "Creating .venv..."
    python3 -m venv "$VENV_DIR"
fi

# Select Python Executable
VENV_PYTHON="$VENV_DIR/bin/python3"

echo -e "Installing dependencies..."
"$VENV_PYTHON" -m pip install --upgrade pip --quiet
"$VENV_PYTHON" -m pip install google-generativeai --quiet

# 4. GENERATE SERVER CODE (Dual-Engine Logic)
if [ ! -d "$SERVERS_DIR" ]; then mkdir -p "$SERVERS_DIR"; fi

echo -e "\n${BLUE}Generating Flash Sidekick (Dual-Engine)...${NC}"
cat << 'EOF' > "$SERVERS_DIR/flash_sidekick.py"
#!/usr/bin/env python3
"""
MCP Flash Sidekick - Dual-Engine Utility Agent
Capabilities:
1. Fast Engine (Flash-Lite 2.5): Summarization, IDFs.
2. Smart Engine (Pro 2.5): Complex reasoning.
"""
import json, os, sys, logging
from typing import Dict, Any

# Log to tmp to avoid permission issues
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
        self.initialized = False
        
        # Fast Engine Candidates (Priority: Flash-Lite 2.5)
        env_fast = os.getenv("GEMINI_MODEL")
        self.fast_candidates = ["models/gemini-2.5-flash-lite", "models/gemini-1.5-flash", "models/gemini-1.5-flash-002"]
        if env_fast and env_fast not in self.fast_candidates: self.fast_candidates.insert(0, env_fast)
            
        # Smart Engine Candidates (Priority: Pro 2.5)
        env_pro = os.getenv("GEMINI_PRO_MODEL")
        self.pro_candidates = ["models/gemini-2.5-pro", "models/gemini-exp-1206", "models/gemini-1.5-pro"]
        if env_pro and env_pro not in self.pro_candidates: self.pro_candidates.insert(0, env_pro)

        if GENAI_AVAILABLE and self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.initialized = True
            except Exception as e:
                logger.error(f"Init failed: {e}")

    def _get_working_model(self, candidates):
        for model_name in candidates:
            try:
                # Basic instantiation check
                model = genai.GenerativeModel(model_name)
                return model, model_name
            except: continue
        return None, None

    def _call_model(self, engine_type, prompt, sys_instruct=""):
        if not self.initialized: return {"content": "Error: API Key missing."}
        
        candidates = self.pro_candidates if engine_type == "pro" else self.fast_candidates
        model, model_name = self._get_working_model(candidates)
        
        if not model: return {"content": f"Error: No {engine_type} models available."}

        try:
            full = f"System: {sys_instruct}\n\nUser: {prompt}"
            resp = model.generate_content(full)
            return {"content": resp.text if resp else "No response."}
        except Exception as e:
            return {"content": f"Error: {str(e)}"}

    def list_tools(self):
        return [
            {
                "name": "quick_summarize",
                "description": "Fast/Cheap: Summarize text using Gemini Flash-Lite.",
                "inputSchema": {"type": "object", "properties": {"text": {"type": "string"}}, "required": ["text"]}
            },
            {
                "name": "generate_idf",
                "description": "Fast/Cheap: Generate Python IDF.",
                "inputSchema": {"type": "object", "properties": {"code": {"type": "string"}}, "required": ["code"]}
            },
            {
                "name": "consult_pro",
                "description": "Slow/Smart: Ask Gemini 2.5 Pro for deep reasoning.",
                "inputSchema": {"type": "object", "properties": {"query": {"type": "string"}, "context": {"type": "string"}}, "required": ["query"]}
            }
        ]

    def call_tool(self, name, args):
        if name == "quick_summarize":
            res = self._call_model("fast", args.get("text",""), "Summarize concisely.")
        elif name == "generate_idf":
            res = self._call_model("fast", args.get("code",""), "Extract signatures only.")
        elif name == "consult_pro":
            res = self._call_model("pro", args.get("query",""), f"Context: {args.get('context','')}. Analyze deeply.")
        else: return []
        return [{"type": "text", "text": res.get("content", "")}]

def handle_request(server, line):
    try:
        req = json.loads(line)
        if req.get("method") == "tools/list":
            return {"result": {"tools": server.list_tools()}}
        elif req.get("method") == "tools/call":
            res = server.call_tool(req["params"]["name"], req["params"]["arguments"])
            return {"result": {"content": res}}
        elif req.get("method") == "initialize":
            return {"result": {"protocolVersion": "0.1.0", "capabilities": {"tools": {}}, "serverInfo": {"name": "sidekick", "version": "2.5"}}}
        return {}
    except: return {}

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

# 5. GENERATE JSON CONFIG CONTENT
# Includes Flash-Sidekick, GitHub, Playwright, and Docker
MCP_JSON_CONTENT=$(cat <<EOF
{
  "mcpServers": {
    "flash-sidekick": {
      "command": "$VENV_PYTHON",
      "args": ["$SERVERS_DIR/flash_sidekick.py"],
      "env": {
        "GEMINI_API_KEY": "\${GEMINI_API_KEY}",
        "GEMINI_MODEL": "models/gemini-2.5-flash-lite",
        "GEMINI_PRO_MODEL": "models/gemini-2.5-pro"
      },
      "description": "Dual-Engine Assistant (Fast/Smart)"
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "\${GITHUB_TOKEN}" },
      "description": "Git repository management"
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"],
      "env": {},
      "description": "Browser automation (Visual testing)"
    },
    "docker": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-docker"],
      "env": {},
      "description": "Container management"
    }
  }
}
EOF
)

# 6. APPLY CONFIGURATIONS TO IDEs

# Helper function
write_config() {
    local path="$1"
    local dir=$(dirname "$path")
    if [ ! -d "$dir" ]; then mkdir -p "$dir"; fi
    echo "$MCP_JSON_CONTENT" > "$path"
    echo -e "${GREEN}✓ Updated:${NC} $path"
}

echo -e "\n${BLUE}Applying Configs...${NC}"

# Antigravity Logic (Mac vs Linux)
if [ -d "$ANTIGRAVITY_CONFIG_DIR" ] || [[ "$OS_TYPE" == "Linux" ]]; then
    write_config "$ANTIGRAVITY_CONFIG_DIR/mcp_config.json"
elif [ -d "$ANTIGRAVITY_FALLBACK" ]; then
    write_config "$ANTIGRAVITY_FALLBACK/mcp_config.json"
fi

# Cursor Logic
if [ -d "$(dirname "$CURSOR_CONFIG")" ]; then
    write_config "$CURSOR_CONFIG"
else
    echo -e "${YELLOW}Cursor config not found (Skipped).${NC}"
fi

# 7. GENERATE PORTABLE MANIFEST (For repo tracking)
cat << EOF > "$PROJECT_ROOT/mcp.json"
{
  "name": "careercopilot-tools",
  "version": "1.3.0",
  "servers": {
    "flash-sidekick": {
      "command": ".venv/bin/python3",
      "args": ["servers/flash_sidekick.py"],
      "env": { 
        "GEMINI_MODEL": "models/gemini-2.5-flash-lite",
        "GEMINI_PRO_MODEL": "models/gemini-2.5-pro" 
      }
    }
  }
}
EOF
echo -e "${GREEN}✓ Created portable mcp.json${NC}"

echo -e "\n${BLUE}======================================${NC}"
echo -e "Setup Complete for $OS_TYPE"
echo -e "${BLUE}======================================${NC}"
echo -e "1. Restart Antigravity."
echo -e "2. Ensure API Keys (GEMINI/GITHUB) are in your env."
echo -e "3. Playwright/Docker tools are now registered."
