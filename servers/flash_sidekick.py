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

    def _load_project_rules(self):
        """Standardization: Try to load AI_RULES.md from docs"""
        rules_path = os.path.join(os.getcwd(), 'docs', 'AI_RULES.md')
        if os.path.exists(rules_path):
            try:
                with open(rules_path, 'r') as f:
                    return f"\n\n=== PROJECT RULES (from docs/AI_RULES.md) ===\n{f.read()}\n============================================\n"
            except:
                return ""
        return ""

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
            {"name": "quick_summarize", "description": "Token-saver: Use for long inputs, bulk summarization, or routine transforms. Avoid for creative design or code review (keep in Claude).", "inputSchema": {"type": "object", "properties": {"text": {"type": "string"}}, "required": ["text"]}},
            {"name": "generate_idf", "description": "Token-saver: Use for code extraction/IDF generation on large files. Avoid for creative design or code review (keep in Claude).", "inputSchema": {"type": "object", "properties": {"code": {"type": "string"}}, "required": ["code"]}},
            {"name": "consult_pro", "description": "Gemini 3 Pro: Use for large/complex tasks to preserve Claude tokens. Avoid for creative design or code review (keep in Claude).", "inputSchema": {"type": "object", "properties": {"query": {"type": "string"}, "context": {"type": "string"}}, "required": ["query"]}}
        ]

    def call_tool(self, name, args):
        rules = self._load_project_rules()
        if name == "quick_summarize": res = self._call_gemini("fast", args.get("text",""), f"Summarize concisely.{rules}")
        elif name == "generate_idf": res = self._call_gemini("fast", args.get("code",""), f"Extract signatures only.") # Keep IDF strict/clean
        elif name == "consult_pro": res = self._call_gemini("pro", args.get("query",""), f"Context: {args.get('context','')}. Analyze deeply as a Senior Engineer.{rules}")
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
        logger.error(f"Error handling request: {e}", exc_info=True)
        sys.stderr.write(f"Server Error: {e}\n")
        return None

if __name__ == "__main__":
    # Server starting
    server = FlashSidekickServer()
    while True:
        try:
            line = sys.stdin.readline()
            if not line: break
            
            resp = handle_request(server, line)
            if resp: 
                print(json.dumps(resp))
                sys.stdout.flush()
            else:
                pass
        except KeyboardInterrupt:
            break
        except Exception as e:
            sys.stderr.write(f"Fatal Loop Error: {e}\n")
            break
