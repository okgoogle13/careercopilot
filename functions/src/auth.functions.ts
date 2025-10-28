import functions from "firebase-functions";
import admin from "firebase-admin";
import { db, storage } from "./firebase";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

interface StorageFile {
  name: string;
}

interface CleanupRequestData {
  uid: string;
}

export const cleanupUserData = functions.https.onCall(
  {
    region: "us-central1",
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (data: CleanupRequestData, context: functions.https.CallableContext) => {
    const { uid } = data;
    const { auth } = context;

    if (!auth || (auth.uid !== uid && !auth.token.admin)) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Cannot cleanup data for different user",
      );
    }

    console.log(`Starting cleanup for user: ${uid}`);

    try {
      const userDocRef = db.collection("users").doc(uid);
      await db.recursiveDelete(userDocRef);
      console.log(`Successfully deleted Firestore data for user: ${uid}`);

      const bucket = storage.bucket();
      const [files] = await bucket.getFiles({
        prefix: `users/${uid}/`,
      });

      const deletePromises = files.map((file: StorageFile) => {
        console.log(`Deleting file: ${file.name}`);
        return bucket.file(file.name).delete();
      });

      await Promise.all(deletePromises);
      console.log(`Successfully deleted ${files.length} storage files for user: ${uid}`);

      return {
        success: true,
        message: `Successfully cleaned up data for user ${uid}`,
        deletedFiles: files.length,
      };
    } catch (error) {
      console.error(`Error cleaning up user data for ${uid}:`, error);
      throw new functions.https.HttpsError("internal", "Error cleaning up user data");
    }
  },
);

export const adminCleanupUser = functions.https.onRequest(
  {
    region: "us-central1",
    timeoutSeconds: 60,
    memory: "256MiB",
    invoker: "public",
  },
  async (request: functions.https.Request, response: functions.Response) => {
    try {
      if (request.method !== "POST") {
        response.status(405).json({ error: "Method not allowed" });
        return;
      }

      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        response
          .status(401)
          .json({ error: "Unauthorized: Missing or invalid Authorization header" });
        return;
      }

      const token = authHeader.split("Bearer ")[1];
      const expectedAdminKey = process.env.ADMIN_CLEANUP_KEY || "default-admin-key";
      if (token !== expectedAdminKey) {
        response.status(403).json({ error: "Forbidden: Invalid admin key" });
        return;
      }

      const { uid } = request.body;

      if (!uid) {
        response.status(400).json({ error: "Missing uid parameter" });
        return;
      }

      console.log(`Admin cleanup requested for user: ${uid}`);

      const userDocRef = db.collection("users").doc(uid);
      await db.recursiveDelete(userDocRef);
      console.log(`Successfully deleted Firestore data for user: ${uid}`);

      const bucket = storage.bucket();
      const [files] = await bucket.getFiles({
        prefix: `users/${uid}/`,
      });

      const deletePromises = files.map((file: StorageFile) => {
        console.log(`Deleting file: ${file.name}`);
        return bucket.file(file.name).delete();
      });

      await Promise.all(deletePromises);
      console.log(`Successfully deleted ${files.length} storage files for user: ${uid}`);

      response.status(200).json({
        success: true,
        message: `Successfully cleaned up data for user ${uid}`,
        deletedFiles: files.length,
      });
    } catch (error) {
      console.error("Error in admin cleanup:", error);
      response.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);
