import { useEffect, useState, useCallback } from 'react';

/**
 * Generic auto-save hook that debounces save operations.
 *
 * @param entityId The ID of the currently authenticated user or entity (if null, saving is disabled)
 * @param data The data object to observe for changes
 * @param saveFn The async function that performs the actual persistence
 * @param delay Debounce delay in milliseconds (default: 2000)
 */
export const useAutoSave = <T>(
  entityId: string | undefined | null,
  data: T | null,
  saveFn: (data: T) => Promise<void>,
  delay = 2000
) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const save = useCallback(
    async (dataToSave: T) => {
      if (!entityId || !dataToSave) return;
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
    [entityId, saveFn]
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
