# CareerCopilot Document Templating & Generation Architecture

## High‑level recommendations

- Introduce a shared, strongly typed **document/content schema** (JSON/Pydantic) that all Genkit flows write into and the DOCX/HTML renderers read from.
- Represent layout as **schema‑driven JSON/YAML templates** (blocks, sections, ordering) and keep visual styling in **separate theme objects** (design tokens → DOCX styles → React preview).
- Keep DOCX as the **master output**, generate **text‑based PDFs and plain text** from that, and centrally codify ATS rules (one column, no tables/images, standard headings) as data, not ad‑hoc logic.[^1][^2][^3]
- Maintain a curated library of **built‑in ATS‑safe templates** and expose a constrained customization layer (fonts, accent color roles, spacing, optional blocks) validated against the same ATS rule set before use.[^4][^5]
- Refactor existing flows (resume, cover letter, KSC) to **share prompts and content blocks** over a common schema, and route everything through a single `document_pipeline` that performs: schema build → AI drafting → ATS gate → render → export.

***

## Architecture patterns in React + AI resume / cover‑letter tools

### Code: canonical content schema and React view separation

```ts
// frontend/src/schemas/profile.ts
// Canonical client-side schema mirrors backend Pydantic models

export type WorkExperience = {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;   // ISO date
  endDate?: string;    // null/undefined for "Present"
  bullets: string[];   // plain text bullets, no markup
};

export type Education = {
  id: string;
  institution: string;
  qualification: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  highlights?: string[];
};

export type SkillGroup = {
  label: string;       // e.g. "Technical", "Human Services"
  skills: string[];    // e.g. ["Case management", "Trauma-informed practice"]
};

export type Profile = {
  id: string;
  basics: {
    fullName: string;
    pronouns?: string;
    title?: string;
    location?: string;
    email: string;
    phone?: string;
    links?: { label: string; url: string }[];
  };
  summary?: string;
  work: WorkExperience[];
  education: Education[];
  skillGroups: SkillGroup[];
  projects?: {
    id: string;
    name: string;
    description: string;
    bullets?: string[];
  }[];
  values?: string[];
};

// Example React theme consuming schema
export function ResumeTemplateOneColumn({ profile }: { profile: Profile }) {
  return (
    <main className="bg-[var(--sys-color-surface)] text-[var(--sys-color-on-surface)]">
      {/* Header */}
      <header className="pb-4 border-b border-[var(--sys-color-outline)]">
        <h1 className="font-[var(--sys-type-display)] text-3xl">
          {profile.basics.fullName}
        </h1>
        {profile.basics.title && (
          <p className="font-[var(--sys-type-body)] text-sm">
            {profile.basics.title}
          </p>
        )}
      </header>
      {/* Sections map 1:1 to schema; view decides exact typography only */}
      {/* ... */}
    </main>
  );
}
```

Modern AI‑augmented resume tools commonly separate a **machine‑readable resume JSON schema** from visual themes built as React components. JSON Resume is the most widely used example: the schema defines `basics`, `work`, `education`, `skills`, etc., while React/HTML themes render that schema in different layouts without changing the underlying data. Open‑source tools like `react-ultimate-resume` and Reactive Resume both sit on top of JSON Resume, adding only light extensions, which demonstrates that a stable schema plus multiple front ends is a robust pattern for resumes.[^6][^7][^8][^9][^10]

AI‑native builders then layer flows on top of this schema: raw user profile → AI‑rewritten bullets and summaries → schema object → render to HTML/DOCX/PDF. The AI is asked to emit content that already fits structured slots (e.g. bullet arrays, summary strings) rather than arbitrary prose, which keeps rendering logic simple and ATS‑safe.[^11][^4]

### Code: AI flow stages for draft → refine → format

```python
# ai/flows/backend/document_pipeline.py

class DocumentPipeline:
    def __init__(self, llm_client, ats_gate, renderer, templates_repo):
        self.llm = llm_client
        self.ats_gate = ats_gate
        self.renderer = renderer
        self.templates = templates_repo

    async def generate(self, *,
                       doc_type: str,           # "resume" | "cover_letter" | "ksc"
                       template_id: str,
                       theme_id: str,
                       profile: ProfileModel,
                       job: JobContextModel) -> bytes:
        # 1) Build a structured plan based on template
        template = self.templates.get(doc_type, template_id)
        doc_plan = plan_document(template, profile, job)

        # 2) Ask AI to fill content fields only
        filled_doc = await draft_with_llm(
            llm=self.llm,
            doc_plan=doc_plan,
            profile=profile,
            job=job,
        )

        # 3) ATS gate validates text + structure
        self.ats_gate.validate(filled_doc)

        # 4) Render to DOCX (and others as needed)
        return self.renderer.render(
            document=filled_doc,
            template=template,
            theme_id=theme_id,
        )
```

