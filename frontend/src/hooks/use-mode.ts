/**
 * Mode Hook Re-export
 *
 * Re-exports Zustand-based mode store for backward compatibility.
 * Previously exported React Context, now uses Zustand with persistence.
 */

export { useMode, useModeStore } from '../stores/useModeStore';
export type { Mode, ModeContextValue, AppMode } from '../stores/useModeStore';
