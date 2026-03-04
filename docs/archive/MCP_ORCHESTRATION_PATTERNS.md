# MCP Orchestration Patterns - Quick Reference

**Last Updated**: 2026-02-15
**Purpose**: Correct patterns for orchestrating Gemini MCP servers in CareerCopilot workflows

---

## Available Gemini MCP Servers

### 1. flash-sidekick (Gemini Flash/Pro)
**Purpose**: Token-efficient batch processing and quick analysis

**Available Tools**:
- `quick_summarize(text)` - Bulk summarization
- `generate_idf(code)` - Code signature extraction
- `analyze_code_quality(code, language)` - Quality analysis (JSON)
- `generate_docstrings(code, style)` - Documentation generation
- `generate_unit_tests(code, framework)` - Test generation
- `extract_dependencies(code)` - Import/dependency extraction
- `generate_api_docs(code)` - API documentation
- `consult_pro(query, context)` - Deep analysis (Gemini Pro)
- `suggest_refactoring(code)` - Architectural improvements
- `batch_file_analysis(file_paths, analysis_type)` - Concurrent file analysis
- `web_research_synthesis(query, max_results)` - Google Search Grounding

### 2. design-system-sidekick (Gemini Pro Vision)
**Purpose**: Kerala Rage compliance validation and asset packaging

**Available Tools**:
- `validate_asset_compliance(image_path)` - Kerala Rage compliance scoring
- `generate_implementation_package(asset_path)` - Create context.md, tokens.json, usage.md
- `extract_visual_design_tokens(image_path)` - Color/scale/density extraction
- `compare_generation_attempts(image_paths)` - Multi-variant comparison
- `suggest_prompt_refinements(asset_path, score)` - DALL-E prompt optimization

### 3. vision-scorer-mcp (Gemini Vision)
**Purpose**: M3 Expressive visual design scoring

**Available Tools**:
- `score_visual_design(image_path)` - M3 Expressive compliance scoring
- `validate_m3_compliance(image_path)` - M3 validation with detailed feedback

---

## Pattern 1: Batch Code Analysis

**Use Case**: Analyze multiple files for quality, dependencies, or complexity

```python
# Step 1: Collect file paths
files = [
    "backend/api/routes.py",
    "backend/services/auth.py",
    "backend/models/user.py"
]

# Step 2: Use flash-sidekick for concurrent analysis
result = await flash_sidekick.batch_file_analysis(
    file_paths=files,
    analysis_type="quality"  # or "dependencies", "complexity", "security"
)

# Step 3: Parse JSON results
analysis = json.loads(result)
for file_result in analysis["batch_results"]:
    print(f"{file_result['file']}: {file_result['analysis']}")
```

**Benefits**:
- ✅ Parallel processing (faster than sequential)
- ✅ Token-efficient (Gemini Flash)
- ✅ Structured JSON output

---

## Pattern 2: Design Asset Validation Pipeline

**Use Case**: Validate DALL-E generated assets against Kerala Rage standards

```python
# Step 1: Validate with design-system-sidekick
validation = await design_system_sidekick.validate_asset_compliance(
    image_path="assets/kr-solidarity-wallpaper.png"
)

# Step 2: Check score threshold
if validation.score >= 90:
    # Step 3: Generate implementation package
    package = await design_system_sidekick.generate_implementation_package(
        asset_path="assets/kr-solidarity-wallpaper.png"
    )
    print("✅ Asset validated and packaged")
else:
    # Step 4: Get prompt refinement suggestions
    suggestions = await design_system_sidekick.suggest_prompt_refinements(
        asset_path="assets/kr-solidarity-wallpaper.png",
        score=validation.score
    )
    print(f"⚠️ Score: {validation.score}/100. Refinements: {suggestions}")
```

**Benefits**:
- ✅ Automated quality gates
- ✅ Auto-retry with improved prompts
- ✅ Gemini Pro Vision for aesthetic analysis

---

## Pattern 3: Multi-Engine Orchestration

**Use Case**: Combine Flash (speed) and Pro (quality) for optimal workflow

```python
# Step 1: Quick analysis with Flash
summary = await flash_sidekick.quick_summarize(
    text=f"Component requirements: {requirements_doc}"
)

# Step 2: Deep analysis with Pro (if needed)
if "complex" in summary.lower():
    detailed = await flash_sidekick.consult_pro(
        query="Analyze architectural implications",
        context=summary
    )
else:
    detailed = summary

# Step 3: Generate code with Flash
tests = await flash_sidekick.generate_unit_tests(
    code=component_code,
    framework="pytest"
)
```

**Benefits**:
- ✅ Cost optimization (Flash for routine, Pro for complex)
- ✅ Speed optimization (Flash is faster)
- ✅ Quality optimization (Pro for critical decisions)

---

## Pattern 4: Wireframe → Mockup Automation

**Use Case**: Generate mockups from wireframes with validation

