import { useEffect, useState, useCallback } from 'react';
import { saveUserCareerData } from '../services/firebase';
import { CareerDatabase } from '../types';

export const useAutoSave = <T>(
  userId: string | undefined,
  data: T | null,
  saveFn: (data: T) => Promise<void>,
  delay = 2000
) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const save = useCallback(
    async (dataToSave: T) => {
      if (!userId || !dataToSave) return;
      setIsSaving(true);
      try {
        await saveFn(dataToSave);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    },
    [userId, saveFn]
  );

  useEffect(() => {
    if (!data) return;

    const handler = setTimeout(() => {
      save(data);
    }, delay);

    return () => clearTimeout(handler);
  }, [data, delay, save]);

  return { isSaving, lastSaved, save };
};
