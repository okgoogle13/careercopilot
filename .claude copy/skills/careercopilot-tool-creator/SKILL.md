---
name: careercopilot-tool-creator
description: "Scaffolds a new Python tool file in 'src/tools/' from a template. Use when asked to create a new agent tool."
---
# Tool Creator Workflow

1.  Ask for the tool's file name (e.g., `web_search_tool`).
2.  Read the template: `cat .claude/skills/careercopilot-tool-creator/templates/tool.py.tpl`
3.  Replace placeholders like `{{TOOL_NAME}}` with the file name.
4.  Write the new file to `src/tools/{{TOOL_NAME}}.py`.
5.  Advise the user to now add the tool to `src/tools/__init__.py` and to the agent file.
