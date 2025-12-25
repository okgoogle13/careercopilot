#!/usr/bin/env python3
"""
MCP Flash Sidekick - Dual-Engine Implementation
--------------------------------------------
Provides two model engines:
* Fast engine (Gemini Flash Lite) for quick summarization.
* Smart engine (Gemini Pro) for higher‑quality IDF generation.
"""

import json
import os
import sys
import logging
from typing import Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [Sidekick] - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/tmp/mcp-flash-sidekick.log'),
        logging.StreamHandler(sys.stderr)
    ]
)
logger = logging.getLogger("FlashSidekick")

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False
    logger.warning("google-generativeai not installed. Run: pip install google-generativeai")

class FlashSidekickServer:
    def __init__(self):
        # API key
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        # Model names – can be overridden via env vars.
        self.fast_model_name = os.getenv("GEMINI_MODEL", "models/gemini-2.5-flash-lite")
        self.pro_model_name = os.getenv("GEMINI_PRO_MODEL", "models/gemini-2.5-pro")
        # Model instances & init flags
        self.fast_model = None
        self.pro_model = None
        self.fast_initialized = False
        self.pro_initialized = False

        if GENAI_AVAILABLE and self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self._initialize_model(self.fast_model_name, kind="fast")
                self._initialize_model(self.pro_model_name, kind="pro")
            except Exception as e:
                logger.error(f"Failed to configure Gemini client: {e}")
        else:
            logger.warning("Missing API Key or google-generativeai library.")

    def _initialize_model(self, model_name: str, kind: str):
        """Attempt to create a GenerativeModel for the given name.
        `kind` is either "fast" or "pro" and determines which attribute to set.
        """
        try:
            logger.info(f"Initializing {kind} model: {model_name}")
            model = genai.GenerativeModel(model_name)
            # Simple ping to verify access.
            model.generate_content("Ping")
            if kind == "fast":
                self.fast_model = model
                self.fast_initialized = True
                logger.info(f"Fast model ready: {model_name}")
            else:
                self.pro_model = model
                self.pro_initialized = True
                logger.info(f"Pro model ready: {model_name}")
        except Exception as e:
            logger.warning(f"Failed to init {kind} model {model_name}: {e}")

    def _call(self, model, prompt: str, system_instruction: str = "") -> Dict[str, Any]:
        """Run a generation request against a given model."""
        try:
            full_prompt = f"System Instruction: {system_instruction}\n\nTask: {prompt}"
            response = model.generate_content(full_prompt)
            text = response.text if response else "No response."
            return {"content": text, "meta": {"model": model.model_name}}
        except Exception as e:
            logger.error(f"Generation error ({model.model_name}): {e}")
            return {"content": f"Error: {str(e)}"}

    # ---------------------------------------------------------------------
    # Public tool implementations
    # ---------------------------------------------------------------------
    def quick_summarize(self, text: str) -> str:
        """Fast summarization using the Flash Lite model."""
        if not self.fast_initialized:
            return "Fast model not available."
        result = self._call(self.fast_model, text, "Summarize concisely.")
        return result.get("content", "")

    def generate_idf(self, code_content: str) -> str:
        """High‑quality IDF generation using the Pro model."""
        if not self.pro_initialized:
            return "Pro model not available."
        prompt = f"""
        Extract a Python Interface Definition (IDF) from the code below.
        Rules:
        1. Keep all class definitions.
        2. Keep method signatures with type hints.
        3. Keep docstrings.
        4. Replace method bodies with '...'.
        5. Omit imports unless required for type hints.

        Code:
        {code_content}
        """
        result = self._call(self.pro_model, prompt, "Parse Python code for IDF.")
        return result.get("content", "")

    def list_tools(self) -> list:
        return [
            {
                "name": "quick_summarize",
                "description": "Fast summarization using Gemini Flash Lite.",
                "inputSchema": {
                    "type": "object",
                    "properties": {"text": {"type": "string"}},
                    "required": ["text"]
                }
            },
            {
                "name": "generate_idf",
                "description": "High‑quality IDF generation using Gemini Pro.",
                "inputSchema": {
                    "type": "object",
                    "properties": {"code_content": {"type": "string"}},
                    "required": ["code_content"]
                }
            }
        ]

def handle_request(server: FlashSidekickServer, line: str):
    try:
        request = json.loads(line)
        method = request.get("method")
        if method == "tools/list":
            return {"result": {"tools": server.list_tools()}}
        elif method == "tools/call":
            params = request.get("params", {})
            name = params.get("name")
            args = params.get("arguments", {})
            if name == "quick_summarize":
                content = server.quick_summarize(args.get("text", ""))
            elif name == "generate_idf":
                content = server.generate_idf(args.get("code_content", ""))
            else:
                return {"error": {"code": -32601, "message": "Method not found"}}
            return {"result": {"content": [{"type": "text", "text": content}]}}
        elif method == "initialize":
            return {"result": {"protocolVersion": "0.1.0", "capabilities": {"tools": {}}, "serverInfo": {"name": "flash-sidekick", "version": "1.0.0"}}}
        elif method == "notifications/initialized":
            return {}
        else:
            return {"error": {"code": -32601, "message": "Method not found"}}
    except Exception as e:
        return {"error": {"code": -32603, "message": str(e)}}

if __name__ == "__main__":
    server = FlashSidekickServer()
    while True:
        try:
            line = sys.stdin.readline()
            if not line:
                break
            response = handle_request(server, line)
            if response:
                print(json.dumps(response))
                sys.stdout.flush()
        except Exception:
            break
