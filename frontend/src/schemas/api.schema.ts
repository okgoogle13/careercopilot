import { z } from 'zod';
import { contextTagsSchema } from './asset.schema'; // Import from our new asset schema file

/**
 * AI-suggested contextual tags from the Context Tagger flow.
 * Corresponds to Pydantic's SuggestedTags.
 */
export const suggestedTagsSchema = z.object({
  roleType: z.string().describe('AI-suggested primary role type'),
  subsectors: z.array(z.string()).default([]).describe('AI-suggested industry subsectors'),
  confidence: z.number().min(0).max(1).default(0).describe('Confidence score for the suggestions'),
});
export type SuggestedTags = z.infer<typeof suggestedTagsSchema>;

/**
 * Response from the /upload-and-tag endpoint.
 * Corresponds to Pydantic's UploadAndTagResponse.
 */
export const uploadAndTagResponseSchema = z.object({
  suggestedTags: suggestedTagsSchema,
  fileId: z.string(),
  fileName: z.string(),
  fileType: z.string(),
  fileSizeBytes: z.number().int(),
});
export type UploadAndTagResponse = z.infer<typeof uploadAndTagResponseSchema>;

/**
 * Request body for the /extract-and-save endpoint.
 * Corresponds to Pydantic's ExtractAndSaveRequest.
 */
export const extractAndSaveRequestSchema = z.object({
  fileId: z.string(),
  confirmedTags: contextTagsSchema,
  documentType: z.enum(['resume', 'ksc', 'voice']),
});
export type ExtractAndSaveRequest = z.infer<typeof extractAndSaveRequestSchema>;

/**
 * Response from the /extract-and-save endpoint.
 * Corresponds to Pydantic's ExtractAndSaveResponse.
 */
export const extractAndSaveResponseSchema = z.object({
  status: z.enum(['success', 'error']),
  assetId: z.string(),
  message: z.string(),
});
export type ExtractAndSaveResponse = z.infer<typeof extractAndSaveResponseSchema>;

/**
 * Standard error response for ingestion endpoints.
 * Corresponds to Pydantic's IngestionErrorResponse.
 */
export const ingestionErrorResponseSchema = z.object({
  status: z.literal('error').default('error'),
  error: z.string(),
  message: z.string(),
  details: z.record(z.any()).default({}),
});
export type IngestionErrorResponse = z.infer<typeof ingestionErrorResponseSchema>;
