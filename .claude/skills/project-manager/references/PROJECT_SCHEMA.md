# Project Data Schemas

These schemas define the structured data model used by the `project-manager` to ensure consistency across the project lifecycle.

## 1. Project Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Project",
  "type": "object",
  "properties": {
    "project_id": { "type": "string", "format": "uuid" },
    "name": { "type": "string" },
    "status": { "enum": ["PLANNING", "IN_PROGRESS", "DEPLOYED", "ARCHIVED"] },
    "start_date": { "type": "string", "format": "date-time" },
    "target_end_date": { "type": "string", "format": "date-time" },
    "actual_end_date": { "type": ["string", "null"], "format": "date-time" },
    "phases": { "type": "array", "items": { "type": "string", "format": "uuid" } },
    "teams": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "lead": { "type": "string", "format": "email" },
          "capacity_hours": { "type": "number" }
        }
      }
    }
  },
  "required": ["project_id", "name", "status"]
}
```

## 2. Phase Schema
```json
{
  "title": "Phase",
  "type": "object",
  "properties": {
    "phase_id": { "type": "string", "format": "uuid" },
    "project_id": { "type": "string", "format": "uuid" },
    "name": { "type": "string" },
    "sequence": { "type": "integer" },
    "status": { "enum": ["PENDING", "IN_PROGRESS", "BLOCKED", "COMPLETE"] },
    "goals": { "type": "array", "items": { "type": "string" } },
    "gates_required": { "type": "array", "items": { "type": "string" } },
    "gates_met": { "type": "array", "items": { "type": "boolean" } },
    "milestones": { "type": "array", "items": { "type": "string", "format": "uuid" } },
    "metrics": {
      "type": "object",
      "properties": {
        "progress_percent": { "type": "number", "minimum": 0, "maximum": 100 },
        "estimated_hours_remaining": { "type": "number" }
      }
    }
  },
  "required": ["phase_id", "project_id", "name", "status", "sequence"]
}
```

## 3. Blocker Schema
```json
{
  "title": "Blocker",
  "type": "object",
  "properties": {
    "blocker_id": { "type": "string", "format": "uuid" },
    "title": { "type": "string" },
    "severity": { "enum": ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
    "status": { "enum": ["OPEN", "MITIGATING", "RESOLVED", "CLOSED"] },
    "impact": { "type": "string" },
    "mitigation_plan": { "type": "string" },
    "escalation_timeout_hours": { "type": "number", "default": 2 }
  },
  "required": ["blocker_id", "title", "severity", "status"]
}
```
