#!/usr/bin/env python3
"""
MCP Flash Sidekick - Dual-Engine Utility Agent (Async Version)
Optimized for high-speed startup and concurrent batch processing.
"""
import warnings
warnings.filterwarnings("ignore")

import asyncio
import json
import os
import sys
import logging
import time
from concurrent.futures import ThreadPoolExecutor
from collections import deque
from typing import Dict, Any, List, Optional

# --- Configuration & Logging ---

try:
    from dotenv import load_dotenv
    # Explicitly load .env from project root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    env_path = os.path.join(project_root, '.env')
    load_dotenv(env_path)
except ImportError:
    pass

# Log to tmp to avoid permission issues
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [Sidekick-Async] - %(levelname)s - %(message)s',
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

# --- Cache Entry ---

class CacheEntry:
    """Simple TTL-based cache entry"""
    def __init__(self, result, ttl=3600):
        self.result = result
        self.expires = time.time() + ttl

    def is_expired(self):
        return time.time() > self.expires

# --- Rate Limiter ---

class RateLimiter:
    def __init__(self, max_rpm=55):
        self.requests = deque()
        self.max_rpm = max_rpm
        self._lock = asyncio.Lock()

    async def acquire(self):
        async with self._lock:
            now = time.time()
            # Remove requests older than 1 minute
            while self.requests and self.requests[0] < now - 60:
                self.requests.popleft()

            # If at limit, calculate wait time
            if len(self.requests) >= self.max_rpm:
                wait_time = 60 - (now - self.requests[0]) + 0.1 # Small buffer
                if wait_time > 0:
                    logger.warning(f"Rate limit hit, waiting {wait_time:.2f}s")
                    await asyncio.sleep(wait_time)

            self.requests.append(time.time())

# --- Server Implementation ---

