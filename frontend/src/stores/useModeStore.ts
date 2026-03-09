/**
 * Kerala Rage Mode Store (Zustand)
 *
 * Dark-mode-only store with persistence.
 * KR Solidarity is locked to KrDark across all routes.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppMode = 'KrDark' | 'KrLight';

export interface ModeState {
  // State
  mode: AppMode;

  // Actions
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;

  // Computed properties
  isKrDarkMode: boolean;
  isKrLightMode: boolean;
}

export type ModeContextValue = ReturnType<typeof useMode>;
export type Mode = AppMode;

/**
 * Zustand store for application mode management

 */
export const useModeStore = create<ModeState>()(
  persist(
    (set, get) => ({
      // Initial state
      mode: 'KrDark',
      isKrDarkMode: true,
      isKrLightMode: false,

      // Actions
      setMode: (_mode: AppMode) => {
        const mode: AppMode = 'KrDark';
        set({
          mode,
          isKrDarkMode: true,
          isKrLightMode: false,
        });
        // Side effect: Update DOM data attributes for CSS token switching
        document.body.dataset.mode = mode;
        document.documentElement.setAttribute('data-mode', mode);
      },

      // Action: toggleMode (locked; no-op outside KrDark)
      toggleMode: () => {
        get().setMode('KrDark');
      },
    }),
    {
      name: 'mode-storage', // localStorage key
      partialize: (state) => ({ mode: state.mode }), // Kept for backward compatibility
      merge: (_persistedState, currentState) => ({
        ...currentState,
        mode: 'KrDark',
        isKrDarkMode: true,
        isKrLightMode: false,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }
        state.setMode('KrDark');
      },
    }
  )
);

/**
 * Hook providing access to mode state and actions
 */
export const useMode = () => {
  const { mode, setMode, toggleMode, isKrDarkMode, isKrLightMode } = useModeStore();

  return {
    mode,
    setMode,
    toggleMode,
    isKrDarkMode,
    isKrLightMode,
  };
};
