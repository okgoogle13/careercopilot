import type {
  UploadTaskSnapshot,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  type StorageReference,
} from 'firebase/storage';

import { storage } from '@/firebase-config';

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
}

export interface UploadResult {
  downloadURL: string;
  fullPath: string;
  name: string;
  size: number;
  contentType: string;
}

/**
 * Upload a file to Firebase Storage with progress tracking
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'users/{userId}/documents/resume.pdf')
 * @param onProgress - Optional callback for upload progress updates
 * @returns Promise with upload result including download URL
 */
export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type || 'application/octet-stream',
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot): void => {
        const progress = {
          bytesTransferred: snapshot.bytesTransferred,
          totalBytes: snapshot.totalBytes,
          progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        };
        onProgress?.(progress);
      },
      (error: Error): void => {
        console.error('Upload error:', error);
        reject(error);
      },
      async (): Promise<void> => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            downloadURL,
            fullPath: uploadTask.snapshot.ref.fullPath,
            name: uploadTask.snapshot.ref.name,
            size: uploadTask.snapshot.totalBytes,
            contentType: file.type,
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

/**
 * Upload a document for a specific user
 * @param file - The file to upload
 * @param userId - The user's ID
 * @param documentType - Type of document (resume, cover-letter, ksc, portfolio)
 * @param onProgress - Optional callback for progress updates
 * @returns Promise with upload result
 */
export async function uploadDocument(
  file: File,
  userId: string,
  documentType: 'resume' | 'cover-letter' | 'ksc' | 'portfolio',
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `users/${userId}/documents/${documentType}/${timestamp}_${sanitizedFileName}`;

  return uploadFile(file, path, onProgress);
}

/**
 * Delete a file from Firebase Storage
 * @param path - The full path to the file in storage
 */
export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

/**
 * List all files in a directory
 * @param path - The directory path
 * @returns Array of file references
 */
export async function listFiles(path: string): Promise<StorageReference[]> {
  const storageRef = ref(storage, path);
  const result = await listAll(storageRef);
  return result.items;
}

/**
 * Get download URL for a file
 * @param path - The full path to the file in storage
 * @returns The download URL
 */
export async function getFileURL(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}
