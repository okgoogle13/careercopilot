import json
from pathlib import Path

REGISTRY_FILE = Path("/Users/okgoogle13/Projects/careercopilot/frontend/public/assets/kr-solidarity-hero-registry.json")

with open(REGISTRY_FILE, "r") as f:
    registry = json.load(f)

for comp in registry["compositions"]:
    if comp["id"] == "textless-deity-hero":
        comp["layers"] = [
            {
              "type": "substrate",
              "asset_id": "KR-SOLID-021",
              "z_index": 1,
              "opacity": 0.45,
              "blend_mode": "normal",
              "position": "cover"
            },
            {
              "type": "atmospheric",
              "asset_id": "auto",
              "z_index": 2,
              "opacity": 0.35,
              "blend_mode": "overlay",
              "position": "center"
            },
            {
              "type": "spiritual",
              "asset_id": "KR-SOLID-097",
              "z_index": 3,
              "opacity": 0.95,
              "blend_mode": "normal",
              "position": "center"
            },
            {
              "type": "atmospheric",
              "asset_id": "KR-SOLID-001",
              "z_index": 4,
              "opacity": 0.4,
              "blend_mode": "color-dodge",
              "position": "cover"
            }
        ]
    elif comp["id"] == "textless-protest-hero":
        comp["layers"] = [
            {
              "type": "substrate",
              "asset_id": "KR-SOLID-096",
              "z_index": 1,
              "opacity": 1.0,
              "blend_mode": "normal",
              "position": "cover"
            },
            {
              "type": "atmospheric",
              "asset_id": "KR-SOLID-002",
              "z_index": 2,
              "opacity": 0.25,
              "blend_mode": "screen",
              "position": "center"
            }
        ]

with open(REGISTRY_FILE, "w") as f:
    json.dump(registry, f, indent=2)

print("Updated layers")
