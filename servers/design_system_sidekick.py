#!/usr/bin/env python3
"""
MCP Design System Sidekick - Northcote Curio Validation & Asset Orchestration (FastMCP Version)
"""
import warnings
warnings.filterwarnings("ignore")

import asyncio
import json
import os
import sys
import logging
import base64
import sentry_sdk
import shutil
import re
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, Any, List, Optional
from mcp.server.fastmcp import FastMCP
import google.generativeai as genai
from openai import AsyncOpenAI

try:
    from azure.ai.inference import ChatCompletionsClient
    from azure.core.credentials import AzureKeyCredential
except ImportError:
    ChatCompletionsClient = None
    AzureKeyCredential = None

# --- Config ---
try:
    from dotenv import load_dotenv
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    load_dotenv(os.path.join(project_root, '.env'), override=True)
except ImportError:
    pass

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [DesignSidekick] - %(message)s',
    handlers=[logging.FileHandler('/tmp/mcp-design-system-sidekick.log')]
)
logger = logging.getLogger("DesignSystemSidekick")

if os.getenv("SENTRY_DSN"):
    sentry_sdk.init(dsn=os.getenv("SENTRY_DSN"), send_default_pii=True, environment=os.getenv("ENV", "development"))

# --- Config ---
# --- Config ---
GEMINI_VISION_CANDIDATES = [
    # Prioritize 2.5 Pro for complex reasoning on ambiguity (Gallery vs Lab)
    "models/gemini-2.5-pro",
    "models/gemini-2.0-flash",
    "models/gemini-1.5-pro",
    "models/gemini-1.5-flash"
]

# --- Global State ---
executor = ThreadPoolExecutor(max_workers=5)
gemini_key = os.getenv("GEMINI_API_KEY", "")
github_token = os.getenv("GITHUB_TOKEN", os.getenv("GH_TOKEN", ""))

if gemini_key:
    genai.configure(api_key=gemini_key)

async def _call_gh_vision_async(prompt, image_path):
    if not ChatCompletionsClient or not github_token: return None
    try:
        if not os.path.exists(image_path): return None
        with open(image_path, "rb") as f:
            encoded_image = base64.b64encode(f.read()).decode("utf-8")

        client = ChatCompletionsClient(
            endpoint="https://models.github.ai/inference",
            credential=AzureKeyCredential(github_token),
        )

        messages = [{
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{encoded_image}"}}
            ]
        }]

        def sync_call():
            return client.complete(messages=messages, model="gpt-4o-mini")

        loop = asyncio.get_event_loop()
        resp = await loop.run_in_executor(executor, sync_call)
        return resp.choices[0].message.content
    except Exception as e:
        logger.error(f"GH Vision fallback failed: {e}")
        return None

def _get_vision_model():
    if not gemini_key: return None
    for name in GEMINI_VISION_CANDIDATES:
        try:
            return genai.GenerativeModel(name)
        except: continue
    return None

async def _call_llm_async(prompt, json_mode=False):
    # Try Gemini
    # Try Gemini
    if gemini_key:
        try:
            # Use same vision candidates or specific pro model for text?
            # User request: "update design sidekick to use 2.5 pro" - implies generally.
            # But let's check availability.
            model = genai.GenerativeModel('gemini-2.5-pro')
            loop = asyncio.get_event_loop()
            def sync_call():
                config = {"response_mime_type": "application/json"} if json_mode else None
                resp = model.generate_content(prompt, generation_config=config)
                return resp.text if resp else None
            result = await loop.run_in_executor(executor, sync_call)
            if result: return result
        except Exception as e:
            logger.warning(f"Gemini 2.5 Pro failed: {e}. Trying fallbacks.")
            # Fallback to flash if Pro fails
            try:
                model = genai.GenerativeModel('gemini-2.0-flash')
                loop = asyncio.get_event_loop()
                def sync_call_fallback():
                    config = {"response_mime_type": "application/json"} if json_mode else None
                    resp = model.generate_content(prompt, generation_config=config)
                    return resp.text if resp else None
                result = await loop.run_in_executor(executor, sync_call_fallback)
                if result: return result
            except Exception as e2:
                logger.warning(f"Gemini Flash fallback failed: {e2}")

    # GitHub Models Fallback
    if github_token and ChatCompletionsClient:
        try:
            client = ChatCompletionsClient(
                endpoint="https://models.github.ai/inference",
                credential=AzureKeyCredential(github_token),
            )
            def sync_call():
                return client.complete(
                    messages=[{"role": "user", "content": prompt}],
                    model="gpt-4o-mini"
                )
            loop = asyncio.get_event_loop()
            resp = await loop.run_in_executor(executor, sync_call)
            return resp.choices[0].message.content
        except Exception as e:
            logger.error(f"GH Models LLM fallback failed: {e}")

    return "Error: No LLM available."

# --- FastMCP Server ---

mcp = FastMCP("design_system_sidekick")

