/**
 * kerala-rage kr-solidarity Mode Store (Zustand)
 *
 * Manages kr-dark ↔ kr-dark mode switching with persistence.
 * kr-dark: User-facing, emotional, high wallpaper opacity
 * kr-dark: Clinical tools, restrained, low wallpaper opacity
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppMode = 'kr-dark' | 'kr-dark';

export interface ModeState {
  // State
  mode: AppMode;

  // Actions
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;

  // Computed properties
  iskr-darkMode: boolean;
  iskr-darkMode: boolean;
}

export type ModeContextValue = ReturnType<typeof useMode>;
export type Mode = AppMode;

/**
 * Zustand store for application mode management
 * Persists mode to localStorage via persist middleware
 */
export const useModeStore = create<ModeState>()(
  persist(
    (set, get) => ({
      // Initial state
      mode: 'kr-dark',
      iskr-darkMode: false,
      iskr-darkMode: true,

      // Actions
      setMode: (mode: AppMode) => {
        set({
          mode,
          iskr-darkMode: mode === 'kr-dark',
          iskr-darkMode: mode === 'kr-dark',
        });
        // Side effect: Update DOM data attributes for CSS token switching
        document.body.dataset.mode = mode;
        document.documentElement.setAttribute('data-mode', mode);
      },

      // Action: toggleMode
      toggleMode: () => {
        const currentMode = get().mode;
        const newMode: AppMode = currentMode === 'kr-dark' ? 'kr-dark' : 'kr-dark';
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
 * Backward compatible with existing Context API
 *
 * Usage:
 * ```tsx
 * const { mode, setMode, toggleMode, iskr-darkMode } = useMode();
 * ```
 */
export const useMode = () => {
  const { mode, setMode, toggleMode, iskr-darkMode, iskr-darkMode } = useModeStore();

  return {
    mode,
    setMode,
    toggleMode,
    iskr-darkMode,
    iskr-darkMode,
  };
};
