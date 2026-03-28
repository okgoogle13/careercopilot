---
name: component-spec-scaffolder
description: Generates raw JSON component specs from wireframe XML, mapping regions and slots 1:1.
metadata:
  version: 2.0.0
  tags:
    - scaffolding
    - xml-to-json
    - pipeline
---

## INPUT CONTRACT
- `wireframe_id`: "01_landing.wireframe.xml" (frontend/src/screens/[feature]/)
- `manifest_path`: "frontend/src/design/tokens/tokens.json"
- `placement_report`: JSON from asset-placement-strategy

## OUTPUT SCHEMA (JSON array)
[
  {
    "component_id": "hero_cta_card",
    "source_wireframe": "01_landing.wireframe.xml::hero_region",
    "tokens_required": ["--sys-color-solidarityRed-base"],
    "slots": [{"id": "cta_background", "compatible_assets": ["KR-SOLID-021"]}],
    "hierarchy": ["headline", "body", "cta"]
  }
]

## HARD RULE
1:1 mapping to XML `<region>`, `<slot>` tags. FAIL if no matching XML element.
