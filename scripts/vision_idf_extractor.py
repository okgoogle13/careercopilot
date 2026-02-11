#!/usr/bin/env python3

"""
Vision API IDF Metadata Extractor
Extracts image description format (colors, kr-motifs, dimensions) from PNG files
using Google Cloud Vision API.

Usage:
    from vision_idf_extractor import extract_idf_from_image
    idf = extract_idf_from_image("/path/to/image.png")
    print(idf)

Dependencies:
    pip install google-cloud-vision Pillow
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Any, Optional
from PIL import Image

try:
    from google.cloud import vision
    VISION_AVAILABLE = True
except ImportError:
    VISION_AVAILABLE = False
    print("⚠️  google-cloud-vision not installed. Install with: pip install google-cloud-vision")

# ============================================================================
# CONFIGURATION
# ============================================================================

# Design token color mapping (hex to token name)
COLOR_TOKEN_MAP = {
    "#D4A84B": "wattle-gold",
    "#d4a84b": "wattle-gold",
    "#C45C4B": "waratah-red",
    "#c45c4b": "waratah-red",
    "#B8733D": "ochre-earth",
    "#b8733d": "ochre-earth",
    "#7A9E82": "gum-leaf-green",
    "#7a9e82": "gum-leaf-green",
    "#1A1714": "asphalt-black",
    "#1a1714": "asphalt-black",
    "#F5F0E8": "paper-white",
    "#f5f0e8": "paper-white",
}

# Australian endemic flora (kr-motifs whitelist)
KR_MOTIFS_WHITELIST = {
    "wattle",
    "acacia",
    "eucalyptus",
    "gum",
    "gum leaf",
    "eucalyptus leaf",
    "leaf",
    "leaves",
    "waratah",
    "banksia",
    "fern",
    "native fern",
    "spider web",
    "beetle",
    "flying fox",
    "lichen",
    "moss",
    "botanical",
    "flora",
    "plant",
    "flower",
}

# ============================================================================
# VISION API FUNCTIONS
# ============================================================================

def get_vision_client():
    """Initialize Google Cloud Vision API client."""
    if not VISION_AVAILABLE:
        raise ImportError(
            "google-cloud-vision not installed. "
            "Install with: pip install google-cloud-vision"
        )

    # Check for credentials
    if not os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
        raise EnvironmentError(
            "GOOGLE_APPLICATION_CREDENTIALS not set. "
            "Provide path to service account JSON."
        )

    return vision.ImageAnnotatorClient()


def detect_labels(image_path: str, client: Optional[vision.ImageAnnotatorClient] = None) -> List[str]:
    """Detect labels (entities) in image using Vision API."""
    if client is None:
        client = get_vision_client()

    with open(image_path, "rb") as f:
        image_content = f.read()

    image = vision.Image(content=image_content)
    response = client.label_detection(image=image)

    labels = [label.description.lower() for label in response.label_annotations]
    return labels


def detect_colors(
    image_path: str, client: Optional[vision.ImageAnnotatorClient] = None
) -> Dict[str, float]:
    """Detect dominant colors using Vision API."""
    if client is None:
        client = get_vision_client()

    with open(image_path, "rb") as f:
        image_content = f.read()

    image = vision.Image(content=image_content)
    response = client.image_properties(image=image)

    colors = {}
    if response.image_properties and response.image_properties.dominant_colors:
        for color in response.image_properties.dominant_colors.colors:
            # Convert RGB to hex
            r = int(color.color.red)
            g = int(color.color.green)
            b = int(color.color.blue)
            hex_color = f"#{r:02x}{g:02x}{b:02x}".upper()

            # Map to token if available
            token = COLOR_TOKEN_MAP.get(hex_color.lower(), hex_color)
            colors[hex_color] = token

    return colors


def get_image_dimensions(image_path: str) -> Dict[str, int]:
    """Extract image dimensions from PNG file."""
    try:
        img = Image.open(image_path)
        width, height = img.size
        return {"width": width, "height": height, "format": "PNG"}
    except Exception as e:
        print(f"⚠️  Could not extract dimensions: {e}")
        return {"width": 1024, "height": 1024, "format": "PNG"}  # Fallback


def filter_kr_motifs(labels: List[str]) -> List[str]:
    """Filter detected labels for Australian endemic flora."""
    kr_motifs = []

    for label in labels:
        # Direct match
        if label in KR_MOTIFS_WHITELIST:
            kr_motifs.append(label)
            continue

        # Partial match (label contains whitelist term)
        for motif in KR_MOTIFS_WHITELIST:
            if motif in label and label not in kr_motifs:
                kr_motifs.append(label)
                break

    # Deduplicate and limit
    kr_motifs = list(dict.fromkeys(kr_motifs))[:5]  # Max 5 motifs

    return kr_motifs or ["botanical"]  # Fallback


def map_colors_to_tokens(colors_dict: Dict[str, str]) -> Dict[str, List[str]]:
    """Map detected colors to design tokens."""
    primary = []
    secondary = []
    palette = {"primary": primary, "secondary": secondary}

    for hex_color, token_name in colors_dict.items():
        if token_name not in primary and token_name not in secondary:
            if len(primary) < 2:
                primary.append(token_name)
            elif len(secondary) < 2:
                secondary.append(token_name)

    return palette


def infer_purpose(labels: List[str]) -> str:
    """Infer asset purpose from detected labels."""
    text = " ".join(labels).lower()

    if any(word in text for word in ["background", "texture", "pattern", "tile"]):
        return "background-texture"
    elif any(word in text for word in ["landscape", "scenery", "nature", "botanical"]):
        return "botanical-accent"
    elif any(word in text for word in ["abstract", "geometric", "shape"]):
        return "decorative-motif"
    else:
        return "general-background"


# ============================================================================
# MAIN EXTRACTION FUNCTION
# ============================================================================

def extract_idf_from_image(image_path: str, client: Optional[vision.ImageAnnotatorClient] = None) -> Dict[str, Any]:
    """
    Extract IDF (Image Description Format) metadata from PNG image.

    Args:
        image_path: Path to PNG file
        client: Optional pre-initialized Vision API client

    Returns:
        Dictionary with IDF metadata:
        {
            "colors": {"primary": ["wattle-gold"], "secondary": ["asphalt-black"]},
            "kr_motifs": ["wattle", "leaf"],
            "dimensions": {"width": 1024, "height": 1024, "format": "PNG"},
            "mode": "kr-dark",
            "purpose": "botanical-accent",
            "confidence": 0.85
        }
    """

    if not Path(image_path).exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    print(f"🔍 Extracting metadata from: {Path(image_path).name}")

    try:
        if client is None:
            client = get_vision_client()

        # Extract components
        print("  • Detecting labels...")
        labels = detect_labels(image_path, client)

        print("  • Detecting colors...")
        colors_raw = detect_colors(image_path, client)

        print("  • Extracting dimensions...")
        dimensions = get_image_dimensions(image_path)

        # Process extractions
        kr_motifs = filter_kr_motifs(labels)
        color_tokens = map_colors_to_tokens(colors_raw)
        purpose = infer_purpose(labels)

        # Confidence score (based on label count + color detection)
        confidence = min(0.95, (len(labels) / 10.0 + len(colors_raw) / 5.0) / 2.0)

        idf = {
            "colors": color_tokens,
            "kr_motifs": kr_motifs,
            "dimensions": dimensions,
            "mode": "kr-dark",
            "purpose": purpose,
            "confidence": round(confidence, 2),
            "detected_labels": labels[:10],  # First 10 for reference
            "detected_colors": list(colors_raw.keys()),  # Raw hex colors
        }

        print(f"  ✅ Extraction complete (confidence: {confidence:.0%})")
        return idf

    except Exception as e:
        print(f"  ❌ Extraction failed: {e}")
        # Return safe fallback
        return {
            "colors": {"primary": ["wattle-gold"], "secondary": ["asphalt-black"]},
            "kr_motifs": ["botanical"],
            "dimensions": get_image_dimensions(image_path),
            "mode": "kr-dark",
            "purpose": "general-background",
            "confidence": 0.0,
            "error": str(e),
        }


# ============================================================================
# CLI USAGE
# ============================================================================

if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python vision_idf_extractor.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    idf_data = extract_idf_from_image(image_path)

    print("\n" + "=" * 80)
    print("IDF METADATA")
    print("=" * 80)
    print(json.dumps(idf_data, indent=2))
