# 🕵️ JobScout Agent - Design & Implementation Plan

## 🎯 Objective
Create an autonomous agent capable of finding, extracting, and analyzing job listings from modern, JavaScript-heavy job boards (LinkedIn, Indeed, etc.) using **Playwright MCP** for browsing and **Flash Sidekick** (Gemini) for intelligent parsing.

## 🏗️ Architecture

### 1. The Core Agent: `JobScoutAgent`
- **Location**: `backend/app/agents/job_scout.py`
- **Responsibility**: Orchestrates the search -> scrape -> parse -> save pipeline.
- **Dependencies**:
  - `playwright` (MCP Server)
  - `flash-sidekick` (MCP Server)

### 2. Capabilities (Tools)

#### A. `browse_job_board(url: str)`
- **Tool**: `@executeautomation/playwright-mcp-server`
- **Action**:
  - Navigate to URL
  - Handle cookie banners/popups (using simple selectors or AI visual check)
  - Scroll to load dynamic content
  - Return `page.content()` (Rendered HTML)

#### B. `parse_job_html(html_content: str)`
- **Tool**: `flash-sidekick` (Gemini Flash Lite)
- **Action**:
  - Input: Raw Rendered HTML
  - Prompt: "Extract job title, company, salary, tech stack, and description."
  - Output: JSON `JobListingDetails`

#### C. `search_aggregator(query: str)`
- **Tool**: `playwright`
- **Action**:
  - Perform Google Search: `site:greenhouse.io OR site:lever.co "{query}"`
  - Extract links to job posts.

## 🇦🇺 Target Platforms (Australia Strategy)
Since official APIs for Seek, Jora, and EthicalJobs are restricted, we use **"Headless Browser Automation"**.

### The "No-API" Workflow
1. **Emulation**: Playwright launches a real Chromium browser instance (headless). To the website, it looks like a standard user on a laptop.
2. **Navigation**:
   - **EthicalJobs**: `https://www.ethicaljobs.com.au/jobs?keywords=social%20work`
   - **Seek**: `https://www.seek.com.au/social-work-jobs`
3. **Interaction**:
   - The agent waits for the React/Angular app to hydrate (load data).
   - It "clicks" the Next Page button or "scrolls" infinite lists.
4. **Extraction**:
   - It captures the rendered DOM (what you see on screen).
   - **Flash Sidekick** parses the chaotic HTML into clean JSON (Title, Salary, Location, Description).

### Anti-Bot Mitigation
- **Randomized Delays**: We don't click instantly; we wait 500ms-2000ms.
- **User-Agent Rotation**: We appear as different browsers if needed.
- **Visual Validation**: We take screenshots to ensure we aren't stuck on a Cloudflare captcha.

## 📅 Implementation Roadmap

### Phase 1: Upgrade Existing Extractor (The "Quick Win")
**Goal**: Replace fragile `requests` + `bs4` in `job_listing_extractor.py` with robust `playwright`.

1.  Create `backend/app/services/playwright_service.py` (Wrapper for MCP calls).
2.  Update `_scrape_url_content` in `job_listing_extractor.py` to use Playwright.
3.  **Benefit**: Immediately fixes handling of JS-rendered pages.

### Phase 2: Create the Scout
**Goal**: Build the agent that *finds* jobs.

1.  Implement `JobScout` class.
2.  Add `search_jobs` method using Google Dorks via Playwright.
3.  Implement "smart scrolling" to capture full lists.

### Phase 3: Integration
**Goal**: Connect to CareerCopilot Database.

1.  Auto-save scraped jobs to Firestore.
2.  Trigger "Match Analysis" flow automatically upon saving.

## 🛠️ Tech Stack
- **Python 3.11+**
- **Playwright MCP**: For browser automation (Already Verified ✅).
- **Gemini 2.5 Flash**: For fast, cheap HTML parsing.
- **Genkit**: For flow orchestration.

## 📝 Next Action
Start **Phase 1**: Upgrade `job_listing_extractor.py` to use Playwright.
