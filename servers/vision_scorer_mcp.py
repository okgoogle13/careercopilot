#!/usr/bin/env python3
"""
Vision-Scorer MCP Server - Programmatic visual compliance validation for KR Solidarity.
Manual JSON-RPC Implementation (Robust Pattern)
"""

import warnings
warnings.filterwarnings("ignore")

import asyncio
import json
import os
import sys
import logging
import base64
import google.generativeai as genai
from typing import Dict, Any, List, Optional
from concurrent.futures import ThreadPoolExecutor

# --- Configuration & Logging ---

try:
    from dotenv import load_dotenv
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    env_path = os.path.join(project_root, '.env')
    load_dotenv(env_path, override=True)
except ImportError:
    pass

# Use stderr for logging to avoid polluting stdout
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [VisionScorer] - %(levelname)s - %(message)s',
    stream=sys.stderr
)
logger = logging.getLogger("VisionScorer")

# Model Tiers (March 2026)
MODEL_TIERS = {
    "Frontier": "models/gemini-3.1-pro-preview",
    "Performance": "models/gemini-3-flash-preview",
    "Utility": "models/gemini-3.1-flash-lite-preview",
    "LTS": "models/gemini-2.5-pro"
}

class VisionScorerServer:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.executor = ThreadPoolExecutor(max_workers=4)
        self._genai_configured = False

    def _ensure_genai(self):
        if not self._genai_configured:
            if not self.api_key:
                raise ValueError("GEMINI_API_KEY not found in environment")
            genai.configure(api_key=self.api_key)
            self._genai_configured = True

    def _get_model(self, tier="Frontier"):
        self._ensure_genai()
        model_name = MODEL_TIERS.get(tier, MODEL_TIERS["Frontier"])
        return genai.GenerativeModel(model_name)

    async def score_asset_compliance(self, image_path: str, asset_id: str, target_score: int = 90) -> Dict[str, Any]:
        """Score an asset's visual compliance using Gemini Vision series 3.1."""
        if not os.path.exists(image_path):
            return {"error": f"Image not found at {image_path}"}

        loop = asyncio.get_event_loop()
        for tier in ["Frontier", "Performance", "LTS"]:
            try:
                model = self._get_model(tier)
                logger.info(f"Attempting compliance score with {tier} model...")

                prompt = f"""
                Analyze this KR Solidarity asset (ID: {asset_id}).
                Task: Strict visual compliance audit against KR Solidarity v6.x standards.
                1. Extract visual data: tokens (--sys-color-*, --sys-type-*), geometry (asymmetry), palette, motif placement.
                2. Score against these dimensions (0-20 each): Token Compliance, Wireframe Fidelity, Manifest Integrity, Visual Quality, Solidarity Intent.

                Return ONLY valid JSON:
                {{
                  "overall_score": <sum_0_to_100>,
                  "decision": "PACKAGE" | "REGENERATE",
                  "tier_used": "{tier}",
                  "checks": {{
                    "token_compliance": <score>,
                    "wireframe_fidelity": <score>,
                    "manifest_integrity": <score>,
                    "visual_quality": <score>,
                    "solidarity_intent": <score>
                  }},
                  "violations": [],
                  "actions": []
                }}
                """

                def blocking_call():
                    with open(image_path, "rb") as f:
                        image_data = f.read()
                    return model.generate_content([
                        prompt,
                        {"mime_type": "image/png", "data": image_data}
                    ])

                response = await loop.run_in_executor(self.executor, blocking_call)
                text = response.text.replace("```json", "").replace("```", "").strip()
                result = json.loads(text)

                if result.get("overall_score", 0) < target_score:
                    result["decision"] = "REGENERATE"
                else:
                    result["decision"] = "PACKAGE"

                return result

            except Exception as e:
                logger.warning(f"{tier} tier failed for {asset_id}: {e}")
                continue

        return {"decision": "MANUAL_REVIEW", "error": "All vision tiers failed."}

    async def extract_visual_tokens(self, image_path: str) -> Dict[str, Any]:
        """Extract design tokens using Performance tier."""
        if not os.path.exists(image_path):
            return {"error": f"Image not found at {image_path}"}

        loop = asyncio.get_event_loop()
        try:
            model = self._get_model("Performance")
            prompt = """
            Extract visual design tokens from this KR Solidarity image.
            Return JSON with: tokens { color_sys[], type_sys[] }, composition { layers_count, focal_point, motif_archetype }, density.
            """

            def blocking_call():
                with open(image_path, "rb") as f:
                    image_data = f.read()
                return model.generate_content([
                    prompt,
                    {"mime_type": "image/png", "data": image_data}
                ])

            response = await loop.run_in_executor(self.executor, blocking_call)
            text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(text)

        except Exception as e:
            return {"error": str(e)}

    async def compare_attempts(self, attempt_paths: List[str]) -> Dict[str, Any]:
        """Compare multiple attempts using Frontier reasoning."""
        valid_paths = [p for p in attempt_paths if os.path.exists(p)]
        if not valid_paths:
            return {"error": "No valid image paths provided"}

        loop = asyncio.get_event_loop()
        try:
            model = self._get_model("Frontier")
            prompt = """
            Compare these KR Solidarity attempts. Analyze the progression of 'Solidarity Mode' fidelity.
            Return JSON: { "progression": [], "best_attempt_index": int, "pattern_learnings": [] }
            """

            def blocking_call():
                inputs = [prompt]
                for p in valid_paths:
                    with open(p, "rb") as f:
                        inputs.append({"mime_type": "image/png", "data": f.read()})
                return model.generate_content(inputs)

            response = await loop.run_in_executor(self.executor, blocking_call)
            text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(text)

        except Exception as e:
            return {"error": str(e)}

    def list_tools(self):
        return [
            {
                "name": "score_asset_compliance",
                "description": "Score an asset's visual compliance using Gemini Vision series 3.1.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "image_path": {"type": "string"},
                        "asset_id": {"type": "string"},
                        "target_score": {"type": "integer", "default": 90}
                    },
                    "required": ["image_path", "asset_id"]
                }
            },
            {
                "name": "extract_visual_tokens",
                "description": "Extract design tokens (colors, density, objects) using Performance tier.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "image_path": {"type": "string"}
                    },
                    "required": ["image_path"]
                }
            },
            {
                "name": "compare_attempts",
                "description": "Compare multiple attempts using Frontier reasoning.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "attempt_paths": {"type": "array", "items": {"type": "string"}}
                    },
                    "required": ["attempt_paths"]
                }
            }
        ]

    async def call_tool(self, name: str, arguments: Dict[str, Any]):
        if name == "score_asset_compliance":
            return [await self.score_asset_compliance(**arguments)]
        elif name == "extract_visual_tokens":
            return [await self.extract_visual_tokens(**arguments)]
        elif name == "compare_attempts":
            return [await self.compare_attempts(**arguments)]
        else:
            raise ValueError(f"Unknown tool: {name}")

