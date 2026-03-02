<<<<<<< HEAD

// import { storage } from '../config/firebase';
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';

export const uploadFile = async (_file: File, _path: string) => {
  console.warn("Storage not implemented in Supabase migration yet.");
  return "https://placeholder.url/file.pdf";
};

export const deleteFile = async (_path: string) => {
  console.warn("Storage delete not implemented.");
};

export const listFiles = async (_path: string) => {
  console.warn("Storage list not implemented.");
  return [];
};

export const getFileURL = async (_path: string) => {
  console.warn("Storage getURL not implemented.");
  return "https://placeholder.url/file.pdf";
=======
import { supabase } from '../config/supabase';

const BUCKET_NAME = 'user_assets';

export const uploadFile = async (file: File, path: string) => {
  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });

  if (error) {
    throw error;
  }

  // Generate public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

  return publicUrl;
};

export const deleteFile = async (path: string) => {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

  if (error) {
    throw error;
  }
};

export const listFiles = async (path: string) => {
  const { data, error } = await supabase.storage.from(BUCKET_NAME).list(path);

  if (error) {
    throw error;
  }

  return data || [];
};

export const getFileURL = async (path: string) => {
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

  return publicUrl;
>>>>>>> restoration-KR-Rage-Figma-v2.0
};
