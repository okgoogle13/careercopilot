/* eslint-disable */
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import {
  CareerDatabase,
  KSCResponse,
  CareerEntry,
  StructuredAchievement,
  JobOpportunity,
  MatchAnalysis,
} from '../types';

// Initialize the Google GenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Schema for the full career database output.
const careerDatabaseSchema = {
  type: Type.OBJECT,
  properties: {
    Personal_Information: {
      type: Type.OBJECT,
      properties: {
        FullName: { type: Type.STRING },
        Phone: { type: Type.STRING },
        Email: { type: Type.STRING },
        Location: { type: Type.STRING },
        Portfolio_Website_URLs: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['FullName', 'Email'],
    },
    Career_Profile: {
      type: Type.OBJECT,
      properties: {
        Target_Titles: { type: Type.ARRAY, items: { type: Type.STRING } },
        Master_Summary_Points: { type: Type.ARRAY, items: { type: Type.STRING } },
        Job_Preferences: {
          type: Type.OBJECT,
          properties: {
            Target_Roles: { type: Type.ARRAY, items: { type: Type.STRING } },
            Preferred_Locations: { type: Type.ARRAY, items: { type: Type.STRING } },
            Work_Type: { type: Type.STRING, enum: ['Remote', 'Hybrid', 'On-site', 'Any'] },
            Relocation_Open: { type: Type.BOOLEAN },
            Min_Salary: { type: Type.NUMBER },
            Notice_Period: { type: Type.STRING },
          },
        },
      },
    },
    Master_Skills_Inventory: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          Skill_Name: { type: Type.STRING },
          Category: { type: Type.STRING },
          Subtype: { type: Type.ARRAY, items: { type: Type.STRING } },
          Proficiency: {
            type: Type.STRING,
            enum: ['Novice', 'Competent', 'Proficient', 'Expert', 'Master'],
          },
          Years_Experience: { type: Type.NUMBER },
          Last_Used_Year: { type: Type.STRING },
        },
        required: ['Skill_Name', 'Category'],
      },
    },
    Career_Entries: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          Entry_ID: {
            type: Type.STRING,
            description: "Unique identifier for the entry, e.g., 'work-1'.",
          },
          Entry_Type: {
            type: Type.STRING,
            enum: ['Work Experience', 'Project', 'Education', 'Certification', 'Volunteer'],
          },
          Organization: { type: Type.STRING },
          Role: { type: Type.STRING },
          StartDate: { type: Type.STRING },
          EndDate: { type: Type.STRING },
          Location: { type: Type.STRING },
          Core_Responsibilities_Scope: { type: Type.STRING },
          Subtype_Tags: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['Entry_ID', 'Entry_Type', 'Organization', 'Role', 'StartDate', 'EndDate'],
      },
    },
    Structured_Achievements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          Achievement_ID: {
            type: Type.STRING,
            description: "Unique identifier for the achievement, e.g., 'ach-1'.",
          },
          Entry_ID: { type: Type.STRING, description: 'Links to a Career Entry ID.' },
          Original_Text: { type: Type.STRING },
          Action_Verb: { type: Type.STRING },
          Noun_Task: { type: Type.STRING },
          Metric: {
            type: Type.STRING,
            description: "Quantifiable result. Use 'X' as a placeholder if missing.",
          },
          Strategy: { type: Type.STRING },
          Outcome: { type: Type.STRING },
          Skills_Used: { type: Type.ARRAY, items: { type: Type.STRING } },
          Tools_Used: { type: Type.ARRAY, items: { type: Type.STRING } },
          Subtype_Tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          Needs_Review_Flag: {
            type: Type.BOOLEAN,
            description: "Set to true if a metric is missing (contains 'X').",
          },
          Improvement_Suggestions: {
            type: Type.OBJECT,
            properties: {
              Action_Verb: { type: Type.STRING },
              Noun_Task: { type: Type.STRING },
              Metric: {
                type: Type.STRING,
                description:
                  'Optimized metric suggestion. If missing, suggest a plausible placeholder.',
              },
              Strategy: { type: Type.STRING },
              Outcome: { type: Type.STRING },
            },
          },
        },
        required: [
          'Achievement_ID',
          'Entry_ID',
          'Original_Text',
          'Action_Verb',
          'Noun_Task',
          'Metric',
          'Outcome',
          'Needs_Review_Flag',
        ],
      },
    },
    KSC_Responses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          KSC_ID: {
            type: Type.STRING,
            description: "Unique identifier for the KSC, e.g., 'ksc-1'.",
          },
          KSC_Prompt: { type: Type.STRING },
          Situation: { type: Type.STRING },
          Task: { type: Type.STRING },
          Action: { type: Type.STRING },
          Result: { type: Type.STRING },
          Skills_Used: { type: Type.ARRAY, items: { type: Type.STRING } },
          Subtype_Tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          Original_Text: { type: Type.STRING },
          Needs_Review_Flag: {
            type: Type.BOOLEAN,
            description: 'Set to true if the STAR structure seems incomplete, weak, or vague.',
          },
          STAR_Feedback: {
            type: Type.STRING,
            description:
              'Detailed critique identifying vague language, quantification gaps, or detail deficiencies.',
          },
          Linked_Entry_ID: {
            type: Type.STRING,
            description: 'Optional link to a Career Entry ID.',
          },
          Linked_Achievement_IDs: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Optional list of linked Structured Achievement IDs.',
          },
          Improvement_Suggestions: {
            type: Type.OBJECT,
            properties: {
              Situation: {
                type: Type.STRING,
                description: 'Detailed rewrite or prompt for missing context.',
              },
              Task: {
                type: Type.STRING,
                description: 'Detailed rewrite defining the specific challenge.',
              },
              Action: {
                type: Type.STRING,
                description: 'Detailed rewrite using strong verbs and specific methodologies.',
              },
              Result: {
                type: Type.STRING,
                description: 'Detailed rewrite focusing on quantifiable and qualitative impact.',
              },
            },
          },
        },
        required: [
          'KSC_ID',
          'KSC_Prompt',
          'Situation',
          'Task',
          'Action',
          'Result',
          'Original_Text',
          'Needs_Review_Flag',
          'STAR_Feedback',
        ],
      },
    },
  },
  required: [
    'Personal_Information',
    'Career_Profile',
    'Master_Skills_Inventory',
    'Career_Entries',
    'Structured_Achievements',
    'KSC_Responses',
  ],
};

