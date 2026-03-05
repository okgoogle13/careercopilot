/**
 * Local-First Sync Engine — Core Persistence Layer (IndexedDB)
 *
 * Provides a simple key-value interface to IndexedDB for persistent
 * application state. This serves as the foundation for the local-first POC.
 */

const DB_NAME = 'CareerCopilotDB';
const DB_VERSION = 1;
const STORE_NAME = 'sync_store';

export interface SyncItem<T = any> {
  id: string | number;
  data: T;
  timestamp: number;
  synced: boolean;
  version: number;
}

class SyncEngine {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  async set<T>(id: string | number, data: T): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB not initialized');

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const item: SyncItem<T> = {
        id,
        data,
        timestamp: Date.now(),
        synced: false,
        version: Date.now(), // Simplified versioning for POC
      };

      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(id: string | number): Promise<T | null> {
    await this.init();
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB not initialized');

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const item = request.result as SyncItem<T> | undefined;
        resolve(item ? item.data : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(): Promise<T[]> {
    await this.init();
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB not initialized');

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result as SyncItem<T>[];
        resolve(items.map((i) => i.data));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async delete(id: string | number): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB not initialized');

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB not initialized');

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const syncEngine = new SyncEngine();
