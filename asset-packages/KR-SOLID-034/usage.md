# Deployment Guide: kr-solidarity__street__treaty-now-poster__v1

## Quick Facts
- **Asset ID:** KR-SOLID-034
- **Canonical Path:** `/assets/kr-solidarity/street/kr-solidarity__street__kr-solidarity--street--treaty-now-poster--v1__v1.png`
- **Approval Status:** conditional-approval
- **Overall Score:** 83.1/100

## Integration Steps

### 1. File Placement
Place the asset at the canonical path:
```
kr-solidarity/street/kr-solidarity__street__kr-solidarity--street--treaty-now-poster--v1__v1.png
```

### 2. Manifest Entry
Add this entry to `frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`:

```json
{
  "id": "KR-SOLID-034",
  "name": "kr-solidarity__street__treaty-now-poster__v1",
  "category": "street",
  "file_path": "/assets/kr-solidarity/street/kr-solidarity__street__kr-solidarity--street--treaty-now-poster--v1__v1.png",
  "priority": "HIGH",
  "status": "ready",
  "intended_context": "Catalog imported",
  "specs": {
    "aspect_ratio": "1024:1024",
    "style": "mixed",
    "text_content": null,
    "visual_anchors": {
      "halo": null,
      "framing": null,
      "subject": "catalog-imported"
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
        src="/assets/kr-solidarity/street/kr-solidarity__street__kr-solidarity--street--treaty-now-poster--v1__v1.png"
        alt="kr-solidarity__street__treaty-now-poster__v1"
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
- [ ] No governance warnings
- [ ] Image meets minimum resolution (2048px)

## Recommendations

- ⚠️  Good asset - monitor for cultural sensitivity feedback
- 📍 Strengthen political significance framing (current: 75)
-    → Add historical reference or movement context
-    → Enhance visual symbolism or cultural markers

## Support

For questions about this asset's cultural significance or governance status, refer to:
- Analysis Notes: Imported from Sidekick Catalog
- Placement Fit: Landing, Dashboard Overview
- Governance Notes: 0 violations, 2 warnings
- Scoring Details: See `metadata.json`

---

Generated: 2026-02-11T12:24:13.737956