/**
 * Generates vector embeddings for a given text using Gemini.
 */
export const generateEmbeddings = async (text: string): Promise<number[]> => {
  if (!text || text.length < 5) return [];
  try {
    const response = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: text,
    });
    return response.embeddings?.[0]?.values || [];
  } catch (e) {
    console.warn('Embedding generation failed for text segment:', e);
    return [];
  }
};

/**
 * Processes a set of career documents using Gemini AI to extract and structure data.
 */
export const processCareerDocuments = async (
  fileParts: { inlineData: { data: string; mimeType: string } }[]
): Promise<CareerDatabase> => {
  const prompt = `
    Analyze the following collection of career documents, provided as separate files. Your task is to act as a "Career Database Pre-processor".
    Extract, analyze, de-duplicate, merge, and structure the information from ALL provided documents into a single, coherent JSON object.

    Core Instructions:
    1.  **De-duplication & Merging**: Identify identical roles across different documents and merge them.
    2.  **Structured Achievements**: Rewrite text into "Action Verb + Noun + Metric + Strategy + Outcome".
    3.  **KSC to STAR Method**: Structure narrative selection criteria responses into STAR format.

    4.  **DEEP STAR CRITIQUE & VALIDATION**:
        For every KSC Response, perform a "High-Impact Audit". Set 'Needs_Review_Flag' to true if any of the following are detected:

        - **Vague Language Audit**: Check for "fluff" words like "assisted," "involved in," "handled," or "helped with." Replace with power verbs like "orchestrated," "standardized," "mitigated," or "pioneered."
        - **Quantification Gap**: If the 'Result' lacks numbers, percentages, dollar amounts, or timeframes (e.g., "improved efficiency" vs. "reduced processing time by 30%"), flag it.
        - **Detail Deficiency**:
            - **Situation**: Is the scale of the project or team size missing?
            - **Task**: Is the specific business problem or obstacle unclear?
            - **Action**: Are the technical tools or specific steps missing? (e.g., "I used software" vs. "I leveraged Python's Pandas library to automate...").
            - **Result**: Is the qualitative impact (stakeholder feedback, award) or quantitative metric missing?

        - **STAR_Feedback**: Provide a professional, critical analysis. Tell the user exactly *why* their response is currently weak. Use phrases like "Your action section lacks technical specificity" or "This result is purely anecdotal; adding a metric would increase credibility."
        - **Improvement_Suggestions**: Provide draft rewrites that include placeholders (e.g., "[Insert Number here]") to show the user exactly where they need to provide more data to reach a 10/10 rating.

    5.  **Achievement Optimization**:
        For EVERY Structured Achievement, provide an "Improvement_Suggestions" object.
        Analyze the original text and provide the strongest possible version for the Action Verb, Noun/Task, Metric, Strategy, and Outcome.
        If the metric is missing in the original, suggest a realistic placeholder.

    6.  **Subtype Tagging**: Apply relevant tags aligned with Australian Community Services best practices (e.g., NDIS, Trauma-Informed, Strengths-Based).
    7.  **Unique IDs**: Generate IDs like 'work-1', 'ach-1', 'ksc-1'.

    8.  **Skill Enrichment**:
        For every skill in 'Master_Skills_Inventory', attempt to infer the 'Proficiency' (Novice, Competent, Proficient, Expert, Master) and 'Years_Experience' based on the duration of roles where that skill was used.

    9. **Job Preferences**:
        Infer the user's implicit job preferences (e.g., if they have only worked remote recently, mark remote) and extract any explicit ones found in summaries or objective statements.
  `;

  const contentParts = [{ text: prompt }, ...fileParts];

  try {
    // 1. Generate Structured Text Data
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: contentParts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: careerDatabaseSchema,
        temperature: 0.1,
        thinkingConfig: {
          thinkingBudget: 32768,
        },
      },
    });

    const jsonString = response.text;
    if (!jsonString) throw new Error('Empty response from Gemini');
    const data = JSON.parse(jsonString) as CareerDatabase;

    // 2. Post-Process: Generate Embeddings for RAG (Retrieval Augmented Generation)
    // We generate embeddings for Achievements and KSCs so the downstream app can match them to Job Descriptions.

    const embeddingPromises: Promise<void>[] = [];

    // Embed Achievements
    data.Structured_Achievements.forEach((ach) => {
      embeddingPromises.push(
        (async () => {
          // Create a rich semantic string for embedding
          const textToEmbed = `${ach.Action_Verb} ${ach.Noun_Task} ${ach.Strategy} resulting in ${ach.Outcome}. Skills: ${ach.Skills_Used.join(', ')}`;
          ach.Embedding = await generateEmbeddings(textToEmbed);
        })()
      );
    });

    // Embed KSCs
    data.KSC_Responses.forEach((ksc) => {
      embeddingPromises.push(
        (async () => {
          const textToEmbed = `Prompt: ${ksc.KSC_Prompt}. Situation: ${ksc.Situation} Task: ${ksc.Task} Action: ${ksc.Action} Result: ${ksc.Result}`;
          ksc.Embedding = await generateEmbeddings(textToEmbed);
        })()
      );
    });

    // Embed Career Entries (Roles)
    data.Career_Entries.forEach((entry) => {
      embeddingPromises.push(
        (async () => {
          const textToEmbed = `${entry.Role} at ${entry.Organization}. ${entry.Core_Responsibilities_Scope}`;
          entry.Embedding = await generateEmbeddings(textToEmbed);
        })()
      );
    });

    // Wait for all embeddings to generate
    await Promise.all(embeddingPromises);

    return data;
  } catch (error) {
    console.error('Error processing documents with Gemini API:', error);
    throw new Error(
      'Failed to parse career documents. The AI model could not structure the provided text.'
    );
  }
};

