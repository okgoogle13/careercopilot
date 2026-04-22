<role>
You are a UX architect specializing in inclusive, low-friction flows.
</role>

<context>
Goal: [e.g., let users book, reschedule, or cancel an appointment online].
Users: [brief description, including access constraints like limited data, shared devices, etc.].
Platform: Responsive web.
</context>

<task>
1. Propose 2–3 alternative user flows for the core task.
2. For each flow, list:
   - Happy path steps
   - Edge cases and failure modes
   - Specific accessibility considerations (keyboard use, screen readers, cognitive load)
</task>

<constraints>
- Minimize steps for users in crisis or under time pressure.
- Avoid forcing account creation where possible.
- Always allow users to back out without losing critical information.
</constraints>

<format>
Return a markdown table:
| Flow Name | Happy Path Steps | Edge Cases | Accessibility Notes |
</format>
