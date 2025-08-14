const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();

/**
 * Triggered when a user is deleted from Firebase Authentication.
 * This function handles the cleanup of all user-related data.
 */
exports.cleanupUserData = functions.auth.user().onDelete(async (user) => {
  const { uid } = user;
  
  functions.logger.log(`Starting cleanup for user: ${uid}`);

  // 1. Delete the user's document from Firestore.
  // This uses a recursive delete, which is necessary for sub-collections.
  // Note: For very large sub-collections, a more robust solution might
  // involve a batched write or a dedicated extension, but this is
  // sufficient for most use cases.
  const userDocRef = db.collection("users").doc(uid);
  try {
    await db.recursiveDelete(userDocRef);
    functions.logger.log(`Successfully deleted Firestore data for user: ${uid}`);
  } catch (error) {
    functions.logger.error(`Error deleting Firestore data for user ${uid}:`, error);
  }

  // 2. Delete all files from the user's directory in Cloud Storage.
  const bucket = storage.bucket();
  const userStoragePath = `users/${uid}/`;
  
  try {
    await bucket.deleteFiles({
      prefix: userStoragePath,
    });
    functions.logger.log(`Successfully deleted Cloud Storage files for user: ${uid}`);
  } catch (error) {
    // It's possible the user has no files, so we check for specific errors.
    if (error.code === 404) {
      functions.logger.log(`No Cloud Storage files to delete for user: ${uid}`);
    } else {
      functions.logger.error(`Error deleting Cloud Storage files for user ${uid}:`, error);
    }
  }

  return null;
});
