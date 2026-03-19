#!/usr/bin/env python3
from __future__ import annotations

import json
import os
from pathlib import Path

from google import genai
from google.genai import types

ROOT = Path(__file__).resolve().parents[1]
QUEUE_PATH = ROOT / "ai" / "queue.json"
OUTPUT_DIR = ROOT / "public" / "hero" / "generated"

MODEL = os.getenv("GEMINI_IMAGE_MODEL", "gemini-3-pro-image-preview")
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise SystemExit("Missing GEMINI_API_KEY")

client = genai.Client(api_key=API_KEY)

def load_queue() -> dict:
    return json.loads(QUEUE_PATH.read_text(encoding="utf-8"))

def save_queue(data: dict) -> None:
    QUEUE_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

def combined_prompt(asset: dict) -> str:
    return f"""
Asset ID: {asset["id"]}
Filename: {asset["filename"]}
Usage: {asset["usage"]}

Prompt:
{asset["prompt"]}

Negative prompt:
{asset["negative_prompt"]}

Output contract:
- Generate exactly one image.
- No collage grid.
- No extra text unless explicitly requested.
- Preserve style consistency with the rest of the queue.
- Return a single final image only.
""".strip()

def generate_asset(asset: dict) -> None:
    aspect_ratio = asset["aspect_ratio"]
    image_size = asset.get("image_size", "2K")

    response = client.models.generate_content(
        model=MODEL,
        contents=combined_prompt(asset),
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE"],
            image_config=types.ImageConfig(
                aspect_ratio=aspect_ratio,
                image_size=image_size,
            ),
        ),
    )

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUTPUT_DIR / asset["filename"]

    saved = False
    for part in getattr(response, "parts", []) or []:
        try:
            image = part.as_image()
        except Exception:
            image = None
        if image is not None:
            image.save(out_path)
            saved = True
            break

    if not saved:
        # candidate fallback
        for cand in getattr(response, "candidates", []) or []:
            for part in getattr(getattr(cand, "content", None), "parts", []) or []:
                try:
                    image = part.as_image()
                except Exception:
                    image = None
                if image is not None:
                    image.save(out_path)
                    saved = True
                    break
            if saved:
                break

    if not saved:
        raise RuntimeError(f"No image returned for {asset['id']}")

def main() -> None:
    queue = load_queue()
    for asset in queue["assets"]:
        if asset["status"] not in {"PENDING", "FAILED"}:
            continue
        try:
            print(f"Generating {asset['id']} -> {asset['filename']}")
            generate_asset(asset)
            asset["status"] = "DONE"
            save_queue(queue)
        except Exception as exc:
            asset["status"] = "FAILED"
            asset["error"] = str(exc)
            save_queue(queue)
            print(f"FAILED: {asset['id']}: {exc}")

if __name__ == "__main__":
    main()
