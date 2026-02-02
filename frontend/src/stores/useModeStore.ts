/**
 * Northcote Curio Mode Store (Zustand)
 *
 * Manages Gallery ↔ Laboratory mode switching with persistence.
 * Gallery: User-facing, emotional, high wallpaper opacity
 * Laboratory: Clinical tools, restrained, low wallpaper opacity
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppMode = 'gallery' | 'laboratory';

export interface ModeState {
  // State
  mode: AppMode;

  // Actions
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;

  // Computed properties
  isGalleryMode: boolean;
  isLaboratoryMode: boolean;
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
      mode: 'laboratory',

      // Computed: isGalleryMode
      get isGalleryMode() {
        return get().mode === 'gallery';
      },

      // Computed: isLaboratoryMode
      get isLaboratoryMode() {
        return get().mode === 'laboratory';
      },

      // Action: setMode
      setMode: (mode: AppMode) => {
        set({ mode });
        // Side effect: Update DOM data attributes for CSS token switching
        document.body.dataset.mode = mode;
        document.documentElement.setAttribute('data-mode', mode);
      },

      // Action: toggleMode
      toggleMode: () => {
        const currentMode = get().mode;
        const newMode: AppMode = currentMode === 'gallery' ? 'laboratory' : 'gallery';
        get().setMode(newMode);
      },
    }),
    {
      name: 'mode-storage', // localStorage key
      partialize: (state) => ({ mode: state.mode }), // Only persist mode, not computed values
    }
  )
);

/**
 * Hook providing access to mode state and actions
 * Backward compatible with existing Context API
 *
 * Usage:
 * ```tsx
 * const { mode, setMode, toggleMode, isGalleryMode } = useMode();
 * ```
 */
export const useMode = () => {
  const { mode, setMode, toggleMode, isGalleryMode, isLaboratoryMode } = useModeStore();

  return {
    mode,
    setMode,
    toggleMode,
    isGalleryMode,
    isLaboratoryMode,
  };
};
