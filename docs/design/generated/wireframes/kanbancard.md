# Wireframe: KanbanCard

<layout>
+-----------------------------------------------------------+
|  ID: KR-882 (Mono, 12px)          [ STATUS: ACTIVE ]      |
|                                                           |
|  "OFFER NEGOTIATION"                                      |
|  (Subhead, Inter 24px)                                    |
|                                                           |
|  "Update evidence from the workshop"                      |
|  (Body, 16px, Smoke Green)                                |
|                                                           |
|  [ PRIORITY: HIGH ] (Waratah Red)   [ DUE: 4h ]           |
+-----------------------------------------------------------+
</layout>

<tokens>
- **Container**: `bg-charcoal`, `radius-stone`, `shadow-viscous`
- **Title**: `text-subhead`, `font-solidarity-600`
- **StatusTag**: `radius-seed`, `bg-blueprint-grey/20`
- **Priority**: `text-waratah-red`, `font-bold`
</tokens>

<accessibility>
- **Role**: `listitem` (inside a kanban board)
- **ARIA Label**: `Kanban Task: {title}`
- **Focus Order**: Title -> Description -> Priority/Due Date
</accessibility>

<states>
- **Dragging**: Opacity shifts to 60%; scale increases slightly (1.02); drop preview shows blueprint grid.
- **Loading**: Pulse throb on the card border.
- **Error**: "Task Integrity Compromised" in Waratah Red.
</states>

<assets>
- **Impact**: CSS transition on drop using `motion.m3Expressive`.
- **Substrate**: `{kr-asset-screenprint-substrate}` at 15% opacity.
</assets>