export const suggestTagsForItems = async (
  items: (CareerEntry | KSCResponse)[],
  context: { targetTitles: string[]; summaryPoints: string[] }
): Promise<{ tags: string[]; skillsGaps: string[] }> => {
  const prompt = `
      Analyze the following career items (Work entries or KSC responses) in the context of a user targeting these roles: ${context.targetTitles.join(', ')}.

      User Summary context: ${context.summaryPoints.join(' ')}

      Items to analyze:
      ${JSON.stringify(
        items.map((i) =>
          'Role' in i
            ? `Role: ${i.Role}, Org: ${i.Organization}, Desc: ${i.Core_Responsibilities_Scope}`
            : `KSC: ${i.KSC_Prompt}, STAR: ${i.Situation} ${i.Task} ${i.Action} ${i.Result}`
        ),
        null,
        2
      )}

      Tasks:
      1. Suggest 5-10 high-value "Capability Tags" that represent the strategic value of these items (e.g., "Change Management", "Stakeholder Engagement", "Crisis Intervention").
      2. Identify 1-3 "Strategic Skills Gaps" - areas usually required for the target roles that seem missing or weak in these specific items.

      Return JSON: { "tags": string[], "skillsGaps": string[] }
    `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      responseMimeType: 'application/json',
    },
  });

  return JSON.parse(response.text || '{ "tags": [], "skillsGaps": [] }');
};