```python
# Step 1: Quick wireframe analysis with Flash
analysis = await flash_sidekick.quick_summarize(
    text=f"Wireframe for {component_name}: {wireframe_content}"
)

# Step 2: Validate wireframe structure
# (Assuming wireframe is rendered as image)
validation = await vision_scorer_mcp.validate_m3_compliance(
    image_path=f"wireframes/{component_name}.png"
)

# Step 3: If valid, generate implementation package
if validation.score >= 320:  # Grade B threshold
    package = await design_system_sidekick.generate_implementation_package(
        asset_path=f"wireframes/{component_name}.png"
    )
    print(f"✅ Mockup generated: {package}")
else:
    print(f"⚠️ Validation failed: {validation.score}/400")
    # Auto-retry logic here
```

**Benefits**:
- ✅ Automated validation gates
- ✅ Multi-server orchestration
- ✅ Quality enforcement (320/400 threshold)

---

## Pattern 5: Parallel Component Processing

**Use Case**: Process 3-5 components simultaneously

```python
import asyncio

components = ["HeroCard", "ProfilePanel", "NavigationBar"]

async def process_component(component):
    # Step 1: Analyze
    analysis = await flash_sidekick.quick_summarize(
        text=f"Component: {component}"
    )

    # Step 2: Validate
    validation = await vision_scorer_mcp.score_visual_design(
        image_path=f"mockups/{component}.png"
    )

    # Step 3: Package if valid
    if validation.score >= 320:
        package = await design_system_sidekick.generate_implementation_package(
            asset_path=f"mockups/{component}.png"
        )
        return {"component": component, "status": "success", "package": package}
    else:
        return {"component": component, "status": "failed", "score": validation.score}

# Execute in parallel
results = await asyncio.gather(*[process_component(c) for c in components])

for result in results:
    print(f"{result['component']}: {result['status']}")
```

**Benefits**:
- ✅ 3-5× faster (parallel execution)
- ✅ Batch processing efficiency
- ✅ Aggregated results

---

## Pattern 6: Web Research + Code Generation

**Use Case**: Research best practices and generate implementation

```python
# Step 1: Research with Google Search Grounding
research = await flash_sidekick.web_research_synthesis(
    query="React accessibility best practices for form validation",
    max_results=5
)

# Step 2: Generate code based on research
code = await flash_sidekick.consult_pro(
    query="Generate accessible form validation component",
    context=research
)

# Step 3: Generate tests
tests = await flash_sidekick.generate_unit_tests(
    code=code,
    framework="jest"
)

# Step 4: Generate docs
docs = await flash_sidekick.generate_docstrings(
    code=code,
    style="google"
)
```

**Benefits**:
- ✅ Up-to-date information (Google Search)
- ✅ Cited sources
- ✅ Complete implementation (code + tests + docs)

---

## Anti-Patterns (DO NOT USE)

### ❌ Anti-Pattern 1: Using mcp_codex_codex for Gemini Orchestration

```python
# ❌ WRONG - This invokes Claude via Codex CLI, not Gemini
result = await mcp_codex_codex(
    prompt="Use design-system-sidekick to validate asset"
)
```

**Why it's wrong**:
- `mcp_codex_codex` runs Codex CLI (Claude-based autonomous coding)
- Creates circular dependency: Claude → Codex → Claude
- Cannot target Gemini MCP servers

**Correct approach**:
```python
# ✅ RIGHT - Direct MCP tool call
result = await design_system_sidekick.validate_asset_compliance(
    image_path="assets/asset.png"
)
```

### ❌ Anti-Pattern 2: Creating Intermediate Orchestration Server

```python
# ❌ WRONG - Unnecessary complexity
@mcp_server.tool()
async def orchestrate_workflow(stage, component):
    # This adds an unnecessary layer
    if stage == "validate":
        return await design_system_sidekick.validate_asset_compliance(...)
```

**Why it's wrong**:
- Adds unnecessary abstraction layer
- Claude can orchestrate directly
- More code to maintain

**Correct approach**:
```python
# ✅ RIGHT - Claude orchestrates directly
validation = await design_system_sidekick.validate_asset_compliance(...)
if validation.score >= 90:
    package = await design_system_sidekick.generate_implementation_package(...)
```

### ❌ Anti-Pattern 3: Sequential Processing When Parallel is Possible

```python
# ❌ WRONG - Sequential (slow)
results = []
for component in components:
    result = await flash_sidekick.quick_summarize(f"Component: {component}")
    results.append(result)
```

**Correct approach**:
```python
# ✅ RIGHT - Parallel (fast)
results = await asyncio.gather(*[
    flash_sidekick.quick_summarize(f"Component: {c}")
    for c in components
])
```

---

## Verification Checklist

After implementing orchestration:

- [ ] `flash-sidekick` is registered in `claude_desktop_config.json`
- [ ] No references to `mcp_codex_codex` for Gemini orchestration
- [ ] Claude directly calls MCP tools (no intermediate layers)
- [ ] Parallel processing used for batch operations
- [ ] Validation gates enforce quality thresholds
- [ ] Each server uses its optimal model (Flash/Pro/Vision)

---

## Next Steps

1. ✅ **Registered flash-sidekick** in MCP config
2. ✅ **Updated orchestration strategy** in imperative-soaring-zebra.md
3. ⏭️ **Test direct MCP tool calls** for mockup workflow
4. ⏭️ **Update automate_design_workflow.py** to output Claude-friendly prompts
5. ⏭️ **Document successful orchestration patterns** in project docs

---

**Status**: ✅ **Architecture Corrected**
**Ready for**: Direct MCP tool orchestration testing
