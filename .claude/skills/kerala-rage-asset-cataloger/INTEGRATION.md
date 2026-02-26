# Asset Cataloger + Tier 2 Integration Example

## Complete Workflow

### Phase 1: Cataloging (kerala-rage-asset-cataloger)

```bash
# User uploads 8 images
User: "Catalog these assets from my downloads folder"
```

Cataloger output:

```json
[
  {
    "filename": "kr-leafus-hanging-v2.png",
    "suggested_asset_id": "KR-SOLID-017",
    "doc008_match": "motif-solidarity-leafus-hanging",
    "confidence": "high",
    "priority": "CRITICAL"
  },
  {
    "filename": "grid-100px.png",
    "suggested_asset_id": "KR-SOLID-012",
    "doc008_match": "texture-solidarity-grid-major",
    "confidence": "high",
    "priority": "CRITICAL"
  },
  {
    "filename": "compass-brass.png",
    "suggested_asset_id": "KR-SOLID-015",
    "doc008_match": "motif-solidarity-compass",
    "confidence": "high",
    "priority": "CRITICAL"
  },
  {
    "filename": "paper-white-texture.png",
    "suggested_asset_id": "KR-SOLID-011",
    "doc008_match": "texture-solidarity-paper-white",
    "confidence": "medium",
    "priority": "CRITICAL"
  },
  {
    "filename": "firefly-sprite.png",
    "suggested_asset_id": "KR-UI-010",
    "doc008_match": "motif-solidarity-firefly-sprite",
    "confidence": "high",
    "priority": "LOW"
  }
]
```

### Phase 2: Batch Processing (tier2-automation)

Filter for high confidence:

```javascript
const validated = catalog.filter((a) => a.confidence === "high");
```

Invoke batch processor:

```json
{
  "batch_id": "doc008-critical-gaps",
  "assets": [
    {
      "asset_id": "KR-SOLID-017",
      "path": "/downloads/kr-leafus-hanging-v2.png",
      "doc008_match": "motif-solidarity-leafus-hanging",
      "specs": { "mode": "kerala-rage-solidarity", "category": "symbol" }
    },
    {
      "asset_id": "KR-SOLID-012",
      "path": "/downloads/grid-100px.png",
      "doc008_match": "texture-solidarity-grid-major",
      "specs": { "mode": "kerala-rage-solidarity", "category": "texture" }
    },
    {
      "asset_id": "KR-SOLID-015",
      "path": "/downloads/compass-brass.png",
      "doc008_match": "motif-solidarity-compass",
      "specs": { "mode": "kerala-rage-solidarity", "category": "ui-kit" }
    },
    {
      "asset_id": "KR-UI-010",
      "path": "/downloads/firefly-sprite.png",
      "doc008_match": "motif-solidarity-firefly-sprite",
      "specs": { "mode": "kerala-rage-solidarity", "category": "ui-kit" }
    }
  ]
}
```

### Phase 3: Manual Review (Medium Confidence)

```bash
User: "What about paper-white-texture?"
Agent: "Medium confidence. It may map to texture-solidarity-paper-white, but it needs manual palette and composition verification."
```

## Integration Chain

```text
User uploads images
    ↓
kerala-rage-asset-cataloger → catalog.json
    ↓
Filter confidence >= high
    ↓
tier2-automation batch-processor → parallel packaging
    ↓
tier2-automation task-router → coordinate handoffs
    ↓
Deploy to frontend
```