export const refineKSCResponse = async (ksc: KSCResponse): Promise<Partial<KSCResponse>> => {
  const prompt = `
      Refine the following STAR response to be more impactful, concise, and metric-driven.

      Original Prompt: ${ksc.KSC_Prompt}
      Current Situation: ${ksc.Situation}
      Current Task: ${ksc.Task}
      Current Action: ${ksc.Action}
      Current Result: ${ksc.Result}

      Return a JSON object with keys: Situation, Task, Action, Result.
    `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt }] },
    config: { responseMimeType: 'application/json' },
  });

  return JSON.parse(response.text || '{}');
};

export const refineAchievementField = async (
  ach: StructuredAchievement,
  field: keyof StructuredAchievement
): Promise<string> => {
  const prompt = `
      Context: The user has a career achievement: "${ach.Original_Text}".
      Current Parsed Data:
      - Action: ${ach.Action_Verb}
      - Task: ${ach.Noun_Task}
      - Metric: ${ach.Metric}
      - Strategy: ${ach.Strategy}
      - Outcome: ${ach.Outcome}

      Task: Suggest a stronger, more professional, or more specific value for the field: "${field}".
      If the field is 'Metric' and the current value is 'X' or missing, suggest a realistic placeholder format (e.g. "reduced processing time by 20%").

      Return ONLY the suggested string value.
    `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt }] },
  });

  return response.text?.trim() || '';
};

export const analyzeFitAndGenerateDrafts = async (
  job: JobOpportunity,
  careerData: CareerDatabase
): Promise<MatchAnalysis> => {
  const prompt = `
      You are an expert career coach and ATS optimization specialist.
      Analyze the user's Career Database against the provided Job Opportunity.

      Job Opportunity:
      ${JSON.stringify(job, null, 2)}

      User's Career Database:
      ${JSON.stringify(careerData, null, 2)}

      Tasks:
      1. Calculate an Overall_Fit_Score (0-100) based on how well the user's skills and experience match the job requirements.
      2. Identify Skill_Gaps. For each required hard/soft skill in the job posting, determine the Match_Level ("Strong", "Partial", "Missing") based on the user's Master_Skills_Inventory and Career_Entries. Provide brief Evidence from the user's profile.
      3. Write a Tailored_Summary (3-4 sentences) that the user can put at the top of their resume, specifically highlighting their most relevant experience for this exact role.
      4. Provide a Headline_Suggestion (e.g., "Senior Software Engineer | React Specialist") that positions the candidate perfectly for this role.
      5. Recommend 3-5 Achievement_IDs from the user's Structured_Achievements that are most relevant to this job's Key_Responsibilities.
      6. Draft a highly tailored Cover_Letter (3-4 paragraphs) that connects the user's specific achievements and values to the company's needs and culture keywords.

      Return the result as a JSON object matching the requested schema.
    `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      Overall_Fit_Score: { type: Type.NUMBER },
      Skill_Gaps: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            Skill: { type: Type.STRING },
            Match_Level: { type: Type.STRING, enum: ['Strong', 'Partial', 'Missing'] },
            Evidence: { type: Type.STRING },
          },
          required: ['Skill', 'Match_Level', 'Evidence'],
        },
      },
      Headline_Suggestion: { type: Type.STRING },
      Tailored_Summary: { type: Type.STRING },
      Recommended_Achievement_IDs: { type: Type.ARRAY, items: { type: Type.STRING } },
      Cover_Letter_Draft: { type: Type.STRING },
    },
    required: [
      'Overall_Fit_Score',
      'Skill_Gaps',
      'Headline_Suggestion',
      'Tailored_Summary',
      'Recommended_Achievement_IDs',
      'Cover_Letter_Draft',
    ],
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // Use Pro for complex reasoning and drafting
    contents: { parts: [{ text: prompt }] },
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
      temperature: 0.2,
      tools: [{ googleSearch: {} }],
    },
  });

  const jsonString = response.text;
  if (!jsonString) throw new Error('Empty response from Gemini');
  return JSON.parse(jsonString) as MatchAnalysis;
};

