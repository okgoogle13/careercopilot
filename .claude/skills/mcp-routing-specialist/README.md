# MCP Routing Specialist Skill - Development Notes

## Overview

The **MCP Routing Specialist** skill translates the project's `delegationStrategy` from `~/.mcp.json` into actionable routing decisions. It prevents expensive Claude analysis when cheaper alternatives are available.

## Skill Structure

```
mcp-routing-specialist/
├── SKILL.md              # Main skill definition (routing table, protocol, rules)
├── README.md             # This file (development notes)
├── references/
│   ├── routing-logic.md  # Detailed routing decision tree
│   ├── server-methods.md # Complete MCP server method reference
│   └── examples.md       # Real-world routing examples
└── assets/
    └── routing-flowchart.mmd  # Mermaid flowchart for visual routing
```

## Key Concepts

### The Problem
- Claude Sonnet is expensive ($15/MTok input, $60/MTok output)
- Gemini-1.5-Flash is 90% cheaper
- Local caches are 93-99% more efficient
- **Wrong decision:** Using Claude to analyze code when Gemini can do it
- **Right decision:** Route analysis to Gemini, cache lookups to local servers

### The Solution
- Define explicit routing rules in `delegationStrategy`
- Create a skill that enforces those rules
- Measure token savings per decision
- Guide users toward optimal routing

## How the Skill Works

### For Users
1. User asks a question (e.g., "Review this code")
2. Skill matches to Routing Logic Table
3. Skill recommends delegation target (e.g., gemini-wrapper)
4. Skill executes the delegation or asks for confirmation

### For Claude Code Developers
- Reference SKILL.md when deciding which server to call
- Use the Decision Tree for quick lookups
- Follow the Critical Rules (DO/DO NOT)
- Measure token savings in responses

## Implementation Notes

### Why This Skill Exists
The `.mcp.json` file contains a `delegationStrategy` object, but **Claude cannot read config files at runtime**. This skill makes the strategy actionable by:
1. Documenting the strategy in human-readable format
2. Providing clear routing tables and examples
3. Defining explicit rules (DO/DO NOT)
4. Offering a decision tree for quick reference

### Integration Points
- **~/.mcp.json:** Source of truth for routing strategy
- **gemini-wrapper.py:** Provides 7 analysis methods
- **documentation-server.py:** Provides cache lookups
- **configuration-server.py:** Provides config lookups
- **genkit-server.py:** Provides flow execution
- **github MCP:** Provides repository operations

### Token Savings Impact
```
Single Decisions:
  • Use Gemini for code review: 40-55% savings
  • Use cache for config lookup: 94.9% savings
  • Use cache for documentation: 93.3% savings

Multi-Step Workflows:
  • Lookup config + delegate analysis: 80%+ savings
  • Check flow + diagnose error: 75%+ savings
  • Search docs + extract insights: 85%+ savings
```

## Usage in Claude Code

### Scenario 1: User asks for code review
```
User: "Review my authentication service"

My decision process:
1. Consult Routing Logic Table
2. Find: "Code Review" → gemini-wrapper
3. Call: gemini-wrapper.analyze_code(code, language="python")
4. Report token savings: "40-55% cheaper than Claude analysis"
```

### Scenario 2: User asks for configuration
```
User: "What's the Firebase configuration?"

My decision process:
1. Consult Routing Logic Table
2. Find: "Configuration Lookup" → configuration server
3. Call: configuration.get_environment(env="production")
4. Report token savings: "94.9% cheaper than loading raw files"
```

### Scenario 3: User asks for multi-step help
```
User: "Why is my Genkit flow timing out?"

My decision process:
1. Identify: 2-part task (diagnostic + analysis)
2. Route Part 1: genkit.get_flow() for status
3. Route Part 2: gemini-wrapper.error_diagnosis() for root cause
4. Report combined savings: "80%+ token reduction"
```

## Development Workflow

### Adding New Routing Rules
1. Update `~/.mcp.json` with new server or method
2. Add corresponding row to Routing Logic Table in SKILL.md
3. Update Decision Tree with new branch
4. Add example in `references/examples.md`
5. Document token impact in "Token Impact Summary" section

### Adding New MCP Server
1. Register in `~/.mcp.json` with priority
2. Add server-specific section in SKILL.md (like "gemini-wrapper (Priority 10)")
3. Document all methods available
4. Add routing table entries for tasks this server handles
5. Update combined strategy sections

### Testing Routing Decisions
Use the "Routing Test" section to verify:
- User asks: "Why is my Genkit flow failing?"
- Expected routing: genkit server → gemini-wrapper
- Verify: Token savings calculation is accurate

## Related Documents

- **GEMINI_DELEGATION_STRATEGY.md** - Complete delegation strategy guide
- **PHASE1_3_COMPLETE.md** - Phase 1-3 infrastructure summary
- **~/.mcp.json** - Configuration source of truth

## Future Enhancements

1. **Automated Routing**
   - ML-based task classification
   - Automatic server selection without confirmation
   - Dynamic priority adjustment based on cache hit rates

2. **Cost Tracking**
   - Per-request token cost calculation
   - Cumulative savings dashboard
   - Attribution by server and task type

3. **Smart Caching**
   - Predictive cache warming
   - Multi-layer caching (local → Gemini → Claude)
   - Cache invalidation strategies

4. **Routing Analytics**
   - Which routing decisions save most tokens?
   - Which task types benefit most from delegation?
   - Optimization recommendations based on patterns

## Version History

- **v1.0** (2025-11-22): Initial release with 5 Gemini methods, 9 cache layers, priority-based routing
- **Planned v1.1**: Add ML-based task classification
- **Planned v2.0**: Fully automated routing with cost tracking

---

**Status:** Ready for Production | **Last Updated:** 2025-11-22
