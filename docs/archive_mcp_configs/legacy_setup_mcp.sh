#!/bin/bash

# ======================================================
# CareerCopilot: Complete MCP Setup
# Stack: Dual-Engine Sidekick + Cloud Ops (Budget Aware) + Docker
# ======================================================

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}Syncing CareerCopilot Environment for Nishant...${NC}"

# 1. PATHS & OS DETECTION
OS_TYPE=$(uname)
PROJECT_ROOT=$(pwd)
SERVERS_DIR="$PROJECT_ROOT/servers"
VENV_DIR="$PROJECT_ROOT/.venv"
ARCHIVE_DIR="$PROJECT_ROOT/_legacy_archive"

echo -e "Detected OS: ${YELLOW}$OS_TYPE${NC}"

if [[ "$OS_TYPE" == "Darwin" ]]; then
    # MacOS Configuration
    ANTIGRAVITY_CONFIG_DIR="$HOME/Library/Application Support/Google/Antigravity"
    ANTIGRAVITY_FALLBACK="$HOME/.gemini/antigravity"
    CURSOR_CONFIG="$HOME/Library/Application Support/Cursor/User/globalStorage/cursor.mcp/mcp_config.json"
else
    # Linux Configuration
    ANTIGRAVITY_CONFIG_DIR="$HOME/.gemini/antigravity"
    CURSOR_CONFIG="$HOME/.config/Cursor/User/globalStorage/cursor.mcp/mcp_config.json"
fi

# 2. PREREQUISITE CHECK (GCLOUD & NODE)
echo -e "\n${BLUE}Checking Cloud Tools...${NC}"
if ! command -v gcloud &> /dev/null; then
    echo -e "${YELLOW}Warning: 'gcloud' CLI not found. Required for Cloud Ops.${NC}"
fi
if ! command -v npx &> /dev/null; then
    echo -e "${RED}Error: Node.js/npx not found. Required for Firebase.${NC}"
    exit 1
fi

# 3. CLEANUP LEGACY
if [ ! -d "$ARCHIVE_DIR" ]; then mkdir -p "$ARCHIVE_DIR"; fi
if [ -d "servers" ] && [ "$(ls -A servers)" ]; then
    echo -e "  Verifying server directory..."
fi

# 4. PYTHON ENVIRONMENT
echo -e "\n${BLUE}Configuring Python Environment...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: python3 not found.${NC}"
    exit 1
fi

if [ ! -d "$VENV_DIR" ]; then
    python3 -m venv "$VENV_DIR"
    echo -e "  Created .venv"
fi

VENV_PYTHON="$VENV_DIR/bin/python3"

echo -e "Installing dependencies..."
"$VENV_PYTHON" -m pip install --upgrade pip --quiet
"$VENV_PYTHON" -m pip install google-generativeai --quiet

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed.${NC}"
else
    echo -e "${RED}Warning: Dependency install failed.${NC}"
fi

if [ ! -d "$SERVERS_DIR" ]; then mkdir -p "$SERVERS_DIR"; fi

# 5. GENERATE FLASH SIDEKICK (Optimized with Lazy Loading for Antigravity)
echo -e "\n${BLUE}Generating Flash Sidekick (Universal-Fast)...${NC}"
cat << 'EOF' > "$SERVERS_DIR/flash_sidekick.py"
#!/usr/bin/env python3
"""
MCP Flash Sidekick - Dual-Engine Utility Agent
Optimized for high-speed startup to avoid Antigravity timeouts.
"""
import warnings
warnings.filterwarnings("ignore")

import json, os, sys, logging
from typing import Dict, Any

# Log to tmp to avoid permission issues
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [Sidekick] - %(levelname)s - %(message)s',
    handlers=[logging.FileHandler('/tmp/mcp-flash-sidekick.log')]
)
logger = logging.getLogger("FlashSidekick")

# Lazy Loading Infrastructure
_genai = None
_genai_loaded = False

def _load_genai():
    global _genai, _genai_loaded
    if not _genai_loaded:
        try:
            import contextlib, io
            with contextlib.redirect_stderr(io.StringIO()):
                import google.generativeai as genai_module
            _genai = genai_module
            _genai_loaded = True
        except Exception as e:
            logger.error(f"Failed to load genai: {e}")
            _genai_loaded = True
    return _genai

