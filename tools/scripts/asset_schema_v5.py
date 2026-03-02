#!/usr/bin/env python3
"""
Kerala Rage Asset Schema v5.0.0 Utilities
Provides layer mapping and schema transformations for the v5.0.0 layered identity system.

Usage:
    from asset_schema_v5 import get_layer_for_category, detect_aspect_ratio, get_semantic_mapping
"""

from typing import Dict, List, Tuple

# ============================================================================
# V5.0.0 LAYER MAPPINGS
# ============================================================================

CATEGORY_TO_LAYER = {
    "devotional": "spiritual",
    "portrait": "resistance",
    "symbol": "cultural",
    "street": "resistance",
    "abstract": "atmospheric",
    "texture": "substrate",
}

LAYER_DEFINITIONS = {
    "spiritual": {
        "categories": ["devotional"],
        "description": "Mythic/devotional anchors (Shiva, cultural symbols)",
        "z_index": 4,  # Foreground-dominant
    },
    "resistance": {
        "categories": ["portrait", "street"],
        "description": "Historical figures, activist placards, resistance imagery",
        "z_index": 3,  # Foreground/mid-layer
    },
    "cultural": {
        "categories": ["symbol"],
        "description": "Cultural icons and environmental anchors",
        "z_index": 2,  # Mid-layer
    },
    "atmospheric": {
        "categories": ["abstract"],
        "description": "Background textures and atmospheric overlays",
        "z_index": 1,  # Overlay
    },
    "substrate": {
        "categories": ["texture"],
        "description": "Material base textures (brick, concrete, paper)",
        "z_index": 0,  # Background-base
    },
}

# ============================================================================
# ASPECT RATIO DETECTION
# ============================================================================

def detect_aspect_ratio(filename: str, category: str = None) -> str:
    """
    Detect aspect ratio from filename or infer from category.
    
    Returns: "1:1", "3:4", "16:9", or "2:1"
    """
    lower = filename.lower()
    
    # Explicit markers in filename
    if "paint-splash" in lower or "banner" in lower:
        return "2:1"
    if "landscape" in lower or "laneway" in lower:
        return "16:9"
    if "portrait" in lower and "3-4" not in lower:
        return "3:4"
    
    # Category-based inference
    if category:
        if category == "portrait":
            return "3:4"
        elif category in ["texture", "symbol"] and "landscape" in lower:
            return "16:9"
        elif category in ["devotional", "symbol", "street"]:
            return "1:1"
    
    # Default: square
    return "1:1"


# ============================================================================
# SEMANTIC MAPPINGS
# ============================================================================

def get_semantic_mapping(category: str, filename: str = "") -> Dict[str, str]:
    """
    Get functional_role, semantic_weight, and layering_role for a category.
    
    Returns dict with:
        - functional_role: icon-anchor, editorial-hero, background-texture, etc.
        - semantic_weight: mythic, heroic, iconic, atmospheric, material
        - layering_role: foreground-dominant, foreground, mid-layer, overlay, background-base
    """
    lower = filename.lower()
    
    # Shiva assets (devotional + shiva)
    if category == "devotional" and "shiva" in lower:
        return {
            "functional_role": "symbolic-anchor",
            "semantic_weight": "mythic",
            "layering_role": "foreground-dominant",
        }
    
    # Devotional (non-Shiva)
    if category == "devotional":
        return {
            "functional_role": "symbolic-anchor",
            "semantic_weight": "mythic",
            "layering_role": "foreground-dominant",
        }
    
    # Portraits
    if category == "portrait":
        return {
            "functional_role": "editorial-hero",
            "semantic_weight": "heroic",
            "layering_role": "foreground",
        }
    
    # Symbols - Elephant
    if category == "symbol" and "elephant" in lower:
        return {
            "functional_role": "icon-anchor",
            "semantic_weight": "iconic",
            "layering_role": "mid-layer",
        }
    
    # Symbols - Landscape
    if category == "symbol" and "landscape" in lower:
        return {
            "functional_role": "environment-anchor",
            "semantic_weight": "grounded",
            "layering_role": "mid-layer",
        }
    
    # Symbols - Generic
    if category == "symbol":
        return {
            "functional_role": "icon-element",
            "semantic_weight": "iconic",
            "layering_role": "mid-layer",
        }
    
    # Street art
    if category == "street":
        return {
            "functional_role": "contextual-motif",
            "semantic_weight": "activist",
            "layering_role": "mid-layer",
        }
    
    # Texture
    if category == "texture":
        return {
            "functional_role": "material-base",
            "semantic_weight": "material",
            "layering_role": "background-base",
        }
    
    # Abstract - Paint splash
    if category == "abstract" and "paint" in lower and "splash" in lower:
        return {
            "functional_role": "dynamic-overlay",
            "semantic_weight": "expressive",
            "layering_role": "overlay",
        }
    
    # Abstract - Generic
    if category == "abstract":
        return {
            "functional_role": "background-texture",
            "semantic_weight": "atmospheric",
            "layering_role": "overlay",
        }
    
    # Fallback
    return {
        "functional_role": "background-texture",
        "semantic_weight": "atmospheric",
        "layering_role": "overlay",
    }


