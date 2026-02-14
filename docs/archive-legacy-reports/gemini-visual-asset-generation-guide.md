# Gemini Visual Asset Generation Guide

## Model Specifications

### Recommended Models

**For SVG Code Generation:**
- **Model**: `gemini-1.5-pro-002` or `gemini-1.5-flash-002`
- **Temperature**: 0.3 (lower for more deterministic code)
- **Max Tokens**: 8192
- **Use Case**: Generating SVG markup, icon sets, vector graphics

**For Image/Art Generation:**
- **Model**: `gemini-2.0-flash-exp` (with Imagen 3 integration)
- **Temperature**: 0.7 (higher for more creative outputs)
- **Use Case**: Generating raster images, illustrations, backgrounds

**For Complex Visual Analysis:**
- **Model**: `gemini-1.5-pro-002`
- **Vision**: Enabled
- **Use Case**: Analyzing designs, extracting specifications from screenshots

---

## System Prompts

### System Prompt: SVG Code Generator

```
You are an expert SVG graphics engineer specializing in creating production-ready, accessible, and performant vector graphics. Your expertise includes:

1. **SVG Standards**: Create valid SVG 1.1 and SVG 2.0 markup with proper namespaces and structure
2. **Optimization**: Generate minimal, clean SVG code with optimized paths and no redundant elements
3. **Accessibility**: Include proper ARIA labels, titles, and descriptions for screen readers
4. **Scalability**: Create responsive SVGs that scale perfectly at any size without quality loss
5. **Animation Support**: Structure SVGs with clear layer organization for CSS/JS animation integration
6. **Material Design 3**: Follow M3 icon guidelines (24dp base, 2dp stroke, rounded corners)
7. **Performance**: Keep file sizes minimal (<5KB for icons, <50KB for illustrations)
8. **Browser Compatibility**: Ensure compatibility with all modern browsers (Chrome, Firefox, Safari, Edge)

Output Format:
- Provide complete, copy-paste ready SVG code
- Include viewBox for proper scaling
- Use semantic naming for IDs and classes
- Add brief usage comments
- Specify recommended size and color customization options

Constraints:
- Maximum 200 path elements per SVG
- Use relative commands (lowercase) in paths where possible
- Avoid inline styles; use presentation attributes
- Include xmlns="http://www.w3.org/2000/svg"
```

### System Prompt: Image/Art Generator (for Imagen 3 via Gemini)

```
You are a visual design specialist creating production-ready images and illustrations for modern web applications. Your expertise includes:

1. **Visual Design**: Create clean, professional, and aesthetically pleasing visuals
2. **Material Design 3**: Follow M3 Expressive principles with dynamic color, elevation, and motion
3. **Accessibility**: Ensure adequate contrast ratios (WCAG AA: 4.5:1 for text, 3:1 for UI)
4. **Context Awareness**: Design assets that fit seamlessly into UI contexts
5. **Resolution**: Generate high-resolution images suitable for retina displays (2x, 3x)
6. **File Format Guidance**: Recommend optimal formats (PNG for transparency, WebP for compression, JPEG for photos)
7. **Color Psychology**: Use color intentionally to convey meaning and emotion
8. **Composition**: Apply design principles (rule of thirds, golden ratio, visual hierarchy)

Output Guidance:
- Describe the visual intent and design decisions
- Specify recommended dimensions and aspect ratios
- Provide color palette with hex values
- Include alt text suggestions for accessibility
- Recommend usage contexts (hero images, backgrounds, icons, illustrations)

Design Constraints:
- Maintain visual consistency with Material Design 3 Expressive
- Prioritize clarity and readability
- Avoid visual clutter and unnecessary complexity
- Consider dark mode compatibility
```

---

## SVG Generation Prompts

### Template: Animated Icon Set

**Model**: `gemini-1.5-pro-002`
**Temperature**: 0.3

