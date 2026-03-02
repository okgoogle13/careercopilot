<<<<<<< HEAD
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
=======
import { genkitApi } from './genkit';
import type { IntelligencePackage, Job, JobAnalysis, UserProfile } from '../types/intelligence';

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'in',
  'is',
  'it',
  'of',
  'on',
  'or',
  'that',
  'the',
  'to',
  'with',
  'you',
  'your',
  'will',
  'this',
  'our',
  'we',
  'their',
  'they',
]);

const COMMON_HARD_SKILLS = [
  'python',
  'typescript',
  'javascript',
  'react',
  'node',
  'sql',
  'postgresql',
  'aws',
  'docker',
  'kubernetes',
  'fastapi',
  'genkit',
  'supabase',
  'power bi',
  'excel',
  'salesforce',
  'ndis',
  'wwcc',
  'case management',
  'stakeholder engagement',
  'project management',
  'compliance',
];

const ACTION_VERBS = [
  'led',
  'built',
  'designed',
  'implemented',
  'improved',
  'managed',
  'delivered',
  'coordinated',
  'developed',
  'optimized',
  'created',
  'launched',
];

function uniqueNonEmpty(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function toLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function findTaggedValue(text: string, tag: string): string | undefined {
  const regex = new RegExp(`^${tag}\\s*[:\\-]\\s*(.+)$`, 'im');
  const match = text.match(regex);
  return match?.[1]?.trim();
}

function extractKeywords(text: string, limit = 20): string[] {
  const words =
    text
      .toLowerCase()
      .match(/[a-z][a-z0-9+#.-]{2,}/g)
      ?.filter((word) => !STOP_WORDS.has(word)) || [];

  const frequencies = new Map<string, number>();
  for (const word of words) {
    frequencies.set(word, (frequencies.get(word) || 0) + 1);
  }

  return [...frequencies.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

function extractLinesByHints(lines: string[], hints: string[]): string[] {
  return lines.filter((line) => hints.some((hint) => line.toLowerCase().includes(hint)));
}

function extractHardSkills(text: string): string[] {
  const lower = text.toLowerCase();
  return COMMON_HARD_SKILLS.filter((skill) => lower.includes(skill)).map((skill) =>
    skill
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  );
}

function inferSectorInsights(text: string): JobAnalysis['sectorInsights'] | undefined {
  const lower = text.toLowerCase();

  const compliance = uniqueNonEmpty([
    lower.includes('wwcc') ? 'WWCC' : '',
    lower.includes('ndis') ? 'NDIS Worker Screening' : '',
    lower.includes('police check') ? 'Police Check' : '',
  ]);

  const standards = uniqueNonEmpty([
    lower.includes('aasw') ? 'AASW' : '',
    lower.includes('aps') ? 'APS Capability Framework' : '',
    lower.includes('trauma-informed') ? 'Trauma-informed practice' : '',
  ]);

  const framework = lower.includes('aps')
    ? 'APS Integrated Leadership System'
    : lower.includes('ndis')
      ? 'NDIS Practice Standards'
      : undefined;

  if (!framework && compliance.length === 0 && standards.length === 0) {
    return undefined;
  }

  return { framework, compliance, standards };
}

function buildAnalysisFromText(text: string): JobAnalysis {
  const lines = toLines(text);
  const jobTitle =
    findTaggedValue(text, 'job title') ||
    findTaggedValue(text, 'role') ||
    lines.find((line) => /manager|officer|specialist|coordinator|advisor|engineer|analyst/i.test(line)) ||
    'Unknown Role';

  const companyName =
    findTaggedValue(text, 'company') ||
    findTaggedValue(text, 'organisation') ||
    findTaggedValue(text, 'organization') ||
    'Unknown Company';

  const minimumRequirements = uniqueNonEmpty(
    extractLinesByHints(lines, ['must', 'required', 'minimum', 'essential criteria', 'qualification'])
  );

  const desirableAttributes = uniqueNonEmpty(
    extractLinesByHints(lines, ['preferred', 'desirable', 'nice to have', 'highly regarded'])
  );

  const keyResponsibilitiesAndKpis = uniqueNonEmpty(
    extractLinesByHints(lines, ['responsibil', 'duty', 'deliver', 'kpi', 'outcome'])
  );

  const companyNicheAndValues = uniqueNonEmpty(
    extractLinesByHints(lines, ['mission', 'value', 'culture', 'purpose', 'community'])
  );

  const valuedOutcomes = uniqueNonEmpty(
    extractLinesByHints(lines, ['impact', 'outcome', 'improve', 'support', 'results'])
  );

  const roleSpecificHardSkills = uniqueNonEmpty(extractHardSkills(text));
  const keywords = uniqueNonEmpty([...extractKeywords(text), ...roleSpecificHardSkills]).slice(0, 20);

  return {
    jobTitle,
    companyName,
    keywords,
    minimumRequirements,
    keyResponsibilitiesAndKpis,
    valuedOutcomes,
    roleSpecificHardSkills,
    companyNicheAndValues,
    desirableAttributes,
    sectorInsights: inferSectorInsights(text),
  };
}

function profileToResumeText(profile: UserProfile): string {
  const skills = profile.skills.flatMap((category) => category.skillsList).join(', ');
  const experience = profile.experience
    .map((entry) => [entry.jobTitle, entry.organization, entry.description, ...entry.responsibilities, entry.achievement].join('\n'))
    .join('\n\n');
  const certifications = profile.development.certifications.map((item) => item.name).join(', ');

  return [
    profile.fullName,
    profile.resumeHeadline,
    profile.careerSummary,
    skills,
    certifications,
    experience,
  ]
    .filter(Boolean)
    .join('\n\n');
}

function countKeywordMatches(resumeText: string, keywords: string[]): number {
  const lower = resumeText.toLowerCase();
  return keywords.filter((keyword) => lower.includes(keyword.toLowerCase())).length;
}

function buildQuantificationSuggestions(profile: UserProfile): Array<{
  originalText: string;
  suggestedRewrite: string;
  contextualWhy: string;
}> {
  const suggestions: Array<{ originalText: string; suggestedRewrite: string; contextualWhy: string }> = [];

  for (const entry of profile.experience) {
    for (const responsibility of entry.responsibilities) {
      if (/\d/.test(responsibility)) {
        continue;
      }

      suggestions.push({
        originalText: responsibility,
        suggestedRewrite: `${responsibility} (e.g., improved service turnaround by 20% over 6 months).`,
        contextualWhy: 'Adding a measurable metric improves ATS scoring and recruiter confidence.',
      });

      if (suggestions.length >= 5) {
        return suggestions;
      }
    }
  }

  if (suggestions.length === 0) {
    suggestions.push({
      originalText: 'Delivered strong outcomes across key responsibilities.',
      suggestedRewrite: 'Delivered strong outcomes, including a 25% reduction in processing time within one quarter.',
      contextualWhy: 'Quantified outcomes make impact easier to evaluate quickly.',
    });
  }

  return suggestions;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function buildHeadlineSuggestions(profile: UserProfile, analysis: JobAnalysis): string[] {
  const role = analysis.jobTitle || 'Target Role';
  return uniqueNonEmpty([
    `${role} | ${profile.resumeHeadline}`,
    `${profile.fullName} | ${role} | Community Impact Focused`,
    `${role} | Outcomes-Driven Professional`,
  ]);
}

/**
 * ANALYZE: Extracts intelligence from raw Job Description text.
 * This runs locally without exposing provider API keys in the browser.
 */
export const analyzeJobDescription = async (text: string): Promise<JobAnalysis> => {
  if (!text.trim()) {
    throw new Error('Job description text is required.');
  }

  return buildAnalysisFromText(text);
};

/**
 * ANALYZE FROM URL: Uses backend Genkit endpoint and maps response into JobAnalysis.
 */
export const analyzeJobFromUrl = async (url: string): Promise<JobAnalysis> => {
  const result = await genkitApi.analyzeJobFromUrl({ url });
  const details = result.job_details;

  const baseText = [
    details.role_title,
    details.company_name,
    ...(details.essential_criteria || []),
    ...(details.desirable_criteria || []),
    ...(details.key_responsibilities || []),
    details.full_description,
  ]
    .filter(Boolean)
    .join('\n');

  const baseAnalysis = buildAnalysisFromText(baseText);

  const enrichedKeywords = uniqueNonEmpty([
    ...baseAnalysis.keywords,
    ...(details.subsectors || []),
    ...(details.essential_criteria || []),
  ]).slice(0, 24);

  const companyValues = uniqueNonEmpty([
    ...baseAnalysis.companyNicheAndValues,
    ...(result.company_context?.core_values || []),
    ...(details.subsectors || []),
  ]);

  const valuedOutcomes = uniqueNonEmpty([
    ...baseAnalysis.valuedOutcomes,
    ...(result.company_context?.why_work_here_points || []),
    ...(result.company_context?.recent_achievements || []),
  ]);

  return {
    ...baseAnalysis,
    jobTitle: details.role_title || baseAnalysis.jobTitle,
    companyName: details.company_name || baseAnalysis.companyName,
    keywords: enrichedKeywords,
    minimumRequirements: uniqueNonEmpty([
      ...baseAnalysis.minimumRequirements,
      ...(details.essential_criteria || []),
    ]),
    desirableAttributes: uniqueNonEmpty([
      ...baseAnalysis.desirableAttributes,
      ...(details.desirable_criteria || []),
    ]),
    keyResponsibilitiesAndKpis: uniqueNonEmpty([
      ...baseAnalysis.keyResponsibilitiesAndKpis,
      ...(details.key_responsibilities || []),
    ]),
    companyNicheAndValues: companyValues,
    valuedOutcomes,
    sources: [{ title: 'Job Posting URL', uri: url }],
>>>>>>> restoration-KR-Rage-Figma-v2.0
  };
};

/**
<<<<<<< HEAD
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
=======
 * SEARCH: Returns deterministic sample jobs without browser-side provider keys.
 */
export const searchJobs = async (query: string): Promise<Job[]> => {
  const normalized = query.trim() || 'Community Services';
  const locations = ['Sydney NSW', 'Melbourne VIC', 'Brisbane QLD', 'Adelaide SA', 'Perth WA'];

  return locations.map((location, index) => ({
    jobTitle: `${normalized} Specialist ${index + 1}`,
    companyName: `Community Impact Org ${index + 1}`,
    location,
    jobDescription: `Sample ${normalized} role focused on service delivery, stakeholder engagement, and measurable outcomes.`,
  }));
};

/**
 * GENERATE: Produces a structured intelligence package without exposing frontend API keys.
>>>>>>> restoration-KR-Rage-Figma-v2.0
 */
export const generateIntelligencePackage = async (
  profile: UserProfile,
  analysis: JobAnalysis,
<<<<<<< HEAD
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
=======
  _expertPersonaMarkdown: string
): Promise<IntelligencePackage> => {
  const resumeText = profileToResumeText(profile);
  const missingKeywords = analysis.keywords.filter(
    (keyword) => !resumeText.toLowerCase().includes(keyword.toLowerCase())
  );

  let optimizedResumeText = resumeText;
  try {
    const optimized = await genkitApi.optimizeResume({
      resume_text: resumeText,
      missing_keywords: missingKeywords.slice(0, 20),
      job_description: [analysis.jobTitle, analysis.companyName, ...analysis.minimumRequirements].join('\n'),
    });
    optimizedResumeText = optimized.resume_text || resumeText;
  } catch {
    // Keep local fallback if backend optimization is unavailable.
  }

  const totalKeywords = Math.max(analysis.keywords.length, 1);
  const matchedKeywords = countKeywordMatches(optimizedResumeText, analysis.keywords);
  const hardSkillsScore = clampScore((matchedKeywords / totalKeywords) * 100);

  const actionVerbMatches = ACTION_VERBS.filter((verb) =>
    optimizedResumeText.toLowerCase().includes(verb)
  ).length;
  const softSkillsScore = clampScore((actionVerbMatches / ACTION_VERBS.length) * 100);

  const quantifiableCount = (optimizedResumeText.match(/\b\d+(?:\.\d+)?%?\b/g) || []).length;
  const quantifiableScore = clampScore((quantifiableCount / 10) * 100);

  const readableLines = toLines(optimizedResumeText).length;
  const atsScore = clampScore(Math.min(100, 45 + readableLines * 1.5));

  const overallScore = clampScore(
    hardSkillsScore * 0.35 + softSkillsScore * 0.2 + quantifiableScore * 0.25 + atsScore * 0.2
  );

  const actionableFeedback = uniqueNonEmpty([
    missingKeywords.length > 0
      ? `Integrate missing role keywords: ${missingKeywords.slice(0, 8).join(', ')}.`
      : 'Keyword alignment is strong against the target role.',
    quantifiableCount < 5
      ? 'Increase measurable outcomes (percentages, counts, time savings) in experience bullets.'
      : 'Quantifiable achievements are present and should be retained.',
    'Prioritize role-specific responsibilities near the top of each recent role entry.',
  ]);

  return {
    tailoredResume: profile,
    audit: {
      overallScore,
      overallAnalysis: `Profile alignment estimated at ${overallScore}/100 for ${analysis.jobTitle} at ${analysis.companyName}.`,
      scoreBreakdown: {
        hardSkillsMatch: {
          score: hardSkillsScore,
          analysis: `${matchedKeywords}/${totalKeywords} target keywords found in resume content.`,
        },
        softSkillsMatch: {
          score: softSkillsScore,
          analysis: `${actionVerbMatches} high-impact action verbs detected.`,
        },
        quantifiableAchievements: {
          score: quantifiableScore,
          analysis: `${quantifiableCount} measurable signals detected across resume text.`,
        },
        atsReadability: {
          score: atsScore,
          analysis: 'Readability estimated from structure and line-level scannability.',
        },
      },
      actionableFeedback,
      quantificationSuggestions: buildQuantificationSuggestions(profile),
    },
    headlineSuggestions: buildHeadlineSuggestions(profile, analysis),
  };
>>>>>>> restoration-KR-Rage-Figma-v2.0
};
