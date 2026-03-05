import { useState, useEffect, useCallback } from 'react';
import { syncEngine } from '../lib/syncEngine';

/**
 * useLocalSync Hook
 *
 * Manages local-first data state with persistence in IndexedDB.
 * Handles loading, saving, and basic sync status tracking.
 */
export function useLocalSync<T>(key: string, initialData: T[]) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize data from IndexedDB
  useEffect(() => {
    async function initData() {
      try {
        const localData = await syncEngine.get<T[]>(key);
        if (localData) {
          setData(localData);
        } else {
          // If no local data, seed with initialData and persist it
          await syncEngine.set(key, initialData);
          setData(initialData);
        }
      } catch (err) {
        console.error(`[useLocalSync] Failed to init ${key}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, [key, initialData]);

  // Persist and update local state
  const saveData = useCallback(
    async (newData: T[]) => {
      try {
        await syncEngine.set(key, newData);
        setData(newData);
      } catch (err) {
        console.error(`[useLocalSync] Failed to save ${key}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    },
    [key]
  );

  // Add item
  const addItem = useCallback(
    async (item: T) => {
      const newData = [...data, item];
      await saveData(newData);
    },
    [data, saveData]
  );

  // Update item (assumes items have an 'id')
  const updateItem = useCallback(
    async (id: string | number, updates: Partial<T>) => {
      const newData = data.map((item: any) => (item.id === id ? { ...item, ...updates } : item));
      await saveData(newData);
    },
    [data, saveData]
  );

  // Delete item
  const deleteItem = useCallback(
    async (id: string | number) => {
      const newData = data.filter((item: any) => item.id !== id);
      await saveData(newData);
    },
    [data, saveData]
  );

  // Clear all data for this key
  const clearData = useCallback(async () => {
    await saveData([]);
  }, [saveData]);

  return {
    data,
    loading,
    error,
    saveData,
    addItem,
    updateItem,
    deleteItem,
    clearData,
  };
}
