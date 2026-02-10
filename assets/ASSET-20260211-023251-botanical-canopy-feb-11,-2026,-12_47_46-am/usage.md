# Usage Guidelines: Botanical Canopy Feb 11, 2026, 12_47_46 Am

## CSS Implementation

```css
.asset-botanical-canopy-feb-11,-2026,-12_47_46-am {
  background-image: url('/assets/kr-motifs/botanical-canopy-feb-11,-2026,-12_47_46-am-1024.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

/* Opacity by context */
.kr-dark-hero { opacity: 0.85; }
.kr-dark-content { opacity: 0.70; }
.gallery-mode { opacity: 0.65; }
.laboratory-mode { opacity: 0.15; }
```

## Responsive Behavior

- **Desktop**: Full resolution (1024x1024)
- **Tablet**: Scale to fit viewport
- **Mobile**: Reduce opacity to 0.50-0.60 to maintain readability

## Component Integration

**Recommended for**:
- Landing page hero sections
- Dashboard backgrounds
- Gallery mode emotional moments
- Feature showcase areas

**Avoid for**:
- Dense text overlays (contrast issues)
- High-interaction elements
- Laboratory mode with opacity >0.2
- Mobile-first designs (test opacity)

## Performance Notes

- File size: ~2.4MB (consider lazy loading)
- Format: PNG (lossless, supports transparency)
- Preload in critical paths for hero sections
- Use `background-attachment: fixed` for parallax depth

