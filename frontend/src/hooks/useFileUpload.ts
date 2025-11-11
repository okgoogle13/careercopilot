import { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const useFileUpload = (file: File | null, userId: string) => {
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!file || !userId) {
      return;
    }

    const storage = getStorage();
    const fileId = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `/uploads/${userId}/${fileId}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const unsubscribe = uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        setError(error);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setDownloadURL(url);
        } catch (e: any) {
          setError(e);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [file, userId]);

  return { progress, downloadURL, error };
};

export default useFileUpload;