Common AI patterns in Next.js/React resume tools are:

- **Separate planning from drafting**: tools first decide the section order and which experiences to emphasize, then call AI to fill only the text fields, not the entire document.[^11]
- **Slot‑based prompts**: each section or block (e.g. "experience bullets", "cover letter intro") has a dedicated prompt that takes structured inputs (work history, job ad, tone) and returns content in a constrained format (e.g. `"bullets": ["…"]`).[^5][^4]
- **Post‑processing and validation**: outputs are cleaned for special characters, word counts, and ATS‑breaking elements like emojis or unusual bullet symbols.[^1]
- **Decoupled formatting**: the final render is handled by a separate layer (React PDF, DOCX generator, or HTML → PDF) so flow logic never needs to know about fonts or margins.[^12][^11]

For CareerCopilot, this suggests maintaining your Genkit flows but making their outputs **instances of a shared document schema**, which the ATS gate and renderer consume agnostically.

***

## Template and theme system with ATS safety

### Code: schema‑driven template definition (JSON/YAML)

```json
// ai/templates/backend/resume_minimal.json
{
  "id": "resume_minimal_v1",
  "docType": "resume",
  "label": "Minimal one-column (ATS)",
  "description": "Single-column, no tables, standard headings.",
  "blocks": [
    { "kind": "header", "source": "profile.basics" },
    { "kind": "summary", "source": "profile.summary", "optional": true },
    {
      "kind": "section",
      "id": "experience",
      "title": "Experience",
      "source": "profile.work",
      "itemTemplate": "experience_compact_v1"  // maps to a prompt + render pattern
    },
    {
      "kind": "section",
      "id": "education",
      "title": "Education",
      "source": "profile.education",
      "itemTemplate": "education_default_v1"
    },
    {
      "kind": "section",
      "id": "skills",
      "title": "Skills",
      "source": "profile.skillGroups"
    }
  ],
  "atsProfile": {
    "columns": 1,
    "allowsTables": false,
    "allowsImages": false,
    "allowsTextBoxes": false
  }
}
```

Leading resume tools represent templates in data, not only in JSX: JSON Resume themes and tools like `react-ultimate-resume` treat the resume as JSON and treat templates as **mappings from schema fields to visual blocks**. This allows multiple templates to share the same logical structure while rendering very differently, which is critical for maintaining ATS‑safe semantics while letting users change appearance.[^7][^9][^10]

For CareerCopilot, a template JSON like the above gives you:

- A **block list** that defines section order and which parts of the profile appear where.
- A **source path** for each block, pointing into the shared schema (`profile.work`, `profile.skillGroups`).
- An **ATS profile** you can validate at template load time to ensure there are no multi‑column or table‑based designs.

### Code: ATS‑safe theme tokens → DOCX styles

```python
# backend/app/core/theme_tokens.py

from enum import Enum
from typing import Dict


class FontFamily(str, Enum):
    CALIBRI = "Calibri"
    ARIAL = "Arial"
    TIMES_NEW_ROMAN = "Times New Roman"


class ThemeTokens(BaseModel):
    id: str
    label: str
    roles: Dict[str, str]  # e.g. {"color.primary": "--sys-color-primary", ...}
    typography: Dict[str, str]
    spacing: Dict[str, float]


DEFAULT_THEMES = [
    ThemeTokens(
        id="minimal_gold",
        label="Minimal · Ink Gold",
        roles={
            "color.accent": "--sys-color-primary",   # maps to Ink Gold in Kerala Rage
            "color.text": "--sys-color-on-surface"
        },
        typography={
            "font.body": FontFamily.CALIBRI,
            "font.heading": FontFamily.CALIBRI,
            "size.body": "11pt",
            "size.heading": "12pt",
            "weight.heading": "bold"
        },
        spacing={
            "section.gap": 6.0,
            "bullet.gap": 2.0
        },
    ),
]


def apply_theme_to_docx(doc, theme: ThemeTokens):
    # Use python-docx API to configure styles once per document
    styles = doc.styles
    body_style = styles["Normal"]
    body_style.font.name = theme.typography["font.body"]
    body_style.font.size = Pt(int(theme.typography["size.body"].replace("pt", "")))
    # Heading styles, accent color, etc. mapped similarly
```

