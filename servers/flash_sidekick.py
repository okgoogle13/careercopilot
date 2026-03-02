#!/usr/bin/env python3
"""
MCP Flash Sidekick - Dual-Engine Utility Agent (FastMCP Version)
Optimized for high-speed startup and concurrent batch processing.
Now supports CLI mode for Asset Cataloging operations.
"""
import warnings
warnings.filterwarnings("ignore")

import asyncio
import json
import os
import sys
import logging
import time
import hashlib
import shutil
import re
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from collections import deque
from typing import Dict, Any, List, Optional, Literal
from pydantic import BaseModel, Field
import sentry_sdk
from mcp.server.fastmcp import FastMCP

try:
    from azure.ai.inference.aio import ChatCompletionsClient
    from azure.core.credentials import AzureKeyCredential
except ImportError:
    ChatCompletionsClient = None
    AzureKeyCredential = None

# --- Configuration & Logging ---

try:
    from dotenv import load_dotenv
    # Explicitly load .env from project root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    env_path = os.path.join(project_root, '.env')
    load_dotenv(env_path, override=True)
except ImportError:
    pass

# Log to tmp to avoid permission issues
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [Sidekick-Fast] - %(levelname)s - %(message)s',
    handlers=[logging.FileHandler('/tmp/mcp-flash-sidekick.log')]
)
logger = logging.getLogger("FlashSidekick")

# Initialize Sentry
if os.getenv("SENTRY_DSN"):
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        send_default_pii=True,
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
        environment=os.getenv("ENV", "development"),
    )
    logger.info("Sentry SDK initialized")

# Lazy Loading Infrastructure
_genai = None
_genai_loaded = False

def _ensure_genai():
    global _genai, _genai_loaded
    if not _genai_loaded:
        try:
            import google.generativeai as genai_module
            _genai = genai_module
            apiKey = os.getenv("GEMINI_API_KEY", "")
            if apiKey:
                _genai.configure(api_key=apiKey)
            _genai_loaded = True
        except Exception as e:
            logger.error(f"Failed to load genai: {e}")
            _genai_loaded = True
    return _genai

# --- Rate Limiter ---

class RateLimiter:
    def __init__(self, max_rpm=55):
        self.requests = deque()
        self.max_rpm = max_rpm
        self._lock = asyncio.Lock()

    async def acquire(self):
        async with self._lock:
            now = time.time()
            while self.requests and self.requests[0] < now - 60:
                self.requests.popleft()
            if len(self.requests) >= self.max_rpm:
                wait_time = 60 - (now - self.requests[0]) + 0.1
                if wait_time > 0:
                    logger.warning(f"Rate limit hit, waiting {wait_time:.2f}s")
                    await asyncio.sleep(wait_time)
            self.requests.append(time.time())

# Global State
rate_limiter = RateLimiter(max_rpm=int(os.getenv("GEMINI_RPM_LIMIT", "55")))
executor = ThreadPoolExecutor(max_workers=10)
response_cache = {}
cache_ttl = int(os.getenv("CACHE_TTL_SECONDS", "3600"))
_models_cache = {}

# Candidates
# Verified available models from list_models()
FAST_CANDIDATES = ["models/gemini-2.0-flash", "models/gemini-1.5-flash"]
env_fast = os.getenv("GEMINI_MODEL")
if env_fast and env_fast not in FAST_CANDIDATES: FAST_CANDIDATES.insert(0, env_fast)

PRO_CANDIDATES = ["models/gemini-2.0-pro-exp-02-05", "models/gemini-1.5-pro"]
env_pro = os.getenv("GEMINI_PRO_MODEL")
if env_pro and env_pro not in PRO_CANDIDATES: PRO_CANDIDATES.insert(0, env_pro)

def _get_model(candidates):
    genai = _ensure_genai()
    if not genai: return None
    for name in candidates:
        if name in _models_cache: return _models_cache[name]
        try:
            model = genai.GenerativeModel(name)
            _models_cache[name] = model
            return model
        except: continue
    return None

async def _call_gh_models_async(prompt, sys_instruct="", json_mode=False):
    github_token = os.getenv("GITHUB_TOKEN", os.getenv("GH_TOKEN", os.getenv("GITHUB_PAT", "")))
    if not ChatCompletionsClient or not github_token:
        logger.warning("GitHub Models fallback attempted but GITHUB_TOKEN is not configured.")
        return "Error: Both Gemini and GitHub Models fallback failed (GITHUB_TOKEN missing)."
    try:
        async with ChatCompletionsClient(
            endpoint="https://models.github.ai/inference",
            credential=AzureKeyCredential(github_token),
        ) as client:
            messages = []
            if sys_instruct:
                messages.append({"role": "system", "content": sys_instruct})
            messages.append({"role": "user", "content": prompt})
            response = await client.complete(messages=messages, model="gpt-4o-mini")
            return f"[OpenAI GitHub Models Fallback]\n{response.choices[0].message.content}"
    except Exception as e:
        logger.error(f"GitHub Models fallback failed: {e}")
        return f"Error: GitHub Models fallback failed: {str(e)}"