```markdown
Generate a set of 5 animated icons for a CareerCopilot application following these specifications:

**Icons Needed:**
1. Resume Icon - Document with star/checkmark
2. Cover Letter Icon - Envelope with paper
3. Job Match Icon - Target with arrow
4. Profile Icon - Person silhouette
5. Analytics Icon - Chart with trend line

**Technical Requirements:**
- SVG format, 24x24dp base size
- viewBox="0 0 24 24"
- 2dp stroke width
- Rounded line caps and joins (stroke-linecap="round" stroke-linejoin="round")
- Single color design (currentColor for stroke/fill)
- Structure for framer-motion animation (grouped elements with IDs)
- Total file size: <3KB per icon

**Style Guidelines:**
- Material Design 3 icon style
- Geometric, minimal, recognizable at small sizes
- 2dp corner radius for rounded shapes
- Consistent visual weight across all icons
- Clear silhouettes

**Animation Structure:**
- Group related elements with meaningful IDs
- Separate layers for sequential animation
- Include suggested animation properties in comments

**Accessibility:**
- <title> element with descriptive text
- aria-hidden="true" (to be used with visible text label)

**Output Format:**
For each icon, provide:
1. Complete SVG code
2. Suggested animation sequence (which elements to animate, in what order)
3. Recommended colors from M3 palette
4. Usage example with React/framer-motion

Example animation structure:
```svg
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <title>Icon Name</title>
  <g id="layer-1"><!-- Background elements --></g>
  <g id="layer-2"><!-- Mid-layer elements --></g>
  <g id="layer-3"><!-- Foreground elements --></g>
</svg>
```
```

---

### Template: Loading Spinner SVG

**Model**: `gemini-1.5-flash-002`
**Temperature**: 0.3

```markdown
Generate a custom loading spinner SVG for CareerCopilot with these specifications:

**Design Concept:**
A circular spinner that represents career progression - combine a circular path with subtle arrow/chevron motifs suggesting forward movement.

**Technical Requirements:**
- SVG format, 48x48dp base size
- viewBox="0 0 48 48"
- Optimized for CSS animation (rotation, opacity, stroke-dashoffset)
- Use <circle> and <path> elements
- Total file size: <2KB

**Visual Style:**
- Material Design 3 Expressive
- 3dp stroke width
- Gradient-ready structure (provide both solid and gradient versions)
- Subtle directional cues (arrows, chevrons)
- Professional, modern aesthetic

**Animation Considerations:**
- 360° rotation animation (CSS keyframe ready)
- Optional: stroke-dasharray for progress indication
- Optional: pulsing effect via opacity
- 1-2 second animation duration

**Color Variants:**
Provide 3 versions:
1. Primary color (#a855f7 purple)
2. Success color (#10b981 green)
3. Neutral color (#6b7280 gray)

**Output:**
1. Base SVG code (solid color)
2. Gradient version SVG code
3. CSS animation keyframes
4. Usage example with React

```

---

### Template: Illustration SVG (Complex)

**Model**: `gemini-1.5-pro-002`
**Temperature**: 0.4

```markdown
Generate an illustration SVG for the CareerCopilot empty state: "No resumes yet"

**Concept:**
A friendly, encouraging illustration showing a blank document with a plus icon or upload gesture, conveying "start creating." Optimistic and approachable tone.

**Composition:**
- Central element: Blank document/paper sheet
- Supporting elements: Plus icon, upload cloud, or pencil
- Background: Subtle geometric shapes (circles, lines) for visual interest
- Style: Flat design with subtle shadows/layers

**Technical Requirements:**
- SVG format, 400x300dp (4:3 aspect ratio)
- viewBox="0 0 400 300"
- Organized layers for easy color customization
- Use <g> groups with semantic IDs
- File size: <30KB

**Color Palette (Material Design 3):**
- Primary: #a855f7 (purple)
- Surface: #f3f4f6 (light gray)
- On-surface: #1f2937 (dark gray)
- Accent: #10b981 (green)
- Use 2-3 colors maximum

**Style Guidelines:**
- 2D flat design with 2-3 depth layers
- Rounded corners (8dp radius)
- Soft shadows via opacity
- Clean, vector-based shapes (no complex gradients)
- Optimistic, friendly aesthetic

**Accessibility:**
- <title>: "Empty state illustration - No resumes yet"
- <desc>: "An illustration showing a blank document with a plus icon, encouraging users to create their first resume"

**Output:**
1. Complete SVG code
2. Color customization guide (which elements to target)
3. Suggested usage context and dimensions
4. Alternative text for accessibility
```