ATS‑focused builders consistently stress **one‑column layouts, simple headings, and standard fonts** such as Calibri, Arial, or similar sans‑serif faces. They also advise against background colors, graphics, or icons and recommend a monochrome or single accent palette applied only to headings or subtle separators. In your case, Kerala Rage’s `--sys-color-*` and `--sys-type-*` tokens can drive both the React preview and DOCX style definitions, but the exported document should stick to a small, ATS‑safe font family enum and basic color usage.[^2][^3][^1]

A good strategy for CareerCopilot:

- Treat **template JSON** as the layout contract (sections, ordering, what fields are shown).
- Treat **theme tokens** as the visual contract (font family/size, accent color, spacing), expressed via Kerala Rage roles like `--sys-color-primary`, `--sys-type-body`, etc., then mapped to python‑docx styles.
- Enforce ATS safety at two levels:
  - **Static checks on templates**: `columns == 1`, `allowsTables == false`, `allowsImages == false`, no background fills.
  - **Runtime ATS gate on content**: ensure bullet glyphs are simple, no emojis, no oversized headings, and word counts fall within configured bounds.[^1]

### User‑facing customization without breaking ATS

Practical options that mirror what leading tools do:[^4][^5]

- Offer **preset themes**: "Minimal", "Modern", "Professional", "Creative" where “creative” still respects single column and no graphics—differences are mainly in spacing and heading weight.
- Expose **safe controls**:
  - Font family: a dropdown of 3–4 safe fonts (Calibri, Arial, Times New Roman).
  - Accent color: a small palette of roles (`primary`, `secondary`, `waratah`) mapped to color tokens, applied only to headings and section rules.
  - Density: compact/normal/relaxed spacing presets that map to `section.gap` and `bullet.gap` tokens.
  - Optional blocks: toggles for Summary, Projects, Volunteering, etc., controlled via the `optional` flag in template JSON.
- Hide risky options entirely (tables, icons, sidebars, profile photos) for ATS‑first templates and reserve them only for separate "portfolio" modes if needed.

Because your DOCX renderer already outputs single‑column, text‑only layouts, this is mostly about parameterizing your current “gold standard” styling rather than adding new structures.

***

## Template file types vs output formats

### Code: template repository abstraction

```python
# backend/app/core/templates_repo.py

from pathlib import Path
import json
from typing import Dict


class TemplateRepo:
    def __init__(self, root: Path):
        self.root = root
        self._cache: Dict[str, dict] = {}

    def get(self, doc_type: str, template_id: str) -> dict:
        key = f"{doc_type}:{template_id}"
        if key not in self._cache:
            path = self.root / doc_type / f"{template_id}.json"
            with path.open() as f:
                raw = json.load(f)
            validate_template_schema(raw)  # JSON Schema + ATS static checks
            self._cache[key] = raw
        return self._cache[key]
```

### JSON/YAML schemas

JSON or YAML templates that describe sections, blocks, and ATS attributes are:

- **Flexible for AI**: easy to feed into prompts so the LLM knows which sections and tones to generate for.[^10]
- **Versionable and testable**: small structured files work well with Git diffs and can be validated with JSON Schema and unit tests.
- **ATS‑auditable**: rule engines can walk the JSON and assert invariants (no columns > 1, no table blocks, standard heading titles), which is much harder with DOCX or JSX.

This is the strongest fit for CareerCopilot’s Python backend and existing `prompt_templates.json`.

### Markdown/HTML templates with placeholders

Markdown or HTML templates are more common in static‑site style builders and React apps that render to the browser and then use print‑to‑PDF. They:[^7][^11]

- Work well for **human‑readable previews** but make DOCX generation harder—you typically need a separate rendering path or HTML → DOCX conversion, which is fragile.
- Are less transparent for ATS validation because layout semantics (columns, tables) are buried in markup rather than explicit fields.

These can still be useful as **view‑layer templates** for web previews, but CareerCopilot should not use them as the canonical template definition.

### React component templates