class AsyncFlashSidekickServer:
    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY", "")
        self.initialized = False
        self._models_cache = {}
        self.executor = ThreadPoolExecutor(max_workers=10) # Parallel processing limit
        self.rate_limiter = RateLimiter(max_rpm=int(os.getenv("GEMINI_RPM_LIMIT", "55")))

        # Response cache with TTL
        self._response_cache = {}
        self.cache_ttl = int(os.getenv("CACHE_TTL_SECONDS", "3600"))  # 1 hour default

        # Response size limiting (MCP has 1MB hard limit)
        self.max_response_size = int(os.getenv("MAX_RESPONSE_SIZE", "900000"))  # 900KB default

        # Fast Engine Candidates
        env_fast = os.getenv("GEMINI_MODEL")
        self.fast_candidates = ["models/gemini-2.5-flash-lite", "models/gemini-1.5-flash"]
        if env_fast and env_fast not in self.fast_candidates: self.fast_candidates.insert(0, env_fast)

        # Smart Engine Candidates
        env_pro = os.getenv("GEMINI_PRO_MODEL")
        self.pro_candidates = ["models/gemini-2.5-pro", "models/gemini-exp-1206", "models/gemini-1.5-pro"]
        if env_pro and env_pro not in self.pro_candidates: self.pro_candidates.insert(0, env_pro)

    def _get_cache_key(self, tool_name: str, args: Dict[str, Any]) -> str:
        """Generate cache key from tool name and arguments"""
        import hashlib
        content = json.dumps(args, sort_keys=True)
        return f"{tool_name}:{hashlib.md5(content.encode()).hexdigest()}"

    def _should_use_pro(self, tool_name: str, content_length: int = 0) -> bool:
        """Intelligent model selection based on tool complexity and content size"""
        # Always use Pro for strategic/complex tasks
        pro_tools = {
            "consult_pro",
            "suggest_refactoring",
            "create_readme",
            "batch_file_analysis",
            "web_research_synthesis",
            "generate_integration_tests"
        }

        if tool_name in pro_tools:
            return True

        # Use Pro for large contexts (>30K chars)
        if content_length > 30000:
            return True

        # Default to Flash for efficiency
        return False

    def _truncate_if_needed(self, content: str) -> str:
        """Truncate response to stay under MCP size limits"""
        content_bytes = content.encode('utf-8')
        if len(content_bytes) <= self.max_response_size:
            return content

        truncation_msg = "\n\n[... Response truncated due to MCP 1MB size limit. Consider using pagination or requesting specific sections ...]"
        safe_size = self.max_response_size - len(truncation_msg.encode('utf-8')) - 100
        truncated = content_bytes[:safe_size].decode('utf-8', errors='ignore')
        logger.warning(f"Response truncated from {len(content_bytes)} to {safe_size} bytes")
        return truncated + truncation_msg

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
        try:
            script_dir = os.path.dirname(os.path.abspath(__file__))
            project_root = os.path.dirname(script_dir)
            rules_path = os.path.join(project_root, 'docs', 'AI_RULES.md')

            if os.path.exists(rules_path):
                with open(rules_path, 'r') as f:
                    return f"\n\n=== PROJECT RULES (from docs/AI_RULES.md) ===\n{f.read()}\n============================================\n"
        except Exception as e:
            logger.error(f"Failed to load rules: {e}")
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

    async def _call_gemini_async(self, engine_type, prompt, sys_instruct="", use_search=False, json_mode=False):
        await self.rate_limiter.acquire()

        loop = asyncio.get_event_loop()

        def blocking_call():
            model = self._get_model(self.pro_candidates if engine_type == "pro" else self.fast_candidates)
            if not model: return "Error: Model unavailable."
            try:
                full = f"System: {sys_instruct}\n\nUser: {prompt}"

                # Configure tools (Search Grounding)
                runtime_tools = []
                if use_search:
                    from google.generativeai.types import Tool, GoogleSearchRetrieval
                    runtime_tools = [Tool(google_search_retrieval=GoogleSearchRetrieval())]

                gen_config = {}
                if json_mode:
                    gen_config = {"response_mime_type": "application/json"}

                resp = model.generate_content(full, tools=runtime_tools if runtime_tools else None, generation_config=gen_config if gen_config else None)

                # Handle Search Grounding Response
                text = resp.text if resp else "No response."

                if use_search and resp.candidates and resp.candidates[0].grounding_metadata:
                    meta = resp.candidates[0].grounding_metadata
                    if meta.grounding_chunks:
                        text += "\n\n### Citations:\n"
                        for i, chunk in enumerate(meta.grounding_chunks):
                             if chunk.web:
                                 text += f"- [{i+1}] {chunk.web.title}: {chunk.web.uri}\n"

                return text
            except Exception as e: return f"Error: {str(e)}"

        return await loop.run_in_executor(self.executor, blocking_call)

    # --- Tool Definitions ---

    def list_tools(self):
        return [
            {
                "name": "quick_summarize",
                "description": "Token-saver: Use for long inputs, bulk summarization, or routine transforms. Avoid for creative design or code review (keep in Claude).",
                "inputSchema": {"type": "object", "properties": {"text": {"type": "string"}}, "required": ["text"]}
            },
            {
                "name": "generate_idf",
                "description": "Token-saver: Use for code extraction/IDF generation on large files. Avoid for creative design or code review (keep in Claude).",
                "inputSchema": {"type": "object", "properties": {"code": {"type": "string"}}, "required": ["code"]}
            },
            {
                "name": "consult_pro",
                "description": "Gemini 3 Pro: Use for large/complex tasks to preserve Claude tokens. Avoid for creative design or code review (keep in Claude).",
                "inputSchema": {"type": "object", "properties": {"query": {"type": "string"}, "context": {"type": "string"}}, "required": ["query"]}
            },
            {
                "name": "batch_file_analysis",
                "description": "Analyze multiple files concurrently to save tokens. Returns aggregated results.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "file_paths": {"type": "array", "items": {"type": "string"}},
                        "analysis_type": {"type": "string", "enum": ["quality", "dependencies", "complexity", "security"]}
                    },
                    "required": ["file_paths", "analysis_type"]
                }
            },
            {
                "name": "web_research_synthesis",
                "description": "Perform web research using Google Search Grounding to provide up-to-date, cited answers.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string"},
                        "max_results": {"type": "integer", "default": 5}
                    },
                    "required": ["query"]
                }
            },
            {
                "name": "analyze_code_quality",
                "description": "Analyze code for quality issues, complexity, and violations. Returns JSON.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "code": {"type": "string"},
                        "language": {"type": "string", "default": "python"}
                    },
                    "required": ["code"]
                }
            },
            {
                "name": "generate_docstrings",
                "description": "Generate documentation strings for code. Returns code with docstrings inserted.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "code": {"type": "string"},
                        "style": {"type": "string", "default": "google"}
                    },
                    "required": ["code"]
                }
            },
            {
                "name": "generate_unit_tests",
                "description": "Generate unit tests for the provided code.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "code": {"type": "string"},
                        "framework": {"type": "string", "default": "pytest"}
                    },
                    "required": ["code"]
                }
            },
            {
                "name": "suggest_refactoring",
                "description": "Suggest architectural and code refactoring improvements.",
                "inputSchema": {"type": "object", "properties": {"code": {"type": "string"}}, "required": ["code"]}
            },
            {
                "name": "create_readme",
                "description": "Generate a comprehensive README for the provided code.",
                "inputSchema": {"type": "object", "properties": {"code": {"type": "string"}}, "required": ["code"]}
            },
            {
                "name": "extract_dependencies",
                "description": "Extract imports and call graph dependencies.",
                "inputSchema": {"type": "object", "properties": {"code": {"type": "string"}}, "required": ["code"]}
            },
            {
                "name": "generate_api_docs",
                "description": "Generate API documentation from code.",
                "inputSchema": {"type": "object", "properties": {"code": {"type": "string"}}, "required": ["code"]}
            },
            {
                "name": "generate_integration_tests",
                "description": "Generate E2E/Integration test scaffolding.",
                "inputSchema": {"type": "object", "properties": {"code": {"type": "string"}}, "required": ["code"]}
            }
        ]

    async def _analyze_single_file(self, path: str, analysis_type: str, rules: str) -> Dict[str, Any]:
        """Async helper for batch analysis"""
        try:
            if not os.path.exists(path):
                return {"file": path, "error": "File not found"}

            with open(path, 'r') as f:
                code = f.read()

            # Truncate large files to avoid context limits per file
            if len(code) > 50000:
                code = code[:50000] + "\n...[Truncated]"

            prompt = f"Analyze this file for {analysis_type}.\n\nCode:\n{code}"

            # Use Fast engine for bulk analysis to save costs/time, or Pro if needed?
            # Handover doc says "Engine: Gemini Pro". Let's use Pro for quality, Fast for others?
            # Actually, let's stick to Pro for analysis as requested, but maybe Fast for simpler ones.
            # Using 'pro' as per handover doc.
            response = await self._call_gemini_async("pro", prompt, f"Analyze code strictly. {rules}")

            return {"file": path, "analysis": response}
        except Exception as e:
            return {"file": path, "error": str(e)}

    async def call_tool(self, name, args):
        # Check cache first
        cache_key = self._get_cache_key(name, args)
        if cache_key in self._response_cache:
            entry = self._response_cache[cache_key]
            if not entry.is_expired():
                logger.info(f"Cache HIT for {name}")
                return entry.result
            else:
                # Remove expired entry
                del self._response_cache[cache_key]

        rules = self._load_project_rules()
        content = ""

        if name == "quick_summarize":
            content = await self._call_gemini_async("fast", args.get("text",""), f"Summarize concisely.{rules}")
        elif name == "generate_idf":
            content = await self._call_gemini_async("fast", args.get("code",""), f"Extract signatures only.")
        elif name == "consult_pro":
            content = await self._call_gemini_async("pro", args.get("query",""), f"Context: {args.get('context','')}. Analyze deeply as a Senior Engineer.{rules}")
        elif name == "batch_file_analysis":
            paths = args.get("file_paths", [])
            analysis_type = args.get("analysis_type", "quality")

            # Create async tasks for all files
            tasks = [self._analyze_single_file(p, analysis_type, rules) for p in paths]
            results = await asyncio.gather(*tasks)

            # Aggregate results into a summary
            content = json.dumps({"batch_results": results}, indent=2)

        elif name == "web_research_synthesis":
            query = args.get("query", "")
            content = await self._call_gemini_async("pro", query, f"Research this topic and provide a synthesized answer with citations.{rules}", use_search=True)

        elif name == "analyze_code_quality":
            code = args.get("code", "")
            lang = args.get("language", "python")
            prompt = f"Analyze this {lang} code for quality, complexity, and security issues. Return valid JSON only with keys: issues (list), complexity_score (float), violations (list).\n\nCode:\n{code}"
            content = await self._call_gemini_async("fast", prompt, "You are a code quality tool.", json_mode=True)

        elif name == "generate_docstrings":
            code = args.get("code", "")
            style = args.get("style", "google")
            content = await self._call_gemini_async("fast", code, f"Add {style} style docstrings to this code. Return the full code with docstrings.")

        elif name == "generate_unit_tests":
            code = args.get("code", "")
            framework = args.get("framework", "pytest")
            content = await self._call_gemini_async("fast", code, f"Generate {framework} unit tests for this code. Return valid test code only including necessary imports.")

        elif name == "suggest_refactoring":
            content = await self._call_gemini_async("pro", args.get("code",""), f"Suggest architectural refactorings. Focus on clean code principles.{rules}")

        elif name == "create_readme":
            content = await self._call_gemini_async("pro", args.get("code",""), f"Generate a professional README.md.{rules}")

        elif name == "extract_dependencies":
            content = await self._call_gemini_async("fast", args.get("code",""), "Extract full list of imports and external dependencies.")

        elif name == "generate_api_docs":
            content = await self._call_gemini_async("fast", args.get("code",""), "Generate API documentation endpoints/signatures.")

        elif name == "generate_integration_tests":
            content = await self._call_gemini_async("pro", args.get("code",""), f"Generate E2E integration test scenarios.{rules}")

        else:
            return []

        truncated_content = self._truncate_if_needed(content)
        result = [{"type": "text", "text": truncated_content}]

        # Cache the result
        self._response_cache[cache_key] = CacheEntry(result, ttl=self.cache_ttl)
        logger.info(f"Cached result for {name} (TTL: {self.cache_ttl}s)")

        return result

