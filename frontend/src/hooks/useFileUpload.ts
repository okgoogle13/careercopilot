import { useState, useCallback } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

type UploadState = {
  progress: number;
  downloadURL: string | null;
  error: Error | null;
  isUploading: boolean;
};

type UseFileUploadReturn = [
  (file: File) => Promise<string>,
  UploadState
];

export const useFileUpload = (userId: string): UseFileUploadReturn => {
  const [uploadState, setUploadState] = useState<UploadState>({
    progress: 0,
    downloadURL: null,
    error: null,
    isUploading: false,
  });

  const uploadFile = useCallback(
    async (file: File): Promise<string> => {
      const storage = getStorage();
      const fileId = uuidv4();
      const fileExt = file.name.split('.').pop();
      const storagePath = `uploads/${userId}/${fileId}.${fileExt}`;
      const storageRef = ref(storage, storagePath);

      setUploadState(prev => ({
        ...prev,
        progress: 0,
        downloadURL: null,
        error: null,
        isUploading: true,
      }));

      try {
        // Start the upload
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Set up progress tracking
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadState(prev => ({
              ...prev,
              progress,
            }));
          },
          (error) => {
            setUploadState(prev => ({
              ...prev,
              error,
              isUploading: false,
            }));
            throw error;
          },
          async () => {
            // Upload completed successfully
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setUploadState(prev => ({
                ...prev,
                downloadURL,
                isUploading: false,
              }));
            } catch (error) {
              setUploadState(prev => ({
                ...prev,
                error: error as Error,
                isUploading: false,
              }));
              throw error;
            }
          }
        );

        // Wait for the upload to complete
        await uploadTask;
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      } catch (error) {
        setUploadState(prev => ({
          ...prev,
          error: error as Error,
          isUploading: false,
        }));
        throw error;
      }
    },
    [userId]
  );

  return [uploadFile, uploadState];
};

export default useFileUpload;