React themes (as seen in JSON Resume themes, Reactive Resume, and others) are ideal for **frontend rendering** of the resume schema. However:[^8][^9][^7]

- Using JSX as the source of truth for templates couples layout to the web stack and makes backend reasoning, ATS validation, and Python‑side rendering much more complex.
- They are not convenient to inspect from a Python service that needs to generate DOCX.

Recommendation: treat React components purely as **views over canonical JSON templates**. The same template JSON that drives DOCX can be loaded into the frontend and rendered as React, keeping semantics consistent.

### DOCX‑based template files

DOCX templates (e.g. using Docxtemplater or content controls) are common in web resume generators because they let designers build templates visually and developers just bind data fields. The drawbacks for an ATS‑first system are:[^12]

- **Opaque semantics**: tables, text boxes, multi‑column sections, and images can be embedded without any easy way to detect them programmatically.
- **Versioning pain**: `.docx` files diff poorly, making code review and regression testing hard.
- **ATS safety uncertainty**: if a future designer introduces a two‑column layout or header text, it may silently break parsing.[^3][^2]

Given CareerCopilot’s focus on ATS safety, the better approach is controlling layout via code and JSON templates, using python‑docx for rendering, and treating DOCX as a **generated artifact**, not as a template store.

### Output formats for users (DOCX, PDF, Markdown, text)

Research across ATS vendors and resume experts converges on the following:

- **DOCX** is the most universally ATS‑compatible format for corporate systems, especially for older or conservative ATS engines.[^13][^2][^3]
- **Text‑based PDF** (exported from Word/Google Docs, not a scanned image) is widely accepted by modern ATS, but a minority of systems still struggle with complex PDFs.[^2][^3][^13]
- **Plain text (TXT)** is maximally readable by ATS but not visually appealing.[^2]

Practical guidance for CareerCopilot:

- Keep DOCX as the **canonical output** from `docx_renderer.py`.
- Add a small utility to generate a **text‑based PDF** by printing the DOCX through a headless converter (e.g. LibreOffice headless, `docx2pdf`, or a cloud function) and label it "PDF (ATS‑safe, text‑based)" to distinguish from scanned PDFs.[^2]
- Provide a **plain‑text export** that serializes the structured schema (header lines, sections, bullets) as UTF‑8 text for systems that explicitly request pasted text.
- Optionally expose **Markdown** for power users and internal debugging, but mark it as a convenience format, not necessarily ATS‑optimized.

***

## Built‑in templates vs user‑generated templates

### Code: template metadata with capability flags

```json
// ai/templates/backend/manifest.json
{
  "templates": [
    {
      "id": "resume_minimal_v1",
      "docType": "resume",
      "label": "Minimal · ATS Gold Standard",
      "atsSafe": true,
      "userEditable": false
    },
    {
      "id": "resume_modern_v1",
      "docType": "resume",
      "label": "Modern · Single Column",
      "atsSafe": true,
      "userEditable": true
    },
    {
      "id": "coverletter_classic_v1",
      "docType": "cover_letter",
      "label": "Classic Block Letter",
      "atsSafe": true,
      "userEditable": true
    }
  ]
}
```

Open‑source resume builders typically ship with a set of **curated themes** that are known to be ATS‑compatible and then either lock them down or expose limited customization. Reactive Resume, JSON Resume themes, and similar projects distinguish between the schema (which is stable) and themes (which may be contributed by the community but are reviewed before inclusion).[^9][^8][^10][^5][^7]

AI SaaS builders like AiApply or ResumeUnlocked tend to keep their ATS templates proprietary and offer users only safe customizations (content, minor layout toggles, colors), not arbitrary template uploads. This pattern indicates that **user‑uploaded DOCX templates are high‑risk for ATS** and should be avoided or heavily constrained.[^5][^4]

### Recommendations for CareerCopilot

1. **Core gold‑standard library**
   - Maintain a small set of **built‑in, read‑only templates** for each document type:
     - `resume_minimal_v1` (what your current DOCX output approximates).
     - `resume_modern_v1` (slightly more expressive headings/spacing, same semantics).
     - `coverletter_classic_v1` and `coverletter_modern_v1`.
     - `ksc_statement_v1` (per‑criterion structure).
   - Store them under `ai/templates/backend/{doc_type}/` as JSON, and cover them with unit tests and snapshot tests against ATS rules.

