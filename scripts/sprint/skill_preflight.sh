#!/bin/bash
set -e
echo '=== SKILL PREFLIGHT ==='
for skill in token-orchestrator phase4-pipeline-orchestrator migration-audit vision-scorer-mcp blueprint writing-plans executing-plans sprint-coordinator compliance-dashboard kerala-rage-brand-enforcer m3-expressive-ui-evaluator frontend-cleanup-manager careercopilot-design-critique subagent-driven-development; do
  if [ -f ".claude/skills/$skill/SKILL.md" ] || [ -f ".claude/agents/$skill.md" ] || [ -f ".claude/skills/$skill.md" ]; then
    echo "  ✓ $skill"
  else
    echo "  ✗ $skill — NOT FOUND"
  fi
done
echo '=== MCP preflight requires manual Gemini (Antigravity) ping ==='
