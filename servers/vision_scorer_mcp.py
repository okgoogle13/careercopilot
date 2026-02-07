#!/usr/bin/env python3
"""
Vision-Scorer MCP Server
Programmatic visual compliance validation using Gemini Vision API.
"""

from mcp.server.fastmcp import FastMCP
import os
import json
import google.generativeai as genai
from typing import Dict, Any, List, Optional
import base64

# Configuration
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

mcp = FastMCP("vision-scorer-mcp")

# Global state for lazy loading
_genai_configured = False

def _ensure_genai():
    global _genai_configured
    if not _genai_configured:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment")
        genai.configure(api_key=api_key)
        _genai_configured = True

@mcp.tool()
def score_asset_compliance(image_path: str, asset_id: str, target_score: int = 90) -> Dict[str, Any]:
    """Score an asset's visual compliance using Gemini Vision."""
    if not os.path.exists(image_path):
        return {"error": f"Image not found at {image_path}"}

    try:
        _ensure_genai()
        model = genai.GenerativeModel('gemini-2.0-flash')

        prompt = f"""
        Analyze this Northcote Curio asset (ID: {asset_id}).

        Task: Perform a strict visual compliance audit against the Northcote Design System.

        1. Extract visual data:
           - Hex colors (dominant + accents)
           - Specimen identification (if organic)
           - Density analysis (upper-left, center, lower-right)
           - Translucency check
           - Typography validation (if present)

        2. Score against these dimensions (0-20 each):
           - Geographic Authenticity (Australian flora/fauna correctness)
           - Translucency Physics (Light interaction, x-ray effects)
           - Scale Hierarchy (Clear focal point, correct proportions)
           - Density Zones (Proper negative space vs detail)
           - Background Color (Correct deep charcoal/paper tones)
           - Typography (If present: font family, kerning, color)

        Return ONLY valid JSON:
        {{
          "overall_score": <sum_0_to_100>,
          "decision": "PACKAGE" | "REGENERATE",
          "dimensions": {{
            "geographic_authenticity": <score>,
            "translucency_physics": <score>,
            "scale_hierarchy": <score>,
            "density_zones": <score>,
            "background_color": <score>,
            "typography": <score>
          }},
          "violations": ["list", "of", "issues"],
          "correction_prompt": "Specific instructions to fix issues..."
        }}
        """

        with open(image_path, "rb") as f:
            image_data = f.read()

        response = model.generate_content([
            prompt,
            {"mime_type": "image/png", "data": image_data} # Assuming PNG, but API handles others
        ])

        # Parse JSON from response
        text = response.text.replace("```json", "").replace("```", "").strip()
        result = json.loads(text)

        # Force decision based on provided target_score
        if result.get("overall_score", 0) < target_score:
            result["decision"] = "REGENERATE"
        else:
            result["decision"] = "PACKAGE"

        return result

    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def extract_visual_tokens(image_path: str) -> Dict[str, Any]:
    """Extract design tokens (colors, density, objects) from an image."""
    if not os.path.exists(image_path):
        return {"error": f"Image not found at {image_path}"}

    try:
        _ensure_genai()
        model = genai.GenerativeModel('gemini-2.0-flash')

        prompt = """
        Extract visual design tokens from this image.
        Return JSON with:
        - colors: { background, dominant[], accents[] }
        - specimens: [{ name, size_est, position }]
        - density: { upper_left: 0-100, lower_right: 0-100, central: 0-100 }
        """

        with open(image_path, "rb") as f:
            image_data = f.read()

        response = model.generate_content([
            prompt,
            {"mime_type": "image/png", "data": image_data}
        ])

        text = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(text)

    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def compare_attempts(attempt_paths: List[str]) -> Dict[str, Any]:
    """Compare multiple image attempts and analyze progression."""
    valid_paths = [p for p in attempt_paths if os.path.exists(p)]
    if not valid_paths:
        return {"error": "No valid image paths provided"}

    try:
        _ensure_genai()
        model = genai.GenerativeModel('gemini-2.0-flash')

        prompt = """
        Compare these image attempts in order.
        Analyze the progression of visual quality and compliance.
        Return JSON:
        {
          "progression": [
            { "attempt": index, "score": 0-100, "key_failure": "...", "improvement": "..." }
          ],
          "best_attempt_index": int,
          "pattern_learnings": ["what worked", "what didn't"]
        }
        """

        inputs = [prompt]
        for p in valid_paths:
            with open(p, "rb") as f:
                inputs.append({"mime_type": "image/png", "data": f.read()})

        response = model.generate_content(inputs)

        text = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(text)

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    mcp.run()
