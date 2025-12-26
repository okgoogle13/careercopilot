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