---

## Image/Art Generation Prompts

### Template: Hero Background Image

**Model**: `gemini-2.0-flash-exp` (Imagen 3)
**Temperature**: 0.7

```markdown
Generate a hero section background image for CareerCopilot landing page.

**Concept:**
Abstract, professional background suggesting career growth and success. Incorporate subtle geometric patterns, gradient flows, and modern professional aesthetic.

**Visual Elements:**
- Abstract ascending lines/paths suggesting progress
- Subtle geometric shapes (circles, triangles, connecting lines)
- Gradient color flows
- Depth via layered elements
- Professional, optimistic mood

**Color Palette:**
- Primary: Deep purple (#7c3aed) to light purple (#a855f7) gradient
- Accent: Teal (#0d9488) highlights
- Background: Very light gray (#f9fafb) to white gradient
- Depth: Subtle shadows and overlays (10-20% opacity)

**Composition:**
- Aspect ratio: 16:9 (1920x1080px)
- Visual flow: Bottom-left to top-right (ascending motion)
- Focal point: Center-right (where CTA text will overlay)
- Negative space: Left and center for text overlay
- Visual weight: Heavier on right, lighter on left

**Style:**
- Modern, minimalist, professional
- Soft gradients (no harsh transitions)
- Subtle texture (avoid flat colors)
- Low contrast for background (won't compete with text)
- Resolution: 2x (3840x2160px for retina)

**Technical Specs:**
- Format: WebP (primary), PNG fallback
- Color space: sRGB
- Quality: 85% compression
- File size target: <500KB (WebP)
- Blurred variant for lazy loading: 20x11px

**Accessibility Considerations:**
- Sufficient contrast with white text (overlay with 40% purple gradient)
- Avoid patterns that cause visual strain
- Test with color blindness filters

**Suggested Alt Text:**
"Abstract background with ascending geometric patterns in purple and teal gradients, suggesting career progression and growth"

**Usage Context:**
- Above-the-fold hero section
- Behind heading: "Land Your Dream Job with AI-Powered Career Tools"
- Overlaid with semi-transparent purple gradient for text contrast
```

---

### Template: Feature Illustration

**Model**: `gemini-2.0-flash-exp` (Imagen 3)
**Temperature**: 0.7

```markdown
Generate a feature illustration for "AI Resume Optimization" feature card.

**Concept:**
Illustrate AI analyzing and improving a resume document. Show a document with highlighted sections, AI elements (sparkles, stars, brain icon), and positive indicators (checkmarks, stars, upward arrows).

**Visual Elements:**
- Central: Resume/document page
- AI indicators: Sparkles, glow effects, subtle circuit/neural network pattern
- Positive feedback: Green checkmarks, gold stars, upward trend arrow
- Color coding: Different sections of resume in different colors
- Style: Isometric or flat 2.5D perspective

**Color Palette:**
- Document: White (#ffffff) with subtle shadow
- Text/content: Dark gray (#374151)
- AI highlights: Purple (#a855f7) glow
- Success indicators: Green (#10b981)
- Accent: Gold/yellow (#fbbf24) stars

**Composition:**
- Aspect ratio: 1:1 square (800x800px)
- Viewing angle: Slight top-down perspective (15-20° tilt)
- Central focus: Resume document
- Supporting elements: Around document edges
- Visual hierarchy: Document > AI effects > indicators

**Style:**
- Modern, friendly, approachable
- Clean vector-style aesthetic (even though raster)
- Soft shadows for depth
- Subtle glow effects for AI elements
- Professional but not corporate

**Technical Specs:**
- Resolution: 2x (1600x1600px for retina)
- Format: PNG with transparency
- Color depth: 24-bit
- File size target: <200KB
- Include 1x (800x800px) and 2x versions

**Mood & Tone:**
- Optimistic and empowering
- High-tech but accessible
- Professional yet friendly
- Trustworthy and capable

**Accessibility:**
- Avoid relying solely on color to convey meaning
- High contrast between elements
- Clear visual hierarchy

**Suggested Alt Text:**
"Illustration of a resume document being analyzed by AI, with highlighted sections, sparkles, and green checkmarks indicating optimization improvements"

**Usage Context:**
- Feature card on landing page
- Marketing materials
- Product tour screenshots
- Social media graphics
```