export const extractJobOpportunity = async (
  inputType: 'url' | 'text',
  content: string,
  careerData?: CareerDatabase
): Promise<JobOpportunity> => {
  const prompt = `
      You are an expert technical recruiter and data analyst.
      Analyze the following job posting and extract the key particulars into a structured JSON format.

      ${inputType === 'url' ? `Source URL: ${content}\nPlease extract the job details from this URL.` : `Job Posting Text:\n${content.substring(0, 30000)}`}

      ${
        careerData
          ? `
      Additionally, you have access to the user's Career Database:
      ${JSON.stringify(careerData.Master_Skills_Inventory)}

      Based on the job requirements and the user's skills, suggest potential skills the user might have that are relevant to this job but might not be explicitly listed in their database or could be highlighted.
      `
          : ''
      }

      Extract the following fields:
      - Job_Title: The official title of the position.
      - Company_Name: The name of the hiring company.
      - Location: The location of the job (city, state, country).
      - Work_Type: One of "Remote", "Hybrid", "On-site", "Unspecified".
      - Salary_Range: The stated salary range or compensation details (or "Not specified").
      - Key_Responsibilities: An array of the main duties and responsibilities.
      - Required_Hard_Skills: An array of mandatory technical/hard skills.
      - Required_Soft_Skills: An array of mandatory soft skills.
      - Preferred_Skills: An array of "nice-to-have" or bonus skills.
      ${careerData ? '- Suggested_Skills: An array of skills the user might have based on their career database that are relevant to this job.' : ''}
      - Required_Experience: The required years of experience or seniority level.
      - Company_Culture_Keywords: An array of words describing the company culture or values.
      - Red_Flags: An array of potential red flags (e.g., "fast-paced environment", "wear many hats", "unlimited PTO").
      - Application_Deadline: The closing date for applications (or "Not specified").
      - Source_URL: ${inputType === 'url' ? content : '"Pasted Text"'}
    `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      Job_Title: { type: Type.STRING },
      Company_Name: { type: Type.STRING },
      Location: { type: Type.STRING },
      Work_Type: { type: Type.STRING, enum: ['Remote', 'Hybrid', 'On-site', 'Unspecified'] },
      Salary_Range: { type: Type.STRING },
      Key_Responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
      Required_Hard_Skills: { type: Type.ARRAY, items: { type: Type.STRING } },
      Required_Soft_Skills: { type: Type.ARRAY, items: { type: Type.STRING } },
      Preferred_Skills: { type: Type.ARRAY, items: { type: Type.STRING } },
      ...(careerData
        ? { Suggested_Skills: { type: Type.ARRAY, items: { type: Type.STRING } } }
        : {}),
      Required_Experience: { type: Type.STRING },
      Company_Culture_Keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
      Red_Flags: { type: Type.ARRAY, items: { type: Type.STRING } },
      Application_Deadline: { type: Type.STRING },
      Source_URL: { type: Type.STRING },
    },
    required: [
      'Job_Title',
      'Company_Name',
      'Location',
      'Work_Type',
      'Salary_Range',
      'Key_Responsibilities',
      'Required_Hard_Skills',
      'Required_Soft_Skills',
      'Preferred_Skills',
      'Required_Experience',
      'Company_Culture_Keywords',
      'Red_Flags',
      'Application_Deadline',
      'Source_URL',
    ],
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
      temperature: 0.1,
      tools: inputType === 'url' ? [{ urlContext: {} }] : undefined,
    },
  });

  const jsonString = response.text;
  if (!jsonString) throw new Error('Empty response from Gemini');
  return JSON.parse(jsonString) as JobOpportunity;
};