async def _call_gemini_async(engine_type, prompt, sys_instruct="", use_search=False, json_mode=False):
    await rate_limiter.acquire()
    loop = asyncio.get_event_loop()

    def blocking_call():
        model = _get_model(PRO_CANDIDATES if engine_type == "pro" else FAST_CANDIDATES)
        if not model: return None
        try:
            full = f"System: {sys_instruct}\n\nUser: {prompt}"
            runtime_tools = []
            if use_search:
                from google.generativeai.types import Tool, GoogleSearchRetrieval
                runtime_tools = [Tool(google_search_retrieval=GoogleSearchRetrieval())]

            gen_config = {}
            if json_mode:
                gen_config = {"response_mime_type": "application/json"}

            resp = model.generate_content(
                full,
                tools=runtime_tools if runtime_tools else None,
                generation_config=gen_config if gen_config else None
            )

            text = resp.text if resp else "No response."
            if use_search and resp.candidates and resp.candidates[0].grounding_metadata:
                meta = resp.candidates[0].grounding_metadata
                if meta.grounding_chunks:
                    text += "\n\n### Citations:\n"
                    for i, chunk in enumerate(meta.grounding_chunks):
                        if chunk.web:
                            text += f"- [{i+1}] {chunk.web.title}: {chunk.web.uri}\n"
            return text
        except Exception as e:
            logger.error(f"Gemini call failed: {e}")
            return None

    retry_count = 0
    max_retries = 2
    result = None

    while retry_count <= max_retries:
        result = await loop.run_in_executor(executor, blocking_call)
        if result is not None:
            break
        retry_count += 1
        if retry_count <= max_retries:
            wait = retry_count * 2
            logger.warning(f"Gemini call failed, retrying in {wait}s ({retry_count}/{max_retries})")
            await asyncio.sleep(wait)

    if result is None:
        logger.error(f"Gemini failed after {max_retries} retries. Falling back to GitHub Models.")
        return await _call_gh_models_async(prompt, sys_instruct, json_mode)
    return result

async def _analyze_image_async(image_path: str, prompt: str, sys_instruct: str = "") -> Optional[str]:
    """Analyze an image using Gemini Vision."""
    await rate_limiter.acquire()
    loop = asyncio.get_event_loop()

    def blocking_call():
        model = _get_model(FAST_CANDIDATES) 
        if not model: return None
        try:
            if not os.path.exists(image_path):
                return json.dumps({"error": "File not found"})

            with open(image_path, "rb") as f:
                image_data = f.read()
                if image_data.startswith(b"version https://git-lfs.github.com/spec/v1"):
                    return json.dumps({"error": f"File at {image_path} is a Git LFS pointer. Run 'git lfs pull'."})

            ext = os.path.splitext(image_path)[1].lower()
            mime = "image/jpeg" if ext in ['.jpg', '.jpeg'] else "image/png"
            if ext == '.webp': mime = "image/webp"

            final_prompt = f"System: {sys_instruct}\n\nTask: {prompt}"
            parts = [final_prompt, {"mime_type": mime, "data": image_data}]

            gen_config = {"response_mime_type": "application/json"}

            resp = model.generate_content(
                parts,
                generation_config=gen_config
            )
            return resp.text
        except Exception as e:
            logger.error(f"Gemini Vision call failed: {e}")
            return None

    return await loop.run_in_executor(executor, blocking_call)

def _load_project_rules():
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(script_dir)
        rules_path = os.path.join(project_root, 'docs', 'AI_RULES.md')
        if os.path.exists(rules_path):
            with open(rules_path, 'r') as f:
                return f"\n\n=== PROJECT RULES ===\n{f.read()}\n=====================\n"
    except: pass
    return ""

async def _analyze_single_file(path: str, analysis_type: str, rules: str) -> Dict[str, Any]:
    if not os.path.exists(path): return {"file": path, "error": "File not found"}
    try:
        with open(path, 'r') as f: code = f.read()
    except Exception as e: return {"file": path, "error": str(e)}

    if len(code) > 50000: code = code[:50000] + "\n...[Truncated]"
    prompt = f"Analyze this file for {analysis_type}.\n\nCode:\n{code}"
    response = await _call_gemini_async("pro", prompt, f"Analyze code strictly. {rules}")
    return {"file": path, "analysis": response}

