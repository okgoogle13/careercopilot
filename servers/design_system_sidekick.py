#!/usr/bin/env python3
"""
MCP Design System Sidekick - Validation & Asset Orchestration (KR Solidarity)
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
import google.generativeai as genai
from concurrent.futures import ThreadPoolExecutor

try:
    from azure.ai.inference import ChatCompletionsClient
    from azure.core.credentials import AzureKeyCredential
except ImportError:
    ChatCompletionsClient = None
    AzureKeyCredential = None

try:
    from dotenv import load_dotenv
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    for env_name in ('.env.mcp', '.env'):
        load_dotenv(os.path.join(project_root, env_name), override=True)
except ImportError:
    pass

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [DesignSystemSidekick] - %(message)s',
    handlers=[logging.FileHandler('/tmp/mcp-design-system-sidekick.log')]
)
logger = logging.getLogger("DesignSystemSidekick")

# Initialize Sentry
sentry_dsn = os.getenv("SENTRY_DSN")
if sentry_dsn and sentry_dsn.startswith("http") and not sentry_dsn.startswith("${"):
    sentry_sdk.init(
        dsn=sentry_dsn,
        send_default_pii=True,
        environment=os.getenv("ENV", "development"),
    )
    logger.info("Sentry SDK initialized")

# Model Tiers (March 2026)
MODEL_TIERS = {
    "Frontier": os.getenv("GEMINI_FRONTIER_MODEL", "models/gemini-3.1-pro-preview"),
    "Performance": os.getenv("GEMINI_PERFORMANCE_MODEL", "models/gemini-3-flash-preview"),
    "Utility": os.getenv("GEMINI_UTILITY_MODEL", "models/gemini-3.1-flash-lite-preview"),
    "LTS": os.getenv("GEMINI_LTS_MODEL", "models/gemini-2.5-pro")
}

class DesignSystemSidekickServer:
    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY", "")
        self.github_token = os.getenv("GITHUB_TOKEN", os.getenv("GH_TOKEN", ""))
        self.executor = ThreadPoolExecutor(max_workers=5)

        if self.gemini_key:
            genai.configure(api_key=self.gemini_key)
            # Default to Performance for routine tasks
            self.pro_model = genai.GenerativeModel(MODEL_TIERS["Frontier"])
            self.flash_model = genai.GenerativeModel(MODEL_TIERS["Performance"])
        else:
            self.pro_model = None
            self.flash_model = None

        logger.info("Design System Sidekick (KR Solidarity) initialized")

    def list_tools(self):
        return [
            {
                "name": "validate_asset_compliance",
                "description": "Validate asset output against KR Solidarity compliance scorecard",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "asset_id": {"type": "string"},
                        "image_path": {"type": "string"}
                    },
                    "required": ["asset_id", "image_path"]
                }
            },
            {
                "name": "generate_implementation_package",
                "description": "Generate Implementation Package for validated KR asset",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "asset_id": {"type": "string"},
                        "asset_metadata": {"type": "object"}
                    },
                    "required": ["asset_id"]
                }
            }
        ]

    async def _call_gh_vision_async(self, prompt, image_path):
        """Fallback to GitHub Models vision."""
        if not ChatCompletionsClient or not self.github_token:
            return None

        try:
            if not os.path.exists(image_path):
                return None

            with open(image_path, "rb") as f:
                encoded_image = base64.b64encode(f.read()).decode("utf-8")

            client = ChatCompletionsClient(
                endpoint="https://models.github.ai/inference",
                credential=AzureKeyCredential(self.github_token),
            )

            messages = [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{encoded_image}"},
                        },
                    ],
                }
            ]

            def sync_gh_call():
                return client.complete(messages=messages, model="gpt-4o-mini")

            loop = asyncio.get_event_loop()
            resp = await loop.run_in_executor(self.executor, sync_gh_call)
            return resp.choices[0].message.content
        except Exception as e:
            logger.error(f"GitHub Models vision fallback failed: {e}")
            return None

    async def _call_llm_async(self, prompt, json_mode=False):
        """Standard text fallback (Gemini -> GitHub Models)."""
        if self.flash_model:
            try:
                loop = asyncio.get_event_loop()
                def sync_call():
                    config = {"response_mime_type": "application/json"} if json_mode else None
                    resp = self.flash_model.generate_content(prompt, generation_config=config)
                    return resp.text if resp else None

                result = await loop.run_in_executor(self.executor, sync_call)
                if result: return result
            except Exception as e:
                logger.warning(f"Gemini Performance failed, trying GitHub... Error: {e}")

        # GitHub Models Fallback
        if self.github_token and ChatCompletionsClient:
            try:
                client = ChatCompletionsClient(
                    endpoint="https://models.github.ai/inference",
                    credential=AzureKeyCredential(self.github_token),
                )
                loop = asyncio.get_event_loop()
                resp = await loop.run_in_executor(self.executor, lambda: client.complete(
                    messages=[{"role": "user", "content": prompt}],
                    model="gpt-4o-mini"
                ))
                return resp.choices[0].message.content
            except Exception as e:
                logger.error(f"Fallback failed: {e}")
                return f"Error: All LLM engines failed."

        return "Error: No LLM engines available."

    async def call_tool(self, name, args):
        if name == "validate_asset_compliance":
            asset_id = args.get("asset_id")
            image_path = args.get("image_path")

            if not image_path or not os.path.exists(image_path):
                return [{"type": "text", "text": json.dumps({"error": f"Image path missing: {image_path}"})}]

            prompt = f"""
            Validate the following asset for KR Solidarity compliance:
            Asset ID: {asset_id}
            Standards: Strictly verify for --sys-color tokens, asymmetric geometry, and Solidarity (Sage/Red/Gold) palette.
            Return ONLY JSON:
            {{ "compliance": boolean, "score": 0-100, "issues": [], "summary": "" }}
            """

            # Tiered Vision Cascade
            for tier_name in ["Performance", "Frontier", "LTS"]:
                try:
                    model = genai.GenerativeModel(MODEL_TIERS[tier_name])
                    with open(image_path, "rb") as f:
                        img_bytes = f.read()

                    loop = asyncio.get_event_loop()
                    def sync_gemini_vision():
                        config = {"response_mime_type": "application/json"}
                        resp = model.generate_content([prompt, {"mime_type": "image/jpeg", "data": img_bytes}], generation_config=config)
                        return resp.text

                    result_text = await loop.run_in_executor(self.executor, sync_gemini_vision)
                    if result_text:
                        data = json.loads(result_text)
                        return [{"type": "text", "text": json.dumps({**data, "asset_id": asset_id, "tier": tier_name})}]
                except Exception as e:
                    logger.warning(f"Tier {tier_name} failed: {e}")

            # Fallback to GitHub Models
            gh_result = await self._call_gh_vision_async(prompt, image_path)
            if gh_result:
                return [{"type": "text", "text": gh_result}]

            return [{"type": "text", "text": json.dumps({"error": "All vision models failed"})}]

        elif name == "generate_implementation_package":
            asset_id = args.get("asset_id")
            metadata = args.get("asset_metadata", {})
            prompt = f"Generate KR Solidarity implementation package for {asset_id}. Metadata: {json.dumps(metadata)}"
            result_text = await self._call_llm_async(prompt)
            return [{"type": "text", "text": result_text}]

        return [{"type": "text", "text": f"Unknown tool: {name}"}]

async def handle_request(server, line):
    try:
        req = json.loads(line)
        resp = {"jsonrpc": "2.0", "id": req.get("id")}
        if req.get("method") == "initialize":
            resp["result"] = {
                "protocolVersion": "2024-11-05",
                "capabilities": {"tools": {}},
                "serverInfo": {"name": "design-system-sidekick", "version": "1.1.0"}
            }
        elif req.get("method") == "tools/list":
            resp["result"] = {"tools": server.list_tools()}
        elif req.get("method") == "tools/call":
            content = await server.call_tool(req["params"]["name"], req["params"]["arguments"])
            resp["result"] = {"content": content}
        else: return None
        return resp
    except Exception as e:
        logger.error(f"Error handling request: {e}")
        return None

async def main():
    server = DesignSystemSidekickServer()
    logger.info("Server started (KR Solidarity v1.1.0)")
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
            logger.error(f"Fatal error in main loop: {e}")
            break

if __name__ == "__main__":
    asyncio.run(main())
