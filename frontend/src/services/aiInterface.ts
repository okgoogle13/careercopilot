import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import type { IntelligencePackage, Job, JobAnalysis, UserProfile } from '../types/intelligence';

/**
 * CORE AI INTERFACE - Adapted for CareerCopilot
 *
 * Pure functions for interacting with Gemini.
 * Adapted to use Vite environment variables and current project structure.
 */

// --- HELPER: Get API Key safely ---
function getApiKey(): string {
  // Vite uses import.meta.env instead of process.env
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY not found in environment variables');
  }
  return apiKey;
}

// --- SCHEMAS (Internal AI definitions) ---

const JobAnalysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    jobTitle: { type: SchemaType.STRING },
    companyName: { type: SchemaType.STRING },
    keywords: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    minimumRequirements: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    keyResponsibilitiesAndKpis: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    valuedOutcomes: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    roleSpecificHardSkills: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    companyNicheAndValues: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    desirableAttributes: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
  },
  required: [
    'jobTitle',
    'companyName',
    'keywords',
    'minimumRequirements',
    'keyResponsibilitiesAndKpis',
    'valuedOutcomes',
    'roleSpecificHardSkills',
  ],
};

/**
 * ANALYZE: Extracts intelligence from raw Job Description text.
 */
export const analyzeJobDescription = async (text: string): Promise<JobAnalysis> => {
  const genAI = new GoogleGenerativeAI(getApiKey());
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: JobAnalysisSchema as any,
    },
  });

  const result = await model.generateContent(`Analyze this Job Description: "${text}"`);
  const response = result.response;
  const responseText = response.text();

  return JSON.parse(responseText) as JobAnalysis;
};

/**
 * ANALYZE FROM URL: Extracts intelligence from a job posting URL using Google Search grounding.
 * Uses Gemini-3-Pro-Preview with thinking mode and Australian sector expertise.
 */
export const analyzeJobFromUrl = async (url: string): Promise<JobAnalysis> => {
  const genAI = new GoogleGenerativeAI(getApiKey());

  // System instruction for Australian sector expertise
  const systemInstruction = `You are a senior recruitment specialist expert in the Australian workplace. Focus on:
- APS/State Government Capability Frameworks (Integrated Leadership System)
- Community Services standards (AASW, NDIS)
- Compliance requirements (WWCC, NDIS Worker Screening Check)
- Australian professional registration bodies

When analyzing job postings, identify relevant frameworks, compliance requirements, and sector-specific standards.`;

  const model = genAI.getGenerativeModel({
    model: 'gemini-3.0-pro', // Using pro for advanced capabilities
    systemInstruction,
    generationConfig: {
      responseMimeType: 'application/json',
    },
    // Note: Google Search grounding is enabled automatically in supported environments
    // Grounding metadata will be available in response if search was used
  });

  const prompt = `Analyze this job posting from the URL: ${url}

Extract the following information:
- Job title and company name
- Keywords for ATS optimization
- Minimum requirements
- Key responsibilities and KPIs
- Valued outcomes
- Role-specific hard skills
- Company niche and values
- Desirable attributes

Additionally, identify any Australian sector-specific frameworks, compliance requirements, or professional standards mentioned.

Return a JSON object with the structure matching JobAnalysis interface.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const responseText = response.text();

  // Extract grounding sources
  const groundingMetadata = (response as any).candidates?.[0]?.groundingMetadata;
  const sources =
    groundingMetadata?.groundingChunks
      ?.filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || 'Unknown Source',
        uri: chunk.web.uri || url,
      })) || [];

  const analysis = JSON.parse(responseText) as JobAnalysis;

  // Add sources to the response
  return {
    ...analysis,
    sources: sources.length > 0 ? sources : undefined,
  };
};

/**
 * SEARCH: Finds relevant jobs based on a query.
 * Note: Grounding with Google Search requires specific API access
 */
export const searchJobs = async (query: string): Promise<Job[]> => {
  const genAI = new GoogleGenerativeAI(getApiKey());
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            jobTitle: { type: SchemaType.STRING },
            companyName: { type: SchemaType.STRING },
            location: { type: SchemaType.STRING },
            jobDescription: { type: SchemaType.STRING },
          },
          required: ['jobTitle', 'companyName', 'location', 'jobDescription'],
        },
      },
    },
  });

  const result = await model.generateContent(
    `Find 5 current job postings for: "${query}". Provide realistic example postings based on current market trends.`
  );
  const response = result.response;
  const responseText = response.text();

  return JSON.parse(responseText) as Job[];
};

/**
 * GENERATE: The core engine. Tailors a resume and performs a full audit.
 */
export const generateIntelligencePackage = async (
  profile: UserProfile,
  analysis: JobAnalysis,
  expertPersonaMarkdown: string // Content of ExpertResumeAuditor.md
): Promise<IntelligencePackage> => {
  const genAI = new GoogleGenerativeAI(getApiKey());
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.0-pro',
    generationConfig: {
      responseMimeType: 'application/json',
      // Note: Complex nested schemas can cause issues, so we'll rely on prompt structure
    },
  });

  const prompt = `
    Persona and Rules:
    ${expertPersonaMarkdown}

    Action:
    Generate a tailored resume and full audit for the following profile against the job analysis.

    Return a JSON object with this structure:
    {
      "tailoredResume": { /* UserProfile object */ },
      "audit": {
        "overallScore": number,
        "overallAnalysis": string,
        "scoreBreakdown": {
          "hardSkillsMatch": { "score": number, "analysis": string },
          "softSkillsMatch": { "score": number, "analysis": string },
          "quantifiableAchievements": { "score": number, "analysis": string },
          "atsReadability": { "score": number, "analysis": string }
        },
        "actionableFeedback": string[],
        "quantificationSuggestions": [
          {
            "originalText": string,
            "suggestedRewrite": string,
            "contextualWhy": string
          }
        ]
      },
      "headlineSuggestions": string[]
    }

    User Profile:
    ${JSON.stringify(profile, null, 2)}

    Target Job Analysis:
    ${JSON.stringify(analysis, null, 2)}
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const responseText = response.text();

  if (!responseText) throw new Error('AI failed to generate response.');
  return JSON.parse(responseText) as IntelligencePackage;
};

// ---------------------------------------------------------------------------
// Resume Optimizer – Metrics Enhancement (calls FastAPI backend)
// ---------------------------------------------------------------------------

export interface ImprovedBullet {
  original: string;
  improved: string;
  metric_type: 'number' | 'percentage' | 'timeframe' | 'scale';
  rationale: string;
}

export interface SkillsGap {
  matched: string[];
  missing: string[];
  adjacent: string[];
  match_score: number;
}

export interface EnhanceResumeResult {
  improved_bullets: ImprovedBullet[];
  skills_gap: SkillsGap;
}

/**
 * Calls POST /api/analysis/enhance-resume on the FastAPI backend.
 * Returns improved bullets (Google XYZ formula) + a structured skills-gap block.
 */
export const enhanceResumeWithMetrics = async (
  resumeText: string,
  jobDescription: string
): Promise<EnhanceResumeResult> => {
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
  const url = `${apiBase}/api/analysis/enhance-resume`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ resume_text: resumeText, job_description: jobDescription }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`enhance-resume failed (${response.status}): ${detail}`);
  }

  return response.json() as Promise<EnhanceResumeResult>;
};