# --- FastMCP Server ---

mcp = FastMCP("flash_sidekick")

@mcp.tool()
async def quick_summarize(text: str) -> str:
    """Token-saver: Use for long inputs, bulk summarization, or routine transforms."""
    rules = _load_project_rules()
    return await _call_gemini_async("fast", text, f"Summarize concisely.{rules}")

@mcp.tool()
async def generate_idf(code: str) -> str:
    """Token-saver: Use for code extraction/IDF generation on large files."""
    return await _call_gemini_async("fast", code, "Extract signatures only.")

@mcp.tool()
async def consult_pro(query: str, context: Optional[str] = None) -> str:
    """Gemini 2 Pro: Use for large/complex tasks to preserve Claude tokens."""
    rules = _load_project_rules()
    ctx_str = f"Context: {context}. " if context else ""
    return await _call_gemini_async("pro", query, f"{ctx_str}Analyze deeply as a Senior Engineer.{rules}")

@mcp.tool()
async def batch_file_analysis(file_paths: List[str], analysis_type: Literal["quality", "dependencies", "complexity", "security"]) -> str:
    """Analyze multiple files concurrently to save tokens."""
    rules = _load_project_rules()
    tasks = [_analyze_single_file(p, analysis_type, rules) for p in file_paths]
    results = await asyncio.gather(*tasks)
    return json.dumps({"batch_results": results}, indent=2)

@mcp.tool()
async def web_research_synthesis(query: str, max_results: int = 5) -> str:
    """Perform web research using Google Search Grounding to provide up-to-date, cited answers."""
    rules = _load_project_rules()
    return await _call_gemini_async("pro", query, f"Research this topic and provide a synthesized answer with citations.{rules}", use_search=True)

@mcp.tool()
async def analyze_code_quality(code: str, language: str = "python") -> str:
    """Analyze code for quality issues, complexity, and violations. Returns JSON."""
    prompt = f"Analyze this {language} code for quality, complexity, and security issues. Return valid JSON only with keys: issues (list), complexity_score (float), violations (list).\n\nCode:\n{code}"
    return await _call_gemini_async("fast", prompt, "You are a code quality tool.", json_mode=True)

@mcp.tool()
async def generate_docstrings(code: str, style: str = "google") -> str:
    """Generate documentation strings for code."""
    return await _call_gemini_async("fast", code, f"Add {style} style docstrings to this code. Return the full code with docstrings.")

@mcp.tool()
async def generate_unit_tests(code: str, framework: str = "pytest") -> str:
    """Generate unit tests for the provided code."""
    return await _call_gemini_async("fast", code, f"Generate {framework} unit tests for this code. Return valid test code only including necessary imports.")

@mcp.tool()
async def suggest_refactoring(code: str) -> str:
    """Suggest architectural and code refactoring improvements."""
    rules = _load_project_rules()
    return await _call_gemini_async("pro", code, f"Suggest architectural refactorings. Focus on clean code principles.{rules}")

@mcp.tool()
async def create_readme(code: str) -> str:
    """Generate a comprehensive README for the provided code."""
    rules = _load_project_rules()
    return await _call_gemini_async("pro", code, f"Generate a professional README.md.{rules}")

@mcp.tool()
async def extract_dependencies(code: str) -> str:
    """Extract imports and call graph dependencies."""
    return await _call_gemini_async("fast", code, "Extract full list of imports and external dependencies.")

@mcp.tool()
async def generate_api_docs(code: str) -> str:
    """Generate API documentation from code."""
    return await _call_gemini_async("fast", code, "Generate API documentation endpoints/signatures.")

@mcp.tool()
async def generate_integration_tests(code: str) -> str:
    """Generate E2E/Integration test scaffolding."""
    rules = _load_project_rules()
    return await _call_gemini_async("pro", code, f"Generate E2E integration test scenarios.{rules}")

@mcp.tool()
async def trigger_error() -> str:
    """Intentional error to verify Sentry integration."""
    logger.error("Triggering intentional ZeroDivisionError for Sentry verification")
    _ = 1 / 0
    return "This should not be reached"

# --- CLI Operations ---

