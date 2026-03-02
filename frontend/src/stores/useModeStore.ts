/**
<<<<<<< HEAD
 * Northcote Curio Mode Store (Zustand)
 *
 * Manages Gallery ↔ Laboratory mode switching with persistence.
 * Gallery: User-facing, emotional, high wallpaper opacity
 * Laboratory: Clinical tools, restrained, low wallpaper opacity
=======
 * Kerala Rage Mode Store (Zustand)
 *
 * Manages KrDark ↔ KrLight mode switching with persistence.
 * KrDark: User-facing, emotional, high wallpaper opacity (formerly gallery)
 * KrLight: Clinical tools, restrained, low wallpaper opacity (formerly laboratory)
>>>>>>> restoration-KR-Rage-Figma-v2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

<<<<<<< HEAD
export type AppMode = 'gallery' | 'laboratory';
=======
export type AppMode = 'KrDark' | 'KrLight';
>>>>>>> restoration-KR-Rage-Figma-v2.0

export interface ModeState {
  // State
  mode: AppMode;

  // Actions
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;

  // Computed properties
<<<<<<< HEAD
  isGalleryMode: boolean;
  isLaboratoryMode: boolean;
=======
  isKrDarkMode: boolean;
  isKrLightMode: boolean;
>>>>>>> restoration-KR-Rage-Figma-v2.0
}

export type ModeContextValue = ReturnType<typeof useMode>;
export type Mode = AppMode;

/**
 * Zustand store for application mode management
<<<<<<< HEAD
 * Persists mode to localStorage via persist middleware
=======
>>>>>>> restoration-KR-Rage-Figma-v2.0
 */
export const useModeStore = create<ModeState>()(
  persist(
    (set, get) => ({
      // Initial state
<<<<<<< HEAD
      mode: 'laboratory',
      isGalleryMode: false,
      isLaboratoryMode: true,
=======
      mode: 'KrDark',
      isKrDarkMode: true,
      isKrLightMode: false,
>>>>>>> restoration-KR-Rage-Figma-v2.0

      // Actions
      setMode: (mode: AppMode) => {
        set({
          mode,
<<<<<<< HEAD
          isGalleryMode: mode === 'gallery',
          isLaboratoryMode: mode === 'laboratory',
=======
          isKrDarkMode: mode === 'KrDark',
          isKrLightMode: mode === 'KrLight',
>>>>>>> restoration-KR-Rage-Figma-v2.0
        });
        // Side effect: Update DOM data attributes for CSS token switching
        document.body.dataset.mode = mode;
        document.documentElement.setAttribute('data-mode', mode);
      },

      // Action: toggleMode
      toggleMode: () => {
        const currentMode = get().mode;
<<<<<<< HEAD
        const newMode: AppMode = currentMode === 'gallery' ? 'laboratory' : 'gallery';
=======
        const newMode: AppMode = currentMode === 'KrDark' ? 'KrLight' : 'KrDark';
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
 * Backward compatible with existing Context API
 *
 * Usage:
 * ```tsx
 * const { mode, setMode, toggleMode, isGalleryMode } = useMode();
 * ```
 */
export const useMode = () => {
  const { mode, setMode, toggleMode, isGalleryMode, isLaboratoryMode } = useModeStore();
=======
 */
export const useMode = () => {
  const { mode, setMode, toggleMode, isKrDarkMode, isKrLightMode } = useModeStore();
>>>>>>> restoration-KR-Rage-Figma-v2.0

  return {
    mode,
    setMode,
    toggleMode,
<<<<<<< HEAD
    isGalleryMode,
    isLaboratoryMode,
  };
};
=======
    isKrDarkMode,
    isKrLightMode,
  };
};
>>>>>>> restoration-KR-Rage-Figma-v2.0
