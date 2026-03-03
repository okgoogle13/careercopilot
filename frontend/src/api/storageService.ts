import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from '../config/firebase';

const BUCKET_NAME = 'user_assets';

export const uploadFile = async (file: File, path: string) => {
  const fileRef = ref(storage, `${BUCKET_NAME}/${path}`);
  await uploadBytes(fileRef, file);
  
  const publicUrl = await getDownloadURL(fileRef);
  return publicUrl;
};

export const deleteFile = async (path: string) => {
  const fileRef = ref(storage, `${BUCKET_NAME}/${path}`);
  await deleteObject(fileRef);
};

export const listFiles = async (path: string) => {
  const listRef = ref(storage, `${BUCKET_NAME}/${path}`);
  const res = await listAll(listRef);
  
  return res.items.map(item => ({
    name: item.name,
    path: item.fullPath
  }));
};

export const getFileURL = async (path: string) => {
  const fileRef = ref(storage, `${BUCKET_NAME}/${path}`);
  return await getDownloadURL(fileRef);
};
