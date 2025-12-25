/**
 * Runtime configuration profiles for Firebase Functions
 *
 * This file defines standardized resource allocations for different function types.
 * Using these profiles ensures consistent performance and cost optimization across all functions.
 *
 * Usage:
 * ```typescript
 * import { RUNTIME_CONFIGS } from './config/runtime.config';
 *
 * export const myFunction = functions
 *   .runWith(RUNTIME_CONFIGS.lightweightApi)
 *   .https.onRequest(async (req, res) => {
 *     // ... function logic
 *   });
 * ```
 */

import { RuntimeOptions } from "firebase-functions";

/**
 * Lightweight API operations (CRUD, simple Firestore queries)
 * - Create/Read/Update/Delete operations
 * - Simple Firestore queries
 * - Authentication validation
 * - Basic data transformations
 *
 * Expected execution time: < 1s
 * Memory usage: 30-80MB
 */
export const lightweightApi: RuntimeOptions = {
  region: "us-central1",
  memory: "128MB",
  timeoutSeconds: 10,
  maxInstances: 100,
};

/**
 * Medium complexity API operations
 * - Bulk updates
 * - Complex Firestore queries
 * - Data aggregation
 * - Multiple service calls
 *
 * Expected execution time: 1-5s
 * Memory usage: 80-150MB
 */
export const mediumApi: RuntimeOptions = {
  region: "us-central1",
  memory: "256MB",
  timeoutSeconds: 30,
  maxInstances: 50,
};

/**
 * Heavy API operations (PDF/DOCX generation, file processing)
 * - PDF document generation
 * - DOCX document generation
 * - Image processing
 * - Large file uploads
 *
 * Expected execution time: 5-30s
 * Memory usage: 150-400MB
 */
export const heavyApi: RuntimeOptions = {
  region: "us-central1",
  memory: "512MB",
  timeoutSeconds: 60,
  maxInstances: 10,
};

/**
 * AI/ML processing operations (Genkit flows, embeddings, vector search)
 * - AI model inference
 * - Text embeddings generation
 * - Vector similarity search
 * - Large dataset processing
 *
 * Expected execution time: 10-120s
 * Memory usage: 400-800MB
 *
 * Note: Set minInstances: 1 during peak hours to reduce cold starts
 */
export const aiProcessing: RuntimeOptions = {
  region: "us-central1",
  memory: "1GB",
  timeoutSeconds: 180,
  maxInstances: 5,
  minInstances: 0, // Change to 1 during peak hours (9am-5pm)
};

/**
 * User cleanup operations (Firestore recursive delete + Storage cleanup)
 * - User data deletion
 * - Storage cleanup
 * - Batch deletions
 *
 * Expected execution time: 5-60s
 * Memory usage: 100-200MB
 */
export const userCleanup: RuntimeOptions = {
  region: "us-central1",
  memory: "256MB",
  timeoutSeconds: 60,
  maxInstances: 10,
};

/**
 * Background task processing (Job queues, scheduled tasks)
 * - Async job processing
 * - Scheduled maintenance
 * - Batch operations
 *
 * Expected execution time: 30-180s
 * Memory usage: 200-500MB
 */
export const backgroundTask: RuntimeOptions = {
  region: "us-central1",
  memory: "512MB",
  timeoutSeconds: 120,
  maxInstances: 10,
  minInstances: 0,
};

/**
 * Export all configurations as a single object for convenience
 */
export const RUNTIME_CONFIGS = {
  lightweightApi,
  mediumApi,
  heavyApi,
  aiProcessing,
  userCleanup,
  backgroundTask,
} as const;

/**
 * Helper function to create custom runtime configuration
 *
 * @param baseConfig - Base configuration to extend
 * @param overrides - Custom overrides
 * @returns Merged runtime configuration
 */
export function createCustomConfig(
  baseConfig: RuntimeOptions,
  overrides: Partial<RuntimeOptions>,
): RuntimeOptions {
  return {
    ...baseConfig,
    ...overrides,
  };
}

/**
 * Peak hours configuration (keeps instances warm)
 * Use this for critical functions during business hours
 */
export function withPeakHoursWarmup(config: RuntimeOptions): RuntimeOptions {
  return {
    ...config,
    minInstances: 1,
  };
}

/**
 * Cost-optimized configuration (aggressive scaling down)
 * Use this for low-traffic, non-critical functions
 */
export function withCostOptimization(config: RuntimeOptions): RuntimeOptions {
  return {
    ...config,
    minInstances: 0,
    maxInstances: Math.min(config.maxInstances || 10, 10),
  };
}
