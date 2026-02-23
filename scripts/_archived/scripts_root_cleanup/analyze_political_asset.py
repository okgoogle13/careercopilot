#!/usr/bin/env python3

"""
kr-solidarity v3.0.0 Political Asset Analyzer
Analyzes political/cultural assets for the kr-solidarity design system using Gemini Vision API.

Usage:
    from analyze_political_asset import analyze_political_asset
    analysis = analyze_political_asset("/path/to/asset.png")
    print(analysis)

Dependencies:
    pip install google-generativeai Pillow
"""

import json
import os
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Optional, List, Dict, Any
from PIL import Image

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False
    print("⚠️  google-generativeai not installed. Install with: pip install google-generativeai")

# ============================================================================
# DATA CLASSES
# ============================================================================

@dataclass
class PoliticalAssetAnalysis:
    """Analysis result for a kr-solidarity political asset."""
    category: str  # devotional, portrait, symbol, street, abstract, texture
    political_significance: str  # cultural-anchor, resistance-history, activist, devotional, solidarity
    text_content: Optional[str]
    detected_symbols: List[str]
    visual_anchor_details: Dict[str, Optional[str]] # halo, framing, subject
    style: str  # screenprint, wheat-paste, etching, etc.
    color_palette: Dict[str, str]  # hex codes
    intended_context: str
    historical_reference: Optional[str]
    confidence: float  # 0.0-1.0
    analysis_notes: str


# ============================================================================
# GEMINI VISION ANALYZER
# ============================================================================

POLITICAL_ASSET_PROMPT = """Analyze this political/cultural asset for the kr-solidarity design system.

CATEGORIES: devotional, portrait, symbol, street, abstract, texture

POLITICAL SIGNIFICANCE: cultural-anchor, resistance-history, activist, devotional, solidarity

Extract and return JSON:
{
  "category": "portrait|devotional|symbol|street|abstract|texture",
  "political_significance": "cultural-anchor|resistance-history|activist|devotional|solidarity",
  "text_content": "exact text if present or null",
  "detected_symbols": ["list", "of", "cultural/political", "symbols"],
  "visual_anchor_details": {
    "halo": "color/style of halo if present or null",
    "framing": "framing elements like palm fronds, brick, etc. or null",
    "subject": "primary visual subject description"
  },
  "style": "screenprint|wheat-paste|etching|painting|photograph|mixed",
  "color_palette": {"primary": "#HEX", "secondary": "#HEX", "accent": "#HEX"},
  "intended_context": "2-3 sentence description of intended use",
  "historical_reference": "historical figure, movement, or event (if applicable)",
  "cultural_safety_flags": ["flag1", "flag2"] or [],
  "analysis_notes": "brief notes on composition, authenticity, aesthetic quality"
}

Be concise. Focus on political/cultural significance and visual anchors that align with a screenprint/street-art aesthetic."""


def get_genai_client():
    """Initialize Gemini API client."""
    if not GENAI_AVAILABLE:
        raise ImportError(
            "google-generativeai not installed. "
            "Install with: pip install google-generativeai"
        )

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise EnvironmentError(
            "GEMINI_API_KEY not set. "
            "Provide Gemini API key via environment variable."
        )

    genai.configure(api_key=api_key)
    return genai


def analyze_political_asset(image_path: str) -> PoliticalAssetAnalysis:
    """
    Analyze political/cultural asset using Gemini Vision API.

    Args:
        image_path: Path to PNG file

    Returns:
        PoliticalAssetAnalysis with extracted metadata
    """

    if not Path(image_path).exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    print(f"🔍 Analyzing political asset: {Path(image_path).name}")

    try:
        get_genai_client()

        # Load image
        with open(image_path, "rb") as f:
            image_data = f.read()

        # Get image dimensions
        img = Image.open(image_path)
        width, height = img.size
        print(f"  • Dimensions: {width}×{height}")

        # Call Gemini Vision API
        print("  • Analyzing with Gemini Vision API...")
        model = genai.GenerativeModel("gemini-flash-latest")
        response = model.generate_content([
            POLITICAL_ASSET_PROMPT,
            {"mime_type": "image/png", "data": image_data}
        ])

        # Parse response
        response_text = response.text

        # Extract JSON from response
        try:
            # Try to find JSON in response
            if "```json" in response_text:
                json_str = response_text.split("```json")[1].split("```")[0].strip()
            elif "{" in response_text:
                # Extract JSON object
                start = response_text.find("{")
                end = response_text.rfind("}") + 1
                json_str = response_text[start:end]
            else:
                json_str = response_text

            data = json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"  ⚠️  Could not parse JSON response: {e}")
            print(f"  Response: {response_text[:200]}")
            # Return safe fallback
            data = {
                "category": "abstract",
                "political_significance": "solidarity",
                "text_content": None,
                "detected_symbols": [],
                "visual_anchor_details": {"halo": None, "framing": None, "subject": "abstract shape"},
                "style": "mixed",
                "color_palette": {"primary": "#1A1714", "secondary": "#D4A84B"},
                "intended_context": "Political/cultural asset",
                "historical_reference": None,
                "cultural_safety_flags": [],
                "analysis_notes": "Fallback analysis due to parsing error"
            }

        # Create analysis object
        analysis = PoliticalAssetAnalysis(
            category=data.get("category", "abstract"),
            political_significance=data.get("political_significance", "solidarity"),
            text_content=data.get("text_content"),
            detected_symbols=data.get("detected_symbols", []),
            visual_anchor_details=data.get("visual_anchor_details", {"halo": None, "framing": None, "subject": None}),
            style=data.get("style", "mixed"),
            color_palette=data.get("color_palette", {}),
            intended_context=data.get("intended_context", ""),
            historical_reference=data.get("historical_reference"),
            confidence=0.85,  # Gemini analysis confidence
            analysis_notes=data.get("analysis_notes", "")
        )

        print(f"  ✅ Analysis complete")
        print(f"     Category: {analysis.category}")
        print(f"     Significance: {analysis.political_significance}")
        if analysis.text_content:
            print(f"     Text: '{analysis.text_content}'")

        return analysis

    except Exception as e:
        print(f"  ❌ Analysis failed: {e}")
        # Return safe fallback on error
        return PoliticalAssetAnalysis(
            category="abstract",
            political_significance="solidarity",
            text_content=None,
            detected_symbols=[],
            visual_anchor_details={"halo": None, "framing": None, "subject": "error fallback"},
            style="mixed",
            color_palette={"primary": "#1A1714", "secondary": "#D4A84B"},
            intended_context="Analysis failed",
            historical_reference=None,
            confidence=0.0,
            analysis_notes=f"Analysis failed: {str(e)}"
        )


# ============================================================================
# CLI USAGE
# ============================================================================

if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python analyze_political_asset.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    analysis = analyze_political_asset(image_path)

    print("\n" + "=" * 80)
    print("POLITICAL ASSET ANALYSIS")
    print("=" * 80)
    print(json.dumps(asdict(analysis), indent=2))