async def handle_request(server, line):
    try:
        req = json.loads(line)
        if req.get("method") == "initialize":
            return {
                "jsonrpc": "2.0",
                "id": req.get("id"),
                "result": {
                    "protocolVersion": "2024-11-05",
                    "capabilities": {"tools": {}},
                    "serverInfo": {"name": "vision-scorer-mcp", "version": "1.1.0"}
                }
            }
        elif req.get("method") == "tools/list":
            return {
                "jsonrpc": "2.0",
                "id": req.get("id"),
                "result": {"tools": server.list_tools()}
            }
        elif req.get("method") == "tools/call":
            content = await server.call_tool(req["params"]["name"], req["params"]["arguments"])
            return {
                "jsonrpc": "2.0",
                "id": req.get("id"),
                "result": {"content": [{"type": "text", "text": json.dumps(content, indent=2)}]}
            }
        return None
    except Exception as e:
        logger.error(f"Error handling request: {e}")
        return None

async def main():
    server = VisionScorerServer()
    logger.info("Vision Scorer Server started (Manual RPC Mode)")
    loop = asyncio.get_event_loop()
    while True:
        try:
            line = await loop.run_in_executor(None, sys.stdin.readline)
            if not line: break
            resp = await handle_request(server, line)
            if resp:
                print(json.dumps(resp))
                sys.stdout.flush()
        except KeyboardInterrupt: break
        except Exception as e:
            logger.error(f"Main loop error: {e}")
            break

if __name__ == "__main__":
    asyncio.run(main())
