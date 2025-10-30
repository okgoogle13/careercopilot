import type { DocumentData } from 'firebase/firestore';
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
  QueryDocumentSnapshot,
  DocumentSnapshot,
} from 'firebase/firestore';


import type { UploadProgress } from './storageService';
import { uploadDocument, deleteFile } from './storageService';

import { db, auth } from '@/firebase-config';

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
interface DocumentFilters {
  type?: 'resume' | 'cover-letter' | 'ksc' | 'portfolio' | 'all';
  status?: 'draft' | 'active' | 'archived' | 'all';
}

export async function getUserDocuments(filters?: DocumentFilters): Promise<Document[]> {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');

  let q = query(collection(db, 'documents'), where('userId', '==', userId));

  if (filters?.type && filters.type !== 'all') {
    q = query(q, where('type', '==', filters.type));
  }

  if (filters?.status && filters.status !== 'all') {
    q = query(q, where('status', '==', filters.status));
  }

  q = query(q, orderBy('lastModified', 'desc'));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return convertFirestoreDoc(doc.id, data);
  });
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

  const data = docSnap.data();
  return convertFirestoreDoc(docSnap.id, data);
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
interface FirestoreDocumentData {
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
  tags?: string[];
  lastModified: Timestamp | Date;
  createdAt: Timestamp | Date;
}

function convertFirestoreDoc(
  id: string,
  data: FirestoreDocumentData | DocumentData | undefined
): Document {
  if (!data) {
    throw new Error('Document data is undefined');
  }

  // Type assertion with runtime validation
  const docData = data as FirestoreDocumentData;
  return {
    id,
    userId: docData.userId,
    name: docData.name,
    type: docData.type,
    status: docData.status,
    storagePath: docData.storagePath,
    downloadURL: docData.downloadURL,
    size: docData.size,
    contentType: docData.contentType,
    atsScore: docData.atsScore,
    isFavorite: docData.isFavorite,
    tags: docData.tags || [],
    lastModified:
      docData.lastModified instanceof Timestamp ? docData.lastModified.toDate() : new Date(),
    createdAt: docData.createdAt instanceof Timestamp ? docData.createdAt.toDate() : new Date(),
  };
}
