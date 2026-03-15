import json
import re
from pathlib import Path
from typing import List, Dict, Optional, Any

class PlacementEngine:
    """
    Parses 06b-asset-placement.md and provides programmatic placement rules.
    Part of the Hybrid Strategy: Deterministic Script + Agentic Skill.
    """

    def __init__(self, placement_guide_path: str):
        self.guide_path = Path(placement_guide_path)
        self.rules = self._parse_guide()

    def _parse_guide(self) -> Dict[str, Any]:
        """Extremely basic parser to extract page allowances and motifs."""
        if not self.guide_path.exists():
            return {}

        content = self.guide_path.read_text()
        rules = {
            "page_allowances": {},
            "cultural_safety": [],
            "z_indices": {
                "substrate": 0,
                "background": 1,
                "watermark": 1,
                "anchor": 2,
                "frame": 2,
                "interactive": 3,
                "grit": 3
            }
        }

        # Extract the "Page-Specific Allowances" table
        allowances_match = re.search(r"### Page-Specific Allowances\n\n(.*?)\n\n", content, re.DOTALL)
        if allowances_match:
            table = allowances_match.group(1)
            lines = table.split("\n")[2:] # Skip header and divider
            for line in lines:
                parts = [p.strip() for p in line.split("|") if p.strip()]
                if len(parts) >= 2:
                    page = parts[0]
                    allowed = "✅" in parts[1]
                    motifs = parts[2] if len(parts) > 2 else ""
                    rules["page_allowances"][page.lower()] = {
                        "allowed": allowed,
                        "preferred_motifs": motifs
                    }

        return rules

    def get_recommendation(self, asset_category: str, asset_motifs: List[str], target_page: str) -> Dict[str, Any]:
        """
        Determines if an asset is allowed on a page and suggests placement for the wireframe-annotator.
        """
        page_key = target_page.lower().replace("page ", "")
        allowance = self.rules["page_allowances"].get(page_key, {"allowed": False, "preferred_motifs": "N/A"})

        # Check cultural safety (e.g. Shiva on Protest)
        # This is where the "Brawn" (Script) enforces the rules parsed from the "Canon" (MD)
        safety_status = "safe"
        if "shiva" in [m.lower() for m in asset_motifs] and "protest" in target_page.lower():
            safety_status = "violation: cultural anchor mismatch"

        return {
            "is_allowed": allowance["allowed"],
            "safety_status": safety_status,
            "z_index": self.rules["z_indices"].get(asset_category.lower(), 2),
            "recommendation": f"Place as {asset_category} in framing slot." if allowance["allowed"] else "Forbidden for this page environment."
        }

if __name__ == "__main__":
    # Quick Test
    engine = PlacementEngine("docs/design/06b-asset-placement.md")
    print(json.dumps(engine.get_recommendation("anchor", ["Shiva"], "Landing"), indent=2))
