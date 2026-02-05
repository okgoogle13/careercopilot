import admin from "firebase-admin";
import functions from "firebase-functions";
import {JobListingExtractor} from "./services/job_listing_extractor";
// // import { onFlow } from "@genkit-ai/firebase"; // Imported implicitly where needed or if we need to configure flow explicitly
// import { ai } from "./genkit"; // Imported implicitly where needed or if we need to configure flow explicitly

// Initialize Firebase Admin
admin.initializeApp();

// Genkit is initialized in ./genkit.ts and used by services

// Initialize services
const jobListingExtractor = new JobListingExtractor();

// Core services
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
      );
    }

    try {
      // Create a new job document in Firestore
      const jobRef = await admin.firestore().collection("jobProcesses").add({
        status: "pending",
        source: data.source,
        createdBy: context.auth.uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

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
      await admin.firestore().collection("jobProcesses").doc(jobId).update({
        status: "completed",
        result: result,
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {success: true, jobId};
    } catch (error) {
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

/**
 * Extract job listing from text or URL
 */
export const extractJobListing = functions.https.onCall(
  async (data: { source: string | { url: string } }, context: functions.https.CallableContext) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
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
      console.error("Error extracting job listing:", error);
      throw new functions.https.HttpsError("internal", "Failed to extract job listing", error);
    }
  },
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
    context: functions.https.CallableContext,
  ) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    try {
      const results = await jobListingExtractor.findSimilar({
        query: data.query,
        limit: data.limit || 5,
        minScore: data.minScore || 0.7,
        filters: data.filters || {},
      });
      return {success: true, data: results};
    } catch (error) {
      console.error("Error finding similar listings:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to find similar job listings",
        error,
      );
    }
  },
);
