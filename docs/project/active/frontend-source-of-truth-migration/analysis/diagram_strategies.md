# User Workflow Diagramming Strategies

To generate effective user workflow diagrams for Career Copilot, we leverage a hierarchy of context extraction and visual synthesis. This strategy uses `flash-sidekick` for broad analysis and specialized skills for targeted rendering.

---

## Strategy 1: Structural Discovery (Mermaid)

**Objective**: Rapidly generate a high-level "Sitemap" or "Route Tree" to establish the boundaries of the application.

### Prompting Pattern
> "Analyze `frontend/src/App.tsx` and use the `screens-pages-mermaid` skill to generate a `flowchart TD` sitemap. Group routes by their shared layouts (`MigratedRouteLayout`, `ProtectedLayout`, `PublicLayout`). Label nodes with both the URL path and the primary component name."

### Why it works
- **Speed**: Mermaid is low-overhead and renders instantly.
- **Accuracy**: It relies on "Capability Truth" (the router configuration).
- **Foundation**: Provides the skeletal structure needed for deeper Excalidraw work.

---

## Strategy 2: Journey-Driven Sequence (Mermaid)

**Objective**: Model specific user tasks (e.g., "Applying for a Job") as journeys rather than static routes.

### Prompting Pattern
> "Identify the sequence of pages and API interactions required for a user to upload a resume and receive an ATS analysis. reference `SmartIngestion.tsx` and `AnalysisPage.tsx`. Use `screens-pages-mermaid` to generate a `sequenceDiagram` showing the flow of data between User, Frontend, and Backend."

### Why it works
- **Functional**: Shows transitions and data flow, not just hierarchy.
- **Verification**: Can be used to find "gap moments" in the UI where feedback is missing.

---

## Strategy 3: Semantic Visual Argument (Excalidraw)

**Objective**: Create a premium, educational diagram for stakeholders or documentation that explains the *intent* and *fidelity* of the workflow.

### Prompting Pattern
> "Use the `excalidraw-diagram-skill` to create a multi-zoom workflow diagram.
> 1. **Summary Flow**: Show the three-stage 'Ingest -> Analyze -> Apply' pipeline at the top.
> 2. **Section Boundaries**: Split the canvas into 'Public Entry', 'Career Engine (Migrated)', and 'Document Workspace'.
> 3. **Evidence Artifacts**: Inside the 'Ingest' section, include a JSON snippet showing a sample `ResumeData` payload from `backend/app/schemas/`.
> 4. **Branding**: Use only the colors defined in `references/color-palette.md` (e.g., Start/Trigger for Landing, AI/LLM for Analysis)."

### Why it works
- **Premium Aesthetics**: Excalidraw allows for fine-grained control over layout and style.
- **Depth**: "Multi-zoom" ensures the diagram is useful for both planners and developers.
- **Traceability**: Including code/JSON evidence anchors the diagram in "Runtime Truth".

---

## Strategy 4: The Automated Context Chain

**Objective**: Use `flash-sidekick` to prep the data before a diagramming agent takes over.

### Workflow Template
1. **Prep**: `flash_sidekick.quick_summarize` all files in `frontend/src/pages/`.
2. **Identify**: Ask the model to list all cross-page links (e.g., `navigate('/tracker')`) found in those summaries.
3. **Draft**: Create a low-fi Mermaid diagram to verify connections.
4. **Elevate**: Convert the low-fi sitemap into a high-fi Excalidraw visual argument.

---

## Prompting Tips for "Visual Arguments"

- **Avoid the Grid**: Don't let the agent put everything in identical boxes. Specify: *"Give the Analysis node a unique shape (Cloud) to distinguish it from static pages."*
- **The Isomorphism Test**: Tell the agent: *"The structure of the diagram should mirror the authentication state: use a thick boundary to separate Public routes from Protected routes."*
- **Interactive Feedback**: Always use the **Render & Validate** loop for Excalidraw. Never accept the first JSON output without rendering it to PNG first.
