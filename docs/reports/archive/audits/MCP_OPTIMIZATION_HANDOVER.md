# MCP Optimization Handover - READY FOR EXECUTION

**Status**: Phase 0-1 Complete ✅ | Phase 2-5 Ready for Build 🚀

---

## What's Done
- ✅ Security: GitHub PAT moved to `${GITHUB_PAT}` env var (3 config files)
- ✅ Config Sync: Claude Desktop + Cline updated with all 7 MCP servers
- ✅ Search Grounding: Enabled in Claude Desktop flash-sidekick config

---

## What Needs Building

**File to Modify**: `/Users/okgoogle13/Projects/careercopilot/servers/flash_sidekick.py`

### Phase 2: Async Refactor (2 hours)
- Add `import asyncio` + `import json` for async handling
- Convert `generate_content()` → `async def` methods
- Wrap MCP tool handler with `asyncio.run()`
- Keep existing 3 tools (`quick_summarize`, `generate_idf`, `consult_pro`) working

### Phase 2: P0 Tools (5 hours)

**Tool 1: `batch_file_analysis`** (3 hours)
```python
def batch_file_analysis(file_paths: list[str], analysis_type: str) -> dict
# Input: ["file1.py", "file2.py"], "quality" | "dependencies" | "complexity" | "security"
# Engine: Gemini Pro (parallel async calls)
# Output: {"results": [...], "summary": {...}}
# Impact: 50K-150K token savings
```

**Tool 2: `web_research_synthesis`** (2 hours)
```python
def web_research_synthesis(query: str, max_results: int = 5) -> dict
# Input: "Best practices for React 19"
# Engine: Gemini Pro + Search Grounding (ENABLE_SEARCH_GROUNDING=true)
# Output: Markdown with [Citation](URL) format
# Impact: 20K-60K token savings
```

### Phase 3: P1 Tools (4 hours)

**Tool 3: `analyze_code_quality`** (1 hour)
```python
def analyze_code_quality(code: str, language: str = "python") -> dict
# Output: {"issues": [...], "complexity_score": 7.2, "violations": [...]}
# Engine: Gemini Flash (fast JSON mode)
```

**Tool 4: `generate_docstrings`** (1.5 hours)
```python
def generate_docstrings(code: str, style: str = "google") -> dict
# Output: Code with docstrings inserted
# Engine: Gemini Flash
```

**Tool 5: `generate_unit_tests`** (1.5 hours)
```python
def generate_unit_tests(code: str, framework: str = "pytest") -> dict
# Output: Test file content
# Engine: Gemini Flash
```

### Phase 3: P2/P3 Tools (6 hours)

- `suggest_refactoring` (1.5h) - Architecture improvements
- `create_readme` (1.5h) - Auto-generate README
- `extract_dependencies` (1h) - List imports + call graphs
- `generate_api_docs` (1h) - API endpoint docs
- `generate_integration_tests` (1.5h) - E2E test scaffolding

**SKIP** (low ROI):
- `bulk_translate_comments`
- `compare_approaches`

### Phase 4: Optimization (4 hours)
- Rate Limiting: Backoff for 60 req/min Gemini quota
- Smart Delegation: `_should_use_gemini()` helper
- Structured Output: Gemini JSON mode
- Response Pagination: Handle large batch results

### Phase 5: Testing (2 hours)
- Unit test each tool
- Integration test in Claude Desktop + Cline
- Benchmark token reduction (target: 60-70%)

---

## Key Implementation Details

### Async Pattern
```python
import asyncio
from concurrent.futures import ThreadPoolExecutor

async def _call_gemini_async(model_name: str, prompt: str) -> dict:
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as pool:
        response = await loop.run_in_executor(pool, self._get_model(model_name).generate_content, prompt)
    return {"content": response.text}

async def batch_file_analysis(self, file_paths: list, analysis_type: str) -> dict:
    tasks = [self._analyze_single_file(path, analysis_type) for path in file_paths]
    results = await asyncio.gather(*tasks)
    return self._aggregate_results(results)
```

### Search Grounding (for web_research_synthesis)
```python
from google.generativeai.types import GenerationConfig, Tool, GoogleSearchRetrieval

tools = [Tool(google_search_retrieval=GoogleSearchRetrieval())]
response = model.generate_content(prompt, tools=tools, generation_config=...)

# Parse citations from grounding_metadata
if response.candidates[0].grounding_metadata:
    for chunk in response.candidates[0].grounding_metadata.grounding_chunks:
        # Extract URL + title for citations
```

### Rate Limiting
```python
class RateLimiter:
    def __init__(self, max_rpm=55):
        self.requests = deque()
        self.max_rpm = max_rpm

    async def acquire(self):
        now = time.time()
        while self.requests and self.requests[0] < now - 60:
            self.requests.popleft()
        if len(self.requests) >= self.max_rpm:
            wait = 60 - (now - self.requests[0])
            await asyncio.sleep(wait)
        self.requests.append(now)
```

---

## Testing Checklist

- [ ] Each tool responds with proper JSON-RPC format
- [ ] Async parallelism works (batch ops run concurrently)
- [ ] Search Grounding citations parse correctly
- [ ] Rate limiting prevents quota exceeded errors
- [ ] Response truncation handles MCP 1MB limit
- [ ] All 12 tools in `tools/list` response
- [ ] Token reduction measured: batch (67% target), web_research (75% target)
- [ ] Response times: flash <2s, pro <10s

---

## Critical Files
- `/Users/okgoogle13/Projects/careercopilot/servers/flash_sidekick.py` - Main file (add 12 tools)
- `/Users/okgoogle13/Library/Application Support/Claude/claude_desktop_config.json` - ✅ Done
- `/Users/okgoogle13/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json` - ✅ Done

---

## Environment Variables Needed
```bash
GEMINI_API_KEY=<your-key>           # Required for Gemini API
GITHUB_PAT=<new-pat>                # Set from gh settings (not in configs)
SUPABASE_ACCESS_TOKEN=<token>       # If using Supabase
PERPLEXITY_API_KEY=<key>            # If using Perplexity
```

---

## Success Metrics
- 60-70% token reduction on batch tasks
- 75% token reduction on web research
- All 12 tools tested and working
- No rate limit errors on sustained load
- Seamless integration across 3 MCP environments

---

**Total Timeline**: ~24 hours over 3 weeks
**Model Recommendation**: Claude Opus 4.5 (complex async/multi-tool implementation)

Ready to execute. 🚀
