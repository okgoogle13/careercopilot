#!/bin/bash
# ======================================================
# CareerCopilot: Chromebook Fresh Start (Dual-Engine)
# Optimized for: Google Antigravity on Linux (Debian)
# Features: Clean Archive, Venv, Dual-Engine, Full MCP
# ======================================================

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}Initiating CareerCopilot Fresh Start for Nishant...${NC}"

# 1. PATH DEFINITIONS
PROJECT_ROOT=$(pwd)
SERVERS_DIR="$PROJECT_ROOT/servers"
VENV_DIR="$PROJECT_ROOT/.venv"
ARCHIVE_DIR="$PROJECT_ROOT/_legacy_archive_$(date +%Y%m%d_%H%M%S)"
ANTIGRAVITY_CONFIG_DIR="$HOME/.gemini/antigravity"

echo -e "Project Root: ${YELLOW}$PROJECT_ROOT${NC}"

# 2. SYSTEM DEPENDENCIES (Chromebook/Debian specific)
echo -e "\n${BLUE}Checking System Dependencies...${NC}"

# Ensure Python and venv exist
if ! dpkg -s python3-venv >/dev/null 2>&1; then
    echo -e "${YELLOW}Installing python3-venv...${NC}"
    sudo apt-get update && sudo apt-get install -y python3-venv python3-pip
fi

# Ensure Node/NPM exists (for GitHub/Playwright/Docker MCPs)
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Node.js is missing. Please install Node (v18+) for MCP tools.${NC}"
    echo "Run: sudo apt install nodejs npm"
    exit 1
fi

# 3. CLEANUP & ARCHIVE
echo -e "\n${BLUE}Archiving old configuration...${NC}"
mkdir -p "$ARCHIVE_DIR"

# Move old server files if they exist to clear the path
if [ -d "servers" ]; then
    # Only move if not empty
    if [ "$(ls -A servers)" ]; then
        cp -r servers/* "$ARCHIVE_DIR/" 2>/dev/null
        rm -rf servers/*
        echo -e "  Cleaned ${YELLOW}servers/${NC} directory."
    fi
fi

# Move old manifest if exists
if [ -f "mcp.json" ]; then
    mv mcp.json "$ARCHIVE_DIR/"
    echo -e "  Archived ${YELLOW}mcp.json${NC}."
fi

# 4. PYTHON VIRTUAL ENVIRONMENT
echo -e "\n${BLUE}Configuring Python Environment...${NC}"
if [ ! -d "$VENV_DIR" ]; then
    python3 -m venv "$VENV_DIR"
    echo -e "  Created .venv"
fi

# Path to the isolated python executable
VENV_PYTHON="$VENV_DIR/bin/python3"

# Install Sidekick dependencies
"$VENV_PYTHON" -m pip install --upgrade pip --quiet
"$VENV_PYTHON" -m pip install google-generativeai --quiet

echo -e "${GREEN}✓ Python environment ready.${NC}"

# 5. GENERATE FLASH SIDEKICK (Dual-Engine)
echo -e "\n${BLUE}Generating Flash Sidekick (Dual-Engine)...${NC}"
mkdir -p "$SERVERS_DIR"

cat << 'EOF' > "$SERVERS_DIR/flash_sidekick.py"
#!/usr/bin/env python3
"""
MCP Flash Sidekick - Dual-Engine Utility Agent
----------------------------------------------
Designed for Google Antigravity.
1. Fast Engine (Flash-Lite): Summarization, IDFs.
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
        
        # Fast Engine Candidates (Priority: Flash-Lite)
        env_fast = os.getenv("GEMINI_MODEL")
        self.fast_candidates = ["models/gemini-2.5-flash-lite", "models/gemini-1.5-flash"]
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

# 6. GENERATE ANTIGRAVITY CONFIG (The "Killer Feature" Setup)
# We inject Docker, Playwright, and GitHub directly here.
echo -e "\n${BLUE}Configuring Antigravity MCP...${NC}"

if [ ! -d "$ANTIGRAVITY_CONFIG_DIR" ]; then
    mkdir -p "$ANTIGRAVITY_CONFIG_DIR"
fi

cat << EOF > "$ANTIGRAVITY_CONFIG_DIR/mcp_config.json"
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
      "description": "Dual-Engine Assistant (Fast/Smart)."
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "\${GITHUB_TOKEN}" },
      "description": "Git repository management."
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"],
      "env": {},
      "description": "Browser automation for testing web apps."
    },
    "docker": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-docker"],
      "env": {},
      "description": "Manage Docker containers and images."
    }
  }
}
EOF

# 7. GENERATE PORTABLE MANIFEST
cat << EOF > "$PROJECT_ROOT/mcp.json"
{
  "name": "careercopilot-tools",
  "version": "2.0.0",
  "runtime": "python",
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

echo -e "\n${GREEN}======================================${NC}"
echo -e "${GREEN}Fresh Start Complete!${NC}"
echo -e "${GREEN}======================================${NC}"
echo -e "1. Restart Antigravity."
echo -e "2. Ensure GEMINI_API_KEY and GITHUB_TOKEN are in your ~/.bashrc"
echo -e "3. Playwright/Docker servers will install on first run."