export const generateMatchAnalysis = async (
  careerData: CareerDatabase,
  job: JobOpportunity
): Promise<MatchAnalysis> => {
  // Load static knowledge reference files (simulated for now, could be fetched from a server or imported)
  const communityServicesTaxonomy = `
      Community Services Taxonomy:
      - Direct Practice: Case Management, Counseling, Crisis Intervention, Advocacy.
      - Program Management: Program Design, Evaluation, Grant Writing, Budgeting.
      - Community Development: Capacity Building, Community Engagement, Partnership Brokering.
      - Policy & Research: Policy Analysis, Social Research, Submission Writing.
      - Leadership: Clinical Supervision, Team Leadership, Strategic Planning.
    `;

  const starRules = `
      STAR Method Rules:
      - Situation: Set the context (who, what, where, when). Keep it brief (10-15%).
      - Task: Describe the specific challenge or goal. What needed to be done? (10-15%).
      - Action: Detail the specific actions YOU took. Use "I", not "we". Focus on skills and methods (60-70%).
      - Result: Quantify the outcome. What was achieved? What did you learn? (10-15%).
    `;

  const prompt = `
      You are an elite executive career coach and expert resume writer who specializes in authentic, high-impact job applications.
      Your task is to analyze the candidate's Career Database against the target Job Opportunity and provide a highly tailored, authentic match analysis.

      CRITICAL INSTRUCTION: Use the Google Search tool to research the company "${job.Company_Name}". Look for recent news, their mission, core values, or current industry challenges they might be facing. Use this context to make the cover letter and summary deeply authentic and specific to them.

      Job Opportunity:
      ${JSON.stringify(job)}

      Candidate Career Database:
      ${JSON.stringify(careerData)}

      Knowledge Reference Files:
      ${communityServicesTaxonomy}
      ${starRules}

      Perform the following:
      1. Calculate an Overall_Fit_Score (0-100) based on skill overlap and experience.
      2. Perform a Skill Gap Analysis. For each Required_Skill and Preferred_Skill in the job, determine if the candidate has a "Strong", "Partial", or "Missing" match. Provide brief evidence if Strong/Partial.
      3. Write a highly tailored Professional Summary (3-4 sentences) for the top of a resume targeting this specific role.
         - VALUE PROPOSITION: The Tailored Summary should be a strong 2-3 sentence hook that aligns the user's top 2 strengths directly with the core problem the job is trying to solve.
         - HEADLINE: Provide a short, punchy Resume Headline (e.g., "Senior Software Engineer | React Specialist") that positions the candidate perfectly for this role.
      4. Select the top 5-7 most relevant Achievement_IDs from the candidate's Structured_Achievements that should be highlighted in the resume. Choose achievements that demonstrate impact related to the job's core responsibilities.
      5. Draft a compelling, modern Cover Letter tailored to this company and role, drawing specific metrics and examples from the candidate's achievements.
      6. Draft 2-3 Key Selection Criteria (KSC) Responses in STAR format (Situation, Task, Action, Result) based on the most critical requirements of the job. Each response should be 150-200 words.
      7. Perform a "Best Practices" Audit for both the Resume and the Cover Letter based on the Resume Knowledge Library (RKL) rules below.

      RESUME KNOWLEDGE LIBRARY (RKL) RULES:
      - [L1.L1.001] Single-column layout preferred (universally safer).
      - [L1.L1.002] Top-third priority: Name, contact, target role, summary, recent experience must be in top 30%.
      - [L1.L1.005] Two-column layout constraints (if used):
        - Layout: Two-column using native document columns (60/40 or 65/35 ratio).
        - Left Column Content: Contact, Work Experience, Job Titles, Dates.
        - Right Column Content: Skills, Certifications, Additional Info.
        - Linear reading order: Ensure content flows logically from left to right, top to bottom.
      - [L2.V1.001] Body text 10-12pt, headings 14-16pt.
      - [L2.V1.002] Standard fonts only: Arial, Calibri, Georgia, Times New Roman, Garamond.
      - [L2.V1.004] No charts/infographics/images/logos/skill bars.
      - [L4.A1.002] Linear reading order: No tables, text boxes, or floating elements for layout structure.
      - [L5.S1.001] Extract and embed 10-15 keywords from JD.
      - [L7.W1.001] Specific + outcome-focused bullets (Action + Context + Outcome).
      - [L7.W1.002] Strong action verbs over passive voice.
      - [L7.W1.005] Simple bullet points only (- or •), no custom icons.

      Guidelines for Authentic Tailoring:
      - NO AI CLICHÉS: Do not use words like "thrilled", "delve", "testament", "tapestry", "navigate", or "fast-paced". Write like a real, confident professional.
      - SHOW, DON'T TELL: Instead of saying "I have great leadership skills", use the candidate's achievements to demonstrate leadership.
      - COMPANY CONTEXT: Incorporate 1-2 subtle references to the company's actual current context (based on your search) in the cover letter to show genuine interest.
      - TWO-COLUMN RISK: If a two-column layout is detected or recommended, include a warning that single-column is universally safer, while two-column offers better space efficiency for experienced professionals when properly tested.
    `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      Overall_Fit_Score: { type: Type.NUMBER },
      Skill_Gaps: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            Skill: { type: Type.STRING },
            Match_Level: { type: Type.STRING, enum: ['Strong', 'Partial', 'Missing'] },
            Evidence: { type: Type.STRING },
          },
          required: ['Skill', 'Match_Level', 'Evidence'],
        },
      },
      Headline_Suggestion: { type: Type.STRING },
      Tailored_Summary: { type: Type.STRING },
      Recommended_Achievement_IDs: { type: Type.ARRAY, items: { type: Type.STRING } },
      Cover_Letter_Draft: { type: Type.STRING },
      KSC_Responses_Drafts: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            KSC_Prompt: { type: Type.STRING },
            Response: { type: Type.STRING },
          },
          required: ['KSC_Prompt', 'Response'],
        },
      },
      Resume_Audit: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          scanSimulation: { type: Type.STRING },
          violations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                ruleId: { type: Type.STRING },
                severity: { type: Type.STRING, enum: ['error', 'warning', 'info'] },
                message: { type: Type.STRING },
                location: { type: Type.STRING },
              },
              required: ['ruleId', 'severity', 'message'],
            },
          },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['overallScore', 'scanSimulation', 'violations', 'recommendations'],
      },
      Cover_Letter_Audit: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          scanSimulation: { type: Type.STRING },
          violations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                ruleId: { type: Type.STRING },
                severity: { type: Type.STRING, enum: ['error', 'warning', 'info'] },
                message: { type: Type.STRING },
                location: { type: Type.STRING },
              },
              required: ['ruleId', 'severity', 'message'],
            },
          },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['overallScore', 'scanSimulation', 'violations', 'recommendations'],
      },
    },
    required: [
      'Overall_Fit_Score',
      'Skill_Gaps',
      'Headline_Suggestion',
      'Tailored_Summary',
      'Recommended_Achievement_IDs',
      'Cover_Letter_Draft',
      'KSC_Responses_Drafts',
      'Resume_Audit',
      'Cover_Letter_Audit',
    ],
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
      temperature: 0.7,
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
      tools: [{ googleSearch: {} }],
    },
  });

  const jsonString = response.text;
  if (!jsonString) throw new Error('Empty response from Gemini');
  return JSON.parse(jsonString) as MatchAnalysis;
};
