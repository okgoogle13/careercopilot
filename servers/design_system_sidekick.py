#!/usr/bin/env python3
"""
MCP Design System Sidekick - Northcote Curio Validation & Asset Orchestration

Specialized MCP server bridging Claude Desktop's creative direction with
programmatic asset validation and implementation synthesis.
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
import openai
from openai import AsyncOpenAI
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
    load_dotenv(os.path.join(project_root, '.env'))
except ImportError:
    pass

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [DesignSystemSidekick] - %(message)s',
    handlers=[logging.FileHandler('/tmp/mcp-design-system-sidekick.log')]
)
logger = logging.getLogger("DesignSystemSidekick")

# Initialize Sentry
if os.getenv("SENTRY_DSN"):
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        send_default_pii=True,
        environment=os.getenv("ENV", "development"),
    )
    logger.info("Sentry SDK initialized")

GEMINI_VISION_CANDIDATES = [
    os.getenv("GEMINI_VISION_MODEL_PRIMARY", "gemini-3-pro-image-preview"),  # Nano Banana Pro
    os.getenv("GEMINI_VISION_MODEL_FALLBACK", "gemini-2.5-flash-image"),     # 2.5 Flash Image
    "gemini-1.5-pro",
]

class DesignSystemSidekickServer:
    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY", "")
        self.github_token = os.getenv("GITHUB_TOKEN", os.getenv("GH_TOKEN", ""))

        # Initialize Gemini
        if self.gemini_key:
            genai.configure(api_key=self.gemini_key)
            self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.gemini_model = None

        # Initialize GitHub Models (via GITHUB_TOKEN)
        self.openai_client = None
        if self.github_token:
            self.openai_client = AsyncOpenAI(
                api_key=self.github_token,
                base_url="https://models.inference.ai.azure.com"
            )

        self.executor = ThreadPoolExecutor(max_workers=5)
        logger.info("Design System Sidekick initialized with Gemini and OpenAI fallback")

    def list_tools(self):
        return [
            {
                "name": "validate_asset_compliance",
                "description": "Validate DALL-E output against Northcote compliance scorecard",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "asset_id": {"type": "string"},
                        "image_path": {"type": "string"}
                    },
                    "required": ["asset_id"]
                }
            },
            {
                "name": "generate_implementation_package",
                "description": "Generate Implementation Package for validated asset",
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

    def _get_vision_model(self):
        if not self.gemini_key:
            return None
        import google.generativeai as genai
        try:
            genai.configure(api_key=self.gemini_key)
            for name in GEMINI_VISION_CANDIDATES:
                try:
                    # Quick check to see if model exists
                    model = genai.GenerativeModel(name)
                    return model
                except Exception:
                    continue
        except Exception as e:
            logger.error(f"Gemini configuration error: {e}")
        return None

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
                return client.complete(
                    messages=messages,
                    model="openai/gpt-4.1-mini"
                )

            loop = asyncio.get_event_loop()
            resp = await loop.run_in_executor(self.executor, sync_gh_call)
            return resp.choices[0].message.content
        except Exception as e:
            logger.error(f"GitHub Models vision fallback failed: {e}")
            sentry_sdk.capture_exception(e)
            return None

    async def _call_llm_async(self, prompt, json_mode=False):
        """Standard text fallback (Gemini -> GitHub Models)."""
        # --- Gemini Try ---
        if self.gemini_model:
            try:
                loop = asyncio.get_event_loop()
                def sync_call():
                    config = {}
                    if json_mode:
                        config = {"response_mime_type": "application/json"}
                    resp = self.gemini_model.generate_content(prompt, generation_config=config if config else None)
                    return resp.text if resp else None

                result = await loop.run_in_executor(self.executor, sync_call)
                if result:
                    return result
            except Exception as e:
                logger.warning(f"Gemini failed in DesignSidekick, trying GitHub Models... Error: {e}")
                sentry_sdk.capture_message("Gemini failed in DesignSidekick, falling back", level="warning")

        # --- GitHub Models Fallback ---
        if self.github_token and ChatCompletionsClient:
            try:
                client = ChatCompletionsClient(
                    endpoint="https://models.github.ai/inference",
                    credential=AzureKeyCredential(self.github_token),
                )

                def sync_gh_text_call():
                    return client.complete(
                        messages=[{"role": "user", "content": prompt}],
                        model="openai/gpt-4.1-mini"
                    )

                loop = asyncio.get_event_loop()
                resp = await loop.run_in_executor(self.executor, sync_gh_text_call)
                return resp.choices[0].message.content
            except Exception as e:
                logger.error(f"GitHub Models fallback failed in DesignSidekick: {e}")
                sentry_sdk.capture_exception(e)
                return f"Error: LLM engines failed. Gemini unavailable and GitHub Models error: {str(e)}"

        return "Error: No LLM engines available (missing keys or initialization failure)."

    async def call_tool(self, name, args):
        if name == "validate_asset_compliance":
            asset_id = args.get("asset_id")
            image_path = args.get("image_path")

            if not image_path or not os.path.exists(image_path):
                return [{"type": "text", "text": json.dumps({"error": f"Image path not found: {image_path}"})}]

            prompt = f"""
            Validate the following asset for Northcote compliance:
            Asset ID: {asset_id}

            Focus on: Palette consistency, geometric precision, lighting balance, and typography.

            Return ONLY a JSON object with:
            - compliance: boolean
            - score: integer (0-100)
            - issues: list of strings
            - summary: string
            """

            backend = "gemini"
            result_text = None

            # 1. Try Gemini Vision Cascade
            model = self._get_vision_model()
            if model:
                try:
                    with open(image_path, "rb") as f:
                        img_bytes = f.read()

                    loop = asyncio.get_event_loop()
                    def sync_gemini_vision():
                        config = {"response_mime_type": "application/json"}
                        # Handle different model types if needed, but genai library usually handles binary well
                        resp = model.generate_content([prompt, {"mime_type": "image/jpeg", "data": img_bytes}], generation_config=config)
                        return resp.text

                    result_text = await loop.run_in_executor(self.executor, sync_gemini_vision)
                except Exception as e:
                    logger.warning(f"Gemini vision failed: {e}")

            # 2. Fallback to GitHub Models Vision
            if not result_text:
                backend = "openai-github-models"
                result_text = await self._call_gh_vision_async(prompt, image_path)

            if not result_text:
                return [{"type": "text", "text": json.dumps({"error": "All vision models failed"})}]

            try:
                # Normalize result
                data = json.loads(result_text)
                final_output = {
                    "asset_id": asset_id,
                    "backend": backend,
                    "compliance": data.get("compliance", data.get("compliant", False)),
                    "score": data.get("score", 0),
                    "issues": data.get("issues", data.get("violations", [])),
                    "summary": data.get("summary", data.get("recommendations", ["No summary provided"])[0] if data.get("recommendations") else "Validated")
                }
                return [{"type": "text", "text": json.dumps(final_output)}]
            except Exception as e:
                return [{"type": "text", "text": json.dumps({"error": "Failed to parse LLM response", "raw": result_text, "exception": str(e)})}]

        elif name == "generate_implementation_package":
            asset_id = args.get("asset_id")
            metadata = args.get("asset_metadata", {})

            prompt = f"""
            Generate an implementation package for Asset {asset_id}.
            Metadata: {json.dumps(metadata)}

            Provide a detailed plan covering:
            1. CSS Tokens required
            2. React Component structure
            3. Animation specs
            """

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
                "serverInfo": {"name": "design-system-sidekick", "version": "1.0.0"}
            }
        elif req.get("method") == "tools/list":
            resp["result"] = {"tools": server.list_tools()}
        elif req.get("method") == "tools/call":
            content = await server.call_tool(
                req["params"]["name"],
                req["params"]["arguments"]
            )
            resp["result"] = {"content": content}
        else:
            return None
        return resp
    except Exception as e:
        logger.error(f"Error: {e}")
        return None

async def main():
    server = DesignSystemSidekickServer()
    logger.info("Server started")
    loop = asyncio.get_event_loop()

    while True:
        try:
            line = await loop.run_in_executor(None, sys.stdin.readline)
            if not line: break

            resp = await handle_request(server, line)
            if resp:
                print(json.dumps(resp))
                sys.stdout.flush()
        except KeyboardInterrupt:
            break
        except Exception as e:
            logger.error(f"Fatal: {e}")
            break

if __name__ == "__main__":
    asyncio.run(main())