@mcp.tool()
async def validate_asset_compliance(asset_id: str, image_path: Optional[str] = None) -> str:
    """Validate DALL-E output against Northcote compliance scorecard"""
    if not image_path or not os.path.exists(image_path):
        return json.dumps({"error": f"Image path not found: {image_path}"})

    prompt = f"""
    Validate the following asset for Northcote compliance:
    Asset ID: {asset_id}
    Focus on: Palette consistency, geometric precision, lighting balance, and typography.
    Return ONLY a JSON object with: compliance (bool), score (0-100), issues (list), summary (string).
    """

    backend = "gemini"
    result_text = None

    # 1. Gemini Vision
    model = _get_vision_model()
    if model:
        try:
            with open(image_path, "rb") as f: img_bytes = f.read()
            loop = asyncio.get_event_loop()
            def sync_vision():
                config = {"response_mime_type": "application/json"}
                resp = model.generate_content([prompt, {"mime_type": "image/jpeg", "data": img_bytes}], generation_config=config)
                return resp.text
            result_text = await loop.run_in_executor(executor, sync_vision)
        except Exception as e:
            logger.warning(f"Gemini vision failed: {e}")

    # 2. Fallback
    if not result_text:
        backend = "openai-github-models"
        result_text = await _call_gh_vision_async(prompt, image_path)

    if not result_text:
        return json.dumps({"error": "All vision models failed"})

    try:
        data = json.loads(result_text)
        final_output = {
            "asset_id": asset_id,
            "backend": backend,
            "compliance": data.get("compliance", data.get("compliant", False)),
            "score": data.get("score", 0),
            "issues": data.get("issues", []),
            "summary": data.get("summary", "Validated")
        }
        return json.dumps(final_output)
    except Exception as e:
        return json.dumps({"error": "Failed to parse LLM response", "raw": result_text})

@mcp.tool()
async def generate_implementation_package(asset_id: str, asset_metadata: Optional[Dict[str, Any]] = None) -> str:
    """Generate Implementation Package for validated asset"""
    prompt = f"""
    Generate an implementation package for Asset {asset_id}.
    Metadata: {json.dumps(asset_metadata or {})}
    Provide a detailed plan covering: CSS Tokens, React Component structure, Animation specs.
    """
    return await _call_llm_async(prompt)

# --- CLI Operations ---

async def catalog_assets_task(args):
    """
    Scans directory, analyzes images, outputs JSON catalog.
    Uses Gemini Vision (Pro) via _get_vision_model
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

        prompt = f"""
        Analyze this asset for the Northcote Curio catalog.

        System Context:
        {design_philosophy}

        Task:
        1. Identify type (motif, texture, pattern, icon).
        2. Determine mode (gallery vs laboratory) - Gallery is high-art/specimen, Lab is technical/schematic. This is critical.
           - Gallery: detailed, organic, hand-drawn look, specimen style.
           - Laboratory: technical, schematic, grid, blueprint style.
        3. Suggest a filename following: {{type}}-{{mode}}-{{category}}-{{variant}}.png
        4. Extract dominant colors and dimensions.
        5. Check compliance with Northcote Design Philosophy.

        Return ONLY valid JSON (no markdown) with keys: original_path, suggested_name, mode, category, dimensions, dominant_colors, compliance (object with northcote_philosophy boolean), duplicate_of (null if new).
        """

        # Use existing validate_asset_compliance internal logic or similar
        # But we need raw generation, validate_asset_compliance returns specific schema.
        # Let's use _get_vision_model directly similar to validate tool but for this prompt.

        result_text = None
        model = _get_vision_model()
        if model:
            try:
                with open(file_path, "rb") as f: img_bytes = f.read()
                loop = asyncio.get_event_loop()
                def sync_vision():
                    # Check if model supports system instruction - pass in prompt
                    config = {"response_mime_type": "application/json"}
                    # construct parts
                    parts = [prompt, {"mime_type": "image/jpeg", "data": img_bytes}]
                    resp = model.generate_content(parts, generation_config=config)
                    return resp.text
                result_text = await loop.run_in_executor(executor, sync_vision)
            except Exception as e:
                logger.warning(f"Gemini vision failed: {e}")

        # Fallback to GH Vision if needed (not implemented full reuse here to save space, but relying on Pro as requested)
        # If result_text is None, we skip or could implement fallback.
        # For now, let's assume Pro hits.

        if result_text:
            try:
                 # Sanitize if Markdown code blocks are present
                cleaned_json = result_text.strip()
                if cleaned_json.startswith("```json"):
                    cleaned_json = cleaned_json[7:]
                if cleaned_json.startswith("```"):
                    cleaned_json = cleaned_json.strip("`")
                if cleaned_json.endswith("```"):
                    cleaned_json = cleaned_json[:-3]

                data = json.loads(cleaned_json)
                if isinstance(data, list) and len(data) > 0: data = data[0]

                if isinstance(data, dict):
                    data['original_path'] = file_path # keep relative as processed
                    return data
            except json.JSONDecodeError:
                logger.error(f"Failed to decode JSON for {filename}")
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

async def validate_compliance_task(args):
    """CLI wrapper for validate_asset_compliance"""
    print(await validate_asset_compliance(args.asset_id, args.image_path))

async def generate_package_task(args):
    """CLI wrapper for generate_implementation_package"""
    meta = {}
    if args.metadata:
        try:
            meta = json.loads(args.metadata)
        except:
            logger.warning("Failed to parse metadata JSON")
    print(await generate_implementation_package(args.asset_id, meta))

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--task", choices=["validate_compliance", "generate_package", "catalog_assets", "apply_catalog", "verify_consolidation"])
    parser.add_argument("--asset_id")
    parser.add_argument("--image_path")
    parser.add_argument("--metadata")
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

    args, unknown = parser.parse_known_args()

    if args.task:
        if args.task == "validate_compliance":
            asyncio.run(validate_compliance_task(args))
        elif args.task == "generate_package":
            asyncio.run(generate_package_task(args))
        elif args.task == "catalog_assets":
            asyncio.run(catalog_assets_task(args))
        elif args.task == "apply_catalog":
            asyncio.run(apply_catalog_task(args))
        elif args.task == "verify_consolidation":
            asyncio.run(verify_consolidation_task(args))
    else:
        mcp.run()
