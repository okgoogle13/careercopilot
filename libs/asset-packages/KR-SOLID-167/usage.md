# Deployment Guide: Abstract - Solidarity (kerala-rage-gri)

## Quick Facts
- **Asset ID:** KR-SOLID-167
- **Canonical Path:** `/assets/kr-solidarity/abstract/kr-solidarity__abstract__abstract---solidarity-kerala-rage-gri__v1.png`
- **Approval Status:** conditional-approval
- **Overall Score:** 85.6/100

## Integration Steps

### 1. File Placement
Place the asset at the canonical path:
```
kr-solidarity/abstract/kr-solidarity__abstract__abstract---solidarity-kerala-rage-gri__v1.png
```

### 2. Manifest Entry
Add this entry to `frontend/public/assets/kr-solidarity-manifest.json`:

```json
{
  "id": "KR-SOLID-167",
  "name": "Abstract - Solidarity (kerala-rage-gri)",
  "category": "abstract",
  "file_path": "/assets/kr-solidarity/abstract/kr-solidarity__abstract__abstract---solidarity-kerala-rage-gri__v1.png",
  "priority": "HIGH",
  "status": "ready",
  "intended_context": "Analysis failed",
  "components_allowed": [],
  "specs": {
    "aspect_ratio": "1024:1024",
    "style": "mixed",
    "text_content": null,
    "visual_anchors": {
      "halo": null,
      "framing": null,
      "subject": "error fallback"
    },
    "color_palette": {
      "primary": "#1A1714",
      "secondary": "#D4A84B"
    }
  }
}
```

### 3. Component Usage (React)
```tsx
import { asset_id } from '@/components/kr-solidarity/AssetLibrary';

export const MyComponent = () => {
  return (
    <div className="kr-solidarity-asset">
      <img
        src="/assets/kr-solidarity/abstract/kr-solidarity__abstract__abstract---solidarity-kerala-rage-gri__v1.png"
        alt="Abstract - Solidarity (kerala-rage-gri)"
        className="w-full h-auto"
      />
    </div>
  );
};
```

### 4. CSS Token Integration
If using color palette, add to design tokens:

```css
--kr-primary: #1A1714;
--kr-secondary: #D4A84B;
```

## Validation Checklist

- [x] Passes governance validation
- [ ] Overall score ≥ 90
- [x] No governance violations
- [x] No governance warnings
- [ ] Image meets minimum resolution (2048px)

## Recommendations

- ⚠️  Good asset - monitor for cultural sensitivity feedback
- 📍 Strengthen political significance framing (current: 75)
-    → Add historical reference or movement context
-    → Enhance visual symbolism or cultural markers

## Support

For questions about this asset's cultural significance or governance status, refer to:
- Analysis Notes: Analysis failed: 400 API key not valid. Please pass a valid API key. [reason: "API_KEY_INVALID"
domain: "googleapis.com"
metadata {
  key: "service"
  value: "generativelanguage.googleapis.com"
}
, locale: "en-US"
message: "API key not valid. Please pass a valid API key."
]
- Placement Fit: Landing, Dashboard Overview
- Governance Notes: 0 violations, 0 warnings
- Scoring Details: See `metadata.json`

---

Generated: 2026-02-11T22:09:15.686315
