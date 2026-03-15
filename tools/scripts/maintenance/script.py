import json

schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "CareerCopilot Material 3 Expressive Component Annotation",
    "description": "Standardized schema for AI-assisted UI/UX development using Material 3 Expressive design principles.",
    "type": "object",
    "required": ["wireframeId", "componentName", "material3Mapping", "states", "interactions", "responsive", "designTokens"],
    "properties": {
        "wireframeId": {
            "type": "string",
            "pattern": "^WIRE-\\d{3}-[A-Z]+$",
            "description": "Unique identifier for the wireframe (e.g., WIRE-001-LANDING)"
        },
        "componentName": {
            "type": "string",
            "pattern": "^[A-Z][a-zA-Z0-9]*$",
            "description": "The PascalCase name of the React component."
        },
        "material3Mapping": {
            "type": "object",
            "description": "Maps wireframe elements to Material 3 Expressive components.",
            "required": ["root", "elements"],
            "properties": {
                "root": {
                    "type": "object",
                    "required": ["m3Type"],
                    "properties": {
                        "m3Type": {
                            "type": "string",
                            "enum": ["Surface", "Container", "Scaffold", "Column", "Row", "Grid"]
                        },
                        "props": { "type": "object" }
                    }
                },
                "elements": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "required": ["id", "m3Type"],
                        "properties": {
                            "id": { "type": "string" },
                            "m3Type": {
                                "type": "string",
                                "enum": [
                                    "TopAppBar", "NavigationBar", "NavigationRail", "NavigationDrawer",
                                    "Button", "FilledButton", "ElevatedButton", "TonalButton", "OutlinedButton", "TextButton",
                                    "Fab", "ExtendedFab",
                                    "Card", "FilledCard", "ElevatedCard", "OutlinedCard",
                                    "TextField", "FilledTextField", "OutlinedTextField",
                                    "Checkbox", "RadioButton", "Switch", "Slider",
                                    "Chip", "AssistChip", "FilterChip", "InputChip", "SuggestionChip",
                                    "Badge", "Divider", "LinearProgress", "CircularProgress",
                                    "Dialog", "ModalBottomSheet", "Snackbar", "Tooltip",
                                    "List", "ListItem", "Icon", "Typography"
                                ]
                            },
                            "expressiveProps": {
                                "type": "object",
                                "description": "Specific Material 3 Expressive attributes like motion, emphasis, or shape."
                            },
                            "content": { "type": "string" },
                            "children": { "type": "array", "items": { "type": "object" } }
                        }
                    }
                }
            }
        },
        "states": {
            "type": "object",
            "additionalProperties": {
                "type": "object",
                "properties": {
                    "description": { "type": "string" },
                    "m3Overrides": { "type": "object" },
                    "animation": { "type": "string" }
                }
            },
            "description": "State machine definitions (e.g., idle, focused, pressed, loading)."
        },
        "interactions": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["trigger", "action"],
                "properties": {
                    "trigger": { "type": "string", "description": "e.g., onClick, onHover, onSwipe" },
                    "action": { "type": "string", "description": "e.g., navigate, validate, submit" },
                    "m3Motion": { "type": "string", "description": "Reference to M3 motion system (Standard, Emphasized, Decelerated)" }
                }
            }
        },
        "responsive": {
            "type": "object",
            "properties": {
                "compact": { "type": "object" },
                "medium": { "type": "object" },
                "expanded": { "type": "object" }
            },
            "description": "Breakpoint configurations following M3 window size classes."
        },
        "designTokens": {
            "type": "object",
            "description": "Mapping to CareerCopilot design tokens using M3 token naming logic.",
            "properties": {
                "color": { "type": "object" },
                "typography": { "type": "object" },
                "shape": { "type": "object" },
                "motion": { "type": "object" }
            }
        },
        "accessibility": {
            "type": "object",
            "properties": {
                "role": { "type": "string" },
                "ariaLabels": { "type": "object" },
                "keyboardFocus": { "type": "array", "items": { "type": "string" } }
            }
        }
    }
}

with open('m3_expressive_schema.json', 'w') as f:
    json.dump(schema, f, indent=2)

print("Schema generated successfully.")
