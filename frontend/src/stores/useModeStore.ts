/**
 * Kerala Rage Mode Store (Zustand)
 *
 * Manages KrDark ↔ KrLight mode switching with persistence.
 * KrDark: User-facing, emotional, high wallpaper opacity (formerly gallery)
 * KrLight: Clinical tools, restrained, low wallpaper opacity (formerly laboratory)
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
      setMode: (mode: AppMode) => {
        set({
          mode,
          isKrDarkMode: mode === 'KrDark',
          isKrLightMode: mode === 'KrLight',
        });
        // Side effect: Update DOM data attributes for CSS token switching
        document.body.dataset.mode = mode;
        document.documentElement.setAttribute('data-mode', mode);
      },

      // Action: toggleMode
      toggleMode: () => {
        const currentMode = get().mode;
        const newMode: AppMode = currentMode === 'KrDark' ? 'KrLight' : 'KrDark';
        get().setMode(newMode);
      },
    }),
    {
      name: 'mode-storage', // localStorage key
      partialize: (state) => ({ mode: state.mode }), // Only persist mode
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