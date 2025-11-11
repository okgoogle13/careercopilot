import { z } from 'zod';

// ============================================================================
// Schemas from master_profile_schema.py
// ============================================================================

export const personalInfoSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  summary: z.string(),
  linkedin: z.string().url().optional().nullable(),
  portfolio: z.string().url().optional().nullable(),
});
export type PersonalInfo = z.infer<typeof personalInfoSchema>;

export const workExperienceSchema = z.object({
  jobTitle: z.string(),
  company: z.string(),
  location: z.string().optional().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  skillsUsed: z.array(z.string()).default([]),
});
export type WorkExperience = z.infer<typeof workExperienceSchema>;

export const projectSchema = z.object({
  projectName: z.string(),
  description: z.string(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  link: z.string().url().optional().nullable(),
  technologiesUsed: z.array(z.string()).default([]),
});
export type Project = z.infer<typeof projectSchema>;

export const educationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string(),
  notes: z.string().optional().nullable(),
});
export type Education = z.infer<typeof educationSchema>;

export const skillsSchema = z.object({
  technical: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  soft: z.array(z.string()).default([]),
  methodologies: z.array(z.string()).default([]),
});
export type Skills = z.infer<typeof skillsSchema>;

export const keySelectionCriteriaExampleSchema = z.object({
  criteria: z.string(),
  example: z.string(),
  relatedSkills: z.array(z.string()),
});
export type KeySelectionCriteriaExample = z.infer<typeof keySelectionCriteriaExampleSchema>;

export const masterCareerProfileSchema = z.object({
  personalInfo: personalInfoSchema,
  workExperience: z.array(workExperienceSchema).default([]),
  projects: z.array(projectSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: skillsSchema,
  certifications: z.array(z.string()).default([]),
  keySelectionCriteriaExamples: z.array(keySelectionCriteriaExampleSchema).default([]),
});
export type MasterCareerProfile = z.infer<typeof masterCareerProfileSchema>;


// ============================================================================
// Schemas from asset_library_schema.py
// ============================================================================

export const contextTagsSchema = z.object({
  roleType: z.string().min(1, "Role type is required"),
  subsectors: z.array(z.string()).default([]),
});
export type ContextTags = z.infer<typeof contextTagsSchema>;

export const assetMetadataSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  uploadDate: z.string().datetime(),
  storageUri: z.string(),
  fileSizeBytes: z.number().int().optional().nullable(),
});
export type AssetMetadata = z.infer<typeof assetMetadataSchema>;

export const voiceProfileSchema = z.object({
  tone: z.string(),
  style: z.string(),
  vocabularyLevel: z.string(),
  sentenceComplexity: z.string().optional().nullable(),
  preferredPhrasing: z.array(z.string()).default([]),
});
export type VoiceProfile = z.infer<typeof voiceProfileSchema>;

export const assetDocumentSchema = z.object({
  documentType: z.enum(["resume", "ksc", "voice"]),
  extractedData: z.record(z.any()), // Generic base, refined in discriminated union
  tags: contextTagsSchema,
  metadata: assetMetadataSchema,
  schemaVersion: z.string().default("v4"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  userId: z.string(),
});
export type AssetDocument = z.infer<typeof assetDocumentSchema>;


// ============================================================================
// Typed Convenience Schemas
// ============================================================================

export const resumeAssetSchema = assetDocumentSchema.extend({
  documentType: z.literal("resume"),
  extractedData: masterCareerProfileSchema,
});
export type ResumeAsset = z.infer<typeof resumeAssetSchema>;

export const kscAssetSchema = assetDocumentSchema.extend({
  documentType: z.literal("ksc"),
  extractedData: z.object({
    keySelectionCriteriaExamples: z.array(keySelectionCriteriaExampleSchema).optional(),
  }),
});
export type KSCAsset = z.infer<typeof kscAssetSchema>;

export const voiceAssetSchema = assetDocumentSchema.extend({
  documentType: z.literal("voice"),
  extractedData: voiceProfileSchema,
});
export type VoiceAsset = z.infer<typeof voiceAssetSchema>;

/**
 * A discriminated union to handle different asset types safely in TypeScript.
 * This is the primary type you should use when consuming asset data on the frontend.
 */
export const typedAssetDocumentSchema = z.discriminatedUnion("documentType", [
  resumeAssetSchema,
  kscAssetSchema,
  voiceAssetSchema,
]);
export type TypedAssetDocument = z.infer<typeof typedAssetDocumentSchema>;
