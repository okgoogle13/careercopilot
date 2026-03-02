// @ts-expect-error - TS2497: esModuleInterop namespace import required for firebase-functions
import * as functions from 'firebase-functions';
// @ts-expect-error - TS2497: esModuleInterop namespace import required for firebase-admin
import * as admin from 'firebase-admin';
import { JobListingExtractor } from './services/job_listing_extractor';

const jobListingExtractor = new JobListingExtractor();

/**
 * extractAndSave
 *
 * Callable Firebase Function that extracts a structured JobListing from raw
 * text or a URL, then saves it to Firestore `jobListings/{id}`.
 *
 * Request payload:
 *   {
 *     source: string | { url: string }  – raw job listing text, or URL to scrape
 *     options?: {
 *       extractSkills?: boolean    (default: true)
 *       extractSalary?: boolean    (default: true)
 *       extractLocation?: boolean  (default: true)
 *     }
 *   }
 *
 * Returns:
 *   { success: true, jobId: string, data: JobListing }
 */
export const extractAndSave = functions.https.onCall(
  async (
    data: {
      source: string | { url: string };
      options?: {
        extractSkills?: boolean;
        extractSalary?: boolean;
        extractLocation?: boolean;
      };
    },
    context: functions.https.CallableContext
  ) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'You must be logged in to extract and save job listings.'
      );
    }

    if (!data.source) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'source (text or { url }) is required.'
      );
    }

    try {
      // Run the Genkit extraction flow
      const jobListing = await jobListingExtractor.extract({
        source: data.source,
        options: {
          extractSkills: data.options?.extractSkills ?? true,
          extractSalary: data.options?.extractSalary ?? true,
          extractLocation: data.options?.extractLocation ?? true,
        },
      });

      // Persist to Firestore with user context
      const docRef = admin.firestore().collection('jobListings').doc(jobListing.id);
      await docRef.set({
        ...jobListing,
        savedBy: context.auth.uid,
        savedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { success: true, jobId: jobListing.id, data: jobListing };
    } catch (error) {
      console.error('[extractAndSave] Error:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to extract and save job listing.',
        error instanceof Error ? error.message : String(error)
      );
    }
  }
);
