import { auth } from '@/config/firebase';
import { API_ENDPOINTS } from '@/config/api';
import type { MasterStatusResponse } from '@/types/masterResume';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  hasMaster: boolean;
  hasCompletedIngestion: boolean;
  isNewUser: boolean;
  userSegment: string | null;
  lastCheckedAt: string | null;
  loadingMaster: boolean;
  setHasMaster: (hasMaster: boolean) => void;
  setHasCompletedIngestion: (hasCompletedIngestion: boolean) => void;
  setIsNewUser: (isNewUser: boolean) => void;
  setUserSegment: (segment: string | null) => void;
  checkMaster: () => Promise<boolean>;
}

const USE_MOCK = import.meta.env?.VITE_USE_MOCK_API !== 'false';

async function getAuthToken(): Promise<string> {
  if (USE_MOCK) {
    return 'dev-token';
  }
  const user = auth.currentUser;
  if (!user) {
    return '';
  }
  return user.getIdToken();
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      hasMaster: false,
      hasCompletedIngestion: false,
      isNewUser: true,
      userSegment: null,
      lastCheckedAt: null,
      loadingMaster: false,
      setHasMaster: (hasMaster: boolean) => {
        if (hasMaster) {
          localStorage.setItem('cc_master_status', 'true');
          localStorage.removeItem('cc_ingestion_skipped');
        } else {
          localStorage.setItem('cc_master_status', 'false');
        }
        set({ hasMaster, hasCompletedIngestion: hasMaster });
      },
      setHasCompletedIngestion: (hasCompletedIngestion: boolean) => {
        if (hasCompletedIngestion) {
          localStorage.removeItem('cc_ingestion_skipped');
        } else {
          localStorage.setItem('cc_ingestion_skipped', 'true');
        }
        set({ hasCompletedIngestion });
      },
      setIsNewUser: (isNewUser: boolean) => set({ isNewUser }),
      setUserSegment: (segment: string | null) => set({ userSegment: segment }),
      checkMaster: async () => {
        set({ loadingMaster: true });
        try {
          if (USE_MOCK) {
            const cached = localStorage.getItem('cc_master_status') === 'true';
            set({
              hasMaster: cached,
              hasCompletedIngestion: cached,
              lastCheckedAt: new Date().toISOString(),
              loadingMaster: false,
            });
            return cached;
          }

          const token = await getAuthToken();
          const response = await fetch(API_ENDPOINTS.masterStatus, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Master status check failed (${response.status})`);
          }

          const data = (await response.json()) as MasterStatusResponse;
          set({
            hasMaster: Boolean(data.has_master),
            hasCompletedIngestion: Boolean(data.has_master),
            lastCheckedAt: new Date().toISOString(),
            loadingMaster: false,
          });
          localStorage.setItem('cc_master_status', data.has_master ? 'true' : 'false');
          return Boolean(data.has_master);
        } catch (e) {
          console.error('[userStore] checkMaster failed:', e);
          const cached = localStorage.getItem('cc_master_status') === 'true';
          set({
            hasMaster: cached,
            hasCompletedIngestion: cached,
            lastCheckedAt: new Date().toISOString(),
            loadingMaster: false,
          });
          return cached;
        }
      },
    }),
    {
      name: 'user-master-store',
      partialize: (state) => ({
        hasMaster: state.hasMaster,
        hasCompletedIngestion: state.hasCompletedIngestion,
        isNewUser: state.isNewUser,
        userSegment: state.userSegment,
        lastCheckedAt: state.lastCheckedAt,
      }),
    }
  )
);