---

### Template: Icon Illustration Set

**Model**: `gemini-2.0-flash-exp` (Imagen 3)
**Temperature**: 0.6

```markdown
Generate a set of 4 illustrated icons for CareerCopilot features. These are raster images (not SVG) with illustrative detail.

**Icons Needed:**
1. **ATS Score Checker**
   - Concept: Document with score meter/gauge
   - Colors: Purple (#a855f7), green (#10b981)
   - Mood: Analytical, precise

2. **AI Cover Letter Generator**
   - Concept: Envelope with AI sparkles/stars
   - Colors: Purple (#a855f7), blue (#3b82f6)
   - Mood: Creative, intelligent

3. **Resume Tailor**
   - Concept: Document with scissors/edit tools
   - Colors: Purple (#a855f7), orange (#f59e0b)
   - Mood: Customizable, precise

4. **Job Match Finder**
   - Concept: Magnifying glass over job listings/buildings
   - Colors: Purple (#a855f7), teal (#0d9488)
   - Mood: Discovery, opportunity

**Technical Requirements:**
- Size: 256x256px (1x), 512x512px (2x)
- Format: PNG with transparency
- Style: Consistent across all 4 icons
- Visual complexity: Medium (more detail than flat icons, but still clean)
- File size: <100KB per icon

**Visual Style:**
- 2.5D isometric perspective
- Soft shadows and highlights
- Subtle gradients for depth
- Rounded corners and friendly shapes
- Material Design 3 inspired

**Color Treatment:**
- Primary colors from palette
- Subtle gradients (not flat)
- Consistent lighting direction (top-left)
- Shadow color: Dark purple (#7c3aed) at 15% opacity

**Consistency Requirements:**
- Same perspective angle across all icons
- Same lighting direction
- Similar visual weight and complexity
- Cohesive as a set

**Accessibility:**
- High contrast against white backgrounds
- Recognizable at small sizes (down to 64x64px)
- Don't rely solely on color to convey meaning

**Suggested Alt Texts:**
1. "Illustration of a document with a scoring gauge showing ATS compatibility check"
2. "Illustration of an envelope with AI sparkles representing AI-generated cover letters"
3. "Illustration of a document with editing tools representing resume customization"
4. "Illustration of a magnifying glass over job listings representing job matching"

**Output Format:**
For each icon, provide:
1. 1x version (256x256px)
2. 2x version (512x512px)
3. Color palette used (hex codes)
4. Alt text
5. Usage recommendations
```

---

## Usage Instructions

### For SVG Generation

1. **Choose Model**: Use `gemini-1.5-pro-002` for complex SVGs, `gemini-1.5-flash-002` for simple icons
2. **Set Parameters**:
   ```javascript
   {
     model: "gemini-1.5-pro-002",
     temperature: 0.3,
     maxOutputTokens: 8192
   }
   ```
3. **Copy System Prompt**: Use the "SVG Code Generator" system prompt
4. **Customize Template**: Adapt one of the SVG prompt templates above
5. **Review Output**: Check for:
   - Valid SVG syntax
   - Proper viewBox and dimensions
   - Accessibility attributes
   - Animation-ready structure
6. **Optimize**: Run through SVGO if needed to reduce file size further

### For Image Generation

1. **Choose Model**: Use `gemini-2.0-flash-exp` for image generation
2. **Set Parameters**:
   ```javascript
   {
     model: "gemini-2.0-flash-exp",
     temperature: 0.7
   }
   ```