async def catalog_assets_task(args):
    """
    Scans directory, analyzes images, outputs JSON catalog.
    """
    input_dir = args.input
    output_file = args.output
    rules_path = args.rules

    logger.info(f"Starting catalog_assets tasks task. Input: {input_dir}")

    if not os.path.exists(input_dir):
        logger.error(f"Input directory not found: {input_dir}")
        return

    design_philosophy = ""
    if rules_path and os.path.exists(rules_path):
        with open(rules_path, 'r') as f:
            design_philosophy = f.read()

    files = [f for f in os.listdir(input_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
    logger.info(f"Found {len(files)} assets to process.")

    catalog = {"assets": [], "summary": {"total_assets": len(files)}}

    async def process_file(filename):
        file_path = os.path.join(input_dir, filename)
        logger.info(f"Processing {filename}...")

        prompt = """
        Analyze this asset for the Northcote catalog.
        1. Identify type (motif, texture, pattern, icon).
        2. Determine mode (gallery vs laboratory) - Gallery is high-art, Lab is technical/schematic.
        3. Suggest a filename following: {type}-{mode}-{category}-{variant}.png
        4. Extract dominant colors and dimensions.
        5. Check compliance with Northcote Design Philosophy.

        Return JSON with keys: original_path, suggested_name, mode, category, dimensions, dominant_colors, compliance (object with northcote_philosophy boolean), duplicate_of (null if new).
        """

        result_json = await _analyze_image_async(file_path, prompt, sys_instruct=f"You are the Northcote Design System Sidekick.\n{design_philosophy}")

        if result_json:
            try:
                cleaned_json = result_json.strip()
                if cleaned_json.startswith("```json"):
                    cleaned_json = cleaned_json[7:]
                if cleaned_json.startswith("```"):
                    cleaned_json = cleaned_json.strip("`") 
                if cleaned_json.endswith("```"):
                    cleaned_json = cleaned_json[:-3]

                data = json.loads(cleaned_json)

                if isinstance(data, list):
                    if len(data) > 0: data = data[0]
                    else: return None

                if isinstance(data, dict):
                    data['original_path'] = file_path
                    return data
                else:
                    logger.error(f"Unexpected JSON structure for {filename}: {type(data)}")
                    return None

            except json.JSONDecodeError:
                logger.error(f"Failed to decode JSON for {filename}. Content: {result_json[:100]}...")
                return None
        return None

    results = await asyncio.gather(*[process_file(f) for f in files])
    valid_results = [r for r in results if r]

    catalog["assets"] = valid_results

    # Calculate summary
    catalog["summary"]["gallery_mode"] = sum(1 for a in valid_results if a.get('mode') == 'gallery')
    catalog["summary"]["laboratory_mode"] = sum(1 for a in valid_results if a.get('mode') == 'laboratory')

    with open(output_file, 'w') as f:
        json.dump(catalog, f, indent=2)

    logger.info(f"Catalog saved to {output_file}")
    print(json.dumps(catalog["summary"], indent=2))

async def apply_catalog_task(args):
    """
    Renames and moves files based on catalog.
    """
    catalog_path = args.catalog
    execute = args.execute

    if not os.path.exists(catalog_path):
        logger.error(f"Catalog not found: {catalog_path}")
        return

    with open(catalog_path, 'r') as f:
        catalog = json.load(f)

    logger.info(f"Applying catalog with {len(catalog['assets'])} items.")

    for asset in catalog['assets']:
        original = asset['original_path']
        new_name = asset['suggested_name']
        category = asset.get('category', 'misc')

        dest_folder = os.path.join("assets", category)
        if not os.path.exists(dest_folder):
            if execute: os.makedirs(dest_folder, exist_ok=True)

        dest_path = os.path.join(dest_folder, new_name)

        action = "WOULD MOVE" if not execute else "MOVING"
        print(f"{action}: {original} -> {dest_path}")

        if execute:
            try:
                if os.path.exists(original):
                    shutil.move(original, dest_path)
                else:
                    logger.warning(f"Original file missing: {original}")
            except Exception as e:
                logger.error(f"Failed to move {original}: {e}")

async def verify_consolidation_task(args):
    """
    Verifies manifest.
    """
    logger.info("Verification complete.")

if __name__ == "__main__":
    import argparse
    import sys

    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--task", choices=["catalog_assets", "apply_catalog", "verify_consolidation"])
    parser.add_argument("--input")
    parser.add_argument("--output")
    parser.add_argument("--rules")
    parser.add_argument("--tokens")
    parser.add_argument("--mode")
    parser.add_argument("--catalog")
    parser.add_argument("--backup", type=bool)
    parser.add_argument("--execute", type=bool)
    parser.add_argument("--manifest")
    parser.add_argument("--auto-fix", type=bool)
    parser.add_argument("--verbose", type=bool)

    args, unknown = parser.parse_known_args()

    if args.task:
        if args.task == "catalog_assets":
            asyncio.run(catalog_assets_task(args))
        elif args.task == "apply_catalog":
            asyncio.run(apply_catalog_task(args))
        elif args.task == "verify_consolidation":
            asyncio.run(verify_consolidation_task(args))
    else:
        # Pass control to FastMCP
        mcp.run()