2. **Safe customization layer**
   - Allow users to define **custom variants** only via a **high‑level layout builder UI** that manipulates the same schema blocks:
     - Reorder sections.
     - Toggle optional blocks (Summary, Projects, Volunteer).
     - Adjust density presets and font family from the allowed enum.
   - Serialize these variants as JSON and validate them with:
     - JSON Schema for structure.
     - ATS rule engine for constraints (no multi‑column, no tables/images/text boxes, standard heading names where required).

3. **Guardrails for user‑defined templates**

```python
# backend/app/core/ats_rules.py

ATS_RULES = load_rules_from_json("ai/prompts/backend/format_rules.json")


def validate_template_schema(template: dict) -> None:
    # Structural checks
    if template.get("atsProfile", {}).get("columns", 1) != 1:
        raise ValueError("Multi-column layouts are not ATS-safe")
    if template["atsProfile"].get("allowsTables"):
        raise ValueError("Tables are disabled for ATS-safe templates")
    # Heading checks
    required_headings = ATS_RULES["resume"]["required_headings"]
    present = {b.get("title") for b in template["blocks"] if b["kind"] == "section"}
    missing = set(required_headings) - present
    if missing:
        raise ValueError(f"Missing required ATS headings: {missing}")
```

   - Synchronize `format_rules.json` and template schemas by:
     - Defining **one canonical `ats_rules.json`** that includes both content rules (word counts, forbidden characters) and structural rules (layout constraints), and
     - Having both `ats_gate.py` and `validate_template_schema` read from this single source.

4. **User uploads**
   - Avoid accepting raw DOCX templates from users for ATS documents.
   - If a future roadmap includes this, gate it as a **separate feature** with strong warnings and a distinct non‑ATS template category.

***

## Consistency across resumes, cover letters, and KSC

### Code: shared content schema feeding multiple document types

```python
# ai/schemas/document_models.py

class SelectionCriterion(BaseModel):
    id: str
    prompt: str
    word_limit: int
    # Structured STAR evidence links into work history
    evidence_experience_ids: list[str]
    draft_response: str | None = None


class CareerProfile(BaseModel):
    profile: ProfileModel
    job: JobContextModel
    criteria: list[SelectionCriterion] = []
```

```python
# Example: building a cover letter plan from shared profile

def plan_cover_letter(template, career_profile: CareerProfile):
    profile = career_profile.profile
    job = career_profile.job
    # Use same work history & achievements as resume, but different framing
    return CoverLetterDocument(
        header=Header.from_profile(profile, job),
        intro=IntroBlock.from_profile(profile, job),
        body_paragraphs=pick_relevant_experiences(profile.work, job)[:3],
        closing=ClosingBlock.from_profile(profile, job),
    )
```

Successful platforms reuse the same core career data across resumes, cover letters, and other materials, simply changing the **framing, tone, and subset of evidence**. For example, AiApply describes taking a master profile and job description, then tailoring both the resume and cover letter using shared AI components, with an integrated ATS checker. This avoids inconsistent job titles or dates between documents and keeps branding aligned.[^4][^1]

For CareerCopilot, the shared schema should include:

- **Profile**: personal details, pronouns, location, contact info, social links.
- **Work history**: normalized experiences with IDs so KSC answers can reference them.
- **Education and certifications**.
- **Skills and capabilities**: grouped for human services (case management, advocacy, community engagement), plus tech/AI fluency where relevant.
- **Achievements and values**: e.g. key impact stories aligned with social work values (equity, trauma‑informed practice).
- **Job context**: role title, organisation, selection criteria items, key phrases from the job ad.

Each document type then defines **which blocks it uses** and how tone is applied:

- Resume: dense bullets, neutral–professional tone, concise impact statements.
- Cover letter: narrative framing, paragraphs, explicit alignment with organisation mission and values.
- KSC: per‑criterion STAR responses that deep‑dive into 1–2 experiences each, within word limits.

Your existing flows (`smart_cover_letter_system.py`, `resume_optimizer.py`, `ksc_generator.py`) can be refactored to accept the shared `CareerProfile` and a `DocumentTemplate` instead of their own bespoke payloads.

***

## Refactoring and optimization plan for CareerCopilot

### Code: unifying prompt templates around block types

