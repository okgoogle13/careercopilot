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
};
