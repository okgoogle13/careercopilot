# Issue #3: IDF Metadata Source Clarification

**Status**: ⚠️ **BLOCKING** — Needs team decision before full production automation

**Question**: Where do asset metadata (colors, kr-motifs, dimensions) come from?

---

## The Problem

The `asset-packager` skill requires IDF (Image Description Format) metadata:

```json
{
  "idf_data": {
    "colors": {"background": "#1A1714", "ink_gold": "#D4A84B"},
    "kr_motifs": ["ink", "leaf"],
    "dimensions": {"width": 1024, "height": 1024},
    "mode": "kr-dark",
    "purpose": "Seamless background pattern"
  }
}
```

**Current state**: Hardcoded placeholder values in orchestration script.

**Impact**: Metadata generation is manual, blocking full automation.

---

## Three Options

### Option A: Vision API Extraction (Recommended for Quality)

**Source**: Extract colors + kr-motifs from PNG via Google Vision API

**Implementation**:
1. Pass PNG to Vision API
2. Detect dominant colors → map to design tokens
3. Identify kr-motifs (botanical entities) via label detection
4. Extract dimensions from PNG metadata
5. Auto-generate IDF JSON

**Pros**:
- ✅ Fully automated (no manual input needed)
- ✅ Consistent extraction logic
- ✅ Can validate kr-motif authenticity
- ✅ Generates correct color palette per asset

**Cons**:
- ❌ Requires Vision API quota + cost
- ❌ Vision API may misidentify botanical elements
- ❌ Needs fallback for extraction failures
- ❌ Additional 10-20 seconds per asset

**Effort**: 3-4 hours to integrate

**Code sketch**:
```python
def extract_idf_from_png(png_path):
    from google.cloud import vision

    client = vision.ImageAnnotatorClient()
    with open(png_path, 'rb') as f:
        image = vision.Image(content=f.read())

    # Get labels
    response = client.label_detection(image=image)
    labels = [label.description for label in response.label_annotations]

    # Get colors (via web detection + manual mapping)
    colors_response = client.image_properties(image=image)
    colors = colors_response.image_properties.dominant_colors.colors

    # Map to design tokens
    idf = {
        "colors": map_colors_to_tokens(colors),
        "kr_motifs": filter_kr_motifs(labels),
        "dimensions": get_png_dimensions(png_path),
        "mode": "kr-dark",
        "purpose": infer_purpose(labels)
    }
    return idf
```

---

### Option B: Gemini Prompt Extraction (Recommended for Speed)

**Source**: Get metadata from the Gemini generation prompt used to create the asset

**Implementation**:
1. Designer includes metadata in Gemini prompt comment:
   ```
   // METADATA:
   // colors: ink-gold, solidarity-red, asphalt-black
   // kr-motifs: ink, leaf
   // purpose: background-pattern
   ```
2. Extract comment → parse → generate IDF JSON
3. Or embed JSON directly in PNG metadata

**Pros**:
- ✅ Zero API calls (fastest)
- ✅ Metadata source-of-truth is preserved
- ✅ Designer controls accuracy
- ✅ No automated guessing needed

**Cons**:
- ❌ Requires designer discipline (manual input)
- ❌ Metadata not included = no package
- ❌ Risk of inconsistent formats
- ❌ Extra workflow step for designers

**Effort**: 2-3 hours to integrate

**Code sketch**:
```python
def extract_idf_from_prompt(png_path, generation_prompt):
    # Parse METADATA block from prompt
    match = re.search(r'// METADATA:(.+?)(?://|\Z)', generation_prompt, re.DOTALL)
    if not match:
        raise ValueError("No METADATA block in prompt")

    metadata_text = match.group(1)
    # Parse key: value pairs
    idf = {
        "colors": parse_colors(metadata_text),
        "kr_motifs": parse_kr_motifs(metadata_text),
        "dimensions": get_png_dimensions(png_path),
        "mode": "kr-dark",
        "purpose": parse_purpose(metadata_text)
    }
    return idf
```

---

### Option C: Manual UI Form (Recommended for Accuracy)

**Source**: Designer fills form → metadata stored → automation uses stored data

**Implementation**:
1. Create web form or CLI tool
2. Designer uploads PNG + fills metadata form:
   - Select colors (from design token picker)
   - Select kr-motifs (from predefined list)
   - Enter purpose/category
3. Store in manifest JSON
4. Batch processor reads manifest → no guessing

**Pros**:
- ✅ 100% accurate metadata (human-curated)
- ✅ Enforces design token consistency
- ✅ Can validate kr-motif selections upfront
- ✅ Audit trail (who entered what, when)

**Cons**:
- ❌ Requires manual effort per asset
- ❌ Slower intake (5 min per asset)
- ❌ Workflow friction (upload + form)
- ❌ Risk of skipped/incomplete forms

**Effort**: 4-6 hours to build UI + validation

**Code sketch**:
```json
{
  "assets": [
    {
      "file": "ink-burst.png",
      "colors": ["ink-gold", "solidarity-red", "asphalt-black"],
      "kr_motifs": ["ink", "leaf"],
      "purpose": "background-pattern",
      "mode": "kr-dark"
    },
    {
      "file": "leaf-canopy.png",
      "colors": ["stencil-green", "asphalt-black"],
      "kr_motifs": ["leaf", "fern"],
      "purpose": "texture-overlay",
      "mode": "kr-dark"
    }
  ]
}
```

---

## Recommendation Matrix

