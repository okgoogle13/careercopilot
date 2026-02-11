# Deployment Guide: Abstract - Solidarity (chatgpt-image-f)

## Quick Facts
- **Asset ID:** KR-SOLID-071
- **Canonical Path:** `/assets/kr-solidarity/abstract/kr-solidarity__abstract__abstract---solidarity-chatgpt-image-f__v1.png`
- **Approval Status:** conditional-approval
- **Overall Score:** 85.6/100

## Integration Steps

### 1. File Placement
Place the asset at the canonical path:
```
kr-solidarity/abstract/kr-solidarity__abstract__abstract---solidarity-chatgpt-image-f__v1.png
```

### 2. Manifest Entry
Add this entry to `frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`:

```json
{
  "id": "KR-SOLID-071",
  "name": "Abstract - Solidarity (chatgpt-image-f)",
  "category": "abstract",
  "file_path": "/assets/kr-solidarity/abstract/kr-solidarity__abstract__abstract---solidarity-chatgpt-image-f__v1.png",
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
        src="/assets/kr-solidarity/abstract/kr-solidarity__abstract__abstract---solidarity-chatgpt-image-f__v1.png"
        alt="Abstract - Solidarity (chatgpt-image-f)"
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
- Analysis Notes: Analysis failed: 429 You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. 
* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20, model: gemini-3-flash
Please retry in 46.398373977s. [links {
  description: "Learn more about Gemini API quotas"
  url: "https://ai.google.dev/gemini-api/docs/rate-limits"
}
, violations {
  quota_metric: "generativelanguage.googleapis.com/generate_content_free_tier_requests"
  quota_id: "GenerateRequestsPerDayPerProjectPerModel-FreeTier"
  quota_dimensions {
    key: "model"
    value: "gemini-3-flash"
  }
  quota_dimensions {
    key: "location"
    value: "global"
  }
  quota_value: 20
}
, retry_delay {
  seconds: 46
}
]
- Placement Fit: Landing, Dashboard Overview
- Governance Notes: 0 violations, 0 warnings
- Scoring Details: See `metadata.json`

---

Generated: 2026-02-11T14:11:13.679325
