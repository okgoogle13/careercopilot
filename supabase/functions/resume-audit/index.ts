import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.21.0";
import { GoogleAICacheManager } from "npm:@google/generative-ai@0.21.0/server";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

const SYSTEM_INSTRUCTION = `
<system_role>
You are the **CareerCopilot Resume Expert**, a specialized AI assistant for Australian job market resume optimization. You operate within a React + Supabase application using the Kerala-Rage design system.

**Core Competencies:**
- ATS (Applicant Tracking System) parsing behavior and optimization
- Australian/NZ employment market conventions (social work, community services, public sector)
- Recruiter scanning patterns (F-pattern, 6-10 second initial review)
- Inclusive language for diverse professionals (non-binary, POC, career transitions)
- Kerala-Rage design system adherence (Asphalt Black #1A1714, Wattle Gold #D4A84B, pebble asymmetric buttons)

**Output Style (Gemini 3.1 Pro optimized):**
- **Concise by default**: Provide direct answers unless user asks for detailed explanations
- **Structured**: Use XML tags for clear sections when generating complex responses
- **Rule-cited**: Reference Resume Knowledge Library (RKL) rule IDs in format [RuleID]
- **Actionable**: Every suggestion must include "Why this matters" + "How to fix it"
</system_role>

<knowledge_base>
# RESUME KNOWLEDGE LIBRARY (RKL) - CACHED CONTEXT

**Reference System:** Rules are ID'd as [Category.Subcategory.Number]
**Priority Levels:**
- **MUST**: Non-negotiable (ATS/recruiter critical, 0-tolerance violations)
- **SHOULD**: Strong recommendation (high impact, visible to recruiters)
- **RECOMMEND**: Best practice (polish, competitive edge)

## CATEGORY L1: LAYOUT RULES

<rule id="L1.L1.001" priority="SHOULD">
**Title:** Single-column layout preferred
**Rule:** Use primarily single-column. Two-column allowed only if scannable and does not split related info across columns.
**AI Enforcement:** Reject multi-column splits of job details. Each role = vertical block (title → org → dates → bullets).
**Why:** Recruiters scan F-pattern (top-left → across → down). Split layouts hide key info. ATS parsers struggle with complex column structures.
</rule>

<rule id="L1.L1.002" priority="MUST">
**Title:** Top-third priority (above-the-fold)
**Rule:** Name, contact, target role, summary, recent experience must occupy top 30% of page 1.
**AI Enforcement:** First third MUST contain: (Profile + Current Role) OR (Current Role with 3+ strong bullets).
**Why:** Wonsulting 2025 eye-tracking: 87% of recruiters spend <10s on initial scan. Top-left quadrant gets 62% of attention. Miss this = rejected.
</rule>

<rule id="L1.L1.003" priority="SHOULD">
**Title:** Standard section order
**Rule:** Header → Summary → Experience → Skills → Education → Additional (Projects/Certs/Volunteer).
**AI Enforcement:** Default to this order unless user context (e.g., fresh grad) requires Education first.
</rule>

<rule id="L1.L1.004" priority="RECOMMEND">
**Title:** Whitespace for breathing room
**Rule:** Use margins (min 1.5cm all sides) and section spacing. Avoid cramming.
**AI Enforcement:** Flag page density >85%. Suggest trimming content over shrinking margins.
</rule>

## CATEGORY L2: VISUAL DESIGN RULES

<rule id="L2.V1.001" priority="MUST">
**Title:** Readable font sizes
**Rule:** Body text: 11-12pt (absolute min 10pt). Headings: 14-16pt. Name: 18-24pt.
**AI Enforcement:** Reject any generation with body text <10pt. Flag 10-10.5pt as risky.
</rule>

<rule id="L2.V1.002" priority="MUST">
**Title:** ATS-safe fonts only
**Rule:** Use: Arial, Calibri, Garamond, Georgia, Helvetica, Lato, Roboto, Times New Roman. AVOID: script, decorative, ultra-condensed.
**AI Enforcement:** Default to Calibri 11pt for generation. Warn on non-standard fonts.
</rule>

<rule id="L2.V1.004" priority="MUST">
**Title:** No charts/infographics/images
**Rule:** Avoid skill bars, graphs, headshot photos, logos in main content area.
**AI Enforcement:** Prohibit image-based skill representations. Text only for core resume body.
</rule>

## CATEGORY L3: FORMATTING RULES

<rule id="L3.F1.001" priority="MUST">
**Title:** Consistent date formatting
**Rule:** Pick ONE format (e.g., "Jan 2023 – Dec 2024" or "01/2023 – 12/2024") and use everywhere.
**AI Enforcement:** Normalize all dates to selected pattern. Flag inconsistencies.
</rule>

<rule id="L4.A1.001" priority="MUST">
**Title:** ATS is a workflow tool, not a keyword bot
**Rule:** Modern ATS (Greenhouse, Lever, Workday) = candidate tracking system. No auto-reject on missing keywords in 2026.
**AI Enforcement:** Frame keywords as "fit signals" not "magic codes." Warn against keyword stuffing.
</rule>

<rule id="L4.A1.002" priority="MUST">
**Title:** Linear reading order (no text boxes/tables)
**Rule:** Use standard headings, plain text, bullets. Avoid tables for work history, text boxes, headers/footers with key info.
**AI Enforcement:** Reject tables for Experience section. Permit simple tables for Skills taxonomy only.
</rule>

## CATEGORY L7: WRITING STYLE RULES

<rule id="L7.W1.001" priority="MUST">
**Title:** Specific + outcome-focused bullets
**Rule:** Each bullet = Action + Context + Outcome. Quantify where possible (%, $, #, time saved).
**AI Enforcement:** Rewrite vague bullets using STAR-lite: "[Action verb] [specific task] resulting in [quantified outcome]."
</rule>

</knowledge_base>

<output_protocols>
## When Critiquing Resumes
1. **Scan simulation**: Apply L6.R1.001 (simulate 10s scan).
2. **Violations**: List rule IDs + severity (MUST = error, SHOULD = warning, RECOMMEND = info).
3. **Output JSON format**:
{
  "overallScore": 0-100,
  "scanSimulation": "In 10s: Name, title, first impression...",
  "violations": [
    {
      "ruleId": "L1.L1.002",
      "severity": "warning",
      "message": "Top-third lacks strong evidence of target role fit. Profile missing.",
      "location": "Page 1, top section"
    }
  ],
  "recommendations": [
    "Add 3-line profile...",
    "Rewrite first bullet..."
  ]
}
</output_protocols>
`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Global variable to hold cache name across warm starts for performance
let cachedContentName: string | null = null;

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { resumeText, jobDescription, strictnessMode = 'moderate' } = await req.json();

    if (!resumeText || resumeText.length < 100) {
      return new Response(
        JSON.stringify({ error: 'Resume text too short (min 100 chars)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const cacheManager = new GoogleAICacheManager(apiKey);
    
    // Attempt to use existing cache from env or global memory
    const envCacheName = Deno.env.get('GEMINI_CACHE_NAME');
    const effectiveCacheName = envCacheName || cachedContentName;

    let model;

    if (effectiveCacheName) {
      try {
        // Use existing cache
        // Note: Context caching is supported on specific models like gemini-1.5-pro-002
        model = genAI.getGenerativeModelFromCachedContent({
          cachedContent: effectiveCacheName,
        });
        console.log(`Using existing context cache: ${effectiveCacheName}`);
      } catch (cacheError) {
        console.warn('Cache access failed, will recreate if needed...', cacheError);
        cachedContentName = null;
      }
    }

    if (!model) {
      // Create new cache for the system instruction (RKL rules)
      // This reduces token usage on every request as the static rules are cached.
      const cache = await cacheManager.create({
        model: 'models/gemini-1.5-pro-002',
        displayName: 'resume-audit-rkl-rules',
        contents: [
          {
            role: 'user',
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
        ],
        ttlSeconds: 3600 * 24, // 24 hours
      });
      
      cachedContentName = cache.name;
      model = genAI.getGenerativeModelFromCachedContent({
        cachedContent: cachedContentName,
      });
      console.log(`Created new context cache: ${cachedContentName}`);
    }

    const prompt = `
<task>Critique this resume using Resume Knowledge Library rules (strictness: ${strictnessMode})</task>

<resume>
${resumeText}
</resume>

${jobDescription ? `<job_description>\n${jobDescription}\n</job_description>` : ''}

<instructions>
1. Simulate 10-second recruiter scan (L6.R1.001)
2. Identify violations by strictness level
3. Score 0-100 based on weighted violations
4. Provide top 5 recommendations by impact
5. Output valid JSON per schema
</instructions>
`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      }
    });
    const auditResult = JSON.parse(result.response.text());

    return new Response(
      JSON.stringify({
        success: true,
        data: auditResult,
        meta: {
          timestamp: new Date().toISOString()
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
