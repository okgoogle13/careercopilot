import { z } from 'zod';

export const AchievementSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the achievement'),
  originalText: z
    .string()
    .describe('The raw text provided by the user or extracted from a document'),
  situation: z.string().optional().describe('The context or background of the achievement'),
  task: z.string().optional().describe('The specific problem or goal'),
  action: z.string().optional().describe('The steps the user took'),
  result: z.string().optional().describe('The quantifiable outcome or impact'),
  metrics: z
    .array(z.string())
    .optional()
    .describe('Specific numbers, percentages, or data points extracted'),
  subtypeTags: z
    .array(z.string())
    .describe("Tags categorizing the achievement, e.g., 'Leadership', 'Cloud Infrastructure'"),
  needsReviewFlag: z
    .boolean()
    .default(true)
    .describe('Set to true if the AI is unsure about the extraction and requires user validation'),
});

export const WorkExperienceSchema = z.object({
  id: z.string().uuid(),
  companyName: z.string().min(1, 'Company name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  location: z.string().optional(),
  startDate: z.string().describe("ISO date string or 'MM/YYYY' format"),
  endDate: z.string().optional().describe("ISO date string, 'MM/YYYY', or 'Present'"),
  isCurrentRole: z.boolean().default(false),
  roleSummary: z.string().optional().describe('A high-level overview of the responsibilities'),
  achievements: z.array(AchievementSchema),
});

export const EducationSchema = z.object({
  id: z.string().uuid(),
  institutionName: z.string().min(1, 'Institution name is required'),
  degreeOrQualification: z.string().min(1, 'Degree or qualification is required'),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  gradeOrGPA: z.string().optional(),
});

export const CertificationSchema = z.object({
  id: z.string().uuid(),
  certificationName: z.string().min(1, 'Certification name is required'),
  issuingOrganization: z.string().min(1, 'Issuing organization is required'),
  issueDate: z.string().optional(),
  expirationDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional(),
});

export const SkillsSchema = z.object({
  hardSkills: z.array(z.string()).describe('Technical or specific industry skills'),
  softSkills: z.array(z.string()).describe('Interpersonal or qualitative skills'),
  toolsAndSoftware: z
    .array(z.string())
    .describe('Specific applications, programming languages, or platforms'),
});

export const SavedDocumentSchema = z.object({
  id: z.string().uuid(),
  jobTitleTarget: z.string(),
  companyTarget: z.string(),
  dateSaved: z.string().describe('ISO date string'),
  documentType: z.enum(['Resume', 'CoverLetter', 'KSC']),
  content: z.string().describe('The text or HTML content of the tailored document'),
});

export const CareerDatabaseSchema = z.object({
  userId: z.string().describe('Reference to the Firebase Auth user ID'),
  lastUpdated: z.string().describe('ISO date string tracking the last modification'),
  personalInfo: z.object({
    fullName: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedinUrl: z.string().url().optional(),
    portfolioUrl: z.string().url().optional(),
  }),
  careerSummary: z.string().optional().describe('The overarching professional summary or bio'),
  workExperience: z.array(WorkExperienceSchema),
  education: z.array(EducationSchema),
  certifications: z.array(CertificationSchema),
  skills: SkillsSchema,
  savedDocuments: z.array(SavedDocumentSchema).optional(),
});

export type CareerDatabase = z.infer<typeof CareerDatabaseSchema>;
export type WorkExperience = z.infer<typeof WorkExperienceSchema>;
export type Achievement = z.infer<typeof AchievementSchema>;
