/**
 * Theme re-export from main application theme
 *
 * This file re-exports the canonical theme from the main application
 * to ensure consistency across the entire codebase.
 *
 * The actual theme implementation is located at:
 * ../../../src/theme/theme.ts
 *
 * @deprecated This duplicate theme file is being removed.
 * Use the main theme from `frontend/src/theme/theme.ts` instead.
 *
 * Migration Note:
 * This file will be removed once the UI package properly references
 * the main application theme. For now, it re-exports to maintain
 * backward compatibility.
 */

// Re-export the main application theme
export { default } from '../../../../src/theme/theme';
export * from '../../../../src/theme/theme';
