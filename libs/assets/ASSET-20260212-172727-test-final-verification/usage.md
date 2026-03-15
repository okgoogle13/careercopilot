# Usage Guidelines: Test-Final-Verification

## CSS Implementation

```css
.asset-test-final-verification {
  background-image: url('/assets/kr-motifs/test-final-verification-1024.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

/* Opacity by context */
.kr-dark-hero { opacity: 0.85; }
.kr-dark-content { opacity: 0.70; }
.solidarity-mode { opacity: 0.65; }
```

## Responsive Behavior

- **Desktop**: Full resolution (1024x1024)
- **Tablet**: Scale to fit viewport
- **Mobile**: Reduce opacity to 0.50-0.60 to maintain readability

## Component Integration

**Recommended for**:
- Landing page hero sections
- Dashboard backgrounds
- Solidarity mode emotional moments
- Feature showcase areas

**Avoid for**:
- Dense text overlays (contrast issues)
- High-interaction elements
- Mobile-first designs (test opacity)

## Performance Notes

- File size: ~2.4MB (consider lazy loading)
- Format: PNG (lossless, supports transparency)
- Preload in critical paths for hero sections
- Use `background-attachment: fixed` for parallax depth