# ============================================================================
# USAGE RULES
# ============================================================================

def get_usage_rules(layering_role: str) -> Dict:
    """
    Get scale_suitability and small_ui_safe based on layering role.
    """
    rules_map = {
        "foreground-dominant": {
            "scale_suitability": ["hero-only", "large-section"],
            "small_ui_safe": False,
        },
        "foreground": {
            "scale_suitability": ["hero-only", "feature"],
            "small_ui_safe": False,
        },
        "mid-layer": {
            "scale_suitability": ["hero", "section", "card"],
            "small_ui_safe": True,
        },
        "overlay": {
            "scale_suitability": ["hero", "section"],
            "small_ui_safe": True,
        },
        "background-base": {
            "scale_suitability": ["hero-background", "global-overlay"],
            "small_ui_safe": False,
        },
    }
    
    return rules_map.get(layering_role, {
        "scale_suitability": ["hero", "section"],
        "small_ui_safe": True,
    })


# ============================================================================
# LAYERING COMPATIBILITY
# ============================================================================

def get_layering_compatibility(layer: str) -> Dict[str, List[str]]:
    """
    Get can_overlay_with and cannot_overlay_with for a layer.
    """
    compatibility_map = {
        "spiritual": {
            "can_overlay_with": ["substrate", "atmospheric"],
            "cannot_overlay_with": ["spiritual", "resistance"],
        },
        "resistance": {
            "can_overlay_with": ["substrate", "atmospheric"],
            "cannot_overlay_with": ["resistance", "spiritual"],
        },
        "cultural": {
            "can_overlay_with": ["substrate", "atmospheric"],
            "cannot_overlay_with": ["cultural"],
        },
        "atmospheric": {
            "can_overlay_with": ["substrate"],
            "cannot_overlay_with": ["atmospheric"],
        },
        "substrate": {
            "can_overlay_with": [],
            "cannot_overlay_with": ["substrate"],
        },
    }
    
    return compatibility_map.get(layer, {
        "can_overlay_with": ["substrate"],
        "cannot_overlay_with": [],
    })


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_layer_for_category(category: str) -> str:
    """Map category to v5.0.0 layer."""
    return CATEGORY_TO_LAYER.get(category, "atmospheric")


def get_categories_for_layer(layer: str) -> List[str]:
    """Get all categories that map to a given layer."""
    return LAYER_DEFINITIONS.get(layer, {}).get("categories", [])


def build_v5_asset_entry(
    asset_id: str,
    name: str,
    category: str,
    file_path: str,
    priority: str = "HIGH",
    filename: str = "",
) -> Dict:
    """
    Build a complete v5.0.0 manifest entry from basic asset metadata.
    
    Args:
        asset_id: Asset ID (e.g., KR-SOLID-001)
        name: Human-readable name
        category: Original category (devotional, portrait, etc.)
        file_path: Path to asset file
        priority: CRITICAL or HIGH
        filename: Original filename for detection heuristics
    
    Returns:
        Complete v5.0.0 manifest entry dict
    """
    layer = get_layer_for_category(category)
    aspect_ratio = detect_aspect_ratio(filename or file_path, category)
    semantics = get_semantic_mapping(category, filename or file_path)
    usage_rules = get_usage_rules(semantics["layering_role"])
    layering_compatibility = get_layering_compatibility(layer)
    
    return {
        "id": asset_id,
        "name": name,
        "category": category,
        "layer": layer,
        "aspect_ratio": aspect_ratio,
        "file_path": file_path,
        "priority": priority,
        "semantics": semantics,
        "usage_rules": usage_rules,
        "layering_compatibility": layering_compatibility,
    }


if __name__ == "__main__":
    # Demo
    print("=== V5.0.0 Schema Utilities ===\n")
    
    print("Category → Layer Mappings:")
    for cat, layer in CATEGORY_TO_LAYER.items():
        print(f"  {cat:12} → {layer}")
    
    print("\nExample: Build v5 entry for Bhagat Singh portrait")
    entry = build_v5_asset_entry(
        asset_id="KR-SOLID-005",
        name="Bhagat Singh",
        category="portrait",
        file_path="/assets/kr-solidarity/portrait/bhagat-singh.png",
        priority="CRITICAL",
        filename="bhagat-singh.png",
    )
    
    import json
    print(json.dumps(entry, indent=2))
