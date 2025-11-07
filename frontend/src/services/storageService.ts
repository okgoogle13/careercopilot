import { storage } from '../firebase-config';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';

export const uploadFile = async (file: File, path: string) => {
  const MAX_BYTES = 5 * 1024 * 1024; // 5 MB limit
  if (file.size > MAX_BYTES) {
    throw new Error('File is too large. Maximum allowed size is 5 MB.');
  }
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Handle progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        // Handle error
        console.error('Upload failed:', error);
        reject(error);
      },
      async () => {
        // Handle successful upload
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          console.error('Error getting download URL:', error);
          reject(error);
        }
      }
    );
  });
};

export const deleteFile = async (path: string) => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

export const listFiles = async (path: string) => {
  const storageRef = ref(storage, path);
  const result = await listAll(storageRef);
  return result.items;
};

export const getFileURL = async (path: string) => {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
};
