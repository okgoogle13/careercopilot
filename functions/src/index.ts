<<<<<<< HEAD
import admin from 'firebase-admin';
// @ts-expect-error - TS2497: esModuleInterop is enabled, but TypeScript 5.9 still complains about namespace import
import * as functions from 'firebase-functions';
import {JobListingExtractor} from './services/job_listing_extractor';
=======
import admin from "firebase-admin";
import functions from "firebase-functions";
import {JobListingExtractor} from "./services/job_listing_extractor";
// // import { onFlow } from "@genkit-ai/firebase"; // Imported implicitly where needed or if we need to configure flow explicitly
// import { ai } from "./genkit"; // Imported implicitly where needed or if we need to configure flow explicitly
>>>>>>> restoration-KR-Rage-Figma-v2.0

// Initialize Firebase Admin
admin.initializeApp();

<<<<<<< HEAD
// Genkit configuration is handled in ./genkit.ts
=======
// Genkit is initialized in ./genkit.ts and used by services
>>>>>>> restoration-KR-Rage-Figma-v2.0

// Initialize services
const jobListingExtractor = new JobListingExtractor();

// Core services
<<<<<<< HEAD
export {uploadAndTag} from "./uploadAndTag";
export {extractAndSave} from "./extractAndSave";
export {healthCheck} from "./healthCheck";


// Background processing functions
export const enqueueJobProcessing = functions.https.onCall(
  async (
    data: { source: string | { url: string } },
    context: functions.https.CallableContext
  ) => {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'You must be logged in to process job listings.'
=======
// export { extractAndSave } from "./extractAndSave";
// export { healthCheck } from "./healthCheck";
// export { uploadAndTag } from "./uploadAndTag";

// Background processing functions
export const enqueueJobProcessing = functions.https.onCall(
  async (data: { source: string | { url: string } }, context: functions.https.CallableContext) => {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be logged in to process job listings.",
>>>>>>> restoration-KR-Rage-Figma-v2.0
      );
    }

    try {
      // Create a new job document in Firestore
<<<<<<< HEAD
      const jobRef = await admin.firestore().collection('jobProcesses').add({
        status: 'pending',
=======
      const jobRef = await admin.firestore().collection("jobProcesses").add({
        status: "pending",
>>>>>>> restoration-KR-Rage-Figma-v2.0
        source: data.source,
        createdBy: context.auth.uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

<<<<<<< HEAD
      // Process immediately (simplified version - TODO: add Cloud Tasks integration)
      const result = await jobListingExtractor.extract({
        source: data.source,
        options: {
          extractSkills: true,
          extractSalary: true,
          extractLocation: true,
        },
      });

      await jobRef.update({
        status: 'completed',
        result: result,
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {success: true, jobId: jobRef.id, result};
    } catch (error) {
      console.error('Error processing job listing:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to process job listing',
        error
      );
    }
  }
);

export const processJobListing = functions.https.onCall(
  async (
    data: { jobId: string; source: string | { url: string } },
    context: functions.https.CallableContext
  ) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

=======
      // Enqueue the background task
      await processJobListing.enqueue({
        jobId: jobRef.id,
        source: data.source,
      });

      return {success: true, jobId: jobRef.id};
    } catch (error) {
      console.error("Error enqueuing job processing:", error);
      throw new functions.https.HttpsError("internal", "Failed to enqueue job processing", error);
    }
  },
);

export const processJobListing = functions.tasks
  .taskQueue({
    retryConfig: {
      maxAttempts: 5,
      minBackoffSeconds: 60,
      maxBackoutSeconds: 600,
      maxDoublings: 3,
    },
    rateLimits: {
      maxConcurrentDispatches: 10,
    },
  })
  .onDispatch(async (data: { jobId: string; source: string | { url: string } }) => {
>>>>>>> restoration-KR-Rage-Figma-v2.0
    try {
      const {jobId, source} = data;
      const result = await jobListingExtractor.extract({
        source,
        options: {
          extractSkills: true,
          extractSalary: true,
          extractLocation: true,
        },
      });

      // Update the job status in Firestore
<<<<<<< HEAD
      await admin.firestore().collection('jobProcesses').doc(jobId).update({
        status: 'completed',
=======
      await admin.firestore().collection("jobProcesses").doc(jobId).update({
        status: "completed",
>>>>>>> restoration-KR-Rage-Figma-v2.0
        result: result,
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {success: true, jobId};
    } catch (error) {
<<<<<<< HEAD
      console.error('Error processing job listing:', error);

      // Update the job status with error
      if (data.jobId) {
        await admin.firestore().collection('jobProcesses').doc(data.jobId).update({
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          failedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      throw new functions.https.HttpsError(
        'internal',
        'Failed to process job listing',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }
);

// Application API endpoints
export {
  createApplication,
  listApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  bulkUpdateApplications,
  scheduleInterview,
  exportApplications
} from './api/applications.controller';
=======
      console.error("Error processing job listing:", error);

      // Update the job status with error
      if (data.jobId) {
        await admin
          .firestore()
          .collection("jobProcesses")
          .doc(data.jobId)
          .update({
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
            failedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
      }

      throw new functions.https.HttpsError("internal", "Failed to process job listing", error);
    }
  });

// Application API endpoints
export {
  bulkUpdateApplications,
  createApplication,
  deleteApplication,
  exportApplications,
  getApplication,
  listApplications,
  scheduleInterview,
  updateApplication,
} from "./api/applications.controller";
>>>>>>> restoration-KR-Rage-Figma-v2.0

/**
 * Extract job listing from text or URL
 */
export const extractJobListing = functions.https.onCall(
<<<<<<< HEAD
  async (
    data: { source: string | { url: string } },
    context: functions.https.CallableContext
  ) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
=======
  async (data: { source: string | { url: string } }, context: functions.https.CallableContext) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
>>>>>>> restoration-KR-Rage-Figma-v2.0
    }
    try {
      const result = await jobListingExtractor.extract({
        source: data.source,
        options: {
          extractSkills: true,
          extractSalary: true,
          extractLocation: true,
        },
      });
      return {success: true, data: result};
    } catch (error) {
<<<<<<< HEAD
      console.error('Error extracting job listing:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to extract job listing',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }
=======
      console.error("Error extracting job listing:", error);
      throw new functions.https.HttpsError("internal", "Failed to extract job listing", error);
    }
  },
>>>>>>> restoration-KR-Rage-Figma-v2.0
);

/**
 * Find similar job listings
 */
export const findSimilarListings = functions.https.onCall(
  async (
    data: {
      query: string | Record<string, unknown>;
      limit?: number;
      minScore?: number;
      filters?: Record<string, unknown>;
    },
<<<<<<< HEAD
    context: functions.https.CallableContext
  ) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    try {
      const results = await jobListingExtractor.findSimilar({
        query: data.query as any,
=======
    context: functions.https.CallableContext,
  ) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    try {
      const results = await jobListingExtractor.findSimilar({
        query: data.query,
>>>>>>> restoration-KR-Rage-Figma-v2.0
        limit: data.limit || 5,
        minScore: data.minScore || 0.7,
        filters: data.filters || {},
      });
      return {success: true, data: results};
    } catch (error) {
<<<<<<< HEAD
      console.error('Error finding similar listings:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to find similar job listings',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }
=======
      console.error("Error finding similar listings:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to find similar job listings",
        error,
      );
    }
  },
>>>>>>> restoration-KR-Rage-Figma-v2.0
);
