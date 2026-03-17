# Wireframe: JobList

<layout>
"THE LOOKOUT" (Display, 72px)
+-----------------------------------------------------------+
|  [ Filter: Region ] [ Filter: Type ] [ Filter: Pay ]      |
|                                                           |
|  +-----------------------------------------------------+  |
|  |  "SENIOR SOLIDARITY ENGINEER" (Subhead, 24px)      |  |
|  |  $120k AUD - Melbourne (Mono, 12px)                 |  |
|  |  [ TAG: TECH ] [ TAG: HYBRID ]                     |  |
|  +-----------------------------------------------------+  |
|                                                           |
|  +-----------------------------------------------------+  |
|  |  "CARE WORKER COLLECTIVE"                          |  |
|  |  [ TAG: CARE ]                                     |  |
|  +-----------------------------------------------------+  |
+-----------------------------------------------------------+
</layout>

<tokens>
- **Container**: `bg-charcoal`, `p-8`, `max-w-4xl`
- **Card**: `radius-stone`, `border-blueprint-grey`, `shadow-viscous`
- **Meta**: `text-metadata`, `font-jetbrains-mono`
- **Tags**: `radius-seed`, `bg-signal-green/20`, `text-signal-green`
</tokens>

<accessibility>
- **Role**: `main` -> `list` -> `listitem`
- **Focus Order**: Keyboard navigation through job cards.
- **Labels**: `aria-label` for each job card indicating title and company.
</accessibility>

<states>
- **Loading**: Empty cards with skeleton Ink Gold pulse.
- **Empty**: Kerala motif (palm tree) at 40% opacity with "NO OPPORTUNITIES FOUND".
- **Error**: "FEED RECOVERY IN PROGRESS" in Solidarity Red.
</states>

<assets>
- **Substrate**: `{kr-asset-screenprint-substrate}` at 22% opacity.
- **Pattern**: `{kr-asset-blueprint-grid}` at 5% opacity for sidebar.
</assets>