| Scenario | Best Option | Reason |
|----------|-------------|--------|
| **Single assets, high quality needed** | Option A (Vision API) | Automated, accurate, worth API cost |
| **High volume, designer has metadata** | Option B (Prompt) | Fastest, designer has answers already |
| **Team workflow, accuracy critical** | Option C (Form) | Human validation ensures consistency |
| **Initial pilot (5-10 assets)** | Option C (Form) | Quick to implement, good baseline |
| **Production (20+ assets)** | Option A + Fallback to C | API for speed, form for exceptions |

---

## Hybrid Approach (Recommended)

**Combine Options A + C for best of both worlds**:

```
1. Attempt Vision API extraction
   ├─ Success → Use extracted metadata
   └─ Failure → Prompt for manual form

2. Designer reviews extracted metadata
   ├─ Correct → Approve + proceed
   └─ Incorrect → Edit + override

3. Store validated metadata
   ├─ In tokens.json (permanent)
   └─ In categorization manifest (searchable)
```

**Benefits**:
- ✅ 80% automated (Vision API extracts most assets)
- ✅ 20% manual fallback (for edge cases)
- ✅ Designer review step (ensures accuracy)
- ✅ Scales from 1 to 100 assets

---

## Implementation Decision Tree

```
START: IDF Metadata Decision
│
├─ Q1: Do we have designer generation prompts?
│  ├─ YES → Use Option B (Prompt extraction)
│  └─ NO → Continue
│
├─ Q2: Is API cost acceptable?
│  ├─ YES ($0.01-0.05 per asset) → Use Option A (Vision API)
│  └─ NO → Continue
│
├─ Q3: Can designers manually fill forms?
│  ├─ YES → Use Option C (Form UI)
│  └─ NO → Use hardcoded defaults (current state)
│
└─ RECOMMENDATION: Hybrid A + C
   ├─ Vision API (automatic extraction)
   ├─ Form fallback (manual override)
   └─ Review step (designer approval)
```

---

## Cost Analysis

| Option | Setup Cost | Per-Asset Cost | Scale |
|--------|-----------|----------------|-------|
| A (Vision API) | $500 (quota) | $0.01-0.05 | 100+ assets |
| B (Prompt) | $200 (parser) | $0 | 5-50 assets |
| C (Form UI) | 4-6 hrs dev | $0 | 1-20 assets |
| Hybrid A+C | $500 + 2 hrs | $0.005 avg | 10-200 assets |

---

## Action Items by Option

### If choosing Option A (Vision API):
```
[ ] Enable Google Vision API in GCP project
[ ] Add credentials to environment
[ ] Write color mapping function (CSS colors → design tokens)
[ ] Write kr-motif detection function
[ ] Add fallback for API failures
[ ] Test with 5 sample assets
[ ] Document Vision API limitations
[ ] Set up quota alerts
```

### If choosing Option B (Prompt):
```
[ ] Define METADATA format specification
[ ] Add metadata parser function
[ ] Update Gemini prompt template with METADATA block
[ ] Document designer workflow
[ ] Create validation schema (color, kr-motif whitelist)
[ ] Test with 5 sample assets
[ ] Train designers on metadata format
```

### If choosing Option C (Form):
```
[ ] Design form UI (web or CLI)
[ ] Create manifest JSON schema
[ ] Build form → JSON writer
[ ] Add color token picker
[ ] Add kr-motif checklist
[ ] Implement validation
[ ] Test with 5 sample assets
[ ] Deploy form (where? web app? CLI?)
```

### If choosing Hybrid A+C:
```
[ ] Implement Option A (Vision API)
[ ] Implement Option C fallback (Form UI)
[ ] Create review UI (approve/edit extracted metadata)
[ ] Connect Vision API → Form prefill
[ ] Write fallback logic
[ ] Test success + failure paths
[ ] Document hybrid workflow
[ ] Set SLA (API failures → use form)
```

---

## Team Discussion Questions

1. **Do we have generation prompts?** (Affects Option B feasibility)
2. **Is Vision API cost acceptable?** (Budget: <$50/month for 100+ assets)
3. **Can designers add metadata?** (Time: 2-3 min per asset for Option C)
4. **What's the asset volume?** (5/month → Option C; 50+/month → Option A)
5. **Is accuracy critical?** (Yes → Option C; Somewhat → Option A with review)

---

## Recommendation: Start with Hybrid A+C

**Phase 1** (Week 1):
- Implement Option C (Manual Form) for accuracy baseline
- Process first 5-10 assets with form
- Establish metadata standard

**Phase 2** (Week 2-3):
- Implement Option A (Vision API) as enhancement
- Use Vision API for 80% of extractions
- Form as fallback for exceptions
- Designer review step to ensure quality

**Phase 3** (Week 4+):
- Scale to full production
- Monitor Vision API accuracy
- Optimize kr-motif detection
- Automated pipeline with guardrails

**Total effort**: 6-8 hours (Phase 1 + 2 combined)
**Timeline**: 3-4 weeks to full automation
**Risk**: Low (fallback to manual form always available)

---

## Next Steps

1. **Schedule team meeting** to decide on Option A/B/C/Hybrid
2. **Document decision** in this file (update "DECISION:" section below)
3. **Assign implementation** to developer
4. **Create user story** for chosen option

---

## DECISION (to be filled by team)

**Option Selected**: _______

**Rationale**: _______

**Owner**: _______

**Timeline**: _______

**Dependencies**: _______

---

_IDF Metadata Source Clarification | Feb 11, 2026 | Decision Pending_