class FlashSidekickServer:
    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY", "")
        self.initialized = False
        self._models_cache = {}
        
        # Fast Engine Candidates
        env_fast = os.getenv("GEMINI_MODEL")
        self.fast_candidates = ["models/gemini-2.5-flash-lite", "models/gemini-1.5-flash"]
        if env_fast and env_fast not in self.fast_candidates: self.fast_candidates.insert(0, env_fast)
            
        # Smart Engine Candidates
        env_pro = os.getenv("GEMINI_PRO_MODEL")
        self.pro_candidates = ["models/gemini-2.5-pro", "models/gemini-exp-1206", "models/gemini-1.5-pro"]
        if env_pro and env_pro not in self.pro_candidates: self.pro_candidates.insert(0, env_pro)

    def _ensure_genai(self):
        genai = _load_genai()
        if not self.initialized and genai and self.gemini_key:
            try:
                genai.configure(api_key=self.gemini_key)
                self.initialized = True
            except Exception as e:
                logger.error(f"Config failed: {e}")
        return genai

    def _get_model(self, candidates):
        genai = self._ensure_genai()
        if not genai: return None
        for name in candidates:
            if name in self._models_cache: return self._models_cache[name]
            try:
                model = genai.GenerativeModel(name)
                self._models_cache[name] = model
                return model
            except: continue
        return None

    def _call_gemini(self, engine_type, prompt, sys_instruct=""):
        model = self._get_model(self.pro_candidates if engine_type == "pro" else self.fast_candidates)
        if not model: return {"content": "Error: Model unavailable."}
        try:
            full = f"System: {sys_instruct}\n\nUser: {prompt}"
            resp = model.generate_content(full)
            return {"content": resp.text if resp else "No response."}
        except Exception as e: return {"content": f"Error: {str(e)}"}

    def list_tools(self):
        return [
            {"name": "quick_summarize", "description": "Fast (Flash-Lite): Summarize text.", "inputSchema": {"type": "object", "properties": {"text": {"type": "string"}}, "required": ["text"]}},
            {"name": "generate_idf", "description": "Fast (Flash-Lite): Generate Python IDF.", "inputSchema": {"type": "object", "properties": {"code": {"type": "string"}}, "required": ["code"]}},
            {"name": "consult_pro", "description": "Smart (Pro 2.5): Deep reasoning/coding.", "inputSchema": {"type": "object", "properties": {"query": {"type": "string"}, "context": {"type": "string"}}, "required": ["query"]}}
        ]

    def call_tool(self, name, args):
        if name == "quick_summarize": res = self._call_gemini("fast", args.get("text",""), "Summarize concisely.")
        elif name == "generate_idf": res = self._call_gemini("fast", args.get("code",""), "Extract signatures only.")
        elif name == "consult_pro": res = self._call_gemini("pro", args.get("query",""), f"Context: {args.get('context','')}. Analyze deeply as a Senior Engineer.")
        else: return []
        return [{"type": "text", "text": res.get("content", "")}]

def handle_request(server, line):
    try:
        req = json.loads(line)
        method = req.get("method")
        req_id = req.get("id")
        
        # Build JSON-RPC 2.0 response
        resp = {"jsonrpc": "2.0", "id": req_id}
        
        if method == "initialize":
            resp["result"] = {
                "protocolVersion": "2024-11-05",
                "capabilities": {"tools": {}},
                "serverInfo": {"name": "sidekick-dual", "version": "3.1.0"}
            }
        elif method == "tools/list":
            resp["result"] = {"tools": server.list_tools()}
        elif method == "tools/call":
            content = server.call_tool(req["params"]["name"], req["params"]["arguments"])
            resp["result"] = {"content": content}
        else:
            return None
            
        return resp
    except Exception as e:
        logger.error(f"Error: {e}")
        return None

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

# 6. GENERATE CLOUD OPS SERVER (Budget Aware)
echo -e "\n${BLUE}Generating Cloud Ops Server (Budget Aware)...${NC}"
cat << 'EOF' > "$SERVERS_DIR/cloud_ops.py"
#!/usr/bin/env python3
"""
MCP Cloud Ops - Budget Aware
"""
import json, sys, subprocess, logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [CloudOps] - %(message)s',
    handlers=[logging.FileHandler('/tmp/mcp-cloud-ops.log')]
)
logger = logging.getLogger("CloudOps")

class CloudOpsServer:
    def _run_cmd(self, cmd):
        try:
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode != 0: return f"Error: {result.stderr.strip()}"
            try: return json.loads(result.stdout)
            except: return result.stdout.strip()
        except Exception as e: return f"Error: {str(e)}"

    def check_auth(self):
        auth = self._run_cmd(["gcloud", "auth", "list", "--format=json"])
        project = self._run_cmd(["gcloud", "config", "get-value", "project"])
        return {"status": "success", "active_project": project}

    def configure_budget_cap(self, amount_usd=2.00):
        project_id = self._run_cmd(["gcloud", "config", "get-value", "project"])
        billing_info = self._run_cmd(["gcloud", "beta", "billing", "projects", "describe", str(project_id), "--format=json"])
        if isinstance(billing_info, str) and "Error" in billing_info: return billing_info
        acc_id = billing_info.get("billingAccountName", "").split("/")[-1]
        cmd = ["gcloud", "billing", "budgets", "create", "--billing-account", acc_id, "--display-name", f"Safety Cap - {project_id}", "--budget-amount", f"{amount_usd}USD", "--threshold-rule", "percent=1.0"]
        return self._run_cmd(cmd)

    def deploy_service(self, service_name, region="us-central1"):
        cmd = ["gcloud", "run", "deploy", service_name, "--source", ".", "--region", region, "--min-instances", "0"]
        return self._run_cmd(cmd)

    def firebase_deploy_hosting(self):
        """Deploy only hosting assets via firebase-tools."""
        return self._run_cmd(["npx", "firebase-tools", "deploy", "--only", "hosting", "--json"])

    def list_tools(self):
        return [
            {"name": "cloud_check_auth", "description": "Check GCP and Firebase Auth status.", "inputSchema": {"type": "object"}},
            {"name": "configure_budget_cap", "description": "Set safety budget for GCP.", "inputSchema": {"type": "object", "properties": {"amount_usd": {"type": "number"}}}},
            {"name": "deploy_service", "description": "Deploy to Cloud Run (Scale-to-Zero).", "inputSchema": {"type": "object", "properties": {"service_name": {"type": "string"}}, "required": ["service_name"]}},
            {"name": "firebase_deploy_hosting", "description": "Deploy Firebase Hosting assets.", "inputSchema": {"type": "object"}}
        ]

    def call_tool(self, name, args):
        if name == "cloud_check_auth": return [{"type": "text", "text": str(self.check_auth())}]
        elif name == "configure_budget_cap": return [{"type": "text", "text": str(self.configure_budget_cap(args.get("amount_usd", 2.00)))}]
        elif name == "deploy_service": return [{"type": "text", "text": str(self.deploy_service(args.get("service_name")))}]
        elif name == "firebase_deploy_hosting": return [{"type": "text", "text": str(self.firebase_deploy_hosting())}]
        return []