3. **Copy System Prompt**: Use the "Image/Art Generator" system prompt
4. **Customize Template**: Adapt one of the image prompt templates above
5. **Generate**: The model will create the image via Imagen 3 integration
6. **Post-Process**:
   - Convert to WebP for web use
   - Create multiple resolutions (1x, 2x, 3x)
   - Generate low-quality placeholder for lazy loading
7. **Accessibility**: Always provide descriptive alt text

---

## API Integration Examples

### SVG Generation via Gemini API

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateSVGIcon(iconName: string, description: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-002",
    systemInstruction: `You are an expert SVG graphics engineer...` // Full system prompt
  });

  const prompt = `Generate an SVG icon for "${iconName}": ${description}

  Technical Requirements:
  - 24x24dp base size
  - viewBox="0 0 24 24"
  - Material Design 3 style
  - currentColor for easy customization
  - Include <title> for accessibility

  Provide only the SVG code, no explanation.`;

  const result = await model.generateContent(prompt);
  const svgCode = result.response.text();

  return svgCode;
}

// Usage
const resumeIconSVG = await generateSVGIcon(
  "Resume Icon",
  "A document icon with a star in the corner indicating quality"
);
```

### Image Generation via Gemini API

```typescript
async function generateFeatureImage(feature: string, description: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: `You are a visual design specialist...` // Full system prompt
  });

  const prompt = `Generate a feature illustration for "${feature}".

  ${description}

  Technical Specs:
  - Size: 800x800px
  - Format: PNG with transparency
  - Color palette: Purple (#a855f7), Green (#10b981), Gray (#6b7280)
  - Style: Modern, flat 2.5D, Material Design 3
  - Mood: Professional, optimistic, approachable`;

  const result = await model.generateContent(prompt);

  // Extract image URL or data from response
  // Note: Actual implementation depends on Imagen 3 integration
  return result;
}
```

---

## Best Practices

### SVG Generation
- ✅ Always specify viewBox for responsive scaling
- ✅ Use semantic IDs and classes for animation targeting
- ✅ Keep file sizes minimal (<5KB for icons)
- ✅ Structure for animation with logical grouping
- ✅ Include accessibility attributes
- ✅ Test at multiple sizes (16px, 24px, 48px)
- ✅ Validate SVG syntax before committing

### Image Generation
- ✅ Specify exact dimensions and aspect ratios
- ✅ Provide detailed color palettes with hex codes
- ✅ Describe composition and visual hierarchy clearly
- ✅ Request multiple resolutions for responsive images
- ✅ Generate WebP and PNG formats
- ✅ Always include alt text
- ✅ Test accessibility with color blindness filters

### General
- ✅ Iterate on prompts based on output quality
- ✅ Save successful prompts for reuse
- ✅ Maintain consistency across asset sets
- ✅ Document color palettes and design decisions
- ✅ Version control all generated assets
- ✅ Optimize files before committing to repository

---

## Quality Checklist

### SVG Assets
- [ ] Valid SVG 1.1/2.0 syntax
- [ ] Proper viewBox attribute
- [ ] Accessibility attributes (title, desc, ARIA)
- [ ] Optimized path data
- [ ] File size within target (<5KB icons, <50KB illustrations)
- [ ] Animation-ready structure
- [ ] Cross-browser compatible
- [ ] Scales perfectly at all sizes

### Image Assets
- [ ] Correct dimensions and aspect ratio
- [ ] Appropriate file format (WebP, PNG, JPEG)
- [ ] Multiple resolutions (1x, 2x, 3x)
- [ ] Optimized file size
- [ ] Descriptive alt text provided
- [ ] WCAG AA contrast ratios
- [ ] Tested in dark mode (if applicable)
- [ ] Lazy loading placeholder generated

---

## Conclusion

This guide provides comprehensive specifications for generating visual assets using Gemini models. Use the system prompts and templates as starting points, customizing them for your specific needs. Always prioritize accessibility, performance, and visual consistency with Material Design 3 principles.

For questions or issues, refer to:
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Material Design 3 Guidelines](https://m3.material.io/)
- [WCAG Accessibility Standards](https://www.w3.org/WAI/WCAG21/quickref/)