# --- Main Async Loop ---

async def handle_request(server, line):
    try:
        req = json.loads(line)
        method = req.get("method")
        req_id = req.get("id")

        resp = {"jsonrpc": "2.0", "id": req_id}

        if method == "initialize":
            resp["result"] = {
                "protocolVersion": "2024-11-05",
                "capabilities": {"tools": {}},
                "serverInfo": {"name": "sidekick-async", "version": "4.0.0"}
            }
        elif method == "tools/list":
            resp["result"] = {"tools": server.list_tools()}
        elif method == "tools/call":
            content = await server.call_tool(req["params"]["name"], req["params"]["arguments"])
            resp["result"] = {"content": content}
        else:
            return None # Ignore notifications or unknown methods

        return resp
    except Exception as e:
        logger.error(f"Error handling request: {e}", exc_info=True)
        return None

async def main():
    server = AsyncFlashSidekickServer()
    logger.info("Async Server Started")

    # Use a separate thread to read stdin to avoid blocking the event loop
    loop = asyncio.get_event_loop()

    while True:
        try:
            # Run blocking stdin read in executor
            line = await loop.run_in_executor(None, sys.stdin.readline)
            if not line: break

            resp = await handle_request(server, line)
            if resp:
                print(json.dumps(resp))
                sys.stdout.flush()
        except KeyboardInterrupt:
            break
        except Exception as e:
            logger.error(f"Fatal Loop Error: {e}")
            break

if __name__ == "__main__":
    asyncio.run(main())
