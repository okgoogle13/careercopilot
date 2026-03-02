// @ts-expect-error - TS2497: esModuleInterop is enabled, but TypeScript 5.9 still complains about namespace import
import * as functions from 'firebase-functions';
// @ts-expect-error - TS2497: esModuleInterop is enabled, but TypeScript 5.9 still complains about namespace import
import * as admin from 'firebase-admin';
import {getStorage} from 'firebase-admin/storage';

/**
 * uploadAndTag
 *
 * Callable Firebase Function that accepts a base64-encoded file,
 * uploads it to Cloud Storage, and creates a tagged Firestore document.
 *
 * Request payload:
 *   {
 *     filename: string        – e.g. "resume.pdf"
 *     mimeType: string        – e.g. "application/pdf"
 *     base64Content: string   – base64 encoded file bytes
 *     tags?: string[]         – optional caller-supplied tags
 *   }
 *
 * Returns:
 *   { fileId, storagePath, downloadUrl, tags }
 */
export const uploadAndTag = functions.https.onCall(
  async (
    data: {
      filename: string;
      mimeType: string;
      base64Content: string;
      tags?: string[];
    },
    context: functions.https.CallableContext
  ) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'You must be logged in to upload files.'
      );
    }

    const {filename, mimeType, base64Content, tags = []} = data;

    if (!filename || !mimeType || !base64Content) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'filename, mimeType and base64Content are required.'
      );
    }

    const userId = context.auth.uid;
    const fileId = admin.firestore().collection('_').doc().id;
    const storagePath = `users/${userId}/uploads/${fileId}/${filename}`;

    // Auto-tag based on MIME type
    const mimeTag = mimeType.startsWith('image/')
      ? 'image'
      : mimeType === 'application/pdf'
      ? 'pdf'
      : mimeType.includes('word')
      ? 'document'
      : 'other';

    const allTags = Array.from(new Set([mimeTag, ...tags]));

    // Upload to Cloud Storage
    const bucket = getStorage().bucket();
    const file = bucket.file(storagePath);
    const buffer = Buffer.from(base64Content, 'base64');

    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
        metadata: {uploadedBy: userId, fileId},
      },
    });

    // Make the file readable (users read their own files via signed URLs)
    const [downloadUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Store metadata in Firestore
    const docData = {
      fileId,
      userId,
      filename,
      mimeType,
      storagePath,
      downloadUrl,
      tags: allTags,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await admin.firestore().collection('uploads').doc(fileId).set(docData);

    return {fileId, storagePath, downloadUrl, tags: allTags};
  }
);
