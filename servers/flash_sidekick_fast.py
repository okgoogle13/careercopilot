#!/usr/bin/env python3
"""
MCP Flash Sidekick - Ultra-Fast Startup Version
Lazy loads all dependencies to respond to initialize within milliseconds
"""
# CRITICAL: Suppress warnings BEFORE any imports
import warnings
warnings.filterwarnings("ignore")

import json
import os
import sys
import logging

# Minimal logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [Sidekick] - %(message)s',
    handlers=[logging.FileHandler('/tmp/mcp-flash-sidekick.log')]
)
logger = logging.getLogger("FlashSidekick")

# Global state for lazy loading
_genai = None
_genai_loaded = False

def _load_genai():
    """Lazy load google.generativeai only when needed"""
    global _genai, _genai_loaded
    if not _genai_loaded:
        try:
            # Suppress stderr during import
            import contextlib
            @contextlib.contextmanager
            def suppress_stderr():
                import os as os_inner
                null_fd = os_inner.open(os_inner.devnull, os_inner.O_RDWR)
                old_stderr = os_inner.dup(2)
                os_inner.dup2(null_fd, 2)
                try:
                    yield
                finally:
                    os_inner.dup2(old_stderr, 2)
                    os_inner.close(null_fd)
                    os_inner.close(old_stderr)
            
            with suppress_stderr():
                import google.generativeai as genai_module
            _genai = genai_module
            _genai_loaded = True
            logger.info("google.generativeai loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load google.generativeai: {e}")
            _genai_loaded = True  # Don't try again
    return _genai

class FlashSidekickServer:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        self._model = None
        self._initialized = False

    def _ensure_model(self):
        """Lazy initialize the model only when first tool is called"""
        if self._model is None and not self._initialized:
            genai = _load_genai()
            if genai and self.api_key:
                try:
                    genai.configure(api_key=self.api_key)
                    self._model = genai.GenerativeModel(self.model_name)
                    self._initialized = True
                    logger.info(f"Model {self.model_name} initialized")
                except Exception as e:
                    logger.error(f"Model init failed: {e}")
                    self._initialized = True  # Don't try again
        return self._model

    def list_tools(self):
        """Return available tools - no API call needed"""
        return [
            {
                "name": "quick_summarize",
                "description": "Token-saver: Use for long inputs, bulk summarization, or routine transforms. Avoid for creative design or code review (keep in Claude).",
                "inputSchema": {
                    "type": "object",
                    "properties": {"text": {"type": "string"}},
                    "required": ["text"]
                }
            },
            {
                "name": "generate_idf",
                "description": "Token-saver: Use for code extraction/IDF generation on large files. Avoid for creative design or code review (keep in Claude).",
                "inputSchema": {
                    "type": "object",
                    "properties": {"code": {"type": "string"}},
                    "required": ["code"]
                }
            }
        ]

    def call_tool(self, name, args):
        """Execute a tool - lazy loads model on first call"""
        model = self._ensure_model()
        
        if not model:
            return [{"type": "text", "text": "Error: API not configured"}]

        try:
            if name == "quick_summarize":
                prompt = f"Summarize concisely:\n\n{args.get('text', '')}"
            elif name == "generate_idf":
                prompt = f"Extract Python signatures and docstrings only. Replace bodies with ...:\n\n{args.get('code', '')}"
            else:
                return [{"type": "text", "text": f"Unknown tool: {name}"}]

            response = model.generate_content(prompt)
            return [{"type": "text", "text": response.text if response else "No response"}]
        except Exception as e:
            logger.error(f"Tool {name} failed: {e}")
            return [{"type": "text", "text": f"Error: {str(e)}"}]

def handle_request(server, line):
    """Handle MCP protocol requests"""
    try:
        req = json.loads(line)
        method = req.get("method")
        req_id = req.get("id")
        
        if method == "initialize":
            # Fast response - no API calls
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {
                    "protocolVersion": "2024-11-05",
                    "capabilities": {"tools": {}},
                    "serverInfo": {"name": "flash-sidekick-fast", "version": "3.0-fast"}
                }
            }
        elif method == "tools/list":
            # Fast response - no API calls
            return {"jsonrpc": "2.0", "id": req_id, "result": {"tools": server.list_tools()}}
        elif method == "tools/call":
            # Lazy loads model on first call
            params = req.get("params", {})
            result = server.call_tool(params.get("name"), params.get("arguments", {}))
            return {"jsonrpc": "2.0", "id": req_id, "result": {"content": result}}
        
        return {}
    except Exception as e:
        logger.error(f"Request handling error: {e}")
        return {}

if __name__ == "__main__":
    logger.info("Flash Sidekick starting (fast mode)")
    server = FlashSidekickServer()
    
    while True:
        try:
            line = sys.stdin.readline()
            if not line:
                break
            
            resp = handle_request(server, line)
            if resp:
                print(json.dumps(resp))
                sys.stdout.flush()
        except KeyboardInterrupt:
            break
        except Exception as e:
            logger.error(f"Main loop error: {e}")
            break
    
    logger.info("Flash Sidekick stopped")