```json
// ai/prompts/backend/prompt_templates.json (refactored excerpt)
{
  "blocks": [
    {
      "id": "resume.experience.bullets",
      "docTypes": ["resume"],
      "inputFields": ["experience", "job", "tone", "style"],
      "outputField": "bullets",
      "template": "You are optimizing resume bullets for a social work and community services professional..."
    },
    {
      "id": "cover_letter.body.paragraph",
      "docTypes": ["cover_letter"],
      "inputFields": ["experience", "job", "values", "tone"],
      "outputField": "paragraphText",
      "template": "Write one paragraph for a cover letter body focusing on this experience..."
    },
    {
      "id": "ksc.criterion.response",
      "docTypes": ["ksc"],
      "inputFields": ["criterion", "experiences", "job", "tone"],
      "outputField": "response",
      "template": "Write a STAR-format response to this selection criterion..."
    }
  ]
}
```

```python
# backend/app/core/prompt_service.py (conceptual)

def build_prompt(block_id: str, *, context: dict) -> str:
    block_cfg = PROMPT_CONFIG[block_id]
    data = {field: context[field] for field in block_cfg["inputFields"]}
    return render_template(block_cfg["template"], data)
```

### Code: centralized document pipeline

```python
# backend/app/core/document_pipeline.py

class DocumentPipeline:
    def __init__(self, llm, ats_rules, templates_repo, renderer):
        self.llm = llm
        self.ats_rules = ats_rules
        self.templates_repo = templates_repo
        self.renderer = renderer

    async def generate_document(self, *,
                                profile: CareerProfile,
                                doc_type: str,
                                template_id: str,
                                theme_id: str) -> bytes:
        template = self.templates_repo.get(doc_type, template_id)
        # 1. Build plan from template + profile
        plan = plan_document_from_template(template, profile)
        # 2. Fill plan via shared prompt blocks
        drafted = await fill_plan_with_ai(plan, profile, self.llm)
        # 3. ATS validation (content + structure)
        validate_document(drafted, template, self.ats_rules)
        # 4. Render + export
        return self.renderer.render(drafted, template, theme_id)
```

### Concrete refactors by module

1. **`ai/prompts/backend/prompt_templates.json`**
   - Move from "per‑flow" prompt templates to **block‑oriented prompts** keyed by `block_id` that correspond to parts of the schema.
   - Ensure cover letters, resumes, and KSC reuse the same bullet, summary, and achievement prompts where appropriate, only varying the framing text.

2. **`backend/app/core/prompt_service.py`**
   - Generalize to a **block prompt builder** driven by the template schema instead of hand‑assembling prompts per flow.
   - Inject **tone and style options** (currently in `smart_cover_letter_system.py` and `prompt_config.json`) as explicit fields in the shared context so that all document types use the same enums.

3. **Genkit flows (`smart_cover_letter_system.py`, `resume_optimizer.py`, `ksc_generator.py`)**
   - Normalize them to:
     1. Build/receive a `CareerProfile` instance.
     2. Select `doc_type`, `template_id`, and `theme_id`.
     3. Call the shared `DocumentPipeline.generate_document` method.
   - Each flow can still have small specializations (e.g. KSC word limits, which criteria to include), but they should never touch layout or rendering directly.

4. **ATS gate (`ai/prompts/backend/format_rules.json` + `backend/app/core/ats_gate.py`)**
   - Promote this to a central `ats_rules.json` consumed by:
     - `ats_gate.py` for content validations (word counts, forbidden characters, headings present in text where needed).
     - Template validator for structural checks (sections, columns, tables/photos).
   - Add tests that ensure all built‑in templates and a set of generated documents pass ATS rules for each document type.

5. **DOCX renderer (`backend/app/core/docx_renderer.py`)**
   - Refactor to accept `(document: DraftedDocumentModel, template: TemplateJSON, theme: ThemeTokens)` instead of loosely coupled arguments.
   - Implement a small **rendering DSL** that knows how to render each block kind (`header`, `summary`, `section`, `criterion`) based on schema types, ensuring that adding new templates rarely requires touching Python.
   - Integrate theme tokens so you can map Kerala Rage typography and color roles to safe DOCX styles once per document rather than hardcoding Calibri sizes everywhere.

6. **Export service (`backend/app/core/document_export_service.py`)**
   - Keep GCS upload logic, but:
     - Add optional **secondary exports**: text‑based PDF and plain text derived from the same schema.
     - Return a structured payload: `{ docxUrl, pdfUrl?, txtUrl? }` so frontend can label them clearly as "ATS‑optimized DOCX" and "Recruiter‑friendly PDF (ATS-safe)".

