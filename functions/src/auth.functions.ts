/**
 * @file Defines Firebase Functions related to user authentication and data cleanup.
 *
 * This module contains cloud functions that handle the lifecycle of user data.
 * This includes cleaning up a user's associated data from Firestore and Cloud Storage
 * when their account is deleted. It provides both a client-callable function and a
 * secure admin endpoint for these operations.
 */
import functions from "firebase-functions";
import { db, storage } from "./firebase";
import { logger } from "firebase-functions";

/**
 * A client-callable function to clean up all data associated with a user account.
 * This function is designed to be called from the client-side application right after
 * a user has been successfully deleted from Firebase Authentication.
 *
 * It performs a recursive delete on the user's main document in Firestore and
 * deletes all files within their dedicated folder in Cloud Storage.
 *
 * @param {object} data - The data object passed from the client.
 * @param {string} data.uid - The UID of the user whose data needs to be cleaned up.
 * @param {functions.https.CallableContext} context - The context of the function call.
 *   It contains metadata about the request, including authentication information.
 *
 * @throws {functions.https.HttpsError} Throws an 'unauthenticated' error if the user
 *   is not logged in, or a 'permission-denied' error if a user tries to delete
 *   another user's data without admin privileges.
 *
 * @returns {Promise<{success: boolean, message: string, deletedFiles: number}>}
 *   A promise that resolves with an object indicating the success of the operation,
 *   a confirmation message, and the number of files deleted from storage.
 */
export const cleanupUserData = functions.https.onCall(
  {
    region: "us-central1",
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (data, context) => {
    const { uid } = data;
    const { auth } = context;

    // Verify the request is authenticated and from the same user or an admin.
    if (!auth || (auth.uid !== uid && !auth.token.admin)) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "You are not authorized to perform this action."
      );
    }

    logger.info(`Starting data cleanup for user: ${uid}`);

    try {
      // 1. Delete the user's entire document tree from Firestore.
      const userDocRef = db.collection("users").doc(uid);
      await db.recursiveDelete(userDocRef);
      logger.info(`Successfully deleted all Firestore data for user: ${uid}`);

      // 2. Delete all of the user's files from Cloud Storage.
      const bucket = storage.bucket();
      const [files] = await bucket.getFiles({ prefix: `users/${uid}/` });

      const deletePromises = files.map((file) => {
        logger.info(`Deleting storage file: ${file.name}`);
        return file.delete();
      });

      await Promise.all(deletePromises);
      logger.info(`Successfully deleted ${files.length} storage files for user: ${uid}`);

      return {
        success: true,
        message: `Successfully cleaned up all data for user ${uid}`,
        deletedFiles: files.length,
      };
    } catch (error) {
      logger.error(`Error cleaning up user data for ${uid}:`, error);
      throw new functions.https.HttpsError(
        "internal",
        "An error occurred while cleaning up user data.",
        error
      );
    }
  }
);


/**
 * A secure HTTP endpoint for administrators to trigger a user's data cleanup.
 * This function is protected and requires a valid bearer token (an admin key)
 * in the Authorization header. It performs the same cleanup operations as
 * `cleanupUserData`.
 *
 * @param {functions.https.Request} request - The HTTP request object. The request
 *   body must be JSON and include a `uid` of the user to be cleaned up.
 * @param {functions.Response} response - The HTTP response object.
 *
 * @returns {void} Sends a JSON response indicating success or failure.
 */
export const adminCleanupUser = functions.https.onRequest(
  {
    region: "us-central1",
    timeoutSeconds: 60,
    memory: "256MiB",
    invoker: "public",
  },
  async (request, response) => {
    try {
      if (request.method !== "POST") {
        response.status(405).json({ error: "Method Not Allowed" });
        return;
      }

      // Check for and validate the admin authorization key.
      const authHeader = request.headers.authorization;
      const expectedAdminKey = process.env.ADMIN_CLEANUP_KEY;
      if (!expectedAdminKey) {
        logger.error("ADMIN_CLEANUP_KEY is not set in environment variables.");
        response.status(500).json({ error: "Server configuration error." });
        return;
      }
      if (!authHeader || authHeader !== `Bearer ${expectedAdminKey}`) {
        response.status(403).json({ error: "Forbidden: Invalid admin key." });
        return;
      }

      const { uid } = request.body;
      if (!uid) {
        response.status(400).json({ error: "Bad Request: Missing 'uid' in request body." });
        return;
      }

      logger.info(`Admin-initiated cleanup requested for user: ${uid}`);

      // Perform the same cleanup logic as the callable function.
      const userDocRef = db.collection("users").doc(uid);
      await db.recursiveDelete(userDocRef);
      logger.info(`Admin successfully deleted Firestore data for user: ${uid}`);

      const bucket = storage.bucket();
      const [files] = await bucket.getFiles({ prefix: `users/${uid}/` });
      const deletePromises = files.map((file) => file.delete());
      await Promise.all(deletePromises);
      logger.info(`Admin successfully deleted ${files.length} storage files for user: ${uid}`);

      response.status(200).json({
        success: true,
        message: `Successfully cleaned up data for user ${uid}`,
        deletedFiles: files.length,
      });
    } catch (error) {
      logger.error("Error in adminCleanupUser function:", error);
      response.status(500).json({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    }
  }
);