def handle_request(server, line):
    try:
        req = json.loads(line)
        method = req.get("method")
        req_id = req.get("id")
        
        resp = {"jsonrpc": "2.0", "id": req_id}
        
        if method == "initialize":
            resp["result"] = {
                "protocolVersion": "2024-11-05",
                "capabilities": {"tools": {}},
                "serverInfo": {"name": "cloud-ops", "version": "1.3.0"}
            }
        elif method == "tools/list":
            resp["result"] = {"tools": server.list_tools()}
        elif method == "tools/call":
            resp["result"] = {"content": server.call_tool(req["params"]["name"], req["params"]["arguments"])}
        else:
            return None
            
        return resp
    except: return None

if __name__ == "__main__":
    server = CloudOpsServer()
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
chmod +x "$SERVERS_DIR/cloud_ops.py"

# 7. GENERATE CONFIGURATION CONTENT
MCP_JSON_CONTENT=$(cat <<EOF
{
  "mcpServers": {
    "flash-sidekick": {
      "command": "$VENV_PYTHON",
      "args": ["$SERVERS_DIR/flash_sidekick.py"],
      "env": {
        "GEMINI_API_KEY": "${GEMINI_API_KEY}",
        "GEMINI_MODEL": "models/gemini-2.5-flash-lite",
        "GEMINI_PRO_MODEL": "models/gemini-2.5-pro"
      },
      "description": "Dual-Engine Assistant (Fast/Smart)."
    },
    "cloud-ops": {
      "command": "$VENV_PYTHON",
      "args": ["$SERVERS_DIR/cloud_ops.py"],
      "env": {},
      "description": "Cost-Optimized Cloud Deployment (Budget Aware)."
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "\${GITHUB_TOKEN}" },
      "description": "Git repository management."
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"],
      "env": {},
      "description": "Browser automation for testing web apps."
    },
    "docker": {
      "command": "npx",
      "args": ["-y", "mcp-server-docker"],
      "env": {},
      "description": "Manage Docker containers and images."
    }
  }
}
EOF
)

# 8. APPLY CONFIGURATIONS (with Error Filtering wrapper)
echo -e "\n${BLUE}Applying Configs...${NC}"

# Create Wrapper script to filter stdout/stderr for Antigravity health
cat << 'EOF' > "$SERVERS_DIR/antigravity_mcp_wrapper.sh"
#!/bin/bash
# Filters out package warnings that break JSON parsing
exec 2>/dev/null
"$@" | grep -v "^An error occurred:"
EOF
chmod +x "$SERVERS_DIR/antigravity_mcp_wrapper.sh"

# Note: In the final mcp_config.json we use the direct python script 
# as our generated flash_sidekick.py now core-suppresses warnings.

write_config() {
    local path="$1"
    local dir=$(dirname "$path")
    if [ ! -d "$dir" ]; then mkdir -p "$dir"; fi
    echo "$MCP_JSON_CONTENT" > "$path"
    echo -e "${GREEN}✓ Updated:${NC} $path"
}

if [ -d "$ANTIGRAVITY_CONFIG_DIR" ] || [[ "$OS_TYPE" == "Linux" ]]; then
    write_config "$ANTIGRAVITY_CONFIG_DIR/mcp_config.json"
elif [ -d "$ANTIGRAVITY_FALLBACK" ]; then
    write_config "$ANTIGRAVITY_FALLBACK/mcp_config.json"
fi

echo -e "\n${BLUE}======================================${NC}"
echo -e "Setup Complete for $OS_TYPE"
echo -e "${BLUE}======================================${NC}"
echo -e "1. Restart Antigravity."
echo -e "2. IMPORTANT: Run 'gcloud auth login'."
