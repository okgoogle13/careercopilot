# Design System Protocol: ManifestoCard

**Component Role**: Foundational identity assertion tool for the Solidarity Mode journey.

## 1. Design Identity Brief (Solidarity Only)

- **Persona**: The Kerala Migrant Activist / Solidarity Worker.
- **Narrative**: High-tension cultural memory meeting street protest truth.
- **Core Directives**: 
    - Unapologetic scale.
    - Visceral contrast.
    - Physicality (torn edges, viscous shadows).
- **Anti-Slop Protocol**: 
    - BANNED: Inter Light/Regular alone. Use 800-900 weight.
    - BANNED: Perfect symmetry. Every card must have asymmetric organic radii or a torn edge.
    - BANNED: Generic primary blue. Use Waratah Red or Baru Gold.

## 2. Orchestration Tokens

- **Typography**:
    - **Title**: `Direct Action` (Inter Variable), `wght: 800`, `wdth: 120`, `opsz: 144`.
    - **Body**: `Inter Variable`, `wght: 450`, `wdth: 95`.
- **Colors**:
    - **Surface**: Charcoal Background (#1a1a1a) or desaturated Smoke Green.
    - **Emphasis**: Waratah Red (#F14714).
    - **Highlights**: Baru Gold (#DAF674).
- **Physics**:
    - **Entrance**: `spring-elastic` (800ms) with `translate-y` rise.
    - **Interaction**: `hover-bloom` (scale 1.05) + `shadow-hover-rise`.
- **Morphology**:
    - **Shape**: `clip-path: polygon(...)` (torn edge) or asymmetric organic radius.

## 3. Annotated Wireframe Protocol (ManifestoCard)

### Region-to-Token Mapping
- `[Hero Title]`: `Display` size, `Solidarity` weight, `Waratah Red`.
- `[Card Container]`: `Charcoal` surface, `shadow-viscous`, `clip-path-tear`.
- `[Action Button]`: `Baru Gold` surface, `shadow-hover-rise`, `spring-elastic` physics.

### State Logic
- **Empty**: Low-opacity coconut palm motif + "NO MANIFESTO DECLARED".
- **Loading**: Wattle Gold pulse throb on the title text.
- **Success**: Baru Gold glow expansion + "STRENGTH RISING".
- **Error**: Waratah Red border shake + "RECLAMATION FAILED".

## 4. Emotion Tracing Matrix

| Journey Stage | Emotional Register | Technical Mapping |
|---------------|-------------------|-------------------|
| Entry | Confrontational Assertion | `Hero` 144px scale, `Waratah Red`, `spring-elastic` |
| Interaction | Collective Power | `Solidarity` weight expansion, `shadow-viscous` |
| Completion | Optimistic Defiance | `Baru Gold` glow, `shadow-hover-rise` |