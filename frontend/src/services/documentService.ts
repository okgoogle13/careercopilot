import { db, auth } from '@/firebase-config';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { uploadDocument, deleteFile, UploadProgress } from './storageService';

export interface Document {
  id: string;
  userId: string;
  name: string;
  type: 'resume' | 'cover-letter' | 'ksc' | 'portfolio';
  status: 'draft' | 'active' | 'archived';
  storagePath: string;
  downloadURL: string;
  size: number;
  contentType: string;
  atsScore?: number;
  isFavorite: boolean;
  tags: string[];
  lastModified: Date;
  createdAt: Date;
}

interface CreateDocumentData {
  name: string;
  type: 'resume' | 'cover-letter' | 'ksc' | 'portfolio';
  storagePath: string;
  downloadURL: string;
  size: number;
  contentType: string;
  tags?: string[];
}

/**
 * Upload a document and create a Firestore record
 * @param file - The file to upload
 * @param documentType - Type of document
 * @param onProgress - Optional progress callback
 * @returns The created document
 */
export async function uploadAndCreateDocument(
  file: File,
  documentType: 'resume' | 'cover-letter' | 'ksc' | 'portfolio',
  onProgress?: (progress: UploadProgress) => void
): Promise<Document> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be authenticated to upload documents');
  }

  // Upload file to Storage
  const uploadResult = await uploadDocument(file, user.uid, documentType, onProgress);

  // Create Firestore document
  const documentData: CreateDocumentData = {
    name: file.name,
    type: documentType,
    storagePath: uploadResult.fullPath,
    downloadURL: uploadResult.downloadURL,
    size: uploadResult.size,
    contentType: uploadResult.contentType,
    tags: [],
  };

  const docRef = await addDoc(collection(db, 'documents'), {
    ...documentData,
    userId: user.uid,
    status: 'draft',
    isFavorite: false,
    createdAt: serverTimestamp(),
    lastModified: serverTimestamp(),
  });

  const newDoc = await getDoc(docRef);
  return convertFirestoreDoc(docRef.id, newDoc.data());
}

/**
 * Get all documents for the current user
 * @param filters - Optional filters (type, status)
 * @returns Array of documents
 */
export async function getUserDocuments(filters?: {
  type?: string;
  status?: string;
}): Promise<Document[]> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be authenticated');
  }

  let q = query(
    collection(db, 'documents'),
    where('userId', '==', user.uid),
    orderBy('lastModified', 'desc')
  );

  if (filters?.type && filters.type !== 'all') {
    q = query(q, where('type', '==', filters.type));
  }

  if (filters?.status && filters.status !== 'all') {
    q = query(q, where('status', '==', filters.status));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => convertFirestoreDoc(doc.id, doc.data()));
}

/**
 * Get a single document by ID
 * @param documentId - The document ID
 * @returns The document
 */
export async function getDocument(documentId: string): Promise<Document> {
  const docRef = doc(db, 'documents', documentId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Document not found');
  }

  return convertFirestoreDoc(docSnap.id, docSnap.data());
}

/**
 * Update a document
 * @param documentId - The document ID
 * @param updates - Fields to update
 */
export async function updateDocument(
  documentId: string,
  updates: Partial<Omit<Document, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(db, 'documents', documentId);
  await updateDoc(docRef, {
    ...updates,
    lastModified: serverTimestamp(),
  });
}

/**
 * Delete a document (both Firestore record and Storage file)
 * @param documentId - The document ID
 */
export async function deleteDocument(documentId: string): Promise<void> {
  const document = await getDocument(documentId);

  // Delete from Storage
  try {
    await deleteFile(document.storagePath);
  } catch (error) {
    console.error('Error deleting file from storage:', error);
    // Continue with Firestore deletion even if storage deletion fails
  }

  // Delete from Firestore
  const docRef = doc(db, 'documents', documentId);
  await deleteDoc(docRef);
}

/**
 * Toggle favorite status
 * @param documentId - The document ID
 */
export async function toggleFavorite(documentId: string): Promise<void> {
  const document = await getDocument(documentId);
  await updateDocument(documentId, { isFavorite: !document.isFavorite });
}

/**
 * Update document status
 * @param documentId - The document ID
 * @param status - New status
 */
export async function updateDocumentStatus(
  documentId: string,
  status: 'draft' | 'active' | 'archived'
): Promise<void> {
  await updateDocument(documentId, { status });
}

/**
 * Add tags to a document
 * @param documentId - The document ID
 * @param tags - Tags to add
 */
export async function addDocumentTags(documentId: string, tags: string[]): Promise<void> {
  const document = await getDocument(documentId);
  const uniqueTags = Array.from(new Set([...document.tags, ...tags]));
  await updateDocument(documentId, { tags: uniqueTags });
}

/**
 * Remove tags from a document
 * @param documentId - The document ID
 * @param tags - Tags to remove
 */
export async function removeDocumentTags(documentId: string, tags: string[]): Promise<void> {
  const document = await getDocument(documentId);
  const updatedTags = document.tags.filter((tag) => !tags.includes(tag));
  await updateDocument(documentId, { tags: updatedTags });
}

/**
 * Convert Firestore document data to Document type
 */
function convertFirestoreDoc(id: string, data: any): Document {
  return {
    id,
    userId: data.userId,
    name: data.name,
    type: data.type,
    status: data.status,
    storagePath: data.storagePath,
    downloadURL: data.downloadURL,
    size: data.size,
    contentType: data.contentType,
    atsScore: data.atsScore,
    isFavorite: data.isFavorite,
    tags: data.tags || [],
    lastModified: data.lastModified instanceof Timestamp ? data.lastModified.toDate() : new Date(),
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
  };
}