7. **React frontend (Vite + Tailwind + Zustand)**
   - Load template and theme manifests from the backend so UI choices (template carousel, theme selectors) map directly to backend IDs.
   - Use Kerala Rage design tokens (`--sys-color-*`, `--sys-type-*`) for on‑screen previews and ensure typography uses variable fonts (Fraunces, Work Sans, JetBrains Mono) per your system, even though the exported DOCX is limited to ATS‑safe fonts.
   - Implement a **live preview** that renders the same schema and template JSON the backend uses, ensuring no drift between preview and exported DOCX.

***

## Summary of key design choices

- Use a **shared content schema** inspired by JSON Resume, extended for cover letters and KSC, as the backbone across all flows.[^9][^10]
- Store **layout templates as JSON/YAML** and **themes as tokenized style objects**, keeping both ATS‑auditable and easy to version.
- Treat **DOCX as the canonical artifact**, with PDF and text exports derived from it for maximum ATS compatibility.[^3][^13][^2]
- Maintain **curated ATS‑safe templates** while exposing a **constrained customization layer** that can be rigorously validated.
- Unify Genkit flows behind a **single document pipeline** so CareerCopilot can add new document types and themes with minimal new code while preserving ATS safety and consistent branding across resumes, cover letters, and KSC responses.[^5][^1][^4]

---

## References

1. [Use AI to Optimize Resume Formatting for Humans & ATS](https://www.resumly.ai/blog/use-ai-to-optimize-resume-formatting-for-humans-and-ats) - Learn step‑by‑step how AI can perfect your resume layout for recruiters and applicant tracking syste...

2. [Optimizing resume file formats for seamless ATS parsing](https://www.resumly.ai/blog/optimizing-resume-file-formats-for-seamless-parsing-by-modern-ats) - Bottom line: DOCX and text‑based PDF are the safest bets for most modern ATS. Step‑by‑Step Guide to ...

3. [Best Resume Formats for ATS Compatibility in 2026](https://pitchmeai.com/blog/ats-compatible-resume-formats) - File Format Selection ... The two most ATS-compatible formats are DOCX (Microsoft Word) and PDF. How...

4. [Build Your Perfect Resume With AI in Minutes](https://aiapply.co/resume-builder) - AiApply offers ATS-friendly templates plus a large library of resume and cover letter examples you c...

5. [ResumeUnlocked - Free AI Resume Builder ATS-Friendly](https://resumeunlocked.vercel.app) - AI Resume Builder - Professional & ATS-Friendly. Create a stunning, ATS-friendly resume in 3 minutes...

6. [Projects](https://jsonresume.org/projects) - A web app that generates resumes based on JSON Resume schema. Standard Resume. N/A. A web-based resu...

7. [I Built a Modern React Theme for JSON Resume](https://dev.to/phoinixi/i-built-a-modern-react-theme-for-json-resume-d4h) - The theme renders all standard sections from the JSON Resume schema: Basic information with optional...

8. [AmruthPillai/Reactive-Resume](https://github.com/amruthpillai/reactive-resume) - A one-of-a-kind resume builder that keeps your privacy in mind. Completely secure, customizable, por...

9. [welovedevs/react-ultimate-resume: 💼 🎨 A modern software ...](https://github.com/welovedevs/react-ultimate-resume) - We used JSON Resume, a community driven open source initiative to create a JSON based standard for r...

10. [JSON Resume](https://jsonresume.org) - JSON Resume. The open-source initiative to create a JSON-based standard for resumes. For developers,...

11. [Build an AI Powered Resume Builder with React and OpenAI ...](https://ashishkamat.com.np/blog/building-an-ai-powered-resume-builder-with-react-and-openai-api) - Learn how to build an AI powered resume builder with React and OpenAI. Generate ATS friendly resumes...

12. [I built a web based resume generator using Docxtemplater](https://jeffreyon.hashnode.dev/i-built-a-web-based-resume-generator-using-docxtemplater) - I built a web based resume generator using Docxtemplater. Here's everything i learnt about generatin...

13. [Choose the Right File Type for Your Resume: 2025 Guide](https://smallpdf.com/blog/choose-the-right-file-type-for-your-resume) - For most job applications, choose PDF to preserve formatting. Use Word (.docx) when specifically req...
