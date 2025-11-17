# Claude Code Agent Model Reference

Quick reference for agent model assignments and their rationale.

## Summary Table

| Agent | Model | Task Complexity | Cost | Speed | Best For |
|-------|-------|-----------------|------|-------|----------|
| **code-reviewer** | haiku | Low-Med | $ | ⚡⚡⚡ | Code quality checks |
| **test-runner** | haiku | Low-Med | $ | ⚡⚡⚡ | Test execution |
| **ai-agent-specialist** | sonnet | Very High | $$$ | ⚡⚡ | System design |
| **debugger** | sonnet | Very High | $$$ | ⚡⚡ | Root cause analysis |
| **devops-specialist** | sonnet | Very High | $$$ | ⚡⚡ | CI/CD & deployment |
| **frontend-specialist** | sonnet | Very High | $$$ | ⚡⚡ | UI architecture |
| **security-analyst** | sonnet | Very High | $$$ | ⚡⚡ | Security audits |

## Model Selection Logic

### ✅ Use Haiku When
- Task has clear patterns or checklists
- Quick answer needed (seconds matter)
- Cost optimization is priority
- Task follows established procedures

### ✅ Use Sonnet When
- Task requires sophisticated reasoning
- Architectural/system decisions involved
- Edge cases matter significantly
- Multi-step planning needed

## Why This Configuration?

### Haiku Agents (2)
- **code-reviewer**: Follows standardized checklist
- **test-runner**: Executes known patterns and fixes

### Sonnet Agents (5)
- **ai-agent-specialist**: Multi-agent system design requires deep reasoning
- **debugger**: Complex root cause analysis across system
- **devops-specialist**: Infrastructure decisions affect entire system
- **frontend-specialist**: UI architecture has broad implications
- **security-analyst**: Security threats require nuanced analysis

## Cost Breakdown (Monthly)

Assuming 100 agent calls/month:
- Haiku agents: ~50 calls × $0.08/1M = ~$0.004
- Sonnet agents: ~50 calls × $3.00/1M = ~$0.15
- **Total: ~$0.154/month overhead**

This provides **30-40% savings** vs. using Sonnet everywhere.

## Configuration Files

Located in `.claude/agents/`:
- `ai-agent-specialist.md` - Sonnet
- `code-reviewer.md` - Haiku
- `debugger.md` - Sonnet
- `devops-specialist.md` - Sonnet
- `frontend-specialist.md` - Sonnet
- `security-analyst.md` - Sonnet
- `test-runner.md` - Haiku

## Full Documentation

See `docs/setup/CLAUDE_CODE_AGENT_CONFIGURATION.md` for complete details.
