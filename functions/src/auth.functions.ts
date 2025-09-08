import * as functions from 'firebase-functions';
import {db, storage} from './firebase';

/**
 * @typedef {Object} StorageFile
 * @property {() => Promise<[unknown]>} delete
 * @property {string} name
 */

/**
 * @typedef {Object} CleanupRequest
 * @property {{ uid: string }} data
 * @property {{ uid: string, token: { admin?: boolean } }} [auth]
 */

/**
 * Callable function to cleanup user data when a user account is deleted.
 * This should be called from the client after user deletion.
 */
export const cleanupUserData = functions.https.onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 60,
    memory: '256MiB',
  },
  /** @type {CleanupRequest} */
  async (request) => {
    const {uid} = request.data;
    const {auth} = request;

    // Verify the request is authenticated and from the same user or admin
    if (!auth || (auth.uid !== uid && !auth.token.admin)) {
      throw new Error('Unauthorized: Cannot cleanup data for different user');
    }

    console.log(`Starting cleanup for user: ${uid}`);

    try {
      // 1. Delete the user's document from Firestore
      const userDocRef = db.collection('users').doc(uid);
      await db.recursiveDelete(userDocRef);
      console.log(`Successfully deleted Firestore data for user: ${uid}`);

      // 2. Delete user's files from Storage
      const bucket = storage.bucket();
      const [files] = await bucket.getFiles({
        prefix: `users/${uid}/`
      });

      const deletePromises = files.map((/** @type {StorageFile} */ file) => {
        console.log(`Deleting file: ${file.name}`);
        return file.delete();
      });

      await Promise.all(deletePromises);
      console.log(`Successfully deleted ${files.length} storage files for user: ${uid}`);

      return {
        success: true,
        message: `Successfully cleaned up data for user ${uid}`,
        deletedFiles: files.length
      };

    } catch (error) {
      console.error(`Error cleaning up user data for ${uid}:`, error);
      throw error; // Re-throw to mark the function as failed
    }
  }
);

/**
 * @typedef {Object} AdminRequest
 * @property {string} method
 * @property {Object} headers
 * @property {string} [headers.authorization]
 * @property {{ uid: string, adminKey: string }} body
 */

/**
 * @typedef {Object} Response
 * @property {(code: number) => ({ json: (data: any) => void, send: (data: string) => void })} status
 * @property {(data: string) => void} send
 */

/**
 * HTTP endpoint for admin user cleanup operations
 */
export const adminCleanupUser = functions.https.onRequest(
  {
    region: 'us-central1',
    timeoutSeconds: 60,
    memory: '256MiB',
    invoker: 'public', // Allow unauthenticated requests (we'll handle auth in the function)
  },
  /** @type {AdminRequest} */
  /** @type {Response} */
  async (request, response) => {
    try {
      // Only allow POST requests
      if (request.method !== 'POST') {
        response.status(405).json({error: 'Method not allowed'});
        return;
      }

      // Check for Authorization header
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        response.status(401).json({error: 'Unauthorized: Missing or invalid Authorization header'});
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      // In a real implementation, verify the token here
      // For now, we'll just check if it matches the expected admin key
      const expectedAdminKey = process.env.ADMIN_CLEANUP_KEY || 'default-admin-key';
      if (token !== expectedAdminKey) {
        response.status(403).json({error: 'Forbidden: Invalid admin key'});
        return;
      }

      const {uid, adminKey} = request.body;

      // Verify admin key (in production, use proper authentication)
      if (!adminKey || adminKey !== process.env.ADMIN_CLEANUP_KEY) {
        response.status(401).json({error: 'Unauthorized'});
        return;
      }

      if (!uid) {
        response.status(400).json({error: 'Missing uid parameter'});
        return;
      }

      console.log(`Admin cleanup requested for user: ${uid}`);

      // 1. Delete the user's document from Firestore
      const userDocRef = db.collection('users').doc(uid);
      await db.recursiveDelete(userDocRef);
      console.log(`Successfully deleted Firestore data for user: ${uid}`);

      // 2. Delete user's files from Storage
      const bucket = storage.bucket();
      const [files] = await bucket.getFiles({
        prefix: `users/${uid}/`
      });

      const deletePromises = files.map((/** @type {StorageFile} */ file) => {
        console.log(`Deleting file: ${file.name}`);
        return file.delete();
      });

      await Promise.all(deletePromises);
      console.log(`Successfully deleted ${files.length} storage files for user: ${uid}`);

      response.status(200).json({
        success: true,
        message: `Successfully cleaned up data for user ${uid}`,
        deletedFiles: files.length
      });

    } catch (error) {
      console.error('Error in admin cleanup:', error);
      response.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);
