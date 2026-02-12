# Stage 2 Asset Gap Report

This report summarizes the 12 unmatched asset markers identified in the hi-fi blueprints during Phase A of the Stage 2 automation. These gaps represent assets that do not yet have canonical tokens or production files.

## High-Priority Gaps (Motifs)
The following markers refer to "Motif" assets which provide visual texture and highlighting across several components.

| Motif Description | Target Blueprint | Status |
|-------------------|------------------|--------|
| Motif accents for Elite/High-Mastery skills | AnalysisDashboard-hifi.md | Needs Token (KR-UI-008?) |
| Motif overlay for Success Screen (Z-0) | ApplicationFormFlow-hifi.md | Needs Token |
| Metric-specific graphical motifs (mini-charts) | DashboardOverview-hifi.md | Needs Token |
| Scanning holographic motif for primary CTA | Ingestion-hifi.md | Needs Token |
| Status-specific [DEPRECATED_STYLE] icons | OpportunityFeed-hifi.md | Needs Token |
| [DEPRECATED_STYLE] Badge icons for achievements | ProfileSettings-hifi.md | Needs Token |
| Grid Line decorative motifs for panel corners | SplitScreenEditor-hifi.md | Needs Token |
| [DEPRECATED_STYLE] Motif reservoir items | StudioDesigner-hifi.md | Needs Token |

## Exact Asset Marker Mapping (Stage 2)

The literal strings below are extracted from the hi-fi blueprints. They have been assigned unique `KR-UI` IDs and canonical file paths to resolve the gaps.

| Literal Blueprint Marker (TODO String) | KR-UI ID | Canonical File Path | Source Blueprint |
|:---|:---|:---|:---|
| `[DEPRECATED_STYLE] Motif accents for Elite/High-Mastery skills.` | `KR-UI-008` | `/assets/kr-solidarity/ui-kit/svg/KR-UI-008.svg` | `AnalysisDashboard-hifi.md` |
| `Mastery Chart SVG/Canvas patterns` | `KR-UI-009` | `/assets/kr-solidarity/ui-kit/svg/KR-UI-009.svg` | `AnalysisDashboard-hifi.md` |
| `[DEPRECATED_STYLE] Motif overlay for Success Screen (Z-0)` | `KR-UI-010` | `/assets/kr-solidarity/ui-kit/svg/KR-UI-010.svg` | `ApplicationFormFlow-hifi.md` |
| `Historical Record Background Texture (Z-0, 5% opacity)` | `KR-UI-011` | `/assets/kr-solidarity/ui-kit/svg/KR-UI-011.svg` | `DashboardOverview-hifi.md` |
| `Metric-specific graphical motifs (mini-charts or [DEPRECATED_STYLE] symbols).` | `KR-UI-012` | `/assets/kr-solidarity/ui-kit/svg/KR-UI-012.svg` | `DashboardOverview-hifi.md` |
| `Scanning holographic motif for primary CTA button.` | `KR-UI-013` | `/assets/kr-solidarity/ui-kit/svg/KR-UI-013.svg` | `Ingestion-hifi.md` |
| `[DEPRECATED_STYLE] Motif accents on "Resolved" cards.` | `KR-UI-014` | `/assets/kr-solidarity/ui-kit/svg/KR-UI-014.svg` | `KanbanBoard-hifi.md` |
| `Priority Indicator motifs (Halo variant).` | `KR-UI-015` | `/assets/kr-solidarity/ui-kit/svg/KR-UI-015.svg` | `KanbanBoard-hifi.md` |
| `Status-specific [DEPRECATED_STYLE] icons for list items.` | `KR-UI-016` | `/assets/kr-solidarity/ui-kit/svg/KR-UI-016.svg` | `OpportunityFeed-hifi.md` |
| `[DEPRECATED_STYLE] Badge icons for specific skill achievements.` | `KR-UI-017` | `/assets/kr-solidarity/ui-kit/svg/KR-UI-017.svg` | `ProfileSettings-hifi.md` |
| `Grid Line decorative motifs for panel corners.` | `KR-UI-018` | `/assets/kr-solidarity/ui-kit/svg/KR-UI-018.svg` | `SplitScreenEditor-hifi.md` |
| `[DEPRECATED_STYLE] Motif reservoir items.` | `KR-UI-019` | `/assets/kr-solidarity/ui-kit/svg/KR-UI-019.svg` | `StudioDesigner-hifi.md` |

## Next Steps
1. **Register Tokens**: Update `frontend/public/assets/kr-solidarity-ui-token-map.json` to include IDs `KR-UI-008` through `KR-UI-019` with the paths specified above.
2. **Assign Semantic Matchers**: Update `scripts/kr/replace-asset-tokens.mjs` to include these exact patterns mapping to their new tokens.
3. **Generate Assets**: Use the [Asset Playbook](file:///Users/okgoogle13/Desktop/careercopilot/docs/design/asset-playbook.md) to generate the SVGs.
4. **Re-run Orchestration**: Execute `./scripts/orchestrate-stage2.sh` to complete the integration.
